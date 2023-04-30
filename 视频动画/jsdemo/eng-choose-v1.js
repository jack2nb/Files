import * as mo from "movy"; 

/****
单词选择 


***/
let word = ["电吹风", "hair dryer","ˈher-ˌdrī(-ə)r"];


let bg = mo.addRect({z:-1,scale:20,color: "#ffffff" });
let tm = 0 ;//时间线
const wordGroup = mo.addGroup( );
//---
//------
let imga = wordGroup.addImage('./t123456_img/电吹风.png', {y:-1,x:-2.5,scale:2.2})
.reveal  ({ ease: "expo.Out",duration:0.5} )  ;
//imga.moveTo({ x: -3 , scale:2.5,duration: 0.8 ,ease:"power2.inOut"});
tm+=1;
//------
let imgb = wordGroup.addImage('./t123456_img/电熨斗.jpg', {y:-1,x:2.5,scale:2.2})
.reveal  ({ ease: "back.out(1)",duration:0.5} )  ;
//imgb.moveTo({ x: 3 , scale:2.5,duration: 0.8 ,ease:"power2.inOut"});



//------
let enText =  wordGroup.addText(word[1],{ y:2.5, scale:1.5,  color:"#2a2a2a" })
enText.reveal( {  direction:"down", duration:1.3,ease:"power4.out"});
enText.moveTo({  y: 1.5 , scale:0.8 ,duration: 0.8 ,ease:"power2.inOut"});
 //------
let cnText = wordGroup.addText(word[0],{ y:2.5,  color:"#2a2a2a", scale:0.3,})
cnText.wipeIn( {  duration:1.3,ease:"power4.out"}); //"up" | "down" | "left" | "right"
//text.  rotateTo (10,240,0,{duration :3})
//text.fadeOut(ea );


//----------

imga.changeOpacity(0.1,{ t:">", duration:0.6 ,ease:"power2.in"})
imga.changeOpacity(1,{ t:">", duration:0.6 ,ease:"power2.Out"})

imga.shake2D({duration:0.2 })
//-----

imgb.changeOpacity(0.1,{ t:">", duration:0.6 ,ease:"power2.in"})
imgb.changeOpacity(1,{ t:">", duration:0.6 ,ease:"power2.Out"})
imgb.shake2D({duration:0.2 })
//----
imga.moveTo( { x:0,t:">", duration:0.6 ,ease:"power2.in"})
imgb.changeOpacity(0,{ t:">", scale:2.5,duration:0.6 ,ease:"power2.Out"})
//---


wordGroup.moveTo({ scale:0,duration: 0.8 ,ease:"power2.inOut"});