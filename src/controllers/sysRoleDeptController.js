const express = require('express');
const router = express.Router();
const service = require('../services/sysRoleDeptService');

const routePrefix = 'sysRoleDept';

router.get('/list', async(req, res) => {
  try {
    const result = await service.getAllSysRoleDepts(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/page', async(req, res) => {
  try {
    const result = await service.getSysRoleDepts(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.post('/', async(req, res) => {
  try {
    const result = await service.createSysRoleDept(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.patch('/update/:id', async(req, res) => {
  try {
    const result = await service.updateSysRoleDept(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.get('/get/:id', async(req, res) => {
  try {
    const result = await service.getSysRoleDeptById(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/remove/:id', async(req, res) => {
  try {
    const result = await service.deleteSysRoleDept(req, res)
    res.success(result, '操作成功');
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/removeBatch/:id', async(req, res) => {
  try {
    const result = await service.deleteSysRoleDepts(req, res)
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

module.exports = { router, routePrefix };