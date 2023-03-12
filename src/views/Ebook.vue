<template>
  <div id="bookPage">
    <div id="cover_ctn">
      <!-- <img id="cover_img" :src="path.coverPath" alt=""> -->
    </div>

    <div class="book_ctn">
      <div class="ctn_book_img">
        <div class="circleBase"></div>
        <div class="book_img">
          <img v-if="isFetched" :src="ebookInfo.image" alt="">
        </div>
      </div>
      <div class="book_info_ctn">
        <div class="book_info">
          <div class="book_info_name"> {{ebookInfo.name }}</div>
          <div class="book_info_author">Author | {{ ebookInfo.author }}</div>
          <div class="book_info_description">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ ebookInfo.book_description }}</div>
        </div>

        <div class="ctn_envet">
          <div class="btn_envet_heart" @click="likeIt">
            <span><Icon id="heart_Icon" icon="mdi:cards-heart" /></span>
          </div>
          <!-- <div class="btn_envet_addToCart" @click="islogin()">
            <span><Icon id="shopping-cart_Icon" icon="material-symbols:shopping-cart-rounded" /></span>
          </div> -->
          <div class="ctn_envet_edit" v-if="role === 'admin'? true : false" @click="EditHandle">
            <span><Icon id="edit_Icon" icon="material-symbols:edit" /></span>
          </div>
          <div class="ctn_envet_delete" v-if="role === 'admin'? true : false" @click="showConfirmDelete">
            <span><Icon id="delete-outline_Icon" icon="material-symbols:delete-outline" /></span>
          </div>

          <!-- <Icon icon="clarity:shopping-bag-solid" /> -->
          <!-- <div class="ctn_status">
            <span>{{ product_status() }}</span>
          </div> -->
        </div>
      </div>
    </div>

    <div class="ctn_arrow_Icon">
      <Icon id="arrowLeft_Icon" @click="letMove('Left')" icon="material-symbols:arrow-back-ios-rounded" />
      <Icon id="arrowRight_Icon" @click="letMove('Right')" icon="material-symbols:arrow-back-ios-rounded" />
    </div>
    <div class="ctn_sameAuthor">
      <div class="ctn_sameAuthor_content" >
        <div class="ctn_books_relate" v-for="(item,index) in sameAuthor" :key="index" @click="newbookinfo(item)">
          <img :src="item.image" alt="">
          <div class="books_relate_name" @click="seebookinfo(item)">{{ item.name }}</div>
        </div>
      </div>
    </div>
    
    

    <div v-if="isEdit" class="Edit_comp_active">
      <EditEBook :eBookProp="ebookInfo"></EditEBook>
      <span class="btn_exit_edit" @click="EditHandle()">X</span>
    </div>

    <div v-show="confirmDelete" class="confirm_delete Delete_comp_active">
      <div class="confirm_delete_img"><img :src="path.warning" alt=""></div>
      <div class="confirm_delete_text">Are you sure, you really want to delete it?</div>
      <div @click="DeleteHandle()" class="confirm_delete_ok">yes</div>
      <div @click="showConfirmDelete" class="confirm_delete_no">cancel</div>
      <div @click="showConfirmDelete" class="btn_exit_confirm_delete">X</div>
    </div>

  </div>
</template>

<script>
import EditEBook from './BookManagement/EditEBook.vue';
import axios from 'axios'
import { Icon } from '@iconify/vue';

import { AddToCartHandler } from '@/mixins/MixinFunction';

