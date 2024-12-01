const SysNotice = require('../models/sysNotice');
const { Op } = require('sequelize');

const createSysNotice = async (req, res) => {
  const sysNotice = await SysNotice.create({
    ...req.body,
    createTime: new Date(),
    createBy: req.user?.username || 'system'
  });
  return sysNotice;
};

const getAllSysNotices = async (req, res) => {
  const { sort = 'createTime,DESC', ...filters } = req.query;

  const [sortField, sortOrder] = sort.split(',');
  const order = [[sortField, sortOrder.toUpperCase()]];

  const whereClause = {
    status: '0'
  };

  // 获取模型定义的所有属性
  const modelAttributes = Object.keys(SysNotice.rawAttributes);

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

  const sysNotices = await SysNotice.findAll({
    where: whereClause,
    order
  });
  return sysNotices;
};

const getSysNotices = async (req, res) => {
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
  const modelAttributes = Object.keys(SysNotice.rawAttributes);

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

  const { count, rows: sysNotices } = await SysNotice.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order
  });

  return {
    records: sysNotices,
    page: Number(page),
    limit: Number(limit),
    total: count
  };
};

const getSysNoticeById = async (req, res) => {
  const sysNotice = await SysNotice.findOne({
    where: {
      noticeId: req.params.id,
      status: '0'
    }
  });
  
  if (!sysNotice) {
    throw new Error('数据不存在');
  }
  return sysNotice
};

const updateSysNotice = async (req, res) => {
  const sysNotice = await SysNotice.findOne({
    where: {
      noticeId: req.params.id,
      status: '0'
    }
  });

  if (!sysNotice) {
    throw new Error('数据不存在');
  }

  await sysNotice.update({
    ...req.body,
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });

  return sysNotice;
};

const deleteSysNotice = async (req, res) => {
  const sysNotice = await SysNotice.findOne({
    where: {
      noticeId: req.params.id,
      status: '0'
    }
  });

  if (!sysNotice) {
    throw new Error('数据不存在');
  }

  await sysNotice.update({
    status: '2',
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });
};

const deleteSysNotices = async (req, res) => {
  const ids = req.params.id
  const idList = ids.split(',')
  idList.forEach(async (item) => {
    const sysNotice = await SysNotice.findOne({
      where: {
        noticeId: item,
        status: '0'
      }
    });

    if (!sysNotice) {
      return;
    }

    await sysNotice.update({
      status: '2',
      updateTime: new Date(),
      updateBy: req.user?.username || 'system'
    });
  })
};

module.exports = { 
  createSysNotice,
  getAllSysNotices, 
  getSysNotices,
  getSysNoticeById,
  updateSysNotice,
  deleteSysNotice,
  deleteSysNotices
};

