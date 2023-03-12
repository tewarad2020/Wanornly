<template>
    <div>
    <br>
    <br>
    <br>
    <div>
        <div v-show="!isAnyReqPending">
        <strong>there is no any request to be resolved at this time :)</strong>
        </div>

        <div v-show="isAnyReqPending" v-for="(item,ind) in allRequest" :key="ind"> 
        <div v-if="item.image != ''">
          <img :src="item.image" alt="">
        </div>
        <div>username: {{item.username}}</div>
        <div>E-Book Name: {{item.name}}</div>
        <div>category: {{item.category}}</div>
        <div>author: {{item.author}}</div>
        <div>publisher: {{item.publisher}}</div>
        <div>book_description: {{item.book_description}}</div>
        <div>img URL: {{item.image}}</div>
        <div>file name: {{item.realFileName}}</div>
        <div>time sent: {{new Date(item.time_sent).toString()}}</div>
        <div>status: {{item.status}}</div>
        <button @click="updateRequest(item.realFileName, 'approve', item.name)">approve</button>
        <button @click="updateRequest(item.realFileName, 'deny', item.name)">deny</button>
        </div>

        
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    name:'donateManagerPage',
    components: {
      
    },
    data() {
        return {
            allRequest:null,
            isAnyReqPending:false
        }
    },
    methods: {
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
    async updateRequest(realFileName, newStatus, name){
        let [donate_req] = this.allRequest.filter(r=>r.name==name && r.status=='pending')
        
        donate_req = {
        ...donate_req,
        time_resolved:new Date(), //time deny
        status:newStatus
        }

        console.log(donate_req)
        // console.log(donate_req)
        await axios.put(`http://localhost:3000/donate/${name}`,donate_req)
        .catch((error) => {
            console.log(error);
        });
        alert(`${newStatus} donation of ${realFileName}`)
        this.getAllRequest()
    }
    },

    mounted(){
        this.getAllRequest()
    }

}
</script>

<style>

</style>