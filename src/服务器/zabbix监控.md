 



## 监控

## rsyslog



## 添加顺序

配置.主机组 -》配置.主机-》主机.监控项-》监测.最新数据



### 测试命令

```cmd


zabbix_get -s 192.168.11.189 -p 10050 -k "system.hostname"
zabbix_get -s 192.168.11.189 -p 10050 -k "system.cpu.load"


```

如果没有此命令就需要手动安装

客户端无法连接 **Check access restrictions in Zabbix agent configuration**,

原因客户端配置文件/etc/zabbix/zabbix_agentd.conf中允许访问的列表不包含执行命令的服务器

```
Server=0.0.0.0/0

```



### 扩展zabbiz的安装源

1. 定制下载建议建议

https://www.zabbix.com/download?zabbix=5.0&os_distribution=ubuntu&os_versi

```


wget https://repo.zabbix.com/zabbix/5.0/ubuntu/pool/main/z/zabbix-release/zabbix-release_5.0-1+focal_all.deb

dpkg -i zabbix-release_5.0-1+focal_all.deb

apt update

apt install zabbix-get

```

##  snmp收集数据

### 华为snmp oid数据

arp表oid   (但是端口不准)  真实端口要从Oid:   1.3.6.1.2.1.2.2.1.2 获取

```
1.3.6.1.2.1.4.22.1
```



### 锐捷snmp oid数据

更新不及时 ？？？？

mac表oid   (但是端口不准)

```
1.3.6.1.2.1.17.4.3.1.1
```





### 使用ssh管理 +++ 



