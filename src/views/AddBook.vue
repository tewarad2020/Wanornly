<template>
  <div class="page">
    <div class="form-ctn">
      <form @submit.prevent="createBook" class="bookInfo-form">
        <label >Name</label>
        <input type="text" v-model="BookInfo.name"/>
        <label >ISBN</label>
        <input type="text" v-model="BookInfo.ISBN"/>
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
        <label >CategoryID</label>
        <input type="number" v-model="BookInfo.categoryID"/>
        <button class="submit-btn">submit</button>
      </form>
   
    </div>
      
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "addBookPage",
  data() {
    return {
      BookInfo:{
        ISBN:"",
        name:"",
        author:"",
        categoryID:0,
        book_description:"",
        image:"",
        publisher:"",
        amount:0
        }
      }
  },
  methods: {
    createBook() {
      axios.post('http://localhost:3000/books', this.BookInfo)
        .then(response => console.log(response))
        .catch(error => console.log(error))
    }
  }

};
</script>

<style scoped>
@import "../assets/css/addBook.css";
</style>
