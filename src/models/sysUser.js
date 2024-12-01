const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database');
const { v4: uuidv4 } = require('uuid');
const { format } = require('date-fns');

const SysUser = sequelize.define('sys_user', {
    userId: {
      type: DataTypes.INTEGER(10),
      field: 'user_id',
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: "用户ID"
    },

    deptId: {
      type: DataTypes.INTEGER(10),
      field: 'dept_id',
      comment: "部门ID"
    },

    userName: {
      type: DataTypes.STRING(30),
      field: 'user_name',
      comment: "用户账号"
    },

    nickName: {
      type: DataTypes.STRING(30),
      field: 'nick_name',
      comment: "用户昵称"
    },

    userType: {
      type: DataTypes.STRING(2),
      field: 'user_type',
      defaultValue: "00",
      comment: "用户类型（00系统用户）"
    },

    email: {
      type: DataTypes.STRING(50),
      field: 'email',
      defaultValue: "",
      comment: "用户邮箱"
    },

    phonenumber: {
      type: DataTypes.STRING(11),
      field: 'phonenumber',
      defaultValue: "",
      comment: "手机号码"
    },

    sex: {
      type: DataTypes.STRING(1),
      field: 'sex',
      defaultValue: "0",
      comment: "用户性别（0男 1女 2未知）"
    },

    avatar: {
      type: DataTypes.STRING(100),
      field: 'avatar',
      defaultValue: "",
      comment: "头像地址"
    },

    password: {
      type: DataTypes.STRING(100),
      field: 'password',
      defaultValue: "",
      comment: "密码"
    },

    status: {
      type: DataTypes.STRING(1),
      field: 'status',
      defaultValue: "0",
      comment: "帐号状态（0代表存在 2代表删除）"
    },

    useFlag: {
      type: DataTypes.STRING(1),
      field: 'use_flag',
      defaultValue: "0",
      comment: "使用状态（0正常 1停用）"
    },

    loginIp: {
      type: DataTypes.STRING(128),
      field: 'login_ip',
      defaultValue: "",
      comment: "最后登录IP"
    },

    loginDate: {
      type: DataTypes.DATE,
      field: 'login_date',
      comment: "最后登录时间",
      get() {
        const date = this.getDataValue('loginDate');
        return date ? format(date, 'yyyy-MM-dd HH:mm:ss') : null;
      }
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
      comment: "创建时间",
      get() {
        const date = this.getDataValue('createTime');
        return date ? format(date, 'yyyy-MM-dd HH:mm:ss') : null;
      }
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
      comment: "更新时间",
      get() {
        const date = this.getDataValue('updateTime');
        return date ? format(date, 'yyyy-MM-dd HH:mm:ss') : null;
      }
    },

    remark: {
      type: DataTypes.STRING(500),
      field: 'remark',
      comment: "备注"
    }
}, {
  tableName: 'sys_user',
  timestamps: false,
  underscored: true,  // 启用字段映射
  freezeTableName: true  // 固定表名
});

module.exports = SysUser;