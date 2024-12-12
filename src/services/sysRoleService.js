const SysRole = require('../models/sysRole');
const { Op } = require('sequelize');
const SysRoleMenu = require('../models/sysRoleMenu');
const SysRoleDept = require('../models/sysRoleDept');
const { sequelize } = require('../database');

const createSysRole = async (req, res) => {
  const { menuIds = [] } = req.body;
  const sysRole = await SysRole.create({
    ...req.body,
    createTime: new Date(),
    createBy: req.user?.username || 'system'
  });

  // 创建角色菜单关联
  const roleMenuItems = menuIds.map(menuId => ({
    roleId: sysRole.roleId,
    menuId
  }));
  await SysRoleMenu.bulkCreate(roleMenuItems);
  
  return sysRole;
};

const getAllSysRoles = async (req, res) => {
  const sysRoles = await SysRole.findAll({
    where: {
      status: '0'
    }
  });
  return sysRoles;
};

const getSysRoles = async (req, res) => {
  const { pageNum: pageParam, pageSize: limitParam, sort = 'roleSort,ASC', ...filters } = req.query;

  const page = Number(pageParam) || 1;
  const limit = Number(limitParam) || 10;
  const offset = (page - 1) * limit;

  const [sortField, sortOrder] = sort.split(',');
  const order = [[sortField, sortOrder.toUpperCase()]];

  const whereClause = {
    status: '0'
  };

  // 获取模型定义的所有属性
  const modelAttributes = Object.keys(SysRole.rawAttributes);

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

  const { count, rows: sysRoles } = await SysRole.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order
  });

  return {
    records: sysRoles,
    page: Number(page),
    limit: Number(limit),
    total: count
  };
};

const getSysRoleById = async (req, res) => {
  const sysRole = await SysRole.findOne({
    where: {
      roleId: req.params.id,
      status: '0'
    }
  });
  
  if (!sysRole) {
    throw new Error('数据不存在');
  }

  // 查询该角色关联的所有菜单ID
  const roleMenus = await SysRoleMenu.findAll({
    where: {
      roleId: req.params.id
    }
  });

  // 提取menuId数组
  const roleMenusId = roleMenus.map(item => item.menuId);
  
  // 创建一个新对象,合并原有角色数据和菜单数组
  const roleData = {
    ...sysRole.get({ plain: true }), // 使用get({ plain: true })获取普通对象
    menus: roleMenusId
  };
  
  return roleData;
};

const updateSysRole = async (req, res) => {
  const { menuIds = [] } = req.body;

  const sysRole = await SysRole.findOne({
    where: {
      roleId: req.params.id,
      status: '0'
    }
  });

  if (!sysRole) {
    throw new Error('数据不存在');
  }

  await sysRole.update({
    ...req.body,
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });
  
  // 删除旧的角色菜单关联
  await SysRoleMenu.destroy({
    where: {
      roleId: sysRole.roleId
    }
  });

  // 创建新的角色菜单关联
  const roleMenuItems = menuIds.map(menuId => ({
    roleId: sysRole.roleId,
    menuId
  }));
  await SysRoleMenu.bulkCreate(roleMenuItems);


  return sysRole;
};

const deleteSysRole = async (req, res) => {
  const sysRole = await SysRole.findOne({
    where: {
      roleId: req.params.id,
      status: '0'
    }
  });

  if (!sysRole) {
    throw new Error('数据不存在');
  }

  await sysRole.update({
    status: '2',
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });
};

const deleteSysRoles = async (req, res) => {
  const ids = req.params.id
  const idList = ids.split(',')
  idList.forEach(async (item) => {
    const sysRole = await SysRole.findOne({
      where: {
        roleId: item,
        status: '0'
      }
    });

    if (!sysRole) {
      return;
    }

    await sysRole.update({
      status: '2',
      updateTime: new Date(),
      updateBy: req.user?.username || 'system'
    });
  })
};

const changeUseFlag = async (req, res) => {
  const sysRole = await SysRole.findOne({
    where: {
      roleId: req.body.roleId,
      status: '0'
    }
  });

  if (!sysRole) {
    throw new Error('数据不存在');
  }

  await sysRole.update({
    roleId: req.body.roleId,
    useFlag: req.body.useFlag,
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });
};

const findCheckRoleDept = async (roleId) => {
  const sysRoleDeptList = await SysRoleDept.findAll({
    where: {
      roleId,
      status: '0'
    }
  });

  if (sysRoleDeptList && sysRoleDeptList.length > 0) {
    return sysRoleDeptList.map(item => item.deptId)
  }

  return []
}

const updateDataScope = async (req) => {
  const { deptIds = [], roleId, dataScope } = req.body;

  const sysRole = await SysRole.findOne({
    where: {
      roleId: roleId,
      status: '0'
    }
  });

  if (!sysRole) {
    throw new Error('数据不存在');
  }

  await sysRole.update({
    dataScope,
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });
  
  // 删除旧的关联
  await SysRoleDept.destroy({
    where: {
      roleId: sysRole.roleId
    }
  });

  const roleDeptItems = deptIds.map(deptId => ({
    roleId: sysRole.roleId,
    deptId
  }));
  await SysRoleDept.bulkCreate(roleDeptItems);

  return sysRole;
};

module.exports = { 
  createSysRole,
  getAllSysRoles, 
  getSysRoles,
  getSysRoleById,
  updateSysRole,
  deleteSysRole,
  deleteSysRoles,
  changeUseFlag,
  findCheckRoleDept,
  updateDataScope
};

