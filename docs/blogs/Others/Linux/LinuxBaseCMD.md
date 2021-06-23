---
title: Linux常用基本命令
date: 2021-06-20
categories:
- Linux
tags:
- Linux
publish: true
---
## 一、Linux常用基本命令

### 	1.1 基础快捷键

```
ctrl + c            停止进程

ctrl+l             清屏；彻底清屏是：reset

ctrl + q            退出

善于用tab键补全       提示(更重要的是可以防止敲错)

上下键            查找执行过的命令

ctrl +alt            linux和Windows之间切换
```



### 	1.2 文件命令

```
#pwd   显示当前工作目录的绝对路径
#ls,ll,ll -a 
#cd    进入到某一个目录下
#mkdir   创建文件夹
#rmdir    删除文件夹
#touch    创建文件
#cp     复制文件/文件夹
#cp -r    递归复制，多级目录
#mv     移动文件夹/重命名
#rm     删除文件
#rm -rf    强制删除文件不需要确认
#cat     查看文件
#more    查看文件
#less     查看文件
#echo     输出
#head     查看文件头部
#tail      查看文件末尾
#tail -f     实时查看文件末尾
#nl      文件带行号标准输出
# >      覆盖 
# >>      追加
#ln -s 目标目录 软链接地址     创建软链接
rm -rf 软链接地址         删除软连接
ln -snf  新目标目录 软链接地址    修改软连接
# history    查看已经执行过历史命令
```



### 	1.3 文本处理类命令

**wc**

```
wc [option] [file]...

  -l: 统计行数

  -c: 统计字节数

  -w；统计单词数
```



**tr**

```
tr: 转换字符或删除字符

  tr '集合1' '集合2'

  tr -d '字符集合'
```



**cut**

```
This is a test line.

-d字符：指定分隔符

-f#: 指定要显示字段

  单个数字：一个字段

  逗号分隔的多个数字：指定多个离散字段

-：连续字段，如3-5；

例子：

准备一个测试文件，内容如下：

\> cat test.txt

Hello World! I am maqian!

I am now in guangzhou!

Today is so hot, but i still have a fever!

这里是一行中文。

cut -c

\# 显示第1个和第2个字符

cut test.txt -c "1,2"  

-d和-f选项

\# 以空格分开每一行并输出第1个和第3个字段

cut test.txt -f "1,3" -d " " 
```

 

**sort**

```
按字符进行比较

sort [option] file...

  -f: 忽略字符大小写；

  -n: 比较数值大小；

  -t: 指定分隔符

  -k: 指定分隔后进行比较字段

-u: 重复的行，只显示一次；

准备数据：

\>cat sort.txt

Apple

Cut

Blue

Cut

Apple

排序：sort sort.txt

去重：sort  -u sort.txt 
```

 

**uniq**

```
移除重复的行

-c：显示每行重复的次数

-d：仅显示重复过的行

-u: 仅显示不曾重复的行
```

### 	

### 	1.4 系统信息命令

```
#date        查看当前系统时间

#data -s       修改时间

#w         显示登陆用户

#uname -a      查看系统内核

#cat /proc/cpuinfo   查看cpu信息

#cat /proc/meminfo  查看内存信息
```



### 	

### 	1.5 压缩/解压命令

```
#tar -xvf file.tar    解压.tar结尾的

#tar -zxvf file.tar.gz  解压.tar.gz文件

#tar -cf file.tar file   创建包含files的文件file.tar

#gzip -d file.gz     将file.gz解压缩为file
```

​	

### 	1.6 网络命令

```
#ping host(主机名)   网络是否连通

#ifconfig       查看本机ip等信息

#telnet ip 端口    查看端口是否占用

(没有这个命令执行 yum -y install telnet )

#wget file       下载文件   

#tcpdump tcp port 端口  抓包tcp

#hostname       查看主机名
```



### 	1.7 权限命令（重点）

#### 1.文件或目录权限包括：

