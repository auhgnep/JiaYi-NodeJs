const express = require('express');
const fs = require('fs');
const path = require('path');

function loadControllers() {
  let controllers = {};
  const router = express.Router();
  
  // 使用 webpack 的 require.context
  // 第一个参数是目录，第二个参数是是否查找子目录，第三个参数是文件匹配模式
  const context = require.context('./', false, /Controller\.js$/);
  
  // 获取所有匹配的文件键名
  const controllerFiles = context.keys()
    .filter(key => key !== './index.js');

  // 加载每个控制器
  controllerFiles.forEach(key => {
    try {
      // 使用 context 加载模块
      const controller = context(key);
      
      // 从文件名获取路由前缀
      // 移除 './' 前缀和 '.js' 后缀，然后移除 'Controller' 后缀
      const prefix = key
        .replace(/^\.\//, '')
        .replace(/\.js$/, '')
        .replace('Controller', '');
      
      // 使用控制器定义的路由前缀，如果没有则使用处理后的文件名
      const routePrefix = controller.routePrefix || prefix.toLowerCase();
      
      controllers[routePrefix] = controller;
      router.use(`/${routePrefix}`, controller.router);
      
      console.log(`Loaded controller: ${key} with prefix /${routePrefix}`);
    } catch (error) {
      console.error(`Error loading controller ${key}:`, error);
    }
  });

  return router;
}

function loadControllersForDev() {
  const router = express.Router();
  // 读取当前目录下的所有文件
  const files = fs.readdirSync(__dirname);
  // 遍历所有文件
  files.forEach(file => {
    // 排除 index.js 文件和非 .js 文件
    if (file !== 'index.js' && path.extname(file) === '.js') {
      const controller = require(path.join(__dirname, file));
      
      // 检查控制器是否定义了路由前缀，如果没有，使用文件名作为默认前缀
      const routePrefix = controller.routePrefix || path.basename(file, '.js');
      
      // 将每个控制器挂载到指定的路由前缀上
      router.use(`/${routePrefix}`, controller.router);
    }
  });

  return router;
}

// 加载所有控制器
// const controllers = process.env.NODE_ENV === 'dev' ? loadControllersForDev() : loadControllers();
const controllers = loadControllers();

module.exports = controllers;