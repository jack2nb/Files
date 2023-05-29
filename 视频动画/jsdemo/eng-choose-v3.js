import * as mo from "movy"; 

const srcCfg = require('./src.json');
console.log('cfg==' ,srcCfg)


/****
单词选择 

没有的东西 可以用图片 主要用到movy的动画功能和导出视频  

***/



mo.cameraMoveTo({ zoom:1.5,  duration: 0 }); //横向移动摄像机

//-----背景
let bgImg
let bgGroup =  mo.addGroup( );
let bg = bgGroup.addRect({z:-100,scale:20,color: "#ffffff" });
let imgBg  = './src/bg-palnt3.png';//雨雾草 v1
//bgImg = bgGroup.addImage(imgBg, {z:-99,y:-2.1,x:0,scale:3.6})

imgBg =  './src/grass.jpg';//草原 v2
bgImg = bgGroup.addImage(imgBg, {z:-99,y:0,x:0,scale:7.5})

mo.addText('每天说英语',{ position:[-5.2,-2.6], opacity:0.5,scale:0.15,  color:"#2a2a2a" })
mo.addText('Speak English Every Day',{ position:[-4.70,-2.8], opacity:0.5,scale:0.13,  color:"#2a2a2a" })
//imgBg =  './src/grass2.png';//草原  v3
//bgImg = bgGroup.addImage(imgBg, {z:-99,y:-2.10,x:0,scale:3.1})
//------背景卡片
let imgCard  = './src/bg-card.png'; //卡片
bgGroup.addImage(imgCard, {z:-98,y:0,x:0,scale:5.3})//.changeOpacity(0.9,{  duration:0})


 

//---动画化开始---------------
const wordGroup = mo.addGroup( );
let wordOne = srcCfg['data'][7] ;//{"cn":"电吹风","en":"hair dryer","ph":"电吹风-ph.png",img:"电吹风.png","enTm":3,"cnTm":2} ;
let enTm= wordOne['enTm']
let cnTm = wordOne['cnTm']
let srcPath   =  srcCfg['imgRoot']//'./t123456_img/'
let lineOne

//------en
let enText = wordGroup.addText(wordOne['en'],{ y:0.9,scale:0.7,  color:"#2a2a2a" })
.wipeIn( { t:"+", duration:1.3,ease:"power4.out"})

 //------ph
let phText = wordGroup.addImage(srcPath + wordOne['ph'],{ y:1.9,  color:"#2a2a2a", scale:0.6,})
phText.wipeIn( { t:"+", duration:1.3,ease:"power4.out"}); //"up" | "down" | "left" | "right"
//text.  rotateTo (10,240,0,{duration :3})
//text.fadeOut(ea );
//enText.moveTo({  y: 1 , scale:0.6 ,duration: 0.8 ,ease:"power2.inOut"});
//闪一下
enText.changeOpacity(0.5,{ t:">", duration:0.3 ,ease:"power2.in"})
enText.changeOpacity(1,{ t:">", duration:0.5 ,ease:"power2.Out"})

lineOne = wordGroup.addRect({x:0, y:0.3,width:2.8,height: 0.03, color: "#44abda" })
.fadeIn()
//.wipeIn({  t:">", duration: 4  ,dir: "right",  ease:"power1.inOut"});
//朗读时间线
lineOne.scaleXTo(0,{  t:">" , duration: enTm   ,  ease:"none"})
mo.pause(0.5)//朗读后等待

//mo.pause(wordOne['enTm']) //朗读时间

//------出现两图选择
let imgY = -0.3

let imga = wordGroup.addImage(srcPath +'电吹风.png', {y:imgY,x:-1.9,scale:1.5})
.reveal  ({t:">0.3", ease: "expo.Out",duration:0.5} )  
.moveTo({ y:imgY-0.8 ,   scale:2,duration: 0.8 ,ease:"power2.inOut"});

//------
let imgb = wordGroup.addImage(srcPath + '电熨斗.png', {y:imgY,x:1.9,scale:1})
.reveal  ({ t:">0.3",ease: "expo.Out",duration:0.5} )  
.moveTo({ y:imgY-0.8 , scale:1.5,duration: 0.8 ,ease:"power2.inOut"});



