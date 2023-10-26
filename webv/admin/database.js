const { toRaw, watch, reactive, computed, ref, onMounted, toRefs, defineAsyncComponent } = Vue;
const { Modal, message, Form, notification } = antd;




let url = './admin/database.html' + gi.version(true) //模板文件
const response = await fetch(url);
let tpl = await response.text();


const routeUrl = gi.cfg('routeUrl')
const dataUrl = gi.cfg('dataUrl')



let columns = [{
  title: 'id号',
  dataIndex: 'id',
  key: 'id',
}, {
  title: '标题',
  dataIndex: 'title',

}, {
  title: '链接',
  dataIndex: 'link',
  key: 'link',

}, {
  title: '发布日期',
  dataIndex: 'time',
}, {
  title: '操作',
  width: 40,
  slots: { customRender: 'opt' },
}]
//----------------------ip mac


let entColumns = [{
  title: 'id号',
  dataIndex: 'id',
  key: 'id',
}, {
  title: '标题',
  dataIndex: 'title',

}, {
  title: '链接',
  dataIndex: 'link',
  key: 'link',

}, {
  title: '操作',
  width: 40,
  slots: { customRender: 'opt' },
}]


const gd = {};//全局数据 解决调用引用问题
gd.reg = {} //组成类到全局调用
gd.group = 'base' //功能应用分组


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
    this.initAttr(arg);
  }

  initAttr(arg) {

  }

  载入数据库() {
    //读取库
    let vn = {}
    var url = dataUrl + 'jsonapi/dbs/?dbs'
    axios.get(url, vn)
      .then(res => {
        console.log('jsonapi/dbs/?dbs', res)
        if (res.data?.['@code'] == 200) {
          //多个单据要累加
          var dbs = res.data?.['dbs']
          //pd.dbs = res.data?.['dbs']
          _.forEach(dbs, function (value, index) {
            //console.log(index,value)
            pd.dbs.push({ "key": value, "title": value })
          });



        } else {
          antd.message.error('读取数据库意外');
          console.error('jsonapi/dbs/?dbs err msg', res.data['@msg'])
        }
      }
      ).catch((res) => { console.error('读取数据库出错', res); antd.message.error('读取数据库出错') })
  };
  载入数据表(db) {
    if (_.isUndefined(db) || pd.tabs[db]) { return } //不重复加载
    if (db.indexOf('/') >= 0) { return } //子项非db

    //读取表
    let vn = {}
    var url = dataUrl + 'jsonapi/tables/?dbname=' + db
    axios.get(url, vn)
      .then(res => {
        console.log('jsonapi/tables/', res)
        if (res.data?.['@code'] == 200) {
          pd.tabs[db] = res.data?.['tables'] //库里的表
          //找出节点
          _.forEach(pd.dbs, function (value, index) {
            db == value.key ? console.log(db, '==', value) : console.log(db, '<>', index)
            //添加子项
            if (db == value.key) {
              var tabs = [];//子树
              _.forEach(pd.tabs[db], function (value, index) {
                //console.log(index,value)
                tabs.push({ "key": [db, value].join('/'), "title": [db, value].join('/') })
              });
              value.children = tabs//添加子项
            }
          });
        } else {
          antd.message.error('读取表子项意外');
          console.error('jsonapi/tables/ err msg', res.data['@msg'])
        }
      }
      )
      .catch((res) => { console.error('读取表子项出错', res); antd.message.error('读表子项出错') })
  };
  载入表信息(dbtab) {

    pd.tabName = dbtab

    //读取表
    let vn = {}
    var url = dataUrl + 'jsonapi/tabinfo/?dbtab=' + dbtab
    axios.get(url, vn)
      .then(res => {
        console.log('jsonapi/tabinfo/', res)
        if (res.data?.['@code'] == 200) {
          pd.col = res.data?.['info'] //库里的表

        } else {
          antd.message.error('读取表信息意外');
          console.error('jsonapi/tabinfo/ err msg', res.data['@msg'])
        }
      }
      )
      .catch((res) => { console.error('读取表信息出错', res); antd.message.error('读表信息出错') })
  };

  modals(name, show) {
    //遮罩层管理 显示
    pd.modals[name] = show
  }
  selectDb(key, info) {
    console.log(key, info)
    if (key[0].indexOf('/') >= 0) {
      //加载表信息
      gd.reg.ui.载入表信息(key[0])
    } else {
      //加载表格
      gd.reg.ui.载入数据表(key[0])
    }



  }
  //generateData(z);
  onDragEnter(info) {
    console.log(info);
    // expandedKeys 需要展开时
    // expandedKeys.value = info.expandedKeys
  }
}

