const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database');
const { v4: uuidv4 } = require('uuid');

const SysMenu = sequelize.define('sys_menu', {
    menuId: {
      type: DataTypes.INTEGER(10),
      field: 'menu_id',
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: "菜单ID"
    },

    menuName: {
      type: DataTypes.STRING(50),
      field: 'menu_name',
      allowNull: false,
      comment: "菜单名称"
    },

    parentId: {
      type: DataTypes.INTEGER(10),
      field: 'parent_id',
      defaultValue: "0",
      comment: "父菜单ID"
    },

    orderNum: {
      type: DataTypes.INTEGER,
      field: 'order_num',
      defaultValue: "0",
      comment: "显示顺序"
    },

    path: {
      type: DataTypes.STRING(200),
      field: 'path',
      defaultValue: "",
      comment: "路由地址"
    },

    component: {
      type: DataTypes.STRING(255),
      field: 'component',
      comment: "组件路径"
    },

    query: {
      type: DataTypes.STRING(255),
      field: 'query',
      comment: "路由参数"
    },

    routeName: {
      type: DataTypes.STRING(50),
      field: 'route_name',
      defaultValue: "",
      comment: "路由名称"
    },

    isFrame: {
      type: DataTypes.INTEGER,
      field: 'is_frame',
      defaultValue: "1",
      comment: "是否为外链（0是 1否）"
    },

    isCache: {
      type: DataTypes.INTEGER,
      field: 'is_cache',
      defaultValue: "0",
      comment: "是否缓存（0缓存 1不缓存）"
    },

    menuType: {
      type: DataTypes.STRING(1),
      field: 'menu_type',
      defaultValue: "",
      comment: "菜单类型（M目录 C菜单 F按钮）"
    },

    visible: {
      type: DataTypes.STRING(1),
      field: 'visible',
      defaultValue: "0",
      comment: "菜单状态（0显示 1隐藏）"
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
      defaultValue: "0",
      comment: "状态（0正常 2删除）"
    },

    perms: {
      type: DataTypes.STRING(100),
      field: 'perms',
      comment: "权限标识"
    },

    icon: {
      type: DataTypes.STRING(100),
      field: 'icon',
      defaultValue: "#",
      comment: "菜单图标"
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
      defaultValue: "",
      comment: "备注"
    }
}, {
  tableName: 'sys_menu',
  timestamps: false,
  underscored: true,  // 启用字段映射
  freezeTableName: true  // 固定表名
});

module.exports = SysMenu;