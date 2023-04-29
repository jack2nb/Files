import * as mo from "movy";
//一次展示多种效果
let m  = 1.5
mo.addText("一段文本 fadeIn",{y:m*2})
    .fadeIn( { duration:2}).changeOpacity(0) ;
mo.addText("一段文本 wipeIn",{y:m*1})
    .wipeIn(  { duration:2}).changeOpacity(0) ;;
mo.addText("一段文本 flyIn",{y:m*0})
    .flyIn(  { duration:2}).changeOpacity(0) ;;
//----
mo.addText("一段文本 rotateIn",{y:-m*1})
    .rotateIn( { duration:2} ).changeOpacity(0) ;;
mo.addText("一段文本 grow ",{y:-m*2})
    .grow( { duration:2} ).changeOpacity(0) ;;
mo.addText("一段文本 explode2D" ,{y:-m*3})
    .explode2D(  { duration:2}).changeOpacity(0) ;;
mo.addText("一段文本 explode2D" ,{y:m*3})
    .reveal().shake2D().spinning();