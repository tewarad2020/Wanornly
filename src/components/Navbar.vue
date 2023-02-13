<template>
  <div class="navbar_ctn active">
    <div class="logo_ctn">
      <img :src="path.logo" alt="">
      <span id="logo">wanornly</span>
    </div>
    <div id="manuAll">
      <span>Home</span>
      <span>Contact</span>
      <span v-show="isLogin()">Cart</span>
      <span v-show="!isLogin()" @click="handleSignIn()" >Log in</span>
      <span v-show="isLogin()">
        <div class="ctn_user_image_nev">
          <!-- {{ variable.user_info.profileImage }} -->
          <img :src="(isLogin() && variable.user_info != null)? variable.user_info.profileImage : ''" alt="">
        </div>
      </span>
      <!-- <span v-show="isLogin()" @click="functions.handleSignOut(); console.log('Logout Click!')" >Log out</span> -->
    </div>
  </div>
</template>

<script>
// import { inject } from 'vue'

export default {
    name: 'NavBarComplement',
    props: [
      'Vue3GoogleOauth',
      'functions'
    ],

    data() {
      return {
        path: {
          logo : require('../assets/images/logo.png'),
        },
        variable: {
          user_info : {
            username: '',
            name: '',
            profileImage: ''
          }
        },
      }
    },
    
    methods: {
      async handleSignIn() {
        try {
          const googleUser = await this.$gAuth.signIn()
          // console.log(this.$gAuth.signIn);
          if(!googleUser){
            return null
          }

          this.variable.user_info = {
            username: googleUser.getBasicProfile().getEmail(),
            name: googleUser.getBasicProfile().getName(),
            profileImage: googleUser.getBasicProfile().getImageUrl()
          }

          localStorage.setItem('status_login', true)
          localStorage.setItem('user_info', JSON.stringify({
            username: googleUser.getBasicProfile().getEmail(),
            name: googleUser.getBasicProfile().getName(),
            profileImage: googleUser.getBasicProfile().getImageUrl()
          }))
          // localStorage.setItem('user_info', JSON.stringify(googleUser))
          console.log('login successful!')

        } catch(error) {
          console.log(error)
          return null
        }
      },
      isLogin() {
        // console.log('is:', this.Vue3GoogleOauth.isAuthorized)
        // console.log(this.variable.user_info)
        return this.Vue3GoogleOauth.isAuthorized
      }
    },

    mounted() {
    // Initial
    let initial = () => {
      this.variable.user_info = JSON.parse(localStorage.getItem('user_info'))
    }

    initial()
    // console.log(this.variable.user_info)
    // console.log('functions')
    // console.log(this.functions.handleSignIn)
    }
}
</script>

<style>
  @import '../assets/css/navbar.css';
</style>