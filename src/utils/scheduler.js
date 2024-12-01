const schedule = require('node-schedule');
const parser = require('cron-parser');
const path = require('path');
const fs = require('fs');
const SysJobLogService = require('../services/sysJobLogService');
const SysJob = require('../models/sysJob');

class JobScheduler {
  constructor() {
    this.scheduledJobs = new Map();
    // 缓存已加载的服务
    this.serviceCache = new Map();
    // 初始化时加载所有服务
    this.initializeServices();
    console.log('JobScheduler init completed')
  }

  // 验证cron表达式
  validateCronExpression(cronExpression) {
    try {
      parser.parseExpression(cronExpression);
      return true;
    } catch (e) {
      return false;
    }
  }

  // 解析调用目标字符串
  parseInvokeTarget(invokeTarget) {
    try {
      // 移除可能存在的空格
      const target = invokeTarget.trim();
      
      // 解析服务名和方法名
      // 例如: "ryService.task('param1', 'param2')" 
      // 或者: "ryService.task()"
      const matches = target.match(/^(\w+)\.(\w+)\((.*)\)$/);
      if (!matches) {
        throw new Error(`Invalid invoke target format: ${target}`);
      }

      const [_, serviceName, methodName, argsString] = matches;

      // 解析参数
      let args = [];
      if (argsString.trim()) {
        // 使用 Function 构造器安全地解析参数字符串
        // 例如: "'param1', 'param2'" => ["param1", "param2"]
        args = new Function(`return [${argsString}]`)();
      }

      return {
        serviceName: `${serviceName}.js`,
        methodName,
        args
      };
    } catch (error) {
      throw new Error(`Failed to parse invoke target: ${error.message}`);
    }
  }

  // 初始化并加载所有服务
  initializeServices() {
    // if (process.env.NODE_ENV === 'dev') {
    //   this.loadServicesForDev();
    // } else {
    //   this.loadServicesForProd();
    // }
    this.loadServicesForProd();
  }

