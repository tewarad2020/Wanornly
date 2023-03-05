<template>
   <div class="bm_page">
        <h1>Borrow Management</h1>
        <div class="bm_ctn" v-for="(item,ind) in currentPageInfoFiltered" :key="ind">
            <p>{{ item.ISBN }}</p>
            <p>{{ item.name }}</p>
            <p>{{ item.user_id }}</p>
            <p>{{ item.status_request }}</p>
            <p>{{  new Date(item.time_return_limit).toString()  }}</p>
            <!-- <label>day borrow limit</label>
            <input type="number" v-model="dayLimit" placeholder="0"/> -->
            <button @click="ReturnPerform(item.user_id,item.ISBN)">return</button>
            <button @click="UndoPerform(item.user_id,item.ISBN)">undo</button>
        </div>
    </div>
</template>

<script>
import { allCartHandler } from '../../mixins/MixinFunction'
export default {
    name:"borrowManager",

    data(){
        return{

        }
    },
    mixins:[allCartHandler],
    methods:{
        async ReturnPerform (user_id,ISBN){

            console.log("returned:",user_id,ISBN)

            this.BookInfo ={
                  ...this.BookInfo,
                  amount:this.BookInfo.amount+1,
              } //return book amount 
              this.updateBook()
              await this.updateRequestStatus(user_id,ISBN,"return")
        },
        async UndoPerform(user_id,ISBN){
            console.log("undo:",user_id,ISBN)
            await this.updateRequestStatus(user_id,ISBN,"undo")
        },
    }

}
</script>

<style>
     @import "../../assets/css/borrowManager.css";
</style>