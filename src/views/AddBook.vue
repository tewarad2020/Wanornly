<template>
  <div class="page">
    <div class="form-ctn">
    <form class="bookInfo-form">
      <label >Name</label>
      <input type="text" v-model="BookInfo.name"/>
      <label >ISBN</label>
      <input type="text" v-model="BookInfo.ISBN"/>
      <label >Author</label>
      <input type="text" v-model="BookInfo.author"/>
      <label >Description</label>
      <input type="text" v-model="BookInfo.description"/>
    </form>
    <form class="bookInfo-form">
      <label >Image URL</label>
      <input type="text" v-model="BookInfo.imgURL"/>
      <label >Publisher</label>
      <input type="text" v-model="BookInfo.publisher"/>
      <label >Amount</label>
      <input type="number" v-model="BookInfo.amount"/>
      <label >CategoryID</label>
      <input type="number" v-model="BookInfo.categoryID"/>
    </form>
   
  </div>
     <button class="submit-btn">submit</button>
  </div>
</template>

<script>
export default {
  name: "addBookPage",
  data() {
    return {
      BookInfo:{
        ISBN:"",
        name:"",
        author:"",
        categoryID:0,
        description:"",
        imgURL:"",
        publisher:"",
        amount:0
        }
      }
  },
};
</script>

<style scoped>
@import "../assets/css/addBook.css";
</style>
