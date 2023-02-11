<template>
  <div class="navbar_ctn">
    <div class="logo_ctn">
      <img :src="path.logo" alt="">
      <span id="logo">wanornly</span>
    </div>
    <div id="manuAll">
      <span>Home</span>
      <span>Contact</span>
      <span v-show="true">Cart</span>
      <span v-show="true" @click="handleSignIn(); console.log('asd')" >Log in</span>
    </div>
  </div>
</template>

<script>
// import { inject } from 'vue'

export default {
    name: 'NavBarComplement',
    props: {
      Vue3GoogleOauth: Object,
    },

    // setup(){
    //   const Vue3GoogleOauth = inject('Vue3GoogleOauth');
    //   return{
    //     Vue3GoogleOauth
    //   }
    // },

    data() {
      return {
        path: {
          logo : require('../assets/images/logo.png'),
        },
      }
    },
    
    methods: {
      async handleSignIn() {
        try {
        const googleUser = await this.$gAuth.signIn()
        console.log(this.$gAuth.signIn);
        if(!googleUser){
          return null
        }

        this.variable.user = googleUser.getBasicProfile().getEmail()
      
        } catch(error) {
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
    }
}
</script>

<style>
  @import '../assets/css/navbar.css';
</style>