 



## 华三交换机   poe

S1850-28p-pwr  （只读管理建议使用web）

[在线命令查看](https://www.h3c.com/cn/BizPortal/QueryCli/cn_index.aspx)

![](./imgs/poe交换机线缆检查.png)



### 查看版本和运行时间

```
display version
```

### 改名

```
sysname  lou5
```



普通模式下

重置配置

```cmd
reset saved-configuration
reboot
```

恢复出厂配置

```
restore factory-default
```



### 配置IP地址

查看ip

```cmd
display ip interface

display ip interface vlan-interface brief
```

查看本机mac

```
display stp
dis int gi 1/0/1   每个接口都有mac
```

 



#### 设置ip

```
interface vlan-interface 1
ip address 192.168.11.202 255.255.255.0

```

#### 配置默认路由

```
ip route-static 0.0.0.0  0  192.168.11.1
```



### 设置常用服务

#### 发现协议lldp 

```cmd
lldp enable


display lldp neighbor-information   #显示附近的设备
```





#### telnet 开启

```
telnet server enable
```



#### 查看接口状况

```
display interface brief
```

### 修改接口备注

```

interface GigabitEthernet1/0/24
description string 
```



### 统计信息

```
display interface brief
```



### 

