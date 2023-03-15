<template>
  <div id="historyPage">
    <div class="title_history">
        <h1>History</h1>
        <Icon id="history_Icon" icon="material-symbols:history-rounded" />
    </div>
    <div class="Inprogress_title">
      <h2>In progress</h2>
    </div>
    <div v-show="currentHistoryFiltered?.length == 0" class="ctn_inprogress_empty">
      <p>In progress is empty</p>
    </div>
    <div v-show="currentHistoryFiltered?.length > 0" class="itemCtn_progress" v-for="(item,index) in currentHistoryFiltered" :key="index">
      <div class="ctn_image_Inprogress">
          <img :src="item.image" alt="">
          <div class="ctn_timeOut_img" v-if="checkLimit(item) === 'timeOut'">
            <img src="../assets/images/warning.png" alt="">
          </div>
      </div>
      <div class="ctn_content_Inprogress">
        <p>Status | {{ item.status_request }}</p>
        <!-- <p style="opacity: 0;">asdasd</p> -->
        <p>Name | {{ item.name }}</p>
        <p v-if="item.status_request=='approve'">Approved | {{ gettimeOnlyresolve(item.time_resolved) }} : {{ new Date(item.time_resolved).toLocaleTimeString('en-US', {
                    hour: 'numeric', minute: 'numeric', hour12: true }).toString() }}</p>
        <p v-if="item.status_request=='pending'">Check Out | {{ gettimeOnlyresolve(item.time_resolved) }} : {{ new Date(item.time_resolved).toLocaleTimeString('en-US', {
        hour: 'numeric', minute: 'numeric', hour12: true }).toString() }}</p>
        <p v-if="item.status_request=='deny'">Deny time | {{ gettimeOnlyresolve(item.time_resolved) }} : {{ new Date(item.time_resolved).toLocaleTimeString('en-US', {
        hour: 'numeric', minute: 'numeric', hour12: true }).toString() }}</p>
        <p v-if="item.status_request=='approve'"><span class="Return_limit_text">Return limit</span> | {{ gettime(item.time_return_limit) }}</p>
        <div class="ctn_remind" v-if="checkLimit(item) === 'remind'">
          <img src="../assets/images/warning.png" alt="">
          <div>less than 3 day</div>
        </div>
        <div class="ctn_timeOut" v-if="checkLimit(item) === 'timeOut'">
          late {{ Math.abs(late_date) }} day
        </div>
      </div>
      <div class="btn_removeCart" v-if="item.status_request=='deny'" @click="removeCart(item.user_id,item.ISBN)">delete</div>
    </div>
    
    <div class="Returned_title">
        <h2>Returned</h2>
    </div>
    <div v-show="currentUserAllBookHistory?.length == 0" class="ctn_returned_empty">
      <p>Returned is empty</p>
    </div>
    <div v-show="currentUserAllBookHistory?.length > 0" class="itemCtn_Returned" v-for="(item,index) in currentUserAllBookHistory" :key="index">
      <div class="ctn_image_Returned">
          <img :src="item.image" alt="">
      </div>
      <div class="ctn_content_Returned">
        <p>Name | {{ item.name }}</p>
        <p>Check Out | {{ gettimeOnlyresolve(item.time_resolved) }} : {{ new Date(item.time_resolved).toLocaleTimeString('en-US', {
        hour: 'numeric', minute: 'numeric', hour12: true }).toString() }}</p>
        <p>Return limit | {{ gettimeOnlyresolve(item.time_return_limit) }}</p>
        <p>Return | {{ gettimeOnlyresolve(item.time_returned) }} : {{ new Date(item.time_returned).toLocaleTimeString('en-US', {
        hour: 'numeric', minute: 'numeric', hour12: true }).toString() }}</p>
      </div>
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
        late_date: 1
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
                  if(new Date(a.time_resolved).getTime()>new Date(b.time_resolved).getTime()) return -1
                  else return 1
              }
          })
        return combined
      },
    },
    methods:{
      gettime(itemTime) {
        let str = new Date(itemTime).toString().split(' ')
        return str[0] + ', ' + str[1] + ' ' + str[2] + ' ' + str[3]
      },
      gettimeOnlyresolve(itemTime) {
        let str = new Date(itemTime).toString().split(' ')
        return str[1] + ' ' + str[2] + ' ' + str[3]
      },
      checkLimit(item) {
        if (item.status_request === 'approve') {
          let diff = new Date(item.time_return_limit) - new Date()
          diff =  Math.ceil(diff / (1000 * 60 * 60 * 24))
          this.late_date = diff
          if (diff >= 0 && diff <= 3) {
            console.log('goto remind')
            return 'remind'
          }
          if (diff < 0) {
            return 'timeOut'
          }
          if (diff > 3) {
            return 'notshow'
          }
        }
      }
    },
    mounted() {
      let init = () => {
        let itemCtn_progress = document.querySelectorAll('.itemCtn_progress')
        let itemCtn_Returned = document.querySelectorAll('.itemCtn_Returned')
        let ctn_content_Inprogress = document.querySelectorAll('.ctn_content_Inprogress')
        let historyPage = document.getElementById('historyPage')
        let ctn_content_Returned = document.querySelectorAll('.ctn_content_Returned')
        itemCtn_Returned.forEach(element => {
          let margin_box = historyPage.clientWidth * 0.4 / 100
          element.style.margin = `${margin_box}px`
          element.style.width = `${(historyPage.clientWidth / 3) - 1*(margin_box * 2)}px`
          element.style.height = `${historyPage.clientWidth / 3 * 0.4}px`
        })
        itemCtn_progress.forEach(element => {
          let margin_box = historyPage.clientWidth * 0.4 / 100
          element.style.margin = `${margin_box}px`
          element.style.width = `${(historyPage.clientWidth / 3) - 1*(margin_box * 2)}px`
          element.style.height = `${historyPage.clientWidth / 3 * 0.4}px`
        })
        ctn_content_Inprogress.forEach(element => {
          if (element.firstChild.innerHTML.split(' ')[2] === 'pending') element.classList.add('add_gradient_pending')
          else if (element.firstChild.innerHTML.split(' ')[2] === 'approve') element.classList.add('add_gradient_approve')
          else if (element.firstChild.innerHTML.split(' ')[2] === 'deny') element.classList.add('add_gradient_deny')
        })
        ctn_content_Returned.forEach(element => {
          element.classList.add('add_gradient_return2')
        })
      }
      setTimeout(() => {
        init()
      }, 290)
    }
}
</script>

<style>
  @import '../assets/css/history.css';
</style>