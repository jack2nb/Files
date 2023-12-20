"""
用python 获取环境内交换机信息


1.arp
2.mac
3.config 等
"""
import telnetlib
from textfsm import TextFSM
import re,json

from fabric import Connection  # pip install  fabric==2.6



def readCfg(filename):
    """读取配置文件"""
    # 读取json文件内容,返回字典格式
    json_data = {}
    with open(filename,'r',encoding='utf8')as fp:
        json_data = json.load(fp)
    return json_data



class rgSwInfo:
    """ 锐捷
    接口统一  支持大部分管理型交换机
    获取 华为交换机信息"""
    def __init__(self,cfg):
        """ """
        self.macJson = None
        self.arpJson = None
        self.cfgStr = None
        self.tn = self.login(cfg['user'],cfg['passwd'],cfg['ip'])
        #print(cfg)
        #self.todo()
        #self.tn.close()

    def login(self,user,passwd,ip):
        """登入交换机 返回telnet"""
        outLs = []
        tn=telnetlib.Telnet(ip)
        out = tn.read_until(b"Password:",timeout=5)
        outLs.append(out)
        tn.write(user.encode('ascii')+b"\n")
        ## ------
        out = tn.read_until(b"Ruijie>",timeout=5)
        outLs.append(out)
        tn.write('enable '.encode('ascii')+b"\n")
        out = tn.read_until(b"Password:",timeout=5)
        tn.write(passwd.encode('ascii')+b"\n")
        outs = tn.expect([b"\r\n.+?#"],timeout=5)##等待直到读到预期的值
        outLs.append(outs[2])
        #print(outLs)
        return tn

    def todo(self):
        """ 实际要执行的内容"""
        #apr读取并转成rows
        #------
        # tabLs = self.arp2tab(self.tn)
        # self.arpTab = self.list2str(tabLs)
        # #print(self.arpTab)       
        # self.arpLs = self.arp2rows(self.arpTab)
        # # 格式化json美化输出
        # self.arp2json(self.arpLs)
        # #mac读取并转成rows
        tabLs = self.mac2tab(self.tn)
        self.macTab = self.list2str(tabLs)
        #print(self.macTab)       
        self.macLs = self.mac2rows(self.macTab)
        # 格式化json美化输出
        self.macJson  = self.mac2json(self.macLs)
        
        self.tn.close()

    def mac2tab(self,tn):
        """ 返回交换 arp表"""
        tabLs = []
        #tn.write(b" display mac-address\n")
        tn.write('show mac-address-table '.encode('ascii')+b"\n")
        while 1 :
            outs = tn.expect([b"\\x1b\[0m All\s+",b"\\n\\r\\n\\r\\rTotal Entries:.*?\\r\\n\\r\\r\\n\\r.*?#"],timeout=5) 
            if outs[0] == 0:
                #还有下一个页
                tn.write(b" ")
                tabLs.append(outs[2].decode('ascii'))
                #print('还有下一个页',outs[2])
            if outs[0] != 0:
                # 完成all读取
                #print('完成all读取',outs[2])
                tabLs.append(outs[2].decode('ascii'))
                break
        return tabLs


    def list2str(self,tabLs): 
        """ 多行合并成字符串"""
        tabStr = ''.join(tabLs)
        linp = '----\n\r\r'
        num = tabStr.find (linp)+len(linp)
        tabStr = tabStr[num:]
        tabStr =  re.sub("\\n\\r\\n\\r\\rTotal Entries:.*?\\r\\n\\r\\r\\n\\r.*?#", "", tabStr) #尾巴
        tabStr =  re.sub("\\x1b\[.*2K\\r\\r", "", tabStr) #翻页字符
        tabStr =  re.sub("\\r\\r", "", tabStr) #换行
        return tabStr


    def mac2rows(self,tabStr,tpl="show-mac.template"):
        f = open(tpl)
        template = TextFSM(f)
        outTab = template.ParseText(tabStr)
        return  outTab


    def mac2json(self,ls):
        """  带表头 col """
        rows = []
        for row in ls:
            #print(row)
            keys = ['vlan','mac','type', 'port']
            dc = dict(zip(keys, row))
            # 转换地址格式
            dc['mac'] =dc['mac'].replace(".", "-").lower()
            rows.append(dc)
        macJson = rows
        #print(macJson)
        return macJson 

