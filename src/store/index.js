import { createStore } from 'vuex'

export default createStore({
  state: {
    data: 'Mydata fuck',
  },
  getters: {
    data:state=>state.data,
  },
  mutations: {
    setData(state, data) {
      state.data = data
    }
  },
  actions: {
  },
  modules: {
  }
})
