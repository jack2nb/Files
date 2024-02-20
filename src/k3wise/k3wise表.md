# 常用表

 [金蝶K3数据库表名对应及表说明](https://blog.csdn.net/hzfw2008/article/details/76401090)

## 基础

### 账套查询

```sql
select * from t_ad_kdAccount_gl
```





### 起初余额查询

| 表含义                 | 表名              |              |
| ---------------------- | ----------------- | ------------ |
| 科目表                 | t_Account         | FPeriod:月份 |
| 余额表                 | t_Balance         |              |
| 数量余额表             | t_QuantityBalance |              |
| 损益科目本年实际发生额 | t_ProfitAndLoss   |              |



```sql
SELECT a.FAccountID,
        a.FDetailID,
         a.FNumber,
         FName,
         FLevel,
         a.FDetail,
         FGroupID,
         FDC,
        FHelperCode,
         FQuantities,
        a.FDelete,
         FYtdDebit,
        FYtdCredit,
        FYtdDebitFor,
        FYtdCreditFor,
        FYtdDebitQty,
        FYtdCreditQty,
        FYtdAmountFor,
        FYtdAmount,
         FBeginBalance,
        FDebit,
        FCredit,
        FEndBalance,
         FBeginBalanceFor,
         FDebitFor,
         FCreditFor,
        FEndBalanceFor,
         Coef,
         MeasName,
        FBeginQty,
        FEndQty
FROM t_Account a LEFT OUTER
JOIN 
    (SELECT *
    FROM t_Balance
    WHERE FDetailID=0
            AND FYear=2024
            AND FPeriod=1
            AND FCurrencyID=1) b
    ON a.FAccountID = b.FAccountID LEFT OUTER
JOIN 
    (SELECT u.FUnitGroupID,
        m.FCoefficient Coef,
        m.FName MeasName
    FROM t_unitgroup u, t_MeasureUnit m
    WHERE u.fdefaultunitid=m.fmeasureunitid ) u
    ON a.FUnitGroupID = u.FUnitGroupID 
LEFT OUTER JOIN 
    (SELECT *
    FROM t_QuantityBalance
    WHERE FDetailID=0
            AND FYear=2024
            AND FPeriod =1
            AND FCurrencyID=1) q
    ON a.FAccountID=q.FAccountID 
LEFT OUTER JOIN 
    (SELECT *
    FROM t_ProfitandLoss
    WHERE FDetailID=0
            AND FYear=2024
            AND FPeriod =1
            AND FCurrencyID=1) p
    ON a.FAccountID=p.FAccountID
INNER JOIN 
    (SELECT DISTINCT a.FAccountID
    FROM t_account a
    LEFT JOIN t_account b
        ON b.FParentID = a.FAccountID
    WHERE (a.FCurrencyID=0
            OR a.FCurrencyID=1)
            OR (b.FCurrencyID=0
            OR b.FCurrencyID=1)) ab
    ON a.FAccountID=ab.FAccountID
ORDER BY  a.Fnumber
```

