#!/usr/bin/env python
# coding: utf-8

# In[1]:


## 文件的时间精确性


# In[2]:


get_ipython().system(' pip install ffmpeg-python')


# ## 生成时间单词，json配置文件

# In[25]:


import os,json 
import ffmpeg
from dataclasses import dataclass, field ,asdict
from typing import List
from pydub import AudioSegment


# In[26]:


fname = r'.\\.\\en500word\\0\\1\\cfg_1.json'
with open(fname, encoding="utf-8") as f:  # 注意编码要和文件编码一致，不加encoding参数默认使用gbk编码读取文件
    cfg = json.load(f)
    
    
    


# In[27]:


cfg 


# In[28]:


script={}
script['排列']= 1.1*2


# ### 创建一行行单词配置
# 

# In[48]:


def mkScript(row):
    p1st = {}
    x08 = 0.8
    xone = 0.8
  
    #循环开始 wav完美！！！
 
    
 
    p1st['凸显en']= 0.8
    p1st['en4m朗读线']= row ['en4m'] 
    p1st['等待选择']=  2.5
    p1st['移动答案']=  2.3 #特效音
    p1st['zh4m朗读线']= row ['en4m'] 
     
  

 

    return p1st


# ## 根据2个参数 生成命令

# In[62]:


def mkAoCmd(p1st,row):
    cmd_ls = []
    files = []
    for idx,key  in enumerate(p1st.keys()):
        outFile = '排列'+row['en']+str(idx).rjust(3,'0')
        files.append('./tmp/'+outFile+'.wav')
        
        
        if '朗读线' in key:
            #生成拷贝
            cmd =  拷贝ao('.\\en500word\\'+row[key[0:-3]+'2ao'], outFile )
            #print(cmd)
            cmd_ls.append(cmd)
        elif '移动答案' in key:
            cmd = 拷贝ao('.\\tmp\\风速23.wav', outFile )
        else:
            cmd = 生成空白(p1st[key], outFile )
            #print(cmd) 
            cmd_ls.append(cmd)
        print(idx,key,p1st[key])
        
    print(cmd_ls) 
    return cmd_ls,files
 


# In[63]:


str(5).rjust(3,'0')[-1]


# ## 单个测试

# In[64]:


for idx,row in enumerate(cfg['data']):
    p1st = mkScript(row)#//时间进度
    cmd_ls,files = mkAoCmd(p1st,row)
    break


# In[69]:


def mkao(pid):
    fm = str(pid).rjust(3,'0')
    merge_ls = []
    fname = r'.\\en500word\\{}\\{}\\cfg_{}.json'.format(fm[-2],fm[-1],pid)
    with open(fname, encoding="utf-8") as f:  # 注意编码要和文件编码一致，不加encoding参数默认使用gbk编码读取文件
        cfg = json.load(f)
    for idx,row in enumerate(cfg['data']):
        p1st = mkScript(row)#//时间进度
        cmd_ls,files = mkAoCmd(p1st,row)

        concatCmd = 合并mp3(files,row['zh'])
        merge_ls.append(concatCmd)
    
     
    return 合并mp3(merge_ls,'排列_id_{}'.format(pid))
pidFile = mkao(1)
pidFile,read_probe(pidFile)


# ## 合成特效

# In[53]:


def read_probe(fname):
    info = ffmpeg.probe(fname)
    tm = float(info['streams'][0]['duration'] )
    return tm


# In[54]:


read_probe('./en500word/风速.wav') #格式转换('./en500word/出现.mp3','mp3','wav')


# In[56]:


2.3-0.549637


# In[67]:


音频前后填充('./en500word/风速.wav','风速23',0.85,0.9)


# In[68]:


read_probe( './tmp/风速23.wav')


# In[23]:


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




