const express = require('express');
const router = express.Router();
const service = require('../services/sysNoticeService');

const routePrefix = 'sysNotice';

router.get('/list', async(req, res) => {
  try {
    const result = await service.getAllSysNotices(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/page', async(req, res) => {
  try {
    const result = await service.getSysNotices(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.post('/', async(req, res) => {
  try {
    const result = await service.createSysNotice(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.patch('/update/:id', async(req, res) => {
  try {
    const result = await service.updateSysNotice(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/get/:id', async(req, res) => {
  try {
    const result = await service.getSysNoticeById(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/remove/:id', async(req, res) => {
  try {
    const result = await service.deleteSysNotice(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/removeBatch/:id', async(req, res) => {
  try {
    const result = await service.deleteSysNotices(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

module.exports = { router, routePrefix };