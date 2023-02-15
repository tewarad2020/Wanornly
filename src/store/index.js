import { createStore } from 'vuex'

export default createStore({
  state: {
    data: null,
    Searching: false,
    cartData: null,
  },
  getters: {
    data:state=>state.data,
    Searching:state=>state.Searching,
    cartData:state=>state.cartData,
  },
  mutations: {
    setData(state, data) {
      state.data = data
    },
    setSearching(state, Searching) {
      state.Searching = Searching
    },
    setCartData(state,data){
      state.cartData=data
    }
  },
  actions: {
  },
  modules: {
  }
})
