###  激活系统
理管（理清楚才好管）: 流程，制度， 智制 治 ,考核 (pdca) 权责利
卢麒元老师《韩昌黎文集》

 
备份软件， 手动一个月

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





##  虚拟机

sudo apt-mark hold linux-image-generic linux-headers-generic
 
```shell
virt-install --virt-type kvm --name uefi  --noautoconsole --ram 1024    --boot loader=/usr/share/ovmf/OVMF.fd --disk none --graphics none --network none 

```

##  vnc


apt install -y  
 


```cmd
cd /etc/systemd/system/
vi    vncserver@.service
systemctl enable vncserver@123.service
systemctl start  vncserver@123.service
```


## novnc


apt install -y novnc websockify python3-websockify 
 


openssl req -new -x509 -days 365 -nodes -out /usr/share/novnc/novnc.pem -keyout  /usr/share/novnc/novnc.pem

/usr/bin/websockify -D --web=/usr/share/novnc  --cert=/usr/share/novnc/novnc.pem  5023  localhost:6023

--target-config=/usr/share/novnc/novnc.conf  #一口多连 
