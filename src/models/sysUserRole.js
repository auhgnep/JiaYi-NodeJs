const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database');
const { v4: uuidv4 } = require('uuid');

const SysUserRole = sequelize.define('sys_user_role', {
    userId: {
      type: DataTypes.INTEGER(10),
      field: 'user_id',
      primaryKey: true,
      allowNull: false,
      comment: "用户ID"
    },

    roleId: {
      type: DataTypes.INTEGER(10),
      field: 'role_id',
      primaryKey: true,
      allowNull: false,
      comment: "角色ID"
    }
}, {
  tableName: 'sys_user_role',
  timestamps: false,
  underscored: true,  // 启用字段映射
  freezeTableName: true  // 固定表名
});

module.exports = SysUserRole;