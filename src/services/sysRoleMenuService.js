const SysRoleMenu = require('../models/sysRoleMenu');
const { Op } = require('sequelize');

const createSysRoleMenu = async (req, res) => {
  const sysRoleMenu = await SysRoleMenu.create({
    ...req.body,
    createTime: new Date(),
    createBy: req.user?.username || 'system'
  });
  return sysRoleMenu;
};

const getAllSysRoleMenus = async (req, res) => {
  const sysRoleMenus = await SysRoleMenu.findAll({
    where: {
      status: '0'
    }
  });
  return sysRoleMenus;
};

const getSysRoleMenus = async (req, res) => {
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
  const modelAttributes = Object.keys(SysRoleMenu.rawAttributes);

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

  const { count, rows: sysRoleMenus } = await SysRoleMenu.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order
  });

  return {
    records: sysRoleMenus,
    page: Number(page),
    limit: Number(limit),
    total: count
  };
};

const getSysRoleMenuById = async (req, res) => {
  const sysRoleMenu = await SysRoleMenu.findOne({
    where: {
      roleId: req.params.id,
      status: '0'
    }
  });
  
  if (!sysRoleMenu) {
    throw new Error('数据不存在');
  }
  return sysRoleMenu
};

const updateSysRoleMenu = async (req, res) => {
  const sysRoleMenu = await SysRoleMenu.findOne({
    where: {
      roleId: req.params.id,
      status: '0'
    }
  });

  if (!sysRoleMenu) {
    throw new Error('数据不存在');
  }

  await sysRoleMenu.update({
    ...req.body,
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });

  return sysRoleMenu;
};

const deleteSysRoleMenu = async (req, res) => {
  const sysRoleMenu = await SysRoleMenu.findOne({
    where: {
      roleId: req.params.id,
      status: '0'
    }
  });

  if (!sysRoleMenu) {
    throw new Error('数据不存在');
  }

  await sysRoleMenu.update({
    status: '2',
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });
};

const deleteSysRoleMenus = async (req, res) => {
  const ids = req.params.id
  const idList = ids.split(',')
  idList.forEach(async (item) => {
    const sysRoleMenu = await SysRoleMenu.findOne({
      where: {
        roleId: item,
        status: '0'
      }
    });

    if (!sysRoleMenu) {
      return;
    }

    await sysRoleMenu.update({
      status: '2',
      updateTime: new Date(),
      updateBy: req.user?.username || 'system'
    });
  })
};

module.exports = { 
  createSysRoleMenu,
  getAllSysRoleMenus, 
  getSysRoleMenus,
  getSysRoleMenuById,
  updateSysRoleMenu,
  deleteSysRoleMenu,
  deleteSysRoleMenus
};

