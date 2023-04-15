# 微软数据

[金蝶云下载](http://pkgsfile.open.kingdee.com/DVD/V81E/K3Cloud_V8.1_DVD.zip)

[金蝶云标准版下载](http://pkgsfile.open.kingdee.com/DVD/V81S/K3Cloud_V8.1_Standard_DVD.zip)

## 数据库查询

[参考](https://developer.aliyun.com/article/868429)

SQL Server 2016 (RTM) - 13.0.1601.5 (X64)    版本



```sql
-- 登入账号
CREATE LOGIN dbjack   
    WITH PASSWORD = 'pwd2jack';  
GO  

-- 创建用户
CREATE USER dbjack FOR LOGIN dbjack;  
GO


```

#### 查询版本



```sql
-- Select @@version

-- SELECT SERVERPROPERTY('productversion'), SERVERPROPERTY ('productlevel'),SERVERPROPERTY ('edition')

SELECT 
SERVERPROPERTY('servername')  AS  实例名,  
SERVERPROPERTY('ProductVersion')  AS  实例版本,  
SERVERPROPERTY('Edition')  AS  产品版本,  
SERVERPROPERTY('ProductLevel')  AS  版本级别,  
@@VERSION  AS  版本信息   
```

#### 查询当前连接

```sql
select loginame,count(0) ct from sys.sysprocesses
group by loginame
order by ct desc
```

#### 连接执行

```sql
Select * From sys.dm_exec_connections
```



### 命令行访问

支持linux和docker部署

远程连接到数据库

```
sqlcmd -S 192.168.0.121,1433 -U SA 
```



#### 简单查询

```sql
USE TestDB;
SELECT * FROM Inventory WHERE quantity > 152;

go

```

必须使用go才执行

 



## win端管理工具

ssms（sql servier management studio）

直接连接图形化

 



### 修改某用户的密码

```sql
alter login dbjack with password='wsf119900'
```







## 备份数据库

覆盖方式备份

```sql
backup database   database_name to disk='E:\backup\database_name.bak' with init
```



```mssql
backup database   database_name to disk='E:\backup\database_name.bak' with init
```

#### 差异备份

```mssql
Backup Database *database_name* 
To disk='E:\backup\database_name.bak'
with Differential
```



#### 备份脚本

也可以设置成脚本备份

```sql
sqlcmd -i "f:\dbbak\bak.sql"
```



### 恢复数据库

脚本可指定文件

```mssql
RESTORE DATABASE AbpFirst FROM DISK='D:\AbpFirst.bak' WITH MOVE 'AbpFirst' TO 'D:\MyData\AbpFirst_Data.mdf', Move 'AbpFirst_log' TO 'D:\MyData\AbpFirst_log.ldf'
```

#### 只恢复文件

```mssql
RESTORE FILELISTONLY FROM DISK='d:\AbpFirst.bak'	
```















































































