const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database');
const { v4: uuidv4 } = require('uuid');

const SysUserPost = sequelize.define('sys_user_post', {
    userId: {
      type: DataTypes.INTEGER(10),
      field: 'user_id',
      primaryKey: true,
      allowNull: false,
      comment: "用户ID"
    },

    postId: {
      type: DataTypes.INTEGER(10),
      field: 'post_id',
      primaryKey: true,
      allowNull: false,
      comment: "岗位ID"
    }
}, {
  tableName: 'sys_user_post',
  timestamps: false,
  underscored: true,  // 启用字段映射
  freezeTableName: true  // 固定表名
});

module.exports = SysUserPost;