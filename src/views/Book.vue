<template>
  <div id="bookPage">
    <div id="cover_ctn">
      <img id="cover_img" :src="path.coverPath" alt="">
    </div>

    <div class="book_ctn">
      <div class="book_img">
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
      </div>
    </div>

  </div>
</template>

<script>
export default {
    name: 'bookPage',
    data() {
      return {
        path: {
          coverPath : require('../assets/images/bg1.jpg'),
        },
      }
    }
}
</script>

<style>
    @import '../assets/css/book.css';
</style>