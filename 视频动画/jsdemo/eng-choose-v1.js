import * as mo from "movy"; 

/****
单词选择 

没有的东西 可以用图片 主要用到movy的动画功能和导出视频  

***/
let word = ["电吹风", "hair dryer","ˈher-ˌdrī(-ə)r"];

mo.cameraMoveTo({ zoom:1.5,  duration: 0 }); //横向移动摄像机

//-----背景
let bgImg
let bgGroup =  mo.addGroup( );
let imgBg  = './src/bg-palnt3.png';//雨雾草 v1
//bgImg = bgGroup.addImage(imgBg, {z:-99,y:-2.1,x:0,scale:3.6})

imgBg =  './src/grass.jpg';//草原 v2
bgImg = bgGroup.addImage(imgBg, {z:-99,y:0,x:0,scale:7.5})

mo.addText('每天说英语',{ position:[-5.2,-2.6], opacity:0.5,scale:0.15,  color:"#2a2a2a" })
mo.addText('Speak English Every Day',{ position:[-4.70,-2.8], opacity:0.5,scale:0.13,  color:"#2a2a2a" })
//imgBg =  './src/grass2.png';//草原  v3
//bgImg = bgGroup.addImage(imgBg, {z:-99,y:-2.10,x:0,scale:3.1})
//------卡片
let imgCard  = './src/bg-card.png'; //卡片
bgGroup.addImage(imgCard, {z:-98,y:0,x:0,scale:5.3})//.changeOpacity(0.9,{  duration:0})


let bg = bgGroup.addRect({z:-100,scale:20,color: "#ffffff" });



let tm = 0 ;//时间线
const wordGroup = mo.addGroup( );
//---
//------两图选择
let imga = wordGroup.addImage('./t123456_img/电吹风.png', {y:-1,x:-1.5,scale:1.5})
.reveal  ({ ease: "expo.Out",duration:0.5} )  ;
//imga.moveTo({ x: -3 , scale:2.5,duration: 0.8 ,ease:"power2.inOut"});
tm+=1;
//------
let imgb = wordGroup.addImage('./t123456_img/电熨斗.png', {y:-1,x:1.5,scale:1.2})
.reveal  ({ ease: "expo.Out",duration:0.5} )  ;
//imgb.moveTo({ x: 3 , scale:2.5,duration: 0.8 ,ease:"power2.inOut"});



//------
let enText =  wordGroup.addText(word[1],{ position:[0,1.3], scale:1,  color:"#2a2a2a" })
enText.reveal( {  direction:"down", duration:1.3,ease:"power4.out"});
enText.moveTo({  y: 0.8 , scale:0.6 ,duration: 0.8 ,ease:"power2.inOut"});
 //------
let cnText = wordGroup.addText(word[0],{ y:1.3,  color:"#2a2a2a", scale:0.2,})
cnText.wipeIn( {  duration:1.3,ease:"power4.out"}); //"up" | "down" | "left" | "right"
//text.  rotateTo (10,240,0,{duration :3})
//text.fadeOut(ea );


//----------  图片提示
imga.changeOpacity(0.1,{ t:">", duration:0.2 ,ease:"power2.in"})
imga.changeOpacity(1,{ t:">", duration:0.2 ,ease:"power2.Out"})
imga.rotateTo(0,0,10,{ t:">", duration:0.15   })
imga.rotateTo(0,0,-10,{ t:">", duration:0.25   })
imga.rotateTo(0,0,0,{ t:">", duration:0.1   })
//imga.shake2D({duration:0.2 })
//-----  图片提示
imgb.changeOpacity(0.1,{ t:">", duration:0.6 ,ease:"power2.in"})
imgb.changeOpacity(1,{ t:">", duration:0.6 ,ease:"power2.Out"})
//imgb.shake2D({duration:0.2 })
imgb.rotateTo(0,0,10,{ t:">", duration:0.15   })
imgb.rotateTo(0,0,-10,{ t:">", duration:0.25   })
imgb.rotateTo(0,0,0,{ t:">", duration:0.1   })
//----选择倒计时
let numSet = { y:-0.2, scale:0.8,  color:"#2a2a2a" }
let numText =  wordGroup.addText("3",numSet).fadeIn({ t:">", duration:0.1   })
//.implode2D({ t:">", duration:1.2 ,ease:"power2.Out"})
numText.changeOpacity(0,{ t:">", duration:1.2 ,scale:0.8,ease:"power2.Out"})
numText = wordGroup.addText("2",numSet).fadeIn({ t:">", duration:0.1   })
//.implode2D({ t:">", duration:1.2 ,ease:"power2.Out"})
numText.changeOpacity(0,{ t:">", duration:1.2 ,scale:0.8,ease:"power2.Out"}) 
numText = wordGroup.addText("1",numSet).fadeIn({ t:">", duration:0.1   })
//.implode2D({ t:">", duration:1.2 ,ease:"power2.Out"})
numText.changeOpacity(0,{ t:">", duration:1.2 ,scale:0.8,ease:"power2.Out"})
//----选择结果
imga.moveTo( { t:"+",x:0, duration:1.2 ,ease:"power2.in"})
imgb.changeOpacity(0,{ t:"+", scale:1.5,duration:1.2 ,ease:"power2.Out"})
//---( +> 等待同步执行)

mo.pause(2); //--等待-完成后继续 
wordGroup.moveTo({ t:"+>",y:-6, scale:0,duration: 1.2 ,ease:"power2.inOut"});
wordGroup.changeOpacity(0,{ t:"+>", scale:1.5,duration:2 ,ease:"power2.Out"})

