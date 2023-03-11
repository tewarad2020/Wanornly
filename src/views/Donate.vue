<template>
  <br>
  <br>
  <br>
  <div  id="donatePage">
    
    
    <div>
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
      DonateReq:{
        username:"",
        name:"",
        description:"",
        imgURL:"",
        fileName:"",
        time_sent:"",
        time_approved:""
      },
      file: ''
    }
  },
  methods: {
    onChangeFileUpload(){
        this.file = this.$refs.file.files[0]
    },
    async submitForm(){
      let formData = new FormData();
      formData.append('file', this.file);
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
        this.DonateReq.fileName = data.data.file.filename
        this.DonateReq.time_sent = new Date()
        await axios.post(`http://localhost:3000/donate`, this.DonateReq )
        .then(response => {
              console.log('response: ', response)
        })
        .catch(error => console.log(error))
      })
      .catch((error) => {
          console.log(error);
      });
    }
  }
  
}
</script>

<style>
   @import '../assets/css/donate.css';
</style>
