<template>
   <div class="bm_page">
        <h1>Borrow Management</h1>
        <div class="bm_ctn" v-for="(item,ind) in currentApproveFiltered" :key="ind">
            <p>{{ item.ISBN }}</p>
            <p>{{ item.name }}</p>
            <p>{{ item.user_id }}</p>
            <p>{{ item.status_request }}</p>
            <p>{{  new Date(item.time_return_limit).toString()  }}</p>
            <!-- <label>day borrow limit</label>
            <input type="number" v-model="dayLimit" placeholder="0"/> -->
            <button @click="ReturnPerform(item)">return</button>
        </div>
    </div>
</template>

<script>
import { allCartHandler, personalHistoryHandler } from '../../mixins/MixinFunction'
export default {
    name:"borrowManager",

    data(){
        return{

        }
    },
    mixins:[allCartHandler, personalHistoryHandler],
    methods:{
        async ReturnPerform (cartData){
            const user_id = cartData.user_id
            const ISBN = cartData.ISBN

            console.log("returned:",user_id,ISBN)

            this.BookInfo ={
                  ...this.BookInfo,
                  amount:this.BookInfo.amount+1,
              } //return book amount 
              this.updateBook()


             // await this.updateRequestStatus(user_id,ISBN,"return")
             
            await this.AddToHistory(cartData) 
            await this.removeCart(user_id,ISBN) //remove from cart
        },
    }

}
</script>

<style>
     @import "../../assets/css/borrowManager.css";
</style>