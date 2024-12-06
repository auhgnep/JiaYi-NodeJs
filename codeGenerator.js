const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

class CodeGenerator {
  constructor(dbConfig) {
    this.dbConfig = dbConfig;
  }

  async connect() {
    this.connection = await mysql.createConnection(this.dbConfig);
  }

  async close() {
    if (this.connection) {
      await this.connection.end();
    }
  }

  async getTableColumns(tableName) {
    const [columns] = await this.connection.execute(
      `SHOW FULL COLUMNS FROM ${tableName}`
    );
    return columns;
  }

  toCamelCase(str) {
    return str.toLowerCase().replace(/_([a-z])/g, (g) => g[1].toUpperCase());
  }

  toPascalCase(str) {
    const camel = this.toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  }

  convertToSequelizeType(mysqlType) {
    const typeMapping = {
      'tinyint': 'DataTypes.INTEGER',
      'smallint': 'DataTypes.INTEGER',
      'mediumint': 'DataTypes.INTEGER',
      'int': 'DataTypes.INTEGER',
      'bigint': 'DataTypes.BIGINT',
      'float': 'DataTypes.FLOAT',
      'double': 'DataTypes.DOUBLE',
      'decimal': 'DataTypes.DECIMAL',
      'char': 'DataTypes.CHAR',
      'varchar': 'DataTypes.STRING',
      'tinytext': 'DataTypes.TEXT',
      'text': 'DataTypes.TEXT',
      'mediumtext': 'DataTypes.TEXT',
      'longtext': 'DataTypes.TEXT',
      'date': 'DataTypes.DATEONLY',
      'datetime': 'DataTypes.DATE',
      'timestamp': 'DataTypes.DATE',
      'time': 'DataTypes.TIME',
      'year': 'DataTypes.INTEGER',
      'boolean': 'DataTypes.BOOLEAN',
      'bool': 'DataTypes.BOOLEAN',
      'json': 'DataTypes.JSON'
    };

    const match = mysqlType.match(/^(\w+)(?:\((\d+)\))?/);
    if (!match) return 'DataTypes.STRING';

    const type = match[1].toLowerCase();
    const length = match[2];

    let sequelizeType = typeMapping[type] || 'DataTypes.STRING';

    if (length && (type === 'varchar' || type === 'char')) {
      sequelizeType = `DataTypes.STRING(${length})`;
    }

    return sequelizeType;
  }

  generateModelFields(columns) {
    return columns.map(column => {
      const field = {
        name: this.toCamelCase(column.Field),
        field: column.Field,
        type: this.convertToSequelizeType(column.Type),
        allowNull: column.Null === 'YES',
        primaryKey: column.Key === 'PRI',
        defaultValue: column.Default,
        comment: column.Comment || undefined
      };

      if (column.Extra === 'auto_increment') {
        field.autoIncrement = true;
      } else {
        // 如果是主键且类型是字符串，添加UUID默认值
        if (field.primaryKey && field.type.includes('STRING')) {
          field.defaultValue = '() => uuidv4()';
        }
      }

      return field;
    });
  }

  generateModelContent(tableName, modelName, fields) {
    let fieldDefinitions = fields.map(field => {
      let definition = `    ${field.name}: {
      type: ${field.type},
      field: '${field.field}'`;  // 添加field映射

      if (field.primaryKey) definition += ',\n      primaryKey: true';
      if (!field.allowNull) definition += ',\n      allowNull: false';
      if (field.autoIncrement) definition += ',\n      autoIncrement: true';
      if (field.defaultValue !== null) {
        if (field.defaultValue === 'CURRENT_TIMESTAMP') {
          definition += ',\n      defaultValue: Sequelize.literal(\'CURRENT_TIMESTAMP\')';
        } else if (field.defaultValue === '() => uuidv4()') {
          definition += ',\n      defaultValue: () => uuidv4()';
        } else {
          definition += `,\n      defaultValue: ${JSON.stringify(field.defaultValue)}`;
        }
      }
      if (field.comment) definition += `,\n      comment: ${JSON.stringify(field.comment)}`;

      definition += '\n    }';
      return definition;
    }).join(',\n\n');

    return `const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database');
const { v4: uuidv4 } = require('uuid');

const ${modelName} = sequelize.define('${tableName}', {
${fieldDefinitions}
}, {
  tableName: '${tableName}',
  timestamps: false,
  underscored: true,  // 启用字段映射
  freezeTableName: true  // 固定表名
});

module.exports = ${modelName};`;
  }

