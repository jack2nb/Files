import * as mo from "movy";

// one.js
import _ from 'lodash';


//webpack
var fs = require("fs");

//var path = require("path");
//载入配置文件
const srcCfg = require('./src.json');
const wordCfg = require('D:/jack/eng-amt/en500word/1/9/cfg_19.json');//.\\.\\en500word\\0\\1\\cfg_1.json
let srcPath;

srcPath = srcCfg['imgRoot']//'./t123456_img/'
console.log('cfg==', srcCfg, wordCfg, wordCfg.toString())

var fast = 1 //耗时1秒 标准单位
var dur = 0.000001
let srcDt = {
  "背景01": "./src/黑白白板.png"
  , "教师女": "./src/教师4.png"
  , "教师男": "./src/老师7.png"
  , "点赞": "./src/点赞4.png"
  , "关注": "./src/加关注 (1).png"
  , "转发": "./src/转发9 (1).png"
  //, "音标": "./src/大猩猩.png"

}
const movieSlice = { "片头": 1, "单词": 1, "排列": 1, "片尾": 1 }
let setpObj = {}
const stepGp = mo.addGroup();






/* seed */
mo.cameraMoveTo({ zoom: 1.5, duration: 0 }); //横向移动摄像机
//-----背景
let bgImg, wordTitle
let bgGroup = mo.addGroup();
//let bg = bgGroup.addRect({ z: -100, scale: 20, color: "#ffffff" });
let imgBg = srcDt['背景01']//'./src/bg-palnt3.png';//雨雾草 v1
//bgImg = bgGroup.addImage(imgBg, {z:-99,y:-2.1,x:0,scale:3.6})

//imgBg =  './src/grass.jpg';//草原 v2
bgImg = bgGroup.addImage(imgBg, { z: -99, y: 0, x: 0, scale: 6.0 }) //scale缩放7.5

mo.addText('每天说英语', { position: [-5.2, -2.6], opacity: 0.5, scale: 0.15, color: "#2a2a2a" })
mo.addText('Speak English Every Day', { position: [-4.70, -2.8], opacity: 0.5, scale: 0.13, color: "#2a2a2a" })
if (movieSlice['片头'] == 1) {
  //fast = 0.001
  // wordTitle = mo.addTex('生活常用词500个', {  font: 'gdh',position: [0.0, 2.5], opacity: 0.9, scale: 0.38, color: "#2a2a2a"  })
  // wordTitle.wipeIn({ duration: 0.5 * fast});

  wordTitle = mo.addText('生活常用词500个/'+wordCfg['rid'], { position: [0.0, 2.5], opacity: 0.9, scale: 0.38, color: "#2a2a2a" });
  wordTitle.typeText({ duration: 0.5 * fast });//duration耗时  
  mo.addText('单词量是学好英语的基石', { position: [0.0, 2], opacity: 0.7, scale: 0.14, color: "#2a2a2a" })
    .typeText({ t: ">", duration: 0.5 * fast });//duration耗时  
  //mo.pause(2 * fast); //魔殊琪 朗读标题
  //点赞
  setpObj.word = stepGp.addText('先学后练-10个', { position: [0.0, 0.2], opacity: 0.9, scale: 0.5, color: "#2a2a2a" })
  setpObj.word.grow({ t: ">", duration: 1.6 * fast, ease: "power4.out" }) //入
  setpObj.img1 = stepGp.addImage(srcDt['点赞'], { z: -99, y: 1, x: -0.8, scale: 0.6 }) //点赞1
  setpObj.img2 = stepGp.addImage(srcDt['点赞'], { z: -99, y: 1, x: 0, scale: 0.6 }) //点赞2
  setpObj.img3 = stepGp.addImage(srcDt['点赞'], { z: -99, y: 1, x: 0.8, scale: 0.6 }) //点赞3
  setpObj.img1.grow({ t: "<", duration: 0.5 * fast, ease: "power4.in" }) //入
  setpObj.img2.grow({ t: "<", duration: 1 * fast, ease: "power4.in" }) //入
  setpObj.img3.grow({ t: "<", duration: 1.6 * fast, ease: "power4.in" }) //入
  setpObj.word.moveTo({ y: -8, duration: 0.6 * fast, ease: "power4.in" }) //出
  setpObj.img1.moveTo({ t: "<", y: -8, duration: 0.6 * fast, ease: "power4.in" }) //出
  setpObj.img2.moveTo({ t: "<", y: -8, duration: 0.6 * fast, ease: "power4.in" }) //出
  setpObj.img3.moveTo({ t: "<", y: -8, duration: 0.6 * fast, ease: "power4.in" }) //出
  //.fadeOut({ t: ">",  duration: 1.4 * fast, ease: "power2.Out" })
}
//------老师
let teacher = {}

