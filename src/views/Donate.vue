<template>
  <div>
  <br>
  <br>
  <br>
  <div  id="donatePage">
    
    <!-- case: user has no any pending request -->
    <div v-show="!isReqSent">
      <form action="">
        <div>
          <label>E-Book Name</label>
          <input :maxlength="56" type="text" v-model="DonateReq.name"  placeholder="enter e-book name"/>
        </div>
        <div>
          <label>ISBN</label>
          <input :maxlength="56" type="text" v-model="DonateReq.ISBN"  placeholder="optional"/>
        </div>
        <div>
          <label>Category</label>
          <input :maxlength="56" type="text" v-model="DonateReq.category"  placeholder="optional"/>
        </div>
        <div>
          <label>Author</label>
          <input :maxlength="56" type="text" v-model="DonateReq.author"  placeholder="optional"/>
        </div>
        <div>
          <label>Publisher</label>
          <input :maxlength="56" type="text" v-model="DonateReq.publisher"  placeholder="optional"/>
        </div>

        <div>
          <label>book_description</label>
          <input :maxlength="879" type="text" v-model="DonateReq.book_description"  placeholder="optional"/>
        </div>

        <div >
            <label >Image URL</label>
            <input type="text" v-model="DonateReq.image"  placeholder="optional"/>
        </div>

      </form>

      <div>
          <h1>Add E-Book File</h1>
          <div>
            <input type="file" name="file" id="file" ref="file" accept="application/pdf" @change="onChangeFileUpload()">
          </div>
          <div>
            <div @click="submitForm()">Submit</div>
          </div>
      </div>
    </div>

    <!--case: user already has pending request  -->
    <div v-show="isReqSent">
        <strong>Wait for your current request to be checked</strong>
        <div v-if="currentReq.image != ''">
          <img :src="currentReq.image" alt="">
        </div>
        <div>username: {{currentReq.username}}</div>
        <div>E-Book Name: {{currentReq.name}}</div>
        <div>category: {{currentReq.category}}</div>
        <div>author: {{currentReq.author}}</div>
        <div>publisher: {{currentReq.publisher}}</div>
        <div>book_description: {{currentReq.book_description}}</div>
        <!-- <div>img URL: {{currentReq.image}}</div> -->
        <div>file name: {{currentReq.realFileName}}</div>
        <div>time sent: {{new Date(currentReq.time_sent).toString()}}</div>
    </div>

  </div>
</div>
</template>

<script>
import axios from 'axios'
// import { bookHandler } from '../../mixins/MixinFunction';

export default {
  name:'donatePage',
  components: {
      
  },
  data() {
    return {
      isReqSent: false,
      DonateReq:{
        username:"",
        ISBN:"",
        name:"",
        book_description:"",
        category:"",
        image:"",
        author:"",        
        publisher:"",
        status: "",
        realFileName:"",
        fileName:"",
        time_sent:"",
        time_resolved:""
      },
      file: '',
      currentReq: '',
      allRequest:null
      
    }
  },
  methods: {
    onChangeFileUpload(){
        this.file = this.$refs.file.files[0]
    },
    async getPendingRequest() {
        let username = JSON.parse(localStorage.getItem('user_info'))?.username
        // await axios.get(`http://localhost:3000/donate/${username}`)
        await axios.get(`http://localhost:3000/donateAll`)
        .then((res) => res.data)
        .then(data => {
            
            this.allRequest = data.filter(r=>r.status == 'pending' && r.username==username)
        })
        .catch((error) => {
            console.log(error);
        });
    },

    async getAllRequest() {
        // let username = JSON.parse(localStorage.getItem('user_info'))?.username
        // await axios.get(`http://localhost:3000/donate/${username}`)
        await axios.get(`http://localhost:3000/donateAll`)
        .then((res) => res.data)
        .then(data => {
            
            this.allRequest = data
        })
        .catch((error) => {
            console.log(error);
        });
    },
    async submitForm(){
      this.DonateReq.realFileName = this.file.name
      let username = JSON.parse(localStorage.getItem('user_info'))?.username

      await this.getAllRequest()

      if (this.allRequest != null){
        if (this.allRequest.filter(r=>r.realFileName == this.DonateReq.realFileName).length != 0) {
          alert(`This file is already existed in the database or may be denied before!`)
        }
        else if (this.allRequest.filter(r=>r.name == this.DonateReq.name).length != 0) {
          alert(`This book name is already existed in database! Your book might be existed in the database or please change your book's name.`)
        }else {
          // get resolved donated requests (file is existed in db)
          let filtered = []
          if (this.allRequest != null)
            filtered = this.allRequest.filter((ele) => ele.realFileName == this.DonateReq.realFileName)
          
          // no file
          if (filtered.length == 0) {
            let formData = new FormData();
            formData.append('file', this.file);
            await axios.post(`http://localhost:3000/upload/${username}`,
                    formData,
                    {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                  }
            )
            .then(async (data) => {
              this.DonateReq.username = username
              this.DonateReq.status = "pending"
              this.DonateReq.fileName = data.data.file.filename 
              this.DonateReq.time_sent = new Date()
              await axios.post(`http://localhost:3000/donate/${username}`, this.DonateReq)
              .then(response => {
                    console.log('response: ', response)
                    this.isReqSent = true
                    this.CheckIfReqWasSent()
              })
              .catch(error => console.log(error))
            })
          }else{
            this.DonateReq.username = username
            this.DonateReq.status = "pending"
            this.DonateReq.fileName = filtered[0].fileName
            this.DonateReq.time_sent = new Date()
            await axios.post(`http://localhost:3000/donate/${username}`, this.DonateReq)
            .then(response => {
                  console.log('response: ', response)
                  this.isReqSent = true
                  this.CheckIfReqWasSent()
            })
            .catch(error => console.log(error))
          }

        }
        alert(`donation request is sent successfully!`)
      }
    },
    async CheckIfReqWasSent() {
      let username = JSON.parse(localStorage.getItem('user_info'))?.username
      await axios
        .get(`http://localhost:3000/donate/${username}`)
        .then((res) => res.data)
        .then((data) => {
          const filtered = data.filter((ele) => ele.status == "pending")
          if (filtered.length != 0) {
            this.currentReq = filtered[0]
            this.isReqSent = true
          }else{
            this.isReqSent = false
          }
        })
    }
    
  },
  mounted() {
    this.CheckIfReqWasSent()
  }
  
}
</script>

<style>
   @import '../assets/css/donate.css';
</style>