class hwSwS3700:
    """ 
    接口统一  支持大部分管理型交换机
    获取 华为交换机信息"""
    def __init__(self,cfg):
        """ """
        self.macJson = None
        self.arpJson = None
        self.cfgStr = None
        self.tn = self.login(cfg['user'],cfg['passwd'],cfg['ip'])
        #print(cfg)
        #self.todo()
        #self.tn.close()

    def todo(self):
        """ 实际要执行的内容"""
        #apr读取并转成rows
        tabLs = self.arp2tab(self.tn)
        self.arpTab = self.list2str(tabLs)
        #print(self.arpTab)       
        self.arpLs = self.arp2rows(self.arpTab)
        # 格式化json美化输出
        self.arp2json(self.arpLs)
        #mac读取并转成rows
        tabLs = self.mac2tab(self.tn)
        self.macTab = self.list2str(tabLs)
        #print(self.macTab)       
        self.macLs = self.mac2rows(self.macTab)
        # 格式化json美化输出
        self.macJson  = self.mac2json(self.macLs)
        self.cfg2get(self.tn)
        self.tn.close()

    def cfg2get(self,tn):
        """ 配置文件  \r\r\n<3700>"""
        tabLs = []
        tn.write(b" display current-configuration \n")
        while 1 :
            outs = tn.expect([b"--- More ----"],timeout=5) 
            if outs[0] == 0:
                #还有下一个页
                tn.write(b" ")
                #print(outs[2])
                tabLs.append(outs[2].decode('ascii'))
                #print(outs[2])
            if outs[0] != 0:
                # 完成读取
                #print(outs[2])
                tabLs.append(outs[2].decode('ascii'))
                break
        # 保存成属性变量
        self.cfgStr = self.list2str(tabLs)

        return self.cfgStr

    def list2str(self,tabLs): 
        """ 多行合并成字符串"""
        tabStr = ''.join(tabLs)
        tabStr =  re.sub("\s+---- More ----\x1b\[42D\s+\x1b\[42D", "\r\n", tabStr)
        tabStr =  re.sub("\r\n\s{30,}","  ", tabStr)   
        return tabStr
    ##------------arp------------
    def arp2tab(self,tn):
        """ 返回交换 arp表 字符串数组"""
        tabLs = []
        tn.write(b"display arp\n")
        while 1 :
            outLs = tn.expect([b"\r\n<.+?>",b"---- More ----"],timeout=5) 
            if outLs[0] == 1:
                #还有下一个页
                tn.write(b"   ")
                tabLs.append(outLs[2].decode('ascii'))
                #print(outLs[2])
            if outLs[0] <= 0:
                # 完成读取
                #print(outLs[2])
                tabLs.append(outLs[2].decode('ascii'))
                break
        return tabLs

    def arp2rows(self,arpTab,tpl="display-arp.template"):
        """  解析表格字符串  返回json"""
        f = open(tpl)
        template = TextFSM(f)
        outTab = template.ParseText(arpTab)
        return outTab

    def arp2json(self,ls):
        """  带表头 col """
        rows = []
        for row in ls:
            #print(row)
            keys = ['ip', 'mac', 't','port','vlan']
            dc = dict(zip(keys, row))
            rows.append(dc)
        self.arpJson = rows#json.dumps(rows, sort_keys=True, indent=4, separators=(',', ': '))
        #print(self.arpJson)
        return self.arpJson 

    ##------------mac------------
    def mac2tab(self,tn):
        """ 返回交换 arp表"""
        tabLs = []
        tn.write(b" display mac-address\n")
        while 1 :
            outLs = tn.expect([b"\r\n<.+?>",b"---- More ----"],timeout=5) 
            if outLs[0] == 1:
                #还有下一个页
                tn.write(b"   ")
                tabLs.append(outLs[2].decode('ascii'))
                #print(outLs[2])
            if outLs[0] <= 0:
                # 完成读取
                #print(outLs[2])
                tabLs.append(outLs[2].decode('ascii'))
                break
        return tabLs


    def mac2rows(self,tabStr,tpl="display-mac.template"):
        f = open(tpl)
        template = TextFSM(f)
        outTab = template.ParseText(tabStr)
        return  outTab
        
    def mac2json(self,ls):
        """  带表头 col """
        rows = []
        for row in ls:
            #print(row)
            keys = ['mac','vlan', 'port']
            dc = dict(zip(keys, row))
            rows.append(dc)
        macJson = rows
        #print(macJson)
        return macJson 
   
        



    def login(self,user,passwd,ip):
        """登入交换机 返回telnet"""
        tn=telnetlib.Telnet(ip)
        out = tn.read_until(b"Username:",timeout=5)
        tn.write(user.encode('ascii')+b"\n")
        out = tn.read_until(b"Password:",timeout=5)
        tn.write(passwd.encode('ascii')+b"\n")
        outLs = tn.expect([b"\r\n<.+?>"],timeout=5)##等待直到读到预期的值
        #print(outLs[2])
        return tn



