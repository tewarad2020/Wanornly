<template>
  <div id="home_ctn">
    <div id="cover_ctn">
      <img id="cover_img" :src="path.coverPath" alt="">
    </div>
    <Searchbar/>
  </div>
</template>

<script>
import Searchbar from '../components/Searchbar.vue'

export default {
    name: 'homePage',
    components: {
      Searchbar
  },
  data() {
    return {
      path: {
        coverPath : require('../assets/images/1187343.png'),
      },
      variable: {
        
      }
    }
  }
}
</script>
  
<style>
  @import '../assets/css/home.css';
</style>