const express = require('express');
const router = express.Router();
const service = require('../services/sysDeptService');

// 定义路由前缀
const routePrefix = 'sysDept';

router.get('/list', service.getAllSysDepts);
router.get('/page', service.getSysDepts);
router.post('/', service.createSysDept);
router.patch('/update/:id', service.updateSysDept);
router.get('/get/:id', service.getSysDeptById);
router.delete('/:id', service.deleteSysDept);
router.get('/exclude/:id', service.getExcludeSysDepts);
router.get('/user/deptTree', service.getDeptTree);

module.exports = { router, routePrefix };