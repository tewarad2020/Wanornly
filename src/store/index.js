import { createStore } from 'vuex'

export default createStore({
  state: {
    data: null,
    Searching: false,
    cartData: null,
    isCartFetch:false,
  },
  getters: {
    data:state=>state.data,
    Searching:state=>state.Searching,
    cartData:state=>state.cartData,
    isCartFetch:state=>state.isCartFetch,
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
      state.isCartFetch = true
    },
    setCartFlag(state,data){
      state.isCartFetch = data
    },
  },
  actions: {
  },
  modules: {
  }
})
