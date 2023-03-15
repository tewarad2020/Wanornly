<template>
   <div class="ctn_bm_page">
        <div class="title_borrow">
            <h1>Borrow Management</h1>
            <Icon id="return_Icon_main" icon="material-symbols:assignment-return-outline-rounded" />
            <div v-show="currentApproveFiltered?.length > 0" class="count_pending_return"> Remaining : {{ currentApproveFiltered?.length }} books</div>
        </div>  

        <div class="filter_return" >
            <Icon id="filter_Icon_return" icon="material-symbols:filter" @click="openFilter()"/>
            <!-- <span>Filter</span> -->
            <div v-show="isShowFilter" class="menu_filter">
                <div class="option_filter_username">
                    <p>Username</p>
                    <input type="text" v-model="input_username" list="Username_filter_borrow" placeholder="username">
                        <datalist id="Username_filter_borrow"></datalist>
                </div>
                <div class="option_filter_bookname">
                    <p>Book name</p>
                    <input type="text" v-model="input_bookName" placeholder="book name">
                </div>
                <div class="option_filter_ISBN">
                    <p>ISBN</p>
                    <input type="text" v-model="input_ISBN" placeholder="ISBN">
                </div>
            </div>
        </div>

        <div class="color_status">
            <div class="green_box">
                <span class="green_circle"></span>
                <p> : more than 3 day</p>
            </div>
            <div class="yellow_box">
                <span class="yellow_circle"></span>
                <p> : less than 3 day</p>
            </div>
            <div class="red_box">
                <span class="red_circle"></span>
                <p> : time out</p>
            </div>
        </div>
        
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
import axios from "axios";

export default {
    name:"borrowManager",
    components: {
        Icon
    },
    data(){
        return{
            input_username: '',
            input_bookName: '',
            input_ISBN: '',
            allUser: [],
            isShowFilter: false
        }
    },
    mixins:[allCartHandler, personalHistoryHandler],
    watch: {
        input_username() {
            this.filter_bm()
        },
        input_bookName() {
            this.filter_bm()
        },
        input_ISBN() {
            this.filter_bm()
        }
    },
    methods:{
        openFilter() {
            let menu_filter = document.getElementsByClassName('menu_filter')[0]
            if (!this.isShowFilter) {
                this.isShowFilter = true
                menu_filter.classList.add('Filterbar_active')
            }else {
                menu_filter.classList.remove('Filterbar_active')
                menu_filter.classList.add('Filterbar_passive')
                setTimeout(() => {
                    this.isShowFilter = false
                    menu_filter.classList.remove('Filterbar_passive')
                }, 250)
            }
        },
        filter_bm() {
            let bm_ctn_content = document.querySelectorAll('.bm_ctn_content')
            bm_ctn_content.forEach((e) => {
                let username = e.childNodes[1].childNodes[2].textContent.slice(10, )
                let bookName = e.childNodes[1].childNodes[1].textContent.slice(12, )
                let ISBN = e.childNodes[1].childNodes[0].textContent.slice(7, )
                if (username) username = username.toLowerCase().replaceAll(" ", "")
                if (bookName) bookName = bookName.toLowerCase().replaceAll(" ", "")
                let new_input_username = this.input_username
                let new_input_bookName = this.input_bookName
                if (this.input_username) new_input_username = this.input_username.toLowerCase().replaceAll(" ", "")
                if (this.input_bookName) new_input_bookName = this.input_bookName.toLowerCase().replaceAll(" ", "")

                if (   (username.includes(new_input_username) || new_input_username === '')
                    && (bookName.includes(new_input_bookName) || new_input_bookName === '') 
                    && (ISBN.includes(this.input_ISBN) || this.input_ISBN === '')
                ) {
                    e.style.display = 'flex'
                }else {
                    e.style.display = 'none'
                }
            })
        },
        async getUser() {
            await axios.get(`http://localhost:3000/user`)
            .then(res=>res.data)
            .then(data=>{
                console.log("fetch User:",data)
                if (data.length > 0){
                this.allUser = data
                let Username = document.getElementById('Username_filter_borrow')
                let options = '';
                this.allUser.forEach(element => {
                    options += '<option value="' + element.id + '" />'
                })
                Username.innerHTML = options
                }
            })
        },
        checkLimit() {
            let bm_ctn_content = document.querySelectorAll('.bm_ctn_content')
            // console.log('bm_ctn_content:', bm_ctn_content)
            let i=0

            bm_ctn_content.forEach((item) => {
                let diff = new Date(this.currentApproveFiltered[i++].time_return_limit) - new Date()
                diff =  Math.ceil(diff / (1000 * 60 * 60 * 24))
                if (diff <= 3) {
                    if (diff >= 0) {
                        item.style.background = 'rgba(240, 152, 25, .8)'
                    }else {
                        item.style.background = 'rgba(247, 102, 102, .9)'
                    }
                }
            })
            
        },
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
            let color_status = document.getElementsByClassName('color_status')[0]
            color_status.style.height = `${color_status.clientWidth * 0.04}px`
            let green_circle = document.getElementsByClassName('green_circle')[0]
            green_circle.style.width = `${green_circle.clientHeight}px`
            let yellow_circle = document.getElementsByClassName('yellow_circle')[0]
            yellow_circle.style.width = `${yellow_circle.clientHeight}px`
            let red_circle = document.getElementsByClassName('red_circle')[0]
            red_circle.style.width = `${red_circle.clientHeight}px`

            let filter_Icon_return = document.getElementById('filter_Icon_return')
            filter_Icon_return.style.height = `${filter_Icon_return.clientWidth}px`
            let menu_filter = document.getElementsByClassName('menu_filter')[0]
            menu_filter.style.padding = `${filter_Icon_return.clientWidth}px 1vw 1vw 1vw`
            let filter_return = document.getElementsByClassName('filter_return')[0]
            filter_return.style.height = `${filter_return.clientWidth * 0.8}px`
        } 

        setTimeout(() => {
            this.checkLimit()
            this.getUser()
            init()
        }, 290)
        
    }

}
</script>

<style>
     @import "../../assets/css/borrowManager.css";
</style>