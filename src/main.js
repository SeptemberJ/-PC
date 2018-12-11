import Vue from 'vue'
import Vuex from 'vuex'
import store from './vuex/store'
import App from './App'
import router from './router'
import iView from 'iview'
import echarts from 'echarts'
// import '../my-theme/dist/iview.css'
import 'iview/dist/styles/iview.css'

Vue.use(Vuex)
Vue.use(iView, {
  transfer: true,
  size: 'large'
})

Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
