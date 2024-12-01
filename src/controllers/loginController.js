const express = require('express');
const router = express.Router();
const service = require('../services/loginService');

// 定义路由前缀
const routePrefix = 'login';

router.post('/', service.userLogin);

module.exports = { router, routePrefix };