//------女老师
let teacherF = mo.addGroup();
teacher.f = teacherF.addImage(srcDt['教师女'], { z: 98, y: -0.4, x: -10, scale: 3.8 })//.changeOpacity(0.9,{  duration:0})
//teacher.f .fadeOut( {  duration: 0 })
//------男老师
let teacherM = mo.addGroup();
teacher.m = teacherM.addImage(srcDt['教师男'], { z: 98, y: -0.4, x: -10, scale: 2.8 })//.changeOpacity(0.9,{  duration:0})
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

function 移到一边(obj, x, y, t = '<') {
  //var t='<';
  //0.8秒耗时
  obj.moveTo({ t: t, x: x, y: y, duration: 0.6 * fast })
  obj.changeOpacity(0.4, { t: t, duration: 0.6 * fast, ease: "expo.in" })
  obj.scaleTo(0.165, { t: t, duration: 0.6 * fast, ease: "expo.in" })
}
//---进度号码
let currentNum = 11
let showNum = mo.addTex( '', {   duration: dur, scale: 2, color: "#2a2a2a" })
showNum.show({ duration :dur , t:'<' })
showNum.changeOpacity(0.07, { t: "<", duration: dur})
showNum = showNum.transformTexTo(  '', { font: 'en', t: "<", opacity: 0.07, scale: 2,duration: dur })
//#######循环生学习
const inout = 0.2
const wordIn = 0.5

