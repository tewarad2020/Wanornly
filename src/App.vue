<template>
<div id="app">
  <span ref="nevbarRef"><Navbar/></span>
  <router-view/>

  <router-link to='/'>Home</router-link> | 
  <router-link to='/book'>Book</router-link>

  <p>Is inittialized:{{ Vue3GoogleOauth.isInit }}</p>
  <p>is Authorized:{{ Vue3GoogleOauth.isAuthorized }}</p>

  <p v-if="variable.user">Logged in user:{{ variable.user }}</p>
  <button :disabled="!Vue3GoogleOauth.isInit || Vue3GoogleOauth.isAuthorized"
  @click="handleSignIn">Sign In</button>
  <button :disabled="!Vue3GoogleOauth.isAuthorized"
  @click="handleSignOut">Sign Out</button>
</div>
</template>

<script>
  import { inject } from 'vue'
import Navbar from './components/Navbar.vue'


export default {
  name: 'App',
  components: {
      Navbar,
  },
  setup(){
    const Vue3GoogleOauth = inject('Vue3GoogleOauth');
    return{
      Vue3GoogleOauth
    }
  },

  data() {
    return {
      winScroll: {
        X : 0,
        Y : 0
      }, 
      path: {
        coverPath : require('./assets/images/1187343.png'),
      },
      reference: {
        navRef : null
      },
      variable: {
        user:'',
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
      }else {
        if (this.reference.navRef.className !== '') {
          this.reference.navRef.classList.remove("noactive")
          this.reference.navRef.classList.add("active")
        }
      }
    },
    async handleSignIn(){
      try{
      const googleUser = await this.$gAuth.signIn()
      console.log(this.$gAuth.signIn);
      if(!googleUser){
        return null
      }

      this.variable.user = googleUser.getBasicProfile().getEmail()
    
      }catch( error){
      console.log(error)
      return null
  }
  },
    async handleSignOut(){
      try{
        await this.$gAuth.signOut()
        this.variable.user = ''
      }catch(error){
        console.log(error)
      }
    }
  },

  watch: {
    $route (to, from){
        console.log(from) 
        console.log(to)
        // if (to.name === 'bookPage') {
        //   console.log('asd')
        //   this.$router.replace({ path: '/' })
        // }
    }
  },
  
  mounted() {
    // Initial
    let initial = () => {
      window.addEventListener("scroll", () => {this.setWindowScroll()})
      this.reference.navRef = this.$refs.nevbarRef.childNodes[0]
    }


    // Proces
    initial()
  },
}
</script>

<style>
  @import './assets/css/app.css';
</style>
