import * as mo from "movy";

// one.js
import _ from 'lodash';


//webpack
var fs = require("fs");

var path = require("path");
//载入配置文件
const srcCfg = require('./src.json');
const wordCfg = require('D:/jack/eng-amt/en500word/1/1/cfg_11.json');
let word, srcPath;


srcPath = srcCfg['imgRoot']//'./t123456_img/'
console.log('cfg==', srcCfg, wordCfg, wordCfg.toString())



let srcDt = {
    "背景01": "./src/黑白白板.png"
    , "教师04": "./src/教师4.png"
    , "教师07": "./src/老师7.png"
    , "音标": "./src/大猩猩.png"
    
}

var fast  = 1

/* seed */
mo.cameraMoveTo({ zoom: 1.5, duration: 0 }); //横向移动摄像机
//-----背景
let bgImg
let bgGroup = mo.addGroup();
let bg = bgGroup.addRect({ z: -100, scale: 20, color: "#ffffff" });
let imgBg = srcDt['背景01']//'./src/bg-palnt3.png';//雨雾草 v1
//bgImg = bgGroup.addImage(imgBg, {z:-99,y:-2.1,x:0,scale:3.6})

//imgBg =  './src/grass.jpg';//草原 v2
bgImg = bgGroup.addImage(imgBg, { z: -99, y: 0, x: 0, scale: 6.0 }) //缩放7.5

mo.addText('每天说英语', { position: [-5.2, -2.6], opacity: 0.5, scale: 0.15, color: "#2a2a2a" })
mo.addText('Speak English Every Day', { position: [-4.70, -2.8], opacity: 0.5, scale: 0.13, color: "#2a2a2a" })

mo.addText('生活常用词500个', { position: [0.0, 2.4], opacity: 0.9, scale: 0.38, color: "#2a2a2a" })
    .wipeIn({ duration: 1 *fast})

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

//---老师进入/离开
//mo.pause(3); 
// teacher.m.changeOpacity(0.2,{ duration:1, ease: "expo.in"})
// teacher.m.moveTo({y:-0.4,x:-7.9 ,t: "<",duration:1, ease: "expo.in"})


// teacher.f.changeOpacity(0.2,{ duration:1, ease: "expo.in"})
// teacher.f.moveTo({y:-0.4,x:-7.9 ,t: "<",duration:1, ease: "expo.in"})


function 闪一下(obj) {
    obj.changeOpacity(0.5, { t: ">", duration: 0.3*fast, ease: "power2.in" })
    obj.changeOpacity(1, { t: ">", duration: 0.5*fast, ease: "power2.Out" })
}
function 进度线(t, x = 0.2, y = 0.3) {
    var lineOne = mo.addRect({ x: x, y: y, width: 2.8, height: 0.03, color: "#44abda" })
    lineOne.fadeIn({ duration: 0 })
    lineOne.scaleXTo(0, { t: ">", duration: t*fast, ease: "none" })
}
function 移到一边(obj, x, y) {
    obj.moveTo({ x: x, y: y, duration: 0.5 *fast})
    obj.changeOpacity(0.4, { t: "<", duration: 0.8*fast, ease: "expo.in" })
    obj.scaleTo(0.165, { t: "<", duration: 0.8*fast, ease: "expo.in" })
}
//-------循环生成字
var starty = 2
var startx = 4

