const express = require('express');
const router = express.Router();
const service = require('../services/sysConfigService');

const routePrefix = 'sysConfig';

router.get('/list', async(req, res) => {
  try {
    const result = await service.getAllSysConfigs(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/page', async(req, res) => {
  try {
    const result = await service.getSysConfigs(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.post('/', async(req, res) => {
  try {
    const result = await service.createSysConfig(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.patch('/:id', async(req, res) => {
  try {
    const result = await service.updateSysConfig(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/:id', async(req, res) => {
  try {
    const result = await service.getSysConfigById(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/:id', async(req, res) => {
  try {
    const result = await service.deleteSysConfig(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/batch/:id', async(req, res) => {
  try {
    const result = await service.deleteSysConfigs(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/configKey/:key', async(req, res) => {
  try {
    const result = await service.getSysConfigsByKey(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});


module.exports = { router, routePrefix };