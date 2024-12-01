const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database');
const { v4: uuidv4 } = require('uuid');

const SysJob = sequelize.define('sys_job', {
    jobId: {
      type: DataTypes.INTEGER(10),
      field: 'job_id',
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: "任务ID"
    },

    jobName: {
      type: DataTypes.STRING(64),
      field: 'job_name',
      allowNull: false,
      comment: "任务名称"
    },

    jobGroup: {
      type: DataTypes.STRING(64),
      field: 'job_group',
      allowNull: false,
      comment: "任务组名"
    },

    invokeTarget: {
      type: DataTypes.STRING(500),
      field: 'invoke_target',
      allowNull: false,
      comment: "调用目标字符串"
    },

    cronExpression: {
      type: DataTypes.STRING(255),
      field: 'cron_expression',
      defaultValue: "",
      comment: "cron执行表达式"
    },

    misfirePolicy: {
      type: DataTypes.STRING(20),
      field: 'misfire_policy',
      defaultValue: "3",
      comment: "计划执行错误策略（1立即执行 2执行一次 3放弃执行）"
    },

    concurrent: {
      type: DataTypes.STRING(1),
      field: 'concurrent',
      defaultValue: "1",
      comment: "是否并发执行（0允许 1禁止）"
    },

    jobStatus: {
      type: DataTypes.STRING(1),
      field: 'job_status',
      defaultValue: "0",
      comment: "任务状态（0正常 1暂停）"
    },

    status: {
      type: DataTypes.STRING(1),
      field: 'status',
      defaultValue: "0",
      comment: "数据状态（0正常 2删除）"
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
      comment: "备注信息"
    }
}, {
  tableName: 'sys_job',
  timestamps: false,
  underscored: true,  // 启用字段映射
  freezeTableName: true  // 固定表名
});

module.exports = SysJob;