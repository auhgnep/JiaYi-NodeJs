const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database');
const { v4: uuidv4 } = require('uuid');

const SysConfig = sequelize.define('sys_config', {
    configId: {
      type: DataTypes.INTEGER(10),
      field: 'config_id',
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: "参数主键"
    },

    configName: {
      type: DataTypes.STRING(100),
      field: 'config_name',
      defaultValue: "",
      comment: "参数名称"
    },

    configKey: {
      type: DataTypes.STRING(100),
      field: 'config_key',
      defaultValue: "",
      comment: "参数键名"
    },

    configValue: {
      type: DataTypes.STRING(500),
      field: 'config_value',
      defaultValue: "",
      comment: "参数键值"
    },

    configType: {
      type: DataTypes.STRING(1),
      field: 'config_type',
      defaultValue: "N",
      comment: "系统内置（Y是 N否）"
    },

    status: {
      type: DataTypes.STRING(1),
      field: 'status',
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
  tableName: 'sys_config',
  timestamps: false,
  underscored: true,  // 启用字段映射
  freezeTableName: true  // 固定表名
});

module.exports = SysConfig;