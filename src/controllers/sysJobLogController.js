const express = require('express');
const router = express.Router();
const service = require('../services/sysJobLogService');

const routePrefix = 'sysJobLog';

router.get('/list', async(req, res) => {
  try {
    const result = await service.getAllSysJobLogs(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/page', async(req, res) => {
  try {
    const result = await service.getSysJobLogs(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.post('/', async(req, res) => {
  try {
    const result = await service.createSysJobLog(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.patch('/update/:id', async(req, res) => {
  try {
    const result = await service.updateSysJobLog(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/get/:id', async(req, res) => {
  try {
    const result = await service.getSysJobLogById(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/remove/:id', async(req, res) => {
  try {
    const result = await service.deleteSysJobLog(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/removeBatch/:id', async(req, res) => {
  try {
    const result = await service.deleteSysJobLogs(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

module.exports = { router, routePrefix };