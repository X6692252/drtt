import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import './views/index.less'
import { NavBar, Form, Field, Button,Tabbar, TabbarItem,Icon,Tab, Tabs, Cell,ActionSheet, 
List,PullRefresh,Popup,Row,Col,Badge, Search,Image as VanImage, Divider,CellGroup,Tag,DatetimePicker,Lazyload } from 'vant';

Vue.use(Lazyload)
Vue.use(DatetimePicker)
Vue.use(Tag)
Vue.use(CellGroup)
Vue.use(Divider)
Vue.use(VanImage)
Vue.use(Row);
Vue.use(Search)
Vue.use(Col);
Vue.use(Badge);
Vue.use(Popup);
Vue.use(PullRefresh);
Vue.use(ActionSheet)
Vue.use(List);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Cell);
Vue.use(Button);
Vue.use(Form);
Vue.use(Field);
Vue.use(NavBar);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Icon);
Vue.config.productionTip = false

// 封装中间件函数插件
const directiveObj = {
  install (Vue) {
    Vue.directive('fofo',{
      inserted(el) {
        // 组件所在van-search组件
        // 组件根标签是div，input在内部
        // 以上都是原生标签对象
        // nodeName为原生DOM 获取标签名字
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          // el本身不是输入框，尝试往里获取一下
          const theInput = el.querySelector('input')
          const theTextarea = el.querySelector('textarea')
  
          if (theInput) theInput.focus()
          if (theTextarea) theTextarea.focus()
        }
      },
      updated (el) { // 指令所在标签，更新时触发
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          // el本身不是输入框，尝试往里获取一下
          const theInput = el.querySelector('input')
          const theTextarea = el.querySelector('textarea')
  
          if (theInput) theInput.focus()
          if (theTextarea) theTextarea.focus()
        }
      }
    })
  }
}
// 执行目标对象里install方法并传入Vue类
Vue.use(directiveObj)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
