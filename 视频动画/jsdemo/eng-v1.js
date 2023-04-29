import * as mo from "movy"; 

let word = ["电吹风", "hair dryer"];

const wordGroup = mo.addGroup( );

let tm = 0 ;//时间线
let bg = mo.addRect({z:-1,scale:20,color: "#ffffff" });
//------
let img = wordGroup.addImage('./t123456_img/电吹风.png', {x:-5,scale:3.5})
.wipeIn  ({ ease: "slow(0.5, 0.8, false)",duration:0.9} )  ;

//----
let text = wordGroup.addText(word[0],{ y:1,  color:"#2a2a2a" })
text.reveal( { t:tm+=1.1, duration:1.1});
//text.  rotateTo (10,240,0,{duration :3})
//text.fadeOut(ea );

text = wordGroup.addText(word[1],{ y:-0.5,  color:"#2a2a2a" })
text.reveal( { t:tm+=1.1, duration:1.1});


wordGroup.moveTo({ x: 3 , duration: 0.8 ,ease:"power2.inOut"});