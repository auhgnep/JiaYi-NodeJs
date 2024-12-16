<p align="center">
	<img alt="logo" src="https://oscimg.oschina.net/oscnet/up-8342b0ad86a8badcc3377fde944be6dc35e.png">
</p>
<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;">JiaYi v0.0.1</h1>
<h4 align="center">基于NodeJs开发的轻量级快速开发框架</h4>
<p align="center">
	<a href="https://gitee.com/auhgnep/JiaYi-NodeJs/blob/master/LICENSE"><img src="https://img.shields.io/github/license/mashape/apistatus.svg"></a>
</p>



## 平台简介

一款后台管理系统，基于若依那套框架改的Nodejs版本，她可以用于所有的Web应用程序，如网站管理后台，网站会员中心，CMS，CRM，OA。这套框架会比若依更简便，更轻量级。

嘉仪，嘉言善行，仪态万方。

嘉仪是一套全部开源的快速开发平台，毫无保留给个人及企业免费使用。

* 前端代码，移步[JiaYi-Vue2](https://gitee.com/auhgnep/JiaYi-Vue-Element)
* 后端Python版本代码，移步[JiaYi-Python](https://gitee.com/auhgnep/JiaYi-Python)



## 本地启动与部署

```shell
# 配置上canvas_binary_host_mirror， 直接npm install的话canvas安装可能会有问题
npm install --canvas_binary_host_mirror=https://registry.npmmirror.com/-/binary/canvas

# 启动 使用的配置为src\config\index.js
npm run dev

# 测试环境打包 使用的配置为src\config\sit.js
npm run build:sit

# 生产环境打包 使用的配置为src\config\prod.js
npm run build:prod

# 生产启动 打包后会在dist内生成server.bundle.js
nohup node server.bundle.js &

# 生产启动 使用pm2启动
pm2 start server.bundle.js --watch
```



### 功能版本

NodeJs版本建议 ≥ 16

Redis版本建议 ≥ 3.2.0

Mysql版本建议 ≥ 5.6

| 功能      | 框架          |
| --------- | ------------- |
| HTTP服务  | express       |
| 数据库ORM | sequelize     |
| 定时任务  | node-schedule |
| 权限认证  | jwt           |
| 打包      | webpack       |



### 代码生成

暂时只支持后端代码生成

```javascript
// 生成类 为/codeGenerator.js

// 表名
const DATA_TABLE_NAME = 'sys_oper_log'
// 生成的路径
const OUT_PATH = './src'

const generator = new CodeGenerator(dbConfig);
generator.generateFiles(DATA_TABLE_NAME, OUT_PATH)
  .then(() => console.log('Code generation completed!'))
  .catch(console.error);

// 在项目根目录直接执行
node ./codeGenerator.js
```



## 内置功能

1.  用户管理：用户是系统操作者，该功能主要完成系统用户配置。
2.  部门管理：配置系统组织机构（公司、部门、小组），树结构展现支持数据权限。
3.  岗位管理：配置系统用户所属担任职务。
4.  菜单管理：配置系统菜单，操作权限，按钮权限标识等。
5.  角色管理：角色菜单权限分配、设置角色按机构进行数据范围权限划分。
6.  字典管理：对系统中经常使用的一些较为固定的数据进行维护。
7.  参数管理：对系统动态配置常用参数。
8.  通知公告：系统通知公告信息发布维护。
9.  操作日志：系统正常操作日志记录和查询；系统异常信息日志记录和查询。
10. 登录日志：系统登录日志记录查询包含登录异常。
12. 定时任务：在线（添加、修改、删除)任务调度包含执行结果日志。
13. 代码生成：后端代码的生成（nodejs）。
15. 服务监控：监视当前系统CPU、内存、磁盘、堆栈等相关信息。

## 演示图

<table>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-a3ecb35455da01cd8ba0f6756f75ecb924e.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-535edbb5423f48e9f3232bc009562e85975.png"/></td>
    </tr>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-9031bda256fa07d4fd42157c0445c6a71a0.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-cb66c7c63800feb63316ec7797e4f82d26f.png"/></td>
    </tr>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-707adc44b0da0f56d856253683f9100e262.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-a09b55594b6d0eb5cfdfb2ce532ba1633ae.png"/></td>
    </tr>
	<tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-b157f3ea3d7beb1f17f748da89cecf3a199.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-bcc62880604e6758d04aaf13da0a3b4fe27.png"/></td>
    </tr>
</table>



## 嘉仪交流群

QQ群： [![加入QQ群](https://img.shields.io/badge/645103562-blue.svg)](https://qm.qq.com/q/Ssvbr5dcIy)