###  激活系统



命令行
```cmd
slmgr /dlv
slmgr /skms e-db.jack2nb.top
slmgr /ipk W269N-WFGWX-YVC9B-4J6C9-T83GX
slmgr /ato
```

## office 专业增强版 2019 激活

进入目录

```
cd /d C:\Program Files (x86)\Microsoft Office\Office16
cscript ospp.vbs /dstatus
```

卸载原本的激活码【xxxxx为密钥后五位】

```
cscript ospp.vbs /unpkey:XXYY
```

开始激活

```cmd

cscript ospp.vbs /inpkey:NMMKJ-6RK4F-KMJVX-8D9MJ-6MWKP
cscript ospp.vbs /sethst:e-db.jack2nb.top
cscript ospp.vbs /act
```




### office 2013

office转成vol版本

```
使用方法：以管理员身份运行相应版本的“Install_License.bat”
```



```
 
cscript ospp.vbs /inpkey:YC7DK-G2NP3-2QQC3-J6H88-GVGXT
cscript ospp.vbs /sethst:192.168.0.121
cscript ospp.vbs /act
```

## 软件激活

```

```



#### ovs虚拟交换机

```
ip link set ovs1 up
ip addr add 192.168.2.12/24 dev ovs1
```



##  禁止内核更新

```
sudo apt-mark hold linux-image-generic linux-headers-generic
```





##  vnc

```
apt install -y   x11vnc
```





```shell
cd /etc/systemd/system/
vi    vncserver@.service
systemctl enable vncserver@123.service
systemctl start  vncserver@123.service
```

```bash
[Unit]
Description=Remote desktop service (VNC)
After=syslog.target network.target

[Service]
Type=simple
User=root
PAMName=login
PIDFile=/home/%u/.vnc/%H%i.pid
ExecStartPre=/bin/sh -c '/usr/bin/vncserver -kill :%i > /dev/null 2>&1 || :'
ExecStart=/usr/bin/vncserver :%i -geometry 1440x900 -alwaysshared -f
ExecStop=/usr/bin/vncserver -kill :%i

[Install]
WantedBy=multi-user.target

```



配置文件

```bash
#!/bin/sh
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
exec startxfce4

```



## novnc

```
apt install -y novnc websockify python3-websockify 



openssl req -new -x509 -days 365 -nodes -out /usr/share/novnc/novnc.pem -keyout  /usr/share/novnc/novnc.pem

/usr/bin/websockify -D --web=/usr/share/novnc  --cert=/usr/share/novnc/novnc.pem  5023  localhost:6023

--target-config=/usr/share/novnc/novnc.conf  #一口多连 
```

启动novnc服务

```
/usr/bin/websockify -D --web=/usr/share/novnc  --cert=/usr/share/novnc/novnc.pem  5023  localhost:6023


```

通过web管理服务器 

![](D:\jack\云文档\src\服务器\imgs\novnc.png)







### 服务器登入策略



计算机配置\Windows 设置\安全设置\本地策略\安全选项

```
帐户: 使用空密码的本地帐户只允许进行控制台登录 : 禁用
```



计算机配置\Windows设置\安全设置\帐户策略\密码策略

```
密码必须符合复杂性要求:禁用
```



计算机配置\管理模板\控制面板\个性化

```
不显示锁屏:已启用
```

### 自动登入

```
Netplwiz
```

```
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon

双击DefaultUserName 字符串条目，键入您的用户名 
双击DefaultPassword 字符串条目，键入您的密码 
双击“AutoAdminLogon” 字符串条目   设置为1 

 
```

```
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon]
"AutoAdminLogon"="1"
"DefaultUserName"="Administrator"
"DefaultPassword"="wsf"


```