  generateServiceContent(tableName, modelName, servicePrefix, primaryKey) {
    return `const ${modelName} = require('../models/${servicePrefix}');
const { Op, DataTypes } = require('sequelize');
const XLSX = require('xlsx');

const create${modelName} = async (req, res) => {
  const ${servicePrefix} = await ${modelName}.create({
    ...req.body,
    createTime: new Date(),
    createBy: req.user?.username || 'system'
  });
  return ${servicePrefix};
};

const getAll${modelName}s = async (req, res) => {
  const { sort = 'createTime,DESC', ...filters } = req.query;

  const [sortField, sortOrder] = sort.split(',');
  const order = [[sortField, sortOrder.toUpperCase()]];

  const whereClause = {
    status: '0'
  };

  // 获取模型定义的所有属性
  const modelAttributes = Object.keys(${modelName}.rawAttributes);

  // 定义操作符映射
  const operatorMap = {
    'like': Op.like,
    'eq': Op.eq,
    'ne': Op.ne,
    'gt': Op.gt,
    'lt': Op.lt,
    'ge': Op.gte,
    'le': Op.lte
  };

  Object.keys(filters).forEach(key => {
    const [fieldName, operator = 'eq'] = key.split('__');
    
    if (filters[key] && modelAttributes.includes(fieldName)) {
      const value = filters[key];
      
      if (operator === 'like') {
        whereClause[fieldName] = { [operatorMap[operator]]: \`%\${value}%\` };
      } else if (operatorMap[operator]) {
        whereClause[fieldName] = { [operatorMap[operator]]: value };
      } else {
        whereClause[fieldName] = value;
      }
    }
  });

  const ${servicePrefix}s = await ${modelName}.findAll({
    where: whereClause,
    order
  });
  return ${servicePrefix}s;
};

const get${modelName}s = async (req, res) => {
  const { pageNum: pageParam, pageSize: limitParam, sort = 'createTime,DESC', ...filters } = req.query;

  const page = Number(pageParam) || 1;
  const limit = Number(limitParam) || 10;
  const offset = (page - 1) * limit;

  const [sortField, sortOrder] = sort.split(',');
  const order = [[sortField, sortOrder.toUpperCase()]];

  const whereClause = {
    status: '0'
  };

  // 获取模型定义的所有属性
  const modelAttributes = Object.keys(${modelName}.rawAttributes);

  // 定义操作符映射
  const operatorMap = {
    'like': Op.like,
    'eq': Op.eq,
    'ne': Op.ne,
    'gt': Op.gt,
    'lt': Op.lt,
    'ge': Op.gte,
    'le': Op.lte
  };

  Object.keys(filters).forEach(key => {
    const [fieldName, operator = 'eq'] = key.split('__');
    
    if (filters[key] && modelAttributes.includes(fieldName)) {
      const value = filters[key];
      
      if (operator === 'like') {
        whereClause[fieldName] = { [operatorMap[operator]]: \`%\${value}%\` };
      } else if (operatorMap[operator]) {
        whereClause[fieldName] = { [operatorMap[operator]]: value };
      } else {
        whereClause[fieldName] = value;
      }
    }
  });

  const { count, rows: ${servicePrefix}s } = await ${modelName}.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order
  });

  return {
    records: ${servicePrefix}s,
    page: Number(page),
    limit: Number(limit),
    total: count
  };
};

const get${modelName}ById = async (req, res) => {
  const ${servicePrefix} = await ${modelName}.findOne({
    where: {
      ${primaryKey}: req.params.id,
      status: '0'
    }
  });
  
  if (!${servicePrefix}) {
    throw new Error('数据不存在');
  }
  return ${servicePrefix}
};

const update${modelName} = async (req, res) => {
  const ${servicePrefix} = await ${modelName}.findOne({
    where: {
      ${primaryKey}: req.params.id,
      status: '0'
    }
  });

  if (!${servicePrefix}) {
    throw new Error('数据不存在');
  }

  await ${servicePrefix}.update({
    ...req.body,
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });

  return ${servicePrefix};
};

const delete${modelName} = async (req, res) => {
  const ${servicePrefix} = await ${modelName}.findOne({
    where: {
      ${primaryKey}: req.params.id,
      status: '0'
    }
  });

  if (!${servicePrefix}) {
    throw new Error('数据不存在');
  }

  await ${servicePrefix}.update({
    status: '2',
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });
};

const delete${modelName}s = async (req, res) => {
  const ids = req.params.id
  const idList = ids.split(',')
  idList.forEach(async (item) => {
    const ${servicePrefix} = await ${modelName}.findOne({
      where: {
        ${primaryKey}: item,
        status: '0'
      }
    });

    if (!${servicePrefix}) {
      return;
    }

    await ${servicePrefix}.update({
      status: '2',
      updateTime: new Date(),
      updateBy: req.user?.username || 'system'
    });
  })
};

const importData = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      throw new Error('请上传文件');
    }

    // 读取Excel文件
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // 数据验证结果
    const results = {
      totalCount: jsonData.length,
      successCount: 0,
      failureCount: 0,
      failureMessages: []
    };

    const attributes = ${modelName}.rawAttributes;

    const fieldMapping = Object.entries(attributes).reduce((acc, [fieldName, attr]) => {
      // 排除系统字段
      const excludeFields = ['createBy', 'createTime', 'updateBy', 'updateTime', 'delFlag', 'status'];
      if (!excludeFields.includes(fieldName)) {
        // 使用注释或字段名作为中文标题
        const title = attr.comment || attr.field;
        acc[title] = fieldName;
      }
      return acc;
    }, {});

    // 处理每一行数据
    for (const row of jsonData) {
      try {
        const data = {};
        for (const [cnField, value] of Object.entries(row)) {
          const englishField = fieldMapping[cnField];
          if (englishField) {
            data[englishField] = String(value).trim();
          }
        }

        // 创建记录
        await ${modelName}.create({
          ...data,
          status: '0',
          createBy: req.user?.username || 'system',
          createTime: new Date()
        });

        results.successCount++;
      } catch (error) {
        results.failureCount++;
        results.failureMessages.push({
          row: row.field1 || '未知',
          message: error.message
        });
      }
    }

    return results;

  } catch (error) {
    throw new Error(\`导入失败: \${error.message}\`);
  }
};

const exportData = async (req, res) => {
  try {
    // 获取所有记录
    const records = await getAll${modelName}s(req, res);

    const attributes = SysOperLog.rawAttributes;
    // 转换数据格式
    const exportData = records.map(record => {
      const data = record.get({ plain: true });

      // 使用字段定义创建导出数据
      return Object.entries(attributes).reduce((acc, [fieldName, attr]) => {
        const title = attr.comment || attr.field;
        // 特殊处理状态字段
        if (fieldName === 'status') {
          acc[title] = data[fieldName] === '0' ? '正常' : '停用';
        } 
        // 特殊处理日期字段
        else if (attr.type instanceof DataTypes.DATE && data[fieldName]) {
          acc[title] = data[fieldName];
        } 
        else {
          acc[title] = data[fieldName];
        }
        return acc;
      }, {});
    });

    // 创建工作簿和工作表
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '${tableName}数据');

    // 生成Excel二进制数据
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return {
      buffer: excelBuffer,
      filename: \`${tableName}_\${new Date().getTime()}.xlsx\`,
      originalname: \`${tableName}数据_\${new Date().getTime()}.xlsx\`
    };

  } catch (error) {
    throw new Error(\`导出失败: \${error.message}\`);
  }
};

const getImportTemplate = () => {
  const attributes = ${modelName}.rawAttributes;
  
  // 排除系统字段
  const excludeFields = ['createBy', 'createTime', 'updateBy', 'updateTime', 'delFlag', 'status'];
  
  // 从字段定义中提取字段名和注释，创建模板数据
  const templateData = [{
    ...Object.entries(attributes)
      .filter(([fieldName]) => !excludeFields.includes(fieldName))
      .reduce((acc, [fieldName, attr]) => {
        // 使用 field（数据库字段名）作为中文标题，如果有注释则使用注释
        const title = attr.comment || attr.field;
        // 根据字段类型生成示例值
        let exampleValue = '';
        if (attr.type instanceof DataTypes.STRING) {
          exampleValue = '示例' + (attr.comment || attr.field);
        } else if (attr.type instanceof DataTypes.INTEGER) {
          exampleValue = '0';
        } else if (attr.type instanceof DataTypes.DATE) {
          exampleValue = '2024-01-01 00:00:00';
        } else if (attr.type instanceof DataTypes.BOOLEAN) {
          exampleValue = 'true';
        }
        acc[title] = exampleValue;
        return acc;
      }, {})
  }];

  // 创建工作簿和工作表
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '${tableName}导入模板');

  // 生成Excel二进制数据
  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  return {
    buffer: excelBuffer,
    filename: '${tableName}_import_template.xlsx',
    originalname: '${tableName}导入模板.xlsx'
  };
};

module.exports = { 
  create${modelName},
  getAll${modelName}s, 
  get${modelName}s,
  get${modelName}ById,
  update${modelName},
  delete${modelName},
  delete${modelName}s,
  importData,
  exportData,
  getImportTemplate
};

`;
  }

