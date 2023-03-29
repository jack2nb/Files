 



## 锐捷交换机   poe

 S5750_RGOS 11.4



配置poe设置

```cmd
configure terminal 

poe mode auto
poe reserve-power 10


```

### 当前电压状况

```cmd
show poe powersupply
```

### 总体供电情况

所以接口供电状况

```
show poe interfaces status
```

#### poe配置情况

```
show poe interfaces configuration
```



### 查看接口状况 不含poe



```cmd
show interfaces status
```

 





#### linux终端使用发现协议

lldpad 链路发现协议

```
apt install lldpad


```

查看工具

```
lldptool set-lldp -i enp1s0 adminStatus=rxtx  #设置模式
export i=enp1s0
lldptool -T -i $i -V sysName enableTx=yes 
lldptool -T -i $i -V portDesc enableTx=yes 
lldptool -T -i $i -V sysDesc enableTx=yes 



lldptool -t -n -i enp1s0  #需要交换机支持
```

### 交换机上的发现结果

```
show lldp neighbors   #交换机上的发现结果
```

#### win终端使用发现协议

Powershell命令安装功能

```
Get-WindowsCapability -Name RSAT* -Online | Ft Displayname,State,Name #查询可用服务

Enable-WindowsOptionalFeature -Online -FeatureName 'DataCenterBridging'

Add-WindowsCapability -Online -Name "Rsat.LLDP.Tools~~~~0.0.1.0"  

 
```

查询链路信息

```
Get-NetLldpAgent

Enable-NetLldpAgent  -NetAdapterName "本地连接"

Disable-NetLldpAgent  -NetAdapterName "本地连接"

```

### 第三方lldp

```
PS C:\Users\raspi> Add-Type -Path 'C:\Program Files\WinLLDPService\LLDPBase.dll'
$config = New-Object WinLLDPService.Configuration
$config
$config.PortDescription.Add("test")
$config.ToString()
Return $config
```