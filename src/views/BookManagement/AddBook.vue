<template>
  <div>
    <div class="filter_add"></div>
    <div class="ctn_add_book">
      <div class="title_add">Add Book</div>
      <div class="ctn_form_add">
        <form @submit.prevent="CheckValidBook" class="form_add">
          <div class="Name_label">
            <label>Name</label>
            <input :maxlength="64" type="text" v-model="BookInfo.name" placeholder="no information"/>
          </div>
          <div class="ISBN_label">
            <label >ISBN</label>
            <input :maxlength="13" type="text" v-model="BookInfo.ISBN"/>
          </div>
          <div class="Author_label">  
            <label >Author</label>
            <!-- <input :maxlength="56" type="text" v-model="BookInfo.author" placeholder="no information"/> -->
            <input :maxlength="56" type="text" v-model="BookInfo.author" list="Authorname" placeholder="no information">
              <datalist id="Authorname"></datalist>
          </div>
          <div class="Description_label">
            <label >Description</label>
            <input :maxlength="879" type="text" v-model="BookInfo.book_description" placeholder="no information"/>
          </div>  
          <div class="Image_label">
            <label >Image URL</label>
            <input type="text" v-model="BookInfo.image" placeholder="no information"/>
          </div>
          <div class="Publisher_label">  
            <label >Publisher</label>
            <!-- <input type="text" v-model="BookInfo.publisher" placeholder="no information"/> -->
            <input :maxlength="56" type="text" v-model="BookInfo.publisher" list="Publisher" placeholder="no information">
              <datalist id="Publisher"></datalist>
          </div>
          <div class="Amount_label">    
            <label >Amount</label>
            <input type="number" v-model="BookInfo.amount"/>
          </div>
          <div class="Borrow_Count_label">    
            <label >Borrow count</label>
            <input type="number" v-model="BookInfo.borrow_count" />
          </div>
          <div class="Category_label"> 
            <label >Category</label>
            <input type="text" v-model="BookInfo.category" placeholder="no information"/>
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
// import store from './store'

export default {
  name: "addBook",
  mixins:[bookHandler],
  data() {
    return {
      alldata: [],
    }
  },
  methods: {
    getPublisher() {
      this.alldata = this.$store.getters.data
        if (this.alldata.length > 0){
          let Publisher = document.getElementById('Publisher')
          let options = '';
          this.alldata.forEach(element => {
            if (element.publisher && !options.includes(element.publisher)) options += '<option value="' + element.publisher + '" />'
          })
          Publisher.innerHTML = options
        }
    },
    getAuthorname() {
        this.alldata = this.$store.getters.data
        if (this.alldata.length > 0){
          let Authorname = document.getElementById('Authorname')
          let options = '';
          this.alldata.forEach(element => {
            if (element.author && !options.includes(element.author)) options += '<option value="' + element.author + '" />'
          })
          Authorname.innerHTML = options
        }
    },
    async createBook() {
      if (this.BookInfo.name === '') this.BookInfo.name = 'no information'
      if (this.BookInfo.author === '') this.BookInfo.author = 'no information'
      if (this.BookInfo.book_description === '') this.BookInfo.book_description = 'no information'
      if (this.BookInfo.image === '') this.BookInfo.image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGOBo2HfwSuyZ-cLJFIGnz3-HqAuhopFwjEA&usqp=CAU'
      if (this.BookInfo.publisher === '') this.BookInfo.publisher = 'no information'
      if (this.BookInfo.category === '') this.BookInfo.category = 'no information'
      await axios.post('http://localhost:3000/books', this.BookInfo)
        .then(response => console.log(response))
        .catch(error => console.log(error))
       
        console.log('add book completed')
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
  },
  mounted() {
    let init = () => {
      this.getAuthorname()
      this.getPublisher()
    }

    init()
  }

};
</script>

<style scoped>
@import "../../assets/css/addBook.css";
</style>
