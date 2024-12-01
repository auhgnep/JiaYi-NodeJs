const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database');
const { v4: uuidv4 } = require('uuid');

const SysRoleMenu = sequelize.define('sys_role_menu', {
    roleId: {
      type: DataTypes.INTEGER(10),
      field: 'role_id',
      primaryKey: true,
      allowNull: false,
      comment: "角色ID"
    },

    menuId: {
      type: DataTypes.INTEGER(10),
      field: 'menu_id',
      primaryKey: true,
      allowNull: false,
      comment: "菜单ID"
    }
}, {
  tableName: 'sys_role_menu',
  timestamps: false,
  underscored: true,  // 启用字段映射
  freezeTableName: true  // 固定表名
});

module.exports = SysRoleMenu;