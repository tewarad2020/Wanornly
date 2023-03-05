<template>
  <div id="home_ctn">
    <div id="cover_ctn">
      <!-- <img id="cover_img" :src="path.coverPath" alt=""> -->
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
// import Searchbar from '../components/Searchbar.vue'
// test
// import { server } from 'server.js'
// test

export default {
  name: 'homePage',
  components: {
    // Searchbar
  },
  data() {
    return {
      path: {
        coverPath : require('../assets/images/1187343.png'),
      },
      variable: {
        file: null
      }
    }
  },
  methods : {
    // postImage() {
    //   // let fileData = document.getElementById('file')
    //   console.log('go to post: ',  JSON.parse(localStorage.getItem('user_info'))?.username)
    //   let username = JSON.parse(localStorage.getItem('user_info'))?.username
    //   this.variable.postPath = `http://localhost:3000/upload/${username}`
    //   // await axios.post('http://localhost:3000/upload/tewarit2016@gmail.com', fileData.value)
    //   //   .then(response => console.log(response))
    //   //   .catch(error => console.log(error))
       
    //   //   console.log('add book completed')
    //   window.location.replace('/')
    //     // this.$router.replace({ path: '/' })
    // },
    
  }
}
</script>
  
<style>
  @import '../assets/css/home.css';
</style>