  generateControllerContent(tableName, modelName, servicePrefix) {
    return `const express = require('express');
const router = express.Router();
const service = require('../services/${servicePrefix}Service');

const routePrefix = '${servicePrefix}';

router.get('/list', async(req, res) => {
  try {
    const result = await service.getAll${modelName}s(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/page', async(req, res) => {
  try {
    const result = await service.get${modelName}s(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.post('/', async(req, res) => {
  try {
    const result = await service.create${modelName}(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.patch('/update/:id', async(req, res) => {
  try {
    const result = await service.update${modelName}(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/get/:id', async(req, res) => {
  try {
    const result = await service.get${modelName}ById(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/remove/:id', async(req, res) => {
  try {
    const result = await service.delete${modelName}(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/removeBatch/:id', async(req, res) => {
  try {
    const result = await service.delete${modelName}s(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.post('/importData', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      throw new Error('请选择要上传的文件');
    }

    const file = req.files.file;
    
    // 验证文件类型
    if (!file.name.match(/\\.(xlsx|xls)$/i)) {
      throw new Error('只允许上传 Excel 文件');
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('文件大小不能超过 5MB');
    }

    req.file = {
      buffer: file.data,
      originalname: file.name,
      mimetype: file.mimetype,
      size: file.size
    };

    const result = await service.importData(req);
    res.success(result, '导入成功');
  } catch (error) {
    res.error(error.message);
  }
});

router.get('/export', async (req, res) => {
  try {
    const result = await service.exportData(req);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const encodedFilename = encodeURIComponent(result.originalname || result.filename);
    res.setHeader('Content-Disposition', \`attachment; filename="\${result.filename}"; filename*=UTF-8''\${encodedFilename}\`);
    
    res.send(result.buffer);
  } catch (error) {
    res.status(400).json({
      code: 400,
      msg: error.message
    });
  }
});

router.get('/importTemplate', async (req, res) => {
  try {
    const result = service.getImportTemplate();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const encodedFilename = encodeURIComponent(result.filename);
    res.setHeader('Content-Disposition', \`attachment; filename="\${result.filename}"; filename*=UTF-8''\${encodedFilename}\`);
    
    res.send(result.buffer);
  } catch (error) {
    res.status(400).json({
      code: 400,
      msg: error.message
    });
  }
});

module.exports = { router, routePrefix };`;
  }

