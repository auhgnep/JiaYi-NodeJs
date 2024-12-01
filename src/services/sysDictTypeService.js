const SysDictType = require('../models/sysDictType');
const { Op } = require('sequelize');

const createSysDictType = async (req, res) => {
  const sysDictType = await SysDictType.create({
    ...req.body,
    createTime: new Date(),
    createBy: req.user?.username || 'system'
  });
  return sysDictType;
};

const getAllSysDictTypes = async (req, res) => {
  const sysDictTypes = await SysDictType.findAll({
    where: {
      status: '0'
    }
  });
  return sysDictTypes;
};

const getSysDictTypes = async (req, res) => {
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
  const modelAttributes = Object.keys(SysDictType.rawAttributes);

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

  const { count, rows: sysDictTypes } = await SysDictType.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order
  });

  return {
    records: sysDictTypes,
    page: Number(page),
    limit: Number(limit),
    total: count
  };
};

const getSysDictTypeById = async (req, res) => {
  const sysDictType = await SysDictType.findOne({
    where: {
      dictId: req.params.id,
      status: '0'
    }
  });
  
  if (!sysDictType) {
    throw new Error('数据不存在');
  }
  return sysDictType
};

const updateSysDictType = async (req, res) => {
  const sysDictType = await SysDictType.findOne({
    where: {
      dictId: req.params.id,
      status: '0'
    }
  });

  if (!sysDictType) {
    throw new Error('数据不存在');
  }

  await sysDictType.update({
    ...req.body,
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });

  return sysDictType;
};

const deleteSysDictType = async (req, res) => {
  const sysDictType = await SysDictType.findOne({
    where: {
      dictId: req.params.id,
      status: '0'
    }
  });

  if (!sysDictType) {
    throw new Error('数据不存在');
  }

  await sysDictType.update({
    status: '2',
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });
};

const deleteSysDictTypes = async (req, res) => {
  const ids = req.params.id
  const idList = ids.split(',')
  idList.forEach(async (item) => {
    const sysDictType = await SysDictType.findOne({
      where: {
        dictId: item,
        status: '0'
      }
    });

    if (!sysDictType) {
      return;
    }

    await sysDictType.update({
      status: '2',
      updateTime: new Date(),
      updateBy: req.user?.username || 'system'
    });
  })
};

module.exports = { 
  createSysDictType,
  getAllSysDictTypes, 
  getSysDictTypes,
  getSysDictTypeById,
  updateSysDictType,
  deleteSysDictType,
  deleteSysDictTypes
};

