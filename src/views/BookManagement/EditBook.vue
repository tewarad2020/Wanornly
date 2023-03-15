<template>
  <div>
    <div class="filter_edit"></div>
    <div class="ctn_edit_book">
      <div class="title_edit">Edit Book</div>
      <div class="ctn_form_edit">
        <form @submit.prevent="createBook" class="form_edit">
          <div class="Name_label">
            <label>Name</label>
            <input :maxlength="56" type="text" v-model="BookInfo.name"/>
          </div>
          <div class="ISBN_label">
            <label >ISBN</label>
            <input :maxlength="13" disabled type="text" v-model="BookInfo.ISBN"/>
          </div>
          <div class="Author_label">  
            <label >Author</label>
            <!-- <input :maxlength="56" type="text" v-model="BookInfo.author"/> -->
            <input :maxlength="56" type="text" v-model="BookInfo.author" list="Authorname_EditP" placeholder="no information">
              <datalist id="Authorname_EditP"></datalist>
          </div>
          <div class="Description_label">
            <label >Description</label>
            <input :maxlength="879" type="text" v-model="BookInfo.book_description"/>
          </div>  
          <div class="Image_label">
            <label >Image URL</label>
            <input type="text" v-model="BookInfo.image"/>
          </div>
          <div class="Publisher_label">  
            <label >Publisher</label>
            <!-- <input type="text" v-model="BookInfo.publisher"/> -->
            <input :maxlength="56" type="text" v-model="BookInfo.publisher" list="Publisher_EditP" placeholder="no information">
              <datalist id="Publisher_EditP"></datalist>
          </div>
          <div class="Amount_label">    
            <label >Amount</label>
            <input type="number" v-model="BookInfo.amount"/>
          </div>
          <div class="Borrow_Count_label">    
            <label >Borrow Count</label>
            <input type="number" v-model="BookInfo.borrow_count"/>
          </div>
          <div class="Category_label"> 
            <label >Category</label>
            <input type="text" v-model="BookInfo.category"/>
          </div>
        </form>
      </div>
      <div class="btn_submit_edit" @click="updateBook()">update</div>
    </div>
  </div>
</template>

<script>
import { bookHandler } from '../../mixins/MixinFunction';
// import axios from 'axios'
export default {
  name: "editBook",
  props:[
    'bookProp',
  ],
  mixins:[bookHandler],
  data() {
    return {
      }
  },
  mounted(){
    this.BookInfo = this.bookProp
    let init = () => {
      this.getAuthorname()
      this.getPublisher()
    }

    init()
  },
  methods: {
    getPublisher() {
      this.alldata = this.$store.getters.data
        if (this.alldata.length > 0){
          let Publisher = document.getElementById('Publisher_EditP')
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
          let Authorname = document.getElementById('Authorname_EditP')
          let options = '';
          this.alldata.forEach(element => {
            if (element.author && !options.includes(element.author)) options += '<option value="' + element.author + '" />'
          })
          Authorname.innerHTML = options
        }
    },
  },
};
</script>

<style scoped>
  @import "../../assets/css/editBook.css";
</style>