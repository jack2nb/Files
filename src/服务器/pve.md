# Proxmox  虚拟化

高度集成使用方便，网络独立于linux

关键设备要专用，应用设备要通用

[参考](https://pve-doc-cn.readthedocs.io/zh-cn/latest/chapter_pveceph/index.html)

https://192.168.22.25:8006/

```
qm list 
qm stop 100
```



### 命令创建kvm主机

```
qm create 114 \
--agent 1 \
--machine q35 \
--ostype l26 \
--scsihw virtio-scsi-pci \
--serial0 socket \
--cores 2 --sockets 1 --cpu host \
--bios seabios  --boot cdn \
--net0 virtio,bridge=vmbr0
```





## lxc虚拟化

配置文件

```
cd /etc/pve/lxc/
ls -l
```

#### 直通设置



#### 启动后查看服务

```
systemctl list-units --type=service
```

#### 设置ip和dns

```
ip addr add 192.168.22.35/24 dev eth0
ip route add  0.0.0.0/0  via 192.168.22.5  dev eth0

```



#### 替换源

```
cp  /etc/apt/sources.list  /etc/apt/sources.list~

sed -i 's|archive.ubuntu.com/ubuntu|mirrors.tuna.tsinghua.edu.cn/ubuntu|g' /etc/apt/sources.list

```



### 替换下载源

```bash
sed -i 's|http://download.proxmox.com|https://mirrors.tuna.tsinghua.edu.cn/proxmox|g' /usr/share/perl5/PVE/APLInfo.pm  

systemctl restart pvedaemon.service
```

### 安装更新工具

```
 apt install apt-transport-https ca-certificates
```





## lxc命令创建

pvx下  openwrt 只能用

### 命令创建

```cmd
pct create 2000 /var/lib/vz/template/cache/openwrt-23.05.2-x86-64-rootfs.tar.gz \
--arch amd64 --hostname lxc-OpenWrt   --rootfs local-lvm:0.5 --memory 500 -swap 0 --cores 2 \
--ostype unmanaged --unprivileged 0 -net0 bridge=vmbr0,name=eth0

```

磁盘0.5GB  内存500MB  

### 进入终端

```

pct start 2000  
lxc-attach 2000 
```





## 导入kvm虚拟机



```
qm importdisk <vmid> <source> <storage>


qm importdisk 102 ubuntu-18.04.vmdk  local-lvm --format=qcow2

```

## 查看配置

```
qm config 102
```





## 调整分区

```
parted
print
resizepart 2 12GB
```





## 下载ct模板

修改源

```
cp /usr/share/perl5/PVE/APLInfo.pm /usr/share/perl5/PVE/APLInfo.pm_back
sed -i 's|http://download.proxmox.com|https://mirrors.tuna.tsinghua.edu.cn/proxmox|g' /usr/share/perl5/PVE/APLInfo.pm
```



### tar.zst模板

web界面直接下载

```
pveam list local 

pveam download local  
```

### xlc模板

```
https://downloads.immortalwrt.org/releases/23.05.1/targets/x86/64/immortalwrt-23.05.1-x86-64-rootfs.tar.gz
```



## lxc创建docker

勾上无特权模式

 ```
cd /etc/pve/lxc/
vim /etc/pve/lxc/ID.conf
 ```

pve8配置

```
lxc.cgroup.devices.allow = c 10:200 rwm
lxc.mount.entry = /dev/net/tun dev/net/tun none bind,create=file
```


