# 微软数据

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







### 备份数据库

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















































































