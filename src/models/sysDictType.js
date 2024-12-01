const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database');
const { v4: uuidv4 } = require('uuid');

const SysDictType = sequelize.define('sys_dict_type', {
    dictId: {
      type: DataTypes.INTEGER(10),
      field: 'dict_id',
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: "字典主键"
    },

    dictName: {
      type: DataTypes.STRING(100),
      field: 'dict_name',
      defaultValue: "",
      comment: "字典名称"
    },

    dictType: {
      type: DataTypes.STRING(100),
      field: 'dict_type',
      defaultValue: "",
      comment: "字典类型"
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
  tableName: 'sys_dict_type',
  timestamps: false,
  underscored: true,  // 启用字段映射
  freezeTableName: true  // 固定表名
});

module.exports = SysDictType;