export default {

  name: 'ebookPage',
  components:{
    EditEBook,
    Icon
  },
  mixins:[AddToCartHandler],
  data() {
    return {
      path: {
        warning: require('../assets/images/warning.png'),
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
    ebookInfo:{
        username:"",
        ISBN:"",
        name:"",
        book_description:"",
        category:"",
        image:"",
        author:"",        
        publisher:"",
        status: "",
        realFileName:"",
        fileName:"",
        time_sent:"",
        time_resolved:""
    },
        isEdit:false,
        isFetched:false,
        role: null,
        islike: false,
        Edit_comp: null,
        confirmDelete: false,
        ctn_status: null,
        sameAuthor: [],
        step: 0,
        count_bookRelate: 0,
    }
  },
  props:[
    'data',
  ],

  mounted() {
    if (localStorage.getItem("user_info")) this.userID = JSON.parse(localStorage.getItem("user_info")).username

    let initial = () => {

      // find the ebook with given name from route which we want to see detail
      let n = this.$store.getters.ebookData.length
      for (let i=0; i<n; i++) {
        if (this.$store.getters.ebookData[i].name == this.$route.params.name) {
          this.ebookInfo = this.$store.getters.ebookData[i]
          break
        }
      }
      
      // find ebooks with same author which to be reccommended
      let k = 0
      for (let i=0; i<n; i++) {
        if (this.$store.getters.ebookData[i].author != ""){
            if (this.$store.getters.ebookData[i].author === this.ebookInfo.author && this.ebookInfo !== this.$store.getters.edata[i]) {
            this.sameAuthor[k++] = this.$store.getters.edata[i]
            }
        }
      }
      console.log('Same autore books: ', this.sameAuthor)
      this.isFetched = true;

      // create container of related books
      let circleBase = document.getElementsByClassName('circleBase')
      let book_img = document.getElementsByClassName('book_img')
      let ctn_sameAuthor = document.getElementsByClassName('ctn_sameAuthor')[0]
      let ctn_sameAuthor_content = document.getElementsByClassName('ctn_sameAuthor_content')[0]
      setTimeout(() => {
        let ctn_books_relate = document.querySelectorAll('.ctn_books_relate')
        this.count_bookRelate = ctn_books_relate.length
        if (this.count_bookRelate > 8) this.letMove('Right')
        if (this.count_bookRelate < 8) document.getElementById('arrowRight_Icon').style.display = 'none'
        ctn_sameAuthor_content.style.width = `${25 * this.count_bookRelate}%`
        ctn_books_relate.forEach((e) => {
          if (e) e.style.margin =  `0 ${ctn_sameAuthor.clientWidth * 0.015}px 0 ${ctn_sameAuthor.clientWidth * 0.015}px`
          let bookWidth = ctn_sameAuthor.clientWidth / 4 - (2 * ctn_sameAuthor.clientWidth * 0.015)
          if (e) e.style.width = `${bookWidth}px`
          if (e) e.style.height = `${bookWidth * (1 + .25)}px`
          if (e) e.addEventListener('mouseenter', () => {
            e.childNodes[1].style.transform = `translateY(0)`
          })
          if (e) e.addEventListener('mouseleave', () => {
            e.childNodes[1].style.transform = `translateY(105%)`
          })
        })
      }, 100)

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
      this.ctn_status = document.getElementsByClassName('ctn_status')[0]
      // console.log('ctn_status: ' , this.ctn_status)
    }

    setTimeout(() => {
      initial()
      console.log('info of book: ', this.ebookInfo)
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
    showConfirmDelete() {
      if (!this.confirmDelete) {
        this.confirmDelete = true
        setTimeout(() => {
          let confirm_delete_div = document.getElementsByClassName('confirm_delete')[0]
          confirm_delete_div.style.height = `${confirm_delete_div.clientWidth  / 2 * 1.1666}px`
        }, 10);
      }else {
        let confirm_delete_div = document.getElementsByClassName('confirm_delete')[0]
        confirm_delete_div.classList.add('Delete_comp_passive')
        setTimeout(() => {
          this.confirmDelete = false
          confirm_delete_div.classList.remove('Delete_comp_passive')
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
    // product_status() {
    //   if (this.bookInfo.amount !== 0) {
    //     if (this.ctn_status) this.ctn_status.style.background = '#03de91'
    //     return 'Available'
    //   }
    //   else {
    //     if (this.ctn_status) this.ctn_status.style.background = '#f25579'
    //     return 'Out of stock'
    //   }
    // },
    async islogin() {
      if (localStorage.getItem('status_login')) {
        await this.CheckAddToCart(this.bookInfo.ISBN,this.userID)
        // this.status_send = true
        if (this.status_send) {
          let btn_envet_addToCart = document.getElementsByClassName('btn_envet_addToCart')[0]
          let navbar_ctn = document.getElementsByClassName('navbar_ctn')[0]
          let box_product = document.createElement('div')
          box_product.classList.add('box_product')
          box_product.style.left = `${btn_envet_addToCart.getBoundingClientRect().x + Math.abs(btn_envet_addToCart.clientWidth - 0.02*navbar_ctn.clientWidth)/2}px`
          box_product.style.top = `${btn_envet_addToCart.getBoundingClientRect().y + Math.abs(btn_envet_addToCart.clientHeight - 0.02*navbar_ctn.clientWidth)/2}px`

          const product_svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
          const product_path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
          const product_path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
          const product_path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
          
          product_svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
          product_svg.setAttribute('aria-hidden', 'true')
          product_svg.setAttribute('role', 'img')
          product_svg.setAttribute('width', '1em')
          product_svg.setAttribute('height', '1em')
          product_svg.setAttribute('viewBox', '0 0 36 36')
          product_svg.setAttribute('class', 'iconify iconify--clarity')

          product_path1.setAttribute('fill', 'currentColor')
          product_path1.setAttribute(
            'd',
            'M13 9.22a5 5 0 1 1 10 0V12h2V9.22a7 7 0 1 0-14 0V12h2Z'
          )
          product_path1.setAttribute('class', 'clr-i-solid clr-i-solid-path-1')

          product_path2.setAttribute('fill', 'currentColor')
          product_path2.setAttribute(
            'd',
            'M25 12v3.1a1 1 0 1 1-2 0V12H13v3.1a1 1 0 0 1-2 0V12H4v20a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V12Z'
          )
          product_path2.setAttribute('class', 'clr-i-solid clr-i-solid-path-2')

          product_path3.setAttribute('fill', 'none')
          product_path3.setAttribute(
            'd',
            'M0 0h36v36H0z'
          )

          product_svg.appendChild(product_path1);
          product_svg.appendChild(product_path2);
          product_svg.appendChild(product_path3);
          
          box_product.replaceChildren(product_svg)
          navbar_ctn.appendChild(box_product)

          let cart_locate = document.getElementsByClassName('cart_menu_img')[0]
          const cart_locateX = cart_locate.getBoundingClientRect().x + cart_locate.clientWidth*0.6
          const cart_locateY = cart_locate.getBoundingClientRect().y - cart_locate.clientHeight*0.4
          const box_productX = box_product.getBoundingClientRect().x + box_product.clientWidth/2
          const box_productY = box_product.getBoundingClientRect().y + box_product.clientHeight/2
          box_product.style.transition = `2s ease`
          box_product.style.transform = `translate(${cart_locateX - box_productX}px, ${cart_locateY - box_productY}px) scale(.6)`

          setTimeout(() => {
            box_product.style.transition = `1s ease`
            box_product.style.transform = `translate(${cart_locateX - box_productX}px, ${cart_locateY - box_productY + cart_locate.clientHeight* 0.7}px) scale(.2)`
            cart_locate.style.transition = `.3s ease-in-out`
            cart_locate.style.transform = `scale(1.4)`
            setTimeout(() => {
              cart_locate.style.transition = `.3s ease-in-out`
              cart_locate.style.transform = `scale(1)`
            }, 600);
            setTimeout(() => {
              box_product.remove()
            }, 1100);
          }, 2200);
        }
      }else {
        alert('You have not login!')
      }
    },
    letMove(direct) {
      let ctn_sameAuthor = document.getElementsByClassName('ctn_sameAuthor')[0]
      let ctn_sameAuthor_content = document.getElementsByClassName('ctn_sameAuthor_content')[0]
      if (direct === 'Left') this.step -= 4
      if (direct === 'Right') this.step += 4
      if (this.step === 0) document.getElementById('arrowLeft_Icon').style.display = 'none'
      else document.getElementById('arrowLeft_Icon').style.display = 'inline-block'
      if (this.step < 0) this.step = 0
      if (this.count_bookRelate - this.step <= 4) document.getElementById('arrowRight_Icon').style.display = 'none'
      else document.getElementById('arrowRight_Icon').style.display = 'inline-block'
      if (this.step > this.count_bookRelate) this.step -= 4
      ctn_sameAuthor_content.style.transform = `translateX(-${this.step * ctn_sameAuthor.clientWidth / 4}px)`
    },
    seebookinfo(item) {
      window.location.replace(`/ebook/${item.name}`)
    },
    newbookinfo(item) {
      window.open(`/ebook/${item.name}`)
    }
  }

}
</script>

<style>
@import '../assets/css/book.css';
</style>