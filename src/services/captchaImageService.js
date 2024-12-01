const { createCanvas } = require('canvas');
const crypto = require('crypto');
const redisClient = require('../utils/redisClient');

class CaptchaImageService {
    constructor() {
        this.generateMixedCodeApi = this.generateMixedCodeApi.bind(this);
        this.generateMixedCode = this.generateMixedCode.bind(this);
        this.drawInterferenceLine = this.drawInterferenceLine.bind(this);
        this.drawInterferencePoints = this.drawInterferencePoints.bind(this);
    }

    // 生成随机混合验证码
    generateMixedCode() {
        const numbers = '0123456789';
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = '';
        
        // 确保至少包含一个数字和一个字母
        const randomNumber = numbers[crypto.randomBytes(1)[0] % numbers.length];
        const randomLetter = letters[crypto.randomBytes(1)[0] % letters.length];
        
        code += randomNumber + randomLetter;
        
        // 添加剩余两个随机字符
        const chars = numbers + letters;
        for (let i = 0; i < 2; i++) {
            const randomByte = crypto.randomBytes(1)[0];
            code += chars[randomByte % chars.length];
        }
        
        // 打乱字符顺序
        return code.split('').sort(() => crypto.randomBytes(1)[0] - 128).join('');
    }

    // 生成随机颜色
    getRandomColor(min = 0, max = 255) {
        return Math.floor(min + Math.random() * (max - min));
    }

    // 生成干扰线
    drawInterferenceLine(ctx, width, height) {
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const r = this.getRandomColor(0, 200);
            const g = this.getRandomColor(0, 200);
            const b = this.getRandomColor(0, 200);
            ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
            
            ctx.beginPath();
            ctx.moveTo(Math.random() * width, Math.random() * height);
            ctx.bezierCurveTo(
                Math.random() * width, Math.random() * height,
                Math.random() * width, Math.random() * height,
                Math.random() * width, Math.random() * height
            );
            ctx.stroke();
        }
    }

    // 生成干扰点
    drawInterferencePoints(ctx, width, height) {
        for (let i = 0; i < 30; i++) {
            const radius = Math.random() * 2;
            const r = this.getRandomColor();
            const g = this.getRandomColor();
            const b = this.getRandomColor();
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
            
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, radius, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    // 生成验证码图片
    async generateMixedCodeApi(req, res) {
        try {
            // 创建 canvas
            const width = 120;
            const height = 40;
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');

            // 设置背景
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, width, height);
            
            // 生成验证码
            const code = this.generateMixedCode();
            const uuid = crypto.randomUUID();

            // 绘制干扰线和点
            this.drawInterferenceLine(ctx, width, height);
            this.drawInterferencePoints(ctx, width, height);

            // 绘制验证码文字
            for (let i = 0; i < code.length; i++) {
                const x = (width * (i + 1)) / (code.length + 1);
                const y = height / 2;
                
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate((Math.random() - 0.5) * 0.4);
                
                // 随机字体大小
                const fontSize = Math.floor(24 + Math.random() * 6);
                ctx.font = `bold ${fontSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // 生成深色
                const r = this.getRandomColor(0, 100);
                const g = this.getRandomColor(0, 100);
                const b = this.getRandomColor(0, 100);
                
                // 添加描边
                ctx.strokeStyle = `rgba(${r + 100}, ${g + 100}, ${b + 100}, 0.5)`;
                ctx.lineWidth = 1;
                ctx.strokeText(code[i], 0, 0);
                
                // 填充文字
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fillText(code[i], 0, 0);
                
                ctx.restore();
            }

            // 添加渐变背景
            ctx.globalCompositeOperation = 'destination-over';
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, `rgba(${this.getRandomColor()}, ${this.getRandomColor()}, ${this.getRandomColor()}, 0.1)`);
            gradient.addColorStop(1, `rgba(${this.getRandomColor()}, ${this.getRandomColor()}, ${this.getRandomColor()}, 0.1)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // 转换为 buffer 并设置为 PNG 格式
            const buffer = canvas.toBuffer('image/png');
            const base64Image = buffer.toString('base64');

            // 将验证码存入Redis，设置5分钟过期时间
            const captchaKey = `captcha:${uuid}`;
            await redisClient.set(captchaKey, code, 300); // 300秒 = 5分钟

            return res.status(200).send({
                code: 200,
                msg: "验证码生成成功",
                img: base64Image,
                uuid: uuid,
                // captchaCode: code // 注意：实际生产环境中应该存储到 Redis 而不是直接返回
            });
        } catch (error) {
            console.error('生成验证码图片出错:', error);
            return res.status(500).send({
                code: 500,
                msg: "生成验证码失败",
                error: error.message
            });
        }
    }
}

// 创建实例
const captchaImageService = new CaptchaImageService();

// 导出服务实例的方法
module.exports = {
    generateMixedCode: captchaImageService.generateMixedCodeApi
};