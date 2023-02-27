<template>
  <div class="ctn_cartPage">  
    <div class="cartPage">
      <!-- <div  class="itemCtn" v-for="(item,index) in currentInCartFiltered" :key="index"> -->
      <div v-if="isloaded">
        <div  class="itemCtn" v-for="(item,index) in currentInCartFiltered" :key="index">
        <!-- <div  class="itemCtn" v-for="(item,index) in this.cartData" :key="index"> -->
          <div class="cart_product_img">
            <img :src="item.image" alt="">
          </div>
          <div class="cart_product_info">
            <div class="index_cart">{{ index+1 }}</div> 
            <!-- <div class="ISBN_cart">ISBN : {{ item.ISBN }}</div> -->
            <div class="Name_cart">Name : {{ item.name }}</div>
            <div class="Author_cart">Author : {{ item.author }}</div>
            <div class="Category_cart">Category : {{ item.category }}</div>
            <div class="Publisher_cart">Publisher : {{ item.publisher }}</div>
            <div class="Time_cart">Time : {{ (new Date(item.time_resolved)).toLocaleDateString() }} | {{ (new Date(item.time_resolved)).toLocaleTimeString('it-IT') }}</div>
            <!-- <div>Status : {{ item.status_request }}</div> -->
            <div class="base_cart"></div>
          </div>
          <div class="btn_cart_remove" @click="showConfirmDelete(index + 1, item)">
            <Icon id="delete_Icon" icon="material-symbols:delete-outline" />
          </div>
        </div>
      </div>
    </div>

    <div class="btn_checkout" @click="showConfirmCheckOut()">
      <Icon id="check_out_Icon" icon="ic:round-check-circle-outline" />
      <div class="btn_checkout_text">Check Out</div> 
    </div>

    <div v-show="confirmCheckOut" class="confirm_checkout Delete_comp_active">
      <div class="confirm_delete_img"><img :src="path.subwarning" alt=""></div>
      <div class="confirm_delete_text">Are you sure, you really want to check out?</div>
      <div @click="SendRequest(); showConfirmCheckOut();" class="confirm_delete_ok">yes</div>
      <div @click="showConfirmCheckOut" class="confirm_delete_no">cancel</div>
      <div @click="showConfirmCheckOut" class="btn_exit_confirm_delete">X</div>
    </div>

    <div v-show="confirmDelete" class="confirm_delete Delete_comp_active">
      <div class="confirm_delete_img"><img :src="path.warning" alt=""></div>
      <div class="confirm_delete_text">Are you sure, you really want to remove order {{ index_book }}?</div>
      <div @click="removeCart(selected_item.user_id,selected_item.ISBN); showConfirmDelete();" class="confirm_delete_ok">yes</div>
      <div @click="showConfirmDelete" class="confirm_delete_no">cancel</div>
      <div @click="showConfirmDelete" class="btn_exit_confirm_delete">X</div>
    </div>

  </div>
</template>

<script>

//import store from '@/store';
import { Icon } from '@iconify/vue';
import axios from 'axios';
import {cartHandler} from '@/mixins/MixinFunction';

export default {
    name:'cartPage',
    components: {
      Icon
    },

    mixins:[cartHandler],

    data(){
      return {
        path: {
          warning: require('../assets/images/warning.png'),
          subwarning: require('../assets/images/subwarning.png')
        },
        isloaded: false,
        confirmDelete: false,
        confirmCheckOut: false,
        index_book: 0,
        selected_item: null,
      }
    },
  
    methods:{
      async SendRequest(){
      console.log("send req")

      const newReq = this.cartData.map(data=>{return{
          ...data,
          time_resolved:new Date(), //time check out
          status_request:"pending"
        }})
        console.log(newReq)
        
        await newReq.map(req=>{
          axios.put(`http://localhost:3000/carts/${req.user_id}-${req.ISBN}`,req)
                      .then(()=>{console.log(`update status item :${req.ISBN} form cart `)})
        })
      
      await this.fetchCart()
      window.location.reload()
      },
      showConfirmDelete(index, item) {
        this.selected_item = item
        this.index_book = index
        if (!this.confirmDelete) {
          this.confirmDelete = true
          setTimeout(() => {
            let confirm_delete_div = document.getElementsByClassName('confirm_delete')[0]
            confirm_delete_div.style.height = `${confirm_delete_div.clientWidth  / 2 * 1.1666}px`
          }, 10);
        }else {
          let confirm_delete_div = document.getElementsByClassName('confirm_delete')[0]
          confirm_delete_div.classList.add('Delete_comp_passive')
          setTimeout(() => {
            this.confirmDelete = false
            confirm_delete_div.classList.remove('Delete_comp_passive')
          }, 250)
        }
      },
      showConfirmCheckOut() {
        if (!this.confirmCheckOut) {
          this.confirmCheckOut = true
          setTimeout(() => {
            let confirm_checkout_div = document.getElementsByClassName('confirm_checkout')[0]
            confirm_checkout_div.style.height = `${confirm_checkout_div.clientWidth  / 2 * 1.1666}px`
          }, 10);
        }else {
          let confirm_checkout_div = document.getElementsByClassName('confirm_checkout')[0]
          confirm_checkout_div.classList.add('Delete_comp_passive')
          setTimeout(() => {
            this.confirmCheckOut = false
            confirm_checkout_div.classList.remove('Delete_comp_passive')
          }, 250)
        }
      }
  },
  
  mounted() {
    let initial = () => {
      this.isloaded = true
    }

    setTimeout(() => {
      initial()
    }, 0)

    setTimeout(() => {
      let itemCtn = document.querySelectorAll('.itemCtn')
      console.log('itemCtn: ', itemCtn)
      if (itemCtn) {
        let cart_product_img = document.getElementsByClassName('cart_product_img')[0]
        let base_cart = document.querySelectorAll('.base_cart')
        let width = cart_product_img?.clientWidth
        itemCtn.forEach(element => {
          element.style.height = `${width * 1.3}px`
        });
        let i = 0
        base_cart.forEach(element => {
          element.style.animation = `slide 7s infinite linear ${(i % 5) / 1.2}s`
          i++
        });
        // animation: slide 5s infinite linear;
      }
    }, 100)
  }
}
</script>

<style>
  @import '../assets/css/cart.css';
</style>