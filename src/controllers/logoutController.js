const express = require('express');
const router = express.Router();
const service = require('../services/loginService');

// 定义路由前缀
const routePrefix = 'logout';

router.post('/', service.userLogout);

module.exports = { router, routePrefix };