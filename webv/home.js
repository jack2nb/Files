const { watch, reactive, computed, ref, onMounted, toRefs, createVNode } = Vue;
const { Modal, message, notification } = antd;

let url = 'home.html' +gi.version(true)//模板文件
const response = await fetch(url);
let tpl = await response.text();

var uaInfoDc
const routeUrl = gi.cfg('routeUrl')  
const dataUrl = gi.cfg('dataUrl')  


//Fuse.js 搜索

$LAB
  .script("https://cdnjs.cloudflare.com/ajax/libs/UAParser.js/1.0.36/ua-parser.min.js"
  ).wait(() => {
    //只加载一次？

    var parser = new UAParser();
    uaInfoDc = parser.getResult()
    ge.emit('设备信息', uaInfoDc)
    console.log('ua-parser===', uaInfoDc.os);
  });




const gd = {};//全局数据 解决调用引用问题
gd.reg = {} //组成类到全局调用
gd.group = 'home' //默认功能应用分组

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
    this.usersRaw

  }
  获取全部员工() {
    let vn = {
      "oa/T_USER": { "@column": "ID,NAME,TELEPHONE,DEFAULTDEPARTMENT.部门id", }
      , "oa/T_DEPARTMENT": { "@column": "ID.部门id,NAME.部门", "ID|": "oa/T_USER.部门id" }
    }
    var url = dataUrl + 'jsonapi/get?users'
    axios.post(url, vn)
      .then(res => {
        console.log('res=====', res)
        if (res.data?.['@code'] == 200) {
          gd.reg.ui.usersRaw = res.data
          pd.usersRaw = res.data
        }
      }
      ).catch((res) => {
        console.error('catch:===', res, res?.response?.data); antd.message.error('获取员工出错');
      })

  }

  获取ip地址() {
    var url = dataUrl + 'info/ip/'
    axios.get(url,).then(res => {
      console.log('res===', res)
      if (res.status == 200) { //判断http状态对象
        pd.userIp = res.data
      }
    }
    ).catch((res) => {
      console.error('catch:===', res, res?.response?.data); antd.message.error('获取IP出错');
    })
  };


  ipLogin(ip, guest) {
    //上线
    console.log('ip==', ip, guest);
    var url = routeUrl + 'route/up/?ip=' + ip
    axios.get(url,).then(res => {
      console.log('res===', res)
      if (res.data?.['@code'] == 200) {//判断json对象
        //pd.ipLoginLoading[res.data.data] = false //取消loading
        pd.buttonLoading['userClick'] = 0;

        antd.message.success('登记完成等待进入主页...')
        gd.storage.set('userRow', pd.usersRow, 'goRoute')//用户信息
        gd.storage.set('userIp', pd.userIp, 'goRoute')//ip设备信息信息
        gd.storage.set('loginTime', moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:SS"), 'goRoute')//ip设备信息信息
        //跳转前 将重要信息存入    storage
        setTimeout(() => {
          console.log("setTimeout guest==", guest)
          if (guest) {
            location.replace('https://ouqiyj.com/');
          } else {
            ge.emit('goto', '/page');
          }
        }, 600);
      } else {
        antd.message.info(`提示: ${res.data?.['@msg']} `)
      }
    }
    ).catch((res) => {
      console.error('catch:===', res, res?.response?.data);
      antd.message.error('登入上网出错');
    })
  }
  uainfo(info) {
    console.log('设备信息=', info)
  }

  usersRaw2users(rawData) {
    //自动计算

    console.log('usersRaw2users==', rawData, pd.usersRaw)
    rawData = pd.usersRaw
    //无数据


    if (_.isUndefined(rawData['oa/T_USER']) || _.isUndefined(rawData['oa/T_DEPARTMENT'])) { return }
    //--dataframe操作
    // var 用户 = new dfd.DataFrame(rawData['oa/T_USER'])
    // var 部门 = new dfd.DataFrame(rawData['oa/T_DEPARTMENT'])
    // var 用户部门 = dfd.merge({ "left": 用户, "right": 部门, "on": ["部门id"], how: "left" })
    // 用户部门.print()
    // pd.users = dfd.toJSON(用户部门)

    var 用户 = new dfjs.DataFrame(rawData['oa/T_USER'])
    var 部门 = new dfjs.DataFrame(rawData['oa/T_DEPARTMENT'])
    var 用户部门 = 用户.leftJoin(部门, ["部门id"])
    用户部门.show()
    //console.log('usersRaw2users==', 用户部门.toDict( ))
    pd.users = JSON.parse(用户部门.toJSON(true))
    //console.table(pd.users); 
    return pd.users
  }

  user2click() {
    //点击进入
    //数据检查
    let row = _.find(pd.users, { 'NAME': pd.user });//查找一个

    //console.log(pd.user, pd.users[0]['NAME'], row)

    if (!row?.['NAME']) {
      notification.open({
        message: '提醒',
        description: ` 【${pd.user}】员工称貌似不存在，无法进入上网，非员工使用来宾模式`,
      });
      return
    }
    pd.buttonLoading['userClick'] = 1;
    gd.reg.ui.ipLogin(pd.userIp)
  }

}

const pd = reactive({}) // 定义图层对象
const m = new main(); //界面更改"方法"
export default ({

  setup() { //html元素响应式  框架非逻辑 ,只写框架相关的

    const pStyle = {
      fontSize: '16px',
      color: 'rgba(0,0,0,0.85)',
      lineHeight: '24px',
      display: 'block',
      marginBottom: '16px',
    };
    const pStyle2 = {
      marginBottom: '24px',
    };

    watch(() => { return { usersRaw: pd.usersRaw } }, m.usersRaw2users) //自动计算
    watch(() => { return { user: pd.user } }, (raw) => { pd.usersRow = _.find(pd.users, { 'NAME': raw.user }); pd.dep = pd.usersRow?.['部门'] ? pd.usersRow?.['部门'] : ''; }) //自动计算
    //pd.user = computed(() => { return m.usersRaw2users() ; });
    //--数据
    return { m, pd, };
  },

  created() {
    console.log(gd.group + ' created');
    //读取用户列表
    pd.user = '';
    pd.password = '';
    pd.dep = '';
    pd.userIp = '';
    //
    pd.usersRow = {};
    pd.users = [];
    pd.usersRaw = {};//用户裸数据
    pd.buttonLoading = {}; //按钮状态
    ge.on('设备信息', gd.reg.ui.uainfo)

  },
  mounted() {
    // Vue-Redux 状态管理

    console.log(gd.group + ' mounted',);
    ge.emit('头', 0);
    gd.reg.ui.获取ip地址()
    gd.reg.ui.获取全部员工()
  },
  template: tpl,


});


