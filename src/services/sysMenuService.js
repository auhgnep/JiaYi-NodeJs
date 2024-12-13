const SysMenu = require('../models/sysMenu');
const { Op } = require('sequelize');
const SysUserRole = require('../models/sysUserRole');
const SysRoleMenu = require('../models/sysRoleMenu');
const { sequelize } = require('../database');

const createSysMenu = async (req, res) => {
  const sysMenu = await SysMenu.create({
    ...req.body,
    createTime: new Date(),
    createBy: req.user?.username || 'system'
  });
  return sysMenu;
};

const getAllSysMenus = async (req, res) => {
  const { sort = 'orderNum,ASC', ...filters } = req.query;

  const [sortField, sortOrder] = sort.split(',');
  const order = [[sortField, sortOrder.toUpperCase()]];

  const whereClause = {
    status: '0'
  };

  // 获取模型定义的所有属性
  const modelAttributes = Object.keys(SysMenu.rawAttributes);

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

  const sysMenus = await SysMenu.findAll({
    where: whereClause,
    order
  });
  return sysMenus;
};

const getSysMenus = async (req, res) => {
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
  const modelAttributes = Object.keys(SysMenu.rawAttributes);

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

  const { count, rows: sysMenus } = await SysMenu.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order
  });

  return {
    records: sysMenus,
    page: Number(page),
    limit: Number(limit),
    total: count
  };
};

const getSysMenuById = async (req, res) => {
  const sysMenu = await SysMenu.findOne({
    where: {
      menuId: req.params.id,
      status: '0'
    }
  });
  
  if (!sysMenu) {
    throw new Error('数据不存在');
  }
  return sysMenu
};

const updateSysMenu = async (req, res) => {
  const sysMenu = await SysMenu.findOne({
    where: {
      menuId: req.params.id,
      status: '0'
    }
  });

  if (!sysMenu) {
    throw new Error('数据不存在');
  }

  await sysMenu.update({
    ...req.body,
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });

  return sysMenu;
};

const deleteSysMenu = async (req, res) => {
  const sysMenu = await SysMenu.findOne({
    where: {
      menuId: req.params.id,
      status: '0'
    }
  });

  if (!sysMenu) {
    throw new Error('数据不存在');
  }

  await sysMenu.update({
    status: '2',
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });
};

const deleteSysMenus = async (req, res) => {
  const ids = req.params.id
  const idList = ids.split(',')
  idList.forEach(async (item) => {
    const sysMenu = await SysMenu.findOne({
      where: {
        menuId: item,
        status: '0'
      }
    });

    if (!sysMenu) {
      return;
    }

    await sysMenu.update({
      status: '2',
      updateTime: new Date(),
      updateBy: req.user?.username || 'system'
    });
  })
};

const getTreeselect = async (userId) => {
  
  const query = `
    SELECT DISTINCT m.*
    FROM sys_menu m
    INNER JOIN sys_role_menu rm ON m.menu_id = rm.menu_id
    INNER JOIN sys_user_role ur ON rm.role_id = ur.role_id
    WHERE ur.user_id = :userId 
    AND m.status = '0'
    ORDER BY m.order_num ASC;
  `;
  let menus = []

  if (userId === 1) {
    menus = await SysMenu.findAll({
      where: {
        status: '0'  // 状态正常的菜单
      },
      order: [
        ['orderNum', 'ASC']  // 按显示顺序排序
      ]
    });
  } else {
    menus = await sequelize.query(query, {
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT,
      model: SysMenu,  // 使用 SysMenu 模型来自动映射字段
      mapToModel: true // 启用字段映射
    });
  }
  
  if (!menus || menus.length === 0) {
    return [];
  }

  // 2. 将菜单数据转换为前端所需的树形结构
  const buildTreeData = (menus, parentId = 0) => {
    const treeData = [];
    
    menus.forEach(menu => {
      if (menu.parentId === parentId) {
        const node = {
          id: menu.menuId,
          label: menu.menuName,
          value: menu.menuId,
          parentId: menu.parentId,
          weight: menu.orderNum,
          // 递归获取子节点
          children: buildTreeData(menus, menu.menuId)
        };

        // 添加额外的节点信息(可选)
        if (menu.icon && menu.icon !== '#') {
          node.icon = menu.icon;
        }
        if (menu.menuType) {
          node.type = menu.menuType;
        }
        if (menu.path) {
          node.path = menu.path;
        }

        // 如果没有子节点，则不显示children属性
        if (node.children.length === 0) {
          delete node.children;
        }

        treeData.push(node);
      }
    });

    return treeData;
  };

  // 3. 构建树形数据，从根节点(parentId='0')开始
  const treeData = buildTreeData(menus);

  return treeData;
};

