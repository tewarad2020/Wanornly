<template>
  <br>
  <br>
  <br>
  <div  id="donatePage">
    
    <div v-show="!isReqSent">
      <form action="">
        <div>
          <label>E-Book Name</label>
          <input :maxlength="56" type="text" v-model="DonateReq.name"  placeholder="enter e-book name"/>
        </div>

        <div>
          <label>Description</label>
          <input :maxlength="879" type="text" v-model="DonateReq.description"  placeholder=""/>
        </div>

        <div >
            <label >Image URL</label>
            <input type="text" v-model="DonateReq.imgURL"  placeholder=""/>
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

    <div v-show="isReqSent">
        <strong>Wait for your current request to be checked</strong>
        <div>username: {{currentReq.username}}</div>
        <div>E-Book Name: {{currentReq.name}}</div>
        <div>description: {{currentReq.description}}</div>
        <div>img URL: {{currentReq.imgURL}}</div>
        <div>file name: {{currentReq.realFileName}}</div>
        <div>time sent: {{currentReq.time_sent}}</div>
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
        name:"",
        description:"",
        status: "",
        imgURL:"",
        realFileName:"",
        fileName:"",
        time_sent:"",
        time_approved:""
      },
      file: '',
      currentReq: ''
      
    }
  },
  methods: {
    onChangeFileUpload(){
        this.file = this.$refs.file.files[0]
    },
    async submitForm(){
      let formData = new FormData();
      formData.append('file', this.file);
      this.DonateReq.realFileName = this.file.name
      let username = JSON.parse(localStorage.getItem('user_info'))?.username

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
      .catch((error) => {
          console.log(error);
      });
    },
    async CheckIfReqWasSent() {
      let username = JSON.parse(localStorage.getItem('user_info'))?.username
      await axios
        .get(`http://localhost:3000/donate/${username}`)
        .then((res) => res.data)
        .then((data) => {
          const filtered = data.filter((ele) => ele.status == "pending")
          if (filtered.length != 0) {
            this.currentReq = data[0]
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
