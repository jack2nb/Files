# 超级功能表格

excel变成数据呈现客户端。

### 第行返回

ctrl+shift+enter  来实现多行返回

```python
""" 
返回类型  一个二维表
@xw.ret(expand='table')
"""
import xlwings as xw
import pandas as pd

@xw.func
@xw.arg('data', pd.DataFrame,header=True)
@xw.ret(expand='table',header=False,index=False)
def jkxCopyDf(data):
    """ 拷贝df """
    return data
```









## 宏调用

通过按钮执行py脚本  （插入/形状/指定宏）实现美观的按钮

```vbscript
Sub 中文函数名()
    RunPython ("import xlwings_app; xlwings_app.run_simulation()")
End Sub

```

脚本通过caller得到当前excel

```python
def run_simulation():
    sht = xw.Book.caller().sheets[0]
```



### 当前选中范围

当前选中范围

```
wb.selection
wb.selection.row
wb.selection.column
```

选中内容的值

```
wb.selection.value  
```



## 基础配置



建议用office 2019 / Anaconda3-2020.11-Windows-x86_64.exe  /  xlwings version: 0.20.8

office 2019 / win10

office 2013/ win7

[参考](https://docs.xlwings.org/zh-cn/latest/quickstart.html)

### 安装扩展

```
pip install xlwings
pip install pywin32
```

### excel加载

开发工具 excel加载项

```
xlwings.xlam

D:\programs\Anaconda3\pkgs\xlwings-0.20.8-py38_0\Lib\site-packages\xlwings\addin
```

```
xlwings addin install
```



文件>选项>信任中心>信任中心设置>宏设置

选择“启用所有并勾选” 

并勾选“对VBA对象模型的信任访问

### 创建例子

quickstart

```
cd /d D:\jack\xecxel
xlwings quickstart myproject
```

xlsm文件和py文件同名即可

### 设置 xlwings插件

```
conda  项目目录
"CONDA PATH":"D:\programs\Anaconda3"
"CONDA ENV":"base"
"PYTHONPATH": "D:\programs\Anaconda3"

_conda --version
conda 4.9.0
```

### 嵌入式代码

```cmd
xlwings code embed
```

## 函数代码

```python
@xw.func
```





###  excel大屏

Ctrl+Shift + f1  

宏定时器  

```
Sub MyStartTimer()

Sheet1.Cells(1, 2) = Sheet1.Cells(1, 2) + 1

Application.OnTime Now + TimeValue("00:00:01"), "MyStartTimer"

End Sub
```





