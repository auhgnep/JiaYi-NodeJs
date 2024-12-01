const Redis = require('redis');
const { promisify } = require('util');
const config = require('config');

class RedisClient {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.getAsync = null;
        this.setAsync = null;
        this.delAsync = null;
        this.existsAsync = null;
        this.expireAsync = null;
    }

    async connect() {
        try {
            this.client = Redis.createClient({
                legacyMode: true,
                socket: {
                    host: config.redis.host,
                    port: config.redis.port,
                    reconnectStrategy: (retries) => {
                        if (retries > 10) {
                            return new Error('Max retry attempts reached');
                        }
                        return Math.min(retries * 100, 3000);
                    }
                },
                password: config.redis.password,
                db: config.redis.db
            });

            // 事件监听
            this.client.on('connect', () => {
                console.log('Redis client connecting...');
            });

            this.client.on('ready', () => {
                console.log('Redis client ready');
                this.isConnected = true;
            });

            this.client.on('error', (err) => {
                console.error('Redis Client Error:', err);
                this.isConnected = false;
            });

            this.client.on('end', () => {
                console.log('Redis client disconnected');
                this.isConnected = false;
            });

            // 连接到Redis服务器
            await this.client.connect();

            // 初始化 promisify 方法
            this.getAsync = promisify(this.client.get).bind(this.client);
            this.setAsync = promisify(this.client.set).bind(this.client);
            this.delAsync = promisify(this.client.del).bind(this.client);
            this.existsAsync = promisify(this.client.exists).bind(this.client);
            this.expireAsync = promisify(this.client.expire).bind(this.client);

            // 测试连接
            await this.client.ping();
            console.log('Redis connection test successful');

            return this.client;
        } catch (error) {
            console.error('Failed to connect to Redis:', error);
            throw error;
        }
    }

    getClient() {
        if (!this.isConnected) {
            throw new Error('Redis client is not connected');
        }
        return this.client;
    }

    async disconnect() {
        if (this.client) {
            await this.client.quit();
            this.isConnected = false;
            console.log('Redis connection closed');
        }
    }

    async set(key, value, expireSeconds = null) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            
            if (expireSeconds) {
                await this.setAsync(key, value, 'EX', expireSeconds);
            } else {
                await this.setAsync(key, value);
            }
            
            // 验证存储是否成功
            const storedValue = await this.get(key);
        } catch (error) {
            console.error('Redis set error:', error);
            throw error;
        }
    }

    async get(key) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            
            const value = await this.getAsync(key);
            return value;
        } catch (error) {
            console.error('Redis get error:', error);
            throw error;
        }
    }

    async del(key) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            await this.delAsync(key);
        } catch (error) {
            console.error('Redis del error:', error);
            throw error;
        }
    }

    async exists(key) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.existsAsync(key);
        } catch (error) {
            console.error('Redis exists error:', error);
            throw error;
        }
    }

    async expire(key, seconds) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.expireAsync(key, seconds);
        } catch (error) {
            console.error('Redis expire error:', error);
            throw error;
        }
    }
}

// 创建单例实例
const redisClient = new RedisClient();

// 初始化连接
(async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error('Initial Redis connection failed:', error);
    }
})();

module.exports = redisClient;