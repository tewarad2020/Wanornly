<template>
  <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
    integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"> -->
  <div>

    <div id="ctn_list_books" class="model" v-show="$store.getters.Searching">
      <div class="filter_listbook"></div>
      <div id="list_books"></div>
      <div class="exit_search" @click="close_searchbar()">X</div>
    </div>

    <span ref="nevbarRef" class="nevbar_box_index">
      <Navbar class="nevbar_box_index_inner" :Vue3GoogleOauth='Vue3GoogleOauth' :functions='{ handleSignOut: handleSignOut }' />
    </span>

    <router-view />

  </div>
    
</template>

<script>
import Navbar from './components/Navbar.vue'
// import Book from './views/Book.vue'
import { inject } from 'vue'
import store from './store'


export default {
  name: 'App', 
  components: {
    Navbar,
    // Book
  },
  setup() {

    function GetAll() {
      fetch('http://localhost:3000/books')
        .then(res => res.json())
        .then(data => {
          console.log('data: ', data)
          store.commit('setData', data)
          console.log('add data to store successful!')
        })
    }
    GetAll()

    function GetEbook(){
      fetch('http://localhost:3000/donateAll')
      .then(res=>res.json())
      .then(data=>{
        console.log('ebook:',data)
        store.commit('setEbookData',data)
        console.log('add ebook data to store complete')
      })
    }
    GetEbook()
    
    const Vue3GoogleOauth = inject('Vue3GoogleOauth');
    return {
      GetAll,
      Vue3GoogleOauth
    }
  },

  data() {
    return {
      winScroll: {
        X: 0,
        Y: 0
      },
      path: {
        coverPath: require('./assets/images/1187343.png'),
      },
      reference: {
        navRef: null
      },
      variable: {
        shownevbar: true,
        searchbar: null,
      }
    }
  },

  methods: {
    setWindowScroll() {
      this.winScroll.X = window.pageXOffset
      this.winScroll.Y = window.pageYOffset
      // console.log(this.winScroll.Y)
      this.nevbarTokkle()
    },
    nevbarTokkle() {
      if (this.winScroll.Y >= 350) {
        this.reference.navRef.classList.remove("active")
        this.reference.navRef.classList.add("noactive")

      } else {
        if (this.reference.navRef.className !== '') {
          this.reference.navRef.classList.remove("noactive")
          this.reference.navRef.classList.add("active")
        }
      }
    },
    async handleSignIn() {
      try {
        const googleUser = await this.$gAuth.signIn()
        // console.log(this.$gAuth.signIn);
        if (!googleUser) {
          return null
        }

        localStorage.setItem('status_login', true)
        localStorage.setItem('user_info', JSON.stringify({
          username: googleUser.getBasicProfile().getEmail(),
          name: googleUser.getBasicProfile().getName(),
          profileImage: googleUser.getBasicProfile().getImageUrl(),
          // role: getRole()
        }))
        // localStorage.setItem('user_info', JSON.stringify(googleUser))
        console.log('login successful!')
        // console.log(localStorage.getItem('user_info'))
       
       

      } catch (error) {
        console.log(error)
        return null
      }
    },
    async handleSignOut() {
      try {
        await this.$gAuth.signOut()
        console.log('logout successful!')
        localStorage.clear()
        window.location.reload()
      } catch (error) {
        console.log(error)
      }
    },
    goto(nextpath) {
      // this.$router.push(nextpath)
      if (this.Vue3GoogleOauth.isAuthorized) {
        console.log(`link from: ${this.$router.name} -> to: ${nextpath}`)
        this.$router.push(nextpath)
      } else {
        if (nextpath === '/book' || nextpath === '/') {
          console.log(`link from: ${this.$router.name} -> to: ${nextpath}`)
          this.$router.push(nextpath)
        } else {
          console.log('must login')
        }
      }
    },
    close_searchbar() {
      this.variable.searchbar.classList.remove('searchbar_active')
      this.variable.searchbar.classList.add('searchbar_passive')
      setTimeout(() => {
        this.$store.commit('setSearching', false) 
      }, 100);
    },
  
  },
  watch:{
    $route (){
        // console.log('test')
        this.close_searchbar()
    }
  },
  mounted() {
    // Initial
    let initial = () => {
      window.addEventListener("scroll", () => { this.setWindowScroll() })
      this.reference.navRef = this.$refs.nevbarRef.childNodes[0]
      // window.addEventListener('load', () => { this.checkLogin() })
      const searchbar = document.getElementById('list_books')
      this.variable.searchbar = searchbar
    }

    // Proces
    initial()
    // console.log('Y:', this.winScroll.X)
    // console.log('X:', this.winScroll.Y)
    setTimeout(() => {
      if (this.Vue3GoogleOauth.isAuthorized) {
        console.log('status login: ', localStorage.getItem('status_login'))
        console.log('login user: ', JSON.parse(localStorage.getItem('user_info')).username)
      }
    }, 2000)
//     router.beforeEach((to, from) => {
//     console.log('to: ', to)
//     console.log('from: ', from)
//     return false
// })

  },

}
</script>

<style>
@import './assets/css/app.css';
/* อันนี้ไฟล์ที่เพิ่มมา */
@import './assets/css/model.css';
</style>
