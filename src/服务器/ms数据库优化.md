# 数据库优化

 

查询过的sql语句   按时间查找，可以在使用人少是查询并记录下来

```sql
SELECT TOP 1000
       ST.text AS '执行的SQL语句',
       QS.execution_count AS '执行次数',
       QS.total_elapsed_time AS '耗时',
       QS.total_logical_reads AS '逻辑读取次数',
       QS.total_logical_writes AS '逻辑写入次数',
       QS.total_physical_reads AS '物理读取次数',       
       QS.creation_time AS '执行时间' ,  
       QS.*
FROM   sys.dm_exec_query_stats QS
       CROSS APPLY
sys.dm_exec_sql_text(QS.sql_handle) ST
WHERE  QS.creation_time >= '2024-04-24 09:09:08' 
and  QS.creation_time <= '2024-04-24 09:09:11' 
and ST.text like  '%SELECT%'
and ST.text not like  'INSERT%'
ORDER BY
     QS.total_elapsed_time DESC
```

-----------



```sql
SELECT TOP 10
       ST.text AS '执行的SQL语句',
       QS.execution_count AS '执行次数',
       QS.total_elapsed_time AS '耗时',
       QS.total_logical_reads AS '逻辑读取次数',
       QS.total_logical_writes AS '逻辑写入次数',
       QS.total_physical_reads AS '物理读取次数',       
       QS.creation_time AS '执行时间' ,  
       QS.*
FROM   sys.dm_exec_query_stats QS
       CROSS APPLY
sys.dm_exec_sql_text(QS.sql_handle) ST
WHERE  ST.text like  '2024'
ORDER BY
     QS.total_elapsed_time DESC
```

```
T_CN_CASHBALANCE    现金余额
T_CN_BANKACNT        银行存款余额表头

T_GL_VOUCHERENTRY   凭证
T_AR_RECEIVEBILLENTRY  收款明细  ++ 


T_CN_CASHBALANCE（现金余额表表头）
T_CN_CASHBALANCEENTY（现金余额表表体）
T_CN_BANKACNTBAL（银行存款余额表头）
T_CN_BANKACNTBALENTRY（银行存款余额表体）
t_CN_InnerBankBal(内部账户余额表）
t_CN_InnerBankBalEntry(内部账户余额表体） 
```

```sql
 FROM 
      T_CN_BILLRECSETTLE t0 
      INNER JOIN T_CN_BILLRECSETTLEENTRY t1 ON t0.FID = t1.FID 
      LEFT OUTER JOIN T_ORG_Organizations_L st08_L ON (
        t0.FPAYORGID = st08_L.FOrgID 
        AND st08_L.FLocaleId = 2052
      ) 
      LEFT OUTER JOIN T_ORG_Organizations_L st09_L ON (
        t0.FSETTLEORGID = st09_L.FOrgID 
        AND st09_L.FLocaleId = 2052
      ) 
      LEFT OUTER JOIN T_CN_BANKACNT st12 ON t1.FRECBANKACNTID = st12.FBANKACNTID 
      INNER JOIN TMPCFE051C101E711EFA1282CEA7FE endDateTmp ON endDateTmp.FPAYORGID = t0.FPAYORGID 
      LEFT OUTER JOIN T_CN_BANKACNT bankacnt ON bankacnt.FBankAcntId = t1.FRECBANKACNTID 
```

```sql
T_CN_BANKTRANSBILL t0 
          INNER JOIN T_CN_BANKTRANSBILLENTRY t1 ON t0.FID = t1.FID 
          INNER JOIN T_CN_BANKTRANSBILLENTRY_B t1_B ON t1.FENTRYID = t1_B.FENTRYID 
          LEFT OUTER JOIN T_ORG_Organizations_L st06_L ON (
            t0.FPAYORGID = st06_L.FOrgID 
            AND st06_L.FLocaleId = 2052
          ) 
          LEFT OUTER JOIN T_BD_BANK_L st13_L ON (
            t1.FTOBANKID = st13_L.FBANKID 
            AND st13_L.FLocaleId = 2052
          ) 
          LEFT OUTER JOIN T_CN_BANKACNT st14 ON t1.FTOBANKACNTID = st14.FBANKACNTID 
          LEFT OUTER JOIN T_CN_BANKACNT_L st14_L ON (
            t1.FTOBANKACNTID = st14_L.FBANKACNTID 
            AND st14_L.FLocaleId = 2052
          ) 
          LEFT OUTER JOIN T_CN_BANKACNT bankacnt ON bankacnt.FBankAcntId = t1.FFROMBANKACNTID 
```

