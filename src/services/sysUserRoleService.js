const SysUserRole = require('../models/sysUserRole');
const { Op } = require('sequelize');

const createSysUserRole = async (req, res) => {
  const sysUserRole = await SysUserRole.create({
    ...req.body,
    createTime: new Date(),
    createBy: req.user?.username || 'system'
  });
  return sysUserRole;
};

const getAllSysUserRoles = async (req, res) => {
  const sysUserRoles = await SysUserRole.findAll({
    where: {
      status: '0'
    }
  });
  return sysUserRoles;
};

const getSysUserRoles = async (req, res) => {
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
  const modelAttributes = Object.keys(SysUserRole.rawAttributes);

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

  const { count, rows: sysUserRoles } = await SysUserRole.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order
  });

  return {
    records: sysUserRoles,
    page: Number(page),
    limit: Number(limit),
    total: count
  };
};

const getSysUserRoleById = async (req, res) => {
  const sysUserRole = await SysUserRole.findOne({
    where: {
      userId: req.params.id,
      status: '0'
    }
  });
  
  if (!sysUserRole) {
    throw new Error('数据不存在');
  }
  return sysUserRole
};

const updateSysUserRole = async (req, res) => {
  const sysUserRole = await SysUserRole.findOne({
    where: {
      userId: req.params.id,
      status: '0'
    }
  });

  if (!sysUserRole) {
    throw new Error('数据不存在');
  }

  await sysUserRole.update({
    ...req.body,
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });

  return sysUserRole;
};

const deleteSysUserRole = async (req, res) => {
  const sysUserRole = await SysUserRole.findOne({
    where: {
      userId: req.params.id,
      status: '0'
    }
  });

  if (!sysUserRole) {
    throw new Error('数据不存在');
  }

  await sysUserRole.update({
    status: '2',
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });
};

const deleteSysUserRoles = async (req, res) => {
  const ids = req.params.id
  const idList = ids.split(',')
  idList.forEach(async (item) => {
    const sysUserRole = await SysUserRole.findOne({
      where: {
        userId: item,
        status: '0'
      }
    });

    if (!sysUserRole) {
      return;
    }

    await sysUserRole.update({
      status: '2',
      updateTime: new Date(),
      updateBy: req.user?.username || 'system'
    });
  })
};

module.exports = { 
  createSysUserRole,
  getAllSysUserRoles, 
  getSysUserRoles,
  getSysUserRoleById,
  updateSysUserRole,
  deleteSysUserRole,
  deleteSysUserRoles
};

