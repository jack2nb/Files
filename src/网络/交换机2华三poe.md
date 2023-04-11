 



## 华三交换机   poe

S1850-28p-pwr



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

 



设置ip

```
interface vlan-interface 1
ip address 192.168.11.202 255.255.255.0

```

