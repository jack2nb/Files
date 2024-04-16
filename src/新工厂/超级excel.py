import xlwings as xw
import logging
import pandas as pd
import numpy as np

def mylog(name='mylog'):
    # 创建一个Logger对象
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    if not logger.handlers:
        # 创建一个文件处理器
        file_handler = logging.FileHandler('xl.log',encoding="utf-8")
        console_handler = logging.StreamHandler()
        # 创建一个日志格式化器
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        # 将文件处理器添加到Logger中
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)
    return logger


@xw.func
@xw.ret(expand='table')
def jkxArray(r,c):
    rev = np.random.randn(int(r),int(c)) 
    print('<rev-----\n',rev,'\n------->')
    return  rev

@xw.func
@xw.arg('x', pd.DataFrame)
@xw.ret(expand='table')
def correl2(x):
    logger = mylog()
    corr = x#.corr()
    print('<df-----\n',corr,'\n------->')
    return corr

@xw.func
def jkxHello(x):
    """ 输入输出一个字符串 """
    logger = mylog()
    logger.info("x={}".format(x))
    return "hello+" + str(x)

@xw.func
@xw.ret(expand='table')
def jkxNdf():
    """ 返回一个df """
    df = pd.DataFrame( 
    np.random.randint(0, 100, size=(10, 5)),  
    columns=[f'column{i}' for i in range(0, 5)] 
    ) 
    return df

@xw.func
@xw.arg('data', pd.DataFrame)
@xw.ret(expand='table')
def jkxCopyDf(data):
    """ 拷贝df """
    return data