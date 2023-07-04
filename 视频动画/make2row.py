"""
2生 生成音频 、生音标图

2刷 刷音标，刷时长

26*26 ,id=9*9
"""


import ffmpeg
from azure.cognitiveservices.speech import AudioDataStream, SpeechConfig, SpeechSynthesizer, SpeechSynthesisOutputFormat
import azure.cognitiveservices.speech as speechsdk

speech_key, service_region = "78b5e11b237642b0a2250c36fba9becb", "koreacentral"
speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)

import os,re,json
from PIL import Image, ImageDraw, ImageFont



import requests
from pyquery import PyQuery as pq



Header = {
     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "zh-CN,zh-TW;q=0.9,zh;q=0.8,en;q=0.7,en-US;q=0.6",
}

def getPh(word):
    """ 通过单词 获取音标  返回list"""
    urlTpl  = "https://www.merriam-webster.com/dictionary/{}"
    url = urlTpl.format(word)
    res_obj = requests.get(url, headers=Header,  timeout=25)#不能发送中文 
    #response.text
    doc = pq(res_obj.text)
    target_a = doc('a[data-lang="en_us"]')
    a_ls = []
    for a in target_a:
        doc_a = doc(a)
        href_url = doc_a.attr('href')
        a_ls.append(  doc_a.text() )
    ##--
    return a_ls


def draw_png(name,filename='test.png', font_size = 120):
    
    """ 创建音标图片 arial.ttf/calibri.ttf/segoeui.ttf 
        支持任意路径下创建图片
        音标文本，保存路径，字体大小
    """
    font=ImageFont.truetype(r'C:\Windows\Fonts\calibri.ttf'  , font_size)
    text_width, text_height = font.getsize(name) #获取文字大小
    image = Image.new(mode='RGBA', size=(text_width, text_height))
    draw_table = ImageDraw.Draw(im=image)
    draw_table.text(xy=(0, 0), text=name, fill='#2a2a2a', font=font)#文字填充图片区域
 
    #image.show()  # 直接显示图片
    # 自动创建目录
    filePath = os.path.dirname(filename)   #获取目录
    tf = os.makedirs(filePath,exist_ok=True) if filePath else None #递归创建
    image.save(filename , 'PNG')  # 保存在当前路径下，格式为PNG
    image.close()



def trimPh(ph):
    """ 整理音标  减少困扰 (ē-ˌ) (ˌ)
    ph
    """
    ph =  re.sub("\([\S\s]+?\)", "", ph) #尾巴
    ph =  re.sub("ˌ", "", ph) #尾巴
    ph =  re.sub("ᵊ", "ə", ph) #
    ph =  re.sub("^ˈ", "", ph) #翻页字符
    return ph





def mksound(word,filename='测试-男.mp3' ,voice_name='zh-CN-XiaohanNeural',speed=0.7):
    """ 用弱智的方式 把复杂事情做的简单
    自动递归创建目录
    播放速度转换成0.7
    
    """
    #speech_config.speech_synthesis_language = "zh-CN"
    speech_config.speech_synthesis_voice_name =voice_name #说话人
    speech_config.set_speech_synthesis_output_format(speechsdk.SpeechSynthesisOutputFormat.Audio48Khz192KBitRateMonoMp3)
    # 自动创建目录
    if speed == 0: #需要变音 需要临时文件
        outfile =  filename
        tmpfile = filename
    else:
        outfile = filename
        tmpfile = 'temp.mp3'
        audio_main = ffmpeg .input( tmpfile ) .filter('atempo', speed)
        #basename = os.path.basename(filename)
        #newFileName =  os.path.join(filePath,'变-'+basename)

    #---创建目录
    filePath = os.path.dirname(outfile)   #获取目录
    os.makedirs(filePath,exist_ok=True)   #递归创建
    
    #------ai 在线生成
    audio_config = speechsdk.AudioConfig(filename= tmpfile )
    synthesizer = SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config) ##生成
    result = synthesizer.speak_text_async(word).get()

    # 检查合成结果是否成功
    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        print("生成 {} 成功".format(word))
    else:
        print("生成 {} 失败".format(word))
    #----转换播放速度
    if speed == 0:#需要变音
        return outfile
    audio_main = ffmpeg .input( tmpfile ) .filter('atempo', speed)
    #basename = os.path.basename(filename)
    #newFileName =  os.path.join(filePath,'变-'+basename)
    output, err =  None,None
    try:
        # 执行FFmpeg命令并捕获标准错误输出
        output, err = (
            ffmpeg.output(audio_main,outfile)
            .overwrite_output() # 覆盖文件
            .run(capture_stdout=True, capture_stderr=True)
        )
    except ffmpeg.Error as e:
        print(f"Error: {e.stderr.decode('utf8')}" ,output)
    return outfile


def getDur(filename):
    """ 获取时长
        getDur(".\\en500word\\zhon.mp3")  """
    info = ffmpeg.probe(filename)
    return float(info['streams'][0]['duration'] )



def mkone(arg,g_dir = '.\\en500word'):
    """ 通过web post 参数生成 mp3文件"""
    
    gender = arg['gender']
    lang = arg['lang']
    fname = "{}_{}4{}.mp3".format(arg['zh'],lang,gender) 
    if len(arg['en'])>=2:
        word = arg['en'] if lang=='en' else  arg['zh']
        filename = os.path.join(g_dir,arg['en'][0].lower(),arg['en'][1].lower(),fname)
        print(word,filename,arg['name'])
        mksound(word,filename,arg['name'])
        return  fname



def mkphimg(imgarg,g_dir = '.\\en500word'):
    """ 通过web post 参数生成音标图"""
    fname = "{}.png".format(imgarg['zh'] ) 
    if len(imgarg['en'])>=2:
        filename = os.path.join(g_dir,imgarg['en'][0].lower(),imgarg['en'][1].lower(),fname)
        print( filename )
        word = trimPh(imgarg['ph'])
        draw_png('/'+word+'/' , filename)


def mkWrodCfg(ls,g_dir='.\\en500word'):
    """  创建 文件"""
    jsonf = os.path.join('.',g_dir,fm[-2],fm[-1],'cfg_'+str(pid) +'.json')
    filePath = os.path.dirname(jsonf)   #获取目录
    os.makedirs(filePath,exist_ok=True)  #递归创建
    #---
    jsonDat = {"data":ls,"src":"https://disk.17121.top/"}
    jsonstr = json.dumps(jsonDat,  ensure_ascii=False, indent=4)
    jsonstr = " var dataFromJSON =  " + jsonstr
    with open(jsonf, "w", encoding="utf-8") as f:
        f.write(jsonstr)
        #print(jsonstr)
    return jsonf










