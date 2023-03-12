import { createStore } from 'vuex'

export default createStore({
  state: {
    data: null,
    Searching: false,
    cartData: null,
    ebookData:null,
   
  },
  getters: {
    data:state=>state.data,
    Searching:state=>state.Searching,
    cartData:state=>state.cartData,
    ebookData:state=>state.ebookData,
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
    },
    setEbookData(state,data){
      state.ebookData = data
    }
  },
  actions: {
  },
  modules: {
  }
})
