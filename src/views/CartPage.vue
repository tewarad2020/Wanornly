<template>
  <div class="cartPage">
    <div>
      <div  class="itemCtn" v-for="(item,index) in cartData" :key="index">
       <p>{{ item.ISBN }}</p> 
       <p>{{ item.product_name }}</p>
       <button @click="RemoveHandle(item.ISBN)">remove</button>
      </div>
      <button>check out</button>
     
    </div>
    
  </div>
</template>

<script>

import store from '@/store';
import axios from 'axios';


export default {
    name:'cartPage',
    created() {
    // watch the params of the route to fetch the data again
    this.$watch(
      () => this.$route.params,
      () => {
        this.fetchCart()
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    )
  },
    data(){
      return {
        cartData:[{
          user_id:"",
          ISBN:0,
          time_item:0,
          request_book:0,
          status_request:"inCart",
          time_request:""
        }]
      }
    },
    methods:{
      async  fetchCart (){
        try{
          const username = JSON.parse(localStorage.getItem("user_info")).username
          console.log(`username = ${username}` )
         await fetch(`http://localhost:3000/carts/${username}`) //get cart information
        .then(res => res.json())
        .then(data => {
          console.log('cart: ',data)
          this.cartData = data
          store.commit('setCartData', data)
          console.log('fetch and store cart information successfully!')
        })
        }
        catch(err){
          console.log(err)
        }
      },
     
    async RemoveHandle(ISBN){
      const username = JSON.parse(localStorage.getItem("user_info")).username
        
        await axios.delete(`http://localhost:3000/carts/${username}-${ISBN}`)
                    .then(()=>{console.log(`remove item :${ISBN} form cart `)})
        
                    this.fetchCart()
     },

    },
   
}
</script>

<style>
  @import '../assets/css/cart.css';
</style>