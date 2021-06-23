---
title: VuePress部署到服务器
date: 2021-01-01
tags:
- VuePress
publish: true
---

## 第一章：VuePress部署发布

### 推送到gitee仓库
1. 创建仓库
2. 配置秘钥
3. 拉取仓库
4. 将代码拷贝至仓库
5. push至gitee/github

[Git入门视频&码云配置](https://www.bilibili.com/video/BV1a4411c7oZ)

<iframe src="https://player.bilibili.com/player.html?aid=58000905&amp;bvid=BV1a4411c7oZ&amp;cid=101208258&amp;page=1&amp;high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="allowfullscreen" sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts" __idm_id__="724097027" style="color: rgb(35, 35, 33); font-family: Ubuntu, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Cantarell, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; width: 640px; height: 530px; max-width: 100%;"></iframe>



### 云服务ESC配置环境

#### 	1. Git安装(熟悉者直接跳过)

```shell
# 安装，不一定是最新的
$ yum install -y git

# 查看版本
$ git --version

# 设置git用户信息
$ git config --global user.name "Your Name"
$ git config --global user.email "email@example.com"

```

#### 	2. Node安装(使用宝塔面板可直接应用商店安装)

```shell
# 下载最新版本包 https://nodejs.org/dist
$ wget https://nodejs.org/dist/v14.5.0/node-v14.5.0-darwin-x64.tar.gz

# 解压
$ tar -xvf node-v14.5.0-darwin-x64.tar.gz

# 建立软链接
$ ln -s ~/node-v10.13.0-linux-x64/bin/node /usr/bin/node
$ ln -s ~/node-v10.13.0-linux-x64/bin/npm /usr/bin/npm

# 检查版本
$ node -v
$ npm -v

```

#### 	3. SSH私钥生成

xxx@xxx.com：只是一个模板，此处可以随意填写，并不限制于邮箱，只要是字符串就行。

::: tip

ssh-keygen -t rsa -C "xxxxx@xxxxx.com"
:::

按三次回车你就会看见这个东西(不要在意为什么生成的不一样,这里生成的中文是我自己写的)

![77](https://gitee.com/ichensw/drawing-bed/raw/master/image/77.png)

**注意:生成的文件名跟密码可以不填,直接按3次回车.填了以后使用git都要输入密码,就显得很麻烦,那还不如不填.**

按照提示完成三次回车，即可生成 ssh key.通过查看 ~/.ssh/id_rsa.pub 文件内容，获取到你的ssh key

::: tip

cat ~/.ssh/id_rsa.pub
:::

输出:

![78](https://gitee.com/ichensw/drawing-bed/raw/master/image/78.png)

这个就是ssh key的内容(可以理解公钥)

复制生成后的 ssh key，通过**点击个人头下的设置>找到安全设置>SSH公钥** ，添加生成的ssh key 添加到仓库中。(这个以码云为例)

![79](https://gitee.com/ichensw/drawing-bed/raw/master/image/79.png)

![80](https://gitee.com/ichensw/drawing-bed/raw/master/image/80.png)

添加后，在终端中输入

::: tip

ssh -T git@gitee.com

:::

首次使用需要确认并添加主机到本机SSH可信列表。若返回 Hi XXX! You've successfully authenticated, but Gitee.com does not provide shell access. 内容，则证明添加成功。

添加成功后，就可以使用SSH协议对仓库进行操作了。

作者：[坏人_哒](https://www.jianshu.com/p/3e069ed546c4)
来源：简书

#### 4. 公钥配置(`gitee/github`)

将`/root/.ssh`目录下的公钥配置到代码托管平台，与windows一样，配置好后才能下载拉取

![81](https://gitee.com/ichensw/drawing-bed/raw/master/image/81.png)

```shell
# 在home目录下(随便哪儿个都行，仅作为存放项目的目录)，创建deploy目录，并作为vuepress源码的存放目录
$ cd /home
$ mkdir deploy
$ cd deploy

# 拉取gitee仓库的源码(此处改为你仓库的路径)
$ git clone git@gitee.com:appdoc/it235.git
```

![82](https://gitee.com/ichensw/drawing-bed/raw/master/image/82.png)

```shell
# 进入源码目录
$ cd it235

# 
$ npm install

# 以前台的方式运行，查看控制台端口，我这边设置的是7777
$ npm run docs:dev
注!!!：这种运行方式，不能`ctrl+d`退出，否则进程被杀死，一般我们以nohup的方式启动，如下
```

#### 5. `start.sh`脚本方式启动

```shell
# 在it235目录中创建start.sh脚本
$ touch start.sh

# 授予权限
$ chmod 775 start.sh

# 编辑启动脚本
$ vim start.sh
```

start.sh`脚本如下

```shell
#!/bin/bash
# 切入源码目录，以确保能正常执行
cd /home/deploy/it235

# 拉取最新代码
git pull

# 杀死目前已启动进程
ID=`ps -ef|grep node | grep vuepress|awk '{print $2}'`
echo --- the process is $ID ---
kill -9  $ID
echo  "Killed $ID"

# 启动
nohup npm run docs:dev&
```

按esc ，输入:wq，保存退出后，使用`./start.sh`来启动程序

```shell
# 执行启动命令
$ ./start.sh

# 查看运行日志
$ tail -222f nohup.out

# 使用curl检测程序是否正常运行
$ curl http://localhost:7777
```

#### 6. 让外网通过ip+端口的方式访问

进入服务器安全组

![83](https://gitee.com/ichensw/drawing-bed/raw/master/image/83.png)

![84](https://gitee.com/ichensw/drawing-bed/raw/master/image/84.png)

添加7777端口为`0.0.0.0/0`

![85](https://gitee.com/ichensw/drawing-bed/raw/master/image/85.png)

外网通过`ip + 端口`的方式访问，查看效果

![86](https://gitee.com/ichensw/drawing-bed/raw/master/image/86.png)

#### 7. [Nginx安装](https://www.bilibili.com/video/BV1gt411A798?p=6)

<iframe src="//player.bilibili.com/player.html?bvid=BV1gt411A798&cid=106535528&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" width="100%" height="500px"></iframe>

#### 8. `Nginx`域名http版配置

```shell
# 进入/usr/local/nginx/conf/目录
$ vim nginx.conf

# 在最后一行大括号结束之前，加入以下配置，并将it235换成你的域名
# http域名配置
server {
	listen 80;
    server_name www.it235.com it235.com;
    # 域名默认映射到 http://127.0.0.1:7777
    location / {
    	proxy_pass http://127.0.0.1:7777;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

		root html;
        index index.html index.html;
	}
}
```

#### 9. 重新加载nginx配置文件

此处如果使用宝塔面板的话想对方便，可直接图形化操作，直接配置nginx然后重载配置

```shell
# 验证nginx配置文件是否正确
$ /usr/local/nginx/sbin/nginx -t
nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful


# 重新加载nginx配置文件，重新加载才会生效
$ /usr/local/nginx/sbin/nginx -s reload
```

#### 10. SSL证书(https)配置

阿里云免费证书

![87](https://gitee.com/ichensw/drawing-bed/raw/master/image/87.png)

![88](https://gitee.com/ichensw/drawing-bed/raw/master/image/88.png)

[`Let's Encrypt`免费证书](https://www.jianshu.com/p/3f6a39064f7d)，一次申请只能使用3个月，到期后需要手动续期

#### 11. Nginx配置证书

```shell
# 进入/usr/local/nginx/conf/目录
$ vim nginx.conf

# 在最后一行大括号结束之前，加入以下配置，并将it235换成你的域名
	# 所有http的请求，统一发到https请求上
	server {
    	listen 80;
    	server_name www.blog.ichensw.cn blog.ichensw.cn;
    	rewrite ^(.*)$  https://$host$1 permanent;
	}

	# 未带www的请求，统一分发到https://www上
	server {
        listen 80;
		listen 443 ssl;
        server_name  blog.ichensw.cn;
		return 301 https://www.blog.ichensw.cn$request_uri;
	}

	# https 请求处理
    server {
    	listen 443 default_server ssl;
        server_name  www.blog.ichensw.cn;
        ssl_certificate /etc/letsencrypt/live/it235.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/it235.com/privkey.pem;

        large_client_header_buffers 4 16k;
        client_max_body_size 30m;
        client_body_buffer_size 128k;

    	# 域名默认映射到 http://127.0.0.1:7777
        location / {
               proxy_pass http://127.0.0.1:7777;
               proxy_redirect off;
               proxy_set_header Host $host;
               proxy_set_header X-Real-IP $remote_addr;
               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
               proxy_set_header Upgrade $http_upgrade;
               proxy_set_header Connection "upgrade";

               root html;
               index index.html index.html;

        }
	}
```

```shell
# 验证nginx配置文件是否正确
$ /usr/local/nginx/sbin/nginx -t

# 重新加载nginx配置文件，重新加载才会生效
$ /usr/local/nginx/sbin/nginx -s reload
```

最终效果，访问`https://www.ichensw.cn要能成功，并且加上锁

## 第二章：自动发布

### 推送触发自动构建

#### 	1. 接口核心代码编写

```java
package com.webhook.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.util.Map;

/**
 * 知码学院：带你轻松学Java
 * www.it235.com
 * QQ：3020685261
 */
@RestController
@RequestMapping("webhook")
public class PullController {

    @Value("${shell.startFileName:start.sh}")
    private String startFileName;

    @Value("${shell.directory}")
    private String directory;

    @Value("${shell.token:zhima123}")
    private String token;

    private static final Logger logger = LoggerFactory.getLogger(PullController.class);

    /**
     * 请求
     * @param userAgent
     * @param giteeToken
     * @param giteeEvent
     * @return
     * @throws IOException
     */
    @PostMapping("it235")
    public String auto(@RequestHeader("User-Agent") String userAgent,
                       @RequestHeader("X-Gitee-Token") String giteeToken,
                       @RequestHeader("X-Gitee-Event") String giteeEvent) throws IOException {
        //git-oschina-hook
        logger.info("User-Agent:{}", userAgent);
        //zhimaxxx
        logger.info("X-Gitee-Token:{}", giteeToken);
        //Push Hook
        logger.info("Gitee-Event:{}", giteeEvent);

        if("git-oschina-hook".equals(userAgent)
                && "PUSH HOOK".equals(giteeEvent)
                && token.equals(giteeToken)){
            //才去调用shell脚本
            executeShell();
            return "ok";
        }
        return "非法调用";
    }


    /**
     * 执行脚本
     * @throws IOException
     */
    public void executeShell() throws IOException {
        String fullName = getFullName(startFileName);
        File file = new File(fullName);
        if(!file.exists()) {
            logger.error("file {} not existed!", fullName);
            return;
        }
        //赋予755权限并调用
        ProcessBuilder processBuilder = new ProcessBuilder("/bin/chmod", "755", fullName);
        processBuilder.directory(new File(directory));
        Process process = processBuilder.start();

        int runningStatus = 0;
        try {
            runningStatus = process.waitFor();
        } catch (InterruptedException e) {
            logger.error("shell", e);
        }

        if(runningStatus != 0) {
            logger.error("failed.");
        }else {
            logger.info("success.");
        }
    }

    /**
     * 文件调用全路径
     * @param fileName
     * @return
     */
    private String getFullName(String fileName) {
        return directory + File.separator + fileName;
    }
}
```

Gitee地址：https://gitee.com/appdoc/webhook.git

#### jenkins构建触发

暂无

#### webhooks自动触发

![89](https://gitee.com/ichensw/drawing-bed/raw/master/image/89.png)

#### 定时任务进行git pull更新内容

## 第三章：内容定期更新维护

作者暂未更新

文章摘自：[君哥的学习笔记](https://book.hliedu.com/)