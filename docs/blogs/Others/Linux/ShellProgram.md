---
title: Shell编程
date: 2021-06-23
categories:
- Linux
tags:
- Linux
- Shell
publish: true
---

## 1. Shell编程

### 1.1. 概述

Shell 是一个用 C 语言编写的程序，通过 Shell 用户可以访问操作系统内核服务。

Shell 既是一种命令语言，又是一种程序设计语言。

Shell script 是一种为 shell 编写的脚本程序。Shell 编程一般指 shell脚本编程，不是指开发 shell 自

身。

Shell 编程跟 java、php 编程一样，只要有一个能编写代码的文本编辑器和一个能解释执行的脚本解释

器就可以了。

Linux 的 **Shell** **解释器** 种类众多，一个系统可以存在多个 shell解释器，可以通过 cat /etc/shells 命令

查看系统中安装的 shell解释器。

Bash 由于易用和免费，在日常工作中被广泛使用。同时，Bash 也是大多数Linux 系统默认的 Shell。

可以以下方式查看Shell解释器:

```
[root@node01 ~]# cat /etc/shells 
/bin/sh 
/bin/bash 
/sbin/nologin 
/usr/bin/sh 
/usr/bin/bash 
/usr/sbin/nologin 
/bin/tcsh /bin/csh
```

### 1.2. HelloWorld

（1）创建/export/exec01.sh

```
#! /bin/bash 
echo 'HelloWorld' 
```

（2）赋予可执行权限

```
[root@node01 export]# chmod 777 exec01.sh 
[root@node01 export]# ls 
exec01.sh
```

 （3）执行脚本

```
[root@node01 export]# /bin/sh exec01.sh 
HelloWorld 
[root@node01 export]# /bin/bash exec01.sh 
HelloWorld 
[root@node01 export]# ./exec01.sh 
HelloWorld
```

执行方式一和二中 ，sh是bash的快捷方式

执行方式三可以执行，是因为在环境变量PATH中已经配置了/bin目录，所以可以直接到/bin目录下查找相关命令

### 1.3. 变量

#### 1.3.1. 变量规则

- 变量名称没有任何修饰符

- 变量名和等号之间，等号和初始化值之间不能有空格

- 变量名只能使用英文字母，数字和下划线，首个字符不能以数字开头

- 中间不能有空格，可以使用下划线（_）

- 不能使用标点符号

- 不能使用bash 里的关键字（可用help命令查看保留关键字）

- 赋值方式可以直接赋值，也可以把某命令执行结果赋值给变量

```shell
for file in `ls /export`
```

以上语句会把"/export"下的文件名称一一列出

语句中使用的"`"是反单引号

#### 1.3.2. 使用变量

**使用$引用已定义变量**

```shell
#！/bin/bash
myname="zhangsan"
echo $myname
echo ${myname}
```

```shell
[root@node01 export]# ./exec01.sh
zhangsan
zhangsan
```

使用${变量名}的方式来引用已定义变量，通常情况下{}可省；但如果使用{}是为了定义变量边界，则{}不可省

```shell
for skill in java php python; do
echo "I am good at ${skill}Script"
done
```

以上程序中{}不可省，其是为了指明引用skill变量，而不是skillScript

**重新定义变量**

```shell
#！/bin/bash
myname="zhangsan"
echo $myname
myname="lisi"
echo $myname
```

```shell
[root@node01 export]# ./exec01.sh
zhangsan
lisi
```

重新定义变量时不要加$符号，只有使用变量时才加$符号

#### 1.3.3. 删除变量

使用 unset 命令可以删除变量

```shell
#！/bin/bash
myname="zhangsan"
echo $myname
unset myname
echo $myname
```

```shell
[root@node01 export]# ./exec01.sh
zhangsan
//第二次没有输出，变量myname已被删除
```

#### 1.3.4. 常量

变量一旦被赋值，就不可再改变其值

使用readonly修饰，可以变量改变为常量

```shell
#！/bin/bash
myname="zhangsan"
readonly myname
myname="lisi"
```

```shell
[root@node01 export]# ./exec01.sh
./exec01.sh:行4: myname: 只读变量
```

### 1.4. 字符串

#### 1.4.1. 字符串的定义和使用

字符串是shell编程中最常用数据类型，定义字符串可以使用单引号、双引号、也可以不使用引号

**使用单引号**

单引号里的任何字符都会原样输出，单引号字符串中的变量是无效的

单引号字串中不能出现单独一个的单引号（对单引号使用转义符后也不行），但可成对出现，作为字符串拼接使用

```shell
#！/bin/bash
myname='zhangsan'
echo '$myname'
```

