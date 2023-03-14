<template>
    <div class="rm_page_ctn">
        <div class="title_request">
            <h1>Request Management</h1>
            <Icon id="request_Icon_main" icon="pajamas:requirements" />
            <div v-show="currentPendingFiltered?.length > 0" class="count_pending_request"> Remaining : {{ currentPendingFiltered?.length }} books</div>
        </div>    
        
        <div class="rm_ctn_content" v-for="(item,ind) in currentPendingFiltered" :key="ind">
            <div class="ctn_image_book">
                <img :src="item.image" alt="">
            </div>
            <div class="ctn_content_request">
                <p>ISBN | {{ item.ISBN }}</p>
                <p>Book name | {{ item.name }}</p>
                <p>Usernam | {{ item.user_id }}</p>
                <p>Time | {{ item.time_resolved.split('T')[0] }} : {{ item.time_resolved.split('T')[1].split('.')[0] }}</p>
                <p>Time | {{ gettime(item.time_resolved) }} : {{ new Date(item.time_resolved).toLocaleTimeString('en-US', {
                    hour: 'numeric', minute: 'numeric', hour12: true }).toString() }}</p>
                <p>{{ item.time_return_limit }}</p>
                <div class="ctn_limit">
                    Day borrow limit
                    <input class="input_dayLimit" type="number" placeholder="7"/>
                    <button class="btn_Approve" @click="ApproveCheck(item.user_id,item.ISBN,ind)">
                        <Icon id="check_Icon" icon="material-symbols:check-small-rounded" />
                    </button>
                    <button class="btn_Deny" @click="DenyPerform(item.user_id,item.ISBN,ind)">
                        <Icon id="trash_Icon" icon="tabler:trash-x-filled" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {  allCartHandler } from '@/mixins/MixinFunction';
import { Icon } from '@iconify/vue';

export default {
    name:"requestManager",
    components: {
        Icon
    },
    mixins:[allCartHandler],
    data() {
        return{
            time_limit: []
        }
    },
    methods:{
        gettime(itemTime) {
            let str = new Date(itemTime).toString().split(' ')
            return str[0] + ', ' + str[1] + ' ' + str[2] + ' ' + str[3]
        },
        async ApproveCheck(user_id,ISBN, ind){
            //check day limit
            let input_dayLimit = document.querySelectorAll('.input_dayLimit')
            this.time_limit = []
            input_dayLimit.forEach(element => {
                if (!element.value) this.time_limit.push(7)
                else this.time_limit.push(element.value)
            });
            // console.log('this.time_limit: ', this.time_limit)
         
            this.update_dayLimit(ind)
            // console.log('tiem: ', this.dayLimit)
            if(this.dayLimit<=0){
                alert("time borrow limit must be more than 0")
                return;
            }


            this.getBookInfo(ISBN)
            if(this.BookInfo.amount<=0){ // book amount is 0
                alert("this book amount is not sufficient")
                return;
            }
            else{ //book amount is sufficient
                this.BookInfo ={
                    ...this.BookInfo,
                    amount:this.BookInfo.amount-1,
                    borrow_count:this.BookInfo.borrow_count+1,
                } //decrease amount 
                this.updateBook()
                await this.ApprovePerform(user_id,ISBN)
                .then(() => {
                        let index = 0
                        input_dayLimit.forEach(element => {
                            if (index === ind) index++
                            element.value = this.time_limit[index++]
                        });
                    }
                )
            }
        },
        async ApprovePerform(user_id,ISBN){
            await this.updateRequestStatus(user_id,ISBN,"approve")
            alert(`approve this book from ${user_id} book ISBN:${ISBN}`)
        },
        async DenyPerform(user_id,ISBN,ind){
            let input_dayLimit = document.querySelectorAll('.input_dayLimit')
            this.time_limit = []
            input_dayLimit.forEach(element => {
                if (!element.value) this.time_limit.push(7)
                else this.time_limit.push(element.value)
            });
            await this.updateRequestStatus(user_id,ISBN,"deny")
            .then(() => { 
                alert(`deny this book from ${user_id} book ISBN:${ISBN}`)
            })
            .then(() => {
                    let index = 0
                    input_dayLimit.forEach(element => {
                        if (index === ind) index++
                        element.value = this.time_limit[index++]
                    });
                }
            )
        },
        update_dayLimit(ind) {
            let input_dayLimit = document.querySelectorAll('.input_dayLimit')
            if (input_dayLimit[ind].value === '') {
                this.dayLimit = 7
            }else {
                this.dayLimit = parseInt(input_dayLimit[ind].value)
            } 
        },
    },
    mounted() {
        const init = () => {
            let rm_ctn_content = document.querySelectorAll('.rm_ctn_content')
            rm_ctn_content.forEach(element => {
                element.style.height = `${rm_ctn_content[0].clientWidth * 0.14}px`
            });
        } 

        setTimeout(() => {
            init()
        }, 200)
        
    }
}
</script>

<style>
    @import '../../assets/css/requestManager.css';
</style>