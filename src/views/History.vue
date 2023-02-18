<template>
  <div id="historyPage">
    <br>
    <br>
    <br>
    History
    <div>
      <div  class="itemCtn" v-for="(item,index) in currentHistoryFiltered" :key="index">
       <p>{{ item.ISBN }}</p> 
       <p>{{ item.name }}</p>
       <p>{{ item.status_request }}</p>
       <button v-if="item.status_request=='deny'" @click="removeCart(item.user_id,item.ISBN)">delete</button>
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
    computed:{
      currentHistoryFiltered:function(){
        let combined = []
        if(this.currentPendingFiltered!=null && this.currentInCartFiltered!=null)
          combined = [].concat(this.currentDenyFiltered,this.currentPendingFiltered)   //just for test, actually is pending and borrowing not inCart

        return combined
      } ,
    },
    methods:{
     
    }
}
</script>

<style>
 @import '../assets/css/history.css';
</style>