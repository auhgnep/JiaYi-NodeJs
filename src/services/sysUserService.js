const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const XLSX = require('xlsx');
const SysUser = require('../models/sysUser');
const SysPost = require('../models/sysPost');
const SysRole = require('../models/sysRole');
const SysUserPost = require('../models/sysUserPost');
const SysUserRole = require('../models/sysUserRole');
const SysRoleMenu = require('../models/sysRoleMenu');
const SysMenu = require('../models/sysMenu');
const SysDept = require('../models/sysDept');

const commonFileService = require('./commonFile');

const createSysUser = async (req, res) => {
  const userData = { ...req.body };
    
  // 如果提供了密码，进行加密
  if (userData.password) {
    const saltRounds = 10;
    userData.password = await bcrypt.hash(userData.password, saltRounds);
  }

  const sysUser = await SysUser.create({
    ...userData,
    createTime: new Date(),
    createBy: req.user?.username || 'system'
  });

  const postIds = userData.postIds || []
  const userPosts = postIds.map(postId => ({
    userId: sysUser.userId,
    postId
  }));
  await SysUserPost.bulkCreate(userPosts);

  const roleIds = userData.roleIds || []
  const userRoles = roleIds.map(roleId => ({
    userId: sysUser.userId,
    roleId
  }));
  await SysUserRole.bulkCreate(userRoles);

  const userWithoutPassword = sysUser.toJSON();
  delete userWithoutPassword.password;
  return userWithoutPassword;
};

const getAllSysUsers = async (req, res) => {
  const { sort = 'createTime,DESC', ...filters } = req.query;

  const [sortField, sortOrder] = sort.split(',');
  const order = [[sortField, sortOrder.toUpperCase()]];

  const whereClause = {
    status: '0'
  };

  // 获取模型定义的所有属性
  const modelAttributes = Object.keys(SysUser.rawAttributes);

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

  const sysUsers = await SysUser.findAll({
    where: whereClause,
    order
  });
  return sysUsers;
};

async function getChildDeptIds(deptId) {
  const dept = await SysDept.findOne({
    where: {
      deptId
    }
  });

  if (!dept) {
    return [];
  }

  const childDepts = await SysDept.findAll({
    where: {
      parentId: deptId
    }
  });

  const childDeptIds = await Promise.all(childDepts.map(async (childDept) => {
    const childIds = await getChildDeptIds(childDept.deptId);
    return [childDept.deptId, ...childIds];
  }));

  return [deptId, ...childDeptIds.flat()];
}

const getSysUsers = async (req, res) => {
  const { deptId, pageNum: pageParam, pageSize: limitParam, sort = 'createTime,ASC', ...filters } = req.query;
  const isAllocated = req.query.isAllocated || '0';
  const isUnAllocated = req.query.isUnAllocated || '0';
  const roleId = req.query.roleId;

  const page = Number(pageParam) || 1;
  const limit = Number(limitParam) || 10;
  const offset = (page - 1) * limit;

  const [sortField, sortOrder] = sort.split(',');
  const order = [[sortField, sortOrder.toUpperCase()]];

  const whereClause = {
    status: '0'
  };

  if (isAllocated === '1' && roleId) {
    const sysUserRoles = await SysUserRole.findAll({
      where: {
        roleId
      }
    });

    let userIdList = sysUserRoles.map(item => item.userId)
    whereClause.userId = { 
      [Op.in]: userIdList 
    };
  } else if (isUnAllocated === '1' && roleId) {
    const sysUserRoles = await SysUserRole.findAll({
      where: {
        roleId
      }
    });

    let userIdList = sysUserRoles.map(item => item.userId)
    whereClause.userId = { 
      [Op.notIn]: userIdList 
    };
  }

  // 获取模型定义的所有属性
  const modelAttributes = Object.keys(SysUser.rawAttributes);

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

  if (deptId) {
    const deptIds = await getChildDeptIds(deptId);
    whereClause.deptId = { [Op.in]: deptIds };
  }

  const { count, rows: sysUsers } = await SysUser.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order
  });

  const deptIds = sysUsers.map(user => user.deptId);
  const depts = await SysDept.findAll({
    where: {
      deptId: {
        [Op.in]: deptIds
      }
    }
  });

  const deptMap = new Map(depts.map(dept => [dept.deptId, dept]));
  const sysUsersWithDepts = sysUsers.map(user => ({
    ...user.get({ plain: true }),
    dept: deptMap.get(user.deptId)
  }));

  return {
    records: sysUsersWithDepts,
    page: Number(page),
    limit: Number(limit),
    total: count
  };
};

