

## 任务/消息

```sql
	
```



## 用户相关



### 用户信息表

```sql
select top 10 *  from t_sec_user
	
```

### 员工表

```sql
T_BD_STAFF_L
```

### 物料代码
```sql
select * from t_bd_material  a
left join T_BD_MATERIAL_L b on a.FMASTERID = b.FMATERIALID

where a.FNUMBER ='5.06.52.0006'
```

### 用户密码表

```sql
select top 10 *  from T_SEC_USERPASSPORT

```

### 用户登入日志

```sql
select top 10 *  from T_BAS_USERLOGINRECORD

```
### 用户最后登入时间
```sql
select * from 
(select FUSERID,max(FDATETIME)  m
from T_BAS_USERLOGINRECORD group by FUSERID ) vt 
inner join T_SEC_USER ta  on vt.FUSERID=ta.FUSERID


```
### 用户设置参数表

```sql
select top 10 *  from T_BAS_UserParameter

```