var starty = 2
var startx = 4
var textColor;
var textColors = ['blue', 'teal', 'brown', 'indigo', 'purple'];
var wordGp = mo.addGroup();
var objLs = []
//fast = 0.001
for (let key in wordCfg.data) {
  if (movieSlice['单词'] == 0) { break }
  textColor = textColors[key % (textColors.length)]

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
  obj.zh = obj.g.addText(obj.zhWord, { font: 'gdh', position: [0, 1], opacity: 0.9, scale: 0.59, color: textColor })
  obj.en = obj.g.addText(obj.enWord, { position: [0, -0.6], opacity: 0.9, scale: 0.59, color: textColor })
  //---英标图片
  //obj.ph = obj.g.addImage(srcDt['音标'], { x: 0.2, y: 0, scale: 0.38 })
  obj.ph = obj.g.addImage('src/en500word/' + obj.img, { x: 0, y: 0, scale: 0.38 })

  //--进度号码

  
  currentNum = currentNum - 1
  showNum = showNum.transformTexTo(currentNum + '', { font: 'en', t: "<", opacity: 0.07, scale: 3,duration: dur })
  showNum.changeOpacity(0.07, { t: "<", duration: dur})

  //---女老师in
  teacher.f.moveTo({ y: -0.4, x: -4, duration: inout * fast, ease: "expo.out" })
  obj.zh.flyIn({ t: ">", duration: wordIn * fast });//zh字入场
  //----
  进度线(obj.zh4f * fast, 0, 0.4)//中文朗读线
  obj.en.typeText({ duration: (wordIn + 0.8) * fast }); //en字入场//typeText() //transformTexTo平滑过渡
  obj.ph.wipeIn({ duration: 0.0001 * fast, ease: "power4.out" })

  //闪一下(obj.en) //0.6秒耗时 //异步才能获取坐标 object3D
  进度线(obj.en4f * fast, 0, -1.3)//英文朗读线
  //----女老师out
  teacher.f.moveTo({ t: ">", y: -0.4, x: -10, duration: inout * fast, ease: "expo.in" })
  //----男老师in
  teacher.m.moveTo({ t: ">", y: -0.4, x: -4, duration: inout * fast, ease: "expo.out" })
  //----朗读
  //obj.zh.flyIn({ duration: 1.1 });
  闪一下(obj.zh) //0.8秒耗时
  进度线(obj.zh4m * fast, 0, 0.4)//中文线
  //obj.en.wipeIn({ duration: 1.1 });
  闪一下(obj.en) //0.8秒耗时 //异步才能获取坐标 object3D
  进度线(obj.en4m * fast, 0, -1.3)//英文朗读线
  //----男老师out
  teacher.m.moveTo({ y: -0.4, x: -10, duration: inout * fast, ease: "expo.in" })

  // code block to be executed
  //console.log('word', wordCfg.data[key])
  //mo.pause(0.5 * fast);
  //----移到旁边
  obj.ph.changeOpacity(0, { t: ">", duration: 0.3 * fast, ease: "expo.in" })//隐藏音标
  if (key % 2) {
    console.log('左边')
    移到一边(obj.en, startx, starty - 0.3, '<') //0.6秒耗时
    移到一边(obj.zh, startx, starty, '<')//0.6秒耗时
    if (key != 0) { starty = starty - 0.8 }
  } else {
    console.log('右边')
    移到一边(obj.en, startx * -1 + 0.2, starty - 0.3, '<') //0.6秒耗时
    移到一边(obj.zh, startx * -1 + 0.2, starty, '<') //0.6秒耗时
  }


}
showNum.changeOpacity(0, { t: "<", duration: dur })
//关注
setpObj.word = stepGp.addText('互动--抢答', { position: [0.0, 0.2], opacity: 0.9, scale: 0.5, color: "#2a2a2a" })
setpObj.word.grow({ t: ">", duration: 1.6 * fast, ease: "power4.out" }) //入
setpObj.img1 = stepGp.addImage(srcDt['关注'], { z: -99, y: 1, x: -0.8, scale: 0.6 }) //点赞1
setpObj.img2 = stepGp.addImage(srcDt['关注'], { z: -99, y: 1, x: 0, scale: 0.6 }) //点赞2
setpObj.img3 = stepGp.addImage(srcDt['关注'], { z: -99, y: 1, x: 0.8, scale: 0.6 }) //点赞3
setpObj.img1.grow({ t: "<", duration: 0.5 * fast, ease: "power4.in" }) //入
setpObj.img2.grow({ t: "<", duration: 1 * fast, ease: "power4.in" }) //入
setpObj.img3.grow({ t: "<", duration: 1.6 * fast, ease: "power4.in" }) //入
setpObj.word.moveTo({ y: -8, duration: 0.6 * fast, ease: "power4.in" }) //出
setpObj.img1.moveTo({ t: "<", y: -8, duration: 0.6 * fast, ease: "power4.in" }) //出
setpObj.img2.moveTo({ t: "<", y: -8, duration: 0.6 * fast, ease: "power4.in" }) //出
setpObj.img3.moveTo({ t: "<", y: -8, duration: 0.6 * fast, ease: "power4.in" }) //出


