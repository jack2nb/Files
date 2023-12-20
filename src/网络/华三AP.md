 



# 华三胖AP设置

 H3CWA2620i-AGN 

WA系列无线接入点设备配置指导

## 初始设置  

### IP设置

### 通过串口设置

```
system-view

interface vlan-interface 1

ip address 10.1.1.1 24

quit
```

### 设置密码

```
user-interface vty 0 4

authentication-mode password

user privilege level 3
```

### ip查看

```
display ip interface brief
display ip routing-table
display arp 
display dhcp client 
```



## web管理 

```cmd
display ip https
ip https enable

```



 
