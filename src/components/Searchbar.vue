<template>
  <div class="search_ctn">
    <!-- <div class="labelBar"> -->
        <input type="text" placeholder="Search.." v-model="text" @keyup="filter()" @change="filter()" @click="filter()">
    <!-- </div> -->
        <button v-on:click="goto('/searchbook')">Search</button>
  </div>
</template>

<script>
export default {
    name: 'SearchbarComponent',
    data() {
        return {
            text: '',
        }
    },
    methods: {
    goto(nextpath) {
        this.$router.push(nextpath)
    },
    filter() {
      let datafilter = this.$store.getters.data
      let list_books = document.getElementById('list_books')
      while (list_books.firstChild) {
          list_books.firstChild.remove()
      }
      datafilter.filter(book => {
        let name = book.product_name
        name = name.toLowerCase().replaceAll(' ', '');
        let author = book.author_name
        author = author.toLowerCase().replaceAll(' ', '');
        let newtext = this.text.toLowerCase().replaceAll(' ', '');
        if (name.includes(newtext) || author.includes(newtext)) {
          let div_books = document.createElement('div')
          div_books.classList.add('cnt_books')
          let bookImg = document.createElement('img')
          let bookName = document.createElement('div')
          let bookAuthor = document.createElement('div')
          bookImg.src = book.image
          bookName.innerHTML = book.product_name
          bookAuthor.innerHTML = book.author_name
          div_books.appendChild(bookImg)
          div_books.appendChild(bookName)
          div_books.appendChild(bookAuthor)
          list_books.appendChild(div_books)
        }
      })
    }
    
  },

}
</script>

<style>
    @import '../assets/css/searchbar.css';
</style>