const getSysUserById = async (userId) => {
  const sysUser = await SysUser.findOne({
    where: {
      userId,
      status: '0'
    }
  });
  
  if (!sysUser) {
    throw new Error('数据不存在');
  }
  
  const sysUserRoles = await SysUserRole.findAll({
    where: {
      userId
    }
  });
  const sysUserPosts = await SysUserPost.findAll({
    where: {
      userId
    }
  });

  const dept = await SysDept.findOne({
    where: {
      deptId: sysUser.deptId
    }
  })

  let roleIds = []
  let postIds = []

  let roleList = []
  let postList = []
  let roleNames = ''
  let postNames = ''
  if (sysUserRoles && sysUserRoles.length > 0) {
    roleIds = sysUserRoles.map(item => item.roleId);
    roleList = await SysRole.findAll({
      where: {
        roleId: {
          [Op.in]: roleIds
        }
      }
    });
  }
  if (roleList && roleList.length > 0) {
    roleNames = roleList.map(item => item.roleName).join(',')
  }

  if (sysUserPosts && sysUserPosts.length > 0) {
    postIds = sysUserPosts.map(item => item.postId);
    postList = await SysPost.findAll({
      where: {
        postId: {
          [Op.in]: postIds
        }
      }
    });
  }
  if (postList && postList.length > 0) {
    postNames = postList.map(item => item.postName).join(',')
  }

  const userData = {
    ...sysUser.get({ plain: true }), // 使用get({ plain: true })获取普通对象
    roleIds,
    postIds,
    dept,
    roles: roleList,
    posts: postList,
    roleGroup: roleNames,
    postGroup: postNames
  };

  return userData
};

const updateSysUser = async (req, res) => {
  const sysUser = await SysUser.findOne({
    where: {
      userId: req.params.id,
      status: '0'
    }
  });

  if (!sysUser) {
    throw new Error('数据不存在');
  }

  const updateData = { ...req.body };

  // 如果更新包含密码字段，进行加密
  if (updateData.password) {
    const saltRounds = 10;
    updateData.password = await bcrypt.hash(updateData.password, saltRounds);
  } else {
    delete updateData.password;
  }

  // 岗位
  await SysUserPost.destroy({
    where: {
      userId: updateData.userId
    }
  });

  const postIds = updateData.postIds || []
  const userPosts = postIds.map(postId => ({
    userId: updateData.userId,
    postId
  }));
  await SysUserPost.bulkCreate(userPosts);

  // 角色
  await SysUserRole.destroy({
    where: {
      userId: updateData.userId
    }
  });

  const roleIds = updateData.roleIds || []
  const userRoles = roleIds.map(roleId => ({
    userId: updateData.userId,
    roleId
  }));
  await SysUserRole.bulkCreate(userRoles);

  await sysUser.update({
    ...updateData,
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });

  // 返回数据时排除密码字段
  const userWithoutPassword = sysUser.toJSON();
  delete userWithoutPassword.password;
  return userWithoutPassword;
};

