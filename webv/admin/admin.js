const { watch, reactive, computed, ref, onMounted, toRefs, createVNode } = Vue;
const { Modal, message, notification } = antd;
const { LoadingOutlined, ExclamationCircleOutlined } = antd;

let url = './admin/admin.html' +gi.version(true)//模板文件
const response = await fetch(url);
let tpl = await response.text();


const routeUrl = '//192.168.11.122:2026/'



let columns = [{
  title: '编号',
  dataIndex: 'num',
  key: 'num',
}, {
  title: '状态',
  dataIndex: 'target',
  onFilter: (value, record) => record.target.includes(value),

  filters: [
    {
      text: 'ACCEPT',
      value: 'ACCEPT',
    }, {
      text: 'DNAT',
      value: 'DNAT',
    },
  ],
  filterSearch: true,
}, {
  sorter: (a, b) => {
    let prev = a.source ? a.source : '';
    let next = b.source ? b.source : '';
    return prev.localeCompare(next, 'zh-Hans-CN', { sensitivity: 'accent' });
  },

  title: '来源',
  dataIndex: 'source',
  key: 'source',
  slots: {
    filterDropdown: 'filterDropdown',
  },
  onFilter: (v, r) => r.source.toString().toLowerCase().includes(v.toLowerCase()),

}, {
  title: '目标',
  dataIndex: 'destination',
  sorter: (a, b) => {
    let prev = a.destination ? a.destination : '';
    let next = b.destination ? b.destination : '';
    return prev.localeCompare(next, 'zh-Hans-CN', { sensitivity: 'accent' });
  },

}, {
  title: '其他',
  dataIndex: 'other',
},]
//----------------------ip mac
let ipColumns = [{
  title: 'ip',
  dataIndex: 'ip',
  key: 'ip',
  slots: {
    filterDropdown: 'filterDropdown',
  },
  onFilter: (v, r) => r.ip.toString().toLowerCase().includes(v.toLowerCase()),
}, {
  title: '设备',
  dataIndex: 'dev',
  key: 'dev',
  slots: {
    filterDropdown: 'filterDropdown',
  },
  onFilter: (v, r) => r.dev.toString().toLowerCase().includes(v.toLowerCase()),
}, {
  title: 'mac',
  dataIndex: 'mac',
  key: 'mac',
  slots: {
    filterDropdown: 'filterDropdown',
  },
  onFilter: (v, r) => r.mac.toString().toLowerCase().includes(v.toLowerCase()),
}, {
  title: '操作',
  key: 'action',
  slots: { customRender: 'action' },
},]


const gd = {};//全局数据 解决调用引用问题
gd.reg = {} //组成类到全局调用
gd.group = 'admin' //功能应用分组


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

