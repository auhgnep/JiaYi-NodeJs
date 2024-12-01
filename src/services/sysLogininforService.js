const SysLogininfor = require('../models/sysLogininfor');
const { Op } = require('sequelize');

const createSysLogininfor = async (req, res) => {
  const sysLogininfor = await SysLogininfor.create({
    ...req.body,
    createTime: new Date(),
    createBy: req.user?.username || 'system'
  });
  return sysLogininfor;
};

const getAllSysLogininfors = async (req, res) => {
  const { sort = 'createTime,DESC', ...filters } = req.query;

  const [sortField, sortOrder] = sort.split(',');
  const order = [[sortField, sortOrder.toUpperCase()]];

  const whereClause = {
    status: '0'
  };

  // 获取模型定义的所有属性
  const modelAttributes = Object.keys(SysLogininfor.rawAttributes);

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

  const sysLogininfors = await SysLogininfor.findAll({
    where: whereClause,
    order
  });
  return sysLogininfors;
};

const getSysLogininfors = async (req, res) => {
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
  const modelAttributes = Object.keys(SysLogininfor.rawAttributes);

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

  const { count, rows: sysLogininfors } = await SysLogininfor.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order
  });

  return {
    records: sysLogininfors,
    page: Number(page),
    limit: Number(limit),
    total: count
  };
};

const getSysLogininforById = async (req, res) => {
  const sysLogininfor = await SysLogininfor.findOne({
    where: {
      infoId: req.params.id,
      status: '0'
    }
  });
  
  if (!sysLogininfor) {
    throw new Error('数据不存在');
  }
  return sysLogininfor
};

const updateSysLogininfor = async (req, res) => {
  const sysLogininfor = await SysLogininfor.findOne({
    where: {
      infoId: req.params.id,
      status: '0'
    }
  });

  if (!sysLogininfor) {
    throw new Error('数据不存在');
  }

  await sysLogininfor.update({
    ...req.body,
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });

  return sysLogininfor;
};

const deleteSysLogininfor = async (req, res) => {
  const sysLogininfor = await SysLogininfor.findOne({
    where: {
      infoId: req.params.id,
      status: '0'
    }
  });

  if (!sysLogininfor) {
    throw new Error('数据不存在');
  }

  await sysLogininfor.update({
    status: '2',
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });
};

const deleteSysLogininfors = async (req, res) => {
  const ids = req.params.id
  const idList = ids.split(',')
  idList.forEach(async (item) => {
    const sysLogininfor = await SysLogininfor.findOne({
      where: {
        infoId: item,
        status: '0'
      }
    });

    if (!sysLogininfor) {
      return;
    }

    await sysLogininfor.update({
      status: '2',
      updateTime: new Date(),
      updateBy: req.user?.username || 'system'
    });
  })
};

module.exports = { 
  createSysLogininfor,
  getAllSysLogininfors, 
  getSysLogininfors,
  getSysLogininforById,
  updateSysLogininfor,
  deleteSysLogininfor,
  deleteSysLogininfors
};