const pd = reactive({});// 响应层对象
(() => {
  pd.isLoading = 0;//只加载一次 
})();

const expandedKeys = ['0-0', '0-0-0', '0-0-0-0'];
const gData = []
const genData = [];

const x = 3;
const y = 2;
const z = 1;

function generateData(_level, _preKey, _tns) {
  const preKey = _preKey || '0';
  const tns = _tns || genData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  })
}

generateData(z);
console.warn('--genData---', genData)

class forms {
  /* 表单 数据表相关，无方法
  */

  constructor(arg) {
    //初始（值）
    gd.reg.fm = this//全局资源
    this.initNotice(arg);
    this.initEntrance(arg);
  }


  initNotice(arg) {
    /* 公告表单 数据规则
     reactive一层 getset 
    */
    this.nTab = "kq/通知公告"
    this.nPk = "id"
    this.nFormRef = ref();//公告
    this.nVal = reactive({//默认值 应该读取数据库表结构
      id: null,
      title: '',
      link: '',
      time: '',// moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:SS"),
    });
    this.nRules = reactive({ //rule规则
      title: [{ required: true, message: '标题必须输入' }],//validator: this.titleCheck,
      link: [{ required: true, message: '链接必须输入', pattern: ".*" }],
      time: [{ required: true, message: '公布日期必填' }],//validator: this.titleCheck,
    });

    const { validate, validateInfos, mergeValidateInfo, resetFields } = Form.useForm(this.nVal, this.nRules);
    this.nValidateInfos = validateInfos //验证结果
    this.nValidate = validate //验证处理
    this.nReset = resetFields //重置
  }

  initEntrance(arg) {
    /* 公告表单 数据规则
     reactive一层 getset 
    */
    this.eTab = "kq/常用入口"
    this.ePk = "id"
    this.eFormRef = ref();//公告
    this.eVal = reactive({//默认值 应该读取数据库表结构
      id: null,
      title: '',
      link: '',
    });
    this.eRules = reactive({ //rule规则
      title: [{ required: true, message: '标题必须输入' }],//validator: this.titleCheck,
      link: [{ required: true, message: '链接必须输入', pattern: ".*" }],

    });
    const { validate, validateInfos, mergeValidateInfo, resetFields } = Form.useForm(this.eVal, this.eRules);
    this.eValidateInfos = validateInfos //验证结果
    this.eValidate = validate //验证处理
    this.eReset = resetFields //重置
  }
}
const m = new main(); //界面更改"方法"
const fm = new forms(); //表单相关


export default ({
  setup() { //html元素响应式  框架非逻辑 ,只写框架相关的
    //二级联动等待加载完成
    watch(() => { return { isLoading: pd.isLoading } }, () => {
      console.log(' loaded'); pd.msgLoading();
      //watch(() => { return { xxx: pd.xxx } }, m.xxx)
    })
    //--数据
    return { m, pd, onDragEnter: m.onDragEnter };
  },

  created() {
    //界面数据初始化
    pd.userId = gd.storage.get('userRow', 'goRoute')?.ID //用户

    console.log('created mounted');
    pd.butLoading = {} //列表按钮
    pd.tabLoading = {} //数据表
    //----
    pd.tabName = ''
    pd.col = [] //表字段信息
    pd.dbs = []//dbs tree 
    pd.tabs = [] //表 tree

    pd.noticeColumns = columns //栏位设置
    pd.entColumns = entColumns //栏位设置


    //--默认值
    pd.activeKey = '通知公告'  //默认标签
    //执行初始化
    m.载入数据库()
    //m.载入数据表()
  },
  mounted() {
    // Vue-Redux 状态管理
    console.log('base mounted');
    ge.emit('头', 1)
  },
  template: tpl,
  components: {

  }

});