const mergeSysUser = async (req, res) => {
  const sysUser = await SysUser.findOne({
    where: {
      userId: req.params.id,
      status: '0'
    }
  });

  if (!sysUser) {
    throw new Error('数据不存在');
  }

  const updateData = { ...req.body };

  // 如果更新包含密码字段，进行加密
  if (updateData.password) {
    const saltRounds = 10;
    updateData.password = await bcrypt.hash(updateData.password, saltRounds);
  }

  await sysUser.update({
    ...updateData,
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });

  // 返回数据时排除密码字段
  const userWithoutPassword = sysUser.toJSON();
  delete userWithoutPassword.password;
  return userWithoutPassword;
};

const deleteSysUser = async (req, res) => {
  const sysUser = await SysUser.findOne({
    where: {
      userId: req.params.id,
      status: '0'
    }
  });

  if (!sysUser) {
    throw new Error('数据不存在');
  }

  await sysUser.update({
    status: '2',
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });
};

const deleteSysUsers = async (req, res) => {
  const ids = req.params.id
  const idList = ids.split(',')
  idList.forEach(async (item) => {
    const sysUser = await SysUser.findOne({
      where: {
        userId: item,
        status: '0'
      }
    });

    if (!sysUser) {
      return;
    }

    await sysUser.update({
      status: '2',
      updateTime: new Date(),
      updateBy: req.user?.username || 'system'
    });
  })
};

const getUserAddInfo = async (userId) => {
  const sysPosts = await SysPost.findAll({
    where: {
      status: '0'
    }
  });

  let sysRoles = [];
  
  if (userId === 1) {
    // 超级管理员直接查询所有正常状态的角色
    sysRoles = await SysRole.findAll({
      where: {
        status: '0'
      }
    });
  } else {
    // 非超级管理员需要先查询用户角色关联
    const sysUserRoles = await SysUserRole.findAll({
      where: {
        userId
      }
    });

    const roleIds = sysUserRoles.map(item => item.roleId);
    sysRoles = await SysRole.findAll({
      where: {
        status: '0',
        roleId: {
          [Op.in]: roleIds
        }
      }
    });
  }

  const result = {
    posts: sysPosts,
    roles: sysRoles
  }
  return result
};

const getInfo = async (userId = '1') => {
  const user = await getSysUserById(userId);
  if (user) {
    user.password = null
  }

  const roleIds = user.roleIds;
  let roles = [];
  let permissions = [];
  
  // 1. 查询用户角色（不管是否是管理员都需要查询）
  if (roleIds && roleIds.length > 0) {
    const sysRoles = await SysRole.findAll({
      where: {
        roleId: {
          [Op.in]: roleIds
        },
        status: '0' // 只查询正常状态的角色
      }
    });
    
    // 提取roleKey字段到数组
    roles = sysRoles.map(role => role.roleKey);
  }

  // 2. 处理权限信息
  if (userId === 1) {
    // 管理员拥有所有权限
    permissions = ["*:*:*"];
  } else if (roleIds && roleIds.length > 0) {
    // 查询角色关联的菜单ID
    const roleMenus = await SysRoleMenu.findAll({
      where: {
        roleId: {
          [Op.in]: roleIds
        }
      }
    });

    if (roleMenus && roleMenus.length > 0) {
      const menuIds = roleMenus.map(rm => rm.menuId);

      // 查询对应的菜单权限标识
      const menus = await SysMenu.findAll({
        where: {
          menuId: {
            [Op.in]: menuIds
          },
          status: '0', // 只查询正常状态的菜单
          perms: {
            [Op.ne]: null, // perms不为空
            [Op.ne]: '' // perms不为空字符串
          }
        }
      });

      // 提取权限标识并去重
      permissions = [...new Set(
        menus
          .map(menu => menu.perms)
          .filter(perm => perm) // 过滤掉null或空字符串
          .flatMap(perm => perm.split(',')) // 处理可能的多个权限标识（以逗号分隔）
      )];
    }
  }

  return {
    user,
    permissions,
    roles
  };
};

