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
        <div class="ctn_user_image_nev" @click="showOptions()">
          <img :src="(isLogin() && variable.user_info != null)? variable.user_info.profileImage : ''" alt="">
        </div>
        <div v-show="variable.isShowOptions" class="optionbar">
            <div @click="goto('/profile');">Profile</div>
            <div @click="goto('/book');">History</div>
            <div @click="functions.handleSignOut()">Logout</div>         
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
          },
          isShowOptions: false,
          mouseOut1: true,
          mouseOut2: true,
          statusOptionbar: false,
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
        return this.Vue3GoogleOauth.isAuthorized
      },
      showOptions() {
        const optionbar = document.getElementsByClassName('optionbar')
        const ctn_optionbar = document.getElementsByClassName('ctn_user_image_nev')
        if (!this.variable.isShowOptions) {
          optionbar[0].classList.remove('optionbar_passive')
          optionbar[0].classList.add('optionbar_active')
          this.variable.isShowOptions = !this.variable.isShowOptions
          window.addEventListener("mousedown", () => {if (this.variable.statusOptionbar && this.variable.mouseOut2) {this.showOptions()}})
          optionbar[0].addEventListener("mouseout", () => {if (this.variable.statusOptionbar) {this.variable.mouseOut1 = true}});
          optionbar[0].addEventListener("mouseover", () => {if (this.variable.statusOptionbar) {this.variable.mouseOut1 = false}});
          ctn_optionbar[0].addEventListener("mouseout", () => {if (this.variable.statusOptionbar) {this.variable.mouseOut2 = true}});
          ctn_optionbar[0].addEventListener("mouseover", () => {if (this.variable.statusOptionbar) {this.variable.mouseOut2 = false}});
          this.variable.statusOptionbar = true
        }else if (this.variable.mouseOut1 || (this.variable.isShowOptions && this.variable.mouseOut1)) {
          this.variable.statusOptionbar = false
          optionbar[0].classList.remove('optionbar_active')
          optionbar[0].classList.add('optionbar_passive')
          setTimeout(() => {
            this.variable.isShowOptions = !this.variable.isShowOptions
          }, 250)
        }
      },
      goto(nextpath) {
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