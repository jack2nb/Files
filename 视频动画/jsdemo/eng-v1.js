import * as mo from "movy";

// one.js
import _ from 'lodash';


//webpack
var fs = require("fs");

//var path = require("path");
//载入配置文件
const srcCfg = require('./src.json');
const wordCfg = require('D:/jack/eng-amt/en500word/0/1/cfg_1.json');//.\\.\\en500word\\0\\1\\cfg_1.json
let word, srcPath;


srcPath = srcCfg['imgRoot']//'./t123456_img/'
console.log('cfg==', srcCfg, wordCfg, wordCfg.toString())



let srcDt = {
  "背景01": "./src/黑白白板.png"
  , "教师04": "./src/教师4.png"
  , "教师07": "./src/老师7.png"
  //, "音标": "./src/大猩猩.png"

}
const movieSlice = { "片头": 1, "单词": 1, "排列": 1, "片尾": 1 }

var fast = 1 //耗时1秒 标准单位

/* seed */
mo.cameraMoveTo({ zoom: 1.5, duration: 0 }); //横向移动摄像机
//-----背景
let bgImg
let bgGroup = mo.addGroup();
let bg = bgGroup.addRect({ z: -100, scale: 20, color: "#ffffff" });
let imgBg = srcDt['背景01']//'./src/bg-palnt3.png';//雨雾草 v1
//bgImg = bgGroup.addImage(imgBg, {z:-99,y:-2.1,x:0,scale:3.6})

//imgBg =  './src/grass.jpg';//草原 v2
bgImg = bgGroup.addImage(imgBg, { z: -99, y: 0, x: 0, scale: 6.0 }) //scale缩放7.5

mo.addText('每天说英语', { position: [-5.2, -2.6], opacity: 0.5, scale: 0.15, color: "#2a2a2a" })
mo.addText('Speak English Every Day', { position: [-4.70, -2.8], opacity: 0.5, scale: 0.13, color: "#2a2a2a" })
if (movieSlice['片头'] == 1) {
  //fast = 0.001
  mo.addText('生活常用词500个', { position: [0.0, 2.5], opacity: 0.9, scale: 0.38, color: "#2a2a2a" })
    .typeText({ duration: 0.5 * fast }) ;//duration耗时  
    mo.addText('单词量是学好英语的基石', { position: [0.0, 2], opacity: 0.7, scale: 0.14, color: "#2a2a2a" })
    .typeText({ t: ">",duration: 0.5 * fast }) ;//duration耗时  
  mo.pause(2 * fast); //魔殊琪 朗读标题
}
//------老师
let teacher = {}

//------女老师
let teacherF = mo.addGroup();
teacher.f = teacherF.addImage(srcDt['教师04'], { z: 98, y: -0.4, x: -10, scale: 3.8 })//.changeOpacity(0.9,{  duration:0})
//teacher.f .fadeOut( {  duration: 0 })
//------男老师
let teacherM = mo.addGroup();
teacher.m = teacherM.addImage(srcDt['教师07'], { z: 98, y: -0.4, x: -10, scale: 2.8 })//.changeOpacity(0.9,{  duration:0})
//teacher.m .fadeOut( {  duration:0 })


