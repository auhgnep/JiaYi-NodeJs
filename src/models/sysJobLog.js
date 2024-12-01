const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database');
const { v4: uuidv4 } = require('uuid');

const SysJobLog = sequelize.define('sys_job_log', {
    jobLogId: {
      type: DataTypes.INTEGER(10),
      field: 'job_log_id',
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: "任务日志ID"
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

    jobMessage: {
      type: DataTypes.STRING(500),
      field: 'job_message',
      comment: "日志信息"
    },

    execStatus: {
      type: DataTypes.STRING(1),
      field: 'exec_status',
      defaultValue: "0",
      comment: "执行状态（0正常 1失败）"
    },

    status: {
      type: DataTypes.STRING(1),
      field: 'status',
      defaultValue: "0",
      comment: "状态（0正常 2删除）"
    },

    exceptionInfo: {
      type: DataTypes.STRING(2000),
      field: 'exception_info',
      defaultValue: "",
      comment: "异常信息"
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
  tableName: 'sys_job_log',
  timestamps: false,
  underscored: true,  // 启用字段映射
  freezeTableName: true  // 固定表名
});

module.exports = SysJobLog;