// 响应状态码枚举
const ResponseCode = {
    SUCCESS: 200,
    CREATED: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
  };
  
  // 响应消息枚举
  const ResponseMessage = {
    SUCCESS: "操作成功",
    CREATED: "创建成功",
    UPDATED: "更新成功",
    DELETED: "删除成功",
    ERROR: "操作失败",
    NOT_FOUND: "资源不存在",
    VALIDATION_ERROR: "参数验证失败"
  };
  
  // 统一返回结构
  class ResponseResult {
    constructor(data, code = ResponseCode.SUCCESS, msg = ResponseMessage.SUCCESS) {
      this.code = code;
      this.data = data;
      this.msg = msg;
    }
  
    static success(data, msg = ResponseMessage.SUCCESS) {
      return new ResponseResult(data, ResponseCode.SUCCESS, msg);
    }
  
    static created(data, msg = ResponseMessage.CREATED) {
      return new ResponseResult(data, ResponseCode.CREATED, msg);
    }
  
    static error(msg = ResponseMessage.ERROR, code = ResponseCode.INTERNAL_ERROR) {
      return new ResponseResult(null, code, msg);
    }
  
    static notFound(msg = ResponseMessage.NOT_FOUND) {
      return new ResponseResult(null, ResponseCode.NOT_FOUND, msg);
    }
  }
  
  // Express 中间件，用于包装响应
  const responseMiddleware = (req, res, next) => {
    // 扩展 res 对象，添加统一的响应方法
    res.success = (data, msg) => {
      res.json(ResponseResult.success(data, msg));
    };
  
    res.created = (data, msg) => {
      res.status(200).json(ResponseResult.created(data, msg));
    };
  
    res.error = (msg, code) => {
      res.status(200).json(ResponseResult.error(msg, code || 201));
    };
  
    res.notFound = (msg) => {
      res.status(404).json(ResponseResult.notFound(msg));
    };

    res.fail = (msg, code) => {
      res.status(code).json(ResponseResult.error(msg, code || 201));
    };
  
    next();
  };
  
  module.exports = {
    ResponseResult,
    ResponseCode,
    ResponseMessage,
    responseMiddleware
  };