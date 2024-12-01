const path = require('path');
const { v4: uuidv4 } = require('uuid');
const COS = require('cos-nodejs-sdk-v5');
const Image = require('../models/image');
const config = require('../config');

const cos = new COS({
  SecretId: config.cos.secretId,
  SecretKey: config.cos.secretKey,
});

exports.getImage = async (req, res) => {
  try {
    const { Key } = req.query;
    const Bucket = 'bqb-1321633985';
    const Region = 'ap-guangzhou';

    if (!Key) {
      return res.status(400).json({ error: 'Missing required parameter: Key' });
    }

    cos.getObject({
      Bucket,
      Region,
      Key,
    }, (err, data) => {
      if (err) {
        console.error('Error getting object from COS:', err);
        return res.status(500).json({ error: 'Failed to download image from COS' });
      }

      const contentType = data.headers['content-type'];
      res.setHeader('Content-Type', contentType);

      const originalExtension = path.extname(Key);
      const newFilename = `${uuidv4()}${originalExtension}`;

      res.setHeader('Content-Disposition', `attachment; filename="${newFilename}"`);
      res.send(data.Body);
    });
  } catch (error) {
    console.error('Error in getImage:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createImage = async (req, res) => {
  try {
    const { filename, url, tag } = req.body;
    const image = await Image.create({ filename, url, tag });
    res.status(201).json(image);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.findAll();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getImageById = async (req, res) => {
  try {
    const image = await Image.findByPk(req.params.id);
    if (image) {
      res.json(image);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};