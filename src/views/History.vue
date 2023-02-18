<template>
  <div id="historyPage">
    <br>
    <br>
    <br>
    History
    <div>
      <div  class="itemCtn" v-for="(item,index) in PendingFiltered" :key="index">
       <p>{{ item.ISBN }}</p> 
       <p>{{ item.name }}</p>
       <p>{{ item.status_request }}</p>
       <button @click="RemoveHandle(item.ISBN)">remove</button>
      </div>
    </div>
  </div>
</template>

<script>
import { cartHandler } from '@/mixins/MixinFunction';
export default {
    name: 'historyPage',
    mixins:[cartHandler],
    data(){
      return{

      }
    },
    // computed:{
    //   cartFiltered:function(){
    //     return this.cartData.filter(ele=>ele.status_request!="inCart")
    //   } ,
    // },
    methods:{

    }
}
</script>

<style>
 @import '../assets/css/history.css';
</style>