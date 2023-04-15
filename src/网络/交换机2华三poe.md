 



## 华三交换机   poe

S1850-28p-pwr

[在线命令查看](https://www.h3c.com/cn/BizPortal/QueryCli/cn_index.aspx)

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

```
lldp enable

```

#### telnet 开启

```
telnet server enable
```

