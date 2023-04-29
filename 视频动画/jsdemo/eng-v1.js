import * as mo from "movy";
/********
完成英语 学习视频
 
单图介绍 

******/  
let text = mo.addText("先下载 melon吗 ", {
  scale: 0.8,
  color: "yellow",
  x:0,
  y:1,
})
.flyIn ({duration:1.5, ease: "bounce.out"})
.implode2D({duration:1.5, });

mo.addText("那就用v2ray 扫描此处二维码", {
  scale: 0.8,
  color: "yellow",
  x:0,
  y:-1,
  t:3,
})
.wipeIn({t:3,duration:2, ease: "bounce.out"})
.fadeOut({t:7,duration:2, ease: "expo.out"});

let img = mo.addImage('./t123456_img/电吹风.jpg' ,{t:3,scale:5} )
.rotateIn ()  ;

img.moveTo({x:2,y:2,duration: 1, ease: "expo.inOut"})
img.moveTo({x:-2,y:2,duration: 2, ease: "expo.inOut"})
img.moveTo({x:-2,y:-2,duration: 2, ease: "expo.inOut"})
img.moveTo({x:0,y:0,duration: 2, ease: "expo.inOut"})