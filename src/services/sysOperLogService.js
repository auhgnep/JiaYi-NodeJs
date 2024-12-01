const SysOperLog = require('../models/sysOperLog');
const { Op, DataTypes } = require('sequelize');
const XLSX = require('xlsx');

const createSysOperLog = async (req, res) => {
  const sysOperLog = await SysOperLog.create({
    ...req.body,
    createTime: new Date(),
    createBy: req.user?.username || 'system'
  });
  return sysOperLog;
};

const getAllSysOperLogs = async (req, res) => {
  const { sort = 'createTime,DESC', ...filters } = req.query;

  const [sortField, sortOrder] = sort.split(',');
  const order = [[sortField, sortOrder.toUpperCase()]];

  const whereClause = {
    status: '0'
  };

  // 获取模型定义的所有属性
  const modelAttributes = Object.keys(SysOperLog.rawAttributes);

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
        whereClause[fieldName] = { [operatorMap[operator]]: `%${value}%` };
      } else if (operatorMap[operator]) {
        whereClause[fieldName] = { [operatorMap[operator]]: value };
      } else {
        whereClause[fieldName] = value;
      }
    }
  });

  const sysOperLogs = await SysOperLog.findAll({
    where: whereClause,
    order
  });
  return sysOperLogs;
};

const getSysOperLogs = async (req, res) => {
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
  const modelAttributes = Object.keys(SysOperLog.rawAttributes);

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
        whereClause[fieldName] = { [operatorMap[operator]]: `%${value}%` };
      } else if (operatorMap[operator]) {
        whereClause[fieldName] = { [operatorMap[operator]]: value };
      } else {
        whereClause[fieldName] = value;
      }
    }
  });

  const { count, rows: sysOperLogs } = await SysOperLog.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order
  });

  return {
    records: sysOperLogs,
    page: Number(page),
    limit: Number(limit),
    total: count
  };
};

const getSysOperLogById = async (req, res) => {
  const sysOperLog = await SysOperLog.findOne({
    where: {
      operId: req.params.id,
      status: '0'
    }
  });
  
  if (!sysOperLog) {
    throw new Error('数据不存在');
  }
  return sysOperLog
};

const updateSysOperLog = async (req, res) => {
  const sysOperLog = await SysOperLog.findOne({
    where: {
      operId: req.params.id,
      status: '0'
    }
  });

  if (!sysOperLog) {
    throw new Error('数据不存在');
  }

  await sysOperLog.update({
    ...req.body,
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });

  return sysOperLog;
};

const deleteSysOperLog = async (req, res) => {
  const sysOperLog = await SysOperLog.findOne({
    where: {
      operId: req.params.id,
      status: '0'
    }
  });

  if (!sysOperLog) {
    throw new Error('数据不存在');
  }

  await sysOperLog.update({
    status: '2',
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });
};

const deleteSysOperLogs = async (req, res) => {
  const ids = req.params.id
  const idList = ids.split(',')
  idList.forEach(async (item) => {
    const sysOperLog = await SysOperLog.findOne({
      where: {
        operId: item,
        status: '0'
      }
    });

    if (!sysOperLog) {
      return;
    }

    await sysOperLog.update({
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

    const attributes = SysOperLog.rawAttributes;

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
        await SysOperLog.create({
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
    throw new Error(`导入失败: ${error.message}`);
  }
};

const exportData = async (req, res) => {
  try {
    // 获取所有记录
    const records = await getAllSysOperLogs(req, res);

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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'sys_oper_log数据');

    // 生成Excel二进制数据
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return {
      buffer: excelBuffer,
      filename: `sys_oper_log_${new Date().getTime()}.xlsx`,
      originalname: `sys_oper_log数据_${new Date().getTime()}.xlsx`
    };

  } catch (error) {
    throw new Error(`导出失败: ${error.message}`);
  }
};

const getImportTemplate = () => {
  const attributes = SysOperLog.rawAttributes;
  
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
  XLSX.utils.book_append_sheet(workbook, worksheet, 'sys_oper_log导入模板');

  // 生成Excel二进制数据
  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  return {
    buffer: excelBuffer,
    filename: 'sys_oper_log_import_template.xlsx',
    originalname: 'sys_oper_log导入模板.xlsx'
  };
};

module.exports = { 
  createSysOperLog,
  getAllSysOperLogs, 
  getSysOperLogs,
  getSysOperLogById,
  updateSysOperLog,
  deleteSysOperLog,
  deleteSysOperLogs,
  importData,
  exportData,
  getImportTemplate
};

