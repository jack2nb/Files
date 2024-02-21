# gitee 国内 pages托管

通过同步方式把book同步(freesync)到指定目录 ，再通过git提交到pages服务商

## pages梳理

| page文件git                        | 源文件git                            | 项目                         |
| ---------------------------------- | ------------------------------------ | ---------------------------- |
| oqdoc                              | https://github.com/jack2nb/Files.git | oq文档(cio简历)              |
| https://gitee.com/jack2nb/studdcpp |                                      | c++入门课（等一整套杂想）    |
| http://jack2nb.gitee.io/jinlaoshi/ |                                      | 金老师博客 (hugo)/cpp的pages |
|                                    |                                      |                              |

## git管理



| 名称     | 路径                              | 备注               |
| -------- | --------------------------------- | ------------------ |
| 网络磁盘 | https://gitee.com/jack2nb/diskgit | 常用文档，记录文档 |
|          |                                   |                    |
|          |                                   |                    |



## 规划

网络磁盘

* it知识（不含编程，不含量化）

* 生活、学习、（不含工作）


工作oq

* 工作常用入口、文档、备忘、规划
* 不含技术文档

写作(非技术)

* 思想经验，写成文章，整理成书

* 来自于网盘，灵感笔记

写作（技术类）

* 架构师到信息管

* linux从好奇开始

  

量化

* 代码，数据，



## 代理访问git
设置配置
```
git config --local http.proxy 'socks5://127.0.0.1:1080'

git config --local https.proxy 'socks5://127.0.0.1:1080'

```
查看配置
```
git config --global --list
git config --list
```
输出

```
user.name=www
user.email=wsf@git.com
ssh.proxy=socks5
http.proxy=socks5://127.0.0.1:1080
https.proxy=socks5://127.0.0.1:1080

```

