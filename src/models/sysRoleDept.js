const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database');
const { v4: uuidv4 } = require('uuid');

const SysRoleDept = sequelize.define('sys_role_dept', {
    id: {
      type: DataTypes.INTEGER,
      field: 'id',
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: "主键ID"
    },

    roleId: {
      type: DataTypes.BIGINT,
      field: 'role_id',
      allowNull: false,
      comment: "角色ID"
    },

    deptId: {
      type: DataTypes.BIGINT,
      field: 'dept_id',
      allowNull: false,
      comment: "部门ID"
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

    status: {
      type: DataTypes.STRING(1),
      field: 'status',
      defaultValue: "0",
      comment: "状态（0代表存在 2代表删除）"
    }
}, {
  tableName: 'sys_role_dept',
  timestamps: false,
  underscored: true,  // 启用字段映射
  freezeTableName: true  // 固定表名
});

module.exports = SysRoleDept;