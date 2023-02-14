<template>

    <div>
        <router-link to='/'>Home</router-link>
        <div class="d-flex row justify-content-around container">
    <div id="App" @click="showModal = true" class="w-50 p-3 m-3 col " style="background-color: #eee;"
      v-for="item in state.books" :key="item.ISBN">
      <div class="mx-auto" style="width:min-content;">
        <figure class="figure"> <img class="py-2" :src=item.image> </figure>
      </div>
      <p class="text-center">{{ item.product_name }}</p>
      <div class="text-center " ><button  @click="showModel = item">info book.</button>
        <!-- อันนี้คือกดคลิกแล้ว popup นะ -->
        <div class="model" v-if="showModel === item">
          <div class="model-overlay" @click="showModel = null"></div>
          <div class="model-content" position: relative>
            <h2>{{ item.product_name }}</h2>
            <p>{{ item.product_name }}</p>
            <button @click="showModel = null">Close</button>
            
          </div>
        </div>
      </div>
      <!-- ประมาณอันนี้ -->
    </div>
  </div>
    </div>
</template>
  
<script>
  export default {
    name: 'SearchBookPage',

    setup() {
       
    }
  }

  
</script>
  
<style>
  
</style>