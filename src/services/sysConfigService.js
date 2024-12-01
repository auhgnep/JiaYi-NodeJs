const SysConfig = require('../models/sysConfig');
const { Op } = require('sequelize');

const createSysConfig = async (req, res) => {
 
  const sysConfig = await SysConfig.create({
    ...req.body,
    createTime: new Date(),
    createBy: req.user?.username || 'system'
  });
  return sysConfig;
  
};

const getAllSysConfigs = async (req, res) => {
 
  const { sort = 'createTime,DESC', ...filters } = req.query;

  const [sortField, sortOrder] = sort.split(',');
  const order = [[sortField, sortOrder.toUpperCase()]];

  const whereClause = {
    status: '0'
  };

  // 获取模型定义的所有属性
  const modelAttributes = Object.keys(SysConfig.rawAttributes);

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

  const sysConfigs = await SysConfig.findAll({
    where: whereClause,
    order
  });

  return sysConfigs;
  
};

const getSysConfigs = async (req, res) => {
 
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
  const modelAttributes = Object.keys(SysConfig.rawAttributes);

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

  const { count, rows: sysConfigs } = await SysConfig.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order
  });

  return {
    records: sysConfigs,
    page: Number(page),
    limit: Number(limit),
    total: count
  };
  
};

const getSysConfigById = async (req, res) => {
 
  const sysConfig = await SysConfig.findOne({
    where: {
      configId: req.params.id,
      status: '0'
    }
  });
  
  if (!sysConfig) {
    throw new Error('数据不存在');
  }

  return sysConfig;
};

const updateSysConfig = async (req, res) => {
 
  const sysConfig = await SysConfig.findOne({
    where: {
      configId: req.params.id,
      status: '0'
    }
  });

  if (!sysConfig) {
    throw new Error('数据不存在');
  }

  await sysConfig.update({
    ...req.body,
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });

  return sysConfig
};

const deleteSysConfig = async (req, res) => {
 
  const sysConfig = await SysConfig.findOne({
    where: {
      configId: req.params.id,
      status: '0'
    }
  });

  if (!sysConfig) {
    throw new Error('数据不存在');
  }

  await sysConfig.update({
    status: '2',
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });
  
};

const deleteSysConfigs = async (req, res) => {
 
  const ids = req.params.id
  const idList = ids.split(',')
  idList.forEach(async (item) => {
    const sysConfig = await SysConfig.findOne({
      where: {
        configId: item,
        status: '0'
      }
    });

    if (!sysConfig) {
      return;
    }

    await sysConfig.update({
      status: '2',
      updateTime: new Date(),
      updateBy: req.user?.username || 'system'
    });
  })
  
};

const getSysConfigsByKey = async (req, res) => {
  const key = req.params.key
  const sysConfig = await SysConfig.findOne({
    where: {
      configKey: req.params.key,
      status: '0'
    }
  });

  if (!sysConfig) {
    throw new Error('数据不存在');
  }

  return sysConfig
};

module.exports = { 
  createSysConfig, 
  getAllSysConfigs,
  getSysConfigs,
  getSysConfigById,
  updateSysConfig,
  deleteSysConfig,
  deleteSysConfigs,
  getSysConfigsByKey
};