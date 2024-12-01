const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database');
const { v4: uuidv4 } = require('uuid');

const SysOperLog = sequelize.define('sys_oper_log', {
    operId: {
      type: DataTypes.INTEGER(10),
      field: 'oper_id',
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: "日志主键"
    },

    title: {
      type: DataTypes.STRING(50),
      field: 'title',
      defaultValue: "",
      comment: "模块标题"
    },

    businessType: {
      type: DataTypes.INTEGER,
      field: 'business_type',
      defaultValue: "0",
      comment: "业务类型（0其它 1新增 2修改 3删除）"
    },

    method: {
      type: DataTypes.STRING(200),
      field: 'method',
      defaultValue: "",
      comment: "方法名称"
    },

    requestMethod: {
      type: DataTypes.STRING(10),
      field: 'request_method',
      defaultValue: "",
      comment: "请求方式"
    },

    operatorType: {
      type: DataTypes.INTEGER,
      field: 'operator_type',
      defaultValue: "0",
      comment: "操作类别（0其它 1后台用户 2手机端用户）"
    },

    operName: {
      type: DataTypes.STRING(50),
      field: 'oper_name',
      defaultValue: "",
      comment: "操作人员"
    },

    deptName: {
      type: DataTypes.STRING(50),
      field: 'dept_name',
      defaultValue: "",
      comment: "部门名称"
    },

    operUrl: {
      type: DataTypes.STRING(255),
      field: 'oper_url',
      defaultValue: "",
      comment: "请求URL"
    },

    operIp: {
      type: DataTypes.STRING(128),
      field: 'oper_ip',
      defaultValue: "",
      comment: "主机地址"
    },

    operLocation: {
      type: DataTypes.STRING(255),
      field: 'oper_location',
      defaultValue: "",
      comment: "操作地点"
    },

    operParam: {
      type: DataTypes.STRING(2000),
      field: 'oper_param',
      defaultValue: "",
      comment: "请求参数"
    },

    jsonResult: {
      type: DataTypes.STRING(2000),
      field: 'json_result',
      defaultValue: "",
      comment: "返回参数"
    },

    operStatus: {
      type: DataTypes.INTEGER,
      field: 'oper_status',
      defaultValue: "0",
      comment: "操作状态（0正常 1异常）"
    },

    status: {
      type: DataTypes.STRING(1),
      field: 'status',
      defaultValue: "0",
      comment: "状态（0正常 2删除）"
    },

    errorMsg: {
      type: DataTypes.STRING(2000),
      field: 'error_msg',
      defaultValue: "",
      comment: "错误消息"
    },

    operTime: {
      type: DataTypes.DATE,
      field: 'oper_time',
      comment: "操作时间"
    },

    costTime: {
      type: DataTypes.BIGINT,
      field: 'cost_time',
      defaultValue: "0",
      comment: "消耗时间"
    },

    createBy: {
      type: DataTypes.STRING(64),
      field: 'create_by',
      defaultValue: "",
      comment: "创建者"
    },

    createTime: {
      type: DataTypes.DATE,
      field: 'create_time',
      comment: "创建时间"
    },

    updateBy: {
      type: DataTypes.STRING(64),
      field: 'update_by',
      defaultValue: "",
      comment: "更新者"
    },

    updateTime: {
      type: DataTypes.DATE,
      field: 'update_time',
      comment: "更新时间"
    },

    remark: {
      type: DataTypes.STRING(500),
      field: 'remark',
      defaultValue: "",
      comment: "备注"
    }
}, {
  tableName: 'sys_oper_log',
  timestamps: false,
  underscored: true,  // 启用字段映射
  freezeTableName: true  // 固定表名
});

module.exports = SysOperLog;