const updatePwd = async (userId, data) => {
  const sysUser = await SysUser.findOne({
    where: {
      userId: userId,
      status: '0'
    }
  });

  if (!sysUser) {
    throw new Error('数据不存在');
  }

  if (!data.oldPassword) { 
    throw new Error('旧密码不能为空');
  }

  if (!data.newPassword) { 
    throw new Error('新密码不能为空');
  }

  const saltRounds = 10;
  const isMatch = await bcrypt.compare(data.oldPassword, sysUser.password);
  if (!isMatch) {
    throw new Error('旧密码错误');
  }

  const newPasswordBcr = await bcrypt.hash(data.newPassword, saltRounds);

  const updateData = {
    userId,
    password: newPasswordBcr
  }

  await sysUser.update({
    ...updateData,
    updateTime: new Date(),
    updateBy: sysUser?.username || 'system'
  });

  // 返回数据时排除密码字段
  const userWithoutPassword = sysUser.toJSON();
  delete userWithoutPassword.password;
  return userWithoutPassword;
};

const updateAvatar = async (userId, file) => {
  const sysUser = await SysUser.findOne({
    where: {
      userId: userId,
      status: '0'
    }
  });

  if (!sysUser) {
    throw new Error('用户不存在');
  }

  const fileRes = await commonFileService.uploadFile(file);
  if (!fileRes || !fileRes.path) {
    throw new Error('上传图片失败，无返回信息');
  }

  const updateData = {
    userId,
    avatar: fileRes.path
  }

  await sysUser.update({
    ...updateData,
    updateTime: new Date(),
    updateBy: sysUser?.username || 'system'
  });

  return updateData
};

const getAuthRole = async (userId, queryUserId) => {
  const querySysUser = await getSysUserById(queryUserId);
  if (!querySysUser) {
    throw new Error('查询用户不存在');
  }

  const queryRoleIds = querySysUser.roleIds
  let roles = [];
  
  if (userId === 1) {
    const sysRoles = await SysRole.findAll({
      where: {
        status: '0'
      }
    });
    roles = sysRoles
  } else {
    const sysUser = await getSysUserById(userId);
    if (sysUser.roleIds && sysUser.roleIds.length > 0) {
      const sysRoles = await SysRole.findAll({
        where: {
          roleId: {
            [Op.in]: sysUser.roleIds
          },
          status: '0'
        }
      });
      roles = sysRoles
    }
  }

  const roleNewList = roles.map(item => {
    const itemData = item.get({ plain: true })
    itemData.flag = queryRoleIds.includes(itemData.roleId) ? true : false 
    return itemData
  })

  const userData = {
    user: querySysUser,
    roles: roleNewList
  }

  return userData;
};