![img](https://gitee.com/ichensw/drawing-bed/raw/master/image/108.png) 

#### 2.文件权限命令：

```
#chmod  777  file  为所有用户添加读，写，执行权限

#chmod  755  file  为所有者添加rwx权限，为组和其他用户添加rx权限
```



#### 3.文件所属用户和用户组权限命令：

```
#chown hadoop:hadoop  file  将file的用户和用户组都改为hadoop
```



### 	1.8 用户管理命令

```
useradd 用户名	      添加新用户
useradd -g 组名 用户名	 给某个组创建用户
passwd 用户名	      设置用户密码
cat  /etc/passwd       查看创建了那些用户
Su  用户名         切换用户
userdel  用户名		    删除用户但保存用户主目录
userdel -r 用户名		   用户和用户主目录，都删除
whoami			      显示自身用户名称
who am i		   		 显示登录用户的用户名
usermod -g         更改用户组 用户名  
```

 

设置普通用户具有root权限，可以使用sudo

#### 1．添加hadoop用户，并对其设置密码。

```
[root@hadoop101 ~]#useradd hadoop
[root@hadoop101 ~]#passwd hadoop
```



#### 2．修改配置文件

```
[root@hadoop101 ~]#vi /etc/sudoers
```

修改 /etc/sudoers 文件，找到下面一行(91行)，在root下面添加一行，如下所示：

```
## Allow root to run any commands anywhere

root   ALL=(ALL)   ALL

hadoopALL=(ALL)   ALL
```

或者配置成采用sudo命令时，不需要输入密码

```
## Allow root to run any commands anywhere

root    ALL=(ALL)   ALL

hadoopALL=(ALL)   NOPASSWD:ALL
```

修改完毕，现在可以用hadoop帐号登录，然后用命令 sudo ，即可获得root权限进行操作。

 

### 	1.9 用户组管理命令

```
groupadd 组名         添加组
groupdel 组名          删除组
groupmod -n 新组名 老组名   指定工作组的新组名
cat  /etc/group         查看创建了哪些组
```

​	

### 1.10 搜索查找命令

1. #### find 查找文件或者目录

   常用：find / -name file      查找 /目录下file文件

2. #### grep 过滤查找及“|”管道符（详细使用见下一章中的grep）

   ```
   1.管道符，“|”，表示将前一个命令的处理结果输出传递给后面的命令处理
   
   2.grep常常跟在|的后面做过滤查找
   
   3.反转   grep -v
   
   4.示例
   
   #查找某文件在第几行   ls | grep -n test
   
   #查找某进程       ps -ef | grep PID
   
   #查看日志中含有errer   cat file |grep error
   ```

3. #### which 查找命令

   ```
   查找命令在那个目录下
   
   1．基本语法
   
   which 命令
   
   2．案例实操
   
   which ll
   ```

4. #### find详解

   由于find具有强大的功能，所以它的选项也很多，其中大部分选项都值得我们花时间来了解一下。即使系统中含有网络文件系统( NFS)，find命令在该文件系统中同样有效，只要你具有相应的权限。

   在运行一个非常消耗资源的find命令时，很多人都倾向于把它放在后台执行，因为遍历一个大的文件系统可能会花费很长的时间(这里是指30G字节以上的文件系统)。

   

#### 一、find 命令格式

##### 1、find命令的一般形式为

```
find pathname -options [-print -exec -ok ...]
```

##### 2、find命令的参数

```
pathname: find命令所查找的目录路径。例如用.来表示当前目录，用/来表示系统根目录，递归查找。

-print： find命令将匹配的文件输出到标准输出。

-exec： find命令对匹配的文件执行该参数所给出的shell命令。相应命令的形式为'command' {  } \;，注意{  }和\；之间的空格。

-ok： 和-exec的作用相同，只不过以一种更为安全的模式来执行该参数所给出的shell命令，在执行每一个命令之前，都会给出提示，让用户来确定是否执行。
```

##### 3、find命令选项

```
-name  按照文件名查找文件。

-perm  按照文件权限来查找文件。

-prune  使用这一选项可以使find命令不在当前指定的目录中查找，如果同时使用-depth选项，那么-prune将被find命令忽略。

-user  按照文件属主来查找文件。

-group  按照文件所属的组来查找文件。

-mtime -n +n 按照文件的更改时间来查找文件，-n表示文件更改时间距现在n天以内，+n表示文件更改时间距现在n天以前。find命令还有-atime和-ctime 选项，但它们都和-m time选项。

-nogroup 查找无有效所属组的文件，即该文件所属的组在/etc/groups中不存在。

***\*-\****nouser 查找无有效属主的文件，即该文件的属主在/etc/passwd中不存在。

-newer file1 ! file2 查找更改时间比文件file1新但比文件file2旧的文件。

-type  查找某一类型的文件，诸如：

  b - 块设备文件。

  d - 目录。

  c - 字符设备文件。

  p - 管道文件。

  l - 符号链接文件。

  f - 普通文件。

-size n：[c] 查找文件长度为n块的文件，带有c时表示文件长度以字节计。

-depth  在查找文件时，首先查找当前目录中的文件，然后再在其子目录中查找。

-fstype  查找位于某一类型文件系统中的文件，这些文件系统类型通常可以在配置文件/etc/fstab中找到，该配置文件中包含了本系统中有关文件系统的信息。

-mount  在查找文件时不跨越文件系统mount点。

-follow  如果find命令遇到符号链接文件，就跟踪至链接所指向的文件。

另外,下面三个的区别:

-amin n  查找系统中最后N分钟访问的文件

-atime n  查找系统中最后n*24小时访问的文件

-cmin n  查找系统中最后N分钟被改变文件状态的文件

-ctime n  查找系统中最后n*24小时被改变文件状态的文件

-mmin n  查找系统中最后N分钟被改变文件数据的文件

-mtime n  查找系统中最后n*24小时被改变文件数据的文件
```



##### 4、使用exec或ok来执行shell命令

使用find时，只要把想要的操作写在一个文件里，就可以用exec来配合find查找，很方便 在有些操作系统中只允许-exec选项执行诸如ls或ls -l这样的命令。大多数用户使用这一选项是为了查找旧文件并删除它们。建议在真正执行rm命令删除文件之前，最好先用ls命令看一下，确认它们是所要删除的文件。

exec选项后面跟随着所要执行的命令或脚本，然后是一对儿{}，一个空格和一个\，最后是一个分号。为了使用exec选项，必须要同时使用print选项。如果验证一下find命令，会发现该命令只输出从当前路径起的相对路径及文件名。

例如：为了用ls -l命令列出所匹配到的文件，可以把ls -l命令放在find命令的-exec选项中

```
# find . -type f -exec ls -l {} \;
```

上面的例子中，find命令匹配到了当前目录下的所有普通文件，并在-exec选项中使用ls -l命令将它们列出。

在/logs目录中查找更改时间在5日以前的文件并删除它们：

```
$ find logs -type f -mtime +5 -exec rm {} \;
```

记住：在shell中用任何方式删除文件之前，应当先查看相应的文件，一定要小心！当使用诸如mv或rm命令时，可以使用-exec选项的安全模式。它将在对每个匹配到的文件进行操作之前提示你。

在下面的例子中， find命令在当前目录中查找所有文件名以.LOG结尾、更改时间在5日以上的文件，并删除它们，只不过在删除之前先给出提示。

```
$ find . -name "*.conf"  -mtime +5 -ok rm {  } \;

< rm ... ./conf/httpd.conf > ? n
```

按y键删除文件，按n键不删除。

任何形式的命令都可以在-exec选项中使用。

在下面的例子中我们使用grep命令。find命令首先匹配所有文件名为“ passwd*”的文件，例如passwd、passwd.old、passwd.bak，然后执行grep命令看看在这些文件中是否存在一个itcast用户。

```
# find /etc -name "passwd*" -exec grep "itcast" {  } \;

itcast:x:1000:1000::/home/itcast:/bin/bash
```

##### 选项详解

1. ###### 使用name选项

   文件名选项是find命令最常用的选项，要么单独使用该选项，要么和其他选项一起使用。

   可以使用某种文件名模式来匹配文件，记住要用引号将文件名模式引起来。

   不管当前路径是什么，如果想要在自己的根目录$HOME中查找文件名符合*.txt的文件，使用~作为 'pathname'参数，波浪号~代表了你的$HOME目录。

   ```
   $ find ~ -name "*.txt" -print
   ```

   想要在当前目录及子目录中查找所有的‘ *.txt’文件，可以用：

   ```
   $ find . -name "*.txt" -print
   ```

   想要的当前目录及子目录中查找文件名以一个大写字母开头的文件，可以用：

   ```
   $ find . -name "[A-Z]*" -print
   ```

   想要在/etc目录中查找文件名以host开头的文件，可以用：

   ```
   $ find /etc -name "host*" -print
   ```

   想要查找$HOME目录中的文件，可以用：

   ```
   $ find ~ -name "*" -print 或find . -print
   ```

   要想让系统高负荷运行，就从根目录开始查找所有的文件：

   ```
   $ find / -name "*" -print
   ```

   如果想在当前目录查找文件名以两个小写字母开头，跟着是两个数字，最后是.txt的文件，下面的命令就能够返回例如名为ax37.txt的文件：

   ```
   $find . -name "[a-z][a-z][0-9][0-9].txt" -print
   ```

   

2. ###### 用perm选项

   按照文件权限模式用-perm选项,按文件权限模式来查找文件的话。最好使用八进制的权限表示法。

   如在当前目录下查找文件权限位为755的文件，即文件属主可以读、写、执行，其他用户可以读、执行的文件，可以用：

   ```
   $ find . -perm 755 -print
   ```

   还有一种表达方法：在八进制数字前面要加一个横杠-，表示都匹配，如-007就相当于777，-006相当于666

   ```
   # ls -l
   # find . -perm 006
   # find . -perm -006
   
   -perm mode:文件许可正好符合mode
   -perm +mode:文件许可部分符合mode
   -perm -mode: 文件许可完全符合mode
   ```

    

3. ###### 忽略某个目录

   如果在查找文件时希望忽略某个目录，因为你知道那个目录中没有你所要查找的文件，那么可以使用-prune选项来指出需要忽略的目录。在使用-prune选项时要当心，因为如果你同时使用了-depth选项，那么-prune选项就会被find命令忽略。

   如果希望在/apps目录下查找文件，但不希望在/apps/bin目录下查找，可以用：

   ```
   $ find /apps -path "/apps/bin" -prune -o -print
   ```

4. ###### 使用find查找文件的时候怎么避开某个文件目录

   比如要在/home/itcast目录下查找不在dir1子目录之内的所有文件

   ```
   find /home/itcast -path "/home/itcast/dir1" -prune -o -print
   ```

   避开多个文件夹

   ```
   find /home \( -path /home/itcast/f1 -o -path /home/itcast/f2 \) -prune -o -print
   ```

   注意(前的\,注意(后的空格。

5. ###### 使用user和nouser选项

   按文件属主查找文件，如在$HOME目录中查找文件属主为itcast的文件，可以用：

   ```
   $ find ~ -user itcast -print
   ```

   在/etc目录下查找文件属主为uucp的文件：

   ```
   $ find /etc -user uucp -print
   ```

   为了查找属主帐户已经被删除的文件，可以使用-nouser选项。这样就能够找到那些属主在/etc/passwd文件中没有有效帐户的文件。在使用-nouser选项时，不必给出用户名； find命令能够为你完成相应的工作。

   例如，希望在/home目录下查找所有的这类文件，可以用：

   ```
   $ find /home -nouser -print
   ```

   

6. ###### 使用group和nogroup选项

   就像user和nouser选项一样，针对文件所属于的用户组， find命令也具有同样的选项，为了在/apps目录下查找属于itcast用户组的文件，可以用：

   ```
   $ find /apps -group itcast -print
   ```

   要查找没有有效所属用户组的所有文件，可以使用nogroup选项。下面的find命令从文件系统的根目录处查找这样的文件

   ```
   $ find / -nogroup -print
   ```

   

7. ###### 按照更改时间或访问时间等查找文件

   如果希望按照更改时间来查找文件，可以使用mtime,atime或ctime选项。如果系统突然没有可用空间了，很有可能某一个文件的长度在此期间增长迅速，这时就可以用mtime选项来查找这样的文件。

   用减号-来限定更改时间在距今n日以内的文件，而用加号+来限定更改时间在距今n日以前的文件。

   希望在系统根目录下查找更改时间在5日以内的文件，可以用：

   ```
   $ find / -mtime -5 -print
   ```

   为了在/var/adm目录下查找更改时间在3日以前的文件，可以用：

   ```
   $ find /var/adm -mtime +3 -print
   ```

   

8. ###### 查找比某个文件新或旧的文件

   如果希望查找更改时间比某个文件新但比另一个文件旧的所有文件，可以使用-newer选项。它的一般形式为：

   ```
   newest_file_name ! oldest_file_name
   
   其中，！是逻辑非符号。
   ```

9. ###### 使用type选项

   在/etc目录下查找所有的目录，可以用：

   ```
   $ find /etc -type d -print
   ```

   在当前目录下查找除目录以外的所有类型的文件，可以用：

   ```
   $ find . ! -type d -print
   ```

   在/etc目录下查找所有的符号链接文件，可以用

   ```
   $ find /etc -type l -print
   ```

   

10. ###### 使用size选项

    可以按照文件长度来查找文件，这里所指的文件长度既可以用块（block）来计量，也可以用字节来计量。以字节计量文件长度的表达形式为N c；以块计量文件长度只用数字表示即可。

    在按照文件长度查找文件时，一般使用这种以字节表示的文件长度，在查看文件系统的大小，因为这时使用块来计量更容易转换。 在当前目录下查找文件长度大于1 M字节的文件：

    ```
    $ find . -size +1000000c -print
    ```

    在/home/apache目录下查找文件长度恰好为100字节的文件：

    ```
    $ find /home/apache -size 100c -print
    ```

    在当前目录下查找长度超过10块的文件（一块等于512字节）：

    ```
    $ find . -size +10 -print
    ```

    

11. ###### 使用depth选项

    在使用find命令时，可能希望先匹配所有的文件，再在子目录中查找。使用depth选项就可以使find命令这样做。这样做的一个原因就是，当在使用find命令向磁带上备份文件系统时，希望首先备份所有的文件，其次再备份子目录中的文件。

    在下面的例子中， find命令从文件系统的根目录开始，查找一个名为CON.FILE的文件。

    它将首先匹配所有的文件然后再进入子目录中查找。

    ```
    $ find / -name "CON.FILE" -depth -print
    ```

    

12. ###### 使用mount选项

    在当前的文件系统中查找文件（不进入其他文件系统），可以使用find命令的mount选项。

    从当前目录开始查找位于本文件系统中文件名以XC结尾的文件：

    ```
    $ find . -name "*.XC" -mount -print
    ```

    练习：请找出你10天内所访问或修改过的.c和.cpp文件。

    

##### **find命令的例子；*

- 查找当前用户主目录下的所有文件：

  下面两种方法都可以使用

```
$ find $HOME -print
$ find ~ -print
```

- 让当前目录中文件属主具有读、写权限，并且文件所属组的用户和其他用户具有读权限的文件；

```
$ find . -type f -perm 644 -exec ls -l {  } \;
```

- 为了查找系统中所有文件长度为0的普通文件，并列出它们的完整路径；

```
$ find / -type f -size 0 -exec ls -l {  } \;
```

- 查找/var/logs目录中更改时间在7日以前的普通文件，并在删除之前询问它们；

```
$ find /var/logs -type f -mtime +7 -ok rm {  } \;
```

- 为了查找系统中所有属于root组的文件；

```
$find . -group root -exec ls -l {  } \;
```

- find命令将删除当目录中访问时间在7日以来、含有数字后缀的admin.log文件。

该命令只检查三位数字，所以相应文件的后缀不要超过999。先建几个admin.log*的文件 ，才能使用下面这个命令

```
$ find . -name "admin.log[0-9][0-9][0-9]" -atime -7  -ok rm {  } \;
```

- 为了查找当前文件系统中的所有目录并排序；

```
$ find . -type d | sort
```



#### 三、xargs

```
xargs - build and execute command lines from standard input
```

在使用find命令的-exec选项处理匹配到的文件时， find命令将所有匹配到的文件一起传递给exec执行。但有些系统对能够传递给exec的命令长度有限制，这样在find命令运行几分钟之后，就会出现 溢出错误。错误信息通常是“参数列太长”或“参数列溢出”。这就是xargs命令的用处所在，特别是与find命令一起使用。

find命令把匹配到的文件传递给xargs命令，而xargs命令每次只获取一部分文件而不是全部，不像-exec选项那样。这样它可以先处理最先获取的一部分文件，然后是下一批，并如此继续下去。

在有些系统中，使用-exec选项会为处理每一个匹配到的文件而发起一个相应的进程，并非将匹配到的文件全部作为参数一次执行；这样在有些情况下就会出现进程过多，系统性能下降的问题，因而效率不高；

而使用xargs命令则只有一个进程。另外，在使用xargs命令时，究竟是一次获取所有的参数，还是分批取得参数，以及每一次获取参数的数目都会根据该命令的选项及系统内核中相应的可调参数来确定。

来看看xargs命令是如何同find命令一起使用的，并给出一些例子。

下面的例子查找系统中的每一个普通文件，然后使用xargs命令来测试它们分别属于哪类文 件

```
#find . -type f -print | xargs file
```

在当前目录下查找所有用户具有读、写和执行权限的文件，并收回相应的写权限：

```
# ls -l
# find . -perm -7 -print | xargs chmod o-w
# ls -l
```

用grep命令在所有的普通文件中搜索hello这个词：

```
# find . -type f -print | xargs grep "hello"
```

用grep命令在当前目录下的所有普通文件中搜索hello这个词：

```
# find . -name \* -type f -print | xargs grep "hello"
```

注意，在上面的例子中， \用来取消find命令中的*在shell中的特殊含义。

find命令配合使用exec和xargs可以使用户对所匹配到的文件执行几乎所有的命令。

###  1.11 磁盘分区挂载命令

```
df -h        查看磁盘使用/剩余空间                
fdisk -l      磁盘分区
mount       挂载
umount      卸载
```



### 1.12 进程管理命令

```
UID                       用户ID 
PID                       进程ID 
ps aux | grep xxx		         查看系统中所有进程
ps -ef | grep xxx		         可以查看子父进程之间的关系
kill -9 PID                  强制杀死进程
top                        查看所有进程/cpu/内存/负载
netstat -anp |grep 进程号	   查看该进程网络信息
netstat -nlp	| grep 端口号  	查看网络端口号占用情况
```



### 1.13 crond 系统定时任务

```
Crontab -e 编辑定时文件
```

详情见网页文档：[https://blog.csdn.net/qq_22172133/article/details/81263736](https://blog.csdn.net/qq_22172133/article/details/81263736)

实例操作：



### 1.14 rpm包管理与yum源

1.rpm相关命令：

```
rpm -qa|grep    包名          查找已经安装的rpm某包
rpm -ivh       包名           安装rpm包
rpm -e         包名           删除rpm包
rpm -e --nodeps  软件包          删除rpm包不检查依赖
```

2.yum源管理：详情见链接文档
https://blog.csdn.net/qingfenggege/article/details/80394564

3.yum在线安装lrzsz上传下载工具

```
yum -y install lrzsz
```



### 1.15 SSH免密

1.ssh是什么？

```
SSH（SecureShell），是建立在应用层基础上的安全协议，其SSH客户端适用于多种平台，可以有效防止远程管理过程中的信息泄露问题。
```

2.配置hadoop用户ssh免密：

```
ssh-keygen -t rsa 
```

三台机器在hadoop用户下，执行以下命令将公钥拷贝到node01服务器上面去

```
ssh-copy-id  node01
```

node01在hadoop用户下，执行以下命令，将authorized_keys拷贝到node02与node03服务器

```
cd /home/hadoop/.ssh/
scp authorized_keys  node02:$PWD
scp authorized_keys  node03:$PWD
```

###  1.16 nohup

nohup 是 no hang up 的缩写，就是不挂断的意思。

nohup命令：如果你正在运行一个进程，而且你觉得在退出帐户时该进程还不会结束，那么可以使用nohup命令。该命令可以在你退出帐户/关闭终端之后继续运行相应的进程。

在缺省情况下该作业的所有输出都被重定向到一个名为nohup.out的文件中。

***\*常规用法：\****

 ***\*nohup command > myout.file 2>&1 &\****  

说明：2>&1是将标准错误（2）重定向到标准输出（&1），标准输出（&1）再被重定向输入到myout.file文件中。

 

### 1.17 关闭防火墙

```
systemctl stop firewalld.service            关闭防火墙
systemctl status firewalld.service           查看防火墙状态
systemctl disable firewalld.service          禁止开启启动防火墙
```

