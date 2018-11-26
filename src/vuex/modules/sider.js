// initial state

const state = {
  curTab: 0,
  curMenu: 0,
  curMenuText: '家管理',
  menuList: [
    {
      'tit': '智控',
      'menu': [
        {'icon': 'md-home', 'text': '家管理'},
        {'icon': 'md-cube', 'text': '所有设备'},
        {'icon': 'md-home', 'text': '按房间分类'},
        {'icon': 'md-list', 'text': '按类别分类'}
      ]
    },
    // {
    //   'tit': '家管理',
    //   'menu': [
    //     {'icon': 'md-home', 'text': '家列表'}
    //   ]
    // },
    // {
    //   'tit': '设备管理',
    //   'menu': [
    //     {'icon': 'md-cube', 'text': '所有设备'},
    //     {'icon': 'md-home', 'text': '按房间分类'},
    //     {'icon': 'md-list', 'text': '按类别分类'}
    //   ]
    // },
    {
      'tit': '好品',
      'menu': [
        {'icon': 'md-cube', 'text': '好品'}
      ]
    },
    {
      'tit': '适玩',
      'menu': [
        {'icon': 'md-cloudy-night', 'text': '适玩'}
      ]
    },
    // {
    //   'tit': '智能设定',
    //   'menu': [
    //     {'icon': 'ios-bulb', 'text': '自动化'},
    //     {'icon': 'md-cloudy-night', 'text': '场景'}
    //   ]
    // },
    {
      'tit': '个人中心',
      'menu': [
        {'icon': 'md-settings', 'text': '个人设置'},
        {'icon': 'ios-bulb', 'text': '自动化'},
        {'icon': 'md-cloudy-night', 'text': '场景'},
        {'icon': 'ios-mail', 'text': '意见反馈'},
        {'icon': 'md-help', 'text': '常见问题'},
        {'icon': 'ios-notifications', 'text': '我的消息'}
      ]
    }
  ]
}

// getters
const getters = {
  // productCount: (state) => {
  //   return state.count
  // },
  // doneTodos: state => {
  //   return state.todos.filter(todo => todo.done)
  // }
}

// actions
const actions = {
  changeCurTab ({commit, state}, CURTAB) {
    if (state.curTab === CURTAB) {
      return false
    } else {
      commit('setCurTab', CURTAB)
      commit('setCurMenuText', state.menuList[CURTAB].menu[state.curMenu].text)
    }
  },
  changeCurMenu ({commit, state}, CURMENU) {
    console.log(CURMENU)
    console.log(state.menuList[state.curTab].menu[CURMENU])
    // debugger
    commit('setCurMenu', CURMENU)
    commit('setCurMenuText', state.menuList[state.curTab].menu[CURMENU].text)
  }
}

// mutations
const mutations = {
  setCurTab (state, CURTAB) {
    state.curTab = CURTAB
    state.curMenu = 0
  },
  setCurMenu (state, CURMENU) {
    state.curMenu = CURMENU
  },
  setCurMenuText (state, CURMENUTEXT) {
    state.curMenuText = CURMENUTEXT
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
