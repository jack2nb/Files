# encoding: UTF-8

"""
sql on json 用json来做简单curd
 
author:jack
email:jack2nb@qq.com


代码进化史：如非必要，勿增实体，简单好用才是王道。
数据不在孤岛，用一个平台支持数据湖
分：资源与执行
资源做缓存，执行多实例
db:[ {"name":"","uri":"" } ]
搜索功能：库.表.字段/名称/关联  
例： oa.T_USER.NAME/ID/k3c.V9_itDevInfo.userId
"""

import os,re,pickle 
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Table,MetaData,inspect   # //对象与数据绑定
from sqlalchemy import func
from collections import OrderedDict

import json
#from sqlalchemy.orm import mapper  # //表映射
#import datetime
#from datetime import date
#from sqlalchemy import Table  # //创建于加载表
#import traceback

def demo(cfg_file='cfg.json'):
    """ 根据配置返回 
    一个json的数据库操作api"""
    cfg = gm.load_cfg(cfg_file)
    return JosnApi(cfg['db'],True)



class gm():
    """  静态全局类
        存放一些参数变量，避免全局冲突
    """
    conf = {}  # 配置
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




class JosnApi():
    """只操作单库表"""
    tables = []

    def __init__(self, conn_str, debug=False,mod_path='./tab'):
        """  接受數據鏈接   配置 """
        
        
        self.debug = True if  debug in [1,True,'true'] else  False
        self.db_engine = self._conn(conn_str ,self.debug)
        models = self._check_model('db.check') #//读取缓存
        if models is None:
            self.models = self._load(self.db_engine)#//载入表 
            self._check_model('db.check',self.models,mod_path) #//写入缓存
        else :
            self.models = models
        self.session = None

    def _conn(self,conn_str,debug=False):
        """  鏈接庫 """
        db_engine = create_engine(conn_str, echo=debug)
        return  db_engine
 
    def load(self):
 
        return  self._load(self.db_engine)
    
    
    
    def _load(self,db_engine):
        """" 载入 数据库表 
        资源载入
        @return {"table_name":Table}
        """
        
        models = {}
        metadata = MetaData()
        #metadata.reflect(bind=self.db_engine) #可能非常慢
        insp = inspect(db_engine)
        tables = insp.get_table_names()# 所有表名

        for t in tables:
            find = re.search('^tmp|^temp', t, re.IGNORECASE)
            if find:
                print ('跳过“{}”表'.format(t))
                continue
            #//映射模型
            tab = Table(t, metadata ,  autoload_with=db_engine) 
            models[t] = tab # 手动添加
            print("表 {} ".format(t) )
        #insp.get_columns('T_BD_STAFF_L')
        #self.models = metadata.tables  # 获取所有的表对象
        self.tables = tables #metadata.tables.keys()  # 获取所有的表名
        return  models
    
    def _load_one(self,db_engine,t):
        """" 创建一个表model """
        metadata = MetaData()
        tab = Table(t, metadata ,  autoload_with=db_engine)
        return tab

    def _check_model(self,name,models=None,mod_path='./tab'):
        """ 缓存get/set 一个数据库一个模型缓存文件
        @parma name :str  dbname
        @parma models :{table_name : Table } 模型合集
        @parma mod_path :str  dir path
        缓存models模块 加速启动
        """
        if not os.path.exists(mod_path):
            os.makedirs(mod_path)
        mod_file = os.path.join(mod_path,name)
        if models is None:
            # get
            #//读取缓冲模型
            if  os.path.exists(mod_file) :
                with open(mod_file, 'rb') as f:
                    try:
                        return  pickle.load(f)
                    except Exception as e:
                        logging.error('打开文件{}存在错误'.format(mod_file))
                        raise Exception(e) 
            else:
                return None
        else:
            # set
            with open(mod_file, 'wb') as f:
                pickle.dump(models, f)
                return models
 
    def _session(self,db_engine):
        """  创建/获取 一个会话"""
        if self.session:
            return self.session
        DB_Session = sessionmaker(bind=db_engine)
        return DB_Session()
    

    def get(self, json_query):
        """ 查询入口 调用 _select
        一个key查询一个表
        "tab":{},
        "tab@group":{} 别名支持一表多次查询
        通过|符号支持join 翻译 in 语法
        {
        "user": 
            {  
            "@column": "id,nickname ",
            "@limit": 4
            }
        }
        """
        # 预检先查询不需要join的表
        vn = self.prepro(json_query)
        # ------
        session = self._session(self.db_engine)
        ret_dc = {}
        #print('vn==',vn)
        for alias in vn.keys():#表循环查询
            if alias[0] in ['@','#'] :# json注解
                continue
            session.rollback()#？？
            # 需要预检
            if alias[0] == '|':
                #//关联查询
                alias  = alias[1:] #//恢复原始db/tab%xyz 名
                tab = alias.split('%')[0] # db/tab   join其他表
                model = self.models[tab]
                dc = vn['|'+alias]
                limit = dc.pop('@limit') if  dc.get('@limit') is not None else None
                page = dc.pop('@page') if  dc.get('@page') is not None else None
                order = dc.pop('@order') if  dc.get('@order') is not None else None
                rows = self._select_join(ret_dc,session, model,dc) 
                # 自己做分页排序
                ret_dc[alias] = self._order_limit(rows,limit,page,order)
                #print('order--limit',limit,page,order,dc)
            else:
                tab = alias.split('%')[0] # tab%xyz 表别名
                model = self.models[tab]
                #with Session.begin() as session:
                ret_dc[alias] = self._select(session, model, vn[alias])
            
        return ret_dc
    
    def _order_limit(self,rows,limit,page,order):
        """  排序加limit
        @param limit : number
        @param page :number
        """
        # print('type：：',type(rows))
        # rows = list(rows)
        if order is not None:
            col = order[1:]
            rows.sort(key=lambda r: r[col])
            if order[0] == '-':
                rows.reverse()
        if page is None or page<0:
            page = 0 
        if limit is not None:
            start = limit * page
            end  = start+limit
            rows = rows[start:end]
            #print('==========================',start,end,order )
        return  rows

    def prepro(self,vn):
        """ 预处理 先创建一个list 更具list顺序重排dict
        @param vm:json
        @return json
            "|tab": {
                "abc|":"tab.id"
            }
        """
        vn = OrderedDict(vn)
        key_ls = list(vn.keys() )
        for k in list( vn.keys()):
            col,rpoint = self._get_join(vn[k])
            if rpoint:
                t2c = rpoint.split('.')
                key_ls.remove(k)#//删除
                ikey = t2c[0] if  t2c[0] in key_ls else ( '|'+t2c[0]) if ('|'+t2c[0]) in key_ls else None
                idx = key_ls.index(ikey)#//查找( 引用的表名找不到)
                key_ls.insert(idx+1,'|'+k)#//插入
                # dict key改名
                vn['|'+k] = vn.pop(k)
        return  vn

    def _get_join(self,dc):
        """ 返回第一个  k、v 
        @param dc :json
            {
            "abc|":"tab.id"
            }
        @return abc,tab.id
        """
        col=None
        tabcol=None
        for key in dc :
            if key[-1] == '|':
                tabcol = dc.get(key)#//@取出 带|结尾的 user.id
                col = key[0:-1] #//本表字段
                break #//找到即停
        return col,tabcol

    def _select_join(self, rdc,session, model, dc):
        """ 多次查询  ,分次in通过select
        @param rdc:{"key"[{row}]}
        @param session 
        @param model
        @param dc: {key:val} 
        ret_dc : 已经完成的书记集
        {
            "colxyz|":"tab.id"
            ,"edf|":"t3.id"
        }
        @return []
        返回计算后的结果
      
        """
        col,tabcol = self._get_join(dc) # 获取带'|'的键值对
        dc.pop(col+'|') #//删除join段
        #print('join1==',col,tabcol,dc)
        # @翻译
        tcls = tabcol.split('.')
        rtab = tcls[0]
        rcol = tcls[1] #//引用表字段
        tab_rows = rdc[rtab] #//引用表数据，去重
        #print('error==',tab_rows,rcol,ret_dc) 
        dat =  [row[rcol] for row in tab_rows] #//取出被in的数据[1,2,3]
        dat = list(set(dat))#//去重 
        if len(dat) == 0:   
            return []  
        #----多次查询 sql长度  
        ret_ls = []
        in_ls = []
        ls_len = 0 
        add = []  
        for s in dat:
            if  dat[-1] == s: # 是否最后一个
                in_ls.append(s) #条件条件到in数组中
                dc[col+'#']  = in_ls#@ 送回
                #print('最后一个',dc)
                add = self._select(session, model, dc)# 按in查询
                ret_ls.extend( add ) if len(add) else None
            else:
                ls_len = ls_len + len(str(s))
                if ls_len >= 800: # 加入后超长了
                    dc[col+'#']  = in_ls#@ 送回
                    #print('加入后超长了',dc)
                    add = self._select(session, model, dc)
                    ret_ls.extend( add ) if len(add) else None
                    in_ls = [s] #添加
                    ls_len = len(str(s))
                else:
                    in_ls.append(s) #添加
        #多次in
        ret_ls = self._local_in(rdc,ret_ls,dc)
        return ret_ls
    
    def _local_in(self,rdc,ret_ls,dc):
        """  2次join   """
        col,tabcol = self._get_join(dc) # 获取带'|'的键值对
        while col:
            dc.pop(col+'|') #//删除join段
            #print('join2==',col,tabcol,dc)
            tcls = tabcol.split('.')
            rtab = tcls[0]
            rcol = tcls[1] #//引用表字段
            tab_rows = rdc[rtab] #//引用表数据，去重
            #print('error==',tab_rows,rcol,ret_dc) 
            dat =  [row[rcol] for row in tab_rows] #//取出被in的数据[1,2,3]
            dat = list(set(dat))#//去重 
            if len(dat) == 0:   
                return []  
            ret_ls = [  row  for row in  ret_ls if row[col] in dat ]  #本地筛选              
            col,tabcol = self._get_join(dc) # 二次循环
            
        return  ret_ls

        
    def _select(self, session, model, dc):
        """  单一单表查询  
            "@column": "id,date.日期,user_id" 需要显示的字段 不指定字段就是 * 
            "@order": "-date" 降序排序
            "@limit": 5  返回5条
            "@page": 2  第二页
            "@group": 'user_id'  简单分组           
        """
        #  ----字段
        q = self._column(session, model, dc) #//开始一个查询
        # ----条件
        q = self._where(q, model, dc)
        # ---分组
        q = self._group(q, model, dc) 
        # ---排序
        q = self._order(q, model, dc)
        # ---查询并返回
        q = self._limit(q, dc)
        req = q # 无事务查询
        #print('req==',req,type(req))
        keys = [ row['name'] for row in  req.column_descriptions] #v1.4
        #req = session.execute(q) #//生成一个事务
        #keys = req.mappings().keys()# v1.4
        return [dict(zip(keys, row)) for row in req]


    def to_number(self, val):
        """ 转换数字"""
        try:
            val = float(val)
            return val
        except Exception as e:
            return val

    def _eq(self, q, model, col, val):
        """  数字判断大于小于 !=  ,<= ,>= ,< ,>  区分字符串和数字 """
        val = val.strip()
        if val[0:2] == '!=':
            q = q.filter(model.c[col] != self.to_number(val[2:]))
            return q
        if val[0:2] == '<=':
            q = q.filter(model.c[col] <= self.to_number(val[2:]))
            return q
        if val[0:2] == '>=':
            q = q.filter(model.c[col] >= self.to_number(val[2:]))
            return q
        if val[0:1] == '<':  # 多次符合
            q = q.filter(model.c[col] < self.to_number(val[1:]))
        if val[0:1] == '>':
            q = q.filter(model.c[col] > self.to_number(val[1:]))
        return q

    def _eq_col(self, q, model, col, val):
        """  字段判断大于小于 !=  ,<= ,>= ,< ,>  另一个字段 """
        val = val.strip()
        if val[0:2] == '!=':
            q = q.filter(model.c[col] != model.c[val[2:]])
            return q
        if val[0:2] == '<=':
            q = q.filter(model.c[col] <= model.c[val[2:]])
            return q
        if val[0:2] == '>=':
            q = q.filter(model.c[col] >= model.c[val[2:]])
            return q
        if val[0:1] == '<':  # 多次符合
            q = q.filter(model.c[col] < model.c[val[1:]])
        if val[0:1] == '>':
            q = q.filter(model.c[col] > model.c[val[1:]])
        return q

    def _where_adv(self, q, model, col, val):
        """ 特殊条件处理 """
        if col[-1] == '#':  # in 条件
            q = q.filter(model.c[col[0:-1]].in_(val))
        if col[-1] == '*':  # like
            q = q.filter(model.c[col[0:-1]].like(val))
        if col[-1] == '&':  # and 大于小于 
            for v in val.split(','):
                q = self._eq(q, model, col[0:-1], v)
        if col[-1] == '^':  # and  字段大于小于 
            for v in val.split(','):
                q = self._eq_col(q, model, col[0:-1], v)
        if col[-1] == '$':  #  is null 
            if  val :
                q = q.filter(model.c[col[0:-1]].isnot(None))
            else :
                q = q.filter(model.c[col[0:-1]].is_(None))
        return q

    def _where(self, q, model, dc):
        """ 条件添加 
        "@syntax":"语法符号"

        "col#":[1, 2, 3] #"代表in"   
        "col*":"abc%"  #"代表like"
        "col&":">123"  #"代表and"  ">1,<=9,!=5"
        "col^":"cola"  #"代表and"  "col > cola"
        ----需要转换分批查询合并
        "col|":"tabx.ccc"  #"类似于"  "col in [ select ccc from tabx ] "
        
        """
        for col in dc.keys():
            val = dc[col]
            if val is None:
                continue
            # 开头--查找指令 （忽略）
            if col[0] in ['@','#' ]:
                continue
            # 结尾--查询条件
            if col[-1] in ['#', '*',  '&', '^','|','$']:
                q = self._where_adv(q, model, col, val)
                continue
            # //累加条件
            q = q.filter(model.c[col] == val)
        return q


    def _limit(self, q, dc):
        """  限制
            @limit:4,
            @page:0,
        """
        # 返回行数
        count = dc.get('@limit')
        if count is None:
            return q
        q = q.limit(count)
        # 起始行
        page = dc.get('@page')
        if page is not None:
            if page == 0:
                offset = 0
            else:
                offset = page * count
            q = q.offset(offset)
        return q

    def _order(self, q, model, dc):
        """ 排序 @order ：+-col """
        order = dc.get('@order')
        if order is None:
            return q
        # ----排序
        if order[0] == '+':
            q = q.order_by(model.c[order[1:]].asc())
        if order[0] == '-':
            q = q.order_by(model.c[order[1:]].desc())
        if order[0] not in ['-', '+']:
            q = q.order_by(model.c[order].asc())
        return q

    def _column(self, session, model, dc):
        """  指定字段 @column:'id,name' """

        column = dc.get('@column')
        #column = column.replace(' ','') if column else column #//去空格
        #//column.replace(' ','') #//去空格
        q = session.query(model)#//开始一个查询
        if column is None:
            return q
        column.replace(' ','') #//去空格
        columns = column.split(',')
        # --自定字段
        fields = []
        for c in columns:
            fields.append(self.column_plus(c,model))
        q = q.with_entities(*fields)
        return q
    
    def column_plus(self,col,model):
        """  字段 换函数功能  
        col:字段名  [name,name.n,name.count.ct]

        """
        if  not '.' in  col:#不含扩展
            return model.c[col.strip()]

        funs = {"sum":func.sum,"count":func.count,"max":func.max,"min":func.min }
        columns = col.split('.')#len>2
        if len(columns) == 3 and funs.get(columns[1].strip()) :
            if funs[columns[1].strip()]:
                fn = funs[columns[1].strip()]
            return  fn( model.c[columns[0].strip()]   ).label(columns[2].strip())
        if len(columns) == 2: #//普通别名 as
            return   model.c[columns[0].strip()].label(columns[1].strip())   
        
        return model.c[columns[0].strip()] 

    def _group(self, q, model, dc):
        """  分组 """
        group = dc.get('@group')
        
        if group is None:
            return q
        q = q.group_by( model.c[group] )
        # having分组未实现
        return  q
    
    def delete(self, json_query):
        """  删除入口 
            {
            "user": {
                "id": 7
                }
            }
        """
        
        ret_dc = {}
        # ----
        vn = json_query
        session = self._session(self.db_engine)
        for tab in vn.keys():
            if tab[0] in ['@', '#']:
                continue
            ## 选择资源进行处理
            model = self.models[tab]
            
            ret_dc[tab] = self._del(session, model, vn[tab])
        return ret_dc
    
    def post(self, json_query):
        """ 插入入口 
         {"user":{
            "name":"jack"
            ,"email":"jack@demo.com"
            }
        }

        一次请求一个事务
        """
        vn = json_query
        # ------
        ret_dc = {}
        for tab in vn.keys():
            if tab[0] in ['@', '#']:
                continue
            model = self.models[tab]
            db_engine = self.db_engine
            ret_dc[tab] = self._insert(db_engine,model, vn[tab])
        return ret_dc


    def put(self, json_query):
        """  更新入口 
            {
                "user": {
                    "id": 8
                    "@update":{
                        "nickname":"来之 http的更新 good news"
                    }
                },
                
            }
            一次请求一个事务
        """
        session = self._session(self.db_engine)
        ret_dc = {}
        # ----
        vn = json_query
        
        for tab in vn.keys():
            if tab[0] in ['@', '#']:
                continue
            model = self.models[tab]
            ret_dc[tab] = self._update(session, model, vn[tab])
        return ret_dc
    
    def _update(self, session, model, dc):
        """  更新数据数据 
            abc=abc+11 
        """
        update = dc.pop('@update')
        # ----条件
        q = session.query(model)
        q = self._where(q, model, dc)
        
        try:
            req = q.update(update)
        except Exception as e:
            session.rollback()
            logging.error('参数{}存在错误'.format(dc))
            raise Exception(e)
        else:
            session.commit()
        return req
    

    def _insert(self,db_engine, model, dc):
        """  返回id  一条/和多条"""
        # dc = [{"username": "dddd7", "nickname": "mmmm", "email": "a@mal.com"}]
        # 会话（不会自动提交）
        with db_engine.begin() as db_conn:
            #r1 = connection.execute(table1.select())
            #connection.execute(table1.insert(), {"col1": 7, "col2": "this is some data"})
            #db_conn = db_engine.connect()
            #print('insert datat >>>>')
            result = None
            try:
                ins = model.insert().values(dc)
                result = db_conn.execute(ins)
                #print('insert datat ====',dc,result)
            except Exception as e:
                db_conn.rollback()
                raise Exception(e)
            db_conn.commit()
        #结果是元组()
        return list(result.inserted_primary_key) if result else -1 #//返回主键
    
    def _insert_one(self,db_engine, model, dc):
        """ 一条一条插入 """
        pass

    
    def _del(self, session, model, dc):
        """  删除数据 """
        q = session.query(model)
        # ----条件
        q = self._where(q, model, dc)
        try:
            req = q.delete(synchronize_session=False)
        except Exception as e:
            session.rollback()
            raise Exception(e)
            return -1
        else:
            session.commit()
        return req
    
    # def _commit(self):
    #     """ 提交 """
    #     session=self._session()
    #     session.commit()

    def test_del(self, json_query=None):
        """ 测试 删除  """
        if json_query is None:
            vn = {
                "moment": {
                    "id": 8
                }
            }
        else:
            vn = json_query
        session = self._session(self.db_engine)
        # ------
        ret_dc = {}
        for tab in vn.keys():
            model = self.models[tab]
            ret_dc[tab] = self._del(session, model, vn[tab])
        return ret_dc


    def test_post(self, json_query=None):
        """ 测试 demo  """
        if json_query is None:
            vn = {
                "moment": {
                    "content": "new moment for test",
                    "picture_list": [
                        "http://static.oschina.net/uploads/user/48/96331_50.jpg"
                    ]
                }
            }
        else:
            vn = json_query
        # ------

        ret_dc = {}
        for tab in vn.keys():
            if tab[0] in ['@', '#']:
                continue
            model = self.models[tab]
            ret_dc[tab] = self._insert(model, vn[tab])
        return ret_dc


    def test(self, json_query=None):
        """ 测试 demo"""
        if json_query is None:
            vn = {
                "moment": {
                    "@column": "id,date,user_id",
                    "@limit": 2
                }
            }
        else:
            vn = json_query
        # ------
        session = self._session(self.db_engine)
        ret_dc = {}
        for tab in vn.keys():
            model = self.models[tab]
            ret_dc[tab] = self._select(session, model, vn[tab])
        return ret_dc


