#!/usr/bin/env python
# coding: utf-8

# In[1]:


## 文件的时间精确性


# In[2]:


get_ipython().system(' pip install ffmpeg-python')


# ## 生成时间单词，json配置文件

# In[28]:


import os,json 
import ffmpeg
from dataclasses import dataclass, field ,asdict
from typing import List
from pydub import AudioSegment


# In[29]:


fname = r'.\\.\\en500word\\0\\1\\cfg_1.json'
with open(fname, encoding="utf-8") as f:  # 注意编码要和文件编码一致，不加encoding参数默认使用gbk编码读取文件
    cfg = json.load(f)
    
    
    


# In[30]:


cfg 


# In[31]:


script={}
script['显示标题']= 1


# ### 创建一行行单词配置
# 

# In[209]:


def mkScript(row):
    p1st = {}
    x08 = 0.8
    xone = 0.8
    wordIn = 1.1
    #循环开始 wav完美！！！
    p1st['女老师入']= x08
    p1st['zh单词入']= wordIn #加特效音：出现
    p1st['zh4f闪一下']= xone
    p1st['zh4f朗读线']= row ['zh4f'] #//取值
    p1st['en单词入']= wordIn #加特效音:打字
    p1st['en4f闪一下']= xone
    p1st['en4f朗读线']=  row ['en4f']  
    p1st['女老师出']= x08 
    #//换老师
    p1st['男老师入']= x08 
    p1st['zh4m闪一下']= xone
    p1st['zh4m朗读线']= row ['zh4m'] 
    p1st['en4m闪一下']= xone
    p1st['en4m朗读线']= row ['en4m'] 
    p1st['男老师出']= x08
    # 文字归位
    p1st['等待']=  0.81
    #p1st['音标隐藏']=  1
    p1st['en单词出']= x08  #加特效音 :风速
    p1st['zh单词出']= x08  #加特效音:风速

    return p1st


# ## 根据2个参数 生成命令

# In[210]:


def mkMp3Cmd(p1st,row):
    cmd_ls = []
    files = []
    for idx,key  in enumerate(p1st.keys()):
        outFile = '单词'+row['en']+str(idx).rjust(3,'0')
        files.append('./tmp/'+outFile+'.wav')
        if '朗读线' in key:
            #生成拷贝
            cmd = 拷贝ao('.\\en500word\\'+row[key[0:-3]+'2ao'], outFile )
            #print(cmd)
            cmd_ls.append(cmd)
        elif '单词出' in key:
            cmd = 拷贝ao('.\\tmp\\风速08.wav', outFile )
        elif 'zh单词入' in key:
            cmd = 拷贝ao('.\\tmp\\出现11.wav', outFile )
        elif 'en单词入' in key:
            cmd = 拷贝ao('.\\tmp\\打字11.wav', outFile )
        else:
            cmd = 生成空白(p1st[key], outFile )
            #print(cmd) 
            cmd_ls.append(cmd)
        #print(idx,key,p1st[key])
        
        
    return cmd_ls,files
 


# In[211]:


str(5).rjust(3,'0')[-1]


# In[218]:


def mkao(pid):
    fm = str(pid).rjust(3,'0')
    merge_ls = []
    fname = r'.\\en500word\\{}\\{}\\cfg_{}.json'.format(fm[-2],fm[-1],pid)
    with open(fname, encoding="utf-8") as f:  # 注意编码要和文件编码一致，不加encoding参数默认使用gbk编码读取文件
        cfg = json.load(f)
    for idx,row in enumerate(cfg['data']):
        p1st = mkScript(row)#//时间进度
        cmd_ls,files = mkMp3Cmd(p1st,row)

        concatCmd = 合并mp3(files,row['zh'])
        merge_ls.append(concatCmd)
    
     
    return 合并mp3(merge_ls,'单词_id_{}'.format(pid))
pidFile = mkao(1)
pidFile,read_probe(pidFile)


# In[ ]:





# In[59]:


def read_probe(fname):
    info = ffmpeg.probe(fname)
    tm = float(info['streams'][0]['duration'] )
    return tm


# In[121]:


read_probe('./en500word/打字.wav') #格式转换('./en500word/出现.mp3','mp3','wav')


# In[140]:


read_probe('./en500word/出现.wav')


# In[142]:


1.1-0.889229-0.15


# In[175]:


音频前后填充('./en500word/出现.wav','出现11',0.15,0.0609)


# In[176]:


read_probe( './tmp/出现11.wav')


# In[126]:


(0.8-0.799751)+0.10036300000000001


# In[184]:


def 格式转换(file,st='mp3',dt='wav'):
    """ """
    outfile = '{}.{}'.format(file[0:len(st)*-1-1],dt)
    AudioSegment.from_file(r'{}'.format(file),st).export(outfile,format=dt)
    return  outfile

def 拷贝ao(src,file):
    outfile = './tmp/{}.wav'.format(file)
    AudioSegment.from_file(r'{}'.format( src),"mp3").export(outfile,format="wav")
    return  outfile
    
def 生成空白(sec,file):
    """ """
    outfile = './tmp/{}.wav'.format(file)
    静音 = AudioSegment.silent(duration=sec*1000)
    静音.export(outfile,format="wav")
    return  outfile

def 音频前后填充(file,outfile,sec,sec2):
    """ """
    outfile = './tmp/{}.wav'.format(outfile)
    静音 = AudioSegment.silent(duration=sec*1000)
    静音2 = AudioSegment.silent(duration=sec2*1000)
    
    原文件 =  AudioSegment.from_file(r'{}'.format(file),"wav") 
    (静音+原文件+静音2).export(outfile,format="wav")
    return  outfile

def 合并mp3(file_ls,file):
    """ ffmpeg -f concat -safe 0 -i input.txt -c copy output.mp3 """
    outAo = None
    outfile = './tmp/合并_{}.wav'.format(file)
    for f in file_ls:
        if outAo is None:
            outAo = AudioSegment.from_file(r'{}'.format(f),"wav")
        else:
            outAo = outAo + AudioSegment.from_file(r'{}'.format(f),"wav")
    
    outAo.export(outfile,format="wav")
 
    return  outfile


# In[ ]:




