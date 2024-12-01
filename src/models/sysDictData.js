const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database');
const { v4: uuidv4 } = require('uuid');

const SysDictData = sequelize.define('sys_dict_data', {
    dictCode: {
      type: DataTypes.INTEGER(10),
      field: 'dict_code',
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: "字典编码"
    },

    dictSort: {
      type: DataTypes.INTEGER,
      field: 'dict_sort',
      defaultValue: "0",
      comment: "字典排序"
    },

    dictLabel: {
      type: DataTypes.STRING(100),
      field: 'dict_label',
      defaultValue: "",
      comment: "字典标签"
    },

    dictValue: {
      type: DataTypes.STRING(100),
      field: 'dict_value',
      defaultValue: "",
      comment: "字典键值"
    },

    dictType: {
      type: DataTypes.STRING(100),
      field: 'dict_type',
      defaultValue: "",
      comment: "字典类型"
    },

    cssClass: {
      type: DataTypes.STRING(100),
      field: 'css_class',
      comment: "样式属性（其他样式扩展）"
    },

    listClass: {
      type: DataTypes.STRING(100),
      field: 'list_class',
      comment: "表格回显样式"
    },

    isDefault: {
      type: DataTypes.STRING(1),
      field: 'is_default',
      defaultValue: "N",
      comment: "是否默认（Y是 N否）"
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
  tableName: 'sys_dict_data',
  timestamps: false,
  underscored: true,  // 启用字段映射
  freezeTableName: true  // 固定表名
});

module.exports = SysDictData;