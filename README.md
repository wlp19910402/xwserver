# 同步（拉取）文件
$ git pull orgin master

# 加入暂存区
$ git add -A

# 提交描述
$ git commit -m "第几次提交，干嘛的啊"

# 推送到远程库中
$ git push origin master# xwserver


报错：
$ git push origin master
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

查看keys
$ cat ~/.ssh/id_rsa.pub
在github的设置->SSH and GPG keys->New SSH key
将在终端打印出来的keys复制到这个key中