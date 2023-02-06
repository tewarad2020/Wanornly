<template>
  <div class="navbar_ctn">
    <div class="logo_ctn">
      <img :src="path.logo" alt="">
      <span id="logo">wanornly</span>
    </div>
    <div id="manuAll">
      <span @click="test('ok')">Home</span>
      <span>Contact</span>
      <span v-show="true">Cart</span>
      <span v-show="true">Log in</span>
    </div>
  </div>
</template>

<script>
export default {
    name: 'NavBarComplement',
    data() {
      return {
        path: {
          logo : require('../assets/images/logo.png'),
        },
      }
    },
    
    methods: {
      test(str) {
        console.log(str)
      }
    }
}
</script>

<style>
  @import '../assets/css/navbar.css';
</style>