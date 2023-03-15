<template>
    <div class="ctn_manage_donate">
        <div class="title_donate_management">
            <h1>Donate Management</h1>
            <Icon id="request_Icon_donate" icon="pajamas:requirements" />
            <div v-show="allRequest?.length > 0" class="count_pending_donate"> Remaining : {{ allRequest?.length }} books</div>
        </div> 
        
        <div v-show="!isAnyReqPending" class="no_item_text">
            <strong>There is no any request to be resolved at this time :)</strong>
        </div>

        <div class="dm_ctn_content" v-show="isAnyReqPending" v-for="(item,ind) in allRequest" :key="ind"> 
            <div class="box_manage_donate_img">
                <img :src="item.image? item.image : path.notfound" alt="">
            </div>
            <div class="box_manage_donate_text">
                <div>username: {{item.username}}</div>
                <div>E-Book Name: {{item.name}}</div>
                <div>category: {{item.category}}</div>
                <div>author: {{item.author}}</div>
                <div>publisher: {{item.publisher}}</div>
                <div>book_description: {{item.book_description}}</div>
                <!-- <div>img URL: {{item.image}}</div> -->
                <div>file name: {{item.realFileName}}</div>
                <!-- <div>time sent: {{new Date(item.time_sent).toString()}}</div> -->
                <div>time sent: {{ gettime(item.time_sent) }} : {{ new Date(item.time_sent).toLocaleTimeString('en-US', {
                    hour: 'numeric', minute: 'numeric', hour12: true }).toString() }}</div>
                <div>status: {{item.status}}</div>
                <button class="btn_donate_approve" @click="updateRequest(item.filename, item.realFileName, 'approve')">approve</button>
                <button class="btn_donate_deny" @click="updateRequest(item.filename, item.realFileName, 'deny')">deny</button>
            </div>
        </div>

        
    </div>
</template>

<script>
import axios from 'axios'
import { Icon } from '@iconify/vue';

export default {
    name:'donateManagerPage',
    components: {
      Icon
    },
    data() {
        return {
            allRequest:null,
            isAnyReqPending:false,
            path: {
                notfound: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGOBo2HfwSuyZ-cLJFIGnz3-HqAuhopFwjEA&usqp=CAU'
            }
        }
    },
    methods: {
    gettime(itemTime) {
      let str = new Date(itemTime).toString().split(' ')
      return str[0] + ', ' + str[1] + ' ' + str[2] + ' ' + str[3]
    },
    async getAllRequest() {
        // let username = JSON.parse(localStorage.getItem('user_info'))?.username
        // await axios.get(`http://localhost:3000/donate/${username}`)
        await axios.get(`http://localhost:3000/donateAll`)
        .then((res) => res.data)
        .then(data => {
            // console.log(data)
            const filtered = data.filter((ele) => ele.status == "pending")
            
            if (filtered.length != 0){
                this.isAnyReqPending = true
                this.allRequest = filtered
            }
            else{
                this.isAnyReqPending = false
            }
        })
        .catch((error) => {
            console.log(error);
        });
    },
    async updateRequest(filename, realFileName, newStatus){
        let [donate_req] = this.allRequest.filter(r=>r.filename==filename && r.status=='pending')
        
        donate_req = {
        ...donate_req,
        time_resolved:new Date(), //time deny
        status:newStatus
        }

        await axios.put(`http://localhost:3000/donate/${filename}`,donate_req)
        .catch((error) => {
            console.log(error);
        });
        alert(`${newStatus} donation of ${realFileName}`)
        this.getAllRequest()
        window.location.reload('/')
    }
    },

    mounted(){
        this.getAllRequest()
        const init = () => {
            let dm_ctn_content = document.querySelectorAll('.dm_ctn_content')
            dm_ctn_content.forEach(element => {
                element.style.height = `${dm_ctn_content[0].clientWidth * 0.20}px`
            });
        } 

        setTimeout(() => {
            init()
        }, 100)
    }

}
</script>

<style>
    @import '../../assets/css/donateManager.css'
</style>