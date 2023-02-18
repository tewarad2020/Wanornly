<template>
  <div class="page">
    <div class="form-ctn">
      <form @submit.prevent="CheckValidBook" class="bookInfo-form">
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
        <label >Category</label>
        <input type="number" v-model="BookInfo.category"/>
        <button class="submit-btn">submit</button>
      </form>
   
    </div>
      
  </div>
</template>

<script>
import axios from 'axios'
import { bookHandler } from '../../mixins/MixinFunction';
export default {
  name: "addBook",
  mixins:[bookHandler],
  data() {
    return {
      // BookInfo:{
      //   ISBN:"",
      //   name:"",
      //   author:"",
      //   category:"",
      //   book_description:"",
      //   image:"",
      //   publisher:"",
      //   amount:0
      //   }
      }
  },
  methods: {
    async createBook() {
     await axios.post('http://localhost:3000/books', this.BookInfo)
        .then(response => console.log(response))
        .catch(error => console.log(error))
       
        window.location.replace('/')
        // this.$router.replace({ path: '/' })
    },
    CheckValidBook(){
      const allBooks = this.$store.getters.data
      const filteredBook =  allBooks.map(b=>b.ISBN)
                .filter(id=>id==this.BookInfo.ISBN)
      if(filteredBook.length!=0){ //already has this book ISBN in database
          alert("A book with this ISBN is already in database")
      }
      else{
        this.createBook()
      }
    }
  }

};
</script>

<style scoped>
@import "../../assets/css/addBook.css";
</style>
