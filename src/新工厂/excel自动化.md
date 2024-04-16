# 超级功能表格

建议用office 2019 / Anaconda3-2020.11-Windows-x86_64.exe  /  xlwings version: 0.20.8

office 2019 / win10

office 2016 / win7

## 基础配置

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

```
xlwings code embed
```

## 关键代码

```python
@xw.func
```





### 第行返回

ctrl+shift+enter  来实现多行返回

```python
""" 
返回类型  一个二维表
@xw.ret(expand='table')
"""
import xlwings as xw
import numpy as np

@xw.func
@xw.ret(expand='table')
def jkxArray(r,c):
    rev = np.random.randn(int(r),int(c)) 
    return  rev
```



