//const pd = ref({ "load": [] }); //特殊变量，页面数据
//const pvs = gd.pd.value; //变量代理访问
//gd.pd = pd;//page data 页面元素引用"数据"






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
    this.ipMac = [] //原生数据
    this.upUsers = []
    this.tabRules = [] //两层数据结构

  }

  点击标签(标签) {
    //读取数据
    console.log(标签)
    if (标签 == '地址列表') { gd.reg.ui.载入地址列表() }
    if (标签 == '规则') { gd.reg.ui.载入规则() }
    if (标签 == '上线用户') { gd.reg.ui.载入上线用户() }
  };


  载入上线用户(to) {
    //读取用户列表 timeout
    var url = routeUrl + 'route/list/'
    axios.get(url,)
      .then(res => {
        console.log('res=====', res)
        if (res.data?.['@code'] == 200) {

          gd.reg.ui.upUsers = res.data.data
          pd.upUsersTab = res.data.data
          pd.tabLoading["上线用户"] = 1 //表载入
        }
      }
      )
      .catch(() => { antd.message.error('读取用户列表出错') })
  };
  载入规则() {
    //读取用户列表
    var url = routeUrl + 'route/rule/'
    axios.get(url,)
      .then(res => {
        console.log('res=====', res)
        if (res.data?.['@code'] == 200) {
          gd.reg.ui.tabRules = res.data.data
          pd.tabRulesTab = res.data.data
        }
      }
      )
      .catch(() => { antd.message.error('载入规则列表出错') })
  };
  载入地址列表() {
    //读取用户列表
    var url = routeUrl + 'route/arp/'
    axios.get(url,)
      .then(res => {
        console.log('res=====', res)
        if (res.data?.['@code'] == 200) {
          gd.reg.ui.ipMac = res.data.data
          pd.ipMacTab = res.data.data
        }
      }
      )
      .catch(() => { antd.message.error('载入地址列表出错') })
  };
  搜索ip(search) {
    var options = {
      shouldSort: true,  //是否按分数对结果列表排序
      //搜索标题与作者名
      keys: [{
        name: 'ip',
        weight: 1   //设置权重
      }, {
        name: 'mac',
        weight: 1   //设置权重
      }]
    }
    var fuse = new Fuse(gd.reg.ui.ipMac, options)
    //console.log('search==', search, fuse.search(search), gd.reg.ui.ipMac.length)
    pd.ipMacSearch = fuse.search(search).slice(0, 5) //查询结果
  }
  xxx(newVal, oldVal) {
    //ip查询内容修改
    //console.log(newVal, '==', oldVal);
    gd.reg.ui.搜索ip(newVal.xxx)

  }

  onSelectChange(newVal, oldVal) {
    // userSelect 选择用户
    console.log(newVal, '==', oldVal);
    pd.userSelect = newVal
    pd.userIps = oldVal //[{}]结构

  }
  ipLogout() {
    //下线 
    _.forEach(pd.userIps, function (value) {
      console.log(value.source);
      //批量下线
      var url = routeUrl + 'route/down/?ip=' + value.source
      axios.get(url,)
        .then(res => {
          if (res.data?.['@code'] == 200) {
            antd.message.info(`下线 ${res.data.data} 完成`);
            gd.reg.ui.clearOne(res.data.data);
          }
        }
        )
        .catch(() => {
          antd.message.error('删除 ip出错');
          gd.reg.ui.clearOne(res.data.data);
        })
    });

  }
  ipLogoutAll() {
    //全部下线
    var url = routeUrl + 'route/reuser/'
    axios.get(url,)
      .then(res => {
        if (res.data?.['@code'] == 200) {
          antd.message.info("下线全部完成");
          gd.reg.ui.载入上线用户();
        }
      }
      )
      .catch(() => {
        antd.message.error('下线全部出错');
        gd.reg.ui.载入上线用户();
      })

  }
  clearOne(ip) {
    //清除一条
    pd.userIps.shift();
    pd.userSelect.shift();
    if (pd.userIps.length == 0) { gd.reg.ui.载入上线用户() }

  }
  ipLogin(ip, record) {
    //上线
    console.log('ip==', ip, record);
    pd.butLoading[ip] = true //多按钮，载入状态

    var url = routeUrl + 'route/up/?ip=' + ip
    axios.get(url,)
      .then(res => {
        console.log('res=====', res)
        if (res.data?.['@code'] == 200) {
          pd.butLoading[res.data.data] = false //取消loading
        }
      }
      )
      .catch(() => { antd.message.error('载入地址列表出错') })
  }
  reloadRule() {
    //规则白名单 重载

    gd.reg.ui.modals('reloadRule', 1)

    var url = routeUrl + 'route/reload/'
    axios.get(url,)
      .then(res => {
        console.log('res=====', res)
        if (res.data?.['@code'] == 200) {
          antd.message.success('重载规则完成');
          gd.reg.ui.modals('reloadRule', 0)
          gd.reg.ui.载入规则()
        }
      }
      )
      .catch(() => { gd.reg.ui.modals('reloadRule', 0); antd.message.error('重载规则出错'); })

  }
  clearRule() {
    //规则白名单清空
    gd.reg.ui.modals('clearRule', 1)

    var url = routeUrl + 'route/clear/'
    axios.get(url,)
      .then(res => {
        console.log('res=====', res)
        if (res.data?.['@code'] == 200) {
          antd.message.success('亲空规则完成');
          gd.reg.ui.modals('clearRule', 0)
          gd.reg.ui.载入规则()
        }
      }
      )
      .catch(() => { gd.reg.ui.modals('clearRule', 0); antd.message.error('亲空规则出错'); })

  }
  modals(name, show) {
    //组件管理 显示
    pd.modals[name] = show
  }
 
}




const pd = reactive({}); // 定义层对象
(() => {
  pd.isLoading = 1;//只加载一次
  $LAB.script(["https://cdnjs.cloudflare.com/ajax/libs/fuse.js/6.6.2/fuse.min.js"]
  ).wait(() => {
    console.log('load src');//只加载一次
    pd.isLoading = 0;
  });
  pd.msgLoading = message.loading('Loading...', 0);//只执行一次载入中
})();

const m = new main(); //界面更改"方法"

export default ({
  setup() { //html元素响应式  框架非逻辑 ,只写框架相关的
    console.log(gd.group + ' setup');

    //二级联动等待加载完成
    watch(() => { return { isLoading: pd.isLoading } }, () => { console.log(' loaded', pd.isLoading); pd.msgLoading(); watch(() => { return { xxx: pd.xxx } }, m.xxx) })
    pd.yyy = computed(() => { return pd.xxx ? "val=" + pd.xxx : ''; });
    //--数据
    return { m, pd, };
  },

  created() {
    pd.userId =  gd.storage.get('userRow', 'goRoute')?.ID //用户
    //界面数据初始化
    console.log(gd.group + ' created');

    pd.butLoading = {} //列表按钮
    pd.tabLoading = {} //数据表
    //vue数据
    pd.xxx = '222'
    pd.upUsersTab
    pd.upUsersColumns = columns
    pd.upUsersSelect = null

    pd.tabRulesTab
    pd.tabRulesColumns = columns
    pd.tabRulesSelect = null
    //--查询

    pd.ipMacTab = [] //表格显示
    pd.ipMacSearch = [] //查询结果
    pd.ipMacColumns = ipColumns
    pd.ipMacSelect = null //选中行
    pd.xxx = "" //查询关键字

    //--默认值
    pd.activeKey = '上线用户'  //默认标签

    pd.userSelect = [] //选择的用户
    pd.userIps = [] //选择的用户ip地址 (清空后重载)
    pd.modals = {} //按类型管理组件显示
    pd.tabLoading = { } //表载入

    //执行初始化
    m.载入上线用户()

  },
  mounted() {
    // Vue-Redux 状态管理

    console.log(gd.group + '  mounted');
    ge.emit('头', 1)
  },
  template: tpl,
});

