# /deploy.sh

# 确保抛出遇到的错误
set -e

# 进入源码目录
cd /www/wwwroot/blog.ichensw.cn

# 拉取最新代码
git pull

# 杀死目前已启动进程
ID=`ps -ef|grep node | grep vuepress|awk '{print $2}'`
echo --- the process is $ID ---
kill -9  $ID
echo  "Killed $ID"

# 启动
nohup npm run dev
