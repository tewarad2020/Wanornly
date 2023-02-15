import { createStore } from 'vuex'

export default createStore({
  state: {
    data: null,
    Searching: false,
  },
  getters: {
    data:state=>state.data,
    Searching:state=>state.Searching,
  },
  mutations: {
    setData(state, data) {
      state.data = data
    },
    setSearching(state, Searching) {
      state.Searching = Searching
    },
  },
  actions: {
  },
  modules: {
  }
})
