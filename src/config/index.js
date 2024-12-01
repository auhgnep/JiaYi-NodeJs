module.exports = {
    data: {
      database: 'jiayi',
      username: 'root',
      password: '123456',
      host: 'localhost',
      dialect: 'mysql'
    },
    redis: {
      host: '127.0.0.1',
      port: '6379',
      password: '123456',
      db: '0',
    },
    jwt: {
      secret: 'open-secret-key', 
      expiresIn: '24h'
    },
    cos: {
      secretId: 'AKIDTPBl8JI5nIpJhx2ufIl2LUyJSSGEC0d4',
      secretKey: 'KUTOFAxzpTwEI9oHYcVCg8Wt7IMLBrOm',
      bucket: 'bqb-1321633985',
      region: 'ap-guangzhou'
    },
    filePath: '/home/node-backed/uploadPath',
    server: {
      port: 8080
    }
  };