// ######## 排列组合
//fast = 0.001
if (movieSlice['排列'] == 1) {
  //fast = 0
  // var defy = 1.5 //默认y
  // var defx = -4.2//默认x
  var starty = defy
  var offa = 0
  var offb = 0
  var wsize = 1.44

  //---中文排列到中间
  mo.pause(1 * fast); //排列等待
  var tmpLs = _.range(objLs.length);
  var tmpInt = 0;
  offa = 0
  offb = 0
  var defy = -0.8 //中文y默认
  var defx = -2.9//默认x
  for (let key in objLs) {
    //--en横线
    objLs[key].enLine = objLs[key].g.addRect({ x: 0, y: 0.6, width: 0.8, height: 0.03, color: "#44abda" })
    //--zh横线
    objLs[key].zhLine = objLs[key].g.addRect({ x: 0, y: -0.2, width: 0.8, height: 0.03, color: "#44abda" })
    if (parseInt(key) + 1 <= objLs.length / 2) {
      starty = defy
      offa = offa + 0.7
      startx = offa * wsize + defx
    } else {
      starty = defy - 0.5
      offb = offb + 0.7
      startx = offb * wsize + defx
    }
    //zh配列0.5秒
    tmpInt = tmpLs.splice(_.random(0, tmpLs.length - 1), 1)[0]
    objLs[tmpInt].zh.moveTo({ t: "<", y: starty, x: startx, duration: 0.5 * fast, ease: "expo.out" })
    objLs[tmpInt].zh.scaleTo(0.2, { t: "<", duration: 0.5 * fast, ease: "expo.in" })
    objLs[tmpInt].zh.changeOpacity(1, { t: "<", duration: 0.5 * fast, ease: "none" }) //

  }

  //---循环最后朗读选择
  //var lineLong = mo.addRect({ x: 0, y: -1.65, width: 7, height: 0.03, color: "#63B14B" })//.changeOpacity(0,{ duration: 0.0001 })
  function 等待选择() {

    var dot = mo.addTex('?', { font: 'en', opacity: 0.9, scale: 0.5, color: "green" })
    dot.show()
    //闪一下(dot)
    dot.changeOpacity(0.1, { t: ">", duration: 0.4 * fast, ease: "power2.in" })
    dot.changeOpacity(0.9, { t: ">", duration: 0.4 * fast, ease: "power2.Out" })
    dot.changeOpacity(0, { t: ">", duration: 0.7 * fast, ease: "power2.in" })//1.5-0.8 0.7
    // dot.transformTexTo('. .',{ font: 'en' ,  duration: 0.5 * fast,   ease: "expo.in"   })
    // .transformTexTo('.',{ font: 'en' ,   duration: 0.5 * fast,  ease: "expo.in"   })
    // .transformTexTo('',{ font: 'en' ,   duration: 0.5 * fast,   ease: "expo.in"  })   
  }
  currentNum = 0;
  for (let key in objLs) {
    //----时间
    obj.en4m = wordCfg.data[key].en4m
    obj.zh4m = wordCfg.data[key].zh4m
    //移动英文 0.5  + 0.8
    objLs[key].en.moveTo({ t: ">", y: 1.2, x: 0, duration: 0.5 * fast, ease: "expo.in" })
    objLs[key].en.changeOpacity(1, { t: "<", duration: 0.5 * fast, ease: "none" }) //
    objLs[key].en.scaleTo(0.6, { t: "<", duration: 0.5 * fast, ease: "expo.in" })
    //--进度号码
    mo.pause(dur)
    currentNum = currentNum + 1
    showNum = showNum.transformTexTo(currentNum + '', { font: 'en', t: "<", opacity: 0.5, duration: dur })
    showNum.changeOpacity(0.07, { t: "<", duration: dur })

    闪一下(objLs[key].en) //0.8秒耗时
    //---en朗读线  
    objLs[key].enLine.fadeIn({ duration: 0 })
    objLs[key].enLine.scaleXTo(0, { duration: obj.en4m * fast, ease: "none" }) //英文朗读线

    等待选择(); //1.5s

    //移动中文答案0.6
    objLs[key].zh.moveTo({ y: 0.2, x: 0, duration: 0.6 * fast, ease: "expo.inOut" })
    objLs[key].zh.changeOpacity(0.9, { t: "<", duration: 0.6 * fast, ease: "none" })//取消文字半透明
    objLs[key].zh.scaleTo(0.35, { t: "<", duration: 0.6 * fast, ease: "expo.inOut" })
    //中文朗读线
    objLs[key].zhLine.fadeIn({ duration: 0 })
    objLs[key].zhLine.scaleXTo(0, { t: ">", duration: obj.zh4m * fast, ease: "none" }) //中文朗读线

    //移除单词组
    //objLs[key].zh.implode2D({ duration: 1 * fast, ease: "back.in" })
    objLs[key].zh.moveTo({ y: 0.4, duration: 0.8 * fast, ease: "expo.in" })
    objLs[key].zh.scaleTo(0.0, { t: "<", duration: 0.8 * fast, ease: "expo.in" })
    //objLs[key].en.implode2D({ t: "<",  duration: 1 * fast, ease: "back.in" })
    objLs[key].en.moveTo({ y: 0.4, t: "<", duration: 0.8 * fast, ease: "expo.in" })
    objLs[key].en.scaleTo(0.0, { t: "<", duration: 0.8 * fast, ease: "expo.in" })

  }
}
fast = 1
// wordGp.moveTo({ y: -1, x: 0, duration: 1 * fast, ease: "expo.inOut" }) //退场3秒
// mo.pause(1.5 * fast);
// wordGp.implode2D({ duration: 1.1 * fast, ease: "back.in" })
//  ####### 推广互动式
//转发
showNum.changeOpacity(0, { t: "<", duration: dur }) //最后隐藏
showNum.moveTo({ t: "<", y: -8, duration: dur * fast }) //出
mo.pause(dur)
setpObj.word = stepGp.addText('交互式--连连看', { position: [0.0, 0.2], opacity: 0.9, scale: 0.5, color: "#2a2a2a" })
setpObj.word.grow({ t: ">", duration: 1.6 * fast, ease: "power4.out" }) //入
setpObj.img1 = stepGp.addImage(srcDt['转发'], { z: -99, y: 1, x: -1.5, scale: 0.6 }) //点赞1
setpObj.img2 = stepGp.addImage(srcDt['转发'], { z: -99, y: 1, x: 0, scale: 0.6 }) //点赞2
setpObj.img3 = stepGp.addImage(srcDt['转发'], { z: -99, y: 1, x: 1.5, scale: 0.6 }) //点赞3
setpObj.img1.grow({ t: "<", duration: 0.5 * fast, ease: "power4.in" }) //入
setpObj.img2.grow({ t: "<", duration: 1 * fast, ease: "power4.in" }) //入
setpObj.img3.grow({ t: "<", duration: 1.6 * fast, ease: "power4.in" }) //入
setpObj.word.moveTo({ y: -8, duration: 0.6 * fast, ease: "power4.in" }) //出
setpObj.img1.moveTo({ t: "<", y: -8, duration: 0.6 * fast, ease: "power4.in" }) //出
setpObj.img2.moveTo({ t: "<", y: -8, duration: 0.6 * fast, ease: "power4.in" }) //出
setpObj.img3.moveTo({ t: "<", y: -8, duration: 0.6 * fast, ease: "power4.in" }) //出


