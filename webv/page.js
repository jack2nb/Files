const { watch, reactive,  ref,    toRefs, defineAsyncComponent } = Vue;
const { Modal, message, notification, Grid } = antd;
/*
考情记录
代办便签



*/
let url = 'page.html'+gi.version(true) //模板文件
const response = await fetch(url);
let tpl = await response.text();


const routeUrl = gi.cfg('routeUrl')  
const dataUrl = gi.cfg('dataUrl')  


let isLoading = 1;//加载中
//Fuse.js 搜索



const gd = {};//全局数据 解决调用引用问题
gd.reg = {} //组成类到全局调用
gd.group = 'page' //功能应用分组

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
 
  载入公告() {
    //读取公告
    let vn = {
      "kq/通知公告": {'time&':`<${ moment(new Date().getTime()).format("yyyy-MM-DD")}` ,"@limit":4,"@order":"-CREATETIME" }
    }
    var url = dataUrl + 'jsonapi/get?notice'
    axios.post(url, vn)
      .then(res => {
        console.log('jsonapi/get?notice', res)

        if (res.data?.['@code'] == 200) {
          //多个单据要累加

          pd.notice = res.data?.['kq/通知公告']

        } else {
          antd.message.error('读取通知公告意外');
          console.error('jsonapi/get?notice err msg', res.data['@msg'])
        }
      }
      )
      .catch((res) => { console.error('读取通知公告据数出错', res); antd.message.error('读取通知公告据数出错') })


  };
  
  载入常用入口() {
    //读取常用入口
    let vn = {
      "kq/常用入口": {"@limit":4,"@order":"-FMODIFYDATE"}
    }
    var url = dataUrl + 'jsonapi/get?entr'
    axios.post(url, vn)
      .then(res => {
        console.log('jsonapi/get?entr', res)

        if (res.data?.['@code'] == 200) {
          //多个单据要累加

          pd.entrance = res.data?.['kq/常用入口']

        } else {
          antd.message.error('读取常用入口意外');
          console.error('jsonapi/get?entr err msg', res.data['@msg'])
        }
      }
      )
      .catch((res) => { console.error('读取常用入口出错', res); antd.message.error('读取常用入口出错') })
  }
  time2momday(time){
    return  moment(time).format("MM-DD");
  }
}

const pd = reactive({}) // 定义图层对象
const m = new main(); //界面更改"方法"

export default ({
  setup() { //html元素响应式  框架非逻辑 ,只写框架相关的
    

    watch(() => { return { usersRaw: pd.usersRaw } }, m.usersRaw2users) //自动计算
    watch(() => { return { user: pd.user } }, (raw) => { let tmp = _.find(pd.users, { 'NAME': raw.user })?.['部门']; pd.dep = tmp ? tmp : ''; }) //自动计算
    //pd.user = computed(() => { return m.usersRaw2users() ; });
    //--数据

    return { m, pd };


  },

  created() {
    pd.userId = gd.storage.get('userRow', 'goRoute')?.ID //用户

    ge.emit('头', 0);
    console.log(gd.group + ' created  ');
    pd.butLoading = {} //列表按钮
    pd.tabLoading = {} //数据表
    //读取用户列表
    pd.screens = Grid.useBreakpoint();

  

    pd.notice = []//通知公告列表数据

    pd.entranc = []//常用入口列表数据

    m.载入公告()
    m.载入常用入口()
  },
  mounted() {
    // Vue-Redux 状态管理
   
    console.log(gd.group + '   mounted', pd.screens);


  },
  template: tpl,
  components: {
    'mw-notepaper': defineAsyncComponent(() => { return import(`./cp/notepaper.js${gi.version(true)}`) }) //动态加载组件
    ,'mw-indicator': defineAsyncComponent(() => { return import(`./cp/indicator.js${gi.version(true)}`) }) //动态加载组件
  }

});


