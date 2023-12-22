 



# 华三胖AP设置

 H3C WA2620i-AGN  胖瘦一体

[WA系列无线接入点设备配置指导](http://www.h3c.com/cn/Service/Document_Software/Document_Center/Wlan/WA/WA2600/)

[H3C WA2600系列无线接入点  配置调测 配置指导 H3C WA系列无线接入点 配置指导 ](https://www.h3c.com/cn/d_201707/1017275_30005_0.htm)



## 初始设置  

### IP设置

```
undo info-center enable
```





### 通过串口设置

```
system-view

interface vlan-interface 1

ip address 10.0.0.2 24



quit
telnet server enable
```

### 设置密码

```
user-interface vty 0 4

authentication-mode password
set authentication password simple admin

user privilege level 3

password simple admin
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
display web users
display ip https
ip https enable

```



## 无线设置

```

display interface wlan-radio
display interface wlan-bss 
display interface wlan-mesh 

interface wlan-radio

```

 