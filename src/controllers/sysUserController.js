const express = require('express');
const router = express.Router();
const service = require('../services/sysUserService');
const routerService = require('../services/sysUserRouterService');

const routePrefix = 'sysUser';

router.get('/list', async(req, res) => {
  try {
    const result = await service.getAllSysUsers(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/page', async(req, res) => {
  try {
    const result = await service.getSysUsers(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.post('/', async(req, res) => {
  try {
    const result = await service.createSysUser(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.patch('/updatePwd', async(req, res) => {
  try {
    const userId = (req.user || {}).userId
    const result = await service.updatePwd(userId, req.body)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.patch('/update/:id', async(req, res) => {
  try {
    const result = await service.updateSysUser(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/get/:id', async(req, res) => {
  try {
    const result = await service.getSysUserById(req.params.id)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/batch/:id', async(req, res) => {
  try {
    const result = await service.deleteSysUsers(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/:id', async(req, res) => {
  try {
    const result = await service.deleteSysUser(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/addInfo', async(req, res) => {
  try {
    const userId = (req.user || {}).userId
    const result = await service.getUserAddInfo(userId)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});


router.get('/getRouters', async(req, res) => {
  try {
    const userId = (req.user || {}).userId
    const result = await routerService.getRouters(userId)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/getInfo', async(req, res) => {
  try {
    const userId = (req.user || {}).userId
    const result = await service.getInfo(userId)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.patch('/profile/update/:id', async(req, res) => {
  try {
    const result = await service.mergeSysUser(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/profile', async(req, res) => {
  try {
    const userId = (req.user || {}).userId
    const result = await service.getSysUserById(userId)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.post('/profile/avatar', async(req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      throw new Error('文件为空');
    }

    const uploadedFile = req.files.avatarfile;
    if (!uploadedFile) {
      throw new Error('文件为空');
    }

    const userId = (req.user || {}).userId
    const result = await service.updateAvatar(userId, uploadedFile)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/authRole/:id', async(req, res) => {
  try {
    const userId = (req.user || {}).userId
    const result = await service.getAuthRole(userId, req.params.id)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.patch('/authRole', async(req, res) => {
  try {
    const result = await service.updateAuthRole(req.body.userId, req.body.roleIds)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.post('/importData', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      throw new Error('请选择要上传的文件');
    }

    const file = req.files.file;
    
    // 验证文件类型
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      throw new Error('只允许上传 Excel 文件');
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('文件大小不能超过 5MB');
    }

    // 修改 req 对象，添加 file 属性以兼容现有的 importUsers 方法
    req.file = {
      buffer: file.data,
      originalname: file.name,
      mimetype: file.mimetype,
      size: file.size
    };

    const result = await service.importData(req);
    res.success(result, '导入成功');
  } catch (error) {
    res.error(error.message);
  }
});

router.get('/export', async (req, res) => {
  try {
    const result = await service.exportData(req);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const encodedFilename = encodeURIComponent(result.originalname || result.filename);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"; filename*=UTF-8''${encodedFilename}`);
    
    res.send(result.buffer);
  } catch (error) {
    res.status(400).json({
      code: 400,
      msg: error.message
    });
  }
});

router.get('/importTemplate', async (req, res) => {
  try {
    const result = service.getImportTemplate();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const encodedFilename = encodeURIComponent(result.filename);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"; filename*=UTF-8''${encodedFilename}`);
    
    res.send(result.buffer);
  } catch (error) {
    res.status(400).json({
      code: 400,
      msg: error.message
    });
  }
});

router.patch('/changeStatus', async(req, res) => {
  try {
    const result = await service.changeUseFlag(req.body.userId, req.body.useFlag)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

module.exports = { router, routePrefix };