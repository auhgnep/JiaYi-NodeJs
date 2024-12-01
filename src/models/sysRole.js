const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database');
const { v4: uuidv4 } = require('uuid');

const SysRole = sequelize.define('sys_role', {
    roleId: {
      type: DataTypes.INTEGER(10),
      field: 'role_id',
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: "角色ID"
    },

    roleName: {
      type: DataTypes.STRING(30),
      field: 'role_name',
      allowNull: false,
      comment: "角色名称"
    },

    roleKey: {
      type: DataTypes.STRING(100),
      field: 'role_key',
      allowNull: false,
      comment: "角色权限字符串"
    },

    roleSort: {
      type: DataTypes.INTEGER,
      field: 'role_sort',
      allowNull: false,
      comment: "显示顺序"
    },

    dataScope: {
      type: DataTypes.STRING(1),
      field: 'data_scope',
      defaultValue: "1",
      comment: "数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）"
    },

    menuCheckStrictly: {
      type: DataTypes.INTEGER,
      field: 'menu_check_strictly',
      defaultValue: "1",
      comment: "菜单树选择项是否关联显示"
    },

    deptCheckStrictly: {
      type: DataTypes.INTEGER,
      field: 'dept_check_strictly',
      defaultValue: "1",
      comment: "部门树选择项是否关联显示"
    },

    status: {
      type: DataTypes.STRING(1),
      field: 'status',
      allowNull: false,
      defaultValue: "0",
      comment: "状态（0正常 2删除）"
    },

    useFlag: {
      type: DataTypes.STRING(1),
      field: 'use_flag',
      defaultValue: "0",
      comment: "使用状态（0正常 1停用）"
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
  tableName: 'sys_role',
  timestamps: false,
  underscored: true,  // 启用字段映射
  freezeTableName: true  // 固定表名
});

module.exports = SysRole;