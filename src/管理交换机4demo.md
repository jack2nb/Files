 



## 管理交换机 eNSP



### 创建vlan/虚拟局域网

```cmd

 vlan batch 6 to 7 10 to 26 28 34 87 to 88 100 200 to 201

```



### 创建三层接口/逻辑端口

```cmd
 interface Vlanif100
 ip address 192.168.0.1 255.255.255.0
 
```

```cmd
interface Vlanif26
 ip address 192.168.6.1 255.255.255.0
```



#### 显示ip和mac

```cmd
dis arp
```



### 创建