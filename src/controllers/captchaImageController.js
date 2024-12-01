const express = require('express');
const router = express.Router();
const service = require('../services/captchaImageService');

// 定义路由前缀
const routePrefix = 'captchaImage';

router.get('/', service.generateMixedCode);

module.exports = { router, routePrefix };