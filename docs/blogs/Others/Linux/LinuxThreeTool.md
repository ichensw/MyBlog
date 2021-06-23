---
title: Linux三剑客Grep/Awk/Sed
date: 2021-06-21
categories:
- Linux
tags:
- Linux
publish: true
---

## Linux三剑客grep、awk、sed

  #1.grep 更适合单纯的查找或匹配文本

  \#2. sed 更适合编辑文本

  \#3. awk 更适合格式化文本，对文本进行较复杂格式处理

### 一、 grep

**1.作用**

Linux系统中grep命令是一种强大的文本搜索工具，它能使用正则表达式搜索文本，并把匹 配的行打印出来。grep全称是Global Regular Expression Print，表示全局正则表达式版本，它的使用权限是所有用户。

grep家族包括grep、egrep和fgrep。egrep和fgrep的命令只跟grep有很小不同。egrep是grep的扩展，支持更多的re元字符， fgrep就是fixed grep或fast grep，它们把所有的字母都看作单词，也就是说，正则表达式中的元字符表示回其自身的字面意义，不再特殊。linux使用GNU版本的grep。它功能更强，可以通过-G、-E、-F命令行选项来使用egrep和fgrep的功能。

**2.格式**

```
grep [options]
```

**3.主要参数**

```
grep --help

[options]主要参数：
-c：只输出匹配行的计数。
-i：不区分大小写。
-h：查询多文件时不显示文件名。
-l：查询多文件时只输出包含匹配字符的文件名。
-n：显示匹配行及 行号。
-s：不显示不存在或无匹配文本的错误信息。
-v：显示不包含匹配文本的所有行。
--color=auto ：可以将找到的关键词部分加上颜色的显示。
```

pattern正则表达式主要参数：

```
\： 忽略正则表达式中特殊字符的原有含义。
^：匹配正则表达式的开始行。
$: 匹配正则表达式的结束行。
\<：从匹配正则表达 式的行开始。
\>：到匹配正则表达式的行结束。
[ ]：单个字符，如[A]即A符合要求 。
[ - ]：范围，如[A-Z]，即A、B、C一直到Z都符合要求 。
.：所有的单个字符。
*：有字符，长度可以为0。
```

4.grep命令使用简单实例

```
$ grep ‘test’ d*
显示所有以d开头的文件中包含 test的行。

$ grep ‘test’ aa bb cc
显示在aa，bb，cc文件中匹配test的行。

$ grep ‘[a-z]\{5\}’ aa
显示所有包含每个字符串至少有5个连续小写字符的字符串的行。

$ grep ‘w\(es\)t.*\1′ aa
如果west被匹配，则es就被存储到内存中，并标记为1，然后搜索任意个字符(.*)，这些字符后面紧跟着 另外一个es(\1)，找到就显示该行。如果用egrep或grep -E，就不用”\”号进行转义，直接写成’w(es)t.*\1′就可以了。
```

5.grep命令使用复杂实例

明确要求搜索子目录：

```
grep -r
```

或忽略子目录：

```
grep -d skip
```

如果有很多输出时，您可以通过管道将其转到’less’上阅读：

```
$ grep magic /usr/src/Linux/Documentation/* | less
```

这样，您就可以更方便地阅读。

有一点要注意，您必需提供一个文件过滤方式(搜索全部文件的话用 *)。如果您忘了，’grep’会一直等着，直到该程序被中断。如果您遇到了这样的情况，按 ，然后再试。

下面还有一些有意思的命令行参数：

```
grep -i pattern files ：不区分大小写地搜索。默认情况区分大小写，

grep -l pattern files ：只列出匹配的文件名，

grep -L pattern files ：列出不匹配的文件名，

grep -w pattern files ：只匹配整个单词，而不是字符串的一部分(如匹配’magic’，而不是’magical’)，

grep -C number pattern files ：匹配的上下文分别显示[number]行，

grep pattern1 | pattern2 files ：显示匹配 pattern1 或 pattern2 的行，
例如：grep "abc\|xyz" testfile    表示过滤包含abc或xyz的行

grep pattern1 files | grep pattern2 ：显示既匹配 pattern1 又匹配 pattern2 的行。

grep -n pattern files  即可显示行号信息

grep -c pattern files  即可查找总行数
```

这里还有些用于搜索的特殊符号：

```
\< 和 \> 分别标注单词的开始与结尾。
例如：
grep man * 会匹配 ‘Batman’、’manic’、’man’等，
grep ‘\<man’ * 匹配’manic’和’man’，但不是’Batman’，
grep ‘\<man\>’ 只匹配’man’，而不是’Batman’或’manic’等其他的字符串。
‘^’：指匹配的字符串在行首，
‘$’：指匹配的字符串在行尾，
```

### 二、 sed

Linux sed 命令是利用脚本来处理文本文件。

sed 可依照脚本的指令来处理、编辑文本文件。

