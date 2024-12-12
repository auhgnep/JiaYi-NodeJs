const SysJob = require('../models/sysJob');
const { Op } = require('sequelize');
const scheduler = require('../utils/scheduler');

// 初始化所有有效的定时任务
const initJobs = async () => {
  try {
    const jobs = await SysJob.findAll({
      where: {
        status: '0',  // 正常状态
        jobStatus: '0' // 正常状态
      }
    });

    for (const job of jobs) {
      await scheduler.addJob(job);
    }
    console.log('All jobs initialized successfully');
  } catch (error) {
    console.error('Failed to initialize jobs:', error);
    throw error;
  }
};

const createSysJob = async (req, res) => {
  const sysJob = await SysJob.create({
    ...req.body,
    createTime: new Date(),
    createBy: req.user?.username || 'system'
  });

  // 如果任务状态为正常，则添加到调度器
  if (sysJob.status === '0' && sysJob.jobStatus === '0') {
    await scheduler.addJob(sysJob);
  }

  return sysJob;
};

const getSysJobs = async (req, res) => {
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
  const modelAttributes = Object.keys(SysJob.rawAttributes);

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

  const { count, rows: sysJobs } = await SysJob.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order
  });

  // 获取每个任务的调度状态
  const jobsWithStatus = sysJobs.map(job => {
    const schedulerStatus = scheduler.getJobStatus(job.jobId);
    return {
      ...job.toJSON(),
      schedulerStatus
    };
  });

  return {
    records: jobsWithStatus,
    page: Number(page),
    limit: Number(limit),
    total: count
  };
};

const getSysJobById = async (req, res) => {
  const sysJob = await SysJob.findOne({
    where: {
      jobId: req.params.id,
      status: '0'
    }
  });
  
  if (!sysJob) {
    throw new Error('数据不存在');
  }

  const schedulerStatus = scheduler.getJobStatus(sysJob.jobId);
  return {
    ...sysJob.toJSON(),
    schedulerStatus
  };
};

const updateSysJob = async (req, res) => {
  const sysJob = await SysJob.findOne({
    where: {
      jobId: req.params.id,
      status: '0'
    }
  });

  if (!sysJob) {
    throw new Error('数据不存在');
  }

  const oldStatus = sysJob.jobStatus;
  const newStatus = req.body.jobStatus;

  // 更新数据库
  await sysJob.update({
    ...req.body,
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });

  // 更新调度器中的任务
  if (scheduler.hasJob(sysJob.jobId)) {
    // 如果任务状态改变了，需要相应地更新调度器
    if (oldStatus !== newStatus) {
      if (newStatus === '1') {  // 暂停任务
        scheduler.pauseJob(sysJob.jobId);
      } else if (newStatus === '0') {  // 恢复任务
        await scheduler.resumeJob(sysJob.jobId);
      }
    } else {  // 其他更新，重新调度任务
      scheduler.removeJob(sysJob.jobId);
      if (sysJob.status === '0' && sysJob.jobStatus === '0') {
        await scheduler.addJob(sysJob);
      }
    }
  } else if (sysJob.status === '0' && sysJob.jobStatus === '0') {
    // 如果任务不在调度器中且状态正常，添加到调度器
    await scheduler.addJob(sysJob);
  }

  const schedulerStatus = scheduler.getJobStatus(sysJob.jobId);
  return {
    ...sysJob.toJSON(),
    schedulerStatus
  };
};

const deleteSysJob = async (req, res) => {
  const sysJob = await SysJob.findOne({
    where: {
      jobId: req.params.id,
      status: '0'
    }
  });

  if (!sysJob) {
    throw new Error('数据不存在');
  }

  // 从调度器中移除任务
  scheduler.removeJob(sysJob.jobId);

  await sysJob.update({
    status: '2',
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });
};

const deleteSysJobs = async (req, res) => {
  const ids = req.params.id;
  const idList = ids.split(',');
  
  for (const id of idList) {
    const sysJob = await SysJob.findOne({
      where: {
        jobId: id,
        status: '0'
      }
    });

    if (!sysJob) {
      continue;
    }

    // 从调度器中移除任务
    scheduler.removeJob(sysJob.jobId);

    await sysJob.update({
      status: '2',
      updateTime: new Date(),
      updateBy: req.user?.username || 'system'
    });
  }
};

// 暂停任务
const pauseJob = async (req, res) => {
  const sysJob = await SysJob.findOne({
    where: {
      jobId: req.params.id,
      status: '0'
    }
  });

  if (!sysJob) {
    throw new Error('任务不存在');
  }

  await sysJob.update({
    jobStatus: '1',
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });

  scheduler.pauseJob(sysJob.jobId);

  const schedulerStatus = scheduler.getJobStatus(sysJob.jobId);
  return {
    ...sysJob.toJSON(),
    schedulerStatus
  };
};

// 恢复任务
const resumeJob = async (req, res) => {
  const sysJob = await SysJob.findOne({
    where: {
      jobId: req.params.id,
      status: '0'
    }
  });

  if (!sysJob) {
    throw new Error('任务不存在');
  }

  await sysJob.update({
    jobStatus: '0',
    updateTime: new Date(),
    updateBy: req.user?.username || 'system'
  });

  await scheduler.resumeJob(sysJob.jobId);

  const schedulerStatus = scheduler.getJobStatus(sysJob.jobId);
  return {
    ...sysJob.toJSON(),
    schedulerStatus
  };
};

// 立即执行一次
const runOnce = async (jobId) => {
  const sysJob = await SysJob.findOne({
    where: {
      jobId,
      status: '0'
    }
  });

  if (!sysJob) {
    throw new Error('任务不存在');
  }

  await scheduler.runOnce(sysJob.jobId);

  const schedulerStatus = scheduler.getJobStatus(sysJob.jobId);
  return {
    ...sysJob.toJSON(),
    schedulerStatus
  };
};

// 查询任务运行状态
const getJobStatus = async (jobId) => {
  const sysJob = await SysJob.findOne({
    where: {
      jobId,
      status: '0'
    }
  });

  if (!sysJob) {
    throw new Error('任务不存在');
  }

  const schedulerStatus = scheduler.getJobStatus(sysJob.jobId);
  return {
    ...sysJob.toJSON(),
    schedulerStatus
  };
};

const changeStatus = async (req, res) => {
  req.params.id = req.body.jobId
  return await updateSysJob(req, res)
};

module.exports = {
  initJobs,
  createSysJob,
  getSysJobs,
  getSysJobById,
  updateSysJob,
  deleteSysJob,
  deleteSysJobs,
  pauseJob,
  resumeJob,
  runOnce,
  getJobStatus,
  changeStatus
};