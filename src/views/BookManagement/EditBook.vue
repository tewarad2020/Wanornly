<template>
  <div class="page">
    <div class="form-ctn">
      <form @submit.prevent="createBook" class="bookInfo-form">
        <label >Name</label>
        <input type="text" v-model="BookInfo.name"/>
        <label >ISBN</label>
        <input disabled type="text" v-model="BookInfo.ISBN"/>
        <label >Author</label>
        <input type="text" v-model="BookInfo.author"/>
        <label >Description</label>
        <input type="text" v-model="BookInfo.book_description"/>
        <label >Image URL</label>
        <input type="text" v-model="BookInfo.image"/>
        <label >Publisher</label>
        <input type="text" v-model="BookInfo.publisher"/>
        <label >Amount</label>
        <input type="number" v-model="BookInfo.amount"/>
        <label >Category</label>
        <input type="number" v-model="BookInfo.category"/>
        <button class="submit-btn" @click="updateBook">update</button>
      </form>
      
    </div>
      
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
@import "../../assets/css/addBook.css";
</style>