function 闪一下(obj) {
  //0.8秒耗时
  obj.changeOpacity(0.1, { t: ">", duration: 0.4 * fast, ease: "power2.in" })
  obj.changeOpacity(0.9, { t: ">", duration: 0.4 * fast, ease: "power2.Out" })
}
function 进度线(t, x = 0.2, y = 0.3) {
  //耗时是参数
  var lineOne = mo.addRect({ x: x, y: y, width: 2.8, height: 0.03, color: "#44abda" })
  lineOne.fadeIn({ duration: 0 })
  lineOne.scaleXTo(0, { duration: t * fast, ease: "none" })
  return lineOne
}
function 移到一边(obj, x, y) {
  //0.8秒耗时
  obj.moveTo({ x: x, y: y, duration: 0.5 * fast })
  obj.changeOpacity(0.4, { t: "<", duration: 0.6 * fast, ease: "expo.in" })
  obj.scaleTo(0.165, { t: "<", duration: 0.6 * fast, ease: "expo.in" })
}
//-------循环生成字 
var starty = 2
var startx = 4
var textColor ;
var textColors=['blue','teal','brown','indigo','purple'] ;
var wordGp = mo.addGroup();
var objLs = []
//fast = 0.001
for (let key in wordCfg.data) {
  if (movieSlice['单词'] == 0) { break }
  textColor = textColors[ key%(textColors.length)]
   
  var obj = {}
  objLs.push(obj) //物件列表
  obj.g = wordGp.addGroup();
  obj.zhWord = wordCfg.data[key].zh
  obj.enWord = wordCfg.data[key].en
  obj.img = wordCfg.data[key].img
  //----时间
  obj.en4m = wordCfg.data[key].en4m
  obj.en4f = wordCfg.data[key].en4f
  obj.zh4m = wordCfg.data[key].zh4m
  obj.zh4f = wordCfg.data[key].zh4f
  //----创建单词
  obj.zh = obj.g.addText(obj.zhWord, { position: [0.2, 1], opacity: 0.9, scale: 0.59, color: textColor })
  obj.en = obj.g.addText(obj.enWord, { position: [0.2, -0.6], opacity: 0.9, scale: 0.59, color: textColor })
  //---英标图片
  //obj.ph = obj.g.addImage(srcDt['音标'], { x: 0.2, y: 0, scale: 0.38 })
  obj.ph = obj.g.addImage('src/en500word/' + obj.img, { x: 0.2, y: 0, scale: 0.38 })

  const inout = 0.4 
  
  const wordIn = 0.8
  
  //---女老师in
  teacher.f.moveTo({ y: -0.4, x: -4, duration: inout * fast, ease: "expo.out" })
  //----朗读
  obj.zh.flyIn({ t: ">", duration: wordIn * fast });//zh字入场
  //闪一下(obj.zh) //0.6秒耗时
  进度线(obj.zh4f * fast, 0.2, 0.4)//中文线
  obj.en.typeText({ duration: (wordIn+0.8) * fast }); //en字入场//typeText() //transformTexTo平滑过渡
  obj.ph.wipeIn({  duration:0.001 * fast, ease: "power4.out" })
  
  //闪一下(obj.en) //0.6秒耗时 //异步才能获取坐标 object3D
  进度线(obj.en4f * fast, 0.2, -1.3)//英文线
  //----女老师out
  teacher.f.moveTo({ t: ">", y: -0.4, x: -10, duration: inout * fast, ease: "expo.in" })
  //----男老师in
  teacher.m.moveTo({ t: ">", y: -0.4, x: -4, duration: inout * fast, ease: "expo.out" })
  //----朗读
  //obj.zh.flyIn({ duration: 1.1 });
  闪一下(obj.zh) //0.6秒耗时
  进度线(obj.zh4m * fast, 0.2, 0.4)//中文线
  //obj.en.wipeIn({ duration: 1.1 });
  闪一下(obj.en) //0.6秒耗时 //异步才能获取坐标 object3D
  进度线(obj.en4m * fast, 0.2, -1.3)//英文朗读线
  //----男老师out
  teacher.m.moveTo({ y: -0.4, x: -10, duration: inout * fast, ease: "expo.in" })

  // code block to be executed
  console.log('word', wordCfg.data[key])
  //mo.pause(0.5 * fast);
  //----移到旁边
  obj.ph.changeOpacity(0, { t: ">", duration: 0.3 * fast, ease: "expo.in" })//隐藏音标
  if (key % 2) {
    console.log('左边')
    移到一边(obj.en, startx, starty) //0.6秒耗时
    移到一边(obj.zh, startx, starty - 0.3)//0.6秒耗时
    if (key != 0) { starty = starty - 0.8 }
  } else {
    console.log('右边')
    移到一边(obj.en, startx * -1 + 0.2, starty) //0.6秒耗时
    移到一边(obj.zh, startx * -1 + 0.2, starty - 0.3) //0.6秒耗时
  }
}

