const express = require('express');
const router = express.Router();
const service = require('../services/sysMenuService');

const routePrefix = 'sysMenu';

router.get('/list', async(req, res) => {
  try {
    const result = await service.getAllSysMenus(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/page', async(req, res) => {
  try {
    const result = await service.getSysMenus(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.post('/', async(req, res) => {
  try {
    const result = await service.createSysMenu(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.patch('/:id', async(req, res) => {
  try {
    const result = await service.updateSysMenu(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/treeselect', async(req, res) => {
  try {
    const userId = (req.user || {}).userId
    const result = await service.getTreeselect(userId)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/:id', async(req, res) => {
  try {
    const result = await service.getSysMenuById(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/:id', async(req, res) => {
  try {
    const result = await service.deleteSysMenu(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/batch/:id', async(req, res) => {
  try {
    const result = await service.deleteSysMenus(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

module.exports = { router, routePrefix };