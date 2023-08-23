#!/usr/bin/env python3
#-*- coding: UTF-8 -*-
 

"""


cd /d D:\jack\netdisk\itk\quant_vt
python web.py


"""

import os, sys
import datetime
import re
import logging

import tornado.ioloop
import tornado.web
from tornado.web import StaticFileHandler  
import warnings
import json

import traceback
from collections import OrderedDict

#  & |
# @关键字    #范围   $ like

warnings.filterwarnings("ignore")

FILE_PATH = os.path.dirname(os.path.realpath(__file__))
os.chdir(FILE_PATH) # 切换运行目录


sys.path.append(FILE_PATH)
sys.path.append(os.path.join(FILE_PATH, '..', 'commonality'))

import decimal
import jsonapi

template_root = 'netui'  # 模板文件根目录
static_root = 'static'  # 静态文件目录
 

class gm():
    """  全局类
    """
    cfg = {}  # 配置
    pid = -1  # 进程id
    thre = {}  # 线程池
    one = -1  # 首次运行
    res = {}  # 资源

    @classmethod  # //静态方法
    def load_cfg(cls, json_file, path=None):
        """ 读取一个配置文件
        """
        if not path:
            path = cls.get_pwd()
            json_file = os.path.join(path, json_file)
        try:
            # //配置载入 配置与属性隔离
            with open(json_file, encoding="utf-8") as f:
                setting_dict = json.load(f)
        except Exception as e:
            # logger.error('读取配置文件%s错误%s' % (json_file, e))
            raise Exception('读取配置文件%s错误%s' % (json_file, e))
        return setting_dict

    @classmethod  # //静态方法
    def get_pwd(cls):
        """  获取脚本目录 """
        try:
            FILE_PATH = os.path.dirname(os.path.realpath(__file__))  # //当前路径
        except Exception as e:
            FILE_PATH = os.getcwd()
        return FILE_PATH


class DateEncoder(json.JSONEncoder):  
    """ js自定义解析 """
    def default(self, obj):  
        if isinstance(obj, datetime.datetime):  
            return obj.strftime('%Y-%m-%d %H:%M:%S')  
        elif isinstance(obj, datetime.date):  
            return obj.strftime("%Y-%m-%d")  
        elif  isinstance(obj,decimal.Decimal): 
             return float(obj)  
        else:  
            return json.JSONEncoder.default(self, obj)  

def datetime_parser(dct):
    """ 时间解析 load datatime parser """
    for k, v in dct.items():
        if isinstance(v, str) :
            if re.search("\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}", v):
                try:
                    dct[k] =  datetime.datetime.strptime(v, '%Y-%m-%dT%H:%M:%S')
                except:
                    pass
            if re.search("\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}", v):
                try:
                    dct[k] =  datetime.datetime.strptime(v, '%Y-%m-%d %H:%M:%S')
                except:
                    pass
            if re.search("^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$", v):
                try:
                    dct[k] =  datetime.datetime.strptime(v, '%Y-%m-%d %H:%M:%S')
                except:
                    pass
            if re.search("^\d{4}-\d{2}-\d{2}$", v):
                try:
                    dct[k] =  datetime.datetime.strptime(v, '%Y-%m-%d').date()
                except:
                    pass    
    return dct