class h3cSwS5560s:
    """ 
    接口统一  支持大部分管理型交换机
    获取 h3c交换机信息"""
    def __init__(self,cfg):
        """ """
        self.macJson = None
        self.arpJson = None
        self.cfgStr = None
        self.tn = self.login(cfg['user'],cfg['passwd'],cfg['ip'])
        #print(cfg)
        #self.todo()
        #self.tn.close()

    def todo(self):
        """ 实际要执行的内容"""
        #apr读取并转成rows
        tabLs = self.arp2tab(self.tn)
        self.arpTab = self.list2str(tabLs)
        #print(self.arpTab)       
        self.arpLs = self.arp2rows(self.arpTab)
        #print(self.arpLs)     
        # 格式化json美化输出
        self.arp2json(self.arpLs)
        #print(self.arpJson)    
        #mac读取并转成rows
        tabLs = self.mac2tab(self.tn)
        self.macTab = self.list2str(tabLs)
        #print(self.macTab)       
        self.macLs = self.mac2rows(self.macTab)
        # 格式化json美化输出
        self.macJson  = self.mac2json(self.macLs)
        self.cfg2get(self.tn)
        self.tn.close()
     
    def cfg2get(self,tn):
        """ 配置文件  \r\r\n<5560>"""
        tabLs = []
        tn.write(b" display current-configuration \n")
        while 1 :
            outs = tn.expect([b"\r\r\n---- More ----"],timeout=5) 
            if outs[0] == 0:
                #还有下一个页
                tn.write(b" ")
                #print(outs[2])
                tabLs.append(outs[2].decode('ascii'))
                #print(outs[2])
            if outs[0] != 0:
                # 完成读取
                #print(outs[2])
                tabLs.append(outs[2].decode('ascii'))
                break
        # 保存成属性变量
        self.cfgStr = self.list2str(tabLs)

        return self.cfgStr

    def list2str(self,tabLs): 
        """ h3c 多行合并成字符串"""
        tabStr = ''.join(tabLs)
        tabStr =  re.sub("\r\r\n---- More ----\r\r               \r", "\r\n", tabStr)
        tabStr =  re.sub("\r\r\n","\r\n", tabStr)   
        return tabStr

    ##------------arp------------
    def arp2tab(self,tn):
        """ 返回交换 arp表  \r\r\n<5560>"""
        tabLs = []
        tn.write(b"display arp\n")
        while 1 :
            outs = tn.expect([b"\r\r\n---- More ----"],timeout=5) 
            if outs[0] == 0:
                #还有下一个页
                tn.write(b" ")
                #print(outs[2])
                tabLs.append(outs[2].decode('ascii'))
                #print(outs[2])
            if outs[0] != 0:
                # 完成读取
                #print(outs[2])
                tabLs.append(outs[2].decode('ascii'))
                break
        return tabLs

    def arp2rows(self,arpTab,tpl="display-arp-s5560s.template"): 
        """  h3c 解析表格字符串  返回json"""
        f = open(tpl)
        template = TextFSM(f)
        outTab = template.ParseText(arpTab)
        return outTab

    def arp2json(self,ls):
        """  带表头 col """
        rows = []
        for row in ls:
            #print(row)
            keys = ['ip', 'mac','vlan',  'port']
            dc = dict(zip(keys, row))
            rows.append(dc)
        self.arpJson = rows#json.dumps(rows, sort_keys=True, indent=4, separators=(',', ': '))
        #print(self.arpJson)
        return self.arpJson 

    ##------------mac------------
    def mac2tab(self,tn):
        """ h3c返回交换 arp表"""
        tabLs = []
        tn.write(b" display mac-address\n")
        while 1 :
            outLs = tn.expect([b"<.+?>",b"\r\r\n---- More ----"],timeout=5) #//[b"\r\r\n---- More ----"]
            if outLs[0] >= 0:
                #还有下一个页
                tn.write(b" ")
                tabLs.append(outLs[2].decode('ascii'))
                #print(outLs)
            if outLs[0] < 0:
                # 完成读取
                #print(outLs)
                tabLs.append(outLs[2].decode('ascii'))
                break
        return tabLs


    def mac2rows(self,tabStr,tpl="display-mac-s5560s.template"):
        f = open(tpl)
        template = TextFSM(f)
        outTab = template.ParseText(tabStr)
        return  outTab
        
    def mac2json(self,ls):
        """  带表头 col """
        rows = []
        for row in ls:
            #print(row)
            keys = ['mac','vlan','state', 'port']
            dc = dict(zip(keys, row))
            rows.append(dc)
        macJson = rows
        #print(macJson)
        return macJson 
   
        



    def login(self,user,passwd,ip):        
        """登入h3c交换机 返回telnet"""
        outLs = []
        tn=telnetlib.Telnet(ip)
        out = tn.read_until(b"login:",timeout=5)
        outLs.append(out)
        #--输入用户名
        tn.write(user.encode('ascii')+b"\n")
        out = tn.read_until(b"Password:",timeout=5)
        outLs.append(out)
        #--输入密码
        tn.write(passwd.encode('ascii')+b"\n")
        outs = tn.expect([b"<.*?>"],timeout=5)##等待直到读到预期的值
        outLs.append(outs[2])
        ## ------
        #print(outLs)
        return tn


