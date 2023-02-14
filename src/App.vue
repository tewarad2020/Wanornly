<template>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
    integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  <div>
    <span ref="nevbarRef">
      <Navbar :Vue3GoogleOauth='Vue3GoogleOauth' :functions='{ handleSignOut: handleSignOut }' />
    </span>
    <router-view />

    <router-link to='/'>Home</router-link>
    <Book v-show="false" :data='state' />
    <div @click="goto('/book');">Book</div>
    <a href="./Book/1" target="_blank">Book (target_blank)</a>
   
    <div @click="goto('/addBook')">addBook</div>
  </div>

  <div class="d-flex row justify-content-around container">
    <div id="App" @click="showModal = true" class="w-50 p-3 m-3 col " style="background-color: #eee;"
      v-for="item in state.books" :key="item.ISBN">
      <div class="mx-auto" style="width:min-content;">
        <figure class="figure"> <img class="py-2" :src=item.image> </figure>
      </div>
      <p class="text-center">{{ item.product_name }}</p>
      <div class="text-center " ><button  @click="showModel = item">info book.</button>
        <!-- อันนี้คือกดคลิกแล้ว popup นะ -->
        <div class="model" v-if="showModel === item">
          <div class="model-overlay" @click="showModel = null"></div>
          <div class="model-content" position: relative>
            <h2>{{ item.product_name }}</h2>
            <p>{{ item.product_name }}</p>
            <button @click="showModel = null">Close</button>
          </div>
        </div>
      </div>
      <!-- ประมาณอันนี้ -->
    </div>
  </div>


</template>

<script>
// import PopupBook from './components/PopupBook.vue'
import Navbar from './components/Navbar.vue'
import Book from './views/Book.vue'
import { inject } from 'vue'
import { reactive } from 'vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Book
  },
  setup() {

    const state = reactive({
      books: {}
    })

    function GetAll() {
      fetch('http://localhost:3000/books')
        .then(res => res.json())
        .then(data => {
          state.books = data
          console.log(`data: ${data[3].name}`)
        })
    }
    GetAll()



    const Vue3GoogleOauth = inject('Vue3GoogleOauth');
    return {
      // PopupBook,
      state,
      GetAll,
      Vue3GoogleOauth
    }
  },

  data() {
    return {
      showModal: true,
      // showModel คืออันนี้โชว์ popup หนังสือนะ
      showModel: null,
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
        user: '',
        shownevbar: true,
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

        this.variable.user = googleUser.getBasicProfile().getEmail()
        localStorage.setItem('status_login', true)
        localStorage.setItem('user_info', JSON.stringify({
          username: googleUser.getBasicProfile().getEmail(),
          name: googleUser.getBasicProfile().getName(),
          profileImage: googleUser.getBasicProfile().getImageUrl()
        }))
        // localStorage.setItem('user_info', JSON.stringify(googleUser))
        console.log('login successful!')

      } catch (error) {
        console.log(error)
        return null
      }
    },
    async handleSignOut() {
      try {
        await this.$gAuth.signOut()
        this.variable.user = ''
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
    checkLogin() {
      if (!this.Vue3GoogleOauth.isAuthorized) {
        if (this.$route.name !== 'bookPage' && this.$route.name !== 'homePage') {
          console.log('must login')
          this.$router.replace({ path: '/' })
        } else {
          if (!this.$router.name) {
            console.log(`link from: ${this.$router.name} -> to: homePage`)
          } else {
            console.log(`link from: ${this.$router.name} -> to: bookPage`)
          }
        }
      } else {
        console.log(`link from: ${this.$router.name} (add URL)`)
      }
    }
  },

  mounted() {
    // Initial
    let initial = () => {
      window.addEventListener("scroll", () => { this.setWindowScroll() })
      this.reference.navRef = this.$refs.nevbarRef.childNodes[0]
      window.addEventListener('load', () => { this.checkLogin() })
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
  },

}
</script>

<style>
@import './assets/css/img.css';
@import './assets/css/app.css';
/* อันนี้ไฟล์ที่เพิ่มมา */
@import './assets/css/model.css'
</style>