  // 生产环境使用 webpack 的 require.context
  loadServicesForProd() {
    try {
      // 使用 webpack 的 require.context
      const context = require.context('../tasks', false, /\.js$/);
      
      // 获取所有匹配的文件键名
      const serviceFiles = context.keys();

      // 加载每个服务
      serviceFiles.forEach(key => {
        try {
          // 使用 context 加载模块
          const service = context(key);
          
          // 从文件名获取服务名
          const serviceName = key.replace(/^\.\//, '');
          
          this.serviceCache.set(serviceName, service);
          console.log(`Loaded service: ${serviceName}`);
        } catch (error) {
          console.error(`Error loading service ${key}:`, error);
        }
      });
    } catch (error) {
      console.error('Failed to load services in production mode:', error);
    }
  }

  // 开发环境直接读取文件系统
  loadServicesForDev() {
    try {
      const tasksDir = path.resolve(__dirname, '../tasks');
      
      // 读取 tasks 目录下的所有文件
      const files = fs.readdirSync(tasksDir);
      
      // 遍历所有文件
      files.forEach(file => {
        if (path.extname(file) === '.js') {
          try {
            const servicePath = path.join(tasksDir, file);
            // 清除 require 缓存，确保获取最新的服务实例
            delete require.cache[require.resolve(servicePath)];
            
            const service = require(servicePath);
            this.serviceCache.set(file, service);
            
            console.log(`Loaded service: ${file}`);
          } catch (error) {
            console.error(`Error loading service ${file}:`, error);
          }
        }
      });
    } catch (error) {
      console.error('Failed to load services in development mode:', error);
    }
  }

  // 加载服务的新实现
  async loadService(serviceName) {
    try {
      // 如果服务已经在缓存中，直接返回
      if (this.serviceCache.has(serviceName)) {
        return this.serviceCache.get(serviceName);
      }

      // 如果服务不在缓存中，重新加载所有服务
      this.clearServiceCache();
      this.initializeServices();

      // 再次检查服务是否已加载
      if (this.serviceCache.has(serviceName)) {
        return this.serviceCache.get(serviceName);
      }

      throw new Error(`Service ${serviceName} not found`);
    } catch (error) {
      throw new Error(`Failed to load service ${serviceName}: ${error.message}`);
    }
  }

  // 执行任务
  async executeJob(job) {
    const startTime = new Date();
    let execStatus = '0';  // 0-成功 1-失败
    let jobMessage = '执行成功';
    let exceptionInfo = '';

    try {
      const { serviceName, methodName, args } = this.parseInvokeTarget(job.invokeTarget);
      
      // 加载并获取服务实例
      const service = await this.loadService(serviceName);
      
      if (!service[methodName]) {
        throw new Error(`Method ${methodName} not found in service ${serviceName}`);
      }

      // 执行方法
      await service[methodName](...args);
      
    } catch (error) {
      execStatus = '1';
      jobMessage = '执行失败';
      exceptionInfo = error.message;
      console.error(`Job execution failed: ${error.message}`);
    }

    // 记录执行日志
    try {
      await SysJobLogService.createSysJobLog({
        body: {
          jobName: job.jobName,
          jobGroup: job.jobGroup,
          invokeTarget: job.invokeTarget,
          jobMessage,
          execStatus,
          exceptionInfo,
          startTime,
          endTime: new Date()
        }
      });
    } catch (error) {
      console.error('Failed to create job log:', error);
    }
  }

  // 处理任务错过执行的情况
  handleMisfired(job) {
    switch (job.misfirePolicy) {
      case '1': // 立即执行
        return { runOnStart: true };
      case '2': // 执行一次
        return { runOnStart: true, recoverMissedExecutions: false };
      case '3': // 放弃执行
        return { runOnStart: false };
      default:
        return { runOnStart: false };
    }
  }

  // 添加任务
  async addJob(job) {
    if (!this.validateCronExpression(job.cronExpression)) {
      throw new Error('Invalid cron expression');
    }

    try {
      // 验证调用目标是否有效
      const { serviceName, methodName } = this.parseInvokeTarget(job.invokeTarget);
      const service = await this.loadService(serviceName);
      if (!service[methodName]) {
        throw new Error(`Method ${methodName} not found in service ${serviceName}`);
      }
    } catch (error) {
      throw new Error(`Invalid invoke target: ${error.message}`);
    }

    // 如果任务已存在且concurrent为1(禁止并发),则先删除原任务
    if (this.scheduledJobs.has(job.jobId) && job.concurrent === '1') {
      this.removeJob(job.jobId);
    }

    const misfireOptions = this.handleMisfired(job);
    
    // 创建一个包装函数作为调度任务
    const jobFunction = async () => {
      // 检查是否允许并发执行
      const jobInfo = this.scheduledJobs.get(job.jobId);
      if (!jobInfo) return; // 如果任务已被删除，直接返回
      
      if (job.concurrent === '1' && jobInfo.running) {
        console.log(`Job ${job.jobName} is already running, skipping this execution`);
        return;
      }

      jobInfo.running = true;
      try {
        await this.executeJob(job);
      } finally {
        jobInfo.running = false;
      }
    };

    // 使用包装函数创建调度任务
    const scheduledJob = schedule.scheduleJob(job.cronExpression, jobFunction);

    if (!scheduledJob) {
      throw new Error('Failed to schedule job: Invalid schedule configuration');
    }

    this.scheduledJobs.set(job.jobId, {
      job: scheduledJob,
      running: false,
      status: job.jobStatus // 0-正常 1-暂停
    });

    // 如果任务状态为暂停,则立即暂停任务
    if (job.jobStatus === '1') {
      this.pauseJob(job.jobId);
    }

    console.log(`Job ${job.jobName} scheduled successfully`);
  }

  // 移除任务
  removeJob(jobId) {
    const scheduledJob = this.scheduledJobs.get(jobId);
    if (scheduledJob) {
      scheduledJob.job.cancel();
      this.scheduledJobs.delete(jobId);
      console.log(`Job ${jobId} removed`);
    }
  }

  // 暂停任务
  pauseJob(jobId) {
    const scheduledJob = this.scheduledJobs.get(jobId);
    if (scheduledJob) {
      scheduledJob.job.cancel();
      scheduledJob.status = '1';
      console.log(`Job ${jobId} paused`);
    }
  }

  // 恢复任务
  async resumeJob(jobId) {
    const scheduledJob = this.scheduledJobs.get(jobId);
    if (scheduledJob) {
      // 获取原任务配置
      const job = await SysJob.findOne({
        where: {
          jobId: jobId,
          status: '0'
        }
      });

      if (job) {
        // 先移除旧的任务
        this.removeJob(jobId);
        // 重新添加任务
        await this.addJob(job);
        console.log(`Job ${jobId} resumed`);
      }
    }
  }

  // 立即执行一次任务
  async runOnce(jobId) {
    const job = await SysJob.findOne({
      where: {
        jobId: jobId,
        status: '0'
      }
    });

    if (!job) {
      throw new Error('Job not found');
    }

    await this.executeJob(job);
  }

  // 检查任务是否存在
  hasJob(jobId) {
    return this.scheduledJobs.has(jobId);
  }

  // 获取任务状态
  getJobStatus(jobId) {
    const scheduledJob = this.scheduledJobs.get(jobId);
    return scheduledJob ? {
      status: scheduledJob.status,
      running: scheduledJob.running,
      nextInvocation: scheduledJob.job.nextInvocation()
    } : null;
  }

  // 获取所有任务
  getAllJobs() {
    const jobs = [];
    this.scheduledJobs.forEach((value, key) => {
      jobs.push({
        jobId: key,
        status: value.status,
        running: value.running,
        nextInvocation: value.job.nextInvocation()
      });
    });
    return jobs;
  }

  // 清理服务缓存
  clearServiceCache() {
    this.serviceCache.clear();
  }
}

// 创建单例
const scheduler = new JobScheduler();
module.exports = scheduler;