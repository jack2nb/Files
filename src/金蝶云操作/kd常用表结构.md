

## 用户相关

### 用户信息表

```sql
select top 10 *  from t_sec_user
	
```

#### 重置密码

```sql
---- 密码改为6个8
update t_sec_user 
set fpassword='9EF0664B011C3DC6305C8B213378BACC2451FAEA',fmemo='8d2fea58-cda1-4035-9024-56cc6df8957c' 
where fuserid=119087
 
-- 525b1cda73e400e5e6b64d09fb3d417438ffd9c286d4124901b521feca7ffb6d	000352540018e2798ad311edf608d84de510
```



#### 二次检权数据

```sql
select *  
from T_BAS_USERPARAMETER
where FPARAMETEROBJID='SEC_CHECKIDENTITY'; 	
```





### 用户登入日志

```sql
select top 10 *  from T_BAS_USERLOGINRECORD

```

### 用户设置参数表

```sql
select top 10 *  from T_BAS_UserParameter

```

## 主配置

来之数据库 K3DBConfiger

### 账号系统表

```sql
select  *  from T_BAS_DATACENTER
where FDATACENTERID = '646312c743e2f6'    

    
```

### 账套号名称

```sql
select  *  from T_BAS_DATACENTER_L
where FDATACENTERID='646312c743e2f6'
```



关联关系 通过 ”FDATACENTERID“字段 

```sql
select  v.FDATACENTERID,v.FDATAbasename ,n.fname  ,v.FCREATEDATE
from T_BAS_DATACENTER v left join  T_BAS_DATACENTER_L n 
on v.FDATACENTERID = n.FDATACENTERID

```



### 账套备份记录

```sql
select  *  from T_BAS_DATACENTERBACKUPLOG	
```

