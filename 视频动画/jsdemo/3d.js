import  * as  mo from "movy"



mo.addText("四面体"
,{y:1 ,scale:0.2}
)
mo.addPyramid(
  {color:"#1abc9c",scale:2,y:-0.5}
).  rotateTo (10,240,0,{duration :3})

 
mo.cameraMoveTo(
  {
    x:0,y:1,z:3
    ,lookAt:[0,0,0]
    ,duration :3
    ,zoom:1.5
    ,t:">"
  }
)
