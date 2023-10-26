const { watch, reactive, computed, ref, onMounted, toRefs } = Vue;
const { Modal, message, notification, Grid } = antd;
/*
//动态加载组件
   'mw-widge':defineAsyncComponent(() =>{return  import('./cp/notepaper.js') }) 


   读取用户 信息 并读取便签列表

*/
// 便签
let url = 'cp/notepaper.html'+gi.version(true) //模板文件
const response = await fetch(url);
let tpl = await response.text();







const gd = {};//全局数据 解决调用引用问题
gd.reg = {} //组成类到全局调用
gd.group = 'notepaper' //功能应用分组

gd.storage = {
  //本地浏览器 存取组件
  set(key, value, area) {
    key = area ? area + ':' + key : gd.group + ':' + key;//分区域分区组
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key, area) {
    key = area ? area + ':' + key : gd.group + ':' + key;//分区域分区组
    return JSON.parse(localStorage.getItem(key));
  },
  remove(key, area) {
    key = area ? area + ':' + key : gd.group + ':' + key;//分区域分区组
    localStorage.removeItem(key);
  },
}
class main {
  /* 业务相关，不含非界
    不要被框架耍的团团转
  */

  constructor(arg) {
    //初始（值）
    gd.reg.ui = this//全局资源
    this.initAttr(arg)
  }

  initAttr(arg) {


  }

}


const pd = reactive({}) // 定义图层对象
const m = new main(); //界面更改"方法"
export default ({

  setup() { //html元素响应式  框架非逻辑 ,只写框架相关的
    console.log(gd.group + ' setup  ');


    return { m, pd, };

  },

  created() {

    console.log(gd.group + '  created  ');

  },
  mounted() {
    // Vue-Redux 状态管理

    console.log(gd.group + ' mounted  ');

  },
  template: tpl,





});