var tmpLs = _.range(10);
var tmpInt = 0;
var defy = 1.6 //中文y默认
var zhx = -1.5//默认x
var enx = 1.5//默认x
var offy = -0.5
var zhpositions = []
var enpositions = []
var wordIds = []
starty = defy
for (let key in _.range(5)) {
  //计算位置
  starty = starty + offy
  tmpInt = tmpLs.splice(_.random(0, tmpLs.length - 1), 1)[0] //取出一个
  wordIds.push(tmpInt)
  zhpositions.push([zhx, starty])
  enpositions.push([enx, starty])
}
var enpost = []
var zhpost = []
var wordId = 0
var zhcnLine = {}
var lineGp = mo.addGroup()
for (let key in _.range(5)) {
  //打乱en位置、
  enpost = enpositions.splice(_.random(0, enpositions.length - 1), 1)[0] //随机取出一个
  wordId = wordIds[key]
  zhpost = zhpositions[key]
  console.log('enpost==', enpost)
  objLs[wordId].zh.moveTo({ t: "<", z: 100, x: zhpost[0], y: zhpost[1], duration: 1 * fast, ease: "expo.out" })
  objLs[wordId].zh.scaleTo(0.3, { t: "<", duration: 1 * fast, ease: "expo.in" })
  objLs[wordId].zh.changeOpacity(1, { t: "<", duration: 1 * fast, ease: "none" }) //
  objLs[wordId].en.moveTo({ t: "<", z: 100, x: enpost[0], y: enpost[1], duration: 1 * fast, ease: "expo.out" })
  objLs[wordId].en.scaleTo(0.3, { t: "<", duration: 1 * fast, ease: "expo.in" })
  objLs[wordId].en.changeOpacity(1, { t: "<", duration: 1 * fast, ease: "none" }) //
  zhcnLine[key] = lineGp.addLine({
    from: [zhpost[0] + 0.8, zhpost[1]],
    to: [enpost[0] - 0.8, enpost[1]],
    lineWidth: 0.02,
    color: textColors[key],
  });
}
mo.pause(0.3 * fast)
for (let key in _.range(5)) {
  //连接线
  zhcnLine[key].grow({ t: ">", duration: 0.4 * fast, ease: "power4.out" })
}
//移到一边
mo.pause(0.5 * fast)
wordGp.moveTo({ t: "<", x: -2, duration: 1 * fast, ease: "expo.in" })
lineGp.moveTo({ t: "<", x: -2, duration: 1 * fast, ease: "expo.in" })
wordGp.changeOpacity(0, { t: "<", duration: 1 * fast, ease: "expo.in" }) //
lineGp.changeOpacity(0, { t: "<", duration: 1 * fast, ease: "expo.in" }) //
//fast = 1
// for (let key in _.range(5)) {
//   wordId = wordIds[key]
//   //zhcnLine[key].moveTo({ t: "<", z: 100, x: enpost[0], y: enpost[1], duration: 0.3 * fast, ease: "expo.out" })
//   //objLs[wordId].zh.moveTo({ t: "<", z: 100, x: enpost[0], y: enpost[1], duration: 0.3 * fast, ease: "expo.out" })
//   //objLs[wordId].en.moveTo({ t: "<", z: 100, x: enpost[0], y: enpost[1], duration: 0.3 * fast, ease: "expo.out" })
//   zhcnLine[key].changeOpacity(0, { t: "<", duration: 0.3 * fast, ease: "none" }) //
//   objLs[wordId].en.changeOpacity(0, { t: "<", duration: 0.3 * fast, ease: "none" }) //
//   objLs[wordId].zh.changeOpacity(0, { t: "<", duration: 0.3 * fast, ease: "none" }) //

