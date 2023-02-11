<template>
  <div class="page"></div>
</template>

<script>
export default {
  name: "addBookPage",
  data() {
    return {
      path: {
        coverPath: require("../assets/images/bg1.jpg"),
      },
    };
  },
};
</script>

<style>
@import "../assets/css/addBook.css";
</style>
