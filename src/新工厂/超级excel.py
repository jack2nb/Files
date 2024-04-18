import xlwings as xw
import logging
import pandas as pd
 
 
import imp_ext as ie #自定义扩展

 

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

logger = mylog()
logger.info('{} 启动或载入'.format(__file__))
 

 
 

@xw.func
@xw.arg('x', pd.DataFrame)
@xw.ret(expand='table')
def correl2(x):
   
    corr = x#.corr()
    print('<df-----\n',corr,'\n------->')
    return corr

@xw.func
def tsWldm(spec ,name ):
    """ 输入输出一个字符串 """
    logger.info("type spec=={}".format(type(spec)))
    logger.info("参数 spec=={}, name =={}".format(spec,name))
    ## 类型转换
    spec =  '{:g}'.format(spec) if type(spec).__name__ == 'float' else spec
    name =  '{:g}'.format(name) if type(name).__name__ == 'float' else name
    ret = ie.获取物料代码通过型号名称(str(spec),str(name))
    return ret[1]

@xw.func
def jkxWldm(spec ,name ):
    """ 输入输出一个字符串 """
    logger.info("type spec=={}".format(type(spec)))
    logger.info("参数 spec=={}, name =={}".format(spec,name))
    ## 类型转换
    spec =  '{:g}'.format(spec) if type(spec).__name__ == 'float' else spec
    name =  '{:g}'.format(name) if type(name).__name__ == 'float' else name
    ret = ie.获取物料代码通过型号名称(str(spec),str(name))
    
    return ret[0]

@xw.func
@xw.ret(expand='table',header=False,index=False)
def jkxWlxx(fnumber ):
    """ 输入输出一个字符串 """
    logger.info("参数 fnumber=={}".format(fnumber))
    ## 类型转换
    fnumber =  '{:g}'.format(fnumber) if type(fnumber).__name__ == 'float' else fnumber
    ret_df = ie.获取物料信息通过代码(fnumber)
    
    return ret_df

 

@xw.func
@xw.arg('data', pd.DataFrame,header=True)
@xw.ret(expand='table',header=True)
def jkxCopyDf(data):
    """ 拷贝df """
    return data