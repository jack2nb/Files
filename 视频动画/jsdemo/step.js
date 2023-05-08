import * as mo from "movy"; 
 //擦除效果
let ea = {
  duration:2,
  ease: "bounce.out"
}
let at = {
    color:"red"
}
mo.addText("一段文本",at).wipeIn(ea ); 
mo.addRect({z:-1,scale:4,color: "#ffffff" });
// mo.addPyramid(
//   {color:"#1abc9c"}
// )a


//text.scaleTo(1.2)
//
//text.  rotateTo (10,240,0,{duration :3})
//text.fadeOut(ea );
//text.implode2D(ea );
//mo.addGlitch()

 
//bg.fadeOut (ea );

// text.show()
// text.changeOpacity(1) 
// text.scaleTo(1.5,{duration: 3,ease: ea})
//text.moveTo({x:2,y:2,z:1,duration:3,ease: ea})

//mo.cameraMoveTo({ x:1,zoom:0, duration: 3 }); //横向移动摄像机