class SqlOnJson(JosnApi):
    """数据操作入口  多数据库
    {
     "oa/user":{}
     "erp/order":{}
    }
    """
    dbs = {}

    def __init__(self, dbs_ls, debug=False,mod_path='./tab'):
        """  接受數據鏈接   配置
        [ {"name":"oa","uri":"xxx://ooo"} ]

        """
        self.mod_path = mod_path
        self.dbs = {}
        self.default_db = dbs_ls[0]['name'] #//默认表
        debug = True if  debug in [1,True,'true'] else  False
        #//多个数据库
        for db in dbs_ls:
            tmp = {}
            self.session = None
            tmp['engine'] = self._conn(db.get('uri'),debug)

            models = self._check_model(db.get('name')) #//读取缓存
            if models is None:
                models = self._load(tmp['engine'])
                self._check_model(db.get('name'),models,mod_path) #//存入缓存
                tmp['models'] =  models
            else:
                tmp['models'] =  models
            tmp['session'] =  self._session(tmp['engine'] )
            
            self.dbs[db.get('name')] = tmp 


    def sw_src(self,alias):
        """ 根据条件 选择资源 
          
        @param alias:str  ddbb/tab@alias
     
        @returns model,session ,engin 
        """
        dbtab_ls = alias.split('/')
        if len(dbtab_ls) == 2 :
            tab = dbtab_ls[1]
            db = dbtab_ls[0]
        else:
            tab = dbtab_ls[0]
            db = self.default_db
        src_dc = self.dbs[db]
        tab = tab.split('@')[0] #//tab@alias
        return  src_dc['models'][tab],src_dc['session'],src_dc['engine'] 
    
    def load_one(self,alias):
        """ 重载一个表 
        @parame alias : str 
        "dbx/table2"

        """
        dbtab_ls = alias.split('/')
        if len(dbtab_ls) == 2 :
            tab = dbtab_ls[1]
            db = dbtab_ls[0]
        else:
            tab = dbtab_ls[0]
            db = self.default_db
        src_dc = self.dbs[db]
        #//修改
        tab_mod = self._load_one(src_dc['engine'] ,tab)
        self.dbs[db]['models'][tab] = tab_mod
        #//保存
        #print(src_dc['engine'],db,tab,tab_mod,self.dbs[db]['models'][tab])
        self._check_model(db,self.dbs[db]['models'],self.mod_path)  
        return  alias
    
    def col_info(self,model): 
        """ 字段信息
            return [{}]
        """
        items = model.c.items ()
        return  [ {"col":col[0],"type":str(col[1].type)  } for  idx,col in  enumerate( items )]
        
    def tab_info(self,alias):
        """ 通过 db/tab 获取表信息
            return [{}]
        """
        dbtab_ls = alias.split('/')
   
        if len(dbtab_ls) == 2 :
            tab = dbtab_ls[1]
            db = dbtab_ls[0]
        else:
            tab = dbtab_ls[0]
            db = self.default_db
        model = self.dbs[db]['models'][tab]
        return self.col_info(model)

       

    def get(self, json_query):
        """ 查询入口 调用 _select
        一个key查询一个表
        "tab":{},
        "tab@group":{} 别名支持一表多次查询
        通过|符号支持join 翻译 in 语法
        {
        "user": 
            {  
            "@column": "id,nickname ",
            "@limit": 4
            }
        }
        """
        # 预检先查询不需要join的表
        vn = self.prepro(json_query)
        # ------

        ret_dc = {}
        #print('vn==',vn)
        for alias in vn.keys():#表循环
            if alias[0] in ['@', '#']:
                continue
            # 需要预检
            if alias[0] == '|':
                #//关联查询
                alias  = alias[1:] #//恢复原始tab名
                tab = alias.split('%')[0] # erp/tab%xyz 返回erp/tab
                #model = self.models[tab]
                ## 选择资源
                model,session,engine = self.sw_src(tab)
                session.rollback()#？？
                dc = vn['|'+alias]
                limit = dc.pop('@limit') if  dc.get('@limit') is not None else None
                page = dc.pop('@page') if  dc.get('@page') is not None else None
                order = dc.pop('@order') if  dc.get('@order') is not None else None
                rows = self._select_join(ret_dc,session, model,dc) 
                # 自己做分页排序
                ret_dc[alias] = self._order_limit(rows,limit,page,order)
                print('order--limit',limit,page,order,dc)


            else:
                tab = alias.split('%')[0] # tab%xyz 表别名
                #model = self.models[tab]
                #with Session.begin() as session:
                ## 选择资源
                model,session,engine = self.sw_src(tab)
                session.rollback()#？？
                ret_dc[alias] = self._select(session, model, vn[alias])
            
        return ret_dc
    
    def delete(self, json_query):
        """  删除入口 
            {
            "user": {
                "id": 7
                }
            }
        """
        
        ret_dc = {}
        # ----
        vn = json_query
        for tab in vn.keys():
            if tab[0] in ['@', '#']:
                continue
            ## 选择资源进行处理
            # 分配资源到vn，集中处理 跨数据库事务
            # session = self._session()
            model,session,engine = self.sw_src(tab)
            ret_dc[tab] = self._del(session, model, vn[tab])
        return ret_dc
    
    def post(self, json_query):
        """ 插入入口 
         {"user":{
            "name":"jack"
            ,"email":"jack@demo.com"
            }
        }
        """
        vn = json_query
        # ------
        ret_dc = {}
        for tab in vn.keys():
            if tab[0] in ['@', '#']:
                continue
            # 分配资源到vn，集中处理 跨数据库事务
            
            model,session,db_engine = self.sw_src(tab)
            ret_dc[tab] = self._insert(db_engine,model, vn[tab])
        return ret_dc


    def put(self, json_query):
        """  更新入口 
            {
                "user": {
                    "id": 8
                },
                "update":{
                    "nickname":"来之 http的更新 good news"
                }
            }
        """
        #session = self._session()
        ret_dc = {}
        # ----
        vn = json_query
        for tab in vn.keys():
            if tab[0] in ['@', '#']: #//指令或备注
                continue
            # 分配资源到vn，集中处理 跨数据库事务
            model,session,db_engine = self.sw_src(tab)
            ret_dc[tab] = self._update(session, model, vn[tab])
        return ret_dc
    



if __name__ == "__main__":
    # 第一步，创建一个日志器
    # create logger
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    logger = logging.getLogger('mylog')
    logger.setLevel(logging.DEBUG)
    ch = logging.StreamHandler()
    ch.setFormatter(formatter)
    logger.addHandler(ch)

    gm.conf = gm.load_cfg('web.json')
    # //----- 长时间运行

    try:
        # --循环
        ja = JosnApi(gm.conf['db'])
        print(ja.tables)
    except KeyboardInterrupt as e:
        print(u" 用户手动停止了web服务 ")
