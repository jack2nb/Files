 
import logging
import pandas as pd
#import numpy as np
import requests,json
import datetime
import traceback


def ja_db(dc ,act='get',host=None):
    """ http读写数据库 
    """
    if host is None:
        host='7erpio.17121.top:2028'
    tpl = "http://{}/jsonapi/{}"
    url=tpl.format(host,act)
    data = json.dumps(dc,   default=datetime.datetime.isoformat)
    #--获取账号信息
    res_obj = requests.post(url ,data=data,timeout=25)#不能发送中文
    if res_obj.status_code != 200:
        logger.warning('访问 %s 服务错误 【%s】  / %s'%(url, res_obj.status_code, res_obj.text))
    #print(res_obj.text )
    dat_dc = json.loads(res_obj.text)
    return dat_dc 

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

def 获取物料信息通过代码(fnumber:str) ->pd.DataFrame:
    """ 
    输入
        物料代码
    返回
        一行物料信息  ['名称','规格']
    """
    ret_df = pd.DataFrame()
    vn = {
        "erp/T_BD_MATERIAL": {
            "FDOCUMENTSTATUS":"C",
            "FNUMBER":fnumber.strip(),
             "@column": "FNUMBER.物料代码,FMATERIALID",
       
        }
        ,"erp/T_BD_MATERIAL_L": {
            "FMATERIALID|": "erp/T_BD_MATERIAL.FMATERIALID","FLOCALEID": 2052
             ,"@column": "FMATERIALID,FSPECIFICATIONGG.规格,FNAME.名称",

        }
        ,"erp/T_BD_MATERIALBASE": {
            "FMATERIALID|": "erp/T_BD_MATERIAL.FMATERIALID",
             "@column": "FMATERIALID,FERPCLSID.物料属性id",
        }
        ,"erp/T_BD_MATERIALPRODUCE": {
            "FMATERIALID|": "erp/T_BD_MATERIAL.FMATERIALID",
             "@column": "FMATERIALID,FISSUETYPE.发料方式id",
        }
    }
    ##----
    try:
        ret = ja_db(  vn ) #//物料
      
    except Exception as e:
        tb_str = traceback.format_exc()
        logger.error("参数 fnumber=={} ".format(fnumber))
        logger.error("返回 dataframe=={} ".format(ret_df))
        logger.error("err info =={}, err exc =={}".format(e,tb_str))
    ## 有数据
    if ret and ret.get('erp/T_BD_MATERIAL'):
        row = pd.DataFrame.from_dict(ret['erp/T_BD_MATERIAL'])
        t2 = pd.DataFrame.from_dict(ret['erp/T_BD_MATERIAL_L'])
        t3 = pd.DataFrame.from_dict(ret['erp/T_BD_MATERIALBASE'])
        t4 = pd.DataFrame.from_dict(ret['erp/T_BD_MATERIALPRODUCE'])
        
        row = row.merge(t2,how="left",on="FMATERIALID")
        row = row.merge(t3,how="left",on="FMATERIALID")
        row = row.merge(t4,how="left",on="FMATERIALID")
        ret_df = row
    name_ls = ['名称','规格']
    return  ret_df[name_ls]

def ts获取物料代码通过型号名称(spec:str,name:str)->   int:
    return 获取物料代码通过型号名称(1)

def 获取物料代码通过型号名称(spec:str,name:str) -> (str, int):
    """ 
    输入
        规格,物料名称
    返回
        物料编码，行数
    """
    ret_name = "无"
    ret_num = 0
    vn = {
        "erp/T_BD_MATERIAL_L": {
            "@limit": 2,
            "FLOCALEID": 2052,
            "F_QINL_SPECIFICATION":spec.strip(),
            "FNAME":name.strip(),
            "@column": "F_QINL_SPECIFICATION.型号,FSPECIFICATIONGG.规格,FNAME.名称,FMATERIALID",
        },
        "erp/T_BD_MATERIAL": {
            "@column": "FNUMBER.物料代码,FMATERIALID",
            "FDOCUMENTSTATUS": "C",
            "FMATERIALID|": "erp/T_BD_MATERIAL_L.FMATERIALID",
        },
    }
    ##----
    try:
        ret = ja_db(  vn ) #//物料
      
    except Exception as e:
        tb_str = traceback.format_exc()
        logger.error("参数 spec=={}, name =={}".format(spec,name))
        logger.error("返回 ret=={} ".format(ret))
        logger.error("err info =={}, err exc =={}".format(e,tb_str))
    ## 有数据
    if ret and ret.get('erp/T_BD_MATERIAL_L'):
        t1 = pd.DataFrame.from_dict(ret['erp/T_BD_MATERIAL_L'])
        t2 = pd.DataFrame.from_dict(ret['erp/T_BD_MATERIAL'])
        row = t1.merge(t2,how="left",on="FMATERIALID")
        ret_name=row.iloc[0]['物料代码']
        ret_num = row.shape[0]
    return  ret_name,ret_num

 