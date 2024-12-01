const jwt = require('jsonwebtoken');
const config = require('config');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.query.token;  // 从 Bearer token 中提取 token

  if (!token) {
    return res.error('未提供认证令牌', 401);
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;  // 将解码后的用户信息添加到请求对象
    next();
  } catch (error) {
    return res.error('无效的认证令牌', 401);
  }
};