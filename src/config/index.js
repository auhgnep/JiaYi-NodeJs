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
    filePath: '/home/node-backed/uploadPath',
    server: {
      port: 8080
    }
  };