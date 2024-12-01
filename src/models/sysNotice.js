const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database');

const SysNotice = sequelize.define('sys_notice', {
    noticeId: {
      type: DataTypes.INTEGER(10),
      field: 'notice_id',
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: "公告ID"
    },

    noticeTitle: {
      type: DataTypes.STRING(50),
      field: 'notice_title',
      allowNull: false,
      comment: "公告标题"
    },

    noticeType: {
      type: DataTypes.STRING(1),
      field: 'notice_type',
      allowNull: false,
      comment: "公告类型（1通知 2公告）"
    },

    noticeContent: {
      type: DataTypes.STRING,
      field: 'notice_content',
      comment: "公告内容",
      get() {
        const rawValue = this.getDataValue('noticeContent');
        return rawValue ? rawValue.toString('utf8') : null;
      }
    },

    status: {
      type: DataTypes.STRING(1),
      field: 'status',
      defaultValue: "0",
      comment: "公告状态（0正常 2删除）"
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
      type: DataTypes.STRING(255),
      field: 'remark',
      comment: "备注"
    }
}, {
  tableName: 'sys_notice',
  timestamps: false,
  underscored: true,  // 启用字段映射
  freezeTableName: true  // 固定表名
});

module.exports = SysNotice;