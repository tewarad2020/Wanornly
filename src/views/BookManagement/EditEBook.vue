<template>
  <div>
    <div class="filter_edit"></div>
    <div class="ctn_edit_book">
      <div class="title_edit">Edit E-Book</div>
      <div class="ctn_form_edit">
        <form @submit.prevent="createBook" class="form_edit">
          <div class="Name_label">
            <label>Name</label>
            <input :maxlength="56" type="text" v-model="ebookInfo.name"/>
          </div>
          <div class="ISBN_label">
            <label >ISBN</label>
            <input :maxlength="13" type="text" v-model="ebookInfo.ISBN"/>
          </div>
          <div class="Author_label">  
            <label >Author</label>
            <input :maxlength="56" type="text" v-model="ebookInfo.author"/>
          </div>
          <div class="Description_label">
            <label >Description</label>
            <input :maxlength="879" type="text" v-model="ebookInfo.book_description"/>
          </div>  
          <div class="Image_label">
            <label >Image URL</label>
            <input type="text" v-model="ebookInfo.image"/>
          </div>
          <div class="Publisher_label">  
            <label >Publisher</label>
            <input type="text" v-model="ebookInfo.publisher"/>
          </div>

          <div class="Category_label"> 
            <label >Category</label>
            <input type="text" v-model="ebookInfo.category"/>
          </div>

          <div class="Category_label"> 
            <label >File</label>
            <input type="text" disabled v-model="ebookInfo.realFileName"/>
            <label >Add new file</label>
            <input type="file" name="file" id="file" ref="file" accept="application/pdf" @change="onChangeFileUpload()">
          </div>

          <div>
            
          </div>

        </form>
      </div>
      <div class="btn_submit_edit" @click="updateEBook()">update</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "editEBook",
  props:[
    'eBookProp',
  ],
  data() {
    return {
        ebookInfo:{
        username:"",
        ISBN:"",
        name:"",
        book_description:"",
        category:"",
        image:"",
        author:"no information",        
        publisher:"",
        status: "",
        realFileName:"",
        fileName:"",
        time_sent:"",
        time_resolved:""
      },
      oldRealFileName:'',
      oldName:'',
      file:'',
      allRequest:null,
      newRealFileName:''
    }
  },
  mounted(){
    this.oldRealFileName = this.eBookProp.realFileName
    this.oldName = this.eBookProp.name
    this.ebookInfo = this.eBookProp
  },
  methods: {
    async updateEBook() {
      // let [update_req] = this.allRequest.filter(r=>r.fileName==fileName && r.status=='pending')

      await  axios.put(`http://localhost:3000/donate/${this.oldName}`, this.ebookInfo)
          .then(response => console.log(response))
          .catch(error => console.log(error))
          
      },
    async onChangeFileUpload(){
      this.file = this.$refs.file.files[0]

      this.newRealFileName = this.file.name
      // let username = JSON.parse(localStorage.getItem('user_info'))?.username

      await this.getAllRequest()

      if (this.allRequest != null){

        console.log(this.newRealFileName)
        if (this.allRequest.filter(r=>r.realFileName == this.newRealFileName).length != 0) {
          alert(`This file is already existed in the database or may be denied before!`)
          document.getElementById("file").value = "";
        }

      }

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


  },
};
</script>

<style scoped>
  @import "../../assets/css/editBook.css";
</style>