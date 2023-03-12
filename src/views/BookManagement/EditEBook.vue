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
            <input :maxlength="13" disabled type="text" v-model="ebookInfo.ISBN"/>
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
        </form>
      </div>
      <div class="btn_submit_edit" @click="updateBook()">update</div>
    </div>
  </div>
</template>

<script>
// import { bookHandler } from '../../mixins/MixinFunction';
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
      }
  },
  mounted(){
    this.ebookInfo = this.eBookProp
  },
  methods: {
    async updateBook() {
        await  axios.put(`http://localhost:3000/donate/${this.ebookInfo.realFileName}-${this.ebookInfo.name}`, this.ebookInfo)
            .then(response => console.log(response))
            .catch(error => console.log(error))
            // window.location.replace('/')
        }
  },
};
</script>

<style scoped>
  @import "../../assets/css/editBook.css";
</style>