```shell
[root@node01 export]# ./exec01.sh
$myname
```

**使用双引号**

双引号里可以引用变量

双引号里可以出现转义字符

```shell
#！/bin/bash
myname='zhangsan'
echo "$myname"
```

```shell
[root@node01 export]# ./exec01.sh
zhangsan
```

#### 1.4.2. 字符串常见功能

获取字符串长度

```shell
#！/bin/bash
myname='zhangsan'
echo "$myname"
echo "${#myname}" # 获取字符串长度
```

```shell
[root@node01 export]# ./exec01.sh
zhangsan
8
```

**截取字符串子串**

从第2个字符开始截取，截取到字符串末尾

```shell
#！/bin/bash
myname='zhangsan'
str=" my name is ${myname}"
echo "${str:2}"
```

```shell
[root@node01 export]# ./exec01.sh
my name is zhangsan
```

从第2个字符开始截取，截取2个字符

```shell
#！/bin/bash
myname='zhangsan'
str=" my name is ${myname}"
echo "${str:2:2}"
```

```shell
[root@node01 export]# ./exec01.sh
my
```

**查找子串**

查找字符串中is的位置

```shell
#！/bin/bash
myname='zhangsan'
str="my name is ${myname}"
echo `expr index "${str}" is`
```

```shell
[root@node01 export]# ./exec01.sh
9
```

### 1.5. 传递参数

我们在执行shell脚本时，可以向shell脚本中传递参数，在shell脚本中使用这些传入的参数

使用方式：

./exec01.sh 参数01 参数02 ......

脚本内获取参数的格式为：$n

n 代表一个数字，1 为执行脚本的第一个参数，2 为执行脚本的第二个参数，以此类推……

```shell
#！/bin/bash
echo "shell脚本接收参数测试:"
echo "执行的文件名: $0"
echo "接收的第一个参数: $1"
echo "接收的第二个参数: $2"
```

```shell
[root@ode01 export]# ./exec01.sh a b
shell脚本接收参数测试:
执行的文件名: ./exec01.sh
接收的第一个参数: a
接收的第二个参数: b
```

使用特殊字符来处理参数接收：



| 参数 | 说明                                                         |
| :--: | :----------------------------------------------------------- |
|  $#  | 传递到脚本的参数个数                                         |
|  $*  | 以一个单字符串显示所有向脚本传递的参数。 如"$*"用「"」括起来的情况、以"$1 $2…$n"的形式输出所有参数 |
|  $$  | 脚本运行的当前进程ID号                                       |
|  $!  | 后台运行的最后一个进程的ID号                                 |
|  $@  | 与$*相同，但是使用时加引号，并在引号中返回每个参数。 如"$@"用「"」括起来的情况、以"$1" "$2" … "$n" 的形式输出所有参数 |
|  $-  | 显示Shell使用的当前选项，与set命令功能相同                   |
|  $?  | 显示最后命令的退出状态。0表示没有错误，其他任何值表明有错误  |

```shell
#！/bin/bash
echo "shell脚本接收参数测试:"
echo "接收的第一个参数: $1"
echo "接收的参数个数: $#"
echo "接收的参数列表: $*"
```

```shell
[root@node01 export]# ./exec01.sh a b
shell脚本接收参数测试:
接收的第一个参数: a
接收的参数个数: 2
接收的参数列表: a b
```

其中$*和$@的区别：

$*会把接收到的参数"a b"作为一个参数使用，而$@会把接收到的参数"a" "b"作为两个参数接收

```shell
#！/bin/bash
echo '$*和$@区别演示:'
echo '$*演示:'
for i in "$*";do
	echo $i
done

echo '$@演示:'
for i in "$@";do
	echo $i
done
```

```shell
[root@node01 export]# ./exec01.sh a b
$*和$@区别演示:
$*演示:
a b
$@演示:
a
b
```

### 1.6.算术运算符

Shell 和其他编程一样，支持包括：算术、关系、布尔、字符串等运算符。

原生 bash 不支持简单的数学运算，但是可以通过其他命令来实现，例如expr。

expr 是一款表达式计算工具，使用它能完成表达式的求值操作。

使用expr表达式时要注意：

操作数和运算符之间要有空格 ，例如2 + 2 ，而不能写成2+2

