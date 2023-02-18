<template>
  <div class="cartPage">

    <br>
    <br>
    <br>
    
    <div>
      <div  class="itemCtn" v-for="(item,index) in InCartFiltered" :key="index">
       <p>{{ item.ISBN }}</p> 
       <p>{{  item.name}}</p>
       <p>{{ item.status_request }}</p>
       <button @click="RemoveHandle(item.ISBN)">remove</button>
      </div>
      <button @click="SendRequest">check out</button>
    </div>
    
  </div>
</template>

<script>

//import store from '@/store';
import axios from 'axios';
import {cartHandler} from '@/mixins/MixinFunction';

export default {
    name:'cartPage',
    // mounted(){
    //   this.fetchCart
    // },
    mixins:[cartHandler],
    // watch:{
    //   bookInCart(){
    //     if(this.bookInCart!=null)
    //     this.bookInCart.filter(ele=>ele.status_request=="inCart")
    //   }
    // },
    // computed:{
    //   cartFiltered:function(){
    //     return this.cartData.filter(ele=>ele.status_request=="inCart")
    //     //return this.bookInCart.filter(ele=>ele.status_request=="inCart")
    //   } ,

    // },
    data(){
      return {
        // cartData:[{
        //   user_id:"",
        //   ISBN:0,
        //   time_item:null,
        //   status_request:"inCart",
        //   time_request:null
        // }],
      }
    },
  
    methods:{
      // async  fetchCart (){
      //   try{
      //     const username = JSON.parse(localStorage.getItem("user_info")).username
      //     console.log(`username = ${username}` )
      //    await fetch(`http://localhost:3000/carts/${username}`) //get cart information
      //   .then(res => res.json())
      //   .then(data => {
      //     console.log('cart: ',data)
      //     this.cartData = data.filter(ele=>ele.status_request=="inCart")
      //     store.commit('setCartData', data)
      //     console.log('fetch and store cart information successfully!')
      //   })
      //   }
      //   catch(err){
      //     console.log(err)
      //   }
      // },
     
    async RemoveHandle(ISBN){
      const username = JSON.parse(localStorage.getItem("user_info")).username
        
        await axios.delete(`http://localhost:3000/carts/${username}-${ISBN}`)
                    .then(()=>{console.log(`remove item :${ISBN} form cart `)})
        
                   this.fetchCart()
     },

    async SendRequest(){
     console.log("send req")

     const newReq = this.cartData.map(data=>{return{
        ...data,
        time_request:new Date(),
        status_request:"pending"
      }})
      console.log(newReq)
      
      await newReq.map(req=>{
        axios.put(`http://localhost:3000/carts/${req.user_id}-${req.ISBN}`,req)
                     .then(()=>{console.log(`update status item :${req.ISBN} form cart `)})
      })
    
     this.fetchCart()
    },
  }
}
</script>

<style>
  @import '../assets/css/cart.css';
</style>