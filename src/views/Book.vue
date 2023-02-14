<template>
  <div id="bookPage">
    <div id="cover_ctn">
      <img id="cover_img" :src="path.coverPath" alt="">
    </div>

    <div class="book_ctn">
      <div class="book_img">
        <!-- <img src="../assets/images/bg2.jpg" alt=""> -->
        <img src="../assets/images/bg2.jpg" alt="">
      </div>
      <div class="book_info_ctn">
        <div class="book_info">
          <h1>Info</h1>
          <p>name: </p>
        </div>
        <button class='addtocart'>
          Cart
        </button>
        <p>If ISBN are shown below means Fetching is success!</p>

        <!-- <div v-for="item in data" :key="item.ISBN">
          <h4>
            {{ item.ISBN }}
          </h4>
        </div> -->
        <button @click="console.log(data)"> clip me</button>

      </div>
    </div>



  </div>
</template>

<script>
// import { reactive } from 'vue'

export default {

  name: 'bookPage',
  data() {
    return {
      path: {
        coverPath: require('../assets/images/bg1.jpg'),
      },    }
  },

  props:[
    'data',
  ]


}
</script>

<style>
@import '../assets/css/book.css';
</style>