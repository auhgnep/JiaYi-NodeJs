const SysUserPost = require('../models/sysUserPost');
const { Op } = require('sequelize');

const createSysUserPost = async (req, res) => {
  const sysUserPost = await SysUserPost.create({
    ...req.body,
    createTime: new Date(),
    createBy: req.user?.username || 'system'
  });
  return sysUserPost;
};

const getAllSysUserPosts = async (req, res) => {
  const sysUserPosts = await SysUserPost.findAll({
    where: {
      status: '0'
    }
  });
  return sysUserPosts;
};

const getSysUserPosts = async (req, res) => {
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
  const modelAttributes = Object.keys(SysUserPost.rawAttributes);

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

  const { count, rows: sysUserPosts } = await SysUserPost.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order
  });

  return {
    records: sysUserPosts,
    page: Number(page),
    limit: Number(limit),
    total: count
  };
};

const getSysUserPostById = async (req, res) => {
  const sysUserPost = await SysUserPost.findOne({
    where: {
      userId: req.params.id,
      status: '0'
    }
  });
  
  if (!sysUserPost) {
    throw new Error('数据不存在');
  }
  return sysUserPost
};

const updateSysUserPost = async (req, res) => {
  const sysUserPost = await SysUserPost.findOne({
    where: {
      userId: req.params.id,
      status: '0'
    }
  });

  if (!sysUserPost) {
    throw new Error('数据不存在');
  }

  await sysUserPost.update({
    ...req.body,
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });

  return sysUserPost;
};

const deleteSysUserPost = async (req, res) => {
  const sysUserPost = await SysUserPost.findOne({
    where: {
      userId: req.params.id,
      status: '0'
    }
  });

  if (!sysUserPost) {
    throw new Error('数据不存在');
  }

  await sysUserPost.update({
    status: '2',
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });
};

const deleteSysUserPosts = async (req, res) => {
  const ids = req.params.id
  const idList = ids.split(',')
  idList.forEach(async (item) => {
    const sysUserPost = await SysUserPost.findOne({
      where: {
        userId: item,
        status: '0'
      }
    });

    if (!sysUserPost) {
      return;
    }

    await sysUserPost.update({
      status: '2',
      updateTime: new Date(),
      updateBy: req.user?.username || 'system'
    });
  })
};

module.exports = { 
  createSysUserPost,
  getAllSysUserPosts, 
  getSysUserPosts,
  getSysUserPostById,
  updateSysUserPost,
  deleteSysUserPost,
  deleteSysUserPosts
};

