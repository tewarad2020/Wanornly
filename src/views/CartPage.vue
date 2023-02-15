<template>
  <div class="cartPage">
    <p>{{cartData}}</p>
    <div>
      <div  class="itemCtn" v-for="(item,index) in testData" :key="index">
       <p>{{ item.ISBN }}</p> 
       <p>{{ item.product_name }}</p>
       <button @click="RemoveHandle(index)">remove</button>
      </div>
      <button>check out</button>
    </div>
    
  </div>
</template>

<script>
import { Timestamp } from 'bson';
import store from '@/store';

export default {
    name:'cartPage',
    setup(){

        const fetchCart = async () =>{
        try{
         await fetch('http://localhost:3000/books') //get cart information
        .then(res => res.json())
        .then(data => {
          console.log('data: ', data)
          store.commit('setData', data)
          //assign fetch data to cartInfo
          console.log('fetch and store cart information successfully!')
          //test
          this.testData = []
        })
        }
        catch(err){
          console.log(err)
        }
      }

      fetchCart()

      //for test()
    },
    data(){
      return {
        updateflag:false,
        cartData:[{
          userID:0,
          ISBN:"",
          timeItem:Timestamp.MAX_VALUE,
          requestBook:{},
          statusRequest:"inCart",
          timeRequested:Timestamp.MAX_VALUE
        }],
        testData:[{
          ISBN:-1,
          product_name:"",
        }]
      }
    },
    methods:{
     updateData_test(){
        this.testData = this.$store.getters.data
     },
     RemoveHandle(index){
        console.log(`remove item :${index} form cart ISBN:${this.testData[index].product_name}`)
     },

    },
    watch:{
      testData:{
        handler(){
          this.testData = this.$store.getters.data
        },
        immediate:true
      }
    },
}
</script>

<style>
  @import '../assets/css/cart.css';
</style>