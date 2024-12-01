const express = require('express');
const router = express.Router();
const service = require('../services/commonFile');

// 定义路由前缀
const routePrefix = 'commonFile';

router.post('/upload', async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      throw new Error('文件为空');
    }
    const uploadedFile = req.files.file; // 文件字段名为 'file'
    
    const result = await service.uploadFile(uploadedFile);
    res.success(result, "上传成功")
  } catch(error) {
    res.error(error.message);
  }
  
});

router.get('/download', async (req, res) => {
  try {
    await service.downloadFile(req, res);
  } catch(error) {
    res.error(error.message);
  }
});

router.delete('/remove', async (req, res) => {
  try {
    if (!req.query.filePath) {
      throw new Error('文件路径不能为空');
    }

    await service.removeFile(req.query.filePath);
    res.success(null, "删除成功")
  } catch(error) {
    res.error(error.message);
  }
});

module.exports = { router, routePrefix };