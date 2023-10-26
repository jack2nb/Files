const { watch, reactive, computed, ref, onMounted, toRefs } = Vue;
const { Modal, message, notification, Grid } = antd;
/*
读取，主要个单据， 所有者是本人，状态【 创建，审核中】

*/
// 便签
let url = 'cp/indicator.html'+gi.version(true) //模板文件
const response = await fetch(url);
let tpl = await response.text();


const routeUrl = gi.cfg('routeUrl')  
const dataUrl = gi.cfg('dataUrl')  


const gd = {};//全局数据 解决调用引用问题
gd.reg = {} //组成类到全局调用
gd.group = 'indicator' //功能应用分组

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
  读取处理的流程(erpId) {

    //查询用户
    var vn = {
      "erp/T_WF_PROCINST": {//流程
        "@column": "FPROCDEFID.流程id,FPROCINSTID.流程实例id,FSTATUS.流程状态,FBILLNO.单据编号",
        "FSTATUS": 2,//"处理中" 

      },
      "erp/T_WF_ASSIGN": {//任务
        "@column": "FCREATETIME.日期,FSTATUS.节点状态,FASSIGNID.任务id,FPROCINSTID.流程实例id,FACTINSTID.节点id",

        "FSTATUS": 0,//进行中
        "FPROCINSTID|": "erp/T_WF_PROCINST.流程实例id",
        "@order": "-日期"
      },
      "erp/T_WF_RECEIVER": {
        "@column": "FASSIGNID.任务id,FRECEIVERID.接收人id,FTITLE.标题,FCONTENT.内容",
        "FASSIGNID|": "erp/T_WF_ASSIGN.任务id",
        "FRECEIVERID": erpId

      },
      "erp/T_SEC_USER": {
        "@column": "FUSERID.接收人id,FNAME.名字",
        'FUSERID|': "erp/T_WF_RECEIVER.接收人id"
      },


    }

    var url = dataUrl + 'jsonapi/get?PROCINST'

    axios.post(url, vn)
      .then(res => {
        console.log('jsonapi/get?PROCINST', res)
        if (res.data?.['@code'] == 200) {
          //多个单据要累加

          pd.flows = res.data["erp/T_WF_RECEIVER"]
          pd.loadings['需要处理的流程'] = 1//显示

        }
      }
      )
      .catch(() => { antd.message.error('需要处理的流程') })
  }
  读取主要单据(erpId) {
    //读取用户 创建的单据
    var vn = {}
    var tabDc = {
      "erp/T_SAL_ORDER": "销售订单"
      , "erp/T_PUR_POORDER": "采购订单"
      , "erp/T_SAL_DELIVERYNOTICE": "发货通知单"
      , "erp/T_SAL_OUTSTOCK": "出库单"
      , "erp/T_STK_INSTOCK": "入库单"
      , "erp/T_STK_MISDELIVERY": "其他入库单"
      , "erp/T_STK_MISCELLANEOUS": "其他出库单"
      , "erp/T_PRD_MO": "生产订单"
      , "erp/T_PRD_PICKMTRL": "生产领料单"
      , "erp/T_PRD_INSTOCK": "生产入库单"
    }
    _.forEach(tabDc, (n, val) => {

      vn[val] = {//销售
        "@column": "FBILLNO.单据编号 ",
        'FCREATORID': erpId,
        "FDOCUMENTSTATUS&": '<>C'
      }
    });
    var url = dataUrl + 'jsonapi/get?Bill'
    axios.post(url, vn)
      .then(res => {
        console.log('jsonapi/get?Bill', res)
        var count = 0;
        var union = [];
        if (res.data?.['@code'] == 200) {
          //多个单据要累加
          //_.forEach(tabDc, (n, val) => {count = count + res.data[val] .length;console.log(n, val)});
          _.forEach(tabDc, (n, val) => {
            _.forEach(res.data[val], (val, m) => { val['name'] = n }) //加入名称
            union = union.concat(res.data[val]);
            //console.log(n, val)
          });

          console.log(union.length)
          pd.union = union.length
          pd.未完成的单据数 = union
          pd.loadings['未完成的单据数'] = 1//显示
        } else {
          antd.message.error('读取erp未完成单据意外');
          console.error('jsonapi/get?Bill err msg', res.data['@msg'])
        }
      }
      )
      .catch((res) => { console.error('读取未完成的单据数出错', res); antd.message.error('读取未完成的单据数出错') })


  }
  用户检查(erpId) {
    //是否是erp
    // gd.storage.set('userRow', pd.usersRow, 'goRoute')//用户信息
    // gd.storage.set('userIp', pd.userIp, 'goRoute')//ip设备信息信息
    pd.usersRow = gd.storage.get('userRow', 'goRoute')
    console.log('goRoute userRow', pd.usersRow)

    var vn = {

      "erp/T_SEC_USER": {
        //"@column": "FUSERID.用户id,FNAME.名字",
        'FNAME': pd.usersRow['NAME']
      },
      "erp/T_SEC_USER@FPHONE": {
        //"@column": "FUSERID.用户id,FNAME.名字",
        'FPHONE': pd.usersRow['TELEPHONE']
      }

    }

    var url = dataUrl + 'jsonapi/get?T_SEC_USER'

    axios.post(url, vn)
      .then(res => {
        console.log('jsonapi/get?T_SEC_USER', res)
        if (res.data?.['@code'] == 200) {
          //多个单据要累加
          pd.erpUsers = res.data["erp/T_SEC_USER"]
          if (pd.erpUsers.length > 0) {
            gd.storage.set('erpUser', pd.erpUsers[0], 'goRoute')//用户信息
            pd.erpUser = pd.erpUsers[0]
            pd.erpId = pd.erpUser['FUSERID']
          }
          pd.erpUsers = res.data["erp/T_SEC_USER@FPHONE"]
          if (pd.erpUsers.length > 0) {
            gd.storage.set('erpUser', pd.erpUsers[0], 'goRoute')//用户信息
            pd.erpUser = pd.erpUsers[0]
            pd.erpId = pd.erpUser['FUSERID']
          }

          //读取指标
          if (pd.erpId) {
            gd.reg.ui.读取主要单据(pd.erpId)
            gd.reg.ui.读取处理的流程(pd.erpId)
          }
        } else {
          antd.message.error('读取erp用户发送意外');
          console.log('jsonapi/get?T_SEC_USER err msg', res.data['@msg'])

        }
      }
      )
      .catch((res) => { console.error('读取erp用户出错', res); antd.message.error('读取erp用户出错') })


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
    pd.loadings = {} //载入
    pd.flows = [] //待处理流程
    pd.erpId = '' //是erp用户？
    console.log(gd.group + '  created  ');
    m.用户检查();
  },
  mounted() {
    // Vue-Redux 状态管理
    console.log(gd.group + ' mounted  ');
  },
  template: tpl,





});
