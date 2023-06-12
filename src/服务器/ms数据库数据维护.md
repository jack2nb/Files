

## 库查询数据库文件

heidisql

#### 开启事务

```
工具->选项->查询执行->SQL Server->ANSI -> 勾选  SET_IMPLICT_TRANSACTIONS(M)

中文使用nvarchr
```

```sql
BEGIN TRANSACTION 
 
commit transaction --提交事务

rollback transaction --回滚事务
```

### 表注解

```sql
-- 添加表注释
execute sp_addextendedproperty 'MS_Description','填写你的表注释','user','odb','table','填写表名',null,null;
 
```

### 字段注解

```sql
--添加
execute sp_addextendedproperty 'MS_Description','注解内容','user','用户名','table','表名','column','字段名';
--修改 
execute sp_updateextendedproperty 'MS_Description','注解内容','user','用户名','table','表名','column','字段名';
--删除 
execute sp_dropextendedproperty 'MS_Description','注解内容','user','用户名','table','表名','column' ;
```



## 创建只读用户

```sql
-- 登入账号
CREATE LOGIN dbjack   
    WITH PASSWORD = 'Db.jack';  
GO  

-- 创建用户并关联 (可不做映射)
CREATE USER dbjack FOR LOGIN dbjack;  
GO


```

### 修改密码

```sql
ALTER LOGIN dbjack
	WITH PASSWORD = 'Pwd4jack119900'; --符合密码规范
go 
```

### 登入名赋予服务器角色

```sql


EXEC sp_addsrvrolemember 'dbjack','sysadmin';
go

```

## 登录名/用户名

dbo（用户名）是指以 sa(登录名)

#### 登入名

```sql
select name,status,createdate from  syslogins 
```

#### 用户

```sql
SELECT uid, name ,status FROM Sysusers  where  islogin = 1; 
```



### 数据库角色

```sql
exec sp_addrolemember 'db_datareader','dbjack';   -- 先要是数据库用户


```



### 查询所有者/数据库大小

```sql
exec sys.sp_helpdb
```

### 删除用户

```sql
drop user dbjack 

drop login dbjack 

```



#### 查看表结构

```sql
sp_help table_name;           

sp_columns table_name;
```

#### 字段注解

```sql
select column_name name,data_type type 
from information_schema.columns 
where table_name = '表名'
```

```sql
SELECT 
    表名       = case when a.colorder=1 then d.name else '' end,
    表说明     = case when a.colorder=1 then isnull(f.value,'') else '' end,
    字段序号   = a.colorder,
    字段名     = a.name,
    标识       = case when COLUMNPROPERTY( a.id,a.name,'IsIdentity')=1 then '√'else '' end,
    主键       = case when exists(SELECT 1 FROM sysobjects where xtype='PK' and parent_obj=a.id and name in (
                     SELECT name FROM sysindexes WHERE indid in( SELECT indid FROM sysindexkeys WHERE id = a.id AND colid=a.colid))) then '√' else '' end,
    类型       = b.name,
    占用字节数 = a.length,
    长度       = COLUMNPROPERTY(a.id,a.name,'PRECISION'),
    小数位数   = isnull(COLUMNPROPERTY(a.id,a.name,'Scale'),0),
    允许空     = case when a.isnullable=1 then '√'else '' end,
    默认值     = isnull(e.text,''),
    字段说明   = isnull(g.[value],'')
FROM 
    syscolumns a
left join 
    systypes b 
on 
    a.xusertype=b.xusertype
inner join 
    sysobjects d 
on 
    a.id=d.id  and d.xtype='U' and  d.name<>'dtproperties'
left join 
    syscomments e 
on 
    a.cdefault=e.id
left join 
sys.extended_properties   g 
on 
    a.id=G.major_id and a.colid=g.minor_id  
left join
sys.extended_properties f
on 
    d.id=f.major_id and f.minor_id=0
where 
    d.name='USERINFO'    --如果只查询指定表,加上此where条件，tablename是要查询的表名；去除where条件查询所有的表信息
order by 
    a.id,a.colorder



```

## 查询跟踪(profiler)

sql server profiler

### 基于databaseName

```
select DB_ID ('数据库名称');

```

所有事件+所有列-》事件选择-》列筛选器

databaseName  类似于

TextData  类似于





## OA数据



### 根据数据建立er模型

### 

"如何把SQL Server的数据库导为sql文件"

右击数据库-》任务-》生成脚本 -》进入向导

在保持文件的高级选项中：结构和数据

### 库ouqi 

#### 用户数据

```sql
select t.id, t.name, t.loginno , t.telephone  
-- ,t.*
from dbo.T_USER t
where name like '蔡金凯'
```

我的id  

```
11ed-a9b8-191b765e-a8b2-a36392a02a45  用户id

11ed-d4e2-6ee7b680-a973-1182f27b94d8   部门id

11e8-b82b-b7056a2c-b266-7907d3bcd381    应用id

11e8-b82d-bbed2547-9ee2-053d1e776df4    区域id domainid
```



#### 补考勤

```sql
select  
ITEM_ATTDATE,FORMNAME
-- , t.*
from TLK_ATTENDANCEDETAIL t
where t.author like '11ed-a9b8-191b765e-a8b2-a36392a02a45'
```



操作记录表，DOCUMENT

操作表，ACTORHIS

公出记录，TLK_BUSINESS_PUBLIC_TRIP

流程记录明细,TLK_ATTENDANCEDETAIL

流程进度，TLK_FOR_ATTENDANCE



流转关系 ，RELATIONHIS

日志，T_LOG

 

### 库kaoqin

#### 授权

```sql
-- 创建用户
CREATE USER dbjack FOR LOGIN dbjack;  
GO

exec sp_addrolemember 'db_datareader','dbjack';


```

#### 考勤记录表

我的用户id:  USERID ==  2859   

标记号码 ：BADGENUMBER/user_pin ==   1000157



IDCardNotice  用来是否离职

```sql
select  t.sn 打卡机
-- , t.*
from  CHECKINOUT t
where USERID  = 2859
and CHECKTIME   = '2023-03-28 12:24:06.000'
order by checktime desc


```



#### 考勤时间段

```sql
select  t.sn 打卡机
  , t.*
from  CHECKINOUT t
where USERID  = 2859
and CHECKTIME   >= '2023-03-28' and CHECKTIME   <= '2023-03-29'
order by checktime desc


```

#### 用户信息

```sql
select *
from  USERINFO
where 1=1
and name  LIKE '蔡金凯'
and GENDER is not Null
```

##### 权限差异

```sql
select t.privilege  ,t.GENDER ,t.FSelected 
,t.*
from  USERINFO t
where name in  ( '岑凯123' ,'陈肖璇','蔡金凯' ,'黄小艳','彭延涛')
order by  name 

```

#### 提升权限

```sql
select USERID,name,privilege ,GENDER from USERINFO where USERID = 2859;


update USERINFO set  privilege=3 ,GENDER='M'
where USERID = 2859;
```

#### 重名查看

```sql
select count(name) ct ,t.name 
from kaoqin..USERINFO   t
where t.FSelected = 0
group by name
order  by ct desc
```





## 金蝶云erp

[金蝶云下载](http://pkgsfile.open.kingdee.com/DVD/V81E/K3Cloud_V8.1_DVD.zip)

[金蝶云标准版下载](http://pkgsfile.open.kingdee.com/DVD/V81S/K3Cloud_V8.1_Standard_DVD.zip)













