import * as mo from "movy";

// one.js
import _ from 'lodash';


//webpack
var fs = require("fs");

var path = require("path");
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

mo.addText('生活常用词500个', { position: [0.0, 2.4], opacity: 0.9, scale: 0.38, color: "#2a2a2a" })
    .wipeIn({ duration: 1 * fast }) //duration耗时

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
    obj.changeOpacity(0.5, { t: ">", duration: 0.3 * fast, ease: "power2.in" })
    obj.changeOpacity(1, { t: ">", duration: 0.5 * fast, ease: "power2.Out" })
}
function 进度线(t, x = 0.2, y = 0.3) {
    //耗时是参数
    var lineOne = mo.addRect({ x: x, y: y, width: 2.8, height: 0.03, color: "#44abda" })
    lineOne.fadeIn({ duration: 0 })
    lineOne.scaleXTo(0, { t: ">", duration: t * fast, ease: "none" })
    return lineOne
}
function 移到一边(obj, x, y) {
    //2.1秒耗时
    obj.moveTo({ x: x, y: y, duration: 0.5 * fast })
    obj.changeOpacity(0.4, { t: "<", duration: 0.8 * fast, ease: "expo.in" })
    obj.scaleTo(0.165, { t: "<", duration: 0.8 * fast, ease: "expo.in" })
}
//-------循环生成字 
var starty = 2
var startx = 4
var wordGp = mo.addGroup();
var objLs = []
for (let key in wordCfg.data) {
    var obj = {}
    objLs.push(obj)
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
    obj.zh = obj.g.addText(obj.zhWord, { position: [0.2, 1], opacity: 0.9, scale: 0.59, color: "#0a0a0a" })
    obj.en = obj.g.addText(obj.enWord, { position: [0.2, -0.6], opacity: 0.9, scale: 0.59, color: "#0a0a0a" })
    //---英标图片
    //obj.ph = obj.g.addImage(srcDt['音标'], { x: 0.2, y: 0, scale: 0.38 })
    obj.ph = obj.g.addImage('src/en500word/'+obj.img, { x: 0.2, y: 0, scale: 0.38 })

    var teacherMoveTime =  0.8
    //---女老师in
    teacher.f.moveTo({ y: -0.4, x: -4, duration: teacherMoveTime * fast, ease: "expo.out" })
    //----朗读
    obj.zh.flyIn({ duration:0.9 * fast });
    闪一下(obj.zh) //0.8秒耗时
    进度线(obj.zh4f * fast, 0.2, 0.4)//中文线
    obj.ph.wipeIn({ duration: 1.1 * fast, ease: "power4.out" })
    obj.en.wipeIn({ t: "<", duration: 1.1 * fast });
    闪一下(obj.en) //0.8秒耗时 //异步才能获取坐标 object3D
    进度线(obj.en4f * fast, 0.2, -1.5)//英文线
    //----女老师out
    teacher.f.moveTo({ y: -0.4, x: -10, duration: teacherMoveTime * fast, ease: "expo.in" })
    //----男老师in
    teacher.m.moveTo({ y: -0.4, x: -4, duration: teacherMoveTime * fast, ease: "expo.out" })
    //----朗读
    //obj.zh.flyIn({ duration: 1.1 });
    闪一下(obj.zh) //0.8秒耗时
    进度线(obj.zh4m * fast, 0.2, 0.4)//中文线
    //obj.en.wipeIn({ duration: 1.1 });
    闪一下(obj.en) //0.8秒耗时 //异步才能获取坐标 object3D
    进度线(obj.en4m * fast, 0.2, -1.5)//英文线
    //----男老师out
    teacher.m.moveTo({ y: -0.4, x: -10, duration: teacherMoveTime * fast, ease: "expo.in" })

    // code block to be executed
    console.log('word', wordCfg.data[key])
    mo.pause(1 * fast);
    //----移到旁边
    obj.ph.changeOpacity(0, { t: "<", duration: 0.1 * fast, ease: "expo.in" })//隐藏音标
    if (key % 2) {
        console.log('左边')
        移到一边(obj.en, startx, starty) //2.1秒耗时
        移到一边(obj.zh, startx, starty - 0.3)//2.1秒耗时
        if (key != 0) { starty = starty - 0.8 }
    } else {
        console.log('右边')
        移到一边(obj.en, startx * -1 + 0.2, starty) //2.1秒耗时
        移到一边(obj.zh, startx * -1 + 0.2, starty - 0.3) //2.1秒耗时
    }
}

//---排列组合
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
mo.pause(1 * fast);
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
    tmpInt = tmpLs.splice(_.random(0, tmpLs.length - 1), 1)[0]
    objLs[tmpInt].zh.moveTo({ t: "<", y: starty, x: startx, duration: 1.1 * fast, ease: "expo.in" })
    objLs[tmpInt].zh.scaleTo(0.19, { t: "<", duration: 0.5 * fast, ease: "expo.in" })

}
fast = 1
//---最后选择
var lineLong = mo.addRect({ x: 0, y: -1.55, width: 7, height: 0.03, color: "#63B14B" })
offa = 0
offb = 0
defy = 1.1 //默认y
for (let key in objLs) {
    //---朗读一次
    objLs[key].en.changeOpacity(1, {   duration: 0.8, ease: "none" })
    objLs[key].enLine.fadeIn({ duration: 0 })
    objLs[key].enLine.scaleXTo(0, {  duration: 1.5 * fast, ease: "none" })
    
    //等待线
    lineLong.changeOpacity(1, { duration: 0.001 * fast, ease: "expo.in" })
    lineLong.changeColor("#63B14B", { duration: 0.001 })
    lineLong.wipeIn({ duration: 2.5 * fast, ease: "slow" });
    lineLong.changeColor("#EF8485", { t: "<", duration: 2 * fast, ease: "none" })
    lineLong.changeOpacity(0, { duration: 0.001 * fast, ease: "expo.in" })
    //lineLong.spinning({   duration:0.001});
    //移动答案

    if (parseInt(key) + 1 <= objLs.length / 2) {
        starty = defy
        offa = offa + 1
        startx = offa * wsize + defx
    } else {
        starty = defy - 0.8
        offb = offb + 1
        startx = offb * wsize + defx
    }
    objLs[key].zh.changeOpacity(1, {   duration: 0.8, ease: "none" })//取消文字半透明
    objLs[key].zh.moveTo({ y: starty, x: startx, duration: 1.5 * fast, ease: "expo.inOut" })
    
    //朗读中文
    objLs[key].zhLine.fadeIn({ duration: 0 })
    objLs[key].zhLine.scaleXTo(0, { t: ">", duration: 1.5 * fast, ease: "none" })
    
    
}


wordGp.moveTo({ y: -1, x: 0, duration: 1 * fast, ease: "expo.inOut" })
mo.pause(1.5*fast); 
wordGp.implode2D({duration: 1.5 * fast, ease: "back.in" })
//-----附带推广


 
