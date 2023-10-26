const { watch, reactive, computed, ref, onMounted, toRefs   } = Vue;
const { Modal, message, notification ,Grid } = antd;

const { Moment } = moment;
 
let url = 'demo.html'+gi.version(true) //模板文件
let response = await fetch(url);
let tpl = await response.text();

 
 

 
const gd = {};//全局数据 解决调用引用问题
gd.reg = {} //组成类到全局调用
gd.group = 'demo' //功能应用分组

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
  
const dateFormat = 'YYYY-MM-DD';


const searchInput = ref();
export default  ({

  setup() { //响应式数据的方法

    const confirm = (e ) => {
      console.log(e);
      message.success('Click on Yes');
    };

    const cancel = (e ) => {
      console.log(e);
      message.error('Click on No');
    };
 

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      state.searchText = selectedKeys[0];
      state.searchedColumn = dataIndex;
    };

    const handleReset = clearFilters => {
      clearFilters();
      state.searchText = '';
    };

    return {
      confirm,
      
      handleSearch,
      handleReset,
      dateFormat,
      value1:ref(moment),
    

    
    };
  },
  created() {
    console.log(gd.group + ' created  ');

  },
  mounted() {
    ge.emit('头', 1);
    console.log(gd.group + ' created  ');
    
   }
  ,
  template: tpl,
});