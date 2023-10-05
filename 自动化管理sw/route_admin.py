"""
用python 获取环境路由器，管理上网






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
    """
    def __init__(self,cfg):
        """ """
        self.macJson = None
        self.arpJson = None
        self.cfgStr = None
        #print(cfg)
        #self.todo()
        #self.tn.close()
        self.conn = None
        self.conn = self.login(cfg)

    def login(self,cfg):
        """登入路由器 返回 链接 """
        try:
            conn = Connection(cfg['host'],cfg['user'],cfg['port'], connect_kwargs=cfg['connect_kwargs'] )
            result =conn.run(' uname -n', hide=True)
            print(result.stdout)
        except Exception as e:
            print(u" 连接主机出现问题 跳过  %s" % (e))
        self.conn = conn
        return conn
    
    def logout(self):
        """  关闭连接 """
        self.conn.close()


    def gerRules(self,conn=None):
        """  获取所有 nat  PREROUTING 规则 """
        conn = conn if conn is not None else self.conn
        result =  conn.run(" iptables -t nat -L PREROUTING --line-numbers ", hide=True)   #--获取卡信息
        print(result.stdout)
        rules = self.rules2rows(result.stdout)
        return rules 
    
    def rules2rows(self,tabStr,tpl="iptables-PREROUTING.template"):
        f = open(tpl)
        template = TextFSM(f)
        outTab = template.ParseText(tabStr)
        #print(outTab)
        outTab = [ dict(zip(["num","target",'prot','opt','source','destination'],r)) for r in outTab ]
        return  outTab
    


    def delIpRules(self,rules,ip,act='ACCEPT',dst='anywhere'):
        """ ip,ACCEPT source
            ip ，动作，来源
            iptables -t nat -D PREROUTING  -s 192.168.20.222 -j ACCEPT
        """
        rulesId = [ r['num'] for r in rules if  r['target'] == 'ACCEPT' and r['source'] == ip and   r['destination'] ==  dst ]
        rulesCmd = [ 'iptables -t nat -D PREROUTING  -s {} -j {}'.format(ip,act) for r in rulesId   ]
        return rulesCmd
        
    def addIpRules(self,ip,act='ACCEPT' ):
        """ ip,ACCEPT source
            ip ，动作，来源
            iptables -t nat -D PREROUTING  -s 192.168.20.222 -j ACCEPT
        """
        ruleCmd =  'iptables -t nat -I PREROUTING  -s {} -j {}'.format(ip,act)  
            
        return ruleCmd
        
        
    def ipLogin(self,ip):
        """ """
        cmd = self.addIpRules(ip)
        self.conn.run(cmd, hide=True) 
        self.logout()



    def ipLoguot(self,ip):
        """ """
        rules = self.gerRules()
        rulesCmd = self.delIpRules(rules,ip)
        for cmd in rulesCmd:
            self.conn.run(cmd, hide=True) 
        self.logout()


def save2json(dc,fileNmae):
    """ 把json 存入文件 """
    with open(fileNmae,"w") as f:
        json.dump(dc,f, sort_keys=True, indent=4, separators=(',', ': '))
        print("保存{}文件完成...".format(fileNmae) ,len(dc) )
def save2file(s,fileNmae):
    """ 把str 存入文件 """
    print("保存{}文件完成...".format(fileNmae)   )
    with open(fileNmae, "w", encoding='utf-8') as f:
        f.write(str(s))
        f.close()


def unitTest():
    """ 测试 """
    
    cfgs = readCfg('./route_config.json')
    
    wrt = wrtRoute(cfgs['主路由器'])
    wrt.ipLogin('192.168.20.222')
 
def unitTestDel():
    """ 测试 """
    
    cfgs = readCfg('./route_config.json')
    
    wrt = wrtRoute(cfgs['主路由器'])
    wrt.ipLoguot('192.168.20.222')
 

 
 

if __name__ == '__main__':

    unitTestDel()

 