---
title: 【Mybatis】主从复制配置
date: 2021-01-01
sidebar: 'auto'
categories:
- MyBatis
tags:
- MyBatis
publish: true
---

## 1. 环境

**操作系统：**CentOS-7

**MySQL：**mysql-5.6

**一台虚拟机又克隆了两台**

192.168.102.31　　master

192.168.102.56　　slave

192.168.102.36　　slave

启动/停止

```
service  mysqld  start|stop|restart
systemctl  start|stop|restart  mysqld本机的话，直接mysql就可以进去了
```

## 2. 主数据库配置

#### 第1步：编辑/etc/my.cnf文件，在[mysqld]下增加如下两行设置：

```
[mysqld]
log-bin=mysql-bin # 非必需
server-id=1　　　　# 必需
```

![img](https://img2018.cnblogs.com/blog/874963/201809/874963-20180926130101829-594250777.png)

![img](https://img2018.cnblogs.com/blog/874963/201809/874963-20180926130255775-226099484.png)

#### 第2步：创建用于数据同步的账户

```
CREATE USER 'repl'@'192.168.102.%' IDENTIFIED BY '123456';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'192.168.102.%';
FLUSH PRIVILEGES;
```

![img](https://img2018.cnblogs.com/blog/874963/201809/874963-20180926131907050-1560169115.png)

#### 第3步：查看master状态

```
show master status;
```

![img](https://img2018.cnblogs.com/blog/874963/201809/874963-20180926132006886-845263690.png)

![img](https://img2018.cnblogs.com/blog/874963/201809/874963-20180926132017006-1664294516.png)

## 3. 从数据库配置

#### 第1步：编辑/etc/my.cnf文件，设置server-id

```
[mysqld]
server-id=2
```

#### 第2步：执行同步语句，并启动slave

```
change master to master_host='192.168.102.31', master_user='repl', master_password='123456', master_log_file='mysql-bin.000001', master_log_pos=514;
```

![img](https://img2018.cnblogs.com/blog/874963/201809/874963-20180926132317459-1483991050.png)

#### 第3步：查看slave状态

```
show slave status\G;
```

![img](https://img2018.cnblogs.com/blog/874963/201809/874963-20180926132522820-2013469834.png)

另外一台从数据库也是这样设置

## 4. 验证是否同步成功

在主数据上操作，从数据库中查看

![img](https://img2018.cnblogs.com/blog/874963/201809/874963-20180926132807125-842266308.png)

![img](https://img2018.cnblogs.com/blog/874963/201809/874963-20180926132756701-525312938.png)

## 5. 设置只读账户

```
mysql> create user 'pig'@'%' identified by '123456';
mysql> grant select on test.* to 'pig'@'%';
mysql> flush privileges;
```

 

## 6. 参考

<a>https://dev.mysql.com/doc/refman/5.7/en/replication-options-slave.html</a>

<a>http://www.cnblogs.com/gl-developer/p/6170423.html</a>

<a>https://www.cnblogs.com/alvin_xp/p/4162249.html</a>

<a>https://www.cnblogs.com/sos-blue/p/6852945.html</a>