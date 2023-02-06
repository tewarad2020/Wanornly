<template>
  <div class="search_ctn">
    <!-- <div class="labelBar"> -->
        <input type="text" placeholder="Search..">
    <!-- </div> -->
        <button @click="() => {console.log('click')}">Search</button>
  </div>
</template>

<script>
export default {
    name: 'SearchbarComponent',
    data() {
        return {
            
        }
    }
}
</script>

<style>
    @import '../assets/css/searchbar.css';
</style>