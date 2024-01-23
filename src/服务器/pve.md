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






