var objLs = []
for (let key in wordCfg.data) {
    var obj = {}
    objLs.push(obj)
    obj.g = mo.addGroup();
    obj.zhWord = wordCfg.data[key].zh
    obj.enWord = wordCfg.data[key].en
    //----创建单词
    obj.zh = obj.g.addText(obj.zhWord, { position: [0.2, 1], opacity: 0.9, scale: 0.65, color: "#0a0a0a" })
    obj.en = obj.g.addText(obj.enWord, { position: [0.2, -0.8], opacity: 0.9, scale: 0.65, color: "#0a0a0a" })
    //---英标图片
    console.log(srcDt['音标'])
    obj.ph = obj.g.addImage(srcDt['音标'], { x: 0.2, y: -0.1, scale: 0.4 })
    

    //---老师in
    teacher.f.moveTo({ y: -0.4, x: -4.9, duration: 1.8*fast, ease: "expo.out" })
    //----单词朗读
    obj.zh.flyIn({ duration: 1.1*fast });
    闪一下(obj.zh)
    进度线(1*fast, 0.2, 0.4)//中文线
    obj.ph.wipeIn({ duration: 1.1*fast, ease: "power4.out" })
    obj.en.wipeIn({t:"<", duration: 1.1*fast });
    闪一下(obj.en) //异步才能获取坐标 object3D
    进度线(1*fast, 0.2, -1.5)
    //----老师out
    teacher.f.moveTo({ y: -0.4, x: -10, duration: 1.8*fast, ease: "expo.in" })
    //----老师in
    teacher.m.moveTo({ y: -0.4, x: -4.9, duration: 1.8*fast, ease: "expo.out" })
    //----单词朗读
    //obj.zh.flyIn({ duration: 1.1 });
    闪一下(obj.zh)
    进度线(1*fast, 0.2, 0.4)//中文线
    //obj.en.wipeIn({ duration: 1.1 });
    闪一下(obj.en) //异步才能获取坐标 object3D
    进度线(1*fast, 0.2, -1.5)
    teacher.m.moveTo({ y: -0.4, x: -10, duration: 1.8*fast, ease: "expo.in" })
    
    // code block to be executed
    console.log('word', wordCfg.data[key])
    mo.pause(1*fast );
    //----移动位置
    obj.ph.changeOpacity(0, { t: "<", duration: 0.1*fast, ease: "expo.in" })//隐藏音标
    if (key % 2) {
        console.log('左边')
        移到一边(obj.en, startx, starty)
        移到一边(obj.zh, startx, starty - 0.3)
        if (key != 0) { starty = starty - 0.8 }
    } else {
        console.log('右边')
        移到一边(obj.en, startx * -1 + 0.2, starty)
        移到一边(obj.zh, startx * -1 + 0.2, starty - 0.3)
    }
}

//---排列组合
fast = 0.5
var defy = 1.5 //默认y
var defx = -4.2//默认x
var starty = defy
var offa = 0
var offb = 0
var wsize = 1.44
var tmpLs = _.range(objLs.length);
var tmpInt = 0;
for (let key in objLs) {
    if(parseInt(key)+1<=objLs.length/2){
        starty = defy
        offa = offa +1   
        startx = offa  * wsize+ defx
    }else{
        starty = defy - 0.8
        offb = offb +1   
        startx = offb *  wsize +defx
    }
    objLs[key].en.moveTo({ t: "<", y: starty, x: startx, duration: 1.1*fast, ease: "expo.in" })
    objLs[key].en.scaleTo(0.19, {t: "<",  duration: 0.5*fast, ease: "expo.in" })
}
//---排列中文
mo.pause(1*fast );
var tmpLs = _.range(objLs.length);
var tmpInt = 0;
var offa = 0
var offb = 0
var defy = -0.4 //中文y默认
for (let key in objLs) {
    if(parseInt(key)+1<=objLs.length/2){
        starty = defy
        offa = offa +1   
        startx = offa  * wsize+ defx
    }else{
        starty = defy - 0.8
        offb = offb +1   
        startx = offb *  wsize +defx
    }
    tmpInt = tmpLs.splice(_.random(0, tmpLs.length-1), 1)[0]
    objLs[tmpInt].zh.moveTo({ t: "<", y: starty, x: startx, duration: 1.1*fast, ease: "expo.in" })
    objLs[tmpInt].zh.scaleTo(0.19, {t: "<",  duration: 0.5*fast, ease: "expo.in" })
}

function allPrpos(obj) {
    // 用来保存所有的属性名称和值
    _.forIn(obj, function (value, key) {

        // 方法
        if (typeof (value) == " function ") {
            console.log(key, '方法', value);
        } else {
            // p 为属性名称，obj[p]为对应属性的值

            console.log(key, '属性', value);
        }
    });



}
allPrpos(obj.zh)
console.log(JSON.stringify(Object.fromEntries(obj.zh.vertexToAnimate)))
console.log('obj====', obj.zh
    , 1
    , obj.zh.vertexToAnimate.get('TextMeshObject')
)

setTimeout(() => {
    console.log('3.url == ', window.location.href)
    allPrpos(obj.zh)
    console.log('3.object3D.position == ', obj.zh.object3D.position)
}, 2000)


//---单词开始
let lineOne
let wordOne = srcCfg['data'][7];//{"cn":"电吹风","en":"hair dryer","ph":"电吹风-ph.png",img:"电吹风.png","enTm":3,"cnTm":2} ;

let enTm = wordOne['enTm']
let cnTm = wordOne['cnTm']




//srcPath = './t123456_img/'


const wordGroup = mo.addGroup();
// let phText =  wordGroup.addText(wordOne['ph'],{ y:-2,font:"zh",  color:"#2a2a2a" })
// phText.reveal( { t:tm+=1.3, duration:1.3,ease:"power4.out"});


