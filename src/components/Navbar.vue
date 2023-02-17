<template>
  <div class="navbar_ctn active">
    <div class="logo_ctn">
      <img :src="path.logo" alt="">
      <span id="logo">wanornly</span>
    </div>
    <div id="manuAll">
      <span @click="goto('/')" class="menu">
       <div class="home_menu_img"><img :src="path.homeIcon" alt=""></div>
       <div class="home_menu_text">Home</div>
      </span>
      <span class="menu">
        <div class="chat_menu_img"><img :src="path.chatIcon" alt=""></div>
        <div class="chat_menu_text">Chat</div>
      </span>
      <span v-show="isLogin()" @click="goto('/cart')" class="menu">
        <div class="cart_menu_img"><img :src="path.cartIcon" alt=""></div>
        <div class="cart_menu_text">Cart</div>
      </span>
      <span v-show="!isLogin()" @click="handleSignIn()" class="menu">
        <div class="login_menu_img"><img :src="path.loginIcon" alt=""></div>
        <div class="login_menu_text">Log in</div>
      </span>
      <span v-show="isLogin()">
        <div class="ctn_user_image_nev" @click="showOptions()">
          <img :src="(isLogin() && variable.user_info != null)? variable.user_info.profileImage : ''" alt="">
        </div>
        <div v-show="variable.isShowOptions" class="optionbar">
            <div class="op_img">
              <img :src="(isLogin() && variable.user_info != null)? variable.user_info.profileImage : ''" alt="">
              <div class="op_footer">
                <div class="op_name">{{ (isLogin() && variable.user_info != null)? variable.user_info.name : '' }}</div>
                <div class="op_username">{{ (isLogin() && variable.user_info != null)? variable.user_info.username : ''}}</div>
                <hr>
              </div>
            </div>
            <div @click="goto('/bookManager')" class="op_profile">
              <img :src="path.userIcon" alt="">
              Profile
            </div>
            <div @click="goto('/history')" class="op_history">
              <img :src="path.historyIcon" alt="">
              History
            </div>
            <div @click="functions.handleSignOut()" class="op_logout">
              <img :src="path.logoutIcon" alt="">
              Logout
            </div>         
        </div>
      </span>
      <!-- <span v-show="isLogin()" @click="functions.handleSignOut(); console.log('Logout Click!')" >Log out</span> -->
    </div>
    <span class="searchbar"><Searchbar/></span>
  </div>
</template>

<script>
import Searchbar from '../components/Searchbar.vue'
import axios from 'axios'

export default {
    name: 'NavBarComplement',
    components: {
      Searchbar
    },
    props: [
      'Vue3GoogleOauth',
      'functions'
    ],

    data() {
      return {
        path: {
          logo : require('../assets/images/logo2.png'),
          userIcon: require('../assets/images/userIcon.png'),
          historyIcon: require('../assets/images/historyIcon.png'),
          logoutIcon: require('../assets/images/logoutIcon.png'),
          homeIcon: require('../assets/images/homeIcon.png'),
          chatIcon: require('../assets/images/chatIcon.png'),
          cartIcon: require('../assets/images/cartIcon.png'),
          loginIcon: require('../assets/images/loginIcon.png'),
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
          optionbar: null,
          ctn_optionbar: null,
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

          const fetchrole = await this.fetchRole(googleUser.getBasicProfile().getEmail())
          
          this.variable.user_info = {
            username: googleUser.getBasicProfile().getEmail(),
            name: googleUser.getBasicProfile().getName(),
            profileImage: googleUser.getBasicProfile().getImageUrl(),
            role:fetchrole,
          }
          // console.log(this.variable.user_info)
          localStorage.setItem('status_login', true)
          localStorage.setItem('user_info', JSON.stringify({
            username: googleUser.getBasicProfile().getEmail(),
            name: googleUser.getBasicProfile().getName(),
            profileImage: googleUser.getBasicProfile().getImageUrl(),
            role: fetchrole,
          }))
          // localStorage.setItem('user_info', JSON.stringify(googleUser))
          this.CheckUserDatabase(this.variable.user_info)
          console.log('login successful!')

        } catch(error) {
          console.log(error)
          return null
        }
      },
      async fetchRole(username){
        let role = "temp"
       await axios.get(`http://localhost:3000/user/${username}`)
                .then(res=>res.data)
                  .then(data=>{
                    role =  data[0].role
                  })
      return role
    },
    async CheckUserDatabase(userInfo){
      await fetch(`http://localhost:3000/user/${userInfo.username}`)
        .then(res => res.json())
        .then(data => {
          if(data.length===0){ //dont have this user in database
            console.log('new user login')
            this.BindUserDatabase(userInfo)
          }
          else{
            console.log('user already in database')
          }
        })

    },
    async BindUserDatabase(userInfo){
      await axios.put(`http://localhost:3000/user`,
        {
          id:userInfo.username,
          username:userInfo.name
        }
      )
      console.log(`add new user :${userInfo.username}`)
    },
      isLogin() {
        return this.Vue3GoogleOauth.isAuthorized
      },
      showOptions() {
        if (!this.variable.isShowOptions) {
          this.variable.optionbar[0].classList.remove('optionbar_passive')
          this.variable.optionbar[0].classList.add('optionbar_active')
          this.variable.isShowOptions = true
          this.variable.statusOptionbar = true
        }else if (this.variable.mouseOut1 || (this.variable.isShowOptions && this.variable.mouseOut1)) {
          this.variable.statusOptionbar = false
          this.variable.optionbar[0].classList.remove('optionbar_active')
          this.variable.optionbar[0].classList.add('optionbar_passive')
          setTimeout(() => {
            this.variable.isShowOptions = false
          }, 100)
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
    },
   

    mounted() {
    // Initial
    let initial = () => {
      this.variable.user_info = JSON.parse(localStorage.getItem('user_info'))
      const optionbar = document.getElementsByClassName('optionbar')
      const ctn_optionbar = document.getElementsByClassName('ctn_user_image_nev')
      window.addEventListener("mousedown", () => {if (this.variable.statusOptionbar && this.variable.mouseOut2) {this.showOptions()}})
      optionbar[0].addEventListener("mouseout", () => {if (this.variable.statusOptionbar) {this.variable.mouseOut1 = true}});
      optionbar[0].addEventListener("mouseover", () => {if (this.variable.statusOptionbar) {this.variable.mouseOut1 = false}});
      ctn_optionbar[0].addEventListener("mouseout", () => {if (this.variable.statusOptionbar) {this.variable.mouseOut2 = true}});
      ctn_optionbar[0].addEventListener("mouseover", () => {if (this.variable.statusOptionbar) {this.variable.mouseOut2 = false}});
      this.variable.optionbar = optionbar
      this.variable.ctn_optionbar = ctn_optionbar
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