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
        <div class='addtocart' @click="{() => {console.log(567);}}">
          Cart
        </div>
        <p>If ISBN are shown below means Fetching is success!</p>
        <h1>{{ $route.params.id }}</h1>

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
        coverPath: require('../assets/images/bg1.jpg'),
      },
      bookInfo: null,    
    }
  },
  props:[
    'data',
  ],

  mounted() {
    let initial = () => {
      let n = this.$store.getters.data.length
      for (let i=0; i<n; i++) {
        if (this.$store.getters.data[i].ISBN == this.$route.params.id) {
          this.bookInfo = this.$store.getters.data[i]
          break
        }
      }
    }

    setTimeout(() => {
      initial()
      console.log('info of book: ', this.bookInfo)
    }, 200)
  }

}
</script>

<style>
@import '../assets/css/book.css';
</style>