//------示意图
let img = wordGroup.addImage(srcPath + wordOne['img'], { x: 0, scale: 3.5 })
    .wipeIn({ direction: 'down', ease: "circ.in", duration: 2.1 })   //下拉幕
    .moveTo({ t: ">1", x: -2.1, scale: 2.8, duration: 0.8, ease: "power2.inOut" });

//-------------------单词

let ttx = 1.8
//----cn
let cnText = wordGroup.addText(wordOne['cn'], { x: ttx, y: 1, scale: 0.7, color: "#2a2a2a" })
cnText.wipeIn({ t: ">0.5", duration: 1.3, ease: "power4.out" });//拉幕
//text.  rotateTo (10,240,0,{duration :3})
//text.fadeOut(ea );
//闪一下
cnText.changeOpacity(0.5, { t: ">", duration: 0.3, ease: "power2.in" })
cnText.changeOpacity(1, { t: ">", duration: 0.5, ease: "power2.Out" })
//mo.pause(wordOne['cnTm'])//朗读时间

//----cn进度
lineOne = wordGroup.addRect({ x: ttx, y: 0.3, width: 2.8, height: 0.03, color: "#44abda" })
    .fadeIn()
//.wipeIn({  t:">", duration: 4  ,dir: "right",  ease:"power1.inOut"});
//朗读时间线
lineOne.scaleXTo(0, { t: ">", duration: cnTm, ease: "none" })
mo.pause(0.5)//朗读后等待
//------en
let enText = wordGroup.addText(wordOne['en'], { x: ttx, y: -0.9, scale: 0.7, color: "#2a2a2a" })
enText.wipeIn({ t: "+", duration: 1.3, ease: "power4.out" });//拉幕

//---------音标
wordGroup.addImage(srcPath + wordOne['phImg'], { x: ttx, y: -0.1, scale: 0.4 })
    .wipeIn({ t: "+", duration: 1.3, ease: "power4.out" })

//闪一下
enText.changeOpacity(0.5, { t: ">", duration: 0.3, ease: "power2.in" })
enText.changeOpacity(1, { t: ">", duration: 0.5, ease: "power2.Out" })

//----en进度线
lineOne = wordGroup.addRect({ x: ttx, y: -1.7, width: 2.8, height: 0.03, color: "#44abda" })
    .fadeIn()
//.wipeIn({  t:">", duration: 4  ,dir: "right",  ease:"power1.inOut"});
lineOne.scaleXTo(0, { t: ">", duration: enTm, ease: "none" })//朗读时间
mo.pause(0.5)//朗读后等待


//-------------------第二遍
mo.pause(0.5)//朗读前等待
//mo.pause(wordOne['enTm'])  //复读
//----cn
//闪一下
cnText.changeOpacity(0.5, { t: ">", duration: 0.3, ease: "power2.in" })
cnText.changeOpacity(1, { t: ">", duration: 0.5, ease: "power2.Out" })
//mo.pause(wordOne['cnTm'])//朗读时间

//----cn进度线
lineOne = wordGroup.addRect({ x: ttx, y: 0.3, width: 2.8, height: 0.03, color: "#44abda" })
    .fadeIn()
//.wipeIn({  t:">", duration: 4  ,dir: "right",  ease:"power1.inOut"});
lineOne.scaleXTo(0, { t: ">", duration: cnTm, ease: "none" })//朗读时间
mo.pause(0.5)//朗读后等待
//------en
//闪一下
enText.changeOpacity(0.5, { t: ">", duration: 0.3, ease: "power2.in" })
enText.changeOpacity(1, { t: ">", duration: 0.5, ease: "power2.Out" })

//----en进度线
lineOne = wordGroup.addRect({ x: ttx, y: -1.7, width: 2.8, height: 0.03, color: "#44abda" })
    .fadeIn()
//.wipeIn({  t:">", duration: 4  ,dir: "right",  ease:"power1.inOut"});
lineOne.scaleXTo(0, { t: ">", duration: enTm, ease: "none" })//朗读时间
mo.pause(0.5)//朗读后等待


//------------------------离场
// let phText =  wordGroup.addText(word[2],{ y:-2,font:"zh",  color:"#2a2a2a" })
// phText.reveal( { t:tm+=1.3, duration:1.3,ease:"power4.out"});
mo.pause(0.5)//等
//mo.pause(wordOne['enTm'])  
wordGroup.moveTo({ t: ">", y: -5, scale: 0, duration: 1, ease: "power2.inOut" });