# ----
class BaseHandler(tornado.web.RequestHandler):
    """解决JS跨域请求问题"""

    def set_default_headers(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE')
        self.set_header('Access-Control-Allow-Headers', 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type')
        self.set_header('Content-type', 'application/json')
        self.set_header("Access-Control-Allow-Credentials", "true")
 
    def options(self ,*args):
        #返回方法1
        self.set_status(204)
        self.finish()
 


# 用来响应用户请求
class JsonApiHandler(BaseHandler):
    """ 远程api调用数据库处理"""
    def get(self, *args, **kwargs):
        """ get请求  列表初始化"""
        result = {
            "args": args,
            '@code': 200
        }
        try:
            if args and args[0][:4] == 'load':
                """ 重新载入表结构 """
                result = self._load()
        except Exception as e:
            tb_str = traceback.format_exc()
            result["@code"] = 400
            result["@msg"] = tb_str
            
        else:
            result["@code"] = 200
            result["@msg"] = "success"
        #--返回数据
        result = json.dumps(result, ensure_ascii=False,cls=DateEncoder)
        # self.write(json.dumps(result, ensure_ascii=False))
        self.finish(result)
 

    def post(self, *args, **kwargs):
        """  都是post提交，
        json api 请求
        """
        result = OrderedDict()
        result["@code"] = 200
        result["@msg"] = "success"
        #print(self.request.body)
        body = self.request.body.decode('utf8')
        try:
            result["@err"] = "请求数据为空" if not body else None
            metadata = json.loads(body,  object_hook=datetime_parser)
            if gm.cfg.get('db.ro'):     
                result["@err"] = 'db readonly'
                result["@code"] = 450            
            print('收到==',args[0],metadata)
            
            if args and args[0][:3] == 'get':
                result = self._get(metadata)
                result["@err"] = ''
                result["@code"] = 200
                result["@msg"] = '读取完成'
            else:
                if not gm.cfg.get('db.ro'):
                    if args and args[0][:4] == 'post'  :
                        result = self._post(metadata)
                    if args and args[0][:3] == 'del'  :
                        result = self._del(metadata)
                    if args and args[0][:3] == 'put'  :
                        result = self._put(metadata)
                    result["@err"] = ''
                    result["@code"] = 200
                    result["@msg"] = '修改成功'
            
                
            if not args[0] :
                result = {"args":"empty"}
                result["@code"] = 410
                result["@msg"] = '请求参数为空'

        except Exception as e:
            tb_str = traceback.format_exc()
            result["@code"] = 400
            result["@err"] = str(e)
            result["@msg"] = tb_str
            logger.error('错误 %s 详情： %s \ndata:%s'%(e,tb_str,body) )
 

        
        #-----返回
        result = json.dumps(result, ensure_ascii=False,cls=DateEncoder)
        # self.write(json.dumps(result, ensure_ascii=False))
        self.finish(result)

    def _post(self, dc):
        """ 插入 """
        return ja.post(dc)

    def _del(self, dc):
        """ 删除 """
        return ja.delete(dc)
    def _put(self, dc):
        """ 更新 """
        return ja.put(dc)
    
    def _get(self, dc):
        """ 查询 """
        return ja.get(dc)

    def _load(self):
        """ 重载表结构 """
        ja._load()
        return {"tables":list(ja.tables)}


class engHandler(BaseHandler):
    """ 默认处理  
     

    """

    def get(self, *args, **kwargs):
        """ 尝试读取文件 如果不存在就404
        var url = "http://127.0.0.1:2028/eng/make";
        """
        result = OrderedDict()
        result["@code"] = 200
        result["@msg"] = "success"
        
      
        logger.info(args)
        try:
   

            if not args[0] or args[0]== '/':
                result["@msg"] = "args empty" 
                result["@code"] = 301


 
        except Exception as e:
            tb_str = traceback.format_exc()
            result["@code"] = 400
            result["@err"] = result.get("@err")  if result.get("@err")   else tb_str  
            result["@msg"] = result.get("@msg")  if result.get("@msg")   else str(e)
             
    
        self.finish(json.dumps(result, ensure_ascii=False,cls=DateEncoder))


    def post(self, *args, **kwargs):
        result = OrderedDict()
        result["@code"] = 200
        result["@msg"] = "success"

        try:
            body = self.request.body.decode('utf8')
            logger.info("args={},body={}".format(args,body))
            metadata = json.loads(body,  object_hook=datetime_parser)
            import make2row as mr
            print('收到==',args[0],metadata)
            if args  and args[0]  == 'make':
                #生成音频
                filename = mr.mkone(metadata,os.path.join(FILE_PATH,metadata['dir']))
                result["@msg"] = "完成  '{}' ".format(filename)
            if args  and args[0]  == 'mkimg':
                #生成 音标图
                mr.mkphimg(metadata,os.path.join(FILE_PATH,metadata['dir']))
                result["@msg"] = '完成'

            if args  and args[0]  == 'getph':
                #获取音标
                ls = mr.getPh(metadata['en'])
                result["data"] = {metadata['en']:ls}
                result["@msg"] = '完成'



            if not args[0] or args[0]== '/':
                result["@msg"] = "args empty" 
                result["@code"] = 301


 
        except Exception as e:
            tb_str = traceback.format_exc()
            result["@code"] = 400
            result["@err"] = result.get("@err")  if result.get("@err")   else tb_str  
            result["@msg"] = result.get("@msg")  if result.get("@msg")   else str(e)
             
    
        self.finish(json.dumps(result, ensure_ascii=False,cls=DateEncoder))


 

def run_main(cfg={}):
    """ 启动入口 載入配置"""

    # --路由
    handlers = [
        (r"/jsonapi/(.*)", JsonApiHandler)  # //首页，入口
        ,(r"/camb_word/(.*)",StaticFileHandler,{"path":os.path.join(FILE_PATH, "camb_word"), "default_filename":"index.html"})
        ,(r"/en500word/(.*)",StaticFileHandler,{"path":os.path.join(FILE_PATH, "en500word") })
        , (r"/eng/(.*)", engHandler)  
         ,(r"/(.*)",StaticFileHandler,{"path":FILE_PATH , "default_filename":"index.html"})  
        # ----
        
    ]
    # --服务器设置
    settings = {
        "template_path": os.path.join(FILE_PATH, template_root),  # //模板路径  // {% raw %}   {% endraw %}
        "static_path": os.path.join(FILE_PATH, static_root),  # //静态文件
        "static_url_prefix": "/" + static_root + "/",
        "cookie_secret": 'urnqS8z4RB6CENU',  # //加密cookie的 公钥
        "debug": True,
    }
    # --配置路由
    app = tornado.web.Application(handlers, **settings)
    # --监听端口
    bind_port = cfg.get('webPort') if cfg.get('webPort') else 2028
    print(u' %s ' % (u'web服务启动 http://127.0.0.1:%s' % (bind_port)))
    app.listen(bind_port)
    app.settings.setdefault('serve_traceback', False)
    # print(app.settings)
    # -- https
    # https_server = tornado.httpserver.HTTPServer(app, ssl_options={
    #     "certfile": os.path.join(FILE_PATH, "mycert.pem"),
    #     "keyfile": os.path.join(FILE_PATH, "mykey.key"),
    #  })
    # https_server.listen(bind_port - 1)  # https://127.0.0.1:8088
    # print(u' %s ' % (u'web服务启动 https://127.0.0.1:%s' % (bind_port - 1)))
    # --循环接收
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    # 第一步，创建一个日志器
    if len(sys.argv) > 1:
        conf_file = sys.argv[1]
    else:
        conf_file ='web-cfg.json' 
        
    # create logger
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    logger = logging.getLogger('mylog')
    logger.setLevel(logging.DEBUG)
    ch = logging.StreamHandler()
    ch.setFormatter(formatter)
    logger.addHandler(ch) 

    gm.cfg = gm.load_cfg(conf_file)
    logger.info(' %s ' % (gm.cfg))
    # //----- 长时间运行
    ja = jsonapi.JosnApi(gm.cfg.get('db'),gm.cfg.get('debug'))
    logger.info(ja.tables)
    try:
        # --循环
        pass
        run_main(gm.cfg)
    except KeyboardInterrupt as e:
        print(u" 用户手动停止了web服务 ")
