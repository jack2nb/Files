# 报表

成本报表

 通过《金蝶云星空集成开发平台》创建新的报表

## 概念

`签入` 相当于修改到系统文件。通过签入签出加锁

## 步骤1 创建



![image-20230804130214400](./sql报表-imgs/image-20230804130214400.png)





## 步骤2 数据源

![image-20230804130615980](./sql报表-imgs/image-20230804130615980.png)

### 编辑sql

带入参数

![image-20230804132032258](./sql报表-imgs/image-20230804132032258.png)

### sql语句

```sql
select a.FPRODUCTNO 单据编号, a.fproductid 物料编码 
,d1.FNAME 名称,g1.FNAME 单位, a.FCURCOMQTY 完工数量
,c.FSTANDARDVALUE 定额因子
, a.FCURCOMQTY*c.FSTANDARDVALUE  定额人工成本
from V_CB_CMPTCOSTQTYAMT a ,
T_CB_QUOTAFACTORENTRY c ,
T_BD_MATERIAL d,
t_BD_MaterialBase e ,
T_BD_MATERIAL_L d1 ,
T_BD_UNIT_L g1
where c.FPRODUCTID = a.fproductid 
and a.fproductid = d.FMATERIALID
and d.FMATERIALID =e.FMATERIALID 
and d.FMATERIALID =d1.FMATERIALID 
and e.FBASEUNITID = g1.FUNITID
and a.fproductid like  '#FBillNO#%'
```



## 步骤3 保存发布



![image-20230804133046210](./sql报表-imgs/image-20230804133046210.png)



### 发布位子

![image-20230804134002967](./sql报表-imgs/image-20230804134002967.png)





## 前台使用

### 要重新登入



![image-20230804135605005](./sql报表-imgs/image-20230804135605005.png)









