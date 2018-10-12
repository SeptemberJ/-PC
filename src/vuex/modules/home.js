// initial state

const state = {
  CurType: 0,
  app_URL: 'http://www.smart-hox.com:8081/hoxJK/' // 'http://205.168.1.106:8081/hoxJK/'
}

// getters
const getters = {
}

// actions
const actions = {
  changehomeshowtype ({commit, state}, CURTYPE) {
    commit('setCurType', CURTYPE)
  }
}
// mutations

const mutations = {
  setCurType (state, CURTYPE) {
    state.CurType = CURTYPE
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
