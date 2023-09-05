import * as mo from "movy"; 
//webpack
var fs = require("fs");

var path = require("path");
//载入配置文件
const srcCfg = require('./src.json');
const wordCfg = require('D:/jack/eng-amt/en500word/1/1/cfg_11.json');

console.log('cfg==' ,srcCfg,wordCfg,wordCfg.toString())
 

 
let srcDt={"背景01":"./src/黑白白板.png","教师04":"./src/教师4.png"
}
 


/* seed */
mo.cameraMoveTo({ zoom:1.5,  duration: 0 }); //横向移动摄像机
//-----背景
let bgImg  
let bgGroup =  mo.addGroup( );
let bg = bgGroup.addRect({z:-100,scale:20,color: "#ffffff" });
let imgBg  = srcDt['背景01']//'./src/bg-palnt3.png';//雨雾草 v1
//bgImg = bgGroup.addImage(imgBg, {z:-99,y:-2.1,x:0,scale:3.6})

//imgBg =  './src/grass.jpg';//草原 v2
bgImg = bgGroup.addImage(imgBg, {z:-99,y:0,x:0,scale:6.0}) //缩放7.5

mo.addText('每天说英语',{ position:[-5.2,-2.6], opacity:0.5,scale:0.15,  color:"#2a2a2a" })
mo.addText('Speak English Every Day',{ position:[-4.70,-2.8], opacity:0.5,scale:0.13,  color:"#2a2a2a" })
 
mo.addText('生活常用词500个',{ position:[0.0,2.4], opacity:0.9,scale:0.38,  color:"#2a2a2a" })

//------背景卡片
//let imgCard  = './src/bg-card.png'; //卡片
//bgGroup.addImage(imgCard, {z:-98,y:0,x:0,scale:5.3})//.changeOpacity(0.9,{  duration:0})

//------女老师
let imgCard  = srcDt['教师04']; //卡片
bgGroup.addImage(imgCard, {z:-98,y:-0.4,x:-4.9,scale:3.5})//.changeOpacity(0.9,{  duration:0})




for (let key in wordCfg.data) {
    // code block to be executed
    console.log('word', wordCfg.data[key])
}


//---单词开始
let lineOne
let wordOne = srcCfg['data'][7] ;//{"cn":"电吹风","en":"hair dryer","ph":"电吹风-ph.png",img:"电吹风.png","enTm":3,"cnTm":2} ;

let enTm= wordOne['enTm']
let cnTm = wordOne['cnTm']

let word,srcPath ;

 

srcPath =  srcCfg['imgRoot']//'./t123456_img/'

//srcPath = './t123456_img/'

 
const wordGroup = mo.addGroup( );
// let phText =  wordGroup.addText(wordOne['ph'],{ y:-2,font:"zh",  color:"#2a2a2a" })
// phText.reveal( { t:tm+=1.3, duration:1.3,ease:"power4.out"});

 
//------示意图
let img = wordGroup.addImage(srcPath + wordOne['img'], {x:0,scale:3.5})
.wipeIn  ({ direction:'down', ease:  "circ.in",duration:2.1} )   //下拉幕
.moveTo({ t:">1",x: -2.1, scale:2.8,duration: 0.8 ,ease:"power2.inOut"});

//-------------------单词
 
let ttx = 1.8
//----cn
let cnText = wordGroup.addText(wordOne['cn'],{ x:ttx,y:1,scale:0.7,  color:"#2a2a2a" })
cnText.wipeIn( { t:">0.5", duration:1.3,ease:"power4.out"});//拉幕
//text.  rotateTo (10,240,0,{duration :3})
//text.fadeOut(ea );
//闪一下
cnText.changeOpacity(0.5,{ t:">", duration:0.3 ,ease:"power2.in"})
cnText.changeOpacity(1,{ t:">", duration:0.5 ,ease:"power2.Out"})
//mo.pause(wordOne['cnTm'])//朗读时间

//----cn进度
lineOne = wordGroup.addRect({x:ttx, y:0.3,width:2.8,height: 0.03, color: "#44abda" })
.fadeIn()
//.wipeIn({  t:">", duration: 4  ,dir: "right",  ease:"power1.inOut"});
//朗读时间线
lineOne.scaleXTo(0,{  t:">" , duration: cnTm   ,  ease:"none"})
mo.pause(0.5)//朗读后等待
//------en
let enText = wordGroup.addText(wordOne['en'],{ x:ttx,y:-0.9,scale:0.7,  color:"#2a2a2a" })
enText.wipeIn( { t:"+", duration:1.3,ease:"power4.out"});//拉幕

//---------音标
wordGroup.addImage(srcPath + wordOne['phImg'], {x:ttx,y:-0.1,scale:0.4})
.wipeIn  ({t:"+",duration:1.3,   ease:"power4.out"} )  
 
//闪一下
enText.changeOpacity(0.5,{ t:">", duration:0.3 ,ease:"power2.in"})
enText.changeOpacity(1,{ t:">", duration:0.5 ,ease:"power2.Out"})

//----en进度线
lineOne = wordGroup.addRect({x:ttx, y:-1.7,width:2.8,height: 0.03, color: "#44abda" })
.fadeIn()
//.wipeIn({  t:">", duration: 4  ,dir: "right",  ease:"power1.inOut"});
lineOne.scaleXTo(0,{  t:">" , duration: enTm    ,  ease:"none"})//朗读时间
mo.pause(0.5)//朗读后等待


//-------------------第二遍
mo.pause(0.5)//朗读前等待
//mo.pause(wordOne['enTm'])  //复读
//----cn
//闪一下
cnText.changeOpacity(0.5,{ t:">", duration:0.3 ,ease:"power2.in"})
cnText.changeOpacity(1,{ t:">", duration:0.5 ,ease:"power2.Out"})
//mo.pause(wordOne['cnTm'])//朗读时间

//----cn进度线
lineOne = wordGroup.addRect({x:ttx, y:0.3,width:2.8,height: 0.03, color: "#44abda" })
.fadeIn()
//.wipeIn({  t:">", duration: 4  ,dir: "right",  ease:"power1.inOut"});
lineOne.scaleXTo(0,{  t:">" , duration:cnTm    ,  ease:"none"})//朗读时间
mo.pause(0.5)//朗读后等待
//------en
//闪一下
enText.changeOpacity(0.5,{ t:">", duration:0.3 ,ease:"power2.in"})
enText.changeOpacity(1,{ t:">", duration:0.5 ,ease:"power2.Out"})

//----en进度线
lineOne = wordGroup.addRect({x:ttx, y:-1.7,width:2.8,height: 0.03, color: "#44abda" })
.fadeIn()
//.wipeIn({  t:">", duration: 4  ,dir: "right",  ease:"power1.inOut"});
lineOne.scaleXTo(0,{  t:">" , duration: enTm    ,  ease:"none"})//朗读时间
mo.pause(0.5)//朗读后等待


//------------------------离场
// let phText =  wordGroup.addText(word[2],{ y:-2,font:"zh",  color:"#2a2a2a" })
// phText.reveal( { t:tm+=1.3, duration:1.3,ease:"power4.out"});
mo.pause(0.5)//等
//mo.pause(wordOne['enTm'])  
wordGroup.moveTo({ t:">", y: -5 , scale:0 ,duration: 1 ,ease:"power2.inOut"});

