<template>
   <div class="ctn_bm_page">
        <div class="title_borrow">
            <h1>Borrow Management</h1>
            <Icon id="return_Icon_main" icon="material-symbols:assignment-return-outline-rounded" />
        </div>  
        <div class="count_pending_return"> Remaining : {{ currentApproveFiltered?.length }} books</div>
        <div class="bm_ctn_content" v-for="(item,ind) in currentApproveFiltered" :key="ind">
            <div class="ctn_image_book_return"> 
                <img :src="item.image" alt="">
            </div>
            <div class="ctn_content_return">
                <p>ISBN | {{ item.ISBN }}</p>
                <p>Book name | {{ item.name }}</p>
                <p>Userame | {{ item.user_id }}</p>
                <!-- <p>{{ item.status_request }}</p> -->
                <p>Time | {{ gettime(item) }} : {{ new Date(item.time_return_limit).toLocaleTimeString('en-US', {
                    hour: 'numeric', minute: 'numeric', hour12: true }).toString() }}</p>
                <!-- <label>day borrow limit</label>
                <input type="number" v-model="dayLimit" placeholder="0"/> -->
                
            </div>
            <div class="btn_return_book" @click="ReturnPerform(item)">
                <Icon id="archive_Icon" icon="bx:archive-in" />
            </div>
        </div>
    </div>
</template>

<script>
import { allCartHandler, personalHistoryHandler } from '../../mixins/MixinFunction'
import { Icon } from '@iconify/vue';
export default {
    name:"borrowManager",
    components: {
        Icon
    },
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
        gettime(item) {
           let str = new Date(item.time_return_limit).toString().split(' ')
           return str[0] + ', ' + str[1] + ' ' + str[2] + ' ' + str[3]
        }
    },
    mounted() {
        const init = () => {
            let bm_ctn_content = document.querySelectorAll('.bm_ctn_content')
            bm_ctn_content.forEach(element => {
                element.style.height = `${bm_ctn_content[0].clientWidth * 0.14}px`
            });
        } 

        setTimeout(() => {
            init()
        }, 200)
        
    }

}
</script>

<style>
     @import "../../assets/css/borrowManager.css";
</style>