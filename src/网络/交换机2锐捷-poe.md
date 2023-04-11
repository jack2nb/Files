 



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

 



