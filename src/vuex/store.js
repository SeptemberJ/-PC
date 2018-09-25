import Vue from 'vue'
import Vuex from 'vuex'
import sider from './modules/sider'
import * as actions from './actions'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const state = {
  count: 10
}

export default new Vuex.Store({
  state,
  modules: {
    sider
  },
  // getters,
  actions,
  strict: debug
  // plugins: debug ? [createLogger()] : []
})
