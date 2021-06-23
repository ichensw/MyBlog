---
title: IDEA的Postman工具
date: 2021-06-20
categories:
- IDEA
tags:
- IDEA
publish: true
---
# IDEA的Postman(Http Client)

## HTTP Client

​	[前言](#qy)

1. [准备](#1)
2. [创建HTTP Client文件](#2)
   1. [直接创建文件](#2.1)
   2. [创建草稿文件](#2.2)
3. [语法](#yf)
   1. [注释使用#或者//](#3.1)
   2. [如果是get请求可以省略方法说明，直接写url](#3.2)
   3. [一个文件中多个请求以###分割](#3.3)
   4. [body内容可以来自一个文件语法如下](#3.4)
   5. [请求也可以传文件，语法如下](#3.5)
   6. [@no-redirect注解：可以关闭重定向](#3.6)
   7. [@no-log注解：可以阻止请求记录到历史记录](#3.7)
   8. [@no-cookie-jar: 可以阻止保存cookies数据](#3.8)
   9. [使用变量](#3.9)
4. [快速生成请求](#4)
   1. [打开请求文件，点击Add Request菜单](#4.1)
   2. [Convert from cURL](#4.2)
   3. [Live Template](#4.3)
   4. [Examples](#4.4)
5. [环境变量](#5)
6. [处理响应](#6)
   1. [client对象](#6.1)
   2. [response对象](#6.2)
7. [运行Http Request](#7)
   1. [直接在http文件里面点绿色三角形运行](#7.1)
   2. [创建run/debug configuration运行](#7.2)
   3. [查看请求响应](#7.3)
8. [其他功能](#8)
  1. [查看历史请求](#8.1)
  2. [配置代理](#8.2)

### <span id="qy">前言</span>

idea推出了一个新功能http client，可以媲美postman，基本上实现了postman的绝大多数核心功能，更重要的是它的请求数据是纯文本的，非常方便，结合自动化脚本，很有想象空间，比如自动生成测试脚本，自动化测试等

###  <span id="1">1. 准备</span>

​	要想使用这个功能需要2017.3以上的版本，但是老版本的这个功能很弱，所以建议升级到2019.3的版本可以享受全部新能力。
默认情况插件**Java EE: RESTful Web Services (JAX-RS)**是安装了并且启用了，如果没有可以到设置里面去安装并启动下

### 2. 创建HTTP Client文件

####  <span id="2.1">2.1 直接创建文件</span>

选择路径 -> 右键 -> 新建 -> Http Request
先择路径 -> 文件菜单 -> 新建 -> Http Request

####  <span id="2.2">2.2 创建草稿文件</span>

Ctrl/Command + Shift+ Alt+ Insert
选择Http Request

###  <span id="3">3. 语法</span>

每个请求都是以文本是形式存储起来，http后缀的文本文件，一个文件里面可以存储多个请求。
它的语法格式跟http请求的内容很接近
请求方法， 请求url，换行加上header参数，如果有body体，空一行加上body体

```http
Method Request-URI HTTP-Version
Header-field: Header-value

Request-Body
```


下面是一个示例

```http
POST http://test.abc.com/user
accept: */*
Content-Type: application/json;charset=UTF-8

{"uid":"test1", "token":"122asseeeddd", "age":32}
```

####  <span id="3.1">3.1. 注释使用#或者//</span>

####  <span id="3.2">3.2. 如果是get请求可以省略方法说明，直接写url</span>

####  <span id="3.3">3.3. 一个文件中多个请求以###分割</span>

#### <span id="3.4">3.4. body内容可以来自一个文件语法如下</span>

```http
<./input.json
```

#### <span id="3.5">3.5. 请求也可以传文件，语法如下</span>

```http
POST http://example.com/api/upload HTTP/1.1
Content-Type: multipart/form-data; boundary=boundary

--boundary
Content-Disposition: form-data; name="first"; filename="input.txt"

// The 'input.txt' file will be uploaded
< ./input.txt

--boundary
Content-Disposition: form-data; name="second"; filename="input-second.txt"

// A temporary 'input-second.txt' file with the 'Text' content will be created and uploaded
Text
--boundary
Content-Disposition: form-data; name="third";

// The 'input.txt' file contents will be sent as plain text.
< ./input.txt --boundary--
```

#### <span id="3.6">3.6. @no-redirect注解：可以关闭重定向</span>

```http
// @no-redirect
example.com/status/301
```

#### <span id="3.7">3.7. @no-log注解：可以阻止请求记录到历史记录</span>

```http
// @no-log
GET example.com/api
```

#### <span id="3.8">3.8 @no-cookie-jar: 可以阻止保存cookies数据</span>

```http
// @no-cookie-jar
GET example.com/api
```

#### <span id="3.9">3.9 使用变量</span>

它定义了3个变量

- $uuid 唯一标识符（UUID-v4）
- $timestamp 当前时间
- $randomInt 0-1000的随机整数

```http
GET http://localhost/api/get?id={{$uuid}}
```

### <span id="4">4. 快速生成请求</span>

#### <span id="4.1">4.1 打开请求文件，点击Add Request菜单</span>

从这里可以快速添加GET请求和POST请求的模板

#### <span id="4.2">4.2 Convert from cURL</span>

这个功能可以将浏览器网络请求生成的curl命令直接导入，注意如果命令里面带–compressed后缀，需要将此后缀去掉再导入

#### <span id="4.3">4.3 Live Template</span>

系统默认预置了几个基本的命令，可以快速生成GET和POST请求，这个跟Add Reqeust是对应的，可以修改他们。
还可以补充新的，注意如果新增要选择可用的文件为Http Request

#### <span id="4.4">4.4 Examples</span>

选择Examples，从里面选择合适的复制粘贴过来

### <span id="5">5.环境变量</span>

在同目录下新建一个http-client.env.json (or rest-client.env.json)文件
就是一个配置文件，语法很简单，如下是示例



```yml
{
    "development": {
        "host": "localhost",
        "id-value": 12345,
        "username": "",
        "password": "",
        "my-var": "my-dev-value"
    },
	"production": {
        "host": "example.com",
        "id-value": 6789,
        "username": "",
        "password": "",
        "my-var": "my-prod-value"
    }
}
```

使用起来很简单

```http
GET http://{{host}}/api/json/get?id={{id-value}}&key={{unresolved_var}}
Authorization: Basic {{username}} {{password}}
Content-Type: application/json

{
	"key": {{my-var}}
}
```

运行请求的时候会让你选环境的，选了环境就会用对应的变量替换请求里面的占位符。还有个http-client.private.env.json，语法用法一样，这个文件是用来存一些敏感信息，把它加到.gitignore就不会到代码库里面了，感觉用途不大。

### <span id="6">6. 处理响应</span>

这个算高级功能了，可以写一段javascript(JavaScript ECMAScript 5.1)脚本来处理接口返回的信息，语法如下

```http
GET host/api/test

> {%
// Response handler script
...
%}

###
host/api/test

> scripts/my-script.js
```

处理响应的第一个用途是测试，要实现这个功能得益于Http Response Handler的两个对象：

#### <span id="6.1">6.1 client对象</span>

这个对象保存了session信息，可以在js脚本里被修改，而且它还可以定义client.global变量，这个变量是全局的，可以像环境变量一样使用{{variable_name}}.
这个功能很强大可以实现自动登录读取cookie并设置全局变量。该对象会在IDEA关闭后失效。
它还有两个测试方法test， assert
详细语法参考：[HTTP Client reference](https://www.jetbrains.com/help/idea/http-client-reference.html?keymap=primary_default_for_windows)

```http
POST https://httpbin.org/cookies

//Saving a cookie from the first Set-Cookie header
> {%
    client.global.set("my_cookie", response.headers.valuesOf("Set-Cookie")[0]);
%}
```

#### <span id="6.2">6.2 response对象</span>

响应对象，包含content-type，status，response body等。
详细语法参考：[HTTP Response reference](https://www.jetbrains.com/help/idea/http-response-reference.html?keymap=primary_default_for_windows)

```HTTP
GET https://httpbin.org/status/200

> {%
    client.test("Request executed successfully", function() {
        client.assert(response.status === 200, "Response status is not 200");
    });
%}
```

### <span id="7">7. 运行Http Request</span>

#### <span id="7.1">7.1 直接在http文件里面点绿色三角形运行</span>

直接执行会创建一个临时的run/debug配置，保存后可以快捷运行请求

#### <span id="7.2">7.2 创建run/debug configuration运行</span>

在请求上点右键选择**[创建 ’http-request#1‘]**
如果有环境变量会让你设置运行的环境变量
创建完就可以run/debug下拉列表里面选中并快速运行请求了

#### <span id="7.3">7.3 查看请求响应</span>

进入run窗口，选中对应的请求标签页，即可看到响应，可以选择查看格式：
XML，JSON，HTML

### <span id="8">8. 其他功能</span>

#### <span id="8.1">8.1 查看历史请求</span>

Tool -> Http Client -> SHow Http Requests History

#### <span id="8.2">8.2 配置代理</span>

既然是http请求，那自然是可以设置代理，这个功能它也是支持的。
Settings -> System Settings -> Apperance & Behavior -> HTTP Proxy

参考文档：[IDEA的Postman(Http Client)](https://blog.csdn.net/clover402/article/details/103562965) 

作者：[kyo870526](https://blog.csdn.net/kyo870526)