Sed 主要用来自动编辑一个或多个文件、简化对文件的反复操作、编写转换程序等。

**参数说明：**

```
-e<script>或--expression=<script> 以选项中指定的script来处理输入的文本文件。
-f<script文件>或--file=<script文件> 以选项中指定的script文件来处理输入的文本文件。
-h或--help 显示帮助。
-n或--quiet或--silent 仅显示script处理后的结果。
-V或--version 显示版本信息。
```

**动作说明：**

```
a ：新增， a 的后面可以接字串，而这些字串会在新的一行出现(目前的下一行)～
c ：取代， c 的后面可以接字串，这些字串可以取代 n1,n2 之间的行！
d ：删除，因为是删除啊，所以 d 后面通常不接任何咚咚；
i ：插入， i 的后面可以接字串，而这些字串会在新的一行出现(目前的上一行)；
p ：打印，亦即将某个选择的数据印出。通常 p 会与参数 sed -n 一起运行～
s ：取代，可以直接进行取代的工作哩！通常这个 s 的动作可以搭配正规表示法！例如 1,20s/old/new/g 就是啦！
```

**实例**

**注意：sed -e是修改输出终端，sed -i才是在源文件修改！！！**

**实操案例：**

**#1.sed -e 与sed -i**

在testfile文件的第四行后添加一行，并将结果输出到标准输出，在命令行提示符下输入如下命令：

```
sed -e 4a\newLine testfile 
```

首先查看testfile中的内容如下： cat testfile #查看testfile 中的内容

自己vim testfile文件将下列内容输入做测试用。 

```
HELLO LINUX!  Linux is a free unix-type opterating system.  
This is a linux testfile! 
Linux test 
Are you ok

You is pig
```

使用sed命令后，输出结果如下：

```
nl /etc/passwd | sed '2i drink tea' 
```

将第2-5行的内容取代成为No 2-5 number:

```
nl /etc/passwd | sed '2,5c No 2-5 number' 
```

**#2. sed -s  替换**

```
把is 换成are：
sed 's/is/are/g' testfile
```

**#3.sed -d  删除**

```
$删除头三行:
sed '1,3d' testfile
$删除包含pig的行:
sed '\%pig%d' testfile
$删除所有空白行
sed '/^$/d' testfile
```

**#sed -n**

```
显示5-10行:
sed -n '5,10p'  testfile
```

### 三、 awk

​	**这里我们介绍一下****awk****实用用法****，****更加详细参考下面链接文档**

https://www.cnblogs.com/ginvip/p/6352157.html

​	AWK是一种处理文本文件的语言，是一个强大的文本分析工具。

之所以叫AWK是因为其取了三位创始人 Alfred Aho，Peter Weinberger, 和 Brian Kernighan 的 Family Name 的首字符。

语法

**选项参数说明：**

```
-F fs or --field-separator fs
指定输入文件折分隔符，fs是一个字符串或者是一个正则表达式，如-F:。

-v var=value or --asign var=value
赋值一个用户定义变量。

-f scripfile or --file scriptfile
从脚本文件中读取awk命令。

-mf nnn and -mr nnn
对nnn值设置内在限制，-mf选项限制分配给nnn的最大块数目；-mr选项限制记录的最大数目。这两个功能是Bell实验室版awk的扩展功能，在标准awk中不适用。

-W compact or --compat, -W traditional or --traditional
在兼容模式下运行awk。所以gawk的行为和标准的awk完全一样，所有的awk扩展都被忽略。

-W copyleft or --copyleft, -W copyright or --copyright
打印简短的版权信息。

-W help or --help, -W usage or --usage
打印全部awk选项和每个选项的简短说明。

-W lint or --lint
打印不能向传统unix平台移植的结构的警告。

-W lint-old or --lint-old
打印关于不能向传统unix平台移植的结构的警告。

-W posix
打开兼容模式。但有以下限制，不识别：/x、函数关键字、func、换码序列以及当fs是一个空格时，将新行作为一个域分隔符；操作符**和**=不能代替^和^=；fflush无效。

-W re-interval or --re-inerval
允许间隔正则表达式的使用，参考(grep中的Posix字符类)，如括号表达式[[:alpha:]]。

-W source program-text or --source program-text
使用program-text作为源代码，可与-f命令混用。

-W version or --version
打印bug报告信息的版本。
```

**基本用法**

log.txt文本内容如下：

自己vim log.txt,将下面文件输入做测试。

```
2 this is a test3 Are you like awkThis's a test
10 There are orange,apple,mongo
```

**用法一：**

```
awk '{[pattern] action}' {filenames}   # 行匹配语句 awk '' 只能用单引号
```

实例：

```
# 每行按空格或TAB分割，输出文本中的1、4项
 $ awk '{print $1,$4}' log.txt
#从文件中找出长度大于8的行
awk 'length>8' log.txt
```

**用法二：**

```
awk -F  #-F相当于内置变量FS, 指定分割字符
```

实例：

