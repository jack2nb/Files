import * as mo from "movy"; 
let ea = {
  duration:2,
  ease: "slow(0.1, 2, false)"
}

let at = {
  color:"red"
}

let bg = mo.addRect({z:-1,scale:20,color: "#ffffff" });

let img = mo.addImage('./t123456_img/电吹风.png', {x:-5,scale:4})
.wipeIn  ({ ease: "slow(0.1, 0.8, false)",duration:1.3} )  ;


let text =mo.addText("一段文本",at)
// mo.addPyramid(
//   {color:"#1abc9c"}
// )


//text.scaleTo(1.2)
text.wipeIn(ea );
//text.  rotateTo (10,240,0,{duration :3})
//text.fadeOut(ea );
//text.implode2D(ea );
//mo.addGlitch()

 
//bg.fadeOut (ea );

// text.show()
// text.changeOpacity(1) 
// text.scaleTo(1.5,{duration: 3,ease: ea})
text.moveTo({x:2,y:2,z:1,duration:3,ease: ea})

//mo.cameraMoveTo({ x:1,zoom:0, duration: 3 }); //横向移动摄像机