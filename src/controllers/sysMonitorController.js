const express = require('express');
const router = express.Router();
const service = require('../services/sysMonitorService');

// 定义路由前缀
const routePrefix = 'sysMonitor';

router.get('/server', async(req, res) => {
  try {
    const result = await service.getServerInfo()
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

module.exports = { router, routePrefix };