class h3cSwS1850:
    """ 
    接口统一  支持大部分管理型交换机
    获取 h3c交换机信息"""
    def __init__(self,cfg):
        """ """
        self.macJson = None
        self.arpJson = None
        self.cfgStr = None
        self.tn = self.login(cfg['user'],cfg['passwd'],cfg['ip'])
        #print(cfg)
        #self.todo()
        #self.tn.close()

    def todo(self):
        """ 实际要执行的内容"""
        #apr读取并转成rows
        #tabLs = self.arp2tab(self.tn)
        #self.arpTab = self.list2str(tabLs)
        #print(self.arpTab)       
        #self.arpLs = self.arp2rows(self.arpTab)
        #print(self.arpLs)     
        # 格式化json美化输出
        #self.arp2json(self.arpLs)
        #print(self.arpJson)    
        #mac读取并转成rows
        tabLs = self.mac2tab(self.tn)
        self.macTab = self.list2str(tabLs)
        #print(self.macTab)       
        self.macLs = self.mac2rows(self.macTab)
        # 格式化json美化输出
        self.macJson  = self.mac2json(self.macLs)
        
        self.tn.close()
     

    def list2str(self,tabLs): 
        """ h3c 多行合并成字符串"""
        tabStr = ''.join(tabLs)
        tabStr =  re.sub("  ---- More ----\\x1b\[16D\s+\\x1b\[16D", "", tabStr)
        tabStr =  re.sub("\r\r\n","\r\n", tabStr)   
        return tabStr

    ##------------arp------------
    def arp2tab(self,tn):
        """ 返回交换 arp表  \r\r\n<5560>"""
        tabLs = []
        tn.write(b"display mac-addr \n")
        while 1 :
            outs = tn.expect([b"\r\n  ---- More ----"],timeout=5) 
            if outs[0] >-1 :
                #还有下一个页
                tn.write(b" ")
                #print(outs[2])
                tabLs.append(outs[2].decode('ascii'))
                #print(outs[2])
            if outs[0] < 0:
                # 完成读取
                #print(outs[2])
                tabLs.append(outs[2].decode('ascii'))
                break
        return tabLs

    def arp2rows(self,arpTab,tpl="display-mac-s1580.template"): 
        """  h3c 解析表格字符串  返回json"""
        f = open(tpl)
        template = TextFSM(f)
        outTab = template.ParseText(arpTab)
        return outTab

    def arp2json(self,ls):
        """  带表头 col """
        rows = []
        for row in ls:
            #print(row)
            keys = ['ip', 'mac','vlan',  'port']
            dc = dict(zip(keys, row))
            rows.append(dc)
        self.arpJson = rows#json.dumps(rows, sort_keys=True, indent=4, separators=(',', ': '))
        print(self.arpJson)
        return self.arpJson 

    ##------------mac------------
    def mac2tab(self,tn):
        """ h3c返回交换 arp表"""
        tabLs = []
        tn.write(b" display mac-address\n")
        while 1 :
            outLs = tn.expect([b"\r\n  ---- More ----"],timeout=5) #//[b"\r\r\n---- More ----"]
            if outLs[0]  >-1 :
                #还有下一个页
                tn.write(b" ")
                tabLs.append(outLs[2].decode('ascii'))
                #print(outLs)
            if outLs[0] < 0:
                # 完成读取
                #print(outLs)
                tabLs.append(outLs[2].decode('ascii'))
                break
        return tabLs


    def mac2rows(self,tabStr,tpl="display-mac-s1580.template"):
        f = open(tpl)
        template = TextFSM(f)
        outTab = template.ParseText(tabStr)
        return  outTab
        
    def mac2json(self,ls):
        """  带表头 col """
        rows = []
        for row in ls:
            #print(row)
            keys = ['mac','vlan','state', 'port']
            dc = dict(zip(keys, row))
            rows.append(dc)
        macJson = rows
        #print(macJson)
        return macJson 
   
        



    def login(self,user,passwd,ip):        
        """登入h3c poe交换机 返回telnet"""
        outLs = []
        tn=telnetlib.Telnet(ip)
        out = tn.read_until(b"Username:",timeout=5)
        outLs.append(out)
        #--输入用户名
        tn.write(user.encode('ascii')+b"\n")
        out = tn.read_until(b"Password:",timeout=5)
        outLs.append(out)
        #--输入密码
        tn.write(passwd.encode('ascii')+b"\n")
        outs = tn.expect([b"<.*?>"],timeout=5)##等待直到读到预期的值
        outLs.append(outs[2])
        ## ------
        #print(outLs)
        return tn