//---排列组合
//fast = 0.001
if (movieSlice['排列'] == 1) {
  //fast = 0
  var defy = 1.5 //默认y
  var defx = -4.2//默认x
  var starty = defy
  var offa = 0
  var offb = 0
  var wsize = 1.44
  var tmpLs = _.range(objLs.length);
  var tmpInt = 0;
  for (let key in objLs) {

    if (parseInt(key) + 1 <= objLs.length / 2) {
      starty = defy
      offa = offa + 1
      startx = offa * wsize + defx
    } else {
      starty = defy - 0.8
      offb = offb + 1
      startx = offb * wsize + defx
    }
    //en配列1.1秒
    objLs[key].en.moveTo({ t: "<", y: starty, x: startx, duration: 1.1 * fast, ease: "expo.in" })
    objLs[key].en.scaleTo(0.19, { t: "<", duration: 0.5 * fast, ease: "expo.in" })
    //--en横线
    objLs[key].enLine = objLs[key].g.addRect({ x: startx, y: starty - 0.2, width: 0.8, height: 0.03, color: "#44abda" })
    //objLs[key].enLine.show({ duration: 0 })
    //objLs[key].enLine.scaleXTo(0, { t: ">", duration: 1*fast, ease: "none" })
    //--zh横线
    objLs[key].zhLine = objLs[key].g.addRect({ x: startx, y: starty - 0.6, width: 0.8, height: 0.03, color: "#44abda" })

  }
  //---排列中文
  mo.pause(1 * fast); //排列等待
  var tmpLs = _.range(objLs.length);
  var tmpInt = 0;
  offa = 0
  offb = 0
  var defy = -0.4 //中文y默认
  for (let key in objLs) {

    if (parseInt(key) + 1 <= objLs.length / 2) {
      starty = defy
      offa = offa + 1
      startx = offa * wsize + defx
    } else {
      starty = defy - 0.8
      offb = offb + 1
      startx = offb * wsize + defx
    }
    //zh配列1.1秒
    tmpInt = tmpLs.splice(_.random(0, tmpLs.length - 1), 1)[0]
    objLs[tmpInt].zh.moveTo({ t: "<", y: starty, x: startx, duration: 1.1 * fast, ease: "expo.in" })
    objLs[tmpInt].zh.scaleTo(0.19, { t: "<", duration: 0.5 * fast, ease: "expo.in" })

  }

  //---最后朗读选择
  var lineLong = mo.addRect({ x: 0, y: -1.55, width: 7, height: 0.03, color: "#63B14B" })//.changeOpacity(0,{ duration: 0.0001 })
  offa = 0
  offb = 0
  defy = 1.1 //默认y
  for (let key in objLs) {
    //----时间
    obj.en4m = wordCfg.data[key].en4m
    obj.zh4m = wordCfg.data[key].zh4m
    //---en朗读一次 0.4秒
    objLs[key].en.changeOpacity(1, { duration: 0.4 * fast, ease: "none" }) //
    objLs[key].enLine.fadeIn({ duration: 0 })
    objLs[key].enLine.scaleXTo(0, { duration: obj.en4m * fast, ease: "none" }) //英文朗读线

    //等待线 1.5秒
    lineLong.changeOpacity(1, { duration: 0.0001 * fast, ease: "expo.in" })
    lineLong.changeColor("#63B14B", { duration: 0.0001 * fast })
    lineLong.wipeIn({ duration: 1.5 * fast, ease: "slow" });
    lineLong.changeColor("#EF8485", { t: "<", duration: 1 * fast, ease: "none" })
    lineLong.changeOpacity(0, { duration: 0.0001 * fast, ease: "expo.in" })
    //lineLong.spinning({   duration:0.001});

    //移动答案1秒
    if (parseInt(key) + 1 <= objLs.length / 2) {
      starty = defy
      offa = offa + 1
      startx = offa * wsize + defx
    } else {
      starty = defy - 0.8
      offb = offb + 1
      startx = offb * wsize + defx
    }
    objLs[key].zh.changeOpacity(1, { duration: 0.4 * fast, ease: "none" })//取消文字半透明
    objLs[key].zh.moveTo({ y: starty, x: startx, duration:0.6  * fast, ease: "expo.inOut" })

    //朗读中文
    objLs[key].zhLine.fadeIn({ duration: 0 })
    objLs[key].zhLine.scaleXTo(0, { t: ">", duration: obj.zh4m * fast, ease: "none" }) //中文朗读线


  }
}
//fast = 0.001
wordGp.moveTo({ y: -1, x: 0, duration: 1 * fast, ease: "expo.inOut" }) //退场3秒
mo.pause(1.5 * fast);
wordGp.implode2D({ duration: 1.1 * fast, ease: "back.in" })
//-----附带推广  ()
//fast = 1
var endGp = mo.addGroup();
var endOgj = {}

