const jwt = require('jsonwebtoken');
const config = require('../config');
const SysUser = require('../models/sysUser');
const bcrypt = require('bcrypt');
const redisClient = require('../utils/redisClient');
const { createSysLogininfor } = require('./sysLogininforService');

// 获取客户端信息的辅助函数
const getClientInfo = (req) => {
  const userAgent = req.headers['user-agent'] || '';
  // 这里可以使用更复杂的UA解析库，这里做简单示例
  const browser = userAgent.includes('Chrome') ? 'Chrome' : 
                 userAgent.includes('Firefox') ? 'Firefox' : 
                 userAgent.includes('Safari') ? 'Safari' : 'Unknown';
  
  const os = userAgent.includes('Windows') ? 'Windows' : 
            userAgent.includes('Mac') ? 'MacOS' : 
            userAgent.includes('Linux') ? 'Linux' : 'Unknown';
  
  return { browser, os };
};

const formatIp = (ip) => {
  // 如果是 IPv4 映射的 IPv6 地址
  if (ip.startsWith('::ffff:')) {
    return ip.substring(7);
  }
  return ip;
};

const getClientIp = (req) => {
  return formatIp(
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.headers['x-client-ip'] ||
    req.ip ||
    req.connection.remoteAddress
  );
};

exports.userLogin = async (req, res) => {
  const clientIp = getClientIp(req)
  const { browser, os } = getClientInfo(req);
  
  const { username, password, code: captchaCode, uuid } = req.body;
  // 准备日志对象
  const loginLog = {
    userName: username,
    ipaddr: clientIp,
    loginLocation: '内网IP',
    browser,
    os,
    loginTime: new Date(),
    loginStatus: '0', // 默认成功
    msg: '登录成功'
  };

  try {
    // 参数验证
    if (!username || !password) {
      loginLog.loginStatus = '1';
      loginLog.msg = '用户名和密码不能为空';
      await createSysLogininfor({ body: loginLog });
      return res.error('用户名和密码不能为空', 201);
    }

    // 验证码验证
    if (!captchaCode || !uuid) {
      loginLog.loginStatus = '1';
      loginLog.msg = '验证码不能为空';
      await createSysLogininfor({ body: loginLog });
      return res.error('验证码不能为空', 201);
    }

    // 验证码校验
    const captchaKey = `captcha:${uuid}`;
    const storedCaptcha = await redisClient.get(captchaKey);

    if (!storedCaptcha) {
      loginLog.loginStatus = '1';
      loginLog.msg = '验证码已过期';
      await createSysLogininfor({ body: loginLog });
      return res.error('验证码已过期，请重新获取', 201);
    }

    if (storedCaptcha.toLowerCase() !== captchaCode.toLowerCase()) {
      loginLog.loginStatus = '1';
      loginLog.msg = '验证码错误';
      await createSysLogininfor({ body: loginLog });
      return res.error('验证码错误', 201);
    }

    await redisClient.del(captchaKey);

    // 查找用户
    const user = await SysUser.findOne({
      where: {
        userName: username
      }
    });

    if (!user) {
      loginLog.loginStatus = '1';
      loginLog.msg = '用户名或密码错误';
      await createSysLogininfor({ body: loginLog });
      return res.error('用户名或密码错误', 201);
    }

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      loginLog.loginStatus = '1';
      loginLog.msg = '用户名或密码错误';
      await createSysLogininfor({ body: loginLog });
      return res.error('用户名或密码错误', 201);
    }

    // 生成 JWT token
    const token = jwt.sign(
      {
        userId: user.userId,
        username: user.userName
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    await user.update({
      userId: user.userId,
      loginDate: new Date()
    });

    // 记录成功登录日志
    await createSysLogininfor({ body: loginLog });

    // 返回用户信息和 token
    const userInfo = {
      id: user.id,
      username: user.userName,
      token: token
    };

    res.success(userInfo, '登录成功');

  } catch (error) {
    console.error('Login error:', error);
    
    loginLog.loginStatus = '1';
    loginLog.msg = '系统错误：' + error.message;
    await createSysLogininfor({ body: loginLog });
    res.error('服务器内部错误', 500);
  }
};

exports.userLogout = async (req, res) => {
  try {
    const clientIp = getClientIp(req)
    const { browser, os } = getClientInfo(req);
    
    // 记录登出日志
    const logoutLog = {
      userName: req.user?.username || '',
      ipaddr: clientIp,
      loginLocation: '内网IP',
      browser,
      os,
      loginTime: new Date(),
      loginStatus: '0',
      msg: '登出成功'
    };
    
    await createSysLogininfor({ body: logoutLog });
    res.success('注销成功');
  } catch (error) {
    console.error('Logout error:', error);
    res.error('注销失败', 500);
  }
};