// }

//fast = 0.001
// var endGp = mo.addGroup();
// var endOgj = {}

// endOgj.t1 = endGp.addText("学会",
//   { position: [-8, 1.2], opacity: 1, scale: 0.29, color: "#0a0a0a" });
// endOgj.t11 = endGp.addText("点个赞奖励自己！",
//   { position: [-8, 1.2], opacity: 1, scale: 0.29, color: "#0a0a0a" });
// endOgj.t2 = endGp.addText("看视频不过瘾",
//   { position: [-8, 0.5], opacity: 1, scale: 0.2, color: "#0a0a0a" });
// endOgj.t22 = endGp.addText("来交互式学习。",
//   { position: [8, 0.5], opacity: 1, scale: 0.2, color: "#0a0a0a" });
// //--二维码
var qCodeGp = mo.addGroup();
qCodeGp.moveTo({ y: -5, duration: 0 * fast, ease: "expo.out" });
var qCodeOgj = {}
qCodeOgj.img = qCodeGp.addImage('src/en500word/' + wordCfg.qrcode, { x: 0, y: -0.1, scale: 2.5 }) //scale缩放
qCodeGp.addText("扫描：试试交互",
  { position: [0, 1.3], opacity: 1, scale: 0.18, color: "#0a0a0a" });
qCodeGp.addText("英语角 QQ群:280965346 ",
  { position: [0, -1.5], opacity: 1, scale: 0.12, color: "#0a0a0a" });

// //---添加二维码动画
qCodeGp.moveTo({ y: 0, duration: 0.5 * fast, ease: "expo.out" });
//var title2 = mo.addText('一键三连', { position: [0.0, 2.5], opacity: 0.9, scale: 0.38, color: "#2a2a2a" })
wordTitle.moveTo({ y: 4, duration: 0.5 * fast, ease: "expo.out" })

var one3Gp = mo.addGroup();
one3Gp.addImage(srcDt['点赞'], { x: -1.5, y: 2.5, scale: 0.7 }).grow({ t: "<", duration: 0.5 * fast, ease: "power4.in" }) //入
one3Gp.addImage(srcDt['关注'], { x: 0, y: 2.5, scale: 0.5 }).grow({ t: "<", duration: 1 * fast, ease: "power4.in" }) //入
one3Gp.addImage(srcDt['转发'], { x: 1.5, y: 2.5, scale: 0.5 }).grow({ t: "<", duration: 1.6 * fast, ease: "power4.in" }) //入

mo.pause(3 * fast);


