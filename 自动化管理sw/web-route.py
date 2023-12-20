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
 




 

import  route_admin 

cfgs = route_admin.readCfg('./route_config.json')
wrt = route_admin.wrtRoute(cfgs )
re_ip = '^(((25[0-5])|(2[0-4]\d)|(1\d{1,2})|(\d{1,2}))\.){3}((25[0-5])|(2[0-4]\d)|(1\d{1,2})|(\d{1,2}))$'
class routeHandler(BaseHandler):
    """ 路由系统
    专属主页
    /route/arp/#所有ip对应mac
    /route/up/?ip=192.168.20.220#允许上网
    /route/down/?ip=192.168.20.220#退出上网


    /route/list/#所有可上网用户
    /route/rule/#拦截规则
        /route/white/#白名单 目标来源
    /route/reload/#重载规则
    /route/clear/#清除规则
    /route/reuser/#重置所有用户验证

    """

    def get(self, *args, **kwargs):
        """ 尝试读取文件 如果不存在就404
        var url = "http://127.0.0.1:2028/route/mac";

        """
        result = OrderedDict()
        result["@code"] = 200
        result["@msg"] = "success"
        
        
        logger.info(args)
        try:
            if not args[0] or args[0]== '/':
                result["@msg"] = "args empty" 
                result["@code"] = 301

            if  args[0]== 'arp/':
                result['data'] = wrt.arp()
 
            if  args[0]== 'list/':
                result['data'] = wrt.gerRules( 'localManage')

            if  args[0]== 'rule/':
                result['data'] = wrt.gerRules( 'localDef')
 
 
            if  args[0]== 'reload/':
                result['data'] = wrt.reload(  )
            if  args[0]== 'clear/':
                result['data'] = wrt.clear(  )
            if  args[0]== 'reuser/':
                result['data'] = wrt.resetUser(  )

            if  args[0]== 'up/':
                pass
                ip = self.get_argument('ip')
                e = re.search (re_ip,ip)
                if e :
                    result['data'] = wrt.ipLogin( e[0])
                else:
                    result["@msg"] = "ip 有误" 
                    result["@code"] = 500

            if  args[0]== 'down/':
                pass
                ip = self.get_argument('ip')
                e = re.search (re_ip,ip)
                if e :
                    result['data'] = wrt.ipLoguot( e[0])
                else:
                    result["@msg"] = "ip 有误" 
                    result["@code"] = 500


        except Exception as e:
            tb_str = traceback.format_exc()
            result["@code"] = 400
            result["@err"] = tb_str if tb_str else result.get("@err")
            result["@msg"] = str(e) if str(e) else result.get("@msg") 
        self.finish(json.dumps(result, ensure_ascii=False,cls=DateEncoder))

 

class InfoHandler(BaseHandler):
    def get(self, *args, **kwargs):
        
        print('info args', args)

        if args  and args[0]  == 'ip':
            self.write(self._ip())

        if args  and args[0]  == 'datetime':
            self.write(self._datetime())

    def _datetime(self):
        return  datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')


    def _ip(self):
        remote_ip = self.request.headers.get("X-Real-Ip", "")
        print('ip', self.request.remote_ip,remote_ip)
        return  self.request.remote_ip



def write_error(self, stat, **kw):
    self.write('访问url {} 不存在!'.format(  self.request.uri ))
tornado.web.RequestHandler.write_error = write_error
 

def run_main(cfg={}):
    """ 启动入口 載入配置"""

    # --路由
    handlers = [
        # (r"/jsonapi/(.*)", JsonApiHandler)  # //首页，入口
        # ,(r"/camb_word/(.*)",StaticFileHandler,{"path":os.path.join(FILE_PATH, "camb_word"), "default_filename":"index.html"})
        # ,(r"/en500word/(.*)",StaticFileHandler,{"path":os.path.join(FILE_PATH, "en500word") })
         
         (r"/info/(.*)",InfoHandler )
        , (r"/route/(.*)", routeHandler)  
         ,(r"/(.*)",StaticFileHandler,{"path":FILE_PATH , "default_filename":"v/index.html"})  
          
        # ----
        
    ]
    # --服务器设置
    settings = {
        "template_path": os.path.join(FILE_PATH, template_root),  # //模板路径  // {% raw %}   {% endraw %}
        "static_path": os.path.join(FILE_PATH, static_root),  # //静态文件
        "static_url_prefix": "/" + static_root + "/",
        "cookie_secret": 'urnqS8z4RB6CENU',  # //加密cookie的 公钥
        "debug": True 
       
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
        conf_file ='web-route.json' 
        
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
    try:
        # --循环
        pass
        run_main(gm.cfg)
    except KeyboardInterrupt as e:
        print(u" 用户手动停止了web服务 ")
