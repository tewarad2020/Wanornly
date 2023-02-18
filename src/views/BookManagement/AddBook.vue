<template>
  <div>
    <div class="filter_add"></div>
    <div class="ctn_add_book">
      <div class="title_add">Add Book</div>
      <div class="ctn_form_add">
        <form @submit.prevent="CheckValidBook" class="form_add">
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
      <div class="submit_btn_add" @click="CheckValidBook()">submit</div>
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
