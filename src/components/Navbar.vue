<template>
  <div class="navbar_ctn active">
    <div @click="goto('/')" class="logo_ctn">
      <img :src="path.logo"  alt="">
      <span id="logo">wanornly</span>
    </div>
    <div id="manuAll">
      <span @click="goto('/')" class="menu">
       <div class="home_menu_img"><img :src="path.homeIcon" alt=""></div>
       <div class="home_menu_text">Home</div>
      </span>
      <span class="menu">
        <div class="favorite_menu_img"><img :src="path.favoriteIcon" alt=""></div>
        <div class="favorite_menu_text">Favorite</div>
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
          <img :src="variable.profile_Img" alt="">
        </div>
        <div v-show="variable.isShowOptions" class="optionbar">
            <div class="op_img">
              <img ref="img_profile_option" class="img_profile_option1" :src="variable.profile_Img" alt="">
              <div class="op_footer">
                <div class="op_name">{{ this.variable.profile_Name }}</div>
                <div class="op_username">{{ (isLogin() && variable.user_info != null)? variable.user_info.username : ''}}</div>
                <div class="hr_line"><hr></div>
              </div>
            </div>
            <div @click="goto('/profile')" class="op_profile">
              <img :src="path.userIcon" alt="">
              Profile
            </div>
            <div @click="goto('/history')" class="op_history">
              <img :src="path.historyIcon" alt="">
              History
            </div>
            <div @click="  functions.handleSignOut(); goto('/')" class="op_logout">
              <img :src="path.logoutIcon" alt="">
              Logout
            </div>         
        </div>
      </span>
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
          favoriteIcon: require('../assets/images/favoriteIcon.png'),
          cartIcon: require('../assets/images/cartIcon.png'),
          loginIcon: require('../assets/images/loginIcon.png'),
        },
        variable: {
          user_info : {
            username: '',
            name: '',
            profileImage: '',
            role:'customer',
            change_image: '',
            change_name: ''
          },
          isShowOptions: false,
          mouseOut1: true,
          mouseOut2: true,
          statusOptionbar: false,
          optionbar: null,
          ctn_optionbar: null,
          profile_Img: '',
          profile_Name: ''
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
            profileImage: googleUser.getBasicProfile().getImageUrl(),
            role:"customer",
          }

          await this.CheckUserDatabase(this.variable.user_info)
          await this.fetchRole(this.variable.user_info.username)
          
          localStorage.setItem('status_login', true)
          if (this.variable.user_info.change_image)
            localStorage.setItem('link_profile', this.variable.user_info.change_image)
          else {
            localStorage.setItem('link_profile', '')
          }
          if (this.variable.user_info.change_name)
            localStorage.setItem('name_profile', this.variable.user_info.change_name)
          else {
            localStorage.setItem('name_profile', '')
          }
          localStorage.setItem('user_info', JSON.stringify({
            username: googleUser.getBasicProfile().getEmail(),
            name: googleUser.getBasicProfile().getName(),
            profileImage: googleUser.getBasicProfile().getImageUrl(),
            role: this.variable.user_info.role,
          }))
       
          console.log('login successful!')
          window.location.reload()

        } catch(error) {
          console.log(error)
          return null
        }
      },
      async fetchRole(username){
       await axios.get(`http://localhost:3000/user/${username}`)
        .then(res=>res.data)
          .then(data=>{
            console.log("fetch role:",data)
            if(data.length!=0)
            {
              this.variable.user_info ={
                ...this.variable.user_info,
                role:data[0].role,
                change_image: data[0].change_image,
                change_name: data[0].change_name
              } 
            }
            else{
              this.variable.user_info ={
                ...this.variable.user_info,
                role:"customer",
                change_image: '',
                change_name: ''
              }
            }
          })
      
    },
    async CheckUserDatabase(userInfo){
      await fetch(`http://localhost:3000/user/${userInfo.username}`)
        .then(res => res.json())
        .then(data => {
          if(data.length===0){ //dont have this user in database
            console.log('new user login')
            this.BindUserDatabase(userInfo)
            return false
          }
          else{
            console.log('user already in database')
            return true
          }
        })

    },
    async BindUserDatabase(userInfo){
      await axios.put(`http://localhost:3000/user`,
        {
          id:userInfo.username,
          username:userInfo.name,
          role:userInfo.role,
          change_image: '',
          change_name: ''
        }
      )
      console.log(`add new user :${userInfo.username}`)
    },
      isLogin() {
        if (this.Vue3GoogleOauth.isAuthorized) this.test = 1
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
            this.variable.optionbar[0].classList.remove('optionbar_active')
            this.variable.optionbar[0].classList.add('optionbar_passive')
          }, 150)
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
      getProfileImage_nav() {
          let link_profile = localStorage.getItem('link_profile')
          if (!link_profile) {
            this.variable.profile_Img = this.variable.user_info?.profileImage
          }else {
            // console.log(`http://localhost:3000/image/${link_profile}`)
            this.variable.profile_Img = `http://localhost:3000/image/${link_profile}`
          }
      },
      getProfilename_nav() {
          let name_profile = localStorage.getItem('name_profile')
          if (!name_profile) {
            this.variable.profile_Name = this.variable.user_info?.profileImage
          }else {
            this.variable.profile_Name = name_profile
          }
      },
    },

    mounted() {
    // Initial
    let initial = async () => {
      this.variable.user_info = await JSON.parse(localStorage.getItem('user_info'))
      const optionbar = document.getElementsByClassName('optionbar')
      const ctn_optionbar = document.getElementsByClassName('ctn_user_image_nev')
      window.addEventListener("mousedown", () => {if (this.variable.statusOptionbar && this.variable.mouseOut2) {this.showOptions()}})
      optionbar[0].addEventListener("mouseout", () => {if (this.variable.statusOptionbar) {this.variable.mouseOut1 = true}});
      optionbar[0].addEventListener("mouseover", () => {if (this.variable.statusOptionbar) {this.variable.mouseOut1 = false}});
      ctn_optionbar[0].addEventListener("mouseout", () => {if (this.variable.statusOptionbar) {this.variable.mouseOut2 = true}});
      ctn_optionbar[0].addEventListener("mouseover", () => {if (this.variable.statusOptionbar) {this.variable.mouseOut2 = false}});
      this.variable.optionbar = optionbar
      this.variable.ctn_optionbar = ctn_optionbar
      this.getProfileImage_nav()
      this.getProfilename_nav()
      
      setTimeout(() => {
        optionbar[0].style.display = 'block'
        optionbar[0].style.opacity = 0
        optionbar[0].style.height = `${optionbar[0].clientWidth * 1.2}px`
        setTimeout(() => {
          optionbar[0].style.display = 'none'
          optionbar[0].style.opacity = 1
        }, 50)
      }, 1500)
       
    }

    initial()
    
    // console.log(this.variable.user_info)
    // console.log('functions')
    // console.log(this.functions.handleSignIn)
    },

}
</script>

<style>
  @import '../assets/css/navbar.css';
</style>