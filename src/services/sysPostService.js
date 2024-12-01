const SysPost = require('../models/sysPost');
const { Op } = require('sequelize');

const createSysPost = async (req, res) => {
  const sysPost = await SysPost.create({
    ...req.body,
    createTime: new Date(),
    createBy: req.user?.username || 'system'
  });
  return sysPost;
};

const getAllSysPosts = async (req, res) => {
  const sysPosts = await SysPost.findAll({
    where: {
      status: '0'
    }
  });
  return sysPosts;
};

const getSysPosts = async (req, res) => {
  const { pageNum: pageParam, pageSize: limitParam, sort = 'postSort,ASC', ...filters } = req.query;

  const page = Number(pageParam) || 1;
  const limit = Number(limitParam) || 10;
  const offset = (page - 1) * limit;

  const [sortField, sortOrder] = sort.split(',');
  const order = [[sortField, sortOrder.toUpperCase()]];

  const whereClause = {
    status: '0'
  };

  // 获取模型定义的所有属性
  const modelAttributes = Object.keys(SysPost.rawAttributes);

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

  const { count, rows: sysPosts } = await SysPost.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order
  });

  return {
    records: sysPosts,
    page: Number(page),
    limit: Number(limit),
    total: count
  };
};

const getSysPostById = async (req, res) => {
  const sysPost = await SysPost.findOne({
    where: {
      postId: req.params.id,
      status: '0'
    }
  });
  
  if (!sysPost) {
    throw new Error('数据不存在');
  }
  return sysPost
};

const updateSysPost = async (req, res) => {
  const sysPost = await SysPost.findOne({
    where: {
      postId: req.params.id,
      status: '0'
    }
  });

  if (!sysPost) {
    throw new Error('数据不存在');
  }

  await sysPost.update({
    ...req.body,
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });

  return sysPost;
};

const deleteSysPost = async (req, res) => {
  const sysPost = await SysPost.findOne({
    where: {
      postId: req.params.id,
      status: '0'
    }
  });

  if (!sysPost) {
    throw new Error('数据不存在');
  }

  await sysPost.update({
    status: '2',
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });
};

const deleteSysPosts = async (req, res) => {
  const ids = req.params.id
  const idList = ids.split(',')
  idList.forEach(async (item) => {
    const sysPost = await SysPost.findOne({
      where: {
        postId: item,
        status: '0'
      }
    });

    if (!sysPost) {
      return;
    }

    await sysPost.update({
      status: '2',
      updateTime: new Date(),
      updateBy: req.user?.username || 'system'
    });
  })
};

module.exports = { 
  createSysPost,
  getAllSysPosts, 
  getSysPosts,
  getSysPostById,
  updateSysPost,
  deleteSysPost,
  deleteSysPosts
};