  async generateFiles(tableName, outputPath) {
    try {
      await this.connect();

      const columns = await this.getTableColumns(tableName);
      
      const modelName = this.toPascalCase(tableName);
      const servicePrefix = this.toCamelCase(tableName);

      const dirs = ['models', 'services', 'controllers'].map(dir => 
        path.join(outputPath, dir)
      );
      
      dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });

      const fields = this.generateModelFields(columns);
      const primaryKey = fields.filter(item => item.primaryKey).map(item => item.name)[0]

      fs.writeFileSync(
        path.join(outputPath, 'models', `${servicePrefix}.js`),
        this.generateModelContent(tableName, modelName, fields)
      );

      fs.writeFileSync(
        path.join(outputPath, 'services', `${servicePrefix}Service.js`),
        this.generateServiceContent(tableName, modelName, servicePrefix, primaryKey)
      );

      fs.writeFileSync(
        path.join(outputPath, 'controllers', `${servicePrefix}Controller.js`),
        this.generateControllerContent(tableName, modelName, servicePrefix)
      );

      console.log(`Generated files for ${tableName} successfully!`);
    } catch (error) {
      console.error('Error generating files:', error);
      throw error;
    } finally {
      await this.close();
    }
  }
}

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'jiayi'
};

const DATA_TABLE_NAME = 'sys_oper_log'
const OUT_PATH = './src'

const generator = new CodeGenerator(dbConfig);
generator.generateFiles(DATA_TABLE_NAME, OUT_PATH)
  .then(() => console.log('Code generation completed!'))
  .catch(console.error);

module.exports = CodeGenerator;