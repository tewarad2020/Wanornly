<template>
  <div id="bookPage">
    <div id="cover_ctn">
      <!-- <img id="cover_img" :src="path.coverPath" alt=""> -->
    </div>

    <div class="book_ctn">
      <div class="ctn_book_img">
        <div class="circleBase"></div>
        <div class="book_img">
          <img v-if="isFetched" :src="bookInfo.image" alt="">
        </div>
      </div>
      <div class="book_info_ctn">
        <div class="book_info">
          <div class="book_info_name"> {{ bookInfo.name }}</div>
          <div class="book_info_author">Author | {{ bookInfo.author }}</div>
          <div class="book_info_description">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ bookInfo.book_description }}</div>
        </div>

        <div class="ctn_envet">
          <div class="btn_envet_heart" @click="likeIt">
            <span><Icon id="heart_Icon" icon="mdi:cards-heart" /></span>
          </div>
          <div class="btn_envet_addToCart" @click="islogin()">
            <span><Icon id="shopping-cart_Icon" icon="material-symbols:shopping-cart-rounded" /></span>
          </div>
          <div class="ctn_envet_edit" v-if="role === 'admin'? true : false" @click="EditHandle">
            <span><Icon id="edit_Icon" icon="material-symbols:edit" /></span>
          </div>
          <div class="ctn_envet_delete" v-if="role === 'admin'? true : false" @click="DeleteHandle">
            <span><Icon id="delete-outline_Icon" icon="material-symbols:delete-outline" /></span>
          </div>

          <div class="ctn_status">
            <span>{{ product_status() }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isEdit" class="Edit_comp_active">
      <EditBook :bookProp="bookInfo"></EditBook>
      <span class="btn_exit_edit" @click="EditHandle()">X</span>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import { Icon } from '@iconify/vue';
import EditBook from './BookManagement/EditBook.vue'
import { AddToCartHandler } from '@/mixins/MixinFunction';

export default {

  name: 'bookPage',
  components:{
    EditBook,
    Icon
  },
  mixins:[AddToCartHandler],
  setup() {
    let test = () => {
      console.log('asd')
    }

    return {test}
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
        category:"",
        book_description:"",
        image:"",
        publisher:"",
        amount:0
        },
      isEdit:false,
      isFetched:false,
      role: null,
      islike: false,
      Edit_comp: null,
    }
  },
  props:[
    'data',
  ],

  mounted() {
    if (localStorage.getItem("user_info")) this.userID = JSON.parse(localStorage.getItem("user_info")).username

    let initial = () => {
      let n = this.$store.getters.data.length
      for (let i=0; i<n; i++) {
        if (this.$store.getters.data[i].ISBN == this.$route.params.id) {
          this.bookInfo = this.$store.getters.data[i]
          break
        }
      }
      this.isFetched = true;

      let circleBase = document.getElementsByClassName('circleBase')
      let book_img = document.getElementsByClassName('book_img')

      circleBase[0].style.height = `${circleBase[0].clientWidth}px`
      book_img[0].style.height = `${book_img[0].clientWidth * (1 + 1.5 / 3.5)}px`

      let ctn_envet = document.getElementsByClassName('ctn_envet')
      let btn_envet_addToCart = document.getElementsByClassName('btn_envet_addToCart')

      ctn_envet[0].style.height = `${btn_envet_addToCart[0].clientWidth}px`

      let heart_Icon = document.getElementById('heart_Icon')
      heart_Icon.addEventListener('mouseenter', () => {
        if (!this.islike) {
          heart_Icon.style.color = '#dcb4ed'
        }
      })
      heart_Icon.addEventListener('mouseleave', () => {
        if (!this.islike) {
          heart_Icon.style.color = '#666666'
        }
      })
  
    }

    setTimeout(() => {
      initial()
      console.log('info of book: ', this.bookInfo)
    }, 200)

    if(localStorage.getItem("user_info")) {
      this.userID = JSON.parse(localStorage.getItem("user_info")).username
      this.role = JSON.parse(localStorage.getItem('user_info')).role
      // console.log('this.role:', this.role )
    }
  },
  methods:{
    EditHandle(){
      if (!this.isEdit) {
         setTimeout(() => {
          this.Edit_comp = document.getElementsByClassName('Edit_comp_active')[0]
          // console.log('ok: ', this.Edit_comp)
        }, 20);
        this.isEdit = true
      }else {
          this.Edit_comp.classList.add('Edit_comp_passive')
          this.Edit_comp.classList.remove('Edit_comp_active')
          setTimeout(() => {
            this.Edit_comp.classList.remove('Edit_comp_passive')
            this.Edit_comp.classList.add('Edit_comp_active')
            this.isEdit = false
          }, 250)
      }
    },
    
    async DeleteHandle(){
      console.log("deleting")
      await axios.delete(`http://localhost:3000/books/${this.bookInfo.ISBN}`)
      .then(response => console.log(response))
          .catch(error => console.log(error))
          window.location.replace('/')
    },
    likeIt() {
      if (localStorage.getItem('status_login')) {
        let heart_Icon = document.getElementById('heart_Icon')
        if(!this.islike) {
          heart_Icon.style.color = '#f74343'
          this.islike = true
        }else {
          heart_Icon.style.color = '#666666'
          this.islike = false
        }
      }else {
        alert('You have not login!')
      }
    },
    product_status() {
      if (this.bookInfo.amount !== 0) return 'Available'
      else return 'Out of stock'
    },
    islogin() {
      if (localStorage.getItem('status_login')) {
        this.CheckAddToCart(this.bookInfo.ISBN,this.userID)
      }else {
        alert('You have not login!')
      }
    }
  }

}
</script>

<style>
@import '../assets/css/book.css';
</style>