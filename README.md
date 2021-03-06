# brown-cli

## 核心

简单易用当然是我的目标之一，准确来说，我希望给开发者们提供一个“无压”的开发环境。

每个人的精力都是有限的，因为有限，我们就需要将注意力集中在项目的核心 -- 代码上。

但是现实的开发环境并不是如此，我们时常被代码之外的内容夺去注意力，甚至花上更多的精力去处理这些并不能让代码变得更好的东西上。

所以我选择将代码之外的这部分内容剥离。

---

## 介绍

现在来简单介绍下项目的构成，它主要由这几部分内容构成：

- 项目搭建
- 开发环境
- 项目打包
- 内容更新
- 代码校验

分别对应着五个命令：

- colo init
- colo server
- colo build
- colo update
- colo lint

现在来介绍下这些命令的用法。

## 本地安装方法
- npm brown-cli -g
- git clone 代码
	- 在 brown-cli 运行 `npm link` or `sudo npm link`
	- 同 -g 使用原理一致


## 用法

### init

~~~bash
colo init
~~~

### server

~~~bash
colo server

# 指定端口
colo server [-p|--port <port>]
~~~

### build

~~~bash
colo build

# 不压缩
colo build [-C|--no-compress]
# 压缩后删除 dist
colo build [-d|--delete]
~~~

### update

~~~bash
colo update

# 更新模板，brown-ui 和 colo-cli
colo update [-a|--all]
~~~

### lint

~~~bash
colo lint

# 自动修复
colo lint [-f|--fix]
~~~

## .colorc 配置选项说明

<table width="100%" cellspacing="0" cellpadding="0" border="1" style="border-collapse: collapse;display: table;text-align: center;">
	<thead>
		<tr>
			<th>参数</th>
			<th>说明</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>href</td>
			<td>hostname</td>
		</tr>
        <tr>
			<td>port</td>
			<td>端口</td>
		</tr>
        <tr>
			<td>proxy</td>
			<td>代理配置</td>
		</tr>
        <tr>
			<td>rules</td>
			<td>Eslint 的规则配置</td>
		</tr>
        <tr>
			<td>webpack</td>
			<td>用来覆盖基础配置</td>
		</tr>
        <tr>
			<td>updateList</td>
			<td>配置需要更新的文件</td>
		</tr>
        <tr>
			<td>_meta</td>
			<td>元信息</td>
		</tr>
	</tbody>
</table>