endOgj.t1 = endGp.addText("学会了",
  { position: [-8, 1.2], opacity: 1, scale: 0.29, color: "#0a0a0a" });
endOgj.t11 = endGp.addText("点个关注或赞！",
  { position: [8, 1.2], opacity: 1, scale: 0.29, color: "#0a0a0a" });
endOgj.t2 = endGp.addText("看视频没学会",
  { position: [-8, 0.5], opacity: 1, scale: 0.2, color: "#0a0a0a" });
endOgj.t22 = endGp.addText("试试交互式学习。",
  { position: [8, 0.5], opacity: 1, scale: 0.2, color: "#0a0a0a" });
//--二维码
var qCodeGp = mo.addGroup();
qCodeGp.moveTo({ y: -5, duration: 0 * fast, ease: "expo.out" });
var qCodeOgj = {}
qCodeOgj.img = qCodeGp.addImage('src/en500word/' + wordCfg.qrcode, { z: 55, x: -2.2, y: -1, scale: 1.5 }) //scale缩放 
qCodeOgj.text = qCodeGp.addText("扫描进入交互",
  { position: [-2.34, -0.16], opacity: 1, scale: 0.12, color: "#0a0a0a" });

//--二维码
var groupGp = mo.addGroup();
groupGp.moveTo({ y: -5, duration: 0 * fast, ease: "expo.out" });
var groupOgj = {}
groupOgj.img = groupGp.addImage('src/qqgroup2.jpg', { z: -99, x: 1.59, y: -1, scale: 1.3 }) //scale缩放 
groupOgj.text = groupGp.addText("英语角（QQ群:280965346）",
  { position: [1.95, -0.16], opacity: 1, scale: 0.12, color: "#0a0a0a" });
//---结尾文字动画

endOgj.t1.moveTo({ x: -2.25, duration: 0.5 * fast, ease: "expo.out" });
endOgj.t11.moveTo({ x: 0.05, duration: 1 * fast, ease: "expo.out" });
mo.pause(1.1 * fast);
endOgj.t2.moveTo({ x: -0.5, duration: 0.8 * fast, ease: "expo.out" });
mo.pause(0.8 * fast);
endOgj.t22.moveTo({ x: 1.7, duration: 1 * fast, ease: "expo.out" });
mo.pause(0.8 * fast);
//---添加二维码动画
qCodeGp.moveTo({ y: 0, duration: 0.5 * fast, ease: "expo.out" });
mo.pause(1.1 * fast);
groupGp.moveTo({ y: 0, duration: 0.5 * fast, ease: "expo.out" });
mo.pause(3 * fast);


