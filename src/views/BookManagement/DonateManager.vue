<template>
    <br>
    <br>
    <br>
    <div>
        <div v-for="(item,ind) in allRequest" :key="ind"> 
        <div>username: {{item.username}}</div>
        <div>E-Book Name: {{item.name}}</div>
        <div>description: {{item.description}}</div>
        <div>img URL: {{item.imgURL}}</div>
        <div>file name: {{item.realFileName}}</div>
        <div>time sent: {{new Date(item.time_sent).toString()}}</div>
        <div>status: {{item.status}}</div>
        <button @click="updateRequest(item.fileName, item.realFileName, 'approve', item.name)">approve</button>
        <button @click="updateRequest(item.fileName, item.realFileName, 'deny', item.name)">deny</button>
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
            allRequest:''
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
            this.allRequest = filtered
        })
        .catch((error) => {
            console.log(error);
        });
    },
    async updateRequest(fileName, realFileName, newStatus, name){
        let [donate_req] = this.allRequest.filter(r=>r.fileName==fileName && r.status=='pending')
        
        donate_req = {
        ...donate_req,
        time_resolved:new Date(), //time deny
        status:newStatus
        }

        console.log(donate_req)
        // console.log(donate_req)
        await axios.put(`http://localhost:3000/donate/${fileName}-${name}`,donate_req)
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