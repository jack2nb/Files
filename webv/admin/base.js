const { toRaw, watch, reactive, computed, ref, onMounted, toRefs, defineAsyncComponent } = Vue;
const { Modal, message, Form, notification } = antd;




let url = './admin/base.html' + gi.version(true) //模板文件
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
  点击标签(标签) {
    //读取数据
    console.log(标签)
    if (标签 == '通知公告') { gd.reg.ui.载入公告() }
    if (标签 == '常用入口') { gd.reg.ui.载入常用入口() }

  };
  载入常用入口() {
    //读取常用入口
    let vn = {
      "kq/常用入口": {}
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

  载入公告() {
    //读取公告
    let vn = {
      "kq/通知公告": {}
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


  添加公告() {
    pd.添加公告抽屉 = true//添加公告
    fm.nReset();//重置
  }


  添加常用入口() {
    pd.添加常用抽屉 = true//添加公告
    fm.eReset();//重置
  }


  modals(name, show) {
    //遮罩层管理 显示
    pd.modals[name] = show
  }
  nShoeChange(row) {
    //修改
    _.forEach(fm.nVal, function (value, key) {
      //拷贝数据
      fm.nVal[key] = key in row ? row[key] : fm.nVal[key]
      console.log('copy=', key, row?.[key]);
    });
    //fm.nVal.update( row) //不能直接赋值
    pd.添加公告抽屉 = true
  }
  ndel(row) {
    //删除数据
    console.log(row);
  

    var url = dataUrl + 'jsonapi/del?notice'
    var vn = {}
    vn[fm.nTab] = { "id": row['id'] };
    console.log(vn)

    //入库
    axios.post(url, vn)
      .then(res => {
        console.log('jsonapi/del?notice', res)
        if (res.data?.['@code'] == 200) {
          //多个单据要累加
          gd.reg.ui.载入公告();
          message.success('删除完成');
        } else {
          antd.message.error('删除 通告出现意外 稍后再试');
          console.error('jsonapi/del?notice err msg', res.data['@msg'])
        }
      }
      )
      .catch((res) => {
        console.error('删除 通告出现出错', res);
        antd.message.error('删除 通告出现出错')
      })
    return { vn, url }
  }
  nChange(row) {
    /* row dict 拷贝数据
    return {vn ,url }
    */
    var url = dataUrl + 'jsonapi/put?notice'
    var vn = {}
    vn[fm.nTab] = { "id": row['id'], "@update": row };
    //不允许修改的字段
    //添加时 系统管理字段
    gd.reg.ui.defChange(row);//含id
    row['time'] = row['time']?.format ? row['time']?.format("YYYY-M-D") : row['time'];//类型修改

    return { vn, url }
  }
  nAdd(row) {
    /* row dict 拷贝数据
    return {vn ,url }
    */
    var url = dataUrl + 'jsonapi/post?notice'
    var vn = {}
    //添加时 系统管理字段
    gd.reg.ui.defAdd(row)
    row['time'] = row['time']?.format ? row['time']?.format("YYYY-M-D") : row['time'];//类型修改

    vn[fm.nTab] = row;
    return { vn, url }
  }
  nSave(row) {
    /* row 表单数据 fm.nVal
    */
    if (row['id']) {
      var vn = gd.reg.ui.nChange(row)
    } else {
      //添加时
      var vn = gd.reg.ui.nAdd(row)
    }
    console.log('vn==', vn);
    //入库
    axios.post(vn.url, vn.vn)
      .then(res => {
        console.log('jsonapi/?notice', res)
        if (res.data?.['@code'] == 200) {
          //多个单据要累加
          pd.butLoading['保存通知公告'] = 0
          pd.添加公告抽屉 = false//添加公告  
          gd.reg.ui.载入公告();
        } else {
          pd.butLoading['保存通知公告'] = 0
          antd.message.error('通告填写/修改出现意外 稍后再试');
          console.error('jsonapi/?notice err msg', res.data['@msg'])
        }
      }
      )
      .catch((res) => {
        pd.butLoading['保存通知公告'] = 0
        console.error('读通告填写/修改出错', res);
        antd.message.error('通告填写/修改出错出错')
      })


  }

  nSubmit() {
    //通知公告提交
    //验证表单
    gd.reg.fm.nValidate().then(() => {
      //创建copy拷贝
      var row = {}
      _.forEach(toRaw(gd.reg.fm.nVal), (value, key) => {
        row[key] = value;
      });
      console.log(row, toRaw(gd.reg.fm.nVal));
      //入库
      gd.reg.ui.nSave(row)
      pd.butLoading['保存通知公告'] = 1

    }).catch(err => {
      console.error('error', err);
    });
  }
  eSubmit() {
    //从用入口 提交
    //验证表单
    gd.reg.fm.eValidate().then(() => {

      //创建copy拷贝
      var row = {}
      _.forEach(toRaw(gd.reg.fm.eVal), (value, key) => {
        row[key] = value;
      });
      console.log(row, toRaw(gd.reg.fm.eVal));
      //入库
      gd.reg.ui.eSave(row)
      pd.butLoading['保存常用入口'] = 1

    }).catch(err => {
      console.error('error', err);
    });
  }
  eSave(row) {
    /* row 表单数据 fm.nVal
       */
    if (row['id']) {
      var vn = gd.reg.ui.eChange(row)
    } else {
      //添加时
      var vn = gd.reg.ui.eAdd(row)
    }
    console.log('vn==', vn);
    //入库
    axios.post(vn.url, vn.vn)
      .then(res => {
        console.log('jsonapi/?entrance', res)
        if (res.data?.['@code'] == 200) {
          //多个单据要累加
          pd.butLoading['保存常用入口'] = 0
          pd.添加常用抽屉 = false//添加公告  
          gd.reg.ui.载入常用入口();
        } else {
          pd.butLoading['保存常用入口'] = 0
          antd.message.error('常用入口添加/修改出现意外 稍后再试');
          console.error('jsonapi/?entrance err msg', res.data['@msg'])
        }
      }
      )
      .catch((res) => {
        pd.butLoading['保存常用入口'] = 0
        console.error('常用入口添加/修改出错', res);
        antd.message.error('常用入口添加/修改出错')
      })

  }
  eChange(row) {
    /* row dict 拷贝数据
    return {vn ,url }
    */
    var url = dataUrl + 'jsonapi/put?entrance'
    var vn = {}
    vn[fm.eTab] = { "id": row['id'], "@update": row };
    //删除不允许修改字段，添加修改人和修改时间
    gd.reg.ui.defChange(row);//含id
    return { vn, url }
  }
  eAdd(row) {
    /* row dict 拷贝数据
    return {vn ,url }
    */
    var url = dataUrl + 'jsonapi/post?entrance'
    var vn = {}
    //添加 时间和创建人字段
    gd.reg.ui.defAdd(row)

    vn[fm.eTab] = row;
    return { vn, url }
  }
  eShoeChange(row) {
    //修改
    _.forEach(fm.eVal, function (value, key) {
      //拷贝数据
      fm.eVal[key] = key in row ? row[key] : fm.eVal[key]
      console.log('copy=', key, row?.[key]);
    });
    //fm.nVal.update( row) //不能直接赋值
    pd.添加常用抽屉 = true
  }


  
  edel(row) {
    //删除数据
    console.log(row);
   

    var url = dataUrl + 'jsonapi/del?entrance'
    var vn = {}
    vn[fm.eTab] = { "id": row['id'] };
    console.log(vn)

    //入库
    axios.post(url, vn)
      .then(res => {
        console.log('jsonapi/del?entrance', res)
        if (res.data?.['@code'] == 200) {
          //多个单据要累加
          gd.reg.ui.载入常用入口();
          message.success('删除完成');
        } else {
          antd.message.error('删除 常用入口出现意外 稍后再试');
          console.error('jsonapi/del?entrance err msg', res.data['@msg'])
        }
      }
      )
      .catch((res) => {
        console.error('删除 常用入口出现出错', res);
        antd.message.error('删除 常用入口出现出错')
      })
    return { vn, url }
  }

  defAdd(row) {
    // 添加时默认操作
    row['CREATORID'] = gd.storage.get('erpUser', 'goRoute')?.FUSERID; //goRoute:userRow
    row['AUTHOR'] = gd.storage.get('userRow', 'goRoute')?.ID;//oa 用户 // goRoute:erpUser
    row['CREATETIME'] = moment(new Date().getTime()).format("yyyy-MM-DD HH:mm:ss");
    //删除主键 id
    _.forEach(["id"], (key) => {
      key in row ? delete row[key] : null;
    });
    return row
  }
  defChange(row) {
    // 修改时默认操作
    row['FMODIFIERID'] = gd.storage.get('userRow', 'goRoute')?.ID;//oa 用户 
    row['FMODIFYDATE'] = moment(new Date().getTime()).format("yyyy-MM-DD HH:mm:ss");
    //不允许修改的字段
    _.forEach(["id", 'CREATORID', 'AUTHOR', 'CREATETIME'], (key) => {
      key in row ? delete row[key] : null;
      console.log('delete==', key)
    });
    return row
  }
}

const pd = reactive({});// 响应层对象
(() => {
  pd.isLoading = 0;//只加载一次 
})();




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
    return { m, pd, fm, nFormRef: fm.nFormRef, ndel: m.ndel, edel: m.edel };
  },

  created() {
    //界面数据初始化
    pd.userId = gd.storage.get('userRow', 'goRoute')?.ID //用户

    console.log('created mounted');
    pd.butLoading = {} //列表按钮
    pd.tabLoading = {} //数据表
    //----
    pd.notice = []//通知公告列表数据
    pd.entranc = []//常用入口列表数据
    pd.noticeColumns = columns //栏位设置
    pd.entColumns = entColumns //栏位设置

    pd.添加公告抽屉 = false//公告表单显示
    pd.添加常用抽屉 = false//公告表单显示

    //--默认值
    pd.activeKey = '通知公告'  //默认标签
    //执行初始化
    m.载入公告()
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