```
# 使用","分割
 $  awk -F, '{print $1,$2}'   log.txt
# 使用多个分隔符.先使用空格分割，然后对分割结果再使用","分割
 $ awk -F '[ ,]'  '{print $1,$2,$5}'   log.txt
```

**用法三：**

```
awk -v  # 设置变量
```

实例：

```
#设置变量a,并赋值=1，打印第一列和第一列加变量a的值 
$ awk -va=1 '{print $1,$1+a}' log.txt
#设置两个变量a=1和b=2，并赋值打印第一列，第一列+a,第一列+b的值：
$ awk -va=1 -vb=2 '{print $1,$1+a,$1b}' log.txt
```

**用法四：**

```
awk -f {awk脚本} {文件名}
```

实例：

```
 $ awk -f cal.awk log.txt
```

**运算符**

| **运算符**              | **描述**                         |
| ----------------------- | -------------------------------- |
| = += -= *= /= %= ^= **= | 赋值                             |
| ?:                      | C条件表达式                      |
| \|\|                    | 逻辑或                           |
| &&                      | 逻辑与                           |
| ~ 和 !~                 | 匹配正则表达式和不匹配正则表达式 |
| < <= > >= != ==         | 关系运算符                       |
| 空格                    | 连接                             |
| + -                     | 加，减                           |
| * / %                   | 乘，除与求余                     |
| + - !                   | 一元加，减和逻辑非               |
| ^ **                    | 求幂                             |
| ++ --                   | 增加或减少，作为前缀或后缀       |
| $                       | 字段引用                         |
| in                      | 数组成员                         |

```
#过滤第一列大于2的行
$ awk '$1>2' log.txt    
#过滤第一列等于2的行
$ awk '$1==2 {print $1,$3}' log.txt  
```

内建变量

| **变量**    | **描述**                                                   |
| ----------- | ---------------------------------------------------------- |
| $n          | 当前记录的第n个字段，字段间由FS分隔                        |
| $0          | 完整的输入记录                                             |
| ARGC        | 命令行参数的数目                                           |
| ARGIND      | 命令行中当前文件的位置(从0开始算)                          |
| ARGV        | 包含命令行参数的数组                                       |
| CONVFMT     | 数字转换格式(默认值为%.6g)ENVIRON环境变量关联数组          |
| ERRNO       | 最后一个系统错误的描述                                     |
| FIELDWIDTHS | 字段宽度列表(用空格键分隔)                                 |
| FILENAME    | 当前文件名                                                 |
| FNR         | 各文件分别计数的行号                                       |
| FS          | 字段分隔符(默认是任何空格)                                 |
| IGNORECASE  | 如果为真，则进行忽略大小写的匹配                           |
| NF          | 一条记录的字段的数目                                       |
| NR          | 已经读出的记录数，就是行号，从1开始                        |
| OFMT        | 数字的输出格式(默认值是%.6g)                               |
| OFS         | 输出记录分隔符（输出换行符），输出时用指定的符号代替换行符 |
| ORS         | 输出记录分隔符(默认值是一个换行符)                         |
| RLENGTH     | 由match函数所匹配的字符串的长度                            |
| RS          | 记录分隔符(默认是一个换行符)                               |
| RSTART      | 由match函数所匹配的字符串的第一个位置                      |
| SUBSEP      | 数组下标分隔符(默认值是/034)                               |

```
$ awk 'BEGIN{printf "%4s %4s %4s %4s %4s %4s %4s %4s %4s\n","FILENAME","ARGC","FNR","FS","NF","NR","OFS","ORS","RS";printf "---------------------------------------------\n"} {printf "%4s %4s %4s %4s %4s %4s %4s %4s %4s\n",FILENAME,ARGC,FNR,FS,NF,NR,OFS,ORS,RS}'  log.txt
FILENAME ARGC  FNR   FS   NF   NR  OFS  ORS   RS---------------------------------------------
log.txt    2    1         5    1
log.txt    2    2         5    2
log.txt    2    3         3    3
log.txt    2    4         4    4
$ awk -F\' 'BEGIN{printf "%4s %4s %4s %4s %4s %4s %4s %4s %4s\n","FILENAME","ARGC","FNR","FS","NF","NR","OFS","ORS","RS";printf "---------------------------------------------\n"} {printf "%4s %4s %4s %4s %4s %4s %4s %4s %4s\n",FILENAME,ARGC,FNR,FS,NF,NR,OFS,ORS,RS}'  log.txt
FILENAME ARGC  FNR   FS   NF   NR  OFS  ORS   RS---------------------------------------------
log.txt    2    1    '    1    1
log.txt    2    2    '    1    2
log.txt    2    3    '    2    3
log.txt    2    4    '    1    4# 输出顺序号 NR, 匹配文本行号
```

**使用正则，字符串匹配:**

```
# 输出第二列包含 "th"，并打印第二列与第四列
$ awk '$2 ~ /th/ {print $2,$4}' log.txt
```

