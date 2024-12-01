const express = require('express');
const router = express.Router();
const imageService = require('../services/imageService');

// 定义路由前缀
const routePrefix = 'images';

router.get('/get', imageService.getImage);
router.post('/', imageService.createImage);
router.get('/', imageService.getAllImages);
router.get('/:id', imageService.getImageById);

module.exports = { router, routePrefix };