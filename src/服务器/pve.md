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


