class openwrt:
    """ 
    管理路由器
    获取 arp信息"""

    ""
 

    def __init__(self,cfg):
        """ """
        self.macJson = None
        self.arpJson = None
        self.cfgStr = None
        self.conn = self.login(cfg )
        #print(cfg)
        #self.todo()
        #self.conn.close()


    def login(self,cfg=None):
        """登入路由器 返回 链接 """
       
        set_time_oute = cfg.get('connect_timeout') if  cfg.get('connect_timeout') is not None else 5 
        try:
            # paramiko known_hosts 或  pip3 install paramiko -U  # pip3 install paramiko==2.8.0
 
            conn = Connection(cfg['ip'],cfg['user'],cfg['port']
                              , connect_kwargs={"password": cfg['passwd']}
                            ,connect_timeout=set_time_oute )
            result =conn.run(' uname -n', hide=True)
            print(result.stdout)
        except Exception as e:
            print(u" 连接主机出现问题 跳过  {} cfg={} ".format(e,cfg))
        self.conn = conn
        return conn

    def logout(self):
        """  关闭连接 """
        if self.conn is not  None:
            self.conn.close()
        self.conn=None



    def todo(self):
        """ 实际要执行的内容"""
        #apr读取并转成rows
        # tabLs = self.arp2tab(self.tn)
        # self.arpTab = self.list2str(tabLs)
        # print(self.arpTab)       
        # self.arpLs = self.arp2rows(self.arpTab)
        # print(self.arpLs)     
        #格式化json美化输出
        self.arp2json()
        print(self.arpJson)    
        #mac读取并转成rows
        # tabLs = self.mac2tab(self.tn)
        # self.macTab = self.list2str(tabLs)
        # #print(self.macTab)       
        # self.macLs = self.mac2rows(self.macTab)
        # # 格式化json美化输出
        # self.macJson  = self.mac2json(self.macLs)
        
        self.logout()

    def arp2mac(self,row):
        """ 4c:bd:8f:90:71:9c 转换成 4cbd-8f90-719c """
        row['mac'] = self.mac2mac(row['mac'] )


    def mac2mac(self,mac_str):
        """ 4c:bd:8f:90:71:9c 转换成 4cbd-8f90-719c """
        return  mac_str.replace(':','',1).replace(':','-',1).replace(':','',1).replace(':','-',1).replace(':','',1)

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
    
    def _toRun(self,cmd,conn=None):
        """ 核心执行 """
        conn = conn if conn is not None else self.conn
        conn = conn if conn is not None else self.login() #自动连接
        result =  conn.run( cmd , hide=True)   #执行命令 allow_agent=False,look_for_keys=False
        #print(cmd,'==\n',result. stdout) #loger
        return result
    
 

    def arp2json(self):
        """  带表头 col """
        arpLs = self.arp()
        [ self.arp2mac(r)  for r in arpLs ]
        self.arpJson = arpLs#json.dumps(rows, sort_keys=True, indent=4, separators=(',', ': '))
        #print(self.arpJson)
        return self.arpJson 

   



 


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
    
    obj = h3cSwS5560s(cfgs['交换机列表'][1])
    #obj.login()
    
    #obj.close()
    obj.todo()

    tmp =  json.dumps(obj.arpJson, sort_keys=True, indent=4, separators=(',', ': ')) if   obj.arpJson else None
    print(tmp) if obj.arpJson else ""
    tmp =  json.dumps(obj.macJson, sort_keys=True, indent=4, separators=(',', ': ')) if   obj.macJson else None
    print(tmp) if obj.macJson else "" 




def selectClass(typeName):
    """ 选择对应的类/交换机 """
    dc = {}
    dc["hw.s3700"] = hwSwS3700
    dc["rg.nbs5552xg"] = rgSwInfo
    dc["h3c.s5560s"] = h3cSwS5560s
    dc["h3c.s1850"] = h3cSwS1850
    dc["openwrt.22"] = openwrt

    
 
    return dc.get(typeName)

if __name__ == '__main__':

    cfgs = readCfg('./sw_config.json')

    #unitTest()
    #exit()

    for row in cfgs['交换机列表']:
        cls = selectClass(row['type'])
        print('配置文件',row['name'],cls)
        if cls:
            obj = cls(row)
            obj.todo()
            ## 保存arp
            save2json(obj.arpJson,row['name']+'_'+row['ip']+'arp.json') if obj.arpJson else ""
            ## 保存mac
            save2json(obj.macJson,row['name']+'_'+row['ip']+'mac.json')  if obj.macJson else ""
            ## 保存cfg
            save2file(obj.cfgStr,row['name']+'_'+row['ip']+'cfg.json')  if obj.cfgStr else ""
        
