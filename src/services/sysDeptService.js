const SysDept = require('../models/sysDept');
const { Op } = require('sequelize');

exports.createSysDept = async (req, res) => {
  try {
    const sysDept = await SysDept.create({
      ...req.body,
      createTime: new Date(),
      createBy: req.user?.username || 'system'  // 假设请求中包含用户信息
    });
    res.created(sysDept, '创建成功');
  } catch (error) {
    res.error(error.message, 400);
  }
};

exports.getAllSysDepts = async (req, res) => {
  try {
    const { deptName: deptName, useFlag: useFlag } = req.query;
    const order = [['orderNum', 'ASC']];
    const whereClause = {
      status: '0',
    }
    if (deptName) {
      whereClause.deptName =  { [Op.like]: `%${deptName}%` };
    }
    if (useFlag) {
      whereClause.useFlag =  { [Op.eq]: useFlag };
    }

    const sysDepts = await SysDept.findAll({
      order,
      where: whereClause,
    });
    res.success(sysDepts, '查询成功');
  } catch (error) {
    res.error(error.message);
  }
};

exports.getSysDepts = async (req, res) => {
  try {
    const { page: pageParam, limit: limitParam, sort = 'createTime,DESC', ...filters } = req.query;

    const page = Number(pageParam) || 1;
    const limit = Number(limitParam) || 10;
    const offset = (page - 1) * limit;

    // 获取排序参数
    const [sortField, sortOrder] = sort.split(',');
    const order = [[sortField, sortOrder.toUpperCase()]];

    // 构建过滤条件
    const whereClause = {
      status: '0'  // 默认只查询未删除的数据
    };

    // 获取模型定义的所有属性
    const modelAttributes = Object.keys(SysDept.rawAttributes);

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

    // 遍历请求中的过滤参数
    Object.keys(filters).forEach(key => {
      // 解析字段名和操作符
      const [fieldName, operator = 'eq'] = key.split('__');
      
      // 检查字段是否在模型中定义
      if (filters[key] && modelAttributes.includes(fieldName)) {
        const value = filters[key];
        
        // 根据操作符构建查询条件
        if (operator === 'like') {
          whereClause[fieldName] = { [operatorMap[operator]]: `%${value}%` };
        } else if (operatorMap[operator]) {
          whereClause[fieldName] = { [operatorMap[operator]]: value };
        } else {
          // 如果没有指定操作符或操作符无效，默认使用等于
          whereClause[fieldName] = value;
        }
      }
    });

    const { count, rows: sysDepts } = await SysDept.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order,
      attributes: [
        'deptId',
        'parentId',
        'ancestors',
        'deptName',
        'orderNum',
        'leader',
        'phone',
        'email',
        'status',
        'createBy',
        'createTime',
        'updateBy',
        'updateTime'
      ]
    });

    res.success({
      records: sysDepts,
      page: Number(page),
      limit: Number(limit),
      total: count
    }, '查询成功');
  } catch (error) {
    res.error(error.message);
  }
};

exports.getSysDeptById = async (req, res) => {
  try {
    const sysDept = await SysDept.findOne({
      where: {
        deptId: req.params.id,
        status: '0'
      }
    });
    
    if (sysDept) {
      res.success(sysDept, '查询成功');
    } else {
      res.notFound('数据不存在');
    }
  } catch (error) {
    res.error(error.message);
  }
};

exports.updateSysDept = async (req, res) => {
  try {
    const sysDept = await SysDept.findOne({
      where: {
        deptId: req.params.id,
        status: '0'
      }
    });

    if (!sysDept) {
      return res.notFound('数据不存在');
    }

    // 更新数据
    await sysDept.update({
      ...req.body,
      updateTime: new Date(),
      updateBy: req.user?.username || 'system'  // 假设请求中包含用户信息
    });

    res.success(sysDept, '更新成功');
  } catch (error) {
    res.error(error.message, 400);
  }
};

exports.deleteSysDept = async (req, res) => {
  try {
    const sysDept = await SysDept.findOne({
      where: {
        deptId: req.params.id,
        status: '0'
      }
    });

    if (!sysDept) {
      return res.notFound('数据不存在');
    }

    // 软删除：更新删除标志而不是真正删除数据
    await sysDept.update({
      status: '2',
      updateTime: new Date(),
      updateBy: req.user?.username || 'system'
    });

    res.success(null, '删除成功');
  } catch (error) {
    res.error(error.message);
  }
};

exports.getExcludeSysDepts = async (req, res) => {
  try {
    const deptId = req.params.id;
    
    const sysDepts = await SysDept.findAll({
      where: {
        deptId: {
          [Op.ne]: deptId // 排除指定的部门ID
        },
        status: '0' // 只查询未删除的数据
      },
      attributes: [
        'deptId',
        'parentId',
        'ancestors',
        'deptName',
        'orderNum',
        'leader',
        'phone',
        'email',
        'status',
        'createBy',
        'createTime',
        'updateBy',
        'updateTime'
      ],
      order: [
        ['orderNum', 'ASC'], // 按显示顺序升序排序
        ['createTime', 'DESC'] // 创建时间降序排序
      ]
    });

    res.success(sysDepts, '查询成功');
  } catch (error) {
    res.error(error.message);
  }
};

exports.getDeptTree = async (req, res) => {
  try {
    // 1. 获取所有未删除的部门数据，按orderNum排序
    const allDepts = await SysDept.findAll({
      where: {
        useFlag: '0',
        status: '0'  // 只查询正常状态的部门
      },
      order: [['orderNum', 'ASC']],
      attributes: [
        'deptId',
        'parentId',
        'ancestors',
        'deptName',
        'orderNum',
        'leader',
        'phone',
        'email',
        'status'
      ]
    });

    // 2. 转换为树形结构的函数
    const buildDeptTree = (depts, parentId = 0) => {
      const tree = [];
      
      for (const dept of depts) {
        if (dept.parentId === parentId) {
          const node = {
            id: dept.deptId,
            label: dept.deptName,
            orderNum: dept.orderNum,
            parent: dept.parentId,
            // 添加其他可能需要的属性
            leader: dept.leader,
            phone: dept.phone,
            email: dept.email,
            status: dept.status,
            // 递归获取子节点
            children: buildDeptTree(depts, dept.deptId)
          };
          
          // 如果没有子节点，不添加children属性
          if (node.children.length === 0) {
            delete node.children;
          }
          
          tree.push(node);
        }
      }
      
      // 按照orderNum排序
      return tree.sort((a, b) => a.orderNum - b.orderNum);
    };

    // 3. 构建树形结构
    const deptTree = buildDeptTree(allDepts);

    res.success(deptTree, '查询成功');
  } catch (error) {
    res.error(error.message);
  }
};