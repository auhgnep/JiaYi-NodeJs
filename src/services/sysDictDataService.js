const SysDictData = require('../models/sysDictData');
const { Op } = require('sequelize');

const createSysDictData = async (req, res) => {
  const sysDictData = await SysDictData.create({
    ...req.body,
    createTime: new Date(),
    createBy: req.user?.username || 'system'
  });
  return sysDictData;
};

const getAllSysDictDatas = async (req, res) => {
  const { sort = 'createTime,DESC', ...filters } = req.query;

  const [sortField, sortOrder] = sort.split(',');
  const order = [[sortField, sortOrder.toUpperCase()]];

  const whereClause = {
    status: '0'
  };

  // 获取模型定义的所有属性
  const modelAttributes = Object.keys(SysDictData.rawAttributes);

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

  const sysDictDatas = await SysDictData.findAll({
    where: whereClause,
    order
  });
  return sysDictDatas;
};

const getSysDictDatas = async (req, res) => {
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
  const modelAttributes = Object.keys(SysDictData.rawAttributes);

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

  const { count, rows: sysDictDatas } = await SysDictData.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order
  });

  return {
    records: sysDictDatas,
    page: Number(page),
    limit: Number(limit),
    total: count
  };
};

const getSysDictDataById = async (req, res) => {
  const sysDictData = await SysDictData.findOne({
    where: {
      dictCode: req.params.id,
      status: '0'
    }
  });
  
  if (!sysDictData) {
    throw new Error('数据不存在');
  }
  return sysDictData
};

const updateSysDictData = async (req, res) => {
  const sysDictData = await SysDictData.findOne({
    where: {
      dictCode: req.params.id,
      status: '0'
    }
  });

  if (!sysDictData) {
    throw new Error('数据不存在');
  }

  await sysDictData.update({
    ...req.body,
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });

  return sysDictData;
};

const deleteSysDictData = async (req, res) => {
  const sysDictData = await SysDictData.findOne({
    where: {
      dictCode: req.params.id,
      status: '0'
    }
  });

  if (!sysDictData) {
    throw new Error('数据不存在');
  }

  await sysDictData.update({
    status: '2',
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });
};

const deleteSysDictDatas = async (req, res) => {
  const ids = req.params.id
  const idList = ids.split(',')
  idList.forEach(async (item) => {
    const sysDictData = await SysDictData.findOne({
      where: {
        dictCode: item,
        status: '0'
      }
    });

    if (!sysDictData) {
      return;
    }

    await sysDictData.update({
      status: '2',
      updateTime: new Date(),
      updateBy: req.user?.username || 'system'
    });
  })
};

module.exports = { 
  createSysDictData,
  getAllSysDictDatas, 
  getSysDictDatas,
  getSysDictDataById,
  updateSysDictData,
  deleteSysDictData,
  deleteSysDictDatas
};

