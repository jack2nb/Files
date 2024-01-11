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





##  虚拟机



```shell
virt-install --virt-type kvm --name uefi  --noautoconsole --ram 1024    --boot loader=/usr/share/ovmf/OVMF.fd --disk none --graphics none --network none 

```

## novnc


apt install -y novnc websockify python3-websockify 
 


```cmd
cd /etc/systemd/system/
vi   novnc.service
systemctl enable novnc
systemctl start  novnc
```


 /usr/bin/websockify 8590 127.0.0.1:5907

