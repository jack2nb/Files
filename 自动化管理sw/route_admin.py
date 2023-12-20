"""
用python 获取环境路由器，管理上网
先限制(localDef)后放开(localManage)

1 检查两条链是不是存在  localDef/localManage
2 这两条连是不是加入到  PREROUTING


3 通过配置设置localDef链，先清空后设置
4 用户登入放行localManage链，每日清空




"""
from fabric import Connection  # pip install  fabric==2.6
from textfsm import TextFSM
import re,json




def readCfg(filename):
    """读取配置文件"""
    # 读取json文件内容,返回字典格式
    json_data = {}
    with open(filename,'r',encoding='utf8')as fp:
        json_data = json.load(fp)
    return json_data



class wrtRoute:
    """ wrt路由器
    管理
    自定义链 ： localDef/localManage

    """
    def __init__(self,cfg):
        """ """
        self.__cfg = cfg.pop('主路由器')
        self.cfg = cfg #无密码
        self.conn = None
        self.conn = self.login(self.__cfg) #连接
        self.localDef = 'localDef'
        self.localManage = 'localManage'
    
        self.checkMain()#//创建或检查默认定义的链
        
    def _getCfg(self):
        """
        """
        return self.__cfg 
    
    def login(self,cfg=None):
        """登入路由器 返回 链接 """
        cfg = cfg if cfg is not None else self._getCfg()
        set_time_oute = cfg.get('connect_timeout') if  cfg.get('connect_timeout') is not None else 5 
        try:
            # paramiko known_hosts 或  pip3 install paramiko -U  # pip3 install paramiko==2.8.0
 
            conn = Connection(cfg['host'],cfg['user'],cfg['port']
                              , connect_kwargs=cfg['connect_kwargs']
                            ,connect_timeout=set_time_oute )
            result =conn.run(' uname -n', hide=True)
            print(result.stdout)
        except Exception as e:
            print(u" 连接主机出现问题 跳过  %s" % (e))
        self.conn = conn
        return conn
    
    def logout(self):
        """  关闭连接 """
        if self.conn is not  None:
            self.conn.close()
        self.conn=None

    def _toRun(self,cmd,conn=None):
        """ 核心执行 """
        conn = conn if conn is not None else self.conn
        conn = conn if conn is not None else self.login() #自动连接
        result =  conn.run( cmd , hide=True)   #执行命令 allow_agent=False,look_for_keys=False
        print(cmd,'==\n',result. stdout) #loger
        return result

    def _gerRules(self,chain="PREROUTING",conn=None):
        """ 获取iptables """
        cmd = " iptables -t nat -L {} --line-numbers ".format(chain)
        result =  self._toRun(cmd,conn)   #--获取卡信息
        return result.stdout

    def gerRules(self,chain="PREROUTING",conn=None):
        """  获取所有 nat  PREROUTING 规则 """
        stdout = self._gerRules(chain,conn)
        rules = self._rules2rows(stdout)
        return rules 
    
    def _rules2rows(self,tabStr,tpl="iptables-rule.template"):
        """  转换 """
        f = open(tpl)
        template = TextFSM(f)
        outTab = template.ParseText(tabStr)
        #print(outTab)
        outTab = [ dict(zip(["num","target",'prot','opt','source','destination','other'],r)) for r in outTab ]
        return  outTab
    
    def gerChain(self,conn=None):
        """  获取所有 nat  PREROUTING 规则 """
        stdout = self._gerRules('',conn)
        rules = self._chain2rows(stdout)
        return rules 
    
    def _chain2rows(self,tabStr,tpl="iptables-chain.template"):
        """  转换 """
        f = open(tpl)
        template = TextFSM(f)
        outTab = template.ParseText(tabStr)
        #print(outTab)
        outTab = [ dict(zip(["chain" ],r)) for r in outTab ]
        return  outTab
    
    def arp(self,conn=None):
        """  获取ip和mac"""
        cmd = " ip neigh show "
        result =  self._toRun(cmd,conn)   #--获取卡信息
        tabStr = result.stdout
        tpl = 'iptables-arp.template'
        #--处理字符串
        f = open(tpl)
        template = TextFSM(f)
        outTab = template.ParseText(tabStr)
        #print(outTab)
        outTab = [ dict(zip(["ip","dev","mac" ],r)) for r in outTab ]
        
        return outTab

    def checkMain(self):
        """ 初始建立自定义规则
        PREROUTING下是否包含 ['localDef','localManage' ]
            1,2 条  
        """
        rules = self.gerRules('PREROUTING')
        chains = self.gerChain( )
        chainsLs = [ r['chain'] for r in  chains ]
        #先后顺序 非常关键
        for chain in ['localDef','localManage']:
            # localDef
            rulesId = [ r['num'] for r in rules if  r['target'] == chain  ]
            if chain not in chainsLs:
                #没有需要 添加
                self._addMain(chain)
            if len(rulesId) == 0 :
                #没有需要加入PREROUTING
                self._setMain(chain)
        self.logout()
        
                
      

    def _setMain(self,chain):
        """  设置 加入链到  PREROUTING """
        cmd = " iptables -t nat -I PREROUTING   -j {}   ".format(chain)
        self._toRun(cmd)


    def _addMain(self,chain):
        """   创建链  """
        cmd = "iptables -t nat  -N {} ".format(chain)
        self._toRun(cmd)


    def _delLocalDef(self):
        """ 删除默认规则 """
        chainName  = 'localDef'
        rules = self.gerRules(chainName)
        rules = list(reversed(rules))
        for r in rules:
            cmd = " iptables -t nat -D {}  {} ".format(chainName,r['num'])
            self._toRun(cmd)


    def _delManageDef(self):
        """ 删除用户规则 """
        chainName  = 'localManage'
        rules = self.gerRules(chainName)
        rules = list(reversed(rules))
        for r in rules:
            cmd = " iptables -t nat -D {}  {} ".format(chainName,r['num'])
            self._toRun(cmd)

    def clear(self ):
        """ 清除规则 localDef"""

        self._delLocalDef()
        self.logout()


    def reload(self,cfg=None):
        """ 目标白名单/来源白名单 设置到 localDef"""
        self._delLocalDef()
        cfg = cfg if cfg is not None else self.cfg
        print('cfg=',cfg)
        ls = cfg.get('目标白名单') if cfg.get('目标白名单') is not None else []
        for i in ls:
            cmd = "iptables -t nat -I localDef  -d  {} -j ACCEPT ".format(i)
            self._toRun(cmd)
        ls = cfg.get('来源白名单') if cfg.get('来源白名单') is not None else []
        for i in ls:
            cmd = "iptables -t nat -I localDef  -s  {} -j ACCEPT ".format(i)
            self._toRun(cmd)
        ls = cfg.get('拦截tcp端口') if cfg.get('拦截tcp端口') is not None else []
        for dc in ls:
            port = list(dc.keys())[0]
            val = list( dc.values())[0]
            cmd = "iptables -t nat -A localDef -p tcp --dport {} -j DNAT --to-destination {} ".format(port,val)
            self._toRun(cmd)
        ls = cfg.get('拦截udp端口') if cfg.get('拦截udp端口') is not None else []
        for dc in ls:
            port = list(dc.keys())[0]
            val = list( dc.values())[0]
            cmd = "iptables -t nat -A localDef -p udp --dport {} -j DNAT --to-destination {} ".format(port,val)
            self._toRun(cmd)

        self.logout()






    #-----------业务



    def _delIpRules(self,rules,ip,act='ACCEPT',dst='anywhere'):
        """ ip,ACCEPT source
            ip ，动作，来源
            iptables -t nat -D localManage  -s 192.168.20.222 -j ACCEPT
        """
        chainName  = 'localManage'
        rulesId = [ r['num'] for r in rules if  r['target'] == 'ACCEPT' and r['source'] == ip and   r['destination'] ==  dst ]
        rulesCmd = [ 'iptables -t nat -D {}  -s {} -j {}'.format(chainName,ip,act) for r in rulesId   ]
        return rulesCmd
        
    def _addIpRules(self,ip,act='ACCEPT' ):
        """ ip,ACCEPT source
            ip ，动作，来源
            iptables -t nat -D localManage  -s 192.168.20.222 -j ACCEPT
        """
        chainName  = 'localManage'
        ruleCmd =  'iptables -t nat -I {}  -s {} -j {}'.format(chainName,ip,act)  
            
        return ruleCmd
        
        
    def ipLogin(self,ip):
        """ 客户端放行 """
        cmd = self._addIpRules(ip)
        self._toRun(cmd ) 
        self.logout()
        return  ip


    def ipLoguot(self,ip):
        """ 客户端退出 """
        chainName  = 'localManage'
        rules = self.gerRules(chainName)
        rulesCmd = self._delIpRules(rules,ip)
        for cmd in rulesCmd:
            self._toRun(cmd ) 
        self.logout()
        return  ip

    def resetUser(self):
        """ 用户全部重连 """
        self._delManageDef()
       
        self.logout()


def save2json(dc,fileNmae):
    """ 把json 存入文件 """
    with open(fileNmae,"w") as f:
        json.dump(dc,f, sort_keys=True, indent=4, separators=(',', ': '))
        print("保存{}文件完成...".format(fileNmae) ,len(dc) )
 


def unitTest():
    """ 测试 """
    
    cfgs = readCfg('./route_config.json')
    
    wrt = wrtRoute(cfgs)
    wrt.ipLogin('192.168.20.222')
 
def unitTestDel():
    """ 测试 """
    
    cfgs = readCfg('./route_config.json')
    
    wrt = wrtRoute(cfgs)
    wrt.ipLoguot('192.168.20.222')
 

 
 

if __name__ == '__main__':

    unitTestDel()

 