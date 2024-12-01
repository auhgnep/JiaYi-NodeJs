const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database');
const { v4: uuidv4 } = require('uuid');

const SysDept = sequelize.define('sys_dept', {
    deptId: {
      type: DataTypes.INTEGER(10),
      field: 'dept_id',
      primaryKey: true,
      allowNull: false,
      comment: "部门id",
      autoIncrement: true
    },

    parentId: {
      type: DataTypes.INTEGER(10),
      field: 'parent_id',
      defaultValue: "0",
      comment: "父部门id"
    },

    ancestors: {
      type: DataTypes.STRING(50),
      field: 'ancestors',
      defaultValue: "",
      comment: "祖级列表"
    },

    deptName: {
      type: DataTypes.STRING(30),
      field: 'dept_name',
      defaultValue: "",
      comment: "部门名称"
    },

    orderNum: {
      type: DataTypes.INTEGER,
      field: 'order_num',
      defaultValue: "0",
      comment: "显示顺序"
    },

    leader: {
      type: DataTypes.STRING(20),
      field: 'leader',
      comment: "负责人"
    },

    phone: {
      type: DataTypes.STRING(11),
      field: 'phone',
      comment: "联系电话"
    },

    email: {
      type: DataTypes.STRING(50),
      field: 'email',
      comment: "邮箱"
    },

    status: {
      type: DataTypes.STRING(1),
      field: 'status',
      defaultValue: "0",
      comment: "状态（0代表存在 2代表删除）"
    },

    useFlag: {
      type: DataTypes.STRING(1),
      field: 'use_flag',
      defaultValue: "0",
      comment: "部门状态（0正常 1停用）"
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
  tableName: 'sys_dept',
  timestamps: false,
  underscored: true,  // 启用字段映射
  freezeTableName: true  // 固定表名
});

module.exports = SysDept;