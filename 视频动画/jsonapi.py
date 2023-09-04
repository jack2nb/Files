# encoding: UTF-8

"""

用json输入来做简单curd
 

http://apijson.cn/api/

代码进化史，
"""

import os,re
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
    """只操 操作单表"""
    tables = []

    def __init__(self, conn_str, debug=False):
        """  接受數據鏈接   配置 """
        self.conn_str = conn_str  # 鏈接串、
        self.debug = True if  debug in [1,True,'true'] else  False
        self._conn()
        self._load()
        self.session = None

    def _conn(self):
        """  鏈接庫"""

        self.db_engine = create_engine(self.conn_str, echo=self.debug)

    def _load(self):
        """" 载入表 """
        metadata = MetaData()
        #metadata.reflect(bind=self.db_engine) #可能非常慢
        insp = inspect(self.db_engine)
        
        for t in insp.get_table_names():
            find = re.search('^tmp', t, re.IGNORECASE)
            if find:
                print (t)
                continue
            print(t,'\n')
            Table(t, metadata ,  autoload_with=self.db_engine)
        #insp.get_columns('T_BD_STAFF_L')
        self.models = metadata.tables  # 获取所有的表对象
        self.tables = metadata.tables.keys()  # 获取所有的表名

    def _session(self):
        """  创建/获取 一个会话"""
        if self.session:
            return self.session
        DB_Session = sessionmaker(bind=self.db_engine)
        self.session = DB_Session()
        return self.session
    

    def get(self, json_query):
        """ 查询入口 调用 _select
        一个key查询一个表
        "tab":{},
        "tab@group":{} 别名支持一表多次查询
        通过|符号支持join 翻译 in 语法
        """
        # 预检先查询不需要join的表
        vn = self.prepro(json_query)
        # ------
        session = self._session()
        ret_dc = {}
        #print('vn==',vn)
        for alias in vn.keys():#表循环
            if alias[0:1] == '#':# json注解
                continue
            session.rollback()#？？
            # 需要预检
            if alias[0:1] == '|':
                #//关联查询
                alias  = alias[1:] #//恢复原始tab名
                tab = alias.split('@')[0] # !tab@xyz join其他表
                model = self.models[tab]
                ret_dc[alias] = self._select_join(ret_dc,session, model, vn['|'+alias])  
            else:
                tab = alias.split('@')[0] # tab@xyz 表别名
                model = self.models[tab]
                #with Session.begin() as session:
                ret_dc[alias] = self._select(session, model, vn[alias])
            
        return ret_dc
    
    def prepro(self,vn):
        """ 预处理 先创建一个list 更具list顺序重排dict"""
        vn = OrderedDict(vn)
        key_ls = list(vn.keys() )
        for k in list( vn.keys()):
            col,v = self._get_join(vn[k])
            if v:
                tc = v.split('.')
                key_ls.remove(k)#//删除
                ikey = tc[0] if  tc[0] in key_ls else ( '|'+tc[0]) if ('|'+tc[0]) in key_ls else None
                idx = key_ls.index(ikey)#//查找
                key_ls.insert(idx+1,'|'+k)#//插入
                # dict key改名
                vn['|'+k] = vn.pop(k)

        return  vn

    def _get_join(self,dc):
        """ 返回  k、v"""
        col=None
        tabcol=None
        for key in dc :
            if key[-1] == '|':
                tabcol = dc.get(key)#//@取出 带|结尾的 user.id
                col = key[0:-1] #//本表字段
                break #//找到即停
        return col,tabcol

    def _select_join(self, ret_dc,session, model, dc):
        """ 分次查询 
        ret_dc : 已经完成的书记集
        {"colxyz|":"tab.id"}
        返回计算后的结果
        """
        ret_ls = []
        # @翻译 | 为 join 
        col,tabcol = self._get_join(dc) # 获取带'|'的键值对
        dc.pop(col+'|') #//删除join段
        # @翻译
        tcls = tabcol.split('.')#[0]
        tab_rows = ret_dc[tcls[0]] #//引用表数据，去重
        rcol = tcls[1] #//引用表字段
        #print('error==',tab_rows,rcol,ret_dc) 
        dat =  [row[rcol] for row in tab_rows] 
        #----多次查询 sql长度  

        dat = list(set(dat))#//去重 
        if len(dat) == 0:   
            return ret_ls  
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
                if ls_len >= 400: # 加入后超长了
                    dc[col+'#']  = in_ls#@ 送回
                    #print('加入后超长了',dc)
                    add = self._select(session, model, dc)
                    ret_ls.extend( add ) if len(add) else None
                    in_ls = [s] #添加
                    ls_len = len(str(s))
                else:
                    in_ls.append(s) #添加

        return ret_ls
    
    
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
            if col[-1] in ['#', '*',  '&', '^','|']:
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
        # 分组
        having = dc.get('@having')
        if having is None:
            return q
        q = q.having( model.c[having] )

        return  q
    
    def delete(self, json_query):
        """  删除入口 调用 _del """
        session = self._session()
        ret_dc = {}
        # ----
        vn = json_query
        for tab in vn.keys():
            model = self.models[tab]
            ret_dc[tab] = self._del(session, model, vn[tab])
        return ret_dc
    
    def post(self, json_query):
        """ 插入入口 调用 _insert
        
        """
        vn = json_query
        # ------
        ret_dc = {}
        for tab in vn.keys():
            if tab[0] in ['@', '#']:
                continue
            model = self.models[tab]
            ret_dc[tab] = self._insert(model, vn[tab])
        return ret_dc


    def put(self, json_query):
        """  更新入口 调用 _update """
        session = self._session()
        ret_dc = {}
        # ----
        vn = json_query
        update = json_query.pop('update')
        for tab in vn.keys():
            model = self.models[tab]
            ret_dc[tab] = self._update(session, model, vn[tab],update)
        return ret_dc
    
    def _update(self, session, model, dc,update):
        """  更新数据数据 """
        q = session.query(model)
        # ----条件
        q = self._where(q, model, dc)
        try:
            req = q.update(update)
        except Exception as e:
            session.rollback()
            raise Exception(e)
            return -1
        else:
            session.commit()
        return req
    

    def _insert(self, model, dc):
        """  返回id  一条/和多条"""
        # dc = [{"username": "dddd7", "nickname": "mmmm", "email": "a@mal.com"}]
        # 会话（不会自动提交）
        with self.db_engine.begin() as db_conn:
            #r1 = connection.execute(table1.select())
            #connection.execute(table1.insert(), {"col1": 7, "col2": "this is some data"})
            db_conn = self.db_engine.connect()
            ins = model.insert().values(dc)
            result = None
            try:
                result = db_conn.execute(ins)
                db_conn.commit()
            except Exception as e:
                db_conn.rollback()
                raise Exception(e)
        #结果是元组()
        return list(result.inserted_primary_key) if result else -1

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
        session = self._session()
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
        session = self._session()
        ret_dc = {}
        for tab in vn.keys():
            model = self.models[tab]
            ret_dc[tab] = self._select(session, model, vn[tab])
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
