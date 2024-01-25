# 虚拟化

[参考](https://pve-doc-cn.readthedocs.io/zh-cn/latest/chapter_pveceph/index.html)

https://192.168.22.25:8006/

```
qm list 
qm stop 100
```



### 命令创建主机

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



```
cd /etc/pve/lxc/
ls -l
```

#### 直通设置

```
lxc.apparmor.profile: unconfined
lxc.cgroup.devices.allow: a
lxc.cap.drop:
```

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
lxc-attach 2000 
```




















