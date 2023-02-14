<template>
  <div class="search_ctn">
    <!-- <div class="labelBar"> -->
        <input type="text" placeholder="Search..">
    <!-- </div> -->
        <button v-on:click="goto('/searchbook')">Search</button>
  </div>
</template>

<script>
export default {
    name: 'SearchbarComponent',
    data() {
        return {
            
        }
    },
    methods: {
    goto(nextpath) {
        this.$router.push(nextpath)
    }
  }
}
</script>

<style>
    @import '../assets/css/searchbar.css';
</style>