<template>
  <div id="historyPage">
    <div class="title_history">
        <h1>History</h1>
        <Icon id="history_Icon" icon="material-symbols:history-rounded" />
    </div>
    <div class="Inprogress_title">
      <h2>In progress</h2>
    </div>
    <div  class="itemCtn_progress" v-for="(item,index) in currentHistoryFiltered" :key="index">
      <div class="ctn_image_Inprogress">
          <img :src="item.image" alt="">
      </div>
      <div class="ctn_content_Inprogress">
        <p>Status | {{ item.status_request }}</p>
        <p>Name | {{ item.name }}</p>
        <p v-if="item.status_request=='approve'">approved time | {{ new Date(item.time_resolved).toLocaleTimeString() }}</p>
      </div>
      <div class="btn_removeCart" v-if="item.status_request=='deny'" @click="removeCart(item.user_id,item.ISBN)">delete</div>
    </div>
    
    <div class="Returned_title">
        <h2>Returned</h2>
    </div>
    <div  class="itemCtn_Returned" v-for="(item,index) in currentUserAllBookHistory" :key="index">
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
    setup() {
    },
    mixins:[personalCartHandler,personalHistoryHandler],
    data(){
      return{

      }
    },
    computed:{
      currentHistoryFiltered:function(){
        let combined = []
        if(this.currentPendingFiltered!=null && this.currentInCartFiltered!=null )
          combined = [].concat(this.currentApproveFiltered,this.currentDenyFiltered,this.currentPendingFiltered)   //just for test, actually is pending and borrowing not inCart
          combined.sort((a,b)=>{
              let valueA
              let valueB 
              switch (a.status_request) {
                case 'pending':
                  valueA = 3  
                  break;
                case 'approve':
                  valueA = 2
                  break;
                case 'deny':
                  valueA = 1
                  break;
              }
              switch (b.status_request) {
                case 'pending':
                  valueB = 3  
                  break;
                case 'approve':
                  valueB = 2
                  break;
                case 'deny':
                  valueB = 1
                  break;
              }
              if(valueA - valueB != 0) return valueB - valueA
              else{ //same isbn then compare date
                  if(new Date(a.time_resolved).getTime()<new Date(b.time_resolved).getTime()) return -1
                  else return 1
              }
          })
        return combined
      },
    },
    methods:{
      
    },
    mounted() {
      let init = () => {
        let itemCtn_progress = document.querySelectorAll('.itemCtn_progress')
        let ctn_content_Inprogress = document.querySelectorAll('.ctn_content_Inprogress')
        let historyPage = document.getElementById('historyPage')
        itemCtn_progress.forEach(element => {
          let margin_box = historyPage.clientWidth * 0.4 / 100
          element.style.margin = `${margin_box}px`
          element.style.width = `${(historyPage.clientWidth / 3) - 1*(margin_box * 2)}px`
          element.style.height = `${historyPage.clientWidth / 3 * 0.4}px`
        });
        ctn_content_Inprogress.forEach(element => {
          if (element.firstChild.innerHTML.split(' ')[2] === 'pending') element.classList.add('add_gradient_pending')
          else if (element.firstChild.innerHTML.split(' ')[2] === 'approve') element.classList.add('add_gradient_approve')
          else if (element.firstChild.innerHTML.split(' ')[2] === 'deny') element.classList.add('add_gradient_deny')
        });
      }
      setTimeout(() => {
        init()
      }, 100)
    }
}
</script>

<style>
 @import '../assets/css/history.css';
</style>