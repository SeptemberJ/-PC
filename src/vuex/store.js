import Vue from 'vue'
import Vuex from 'vuex'
import sider from './modules/sider'
import home from './modules/home'
// import * as actions from './actions'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const state = {
  count: 10,
  PlainText: 'ZNKZ',
  ifSpin: false,
  register_id: '', // '2f40a8dacb9711e88d1a00163e11716c', // '4dd928bab4a811e88d1a00163e11716c',
  accountPhone: '',
  curHome: {},
  homeList: [],
  roomList: [],
  //  modal status
  ifAddMaster: false,
  ifAddSecond: false,
  ifAddEQ: false,
  ifAddScene: false,
  ifShowChart: false,
  ifShowTabBar: true,
  LimitRange: {
    'PM2.5': [{
      gt: 0,
      lte: 35,
      color: '#096'
    }, {
      gt: 35,
      lte: 75,
      color: '#ffde33'
    }, {
      gt: 75,
      lte: 115,
      color: '#ff9933'
    }, {
      gt: 115,
      lte: 150,
      color: '#cc0033'
    }, {
      gt: 150,
      lte: 250,
      color: '#660099'
    }, {
      gt: 250,
      color: '#7e0023'
    }],
    'PM10': [{
      gt: 0,
      lte: 35,
      color: '#096'
    }, {
      gt: 35,
      lte: 75,
      color: '#ffde33'
    }, {
      gt: 75,
      lte: 115,
      color: '#ff9933'
    }, {
      gt: 115,
      lte: 150,
      color: '#cc0033'
    }, {
      gt: 150,
      lte: 250,
      color: '#660099'
    }, {
      gt: 250,
      color: '#7e0023'
    }],
    'CO2': [{
      gt: 350,
      lte: 450,
      color: '#096'
    }, {
      gt: 450,
      lte: 1000,
      color: '#ffde33'
    }, {
      gt: 1000,
      lte: 2000,
      color: '#ff9933'
    }, {
      gt: 2000,
      lte: 5000,
      color: '#cc0033'
    }, {
      gt: 5000,
      color: '#660099'
    }],
    'CO': [{
      gt: 0.1,
      lte: 0.5,
      color: '#096'
    }, {
      gt: 0.5,
      lte: 5,
      color: '#ffde33'
    }, {
      gt: 5,
      lte: 15,
      color: '#ff9933'
    }, {
      gt: 15,
      lte: 100,
      color: '#cc0033'
    }, {
      gt: 100,
      lte: 200,
      color: '#660099'
    }, {
      gt: 200,
      color: '#7e0023'
    }],
    '甲醛': [{
      gt: 0.06,
      lte: 0.1,
      color: '#096'
    }, {
      gt: 0.1,
      lte: 0.5,
      color: '#ffde33'
    }, {
      gt: 0.5,
      lte: 1,
      color: '#ff9933'
    }, {
      gt: 1,
      color: '#cc0033'
    }],
    '温度': [{
      gt: 0,
      lte: 10,
      color: '#0000FF'
    }, {
      gt: 10,
      lte: 16,
      color: '#87CEFA'
    }, {
      gt: 16,
      lte: 25,
      color: '#096'
    }, {
      gt: 25,
      lte: 28,
      color: '#ffde33'
    }, {
      gt: 28,
      color: '#cc0033'
    }],
    '湿度': [{
      gt: 0,
      lte: 40,
      color: '#cc0033'
    }, {
      gt: 40,
      lte: 60,
      color: '#87CEFA'
    }, {
      gt: 60,
      color: '#0000FF'
    }]
  }
}
// actions
const actions = {
  changeTabStatus ({commit, state}) {
    commit('setTabStatus')
  },
  changeCurRegisterId ({commit, state}, ID) {
    commit('setCurRegisterId', ID)
  },
  changeCurAccountPhone ({commit, state}, PHONE) {
    commit('setCurAccountPhone', PHONE)
  },
  toggleSpin ({commit, state}, STATUS) {
    commit('setSpin', STATUS)
  },
  changeCurHome ({commit, state}, CURHOME) {
    // console.log('CURHOME-----------------')
    // console.log(CURHOME)
    commit('setCurHome', CURHOME)
  },
  changeHomeList ({commit, state}, HOMELIST) {
    commit('setHomeList', HOMELIST)
  },
  changeModalShow ({commit, state}, TYPE) {
    commit('setModalShow', TYPE)
  },
  changeRoomList ({commit, state}, ROOMLIST) {
    commit('setRoomList', ROOMLIST)
  }
}

// mutations
const mutations = {
  setTabStatus (state) {
    state.ifShowTabBar = !state.ifShowTabBar
  },
  setCurRegisterId (state, ID) {
    state.register_id = ID
  },
  setCurAccountPhone (state, PHONE) {
    state.accountPhone = PHONE
  },
  setSpin (state, STATUS) {
    state.ifSpin = STATUS
  },
  setCurHome (state, CURHOME) {
    state.curHome = CURHOME
  },
  setHomeList (state, HOMELIST) {
    state.homeList = HOMELIST
  },
  setRoomList (state, ROOMLIST) {
    console.log(ROOMLIST)
    state.roomList = ROOMLIST
  },
  setModalShow (state, TYPE) {
    switch (TYPE) {
      case 'Master':
        state.ifAddMaster = !state.ifAddMaster
        break
      case 'Second':
        state.ifAddSecond = !state.ifAddSecond
        break
      case 'EQ':
        state.ifAddEQ = !state.ifAddEQ
        break
      case 'Scene':
        state.ifAddScene = !state.ifAddScene
        break
      case 'Chart':
        state.ifShowChart = !state.ifShowChart
        break
    }
  }
}

export default new Vuex.Store({
  state,
  modules: {
    sider,
    home
  },
  // getters,
  actions,
  mutations,
  strict: debug
  // plugins: debug ? [createLogger()] : []
})
