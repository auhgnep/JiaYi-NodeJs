const express = require('express');
const router = express.Router();
const service = require('../services/sysDictDataService');

const routePrefix = 'sysDictData';

router.get('/list', async(req, res) => {
  try {
    const result = await service.getAllSysDictDatas(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/page', async(req, res) => {
  try {
    const result = await service.getSysDictDatas(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.post('/', async(req, res) => {
  try {
    const result = await service.createSysDictData(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.patch('/:id', async(req, res) => {
  try {
    const result = await service.updateSysDictData(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/:id', async(req, res) => {
  try {
    const result = await service.getSysDictDataById(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/:id', async(req, res) => {
  try {
    const result = await service.deleteSysDictData(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/batch/:id', async(req, res) => {
  try {
    const result = await service.deleteSysDictDatas(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

module.exports = { router, routePrefix };