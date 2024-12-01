const SysJobLog = require('../models/sysJobLog');
const { Op } = require('sequelize');

const createSysJobLog = async (req, res) => {
  const sysJobLog = await SysJobLog.create({
    ...req.body,
    createTime: new Date(),
    createBy: req.user?.username || 'system'
  });
  return sysJobLog;
};

const getAllSysJobLogs = async (req, res) => {
  const { sort = 'createTime,DESC', ...filters } = req.query;

  const [sortField, sortOrder] = sort.split(',');
  const order = [[sortField, sortOrder.toUpperCase()]];

  const whereClause = {
    status: '0'
  };

  // 获取模型定义的所有属性
  const modelAttributes = Object.keys(SysJobLog.rawAttributes);

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

  const sysJobLogs = await SysJobLog.findAll({
    where: whereClause,
    order
  });
  return sysJobLogs;
};

const getSysJobLogs = async (req, res) => {
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
  const modelAttributes = Object.keys(SysJobLog.rawAttributes);

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

  const { count, rows: sysJobLogs } = await SysJobLog.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order
  });

  return {
    records: sysJobLogs,
    page: Number(page),
    limit: Number(limit),
    total: count
  };
};

const getSysJobLogById = async (req, res) => {
  const sysJobLog = await SysJobLog.findOne({
    where: {
      jobLogId: req.params.id,
      status: '0'
    }
  });
  
  if (!sysJobLog) {
    throw new Error('数据不存在');
  }
  return sysJobLog
};

const updateSysJobLog = async (req, res) => {
  const sysJobLog = await SysJobLog.findOne({
    where: {
      jobLogId: req.params.id,
      status: '0'
    }
  });

  if (!sysJobLog) {
    throw new Error('数据不存在');
  }

  await sysJobLog.update({
    ...req.body,
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });

  return sysJobLog;
};

const deleteSysJobLog = async (req, res) => {
  const sysJobLog = await SysJobLog.findOne({
    where: {
      jobLogId: req.params.id,
      status: '0'
    }
  });

  if (!sysJobLog) {
    throw new Error('数据不存在');
  }

  await sysJobLog.update({
    status: '2',
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });
};

const deleteSysJobLogs = async (req, res) => {
  const ids = req.params.id
  const idList = ids.split(',')
  idList.forEach(async (item) => {
    const sysJobLog = await SysJobLog.findOne({
      where: {
        jobLogId: item,
        status: '0'
      }
    });

    if (!sysJobLog) {
      return;
    }

    await sysJobLog.update({
      status: '2',
      updateTime: new Date(),
      updateBy: req.user?.username || 'system'
    });
  })
};

module.exports = { 
  createSysJobLog,
  getAllSysJobLogs, 
  getSysJobLogs,
  getSysJobLogById,
  updateSysJobLog,
  deleteSysJobLog,
  deleteSysJobLogs
};