const getTreeData2 = async (userId) => {
  // 1. 查询所有状态正常的菜单
  const menus = await SysMenu.findAll({
    where: {
      status: '0'  // 状态正常的菜单
    },
    order: [
      ['orderNum', 'ASC']  // 按显示顺序排序
    ]
  });

  // 2. 将菜单数据转换为前端所需的树形结构
  const buildTreeData = (menus, parentId = 0) => {
    const treeData = [];
    
    menus.forEach(menu => {
      if (menu.parentId === parentId) {
        const node = {
          menuId: menu.menuId,
          menuName: menu.menuName,
          parentId: menu.parentId,
          orderNum: menu.orderNum,
          menuType: menu.menuType,
          icon: menu.icon,
          path: menu.path,
          query: menu.query,
          routeName: menu.routeName,
          isFrame: menu.isFrame,
          isCache: menu.isCache,
          visible: menu.visible,
          component: menu.component,
          // 递归获取子节点
          children: buildTreeData(menus, menu.menuId)
        };

        // 如果没有子节点，则不显示children属性
        if (node.children.length === 0) {
          delete node.children;
        }

        treeData.push(node);
      }
    });

    return treeData;
  };

  // 3. 构建树形数据，从根节点(parentId='0')开始
  const treeData = buildTreeData(menus);

  return treeData;
};

const getTreeData = async (userId) => {
  let menus = []

  const query = `
    SELECT DISTINCT m.*
    FROM sys_menu m
    INNER JOIN sys_role_menu rm ON m.menu_id = rm.menu_id
    INNER JOIN sys_user_role ur ON rm.role_id = ur.role_id
    WHERE ur.user_id = :userId 
    AND m.status = '0'
    ORDER BY m.order_num ASC;
  `;

  if (userId === 1) {
    menus = await SysMenu.findAll({
      where: {
        status: '0'  // 状态正常的菜单
      },
      order: [
        ['orderNum', 'ASC']  // 按显示顺序排序
      ]
    });
  } else {
    menus = await sequelize.query(query, {
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT,
      model: SysMenu,  // 使用 SysMenu 模型来自动映射字段
      mapToModel: true // 启用字段映射
    });
  }

  if (!menus || menus.length === 0) {
    return [];
  }

  // 2. 将查询结果转换为树形结构
  const buildTreeData = (items, parentId = 0) => {
    const treeData = []
    
    items.forEach(menu => {
      if (menu.parentId === parentId) {  // 注意：这里使用下划线形式的 parent_id
        const node = {
          menuId: menu.menuId,           // 转换字段名从下划线到驼峰
          menuName: menu.menuName,
          parentId: menu.parentId,
          orderNum: menu.orderNum,
          menuType: menu.menuType,
          icon: menu.icon,
          path: menu.path,
          query: menu.query,
          routeName: menu.routeName,
          isFrame: menu.isFrame,
          isCache: menu.isCache,
          visible: menu.visible,
          component: menu.component,
          children: buildTreeData(items, menu.menuId)
        };

        // 如果没有子节点，则不显示children属性
        if (node.children.length === 0) {
          delete node.children;
        }

        treeData.push(node);
      }
    });

    // 根据 orderNum 排序
    treeData.sort((a, b) => a.orderNum - b.orderNum);

    return treeData;
  };

  // 3. 构建树形数据，从根节点(parentId='0')开始
  const treeData = buildTreeData(menus);

  return treeData;
};

module.exports = { 
  createSysMenu,
  getAllSysMenus, 
  getSysMenus,
  getSysMenuById,
  updateSysMenu,
  deleteSysMenu,
  deleteSysMenus,
  getTreeselect,
  getTreeData
};

