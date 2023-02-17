<template>
  <div id="bookPage">
    <div id="cover_ctn">
      <img id="cover_img" :src="path.coverPath" alt="">
    </div>

    <div class="book_ctn">
      <div class="book_img">
        <!-- <img src="../assets/images/bg2.jpg" alt=""> -->
        <!-- <img src="../assets/images/bg2.jpg" alt=""> -->
        <img v-if="isFetched" :src="bookInfo.image" alt="">
      </div>
      <div class="book_info_ctn">
        <div class="book_info">
         
          <h1>Info</h1>
          <p>name: </p>
        </div>
        <div class='addtocart' @click="{() => {console.log(567);}}">
          Cart
        </div>
        <p>If ISBN are shown below means Fetching is success!</p>
        <h1>{{ $route.params.id }}</h1>

        <button @click="EditHandle"> edit</button>
        <div v-if="isEdit">
          <EditBook :bookProp="bookInfo"></EditBook>
        </div>
        <button @click="CheckDuplicate">add to cart</button>
        <button @click="DeleteHandle">delete</button>
      </div>
    </div>



  </div>
</template>

<script>
import axios from 'axios'
import EditBook from './BookManagement/EditBook.vue'
export default {

  name: 'bookPage',
  components:{
    EditBook,
  },
  data() {
    return {
      path: {
        coverPath: require('../assets/images/bg1.jpg'),
      },
      userID:"",
      bookInfo: {
        ISBN:"",
        name:"",
        author:"",
        categoryID:0,
        book_description:"",
        image:"",
        publisher:"",
        amount:0
        },
      reqCart:{
        user_id:"",
        ISBN:0,
        time_item:new Date(),
        request_book:1,
        status_request:"inCart",
        time_request:"0/0/0"
      },    
      isEdit:false,
      isFetched:false,
    }
  },
  props:[
    'data',
  ],

  mounted() {
    let initial = () => {
      let n = this.$store.getters.data.length
      for (let i=0; i<n; i++) {
        if (this.$store.getters.data[i].ISBN == this.$route.params.id) {
          this.bookInfo = this.$store.getters.data[i]
          break
        }
      }
      this.isFetched = true;
    }

    setTimeout(() => {
      initial()
      console.log('info of book: ', this.bookInfo)
    }, 200)

     this.userID = JSON.parse(localStorage.getItem("user_info")).username
  },
  methods:{
    EditHandle(){
      this.isEdit = !this.isEdit
    },
    async CheckDuplicate(){
      await axios.get(`http://localhost:3000/carts/${this.userID}`)
                  .then(res=>res.data)
                    .then(data=>{
                      const filtered = data.filter(ele=>ele.ISBN===this.bookInfo.ISBN)
                      console.log(filtered)
                      if(filtered.length!==0){  //already have same book in cart
                          this.DuplicateHandle()
                          console.log("book is already in cart")
                      }
                      else{
                        this.AddToCart()
                      }
                    })
    },
    async AddToCart(){
      this.reqCart ={
        ...this.reqCart,
        user_id:this.userID,
        ISBN:this.bookInfo.ISBN,
      }
      console.log(this.reqCart)
       await axios.put(`http://localhost:3000/carts`,this.reqCart)  
       .then(response => console.log(response))
        .catch(error => console.log(error))          
    },
    DuplicateHandle(){
      alert("This book is already in cart")
    },
    
  async DeleteHandle(){
    console.log("deleting")
    await axios.delete(`http://localhost:3000/books/${this.bookInfo.ISBN}`)
    .then(response => console.log(response))
        .catch(error => console.log(error))
        window.location.replace('/')
  },

  }

}
</script>

<style>
@import '../assets/css/book.css';
</style>