//----选择提示
let tapGroup =  mo.addGroup( );
let tap = tapGroup.addRect({z:100,opacity:0.85,color: "#ffffff" });
//tap.scaleXTo(9.5).scaleYTo(5.2)
tap.scaleXTo(7.5).scaleYTo(4.8)
tap.fadeIn({ t:">", duration:0.2  });
tapGroup.addText("请选择",{y:0.7,z:101,scale:0.5,color: "#2a2a2a" }).fadeIn()
tapGroup.addText("Please choose",{y:-0.7,z:101,scale:0.5,color: "#2a2a2a" }).fadeIn()

mo.pause(2) 
tapGroup.changeOpacity(0,{ t:">", duration:0.4 ,ease:"power2.Out"})

//----------  图片提示
imga.changeOpacity(0.1,{ t:">", duration:0.2 ,ease:"power2.in"})
imga.changeOpacity(1,{ t:">", duration:0.2 ,ease:"power2.Out"})
imga.rotateTo(0,0,10,{ t:">", duration:0.08   })
imga.rotateTo(0,0,-10,{ t:">", duration:0.15   })
imga.rotateTo(0,0,0,{ t:">", duration:0.06   })
//imga.shake2D({duration:0.2 })
//-----  图片提示
imgb.changeOpacity(0.1,{ t:">", duration:0.6 ,ease:"power2.in"})
imgb.changeOpacity(1,{ t:">", duration:0.6 ,ease:"power2.Out"})
//imgb.shake2D({duration:0.2 })
imgb.rotateTo(0,0,10,{ t:">", duration:0.08   })
imgb.rotateTo(0,0,-10,{ t:">", duration:0.15   })
imgb.rotateTo(0,0,0,{ t:">", duration:0.06   })

//----等待选择进度条

lineOne = wordGroup.addRect({ y:0.2,width:5.5,height: 0.05, color: "#44abda" })
.fadeIn()
//.wipeIn({  t:">", duration: 4  ,dir: "right",  ease:"power1.inOut"});
lineOne.scaleXTo(0,{  t:">", duration: 4  ,  ease:"power1.inOut"})
//----选择结果----------
mo.pause(0.5) //  （上面一个运行完成后同步）
imga.moveTo( { t:"<",x:0,scale:2.2, duration:1.2 ,ease:"power2.in"})
imgb.changeOpacity(0,{ t:"<", scale:1.5,duration:1.2 ,ease:"power2.Out"})

//-----朗读 en
mo.pause(2) //等
//闪一下
enText.changeOpacity(0.5,{ t:">", duration:0.3 ,ease:"power2.in"})
enText.changeOpacity(1,{ t:">", duration:0.5 ,ease:"power2.Out"})
//mo.pause(wordOne['enTm']); //--等待-完成后继续 
lineOne = wordGroup.addRect({x:0, y:0.3,width:2.8,height: 0.03, color: "#44abda" })
.fadeIn()
//.wipeIn({  t:">", duration: 4  ,dir: "right",  ease:"power1.inOut"});
//朗读时间线
lineOne.scaleXTo(0,{  t:">" , duration: enTm   ,  ease:"none"})
mo.pause(0.5)//朗读后等待

enText.rotateTo (0,90,0,{duration :1}) //旋转到中文
//-----朗读 cn
let cnText = wordGroup.addText(wordOne['cn'],{ y:0.9,scale:0.7,  color:"#2a2a2a" })
.rotateTo (0,90,0,{duration :0})
.rotateTo (0,0,0,{duration :1})
mo.pause(0.8) //等
//闪一下
cnText.changeOpacity(0.5,{ t:">", duration:0.3 ,ease:"power2.in"})
cnText.changeOpacity(1,{ t:">", duration:0.5 ,ease:"power2.Out"})
//mo.pause(wordOne['cnTm']); //--等待-完成后继续 
lineOne = wordGroup.addRect({x:0, y:0.3,width:2.8,height: 0.03, color: "#44abda" })
.fadeIn()
//.wipeIn({  t:">", duration: 4  ,dir: "right",  ease:"power1.inOut"});
//朗读时间线
lineOne.scaleXTo(0,{  t:">" , duration: cnTm   ,  ease:"none"})
mo.pause(0.5)//朗读后等待
  
//---离开( +> 等待同步执行)
mo.pause(1.5) //等
wordGroup.moveTo({ t:"+>",y:-6, scale:0,duration: 1.2 ,ease:"power2.inOut"});
wordGroup.changeOpacity(0,{ t:"+>", scale:1.5,duration:2 ,ease:"power2.Out"})

