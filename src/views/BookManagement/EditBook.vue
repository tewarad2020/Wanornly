<template>
  <div class="ctn_edit_book">
    <div class="ctn_form_edit">
      <form @submit.prevent="createBook" class="form_edit">
        <div class="Name_label">
          <label>Name</label>
          <input type="text" v-model="BookInfo.name"/>
        </div>
        <div class="ISBN_label">
          <label >ISBN</label>
          <input disabled type="text" v-model="BookInfo.ISBN"/>
        </div>
        <div class="Author_label">  
          <label >Author</label>
          <input type="text" v-model="BookInfo.author"/>
        </div>
        <div class="Description_label">
          <label >Description</label>
          <input type="text" v-model="BookInfo.book_description"/>
        </div>  
        <div class="Image_label">
          <label >Image URL</label>
          <input type="text" v-model="BookInfo.image"/>
        </div>
        <div class="Publisher_label">  
          <label >Publisher</label>
          <input type="text" v-model="BookInfo.publisher"/>
        </div>
        <div class="Amount_label">    
          <label >Amount</label>
          <input type="number" v-model="BookInfo.amount"/>
        </div>
        <div class="Category_label"> 
          <label >Category</label>
          <input type="number" v-model="BookInfo.category"/>
        </div>
      </form>
    </div>
    <div class="btn_submit_edit" @click="updateBook">update</div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "editBook",
  props:[
    'bookProp',
  ],
  data() {
    return {
      BookInfo:{
        ISBN:"",
        name:"",
        author:"",
        category:"",
        book_description:"",
        image:"",
        publisher:"",
        amount:0
        }
      }
  },
  mounted(){
    this.BookInfo = this.bookProp
  },
  methods: {
   async updateBook() {
    await  axios.put(`http://localhost:3000/books/${this.BookInfo.ISBN}`, this.BookInfo)
        .then(response => console.log(response))
        .catch(error => console.log(error))
        window.location.replace('/')
    }
  },
};
</script>

<style scoped>
  @import "../../assets/css/editBook.css";
</style>