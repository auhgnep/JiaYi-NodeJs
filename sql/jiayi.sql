/*
 Navicat MySQL Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50647
 Source Host           : localhost:3306
 Source Schema         : jiayi

 Target Server Type    : MySQL
 Target Server Version : 50647
 File Encoding         : 65001

 Date: 13/12/2024 00:43:41
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_config
-- ----------------------------
DROP TABLE IF EXISTS `sys_config`;
CREATE TABLE `sys_config`  (
  `config_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '参数主键',
  `config_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '参数名称',
  `config_key` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '参数键名',
  `config_value` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '参数键值',
  `config_type` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'N' COMMENT '系统内置（Y是 N否）',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '状态（0正常 2删除）',
  `create_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '创建者',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`config_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '参数配置表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_config
-- ----------------------------
INSERT INTO `sys_config` VALUES (1, '主框架页-默认皮肤样式名称', 'sys.index.skinName', 'skin-blue', 'Y', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '蓝色 skin-blue、绿色 skin-green、紫色 skin-purple、红色 skin-red、黄色 skin-yellow');
INSERT INTO `sys_config` VALUES (2, '用户管理-账号初始密码', 'sys.user.initPassword', '123456', 'Y', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '初始化密码 123456');
INSERT INTO `sys_config` VALUES (3, '主框架页-侧边栏主题', 'sys.index.sideTheme', 'theme-dark', 'Y', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '深色主题theme-dark，浅色主题theme-light');
INSERT INTO `sys_config` VALUES (4, '账号自助-验证码开关', 'sys.account.captchaEnabled', 'true', 'Y', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '是否开启验证码功能（true开启，false关闭）');
INSERT INTO `sys_config` VALUES (5, '账号自助-是否开启用户注册功能', 'sys.account.registerUser', 'false', 'Y', '0', 'admin', '2024-10-18 16:22:00', 'admin', '2024-11-13 02:39:09', '是否开启注册用户功能（true开启，false关闭）');
INSERT INTO `sys_config` VALUES (6, '用户登录-黑名单列表', 'sys.login.blackIPList', '', 'Y', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '设置登录IP黑名单限制，多个匹配项以;分隔，支持匹配（*通配、网段）');

-- ----------------------------
-- Table structure for sys_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_dept`;
CREATE TABLE `sys_dept`  (
  `dept_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '部门id',
  `parent_id` int(10) NULL DEFAULT 0 COMMENT '父部门id',
  `ancestors` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '祖级列表',
  `dept_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '部门名称',
  `order_num` int(4) NULL DEFAULT 0 COMMENT '显示顺序',
  `leader` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '负责人',
  `phone` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '联系电话',
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '状态（0代表存在 2代表删除）',
  `use_flag` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '部门状态（0正常 1停用）',
  `create_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '创建者',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`dept_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 111 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '部门表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_dept
-- ----------------------------
INSERT INTO `sys_dept` VALUES (100, 0, '0', '若依科技', 0, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', '2024-10-18 16:22:00', '', NULL);
INSERT INTO `sys_dept` VALUES (101, 100, '0,100', '深圳总公司', 1, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', '2024-10-18 16:22:00', '', NULL);
INSERT INTO `sys_dept` VALUES (102, 100, '0,100', '长沙分公司', 2, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', '2024-10-18 16:22:00', '', NULL);
INSERT INTO `sys_dept` VALUES (103, 101, '0,100,101', '研发部门', 1, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', '2024-10-18 16:22:00', '', NULL);
INSERT INTO `sys_dept` VALUES (104, 101, '0,100,101', '市场部门', 2, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', '2024-10-18 16:22:00', '', NULL);
INSERT INTO `sys_dept` VALUES (105, 101, '0,100,101', '测试部门', 3, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', '2024-10-18 16:22:00', '', NULL);
INSERT INTO `sys_dept` VALUES (106, 101, '0,100,101', '财务部门', 4, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', '2024-10-18 16:22:00', '', NULL);
INSERT INTO `sys_dept` VALUES (107, 101, '0,100,101', '运维部门', 5, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', '2024-10-18 16:22:00', '', NULL);
INSERT INTO `sys_dept` VALUES (108, 102, '0,100,102', '市场部门', 1, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', '2024-10-18 16:22:00', '', NULL);
INSERT INTO `sys_dept` VALUES (109, 102, '0,100,102', '财务部门', 2, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', '2024-10-18 16:22:00', '', NULL);
INSERT INTO `sys_dept` VALUES (110, 100, '', '测试子公司', 3, NULL, NULL, NULL, '0', '0', 'admin', '2024-12-01 03:29:18', 'admin', '2024-12-01 04:00:45');

-- ----------------------------
-- Table structure for sys_dict_data
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict_data`;
CREATE TABLE `sys_dict_data`  (
  `dict_code` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '字典编码',
  `dict_sort` int(4) NULL DEFAULT 0 COMMENT '字典排序',
  `dict_label` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '字典标签',
  `dict_value` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '字典键值',
  `dict_type` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '字典类型',
  `css_class` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '样式属性（其他样式扩展）',
  `list_class` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '表格回显样式',
  `is_default` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'N' COMMENT '是否默认（Y是 N否）',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '状态（0正常 2删除）',
  `create_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '创建者',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`dict_code`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '字典数据表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_dict_data
-- ----------------------------
INSERT INTO `sys_dict_data` VALUES (1, 1, '男', '0', 'sys_user_sex', '', '', 'Y', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '性别男');
INSERT INTO `sys_dict_data` VALUES (2, 2, '女', '1', 'sys_user_sex', '', '', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '性别女');
INSERT INTO `sys_dict_data` VALUES (3, 3, '未知', '2', 'sys_user_sex', '', '', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '性别未知');
INSERT INTO `sys_dict_data` VALUES (4, 1, '显示', '0', 'sys_show_hide', '', 'primary', 'Y', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '显示菜单');
INSERT INTO `sys_dict_data` VALUES (5, 2, '隐藏', '1', 'sys_show_hide', '', 'danger', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '隐藏菜单');
INSERT INTO `sys_dict_data` VALUES (6, 1, '正常', '0', 'sys_normal_disable', '', 'primary', 'Y', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '正常状态');
INSERT INTO `sys_dict_data` VALUES (7, 2, '停用', '1', 'sys_normal_disable', '', 'danger', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '停用状态');
INSERT INTO `sys_dict_data` VALUES (8, 1, '正常', '0', 'sys_job_status', '', 'primary', 'Y', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '正常状态');
INSERT INTO `sys_dict_data` VALUES (9, 2, '暂停', '1', 'sys_job_status', '', 'danger', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '停用状态');
INSERT INTO `sys_dict_data` VALUES (10, 1, '默认', 'DEFAULT', 'sys_job_group', '', '', 'Y', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '默认分组');
INSERT INTO `sys_dict_data` VALUES (11, 2, '系统', 'SYSTEM', 'sys_job_group', '', '', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '系统分组');
INSERT INTO `sys_dict_data` VALUES (12, 1, '是', 'Y', 'sys_yes_no', '', 'primary', 'Y', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '系统默认是');
INSERT INTO `sys_dict_data` VALUES (13, 2, '否', 'N', 'sys_yes_no', '', 'danger', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '系统默认否');
INSERT INTO `sys_dict_data` VALUES (14, 1, '通知', '1', 'sys_notice_type', '', 'warning', 'Y', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '通知');
INSERT INTO `sys_dict_data` VALUES (15, 2, '公告', '2', 'sys_notice_type', '', 'success', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '公告');
INSERT INTO `sys_dict_data` VALUES (16, 1, '正常', '0', 'sys_notice_status', '', 'primary', 'Y', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '正常状态');
INSERT INTO `sys_dict_data` VALUES (17, 2, '关闭', '1', 'sys_notice_status', '', 'danger', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '关闭状态');
INSERT INTO `sys_dict_data` VALUES (18, 99, '其他', '0', 'sys_oper_type', '', 'info', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '其他操作');
INSERT INTO `sys_dict_data` VALUES (19, 1, '新增', '1', 'sys_oper_type', '', 'info', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '新增操作');
INSERT INTO `sys_dict_data` VALUES (20, 2, '修改', '2', 'sys_oper_type', '', 'info', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '修改操作');
INSERT INTO `sys_dict_data` VALUES (21, 3, '删除', '3', 'sys_oper_type', '', 'danger', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '删除操作');
INSERT INTO `sys_dict_data` VALUES (22, 4, '授权', '4', 'sys_oper_type', '', 'primary', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '授权操作');
INSERT INTO `sys_dict_data` VALUES (23, 5, '导出', '5', 'sys_oper_type', '', 'warning', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '导出操作');
INSERT INTO `sys_dict_data` VALUES (24, 6, '导入', '6', 'sys_oper_type', '', 'warning', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '导入操作');
INSERT INTO `sys_dict_data` VALUES (25, 7, '强退', '7', 'sys_oper_type', '', 'danger', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '强退操作');
INSERT INTO `sys_dict_data` VALUES (26, 8, '生成代码', '8', 'sys_oper_type', '', 'warning', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '生成操作');
INSERT INTO `sys_dict_data` VALUES (27, 9, '清空数据', '9', 'sys_oper_type', '', 'danger', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '清空操作');
INSERT INTO `sys_dict_data` VALUES (28, 1, '成功', '0', 'sys_common_status', '', 'primary', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '正常状态');
INSERT INTO `sys_dict_data` VALUES (29, 2, '失败', '1', 'sys_common_status', '', 'danger', 'N', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '停用状态');

-- ----------------------------
-- Table structure for sys_dict_type
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict_type`;
CREATE TABLE `sys_dict_type`  (
  `dict_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '字典主键',
  `dict_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '字典名称',
  `dict_type` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '字典类型',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '状态（0正常 2删除）',
  `create_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '创建者',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`dict_id`) USING BTREE,
  UNIQUE INDEX `dict_type`(`dict_type`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '字典类型表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_dict_type
-- ----------------------------
INSERT INTO `sys_dict_type` VALUES (1, '用户性别', 'sys_user_sex', '0', 'admin', '2024-10-18 16:22:00', 'system', '2024-11-05 15:28:09', '用户性别列表');
INSERT INTO `sys_dict_type` VALUES (2, '菜单状态', 'sys_show_hide', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '菜单状态列表');
INSERT INTO `sys_dict_type` VALUES (3, '系统开关', 'sys_normal_disable', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '系统开关列表');
INSERT INTO `sys_dict_type` VALUES (4, '任务状态', 'sys_job_status', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '任务状态列表');
INSERT INTO `sys_dict_type` VALUES (5, '任务分组', 'sys_job_group', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '任务分组列表');
INSERT INTO `sys_dict_type` VALUES (6, '系统是否', 'sys_yes_no', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '系统是否列表');
INSERT INTO `sys_dict_type` VALUES (7, '通知类型', 'sys_notice_type', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '通知类型列表');
INSERT INTO `sys_dict_type` VALUES (8, '通知状态', 'sys_notice_status', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '通知状态列表');
INSERT INTO `sys_dict_type` VALUES (9, '操作类型', 'sys_oper_type', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '操作类型列表');
INSERT INTO `sys_dict_type` VALUES (10, '系统状态', 'sys_common_status', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '登录状态列表');

-- ----------------------------
-- Table structure for sys_job
-- ----------------------------
DROP TABLE IF EXISTS `sys_job`;
CREATE TABLE `sys_job`  (
  `job_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '任务ID',
  `job_name` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '任务名称',
  `job_group` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'DEFAULT' COMMENT '任务组名',
  `invoke_target` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '调用目标字符串',
  `cron_expression` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT 'cron执行表达式',
  `misfire_policy` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '3' COMMENT '计划执行错误策略（1立即执行 2执行一次 3放弃执行）',
  `concurrent` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '1' COMMENT '是否并发执行（0允许 1禁止）',
  `job_status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '任务状态（0正常 1暂停）',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '状态（0正常 2删除）',
  `create_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '创建者',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '备注信息',
  PRIMARY KEY (`job_id`, `job_name`, `job_group`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '定时任务调度表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_job
-- ----------------------------
INSERT INTO `sys_job` VALUES (1, '系统默认（无参）', 'DEFAULT', 'ryTask.ryNoParams', '0/10 * * * * ?', '3', '1', '0', '1', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_job` VALUES (2, '系统默认（有参）', 'DEFAULT', 'ryTask.ryParams(\'ry\')', '0/15 * * * * ?', '3', '1', '0', '1', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_job` VALUES (3, '系统默认（多参）', 'DEFAULT', 'ryTask.ryMultipleParams(\'ry\', true, 2000L, 316.50D, 100)', '0/20 * * * * ?', '3', '1', '0', '1', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_job` VALUES (4, '定时任务一', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '0 0/1 * * * ?', '1', '1', '1', '0', 'admin', '2024-11-13 13:58:01', 'admin', '2024-11-29 16:09:12', '');
INSERT INTO `sys_job` VALUES (5, '测试2', 'DEFAULT', 'ryService.task()', '0 0/1 * * * ?', '1', '1', '1', '0', 'admin', '2024-11-29 16:06:47', 'admin', '2024-11-29 16:13:02', '');

-- ----------------------------
-- Table structure for sys_job_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_job_log`;
CREATE TABLE `sys_job_log`  (
  `job_log_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '任务日志ID',
  `job_name` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '任务名称',
  `job_group` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '任务组名',
  `invoke_target` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '调用目标字符串',
  `job_message` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '日志信息',
  `exec_status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '执行状态（0正常 1失败）',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '状态（0正常 2删除）',
  `exception_info` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '异常信息',
  `create_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '创建者',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '备注信息',
  PRIMARY KEY (`job_log_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 66 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '定时任务调度日志表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_job_log
-- ----------------------------
INSERT INTO `sys_job_log` VALUES (1, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:06:48', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (2, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:06:49', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (3, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:06:50', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (4, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:06:51', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (5, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:06:52', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (6, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:06:53', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (7, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:06:54', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (8, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:06:55', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (9, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:06:56', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (10, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:06:57', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (11, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:06:58', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (12, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:06:59', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (13, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:00', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (14, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:01', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (15, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:02', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (16, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:03', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (17, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:04', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (18, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:05', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (19, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:06', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (20, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:07', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (21, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:08', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (22, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:09', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (23, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:10', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (24, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:11', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (25, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:12', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (26, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:13', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (27, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:14', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (28, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:15', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (29, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:16', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (30, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:17', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (31, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:18', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (32, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:19', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (33, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:20', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (34, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:21', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (35, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:22', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (36, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:23', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (37, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:24', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (38, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:25', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (39, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:26', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (40, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:27', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (41, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:28', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (42, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:29', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (43, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:30', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (44, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:31', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (45, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:32', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (46, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:33', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (47, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:34', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (48, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:35', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (49, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:36', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (50, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:37', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (51, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:38', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (52, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:39', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (53, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:40', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (54, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:41', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (55, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:42', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (56, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:43', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (57, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:44', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (58, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:45', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (59, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:46', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (60, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:47', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (61, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:48', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (62, '撒', 'DEFAULT', 'ryService.task(\'1world\', \'hello\')', '执行成功', '0', '0', '', 'system', '2024-11-29 16:07:49', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (63, '测试2', 'DEFAULT', 'ryService.task', '执行失败', '1', '0', 'Failed to parse invoke target: Invalid invoke target format: ryService.task', 'system', '2024-11-29 16:09:43', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (64, '测试2', 'DEFAULT', 'ryService.task()', '执行成功', '0', '0', '', 'system', '2024-11-29 16:11:38', '', NULL, '');
INSERT INTO `sys_job_log` VALUES (65, '测试2', 'DEFAULT', 'ryService.task', '执行失败', '1', '0', 'Failed to parse invoke target: Invalid invoke target format: ryService.task', 'system', '2024-11-29 16:12:02', '', NULL, '');

-- ----------------------------
-- Table structure for sys_logininfor
-- ----------------------------
DROP TABLE IF EXISTS `sys_logininfor`;
CREATE TABLE `sys_logininfor`  (
  `info_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '访问ID',
  `user_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '用户账号',
  `ipaddr` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '登录IP地址',
  `login_location` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '登录地点',
  `browser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '浏览器类型',
  `os` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '操作系统',
  `login_status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '登录状态（0成功 1失败）',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '状态（0正常 2删除）',
  `msg` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '提示消息',
  `login_time` datetime(0) NULL DEFAULT NULL COMMENT '访问时间',
  `create_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '创建者',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`info_id`) USING BTREE,
  INDEX `idx_sys_logininfor_s`(`status`) USING BTREE,
  INDEX `idx_sys_logininfor_lt`(`login_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 43 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '系统访问记录' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_logininfor
-- ----------------------------
INSERT INTO `sys_logininfor` VALUES (1, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登出成功', '2024-11-29 16:02:12', 'system', '2024-11-29 16:02:12', '', NULL);
INSERT INTO `sys_logininfor` VALUES (2, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-11-29 16:02:21', 'system', '2024-11-29 16:02:21', '', NULL);
INSERT INTO `sys_logininfor` VALUES (3, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-01 03:25:08', 'system', '2024-12-01 03:25:09', '', NULL);
INSERT INTO `sys_logininfor` VALUES (4, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登出成功', '2024-12-01 03:42:27', 'system', '2024-12-01 03:42:27', '', NULL);
INSERT INTO `sys_logininfor` VALUES (5, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-01 03:42:36', 'system', '2024-12-01 03:42:36', '', NULL);
INSERT INTO `sys_logininfor` VALUES (6, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登出成功', '2024-12-01 03:43:59', 'system', '2024-12-01 03:43:59', '', NULL);
INSERT INTO `sys_logininfor` VALUES (7, 'ry', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '1', '0', '用户名或密码错误', '2024-12-01 03:44:07', 'system', '2024-12-01 03:44:07', '', NULL);
INSERT INTO `sys_logininfor` VALUES (8, 'ry', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-01 03:44:15', 'system', '2024-12-01 03:44:15', '', NULL);
INSERT INTO `sys_logininfor` VALUES (9, 'ry', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登出成功', '2024-12-01 03:44:23', 'system', '2024-12-01 03:44:23', '', NULL);
INSERT INTO `sys_logininfor` VALUES (10, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-01 03:44:34', 'system', '2024-12-01 03:44:34', '', NULL);
INSERT INTO `sys_logininfor` VALUES (11, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登出成功', '2024-12-01 04:53:22', 'system', '2024-12-01 04:53:22', '', NULL);
INSERT INTO `sys_logininfor` VALUES (12, 'jy', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '1', '0', '验证码错误', '2024-12-01 04:53:29', 'system', '2024-12-01 04:53:29', '', NULL);
INSERT INTO `sys_logininfor` VALUES (13, 'jy', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '1', '0', '用户名或密码错误', '2024-12-01 04:53:34', 'system', '2024-12-01 04:53:34', '', NULL);
INSERT INTO `sys_logininfor` VALUES (14, 'jy', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-01 04:53:40', 'system', '2024-12-01 04:53:41', '', NULL);
INSERT INTO `sys_logininfor` VALUES (15, 'jy', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登出成功', '2024-12-01 04:54:03', 'system', '2024-12-01 04:54:03', '', NULL);
INSERT INTO `sys_logininfor` VALUES (16, 'jj', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-01 04:54:10', 'system', '2024-12-01 04:54:10', '', NULL);
INSERT INTO `sys_logininfor` VALUES (17, 'jj', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登出成功', '2024-12-01 14:43:12', 'system', '2024-12-01 14:43:12', '', NULL);
INSERT INTO `sys_logininfor` VALUES (18, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-01 14:43:23', 'system', '2024-12-01 14:43:23', '', NULL);
INSERT INTO `sys_logininfor` VALUES (19, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登出成功', '2024-12-01 14:43:31', 'system', '2024-12-01 14:43:31', '', NULL);
INSERT INTO `sys_logininfor` VALUES (20, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Linux', '0', '0', '登录成功', '2024-12-01 14:56:00', 'system', '2024-12-01 14:56:00', '', NULL);
INSERT INTO `sys_logininfor` VALUES (21, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-05 11:44:24', 'system', '2024-12-05 11:44:24', '', NULL);
INSERT INTO `sys_logininfor` VALUES (22, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登出成功', '2024-12-05 11:45:33', 'system', '2024-12-05 11:45:33', '', NULL);
INSERT INTO `sys_logininfor` VALUES (23, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-05 11:45:38', 'system', '2024-12-05 11:45:39', '', NULL);
INSERT INTO `sys_logininfor` VALUES (24, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登出成功', '2024-12-05 11:48:57', 'system', '2024-12-05 11:48:57', '', NULL);
INSERT INTO `sys_logininfor` VALUES (25, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-05 11:49:04', 'system', '2024-12-05 11:49:05', '', NULL);
INSERT INTO `sys_logininfor` VALUES (26, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '1', '0', '用户名或密码错误', '2024-12-08 04:25:35', 'system', '2024-12-08 04:25:35', '', NULL);
INSERT INTO `sys_logininfor` VALUES (27, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-08 04:25:41', 'system', '2024-12-08 04:25:41', '', NULL);
INSERT INTO `sys_logininfor` VALUES (28, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-10 04:27:13', 'system', '2024-12-10 04:27:14', '', NULL);
INSERT INTO `sys_logininfor` VALUES (29, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '1', '0', '验证码错误', '2024-12-10 05:20:07', 'system', '2024-12-10 05:20:07', '', NULL);
INSERT INTO `sys_logininfor` VALUES (30, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '1', '0', '用户名或密码错误', '2024-12-10 05:20:50', 'system', '2024-12-10 05:20:50', '', NULL);
INSERT INTO `sys_logininfor` VALUES (31, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-10 13:00:33', 'system', '2024-12-10 13:00:33', '', NULL);
INSERT INTO `sys_logininfor` VALUES (32, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-10 13:46:25', 'system', '2024-12-10 13:46:25', '', NULL);
INSERT INTO `sys_logininfor` VALUES (33, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-10 15:29:34', 'system', '2024-12-10 15:29:34', '', NULL);
INSERT INTO `sys_logininfor` VALUES (34, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-10 15:37:26', 'system', '2024-12-10 15:37:26', '', NULL);
INSERT INTO `sys_logininfor` VALUES (35, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-11 06:56:44', 'system', '2024-12-11 06:56:45', '', NULL);
INSERT INTO `sys_logininfor` VALUES (36, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登出成功', '2024-12-11 06:58:04', 'system', '2024-12-11 06:58:04', '', NULL);
INSERT INTO `sys_logininfor` VALUES (37, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-11 07:01:26', 'system', '2024-12-11 07:01:26', '', NULL);
INSERT INTO `sys_logininfor` VALUES (38, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-11 07:08:41', 'system', '2024-12-11 07:08:41', '', NULL);
INSERT INTO `sys_logininfor` VALUES (39, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-11 12:49:51', 'system', '2024-12-11 12:49:51', '', NULL);
INSERT INTO `sys_logininfor` VALUES (40, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-11 12:57:11', 'system', '2024-12-11 12:57:11', '', NULL);
INSERT INTO `sys_logininfor` VALUES (41, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-11 14:15:46', 'system', '2024-12-11 14:15:46', '', NULL);
INSERT INTO `sys_logininfor` VALUES (42, 'admin', '127.0.0.1', '内网IP', 'Chrome', 'Windows', '0', '0', '登录成功', '2024-12-12 11:58:34', 'system', '2024-12-12 11:58:34', '', NULL);

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu`  (
  `menu_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `menu_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '菜单名称',
  `parent_id` int(10) NULL DEFAULT NULL COMMENT '父菜单ID',
  `order_num` int(4) NULL DEFAULT 0 COMMENT '显示顺序',
  `path` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '路由地址',
  `component` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '组件路径',
  `query` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '路由参数',
  `route_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '路由名称',
  `is_frame` int(1) NULL DEFAULT 1 COMMENT '是否为外链（0是 1否）',
  `is_cache` int(1) NULL DEFAULT 0 COMMENT '是否缓存（0缓存 1不缓存）',
  `menu_type` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '菜单类型（M目录 C菜单 F按钮）',
  `visible` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '菜单状态（0显示 1隐藏）',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '菜单状态（0正常 2删除）',
  `use_flag` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '菜单状态（0正常 1停用）',
  `perms` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '权限标识',
  `icon` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '#' COMMENT '菜单图标',
  `create_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '创建者',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '备注',
  PRIMARY KEY (`menu_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1055 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '菜单权限表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
INSERT INTO `sys_menu` VALUES (1, '系统管理', 0, 1, 'system', NULL, '', '', 1, 0, 'M', '0', '0', '0', '', 'system', 'admin', '2024-10-18 16:22:00', '', NULL, '系统管理目录');
INSERT INTO `sys_menu` VALUES (2, '系统监控', 0, 2, 'monitor', NULL, '', '', 1, 0, 'M', '0', '0', '0', '', 'monitor', 'admin', '2024-10-18 16:22:00', '', NULL, '系统监控目录');
INSERT INTO `sys_menu` VALUES (3, '系统工具', 0, 3, 'tool', NULL, '', '', 1, 0, 'M', '0', '2', '0', '', 'tool', 'admin', '2024-10-18 16:22:00', '', NULL, '系统工具目录');
INSERT INTO `sys_menu` VALUES (100, '用户管理', 1, 1, 'user', 'system/user/index', '', '', 1, 0, 'C', '0', '0', '0', 'system:user:list', 'user', 'admin', '2024-10-18 16:22:00', '', NULL, '用户管理菜单');
INSERT INTO `sys_menu` VALUES (101, '角色管理', 1, 2, 'role', 'system/role/index', '', '', 1, 0, 'C', '0', '0', '0', 'system:role:list', 'peoples', 'admin', '2024-10-18 16:22:00', '', NULL, '角色管理菜单');
INSERT INTO `sys_menu` VALUES (102, '菜单管理', 1, 3, 'menu', 'system/menu/index', '', '', 1, 0, 'C', '0', '0', '0', 'system:menu:list', 'tree-table', 'admin', '2024-10-18 16:22:00', '', NULL, '菜单管理菜单');
INSERT INTO `sys_menu` VALUES (103, '部门管理', 1, 4, 'dept', 'system/dept/index', '', '', 1, 0, 'C', '0', '0', '0', 'system:dept:list', 'tree', 'admin', '2024-10-18 16:22:00', '', NULL, '部门管理菜单');
INSERT INTO `sys_menu` VALUES (104, '岗位管理', 1, 5, 'post', 'system/post/index', '', '', 1, 0, 'C', '0', '0', '0', 'system:post:list', 'post', 'admin', '2024-10-18 16:22:00', '', NULL, '岗位管理菜单');
INSERT INTO `sys_menu` VALUES (105, '字典管理', 1, 6, 'dict', 'system/dict/index', '', '', 1, 0, 'C', '0', '0', '0', 'system:dict:list', 'dict', 'admin', '2024-10-18 16:22:00', '', NULL, '字典管理菜单');
INSERT INTO `sys_menu` VALUES (106, '参数设置', 1, 7, 'config', 'system/config/index', '', '', 1, 0, 'C', '0', '0', '0', 'system:config:list', 'edit', 'admin', '2024-10-18 16:22:00', '', NULL, '参数设置菜单');
INSERT INTO `sys_menu` VALUES (107, '通知公告', 1, 8, 'notice', 'system/notice/index', '', '', 1, 0, 'C', '0', '0', '0', 'system:notice:list', 'message', 'admin', '2024-10-18 16:22:00', '', NULL, '通知公告菜单');
INSERT INTO `sys_menu` VALUES (108, '日志管理', 1, 9, 'log', '', '', '', 1, 0, 'M', '0', '0', '0', '', 'log', 'admin', '2024-10-18 16:22:00', '', NULL, '日志管理菜单');
INSERT INTO `sys_menu` VALUES (109, '在线用户', 2, 1, 'online', 'monitor/online/index', '', '', 1, 0, 'C', '0', '2', '0', 'monitor:online:list', 'online', 'admin', '2024-10-18 16:22:00', '', NULL, '在线用户菜单');
INSERT INTO `sys_menu` VALUES (110, '定时任务', 2, 2, 'job', 'monitor/job/index', '', '', 1, 0, 'C', '0', '0', '0', 'monitor:job:list', 'job', 'admin', '2024-10-18 16:22:00', '', NULL, '定时任务菜单');
INSERT INTO `sys_menu` VALUES (111, '数据监控', 2, 3, 'druid', 'monitor/druid/index', '', '', 1, 0, 'C', '0', '2', '0', 'monitor:druid:list', 'druid', 'admin', '2024-10-18 16:22:00', '', NULL, '数据监控菜单');
INSERT INTO `sys_menu` VALUES (112, '服务监控', 2, 4, 'server', 'monitor/server/index', '', '', 1, 0, 'C', '0', '0', '0', 'monitor:server:list', 'server', 'admin', '2024-10-18 16:22:00', '', NULL, '服务监控菜单');
INSERT INTO `sys_menu` VALUES (113, '缓存监控', 2, 5, 'cache', 'monitor/cache/index', '', '', 1, 0, 'C', '0', '2', '0', 'monitor:cache:list', 'redis', 'admin', '2024-10-18 16:22:00', '', NULL, '缓存监控菜单');
INSERT INTO `sys_menu` VALUES (114, '缓存列表', 2, 6, 'cacheList', 'monitor/cache/list', '', '', 1, 0, 'C', '0', '2', '0', 'monitor:cache:list', 'redis-list', 'admin', '2024-10-18 16:22:00', '', NULL, '缓存列表菜单');
INSERT INTO `sys_menu` VALUES (115, '表单构建', 3, 1, 'build', 'tool/build/index', '', '', 1, 0, 'C', '0', '2', '0', 'tool:build:list', 'build', 'admin', '2024-10-18 16:22:00', '', NULL, '表单构建菜单');
INSERT INTO `sys_menu` VALUES (116, '代码生成', 3, 2, 'gen', 'tool/gen/index', '', '', 1, 0, 'C', '0', '2', '0', 'tool:gen:list', 'code', 'admin', '2024-10-18 16:22:00', 'admin', '2024-10-18 17:34:53', '代码生成菜单');
INSERT INTO `sys_menu` VALUES (117, '系统接口', 3, 3, 'swagger', 'tool/swagger/index', '', '', 1, 0, 'C', '0', '2', '0', 'tool:swagger:list', 'swagger', 'admin', '2024-10-18 16:22:00', '', NULL, '系统接口菜单');
INSERT INTO `sys_menu` VALUES (500, '操作日志', 108, 1, 'operlog', 'monitor/operlog/index', '', '', 1, 0, 'C', '0', '0', '0', 'monitor:operlog:list', 'form', 'admin', '2024-10-18 16:22:00', '', NULL, '操作日志菜单');
INSERT INTO `sys_menu` VALUES (501, '登录日志', 108, 2, 'logininfor', 'monitor/logininfor/index', '', '', 1, 0, 'C', '0', '0', '0', 'monitor:logininfor:list', 'logininfor', 'admin', '2024-10-18 16:22:00', '', NULL, '登录日志菜单');
INSERT INTO `sys_menu` VALUES (1000, '用户查询', 100, 1, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:user:query', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1001, '用户新增', 100, 2, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:user:add', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1002, '用户修改', 100, 3, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:user:edit', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1003, '用户删除', 100, 4, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:user:remove', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1004, '用户导出', 100, 5, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:user:export', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1005, '用户导入', 100, 6, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:user:import', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1006, '重置密码', 100, 7, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:user:resetPwd', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1007, '角色查询', 101, 1, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:role:query', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1008, '角色新增', 101, 2, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:role:add', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1009, '角色修改', 101, 3, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:role:edit', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1010, '角色删除', 101, 4, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:role:remove', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1011, '角色导出', 101, 5, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:role:export', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1012, '菜单查询', 102, 1, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:menu:query', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1013, '菜单新增', 102, 2, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:menu:add', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1014, '菜单修改', 102, 3, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:menu:edit', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1015, '菜单删除', 102, 4, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:menu:remove', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1016, '部门查询', 103, 1, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:dept:query', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1017, '部门新增', 103, 2, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:dept:add', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1018, '部门修改', 103, 3, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:dept:edit', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1019, '部门删除', 103, 4, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:dept:remove', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1020, '岗位查询', 104, 1, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:post:query', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1021, '岗位新增', 104, 2, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:post:add', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1022, '岗位修改', 104, 3, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:post:edit', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1023, '岗位删除', 104, 4, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:post:remove', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1024, '岗位导出', 104, 5, '', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:post:export', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1025, '字典查询', 105, 1, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:dict:query', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1026, '字典新增', 105, 2, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:dict:add', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1027, '字典修改', 105, 3, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:dict:edit', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1028, '字典删除', 105, 4, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:dict:remove', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1029, '字典导出', 105, 5, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:dict:export', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1030, '参数查询', 106, 1, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:config:query', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1031, '参数新增', 106, 2, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:config:add', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1032, '参数修改', 106, 3, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:config:edit', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1033, '参数删除', 106, 4, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:config:remove', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1034, '参数导出', 106, 5, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:config:export', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1035, '公告查询', 107, 1, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:notice:query', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1036, '公告新增', 107, 2, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:notice:add', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1037, '公告修改', 107, 3, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:notice:edit', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1038, '公告删除', 107, 4, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'system:notice:remove', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1039, '操作查询', 500, 1, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'monitor:operlog:query', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1040, '操作删除', 500, 2, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'monitor:operlog:remove', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1041, '日志导出', 500, 3, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'monitor:operlog:export', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1042, '登录查询', 501, 1, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'monitor:logininfor:query', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1043, '登录删除', 501, 2, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'monitor:logininfor:remove', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1044, '日志导出', 501, 3, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'monitor:logininfor:export', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1045, '账户解锁', 501, 4, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'monitor:logininfor:unlock', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1046, '在线查询', 109, 1, '#', '', '', '', 1, 0, 'F', '0', '2', '0', 'monitor:online:query', '#', 'admin', '2024-10-18 16:22:00', 'admin', '2024-12-10 13:03:10', '');
INSERT INTO `sys_menu` VALUES (1047, '批量强退', 109, 2, '#', '', '', '', 1, 0, 'F', '0', '2', '0', 'monitor:online:batchLogout', '#', 'admin', '2024-10-18 16:22:00', 'admin', '2024-12-10 13:03:30', '');
INSERT INTO `sys_menu` VALUES (1048, '单条强退', 109, 3, '#', '', '', '', 1, 0, 'F', '0', '2', '0', 'monitor:online:forceLogout', '#', 'admin', '2024-10-18 16:22:00', 'admin', '2024-12-10 13:03:26', '');
INSERT INTO `sys_menu` VALUES (1049, '任务查询', 110, 1, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'monitor:job:query', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1050, '任务新增', 110, 2, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'monitor:job:add', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1051, '任务修改', 110, 3, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'monitor:job:edit', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1052, '任务删除', 110, 4, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'monitor:job:remove', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1053, '状态修改', 110, 5, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'monitor:job:changeStatus', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_menu` VALUES (1054, '任务导出', 110, 6, '#', '', '', '', 1, 0, 'F', '0', '0', '0', 'monitor:job:export', '#', 'admin', '2024-10-18 16:22:00', '', NULL, '');

-- ----------------------------
-- Table structure for sys_notice
-- ----------------------------
DROP TABLE IF EXISTS `sys_notice`;
CREATE TABLE `sys_notice`  (
  `notice_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `notice_title` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '公告标题',
  `notice_type` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '公告类型（1通知 2公告）',
  `notice_content` longblob NULL COMMENT '公告内容',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '状态（0正常 2删除）',
  `create_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '创建者',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`notice_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '通知公告表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_notice
-- ----------------------------
INSERT INTO `sys_notice` VALUES (1, '温馨提醒：2024-11-12 嘉仪新版本发布啦', '2', 0xE696B0E78988E69CACE58685E5AEB9, '0', 'admin', '2024-10-18 16:22:00', '', NULL, '管理员');
INSERT INTO `sys_notice` VALUES (2, '维护通知：2024-11-12 嘉仪系统凌晨维护', '1', 0x3C703EE7BBB4E68AA4E58685E5AEB93C2F703E, '0', 'admin', '2024-10-18 16:22:00', 'admin', '2024-11-29 15:55:46', '管理员');
INSERT INTO `sys_notice` VALUES (3, '更新', '2', 0x3C703EE59388E593883C2F703E, '0', 'admin', '2024-11-29 15:44:58', 'admin', '2024-11-29 15:55:54', NULL);

-- ----------------------------
-- Table structure for sys_oper_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_oper_log`;
CREATE TABLE `sys_oper_log`  (
  `oper_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '日志主键',
  `title` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '模块标题',
  `business_type` int(2) NULL DEFAULT 0 COMMENT '业务类型（0其它 1新增 2修改 3删除）',
  `method` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '方法名称',
  `request_method` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '请求方式',
  `operator_type` int(1) NULL DEFAULT 0 COMMENT '操作类别（0其它 1后台用户 2手机端用户）',
  `oper_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '操作人员',
  `dept_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '部门名称',
  `oper_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '请求URL',
  `oper_ip` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '主机地址',
  `oper_location` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '操作地点',
  `oper_param` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '请求参数',
  `json_result` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '返回参数',
  `oper_status` int(1) NULL DEFAULT 0 COMMENT '操作状态（0正常 1异常）',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '状态（0正常 2删除）',
  `error_msg` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '错误消息',
  `oper_time` datetime(0) NULL DEFAULT NULL COMMENT '操作时间',
  `cost_time` bigint(20) NULL DEFAULT 0 COMMENT '消耗时间',
  `create_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '创建者',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '备注',
  PRIMARY KEY (`oper_id`) USING BTREE,
  INDEX `idx_sys_oper_log_bt`(`business_type`) USING BTREE,
  INDEX `idx_sys_oper_log_s`(`oper_status`) USING BTREE,
  INDEX `idx_sys_oper_log_ot`(`oper_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 107 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '操作日志记录' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_oper_log
-- ----------------------------
INSERT INTO `sys_oper_log` VALUES (103, '菜单管理', 1, 'com.personal.web.controller.system.SysMenuController.add()', 'POST', 1, 'admin', '研发部门', '/system/menu', '127.0.0.1', '内网IP', '{\"children\":[],\"createBy\":\"admin\",\"icon\":\"wechat\",\"isCache\":\"0\",\"isFrame\":\"1\",\"menuName\":\"微信小程序\",\"menuType\":\"M\",\"orderNum\":4,\"params\":{},\"parentId\":0,\"path\":\"wechat\",\"status\":\"0\",\"visible\":\"0\"}', '{\"msg\":\"操作成功\",\"code\":200}', 0, '0', NULL, '2024-10-18 17:34:24', 9, '', NULL, '', NULL, '');
INSERT INTO `sys_oper_log` VALUES (104, '菜单管理', 2, 'com.personal.web.controller.system.SysMenuController.edit()', 'PUT', 1, 'admin', '研发部门', '/system/menu', '127.0.0.1', '内网IP', '{\"children\":[],\"component\":\"tool/gen/index\",\"createTime\":\"2024-10-18 16:22:00\",\"icon\":\"code\",\"isCache\":\"0\",\"isFrame\":\"1\",\"menuId\":116,\"menuName\":\"代码生成\",\"menuType\":\"C\",\"orderNum\":2,\"params\":{},\"parentId\":2006,\"path\":\"gen\",\"perms\":\"tool:gen:list\",\"query\":\"\",\"routeName\":\"\",\"status\":\"0\",\"updateBy\":\"admin\",\"visible\":\"0\"}', '{\"msg\":\"操作成功\",\"code\":200}', 0, '0', NULL, '2024-10-18 17:34:39', 5, '', NULL, '', NULL, '');
INSERT INTO `sys_oper_log` VALUES (105, '菜单管理', 2, 'com.personal.web.controller.system.SysMenuController.edit()', 'PUT', 1, 'admin', '研发部门', '/system/menu', '127.0.0.1', '内网IP', '{\"children\":[],\"component\":\"tool/gen/index\",\"createTime\":\"2024-10-18 16:22:00\",\"icon\":\"code\",\"isCache\":\"0\",\"isFrame\":\"1\",\"menuId\":116,\"menuName\":\"代码生成\",\"menuType\":\"C\",\"orderNum\":2,\"params\":{},\"parentId\":3,\"path\":\"gen\",\"perms\":\"tool:gen:list\",\"query\":\"\",\"routeName\":\"\",\"status\":\"0\",\"updateBy\":\"admin\",\"visible\":\"0\"}', '{\"msg\":\"操作成功\",\"code\":200}', 0, '0', NULL, '2024-10-18 17:34:53', 4, '', NULL, '', NULL, '');
INSERT INTO `sys_oper_log` VALUES (106, '菜单管理', 2, 'com.personal.web.controller.system.SysMenuController.edit()', 'PUT', 1, 'admin', '研发部门', '/system/menu', '127.0.0.1', '内网IP', '{\"children\":[],\"component\":\"bqb/bqbImage/index\",\"createTime\":\"2024-10-18 17:32:30\",\"icon\":\"#\",\"isCache\":\"0\",\"isFrame\":\"1\",\"menuId\":2000,\"menuName\":\"表情包图片\",\"menuType\":\"C\",\"orderNum\":1,\"params\":{},\"parentId\":2006,\"path\":\"bqbImage\",\"perms\":\"bqb:bqbImage:list\",\"routeName\":\"\",\"status\":\"0\",\"updateBy\":\"admin\",\"visible\":\"0\"}', '{\"msg\":\"操作成功\",\"code\":200}', 0, '0', NULL, '2024-10-18 17:35:00', 6, '', NULL, '', NULL, '');

-- ----------------------------
-- Table structure for sys_post
-- ----------------------------
DROP TABLE IF EXISTS `sys_post`;
CREATE TABLE `sys_post`  (
  `post_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '岗位ID',
  `post_code` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '岗位编码',
  `post_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '岗位名称',
  `post_sort` int(4) NOT NULL COMMENT '显示顺序',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '状态（0正常 2删除）',
  `use_flag` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '使用状态（0正常 1停用）',
  `create_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '创建者',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`post_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '岗位信息表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_post
-- ----------------------------
INSERT INTO `sys_post` VALUES (1, 'ceo', '董事长', 1, '0', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_post` VALUES (2, 'se', '项目经理', 2, '0', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_post` VALUES (3, 'hr', '人力资源', 3, '0', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '');
INSERT INTO `sys_post` VALUES (4, 'user', '普通员工', 4, '0', '0', 'admin', '2024-10-18 16:22:00', 'admin', '2024-12-01 04:12:20', '');

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
  `role_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '角色名称',
  `role_key` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '角色权限字符串',
  `role_sort` int(4) NOT NULL COMMENT '显示顺序',
  `data_scope` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '1' COMMENT '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）',
  `menu_check_strictly` tinyint(1) NULL DEFAULT 1 COMMENT '菜单树选择项是否关联显示',
  `dept_check_strictly` tinyint(1) NULL DEFAULT 1 COMMENT '部门树选择项是否关联显示',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '状态（0正常 2删除）',
  `use_flag` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '角色状态（0正常 1停用）',
  `create_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '创建者',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`role_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '角色信息表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES (1, '超级管理员', 'admin', 1, '1', 1, 1, '0', '0', 'admin', '2024-10-18 16:22:00', '', NULL, '超级管理员');
INSERT INTO `sys_role` VALUES (2, '普通角色', 'common', 2, '2', 1, 1, '0', '0', 'admin', '2024-10-18 16:22:00', 'admin', '2024-12-01 04:33:17', '普通角色');

-- ----------------------------
-- Table structure for sys_role_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_dept`;
CREATE TABLE `sys_role_dept`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `role_id` bigint(20) NOT NULL COMMENT '角色ID',
  `dept_id` bigint(20) NOT NULL COMMENT '部门ID',
  `create_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '创建者',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '状态（0代表存在 2代表删除）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '角色和部门关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `role_id` int(11) NOT NULL COMMENT '角色ID',
  `menu_id` int(10) NOT NULL COMMENT '菜单ID',
  `create_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '创建者',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '状态（0代表存在 2代表删除）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 85 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '角色和菜单关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
INSERT INTO `sys_role_menu` VALUES (1, 2, 1, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (2, 2, 2, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (3, 2, 3, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (4, 2, 100, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (5, 2, 101, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (6, 2, 102, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (7, 2, 103, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (8, 2, 104, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (9, 2, 105, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (10, 2, 106, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (11, 2, 107, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (12, 2, 108, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (13, 2, 109, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (14, 2, 110, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (15, 2, 111, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (16, 2, 112, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (17, 2, 113, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (18, 2, 114, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (19, 2, 115, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (20, 2, 116, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (21, 2, 117, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (22, 2, 500, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (23, 2, 501, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (24, 2, 1000, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (25, 2, 1001, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (26, 2, 1002, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (27, 2, 1003, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (28, 2, 1004, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (29, 2, 1005, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (30, 2, 1006, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (31, 2, 1007, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (32, 2, 1008, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (33, 2, 1009, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (34, 2, 1010, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (35, 2, 1011, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (36, 2, 1012, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (37, 2, 1013, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (38, 2, 1014, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (39, 2, 1015, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (40, 2, 1016, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (41, 2, 1017, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (42, 2, 1018, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (43, 2, 1019, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (44, 2, 1020, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (45, 2, 1021, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (46, 2, 1022, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (47, 2, 1023, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (48, 2, 1024, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (49, 2, 1025, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (50, 2, 1026, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (51, 2, 1027, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (52, 2, 1028, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (53, 2, 1029, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (54, 2, 1030, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (55, 2, 1031, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (56, 2, 1032, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (57, 2, 1033, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (58, 2, 1034, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (59, 2, 1035, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (60, 2, 1036, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (61, 2, 1037, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (62, 2, 1038, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (63, 2, 1039, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (64, 2, 1040, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (65, 2, 1041, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (66, 2, 1042, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (67, 2, 1043, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (68, 2, 1044, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (69, 2, 1045, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (70, 2, 1046, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (71, 2, 1047, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (72, 2, 1048, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (73, 2, 1049, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (74, 2, 1050, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (75, 2, 1051, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (76, 2, 1052, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (77, 2, 1053, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (78, 2, 1054, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (79, 2, 1055, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (80, 2, 1056, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (81, 2, 1057, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (82, 2, 1058, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (83, 2, 1059, '', NULL, '', NULL, '0');
INSERT INTO `sys_role_menu` VALUES (84, 2, 1060, '', NULL, '', NULL, '0');

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `dept_id` int(10) NULL DEFAULT NULL COMMENT '部门ID',
  `user_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户账号',
  `nick_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户昵称',
  `user_type` varchar(2) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '00' COMMENT '用户类型（00系统用户）',
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '用户邮箱',
  `phonenumber` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '手机号码',
  `sex` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '用户性别（0男 1女 2未知）',
  `avatar` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '头像地址',
  `password` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '密码',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '状态（0代表存在 2代表删除）',
  `use_flag` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `login_ip` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '最后登录IP',
  `login_date` datetime(0) NULL DEFAULT NULL COMMENT '最后登录时间',
  `create_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '创建者',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户信息表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (1, 103, 'admin', '嘉仪管理员', '00', 'jy@163.com', '15888888888', '1', '', '$2b$10$fXm/RvEj7ydS5uZ/YwpzqeG5eowyin5hqZvJa2ax/R84Kpc0sostC', '0', '0', '127.0.0.1', '2024-12-12 11:58:34', 'admin', '2024-10-18 16:22:00', 'system', '2024-12-01 04:53:18', '管理员');
INSERT INTO `sys_user` VALUES (2, 105, 'jy', '嘉仪', '00', 'ry@qq.com', '15666666666', '1', '', '$2b$10$hZtSG62.3SRHqX8WYhk1F.XRAn8XtZuitcJdBIakNCF77ExKiAxNW', '0', '0', '127.0.0.1', '2024-12-01 04:53:41', 'admin', '2024-10-18 16:22:00', 'system', '2024-12-01 04:53:54', '测试员');
INSERT INTO `sys_user` VALUES (3, 103, 'jj', '加加', '00', '', '', '0', '', '$2b$10$f2viHrOj59g0/rOBwelOze2zxNHyF9t99N6hWYZZmOKKHn/f9GmKu', '0', '0', '', '2024-12-01 04:54:10', 'admin', '2024-12-01 03:45:07', 'system', '2024-12-01 03:56:30', NULL);

-- ----------------------------
-- Table structure for sys_user_post
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_post`;
CREATE TABLE `sys_user_post`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int(10) NOT NULL COMMENT '用户ID',
  `post_id` int(10) NOT NULL COMMENT '岗位ID',
  `create_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '创建者',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '状态（0代表存在 2代表删除）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户与岗位关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_post
-- ----------------------------
INSERT INTO `sys_user_post` VALUES (1, 1, 1, '', NULL, '', NULL, '0');
INSERT INTO `sys_user_post` VALUES (2, 2, 2, '', NULL, '', NULL, '0');

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int(10) NOT NULL COMMENT '用户ID',
  `role_id` int(10) NOT NULL COMMENT '角色ID',
  `create_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '创建者',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '状态（0代表存在 2代表删除）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户和角色关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO `sys_user_role` VALUES (1, 1, 2, '', NULL, '', NULL, '0');
INSERT INTO `sys_user_role` VALUES (2, 2, 2, '', NULL, '', NULL, '0');
INSERT INTO `sys_user_role` VALUES (3, 3, 2, '', NULL, '', NULL, '0');

-- ----------------------------
-- Table structure for td_images
-- ----------------------------
DROP TABLE IF EXISTS `td_images`;
CREATE TABLE `td_images`  (
  `id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `filename` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `type` int(11) NOT NULL,
  `suffix` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `tag` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

SET FOREIGN_KEY_CHECKS = 1;
