const config = require('../config');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const crypto = require('crypto');

// 生成唯一文件名
function generateUniqueFilename(originalFilename) {
  // 获取文件扩展名
  const ext = path.extname(originalFilename);
  const nameWithoutExt = path.basename(originalFilename, ext);
  
  // 生成时间戳
  const timestamp = new Date().getTime();
  
  // 生成6位随机字符串
  const randomString = crypto.randomBytes(3).toString('hex');
  
  // 组合新文件名: 原文件名_时间戳_随机字符串.扩展名
  return `${nameWithoutExt}_${timestamp}_${randomString}${ext}`;
}

// 创建日期目录结构
async function createDateDirectories(baseDir) {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');

  const yearDir = path.join(baseDir, year);
  const monthDir = path.join(yearDir, month);
  const dayDir = path.join(monthDir, day);

  try {
    // 递归创建目录
    await fs.mkdir(yearDir, { recursive: true });
    await fs.mkdir(monthDir, { recursive: true });
    await fs.mkdir(dayDir, { recursive: true });

    return dayDir;
  } catch (error) {
    throw new Error(`创建文件目录失败: ${error.message}`);
  }
}

// 上传文件
const uploadFile = async (uploadedFile) => {
  const baseDir = config.filePath;
  
  // 创建日期目录结构
  const targetDir = await createDateDirectories(baseDir);
  
  // 生成完整的文件保存路径
  const originalFileName = uploadedFile.name;
  const uniqueFileName = generateUniqueFilename(originalFileName);

  const filePath = path.join(targetDir, uniqueFileName);

  // 移动上传的文件到目标路径
  await fs.writeFile(filePath, uploadedFile.data);

  // 计算相对路径（用于后续下载）
  const relativePath = path.relative(baseDir, filePath);

  return {
    fileName: uniqueFileName,
    path: relativePath.replace(/\\/g, '/') // 统一使用正斜杠
  };
  
};

// 下载文件
const downloadFile = async (req, res) => {
  if (!req.query.filePath) {
    throw new Error('文件路径不能为空');
  }
  const fullPath = path.join(config.filePath, req.query.filePath);

  // 检查文件是否存在
  await fs.access(fullPath);

  // 获取文件信息
  const stat = await fs.stat(fullPath);
  
  if (!stat.isFile()) {
    throw new Error('文件不存在');
  }

  // 获取文件名并进行编码
  const filename = path.basename(fullPath);
  // 使用 encodeURIComponent 对文件名进行 URL 编码
  const encodedFilename = encodeURIComponent(filename);
  
  // 设置响应头
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Type', 'application/octet-stream');
  // RFC 5987 格式的文件名编码
  res.setHeader(
    'Content-Disposition', 
    `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`
  );

  // 使用 fsSync.createReadStream 创建文件流
  const fileStream = fsSync.createReadStream(fullPath);
  
  // 错误处理
  fileStream.on('error', (error) => {
    console.error('文件流错误:', error);
    throw new Error('文件下载失败');
  });

  // 将文件流传输给客户端
  fileStream.pipe(res);
};

// 删除文件
const removeFile = async (filePath) => {
  const fullPath = path.join(config.filePath, filePath);

  // 检查文件是否存在
  await fs.access(fullPath);

  // 获取文件信息
  const stat = await fs.stat(fullPath);
  
  if (!stat.isFile()) {
    throw new Error('文件不存在');
  }

  // 删除文件
  await fs.unlink(fullPath);
};

module.exports = {
  uploadFile,
  downloadFile,
  removeFile
};