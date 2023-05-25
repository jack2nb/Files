

## 库查询数据库文件

## 创建只读用户

```sql
-- 登入账号
CREATE LOGIN dbjack   
    WITH PASSWORD = 'Db.jack';  
GO  

-- 创建用户
CREATE USER dbjack FOR LOGIN dbjack;  
GO


```

### 拥有**db_datareader**角色

```sql
exec sp_addrolemember 'db_datareader','dbjack';

```



## OA数据



### 根据数据建立er模型



"如何把SQL Server的数据库导为sql文件"

右击数据库-》任务-》生成脚本 -》进入向导

在保持文件的高级选项中：结构和数据



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





## 金蝶云erp

[金蝶云下载](http://pkgsfile.open.kingdee.com/DVD/V81E/K3Cloud_V8.1_DVD.zip)

[金蝶云标准版下载](http://pkgsfile.open.kingdee.com/DVD/V81S/K3Cloud_V8.1_Standard_DVD.zip)

## 数据库查询

```sql
SELECT name, physical_name AS CurrentLocation, state_desc  
FROM sys.master_files 
```













