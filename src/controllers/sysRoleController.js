const express = require('express');
const router = express.Router();
const service = require('../services/sysRoleService');
const deptService = require('../services/sysDeptService');

const routePrefix = 'sysRole';

router.get('/list', async(req, res) => {
  try {
    const result = await service.getAllSysRoles(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/page', async(req, res) => {
  try {
    const result = await service.getSysRoles(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.post('/', async(req, res) => {
  try {
    const result = await service.createSysRole(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.patch('/update/:id', async(req, res) => {
  try {
    const result = await service.updateSysRole(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/get/:id', async(req, res) => {
  try {
    const result = await service.getSysRoleById(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/:id', async(req, res) => {
  try {
    const result = await service.deleteSysRole(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/batch/:id', async(req, res) => {
  try {
    const result = await service.deleteSysRoles(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.patch('/changeStatus', async(req, res) => {
  try {
    const result = await service.changeUseFlag(req, req)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/deptTree/:roleId', async(req, res) => {
  try {
    const userId = (req.user || {}).userId
    const roleId = req.params.roleId
    const deptTree = await deptService.getDeptTree(userId)
    const checkedKeys = await service.findCheckRoleDept(userId)
    const result = {
      depts: deptTree,
      checkedKeys: checkedKeys
    }
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.patch('/dataScope', async(req, res) => {
  try {
    const result = await service.updateDataScope(req)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});


module.exports = { router, routePrefix };