完整的表达式要被 ` 包含，注意不是单引号，在 Esc 键下边

```shell
#！/bin/bash
val=`expr 2 + 2`
echo "$val"
```

```shell
[root@node01 export]# ./exec01.sh
4
```

常用算术运算符说明：

| 运算符 | 说明                                          | 举例                         |
| ------ | --------------------------------------------- | ---------------------------- |
| +      | 加法                                          | expr $a + $b 结果为 30。     |
| -      | 减法                                          | expr $a - $b 结果为 -10。    |
| *      | 乘法                                          | expr $a \* $b 结果为 200。   |
| /      | 除法                                          | expr $b / $a 结果为 2。      |
| %      | 取余                                          | expr $b % $a 结果为 0。      |
| =      | 赋值                                          | a=$b 将把变量 b 的值赋给 a。 |
| ==     | 相等。用于比较两个数字，相同则返回 true。     | [ $a == $b ] 返回 false。    |
| !=     | 不相等。用于比较两个数字，不相同则返回 true。 | [ $a != $b ] 返回 true。     |

**注意**：条件表达式要放在方括号之间，并且操作数和运算符之间要有空格，例如: **[$a==$b]** 是错误的，必须写成 **[ $a == $b ]**。

```shell
#！/bin/bash
a=20
b=10
echo `expr $a + $b`
echo `expr $a - $b`
echo `expr $a \* $b`
echo `expr $a / $b`
```

```shell
[root@node01 export]# ./exec01.sh
30
10
200
2
```

### 1.7. 程序流程

#### 1.7.1. 条件分支结构

##### 1.7.1.1. if条件分支

常用的判定条件运算符：

只支持数字，不支持字符串，除非字符串的值是数字

| 运算符 | 说明                                                |
| ------ | --------------------------------------------------- |
| -eq    | 检测两个数是否相等，相等返回 true                   |
| -ne    | 检测两个数是否不相等，不相等返回 true               |
| -gt    | 检测左边的数是否大于右边的，如果是，则返回 true     |
| -lt    | 检测左边的数是否小于右边的，如果是，则返回 true     |
| -ge    | 检测左边的数是否大于等于右边的，如果是，则返回 true |
| -le    | 检测左边的数是否小于等于右边的，如果是，则返回 true |

```shell
#！/bin/bash
a=20
b=10
#单if模式
if [ $a -gt $b ]; then
	echo "a大于b"
fi
#ifelse模式

scorea=65
if [ $scorea -gt 60 ]; then
	echo "成绩合格"
else
	echo "成绩不合格"
fi

#ifelse多分支
scoreb=95
if [ $scoreb -gt 90 ]; then
	echo "成绩优秀"
elif [ $scoreb -gt 80]; then
	echo "成绩中上"
elif [ $scoreb -gt 70 ]; then
	echo "成绩中等"
elif [ $scoreb -gt 60 ]; then
	echo "成绩及格"
else
	echo "成绩不及格"
fi
```

运行结果如下:

```shell
[root@node01 export]# ./exec01.sh
a大于b
成绩合格
成绩优秀
```

##### 1.7.1.2. case条件分支

用case语句匹配一个值与一个模式，如果匹配成功，执行相匹配的命令

执行流程说明：

取值后面必须为单词in，每一模式必须以右括号结束。取值可以为变量或常数。匹配发现取值符合某一模式后，其间所有命令开始执行直至 ;;。

取值将检测匹配的每一个模式。一旦模式匹配，则执行完匹配模式相应命令后不再继续其他模式。如果无一匹配模式，使用星号 * 捕获该值，再执行后面的命令。

```shell
#！/bin/bash
a=20
case $a in
    10) echo "a是10"
    ;;
    20) echo "a是20"
    ;;
    *) echo "a什么都不是"
    ;;
esac
```

```shell
[root@node01 export]# ./exec02.sh
a是20
```

#### 1.7.2. 循环结构

##### 1.7.2.1. for循环

使用循环遍历1-5

```shell
#！/bin/bash
for i in 1 2 3 4 5; do
	echo $i
done

for i in {1..5}; do
	echo $i
done
```

使用循环遍历1-5中的奇数

```shell
#！/bin/bash
for i in {1..5..2}; do
	echo $i
done
```

使用遍历访问"/export"目录下的内容

```shell
#！/bin/bash
for i in `ls /export`; do
	echo $i
done
```

##### 1.7.2.2. while循环

输出1-10的和值

```shell
#！/bin/bash
sum=0
i=1
while [ $i -le 10 ]; do
    sum=$[sum + i]
    i=$[i + 1]
done

echo $sum
```

##### 1.7.2.3. 无限循环

每隔1秒，输出当前系统时间

```shell
#！/bin/bash
while true; do
    date
    sleep 1
done
```

##### 1.7.2.4. break和continue

break

直接提出所有循环

使用无限循环输出系统时间，每隔一秒输出一次，使用break控制只输出10次

```shell
#！/bin/bash
i=1
while true; do
    if [ $i -gt 10 ];then
 	   break
    fi
    echo $i
    date
    sleep 1
    i=$[i + 1]
