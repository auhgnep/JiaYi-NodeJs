const express = require('express');
require('dotenv').config();

const fileUpload = require('express-fileupload');

// const config = require('./src/config');
const config = require('config');
const routes = require('./src/controllers');
const { initializeDatabase } = require('./src/database');
const { responseMiddleware } = require('./src/utils/responseHandler');
const { verifyToken } = require('./src/utils/authMiddleware');
const redisClient = require('./src/utils/redisClient');


const sysJobService = require('./src/services/sysJobService');

const app = express();

// API白名单路径
const whiteList = [
  '/api/login',             // 登录接口
  '/api/captchaImage',      // 验证码
  '/api/public/*',          // 所有公开接口
];

// JWT认证中间件
const authMiddleware = (req, res, next) => {
  // 检查请求路径是否在白名单中
  const isWhitelisted = whiteList.some(path => {
    // 处理通配符 * 的情况
    if (path.includes('*')) {
      const pathPattern = new RegExp('^' + path.replace('*', '.*') + '$');
      return pathPattern.test(req.path);
    }
    return path === req.path;
  });

  // 如果在白名单中，直接通过
  if (isWhitelisted) {
    return next();
  }

  // 不在白名单中，进行token验证
  verifyToken(req, res, next);
};

// 注册中间件
app.use(express.json());
app.use(responseMiddleware); // 添加响应处理中间件

// 文件上传
app.use(fileUpload({
  createParentPath: true,
  defParamCharset: "utf8", // 添加utf8编码
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size
  },
}));

async function initializeServer() {
  // 初始化数据库
  await initializeDatabase();

  // 初始化Redis连接
  await redisClient.connect();

  // 注册认证中间件（在注册路由之前）
  app.use(authMiddleware);

  // 注册所有路由
  app.use('/api', routes);

  // 初始化定时任务
  sysJobService.initJobs()

  // 全局错误处理中间件
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.error('服务器内部错误', 500);
  });

  // 404 处理
  app.use((req, res) => {
    res.notFound('接口不存在');
  });

  // 启动服务器
  const PORT = config.server.port || 9000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// 关闭服务器
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received.');
  try {
      // 关闭Redis连接
      await redisClient.disconnect();
      // 关闭其他连接...
      process.exit(0);
  } catch (error) {
      console.error('Error during graceful shutdown:', error);
      process.exit(1);
  }
});

// 调用初始化函数
initializeServer().catch(error => {
  console.error('Failed to initialize server:', error);
  process.exit(1);
});