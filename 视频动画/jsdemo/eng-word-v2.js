import * as mo from "movy"; 

let word = ["电吹风", "hair dryer","ˈher-ˌdrī(-ə)r"];

const wordGroup = mo.addGroup( );

let tm = 0 ;//时间线

let phText =  wordGroup.addText(word[2],{ y:-2,font:"zh",  color:"#2a2a2a" })
phText.reveal( { t:tm+=1.3, duration:1.3,ease:"power4.out"});


let bg = mo.addRect({z:-1,scale:20,color: "#ffffff" });
//------
let img = wordGroup.addImage('./t123456_img/电吹风.png', {x:0,scale:4.5})
.wipeIn  ({ ease: "slow(0.5, 0.8, false)",duration:1.1} )  ;

img.moveTo({ x: -5 , scale:3,duration: 0.8 ,ease:"power2.inOut"});
tm+=1;
//----
let cnText = wordGroup.addText(word[0],{ y:1,  color:"#2a2a2a" })
cnText.reveal( { t:tm+=1.3, duration:1.3,ease:"power4.out"});
//text.  rotateTo (10,240,0,{duration :3})
//text.fadeOut(ea );

cnText.changeOpacity(0.7,{ t:">", duration:0.2 ,ease:"power2.in"})
cnText.changeOpacity(1,{ t:">", duration:0.2 ,ease:"power2.Out"})

let enText = wordGroup.addText(word[1],{ y:-0.5,  color:"#2a2a2a" })
enText.reveal( { t:tm+=3.8, duration:1.3,ease:"power4.out"});

enText.changeOpacity(0.7,{ t:">", duration:0.2 ,ease:"power2.in"})
enText.changeOpacity(1,{ t:">", duration:0.2 ,ease:"power2.Out"})


// let phText =  wordGroup.addText(word[2],{ y:-2,font:"zh",  color:"#2a2a2a" })
// phText.reveal( { t:tm+=1.3, duration:1.3,ease:"power4.out"});

wordGroup.moveTo({ t:tm+=3.8, y: 6 , scale:0.01,duration: 0.8 ,ease:"power2.inOut"});