done
```

**continue**

仅跳出当前次循环

遍历输出1-20，跳过3的倍数

```shell
#！/bin/bash
for i in {1..20};do
    if test $[ i % 3 ] -eq 0; then
    	continue
    fi
    echo $i
done
```

### 1.8. 函数

#### 1.8.1. 入门例子

```shell
#！/bin/bash
print (){
	echo "this is my first function"
}
echo "调用函数print开始"
print
echo "调用函数print结束"
```

```shell
[root@node01 export]# ./exec08.sh
调用函数print开始
this is my first function
调用函数print结束
```

#### 1.8.2. 函数传参

调用函数时可以向其传递参数；在函数体内部，通过 $n 的形式来获取参数的值，例如，$1表示第一个参数，$2表示第二个参数...

注意:$10 不能获取第十个参数，获取第十个参数需要${10}。当n>=10时，需要使用${n}来获取参数。

```shell
#！/bin/bash
print (){
    echo "第一个参数是: $1"
    echo "第二个参数是: $2"
    echo "第三个参数是: $3"
    echo "第四个参数是: $4"
    echo "第五个参数是: $5"
    echo "第十个参数是: $10"
    echo "第十个参数是: ${10}"
}
print 1 2 3 4 5 6 7 8 9 100
```

```shell
[root@node01 export]# ./exec09.sh
第一个参数是: 1
第二个参数是: 2
第三个参数是: 3
第四个参数是: 4
第五个参数是: 5
第十个参数是: 10
第十个参数是: 100
```

#### 1.8.3. 函数返回值

```shell
add (){
	return $[ $1 + $2 ]
}
add 1 2
echo $?
```

#### 1.8.4. 特殊参数说明

特殊参数处理说明:

| 参数处理 | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| $#       | 传递到函数的参数个数                                         |
| $*       | 以一个单字符串显示所有向脚本传递的参数                       |
| $$       | 脚本运行的当前进程ID号                                       |
| $!       | 后台运行的最后一个进程的ID号                                 |
| $@       | 与$*相同，但是使用时加引号，并在引号中返回每个参数。         |
| $-       | 显示Shell使用的当前选项，与set命令功能相同。                 |
| $?       | 显示最后命令的退出状态。0表示没有错误，其他任何值表明有错误。 |

### 1.9. 数组

#### 1.9.1. 特点

- bash中的数组只支持一维数组
- 初始化时不需要定义数组大小
- 数组元素的下标由0开始
- 用括号来表示，元素用"空格"符号分割开

#### 1.9.2. 读取数组

**使用下标读取数组中某一个元素**

```shell
#！/bin/bash
arr01=(1 3 "a" "bcd")
echo "数组第一个元素${arr01[0]}"
echo "数组第二个元素${arr01[1]}"
```

```shell
[root@node01 export]# ./exec10.sh
数组第一个元素1
数组第二个元素3
```

**读取数组全部元素**

```shell
#！/bin/bash
arr01=(1 3 "a" "bcd")
echo "${arr01[*]}"
echo "${arr01[@]}"
```

```shell
[root@node01 export]# ./exec10.sh
1 3 a bcd
1 3 a bcd
```

**读取数组长度**

```shell
#！/bin/bash
arr01=(1 3 "a" "bcd")
echo "${#arr01[*]}"
```

```shell
[root@node01 export]# ./exec10.sh
4
```

#### 1.9.3. 修改数组

修改数组第一个元素值为2

```shell
#！/bin/bash
arr01=(1 3 "a" "bcd")
arr01[0]=2
echo "${arr01[*]}"
```

```shell
[root@node01 export]# ./exec10.sh
2 3 a bcd
```

#### 1.9.4. 遍历数组

```shell
#！/bin/bash
arr01=(1 3 "a" "bcd")
for i in ${arr01[*]}; do
	echo $i
done
```

```shell
[root@node01 export]# ./exec10.sh
1
3
a
bcd
```

### 1.10. 引用其它文件变量

在某shell脚本中是可以使用其它脚本中变量，需要先引入其它脚本

**引入其它脚本方式**

. 其它脚本名称 或者 source 其它脚本名称

脚本exec11.sh：

```shell
#！/bin/bash
arr01=(1 2 3 "a" "bcd")
```

脚本exec12.sh:

```shell
#！/bin/bash
source ./exec11.sh
for i in ${arr01[*]}; do
	echo $i
done
```

```shell
[root@node01 export]# ./exec12.sh
1
2
3
a
bcd
```

