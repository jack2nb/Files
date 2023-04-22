import  * as  mo from "movy"



mo.addText("四面体"
,{y:1 ,scale:0.2}
)
mo.addPyramid(
  {color:"#1abc9c"}
).rotateTo({duration:10})

mo.cameraMoveTo(
  {
    x:0,y:0,z:0
    ,lookAt:[0,0,0]
    ,duration :5
    ,t:0
  }
)

mo.cameraMoveTo(
  {
    x:0,y:1,z:3
    ,lookAt:[2,1,0]
    ,duration :5
    ,t:2
  }
)
