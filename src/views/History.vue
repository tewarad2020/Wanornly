<template>
  <div id="historyPage">
    <div class="title_history">
        <h1>History</h1>
        <Icon id="history_Icon" icon="material-symbols:history-rounded" />
    </div>
    
    <h2>In progress</h2>
    <div  class="itemCtn_progress" v-for="(item,index) in currentHistoryFiltered" :key="index">
      <div class="ctn_image_Inprogress">
          <img :src="item.image" alt="">
      </div>
      <div class="ctn_content_Inprogress">
        <p>{{ item.name }}</p>
        <p>{{ item.status_request }}</p>
        <p v-if="item.status_request=='approve'">approved time :{{ new Date(item.time_resolved).toLocaleTimeString() }}</p>
        <button v-if="item.status_request=='deny'" @click="removeCart(item.user_id,item.ISBN)">delete</button>
      </div>
    </div>
    
    <h2>Returned</h2>
    <div  class="itemCtn_Returned" v-for="(item,index) in currentUserAllBookHistory" :key="index">
      <!-- <p>{{ item.ISBN }}</p>  -->
      <p>{{ item.name }}</p>
      <p>{{ item.time_resolved }}</p>
      <p>{{ item.time_returned }}</p>
      <p>{{ item.time_return_limit }}</p>
    </div>

  </div>
</template>

<script>
import { personalCartHandler, personalHistoryHandler } from '@/mixins/MixinFunction';
import { Icon } from '@iconify/vue';

export default {
    name: 'historyPage',
    components: {
      Icon
    },
    mixins:[personalCartHandler,personalHistoryHandler],
    data(){
      return{

      }
    },
    computed:{
      currentHistoryFiltered:function(){
        let combined = []
        console.log('tttt: ', this.currentPendingFiltered)
        if(this.currentPendingFiltered!=null && this.currentInCartFiltered!=null )
          combined = [].concat(this.currentApproveFiltered,this.currentDenyFiltered,this.currentPendingFiltered)   //just for test, actually is pending and borrowing not inCart
        console.log('test: ', combined)
        return combined
      },
    },
    methods:{
      
    },
    mounted() {
      // let init = () => {
      //   let itemCtn_progress = document.querySelectorAll('.itemCtn_progress')
      //   console.log('itemCtn_progress', itemCtn_progress)
      //   let historyPage = document.getElementById('historyPage')
      //   itemCtn_progress.forEach(element => {
      //     element.style.width = `${historyPage.clientWidth / 3}px`
      //   });
      // }
      // setTimeout(() => {
      //   init()
      // }, 200)
    }
}
</script>

<style>
 @import '../assets/css/history.css';
</style>