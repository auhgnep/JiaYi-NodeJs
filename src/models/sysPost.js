const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database');
const { v4: uuidv4 } = require('uuid');

const SysPost = sequelize.define('sys_post', {
    postId: {
      type: DataTypes.INTEGER(10),
      field: 'post_id',
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: "岗位ID"
    },

    postCode: {
      type: DataTypes.STRING(64),
      field: 'post_code',
      allowNull: false,
      comment: "岗位编码"
    },

    postName: {
      type: DataTypes.STRING(50),
      field: 'post_name',
      allowNull: false,
      comment: "岗位名称"
    },

    postSort: {
      type: DataTypes.INTEGER,
      field: 'post_sort',
      allowNull: false,
      comment: "显示顺序"
    },

    useFlag: {
      type: DataTypes.STRING(1),
      field: 'use_flag',
      defaultValue: "0",
      comment: "使用状态（0正常 1停用）"
    },

    status: {
      type: DataTypes.STRING(1),
      field: 'status',
      allowNull: false,
      defaultValue: "0",
      comment: "状态（0正常 2删除）"
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
      comment: "备注"
    }
}, {
  tableName: 'sys_post',
  timestamps: false,
  underscored: true,  // 启用字段映射
  freezeTableName: true  // 固定表名
});

module.exports = SysPost;