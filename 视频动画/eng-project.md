## 双重变现

第一视频流量，第二web页广告 ，第三双语卡片
现货生意
视频最大的问题是不能互动，最大的优势就是表现力

每天说英语、Speak English Every Day  （seed代号种子）



**单词** ，句子，对话



能力产品化，产品服务化 （用产品解决需求）



## 内容安排

单词量快速翻倍，组合词

数据基于mdx字典，提取后做拆分比对入库

Goldendict 字典工具





## 托管



git+ pages   静态托管



### 启动动画预览

```
start-movy.bat

```

```
movy  eng-v1.js
```



### 进度

```
手动 10个电器
自动 文字部分

```

```
创建数据库，

2级别目录生图和男女音频

挑选优秀的男女音




```

Azure Speech 免费额度 每月5000字

二维码 （回顾本次学习）  最后出现

### 理念

中文英文重复关联 

## 1动画视频

 【学，识】 【练，考】 （重复再重复）

加入示意图 听说

#### 学(图到字) 

 视频1

```
1 图片 #//浮出效果
2 中文 ， 英文 [空英文的时间]，  #//拉幕效果
3 x2(两遍)
```

#### 识(字到图)

 倒计时选择 

```
1 文字+英标 #//拉幕效果
2朗读
3 2张图   #//浮出效果
4 朗读
5 提示选择 
```



#### 识(图到字)  

```
1 图  #//浮出效果
2 2个单词 //拉幕效果
3 朗读(分别)
3 提示选择
```



引入ppt中的png图片 + 音标图片



#### 字稿

```

```



### 发音

微软发音库选择

```
https://speech.microsoft.com/portal/5eb25ee013f544f39e7fb1153d0fc9c7/voicegallery
试听和导出来生成wav音频

```



### 注音





```
以上英文请用 Merriam-Webster Dictionary  的音标来注解并用json格式输出 例如：{"turtle":"ˈtər-tᵊl "}
```

## 配音工作（数据）

* 根据单词组 计算wav时间 并存成 json文件带时间

  * 根据db数据找到文件
  * 根据文件得出时长
  * 根据时长更新数据库
  * 根据数据库生成json配文件
  
  

wav作为音频格式  ，单词前期工作-5分钟10个单词生成json-jsonp

```python
# 关键代码 
info = ffmpeg.probe(fname)
row.enTm = float(info['streams'][0]['duration'] )
```



### 无声视频

通过 movy生产视频`start-movy.bat`  (movy  eng-v1.js)

* 读取 单词`eng-amt/en500word/1/1/cfg_11.json`配置文件
* 读取视频脚本配置文件 `xxx.json` (保存配文件)
* 循环执行部分 
* 生成视频



```
D:/jack/eng-amt/en500word/1/1/cfg_11.json


```




###   配音


#### 手动配音

用剪映专业版中的音频素材，视频通过代码实现。



```风铃效果
风铃音效，字幕展现,轻快的嗖，动画片弹跳
```





#### 发音选择

| edge | cn             | en     |
| ---- | -------------- | ------ |
| m    | yunxia,yunjian | connor |
| f    | xiaoxiao       | molly, |
|      |                |        |



#### 自动合成配音

音频生成-通过单词配置文件生成500词 通过 ffmpeg-python 库实现音频处理

* 读取json配置文件
* 读取mp3文件的时间长度
* 计算空白时间
* 累加合成音频



```

```



## 2在线系统

速度第一，计算能力第二



### 速度测试

### url入口

使用二级结构的url来生成二维码

通过重写来304跳转

```
https://eng-seed.17121.top/study/words/?p=1&t=123456

```

### 资源路径

```
2两地资源，优先r2，
https://src.17121.top/a/b/xxx.jpg
```





r2 vs  cdn

```
https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js

https://scr.17121.top/js/jquery%403.4.1/jquery.min.js
```

cdn胜  r2可能首次加载特慢

works vs pages

```
http://nav.17121.top/

https://wsf.17121.top/
```

都一般般









### 云托管

### works入口

作为web入口 /

### R2 存储

作为资源存储/简单数据库

## 3建立数据库 

通过数据调用，实现自动化









### 后续工具

```
https://www.youtube.com/watch?v=BOLtvLpUmBE&t=182s

https://www.bilibili.com/video/BV15v4y1E7zV/?spm_id_from=333.880.my_history.page.click&vd_source=c0ab9099ebe8e595cbf150bd639f9462

```

## 智能识别

Whisper



