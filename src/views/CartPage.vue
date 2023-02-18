<template>
  <div class="cartPage">

    <br>
    <br>
    <br>
    
    <div>
      <div  class="itemCtn" v-for="(item,index) in currentInCartFiltered" :key="index">
       <p>{{ item.ISBN }}</p> 
       <p>{{  item.name}}</p>
       <p>{{ item.status_request }}</p>
       <button @click="removeCart(item.user_id,item.ISBN)">remove</button>
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

    mixins:[cartHandler],

    data(){
      return {

      }
    },
  
    methods:{

    // async RemoveHandle(ISBN){
    //   const username = JSON.parse(localStorage.getItem("user_info")).username
        
    //     await axios.delete(`http://localhost:3000/carts/${username}-${ISBN}`)
    //                 .then(()=>{console.log(`remove item :${ISBN} form cart `)})
        
    //                this.fetchCart()
    //  },

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