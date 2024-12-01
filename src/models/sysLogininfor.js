const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database');
const { v4: uuidv4 } = require('uuid');

const SysLogininfor = sequelize.define('sys_logininfor', {
    infoId: {
      type: DataTypes.INTEGER(10),
      field: 'info_id',
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: "访问ID"
    },

    userName: {
      type: DataTypes.STRING(50),
      field: 'user_name',
      defaultValue: "",
      comment: "用户账号"
    },

    ipaddr: {
      type: DataTypes.STRING(128),
      field: 'ipaddr',
      defaultValue: "",
      comment: "登录IP地址"
    },

    loginLocation: {
      type: DataTypes.STRING(255),
      field: 'login_location',
      defaultValue: "",
      comment: "登录地点"
    },

    browser: {
      type: DataTypes.STRING(50),
      field: 'browser',
      defaultValue: "",
      comment: "浏览器类型"
    },

    os: {
      type: DataTypes.STRING(50),
      field: 'os',
      defaultValue: "",
      comment: "操作系统"
    },

    loginStatus: {
      type: DataTypes.STRING(1),
      field: 'login_status',
      defaultValue: "0",
      comment: "登录状态（0成功 1失败）"
    },

    status: {
      type: DataTypes.STRING(1),
      field: 'status',
      defaultValue: "0",
      comment: "状态（0正常 2删除）"
    },

    msg: {
      type: DataTypes.STRING(255),
      field: 'msg',
      defaultValue: "",
      comment: "提示消息"
    },

    loginTime: {
      type: DataTypes.DATE,
      field: 'login_time',
      comment: "访问时间"
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
    }
}, {
  tableName: 'sys_logininfor',
  timestamps: false,
  underscored: true,  // 启用字段映射
  freezeTableName: true  // 固定表名
});

module.exports = SysLogininfor;