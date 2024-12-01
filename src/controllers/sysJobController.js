const express = require('express');
const router = express.Router();
const service = require('../services/sysJobService');

const routePrefix = 'sysJob';

router.get('/list', async(req, res) => {
  try {
    const result = await service.getAllSysJobs(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/page', async(req, res) => {
  try {
    const result = await service.getSysJobs(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.post('/', async(req, res) => {
  try {
    const result = await service.createSysJob(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.patch('/update/:id', async(req, res) => {
  try {
    const result = await service.updateSysJob(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/get/:id', async(req, res) => {
  try {
    const result = await service.getSysJobById(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/remove/:id', async(req, res) => {
  try {
    const result = await service.deleteSysJob(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/removeBatch/:id', async(req, res) => {
  try {
    const result = await service.deleteSysJobs(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.patch('/run', async(req, res) => {
  try {
    const result = await service.runOnce(req.body.jobId)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

module.exports = { router, routePrefix };