const updateAuthRole = async (userId, roleIds) => {
  const sysUser = await getSysUserById(userId);
  if (!sysUser) {
    throw new Error('用户不存在');
  }

  await SysUserRole.destroy({
    where: {
      userId: userId
    }
  });
  
  if (!roleIds) {
    return sysUser;
  }

  const roleIdList = roleIds.split(',')
  const userRoles = roleIdList.map(roleId => ({
    userId,
    roleId
  }));
  await SysUserRole.bulkCreate(userRoles);

  return sysUser;
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

    // 定义字段映射关系
    const fieldMapping = {
      '用户名': 'userName',
      '密码': 'password',
      '昵称': 'nickName',
      '邮箱': 'email',
      '手机号码': 'phonenumber',
      '性别': 'sex',
      '备注': 'remark'
    };

    // 处理每一行数据
    for (const row of jsonData) {
      try {
        const userData = {};
        for (const [cnField, value] of Object.entries(row)) {
          const englishField = fieldMapping[cnField];
          if (englishField) {
            userData[englishField] = String(value).trim();
          }
        }

        console.log('userData', userData)

        // 基本字段验证
        if (!userData.userName || !userData.password || !userData.nickName) {
          throw new Error('用户名、密码、昵称为必填项');
        }

        // 检查用户名是否已存在
        const existingUser = await SysUser.findOne({
          where: {
            userName: userData.userName,
            status: '0'
          }
        });

        if (existingUser) {
          throw new Error(`用户名 ${userData.userName} 已存在`);
        }

        // 密码加密
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        // 创建用户基本信息
        const user = await SysUser.create({
          userName: userData.userName,
          password: hashedPassword,
          nickName: userData.nickName,
          email: userData.email || '',
          phonenumber: userData.phonenumber || '',
          sex: userData.sex || '0',
          status: '0',
          createBy: req.user?.username || 'system',
          createTime: new Date()
        });

        results.successCount++;
      } catch (error) {
        results.failureCount++;
        results.failureMessages.push({
          row: row.userName,
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
    // 获取用户列表（可以复用之前的查询逻辑）
    const users = await getAllSysUsers(req, res)

    // 转换数据格式
    const exportData = users.map(user => {
      const userData = user.get({ plain: true });

      // 返回要导出的数据格式
      return {
        '用户名': userData.userName,
        '昵称': userData.nickName,
        '邮箱': userData.email,
        '手机号码': userData.phonenumber,
        '性别': userData.sex === '0' ? '男' : userData.sex === '1' ? '女' : '未知',
        '状态': userData.status === '0' ? '正常' : '停用',
        // '岗位': posts,
        // '角色': roles,
        '创建时间': userData.createTime,
        '备注': userData.remark
      };
    });

    // 创建工作簿和工作表
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '用户数据');

    // 生成Excel二进制数据
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return {
      buffer: excelBuffer,
      filename: `user_data_${new Date().getTime()}.xlsx`,
      originalname: `用户数据_${new Date().getTime()}.xlsx`
    };

  } catch (error) {
    throw new Error(`导出失败: ${error.message}`);
  }
};

const getImportTemplate = () => {
  // 创建模板数据
  const templateData = [{
    '用户名': '示例用户名',
    '密码': '示例密码',
    '昵称': '示例昵称',
    '邮箱': 'example@email.com',
    '手机号码': '13800138000',
    '性别': '0',
    '备注': '备注信息'
  }];

  // 创建工作簿和工作表
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '用户导入模板');

  // 生成Excel二进制数据
  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  return {
    buffer: excelBuffer,
    filename: 'user_import_template.xlsx',
    originalname: '用户导入模板.xlsx'
  };
};

const changeUseFlag = async (userId, useFlag) => {
  const sysUser = await SysUser.findOne({
    where: {
      userId: userId,
      status: '0'
    }
  });

  if (!sysUser) {
    throw new Error('用户不存在');
  }

  const updateData = {
    userId,
    useFlag
  }

  await sysUser.update({
    ...updateData,
    updateTime: new Date(),
    updateBy: sysUser?.username || 'system'
  });

  return updateData
};

const cancelAuthRoleForUserId = async (roleId, userId) => {
  await cancelAuthRoleForUserList(roleId, userId)
}

const cancelAuthRoleForUserList = async (roleId, userIds) => {
  if (!roleId || !userIds) {
    return
  }

  const userIdList = userIds.toString().split(',')
  await SysUserRole.destroy({
    where: {
      roleId,
      userId: {
        [Op.in]: userIdList
      }
    }
  });
}

const authRoleForUserList = async (roleId, userIds) => {
  if (!roleId || !userIds) {
    return
  }

  const userIdList = userIds.toString().split(',')
  const userRoles = userIdList.map(userId => ({
    userId,
    roleId
  }));
  await SysUserRole.bulkCreate(userRoles);
}

module.exports = { 
  createSysUser,
  getAllSysUsers, 
  getSysUsers,
  getSysUserById,
  updateSysUser,
  deleteSysUser,
  deleteSysUsers,
  getUserAddInfo,
  getInfo,
  updatePwd,
  mergeSysUser,
  updateAvatar,
  getAuthRole,
  updateAuthRole,
  importData,
  exportData,
  getImportTemplate,
  changeUseFlag,
  cancelAuthRoleForUserId,
  cancelAuthRoleForUserList,
  authRoleForUserList
};

