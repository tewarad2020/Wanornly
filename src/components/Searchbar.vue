<template>
  <div class="search_ctn">
    <!-- <div class="labelBar"> -->
        <input type="text" placeholder="Search.." v-model="text" @keyup="filter()" @change="filter()" @click="filter()">
    <!-- </div> -->
        <button @click="refresh()">refresh</button>
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
      refresh() {
        this.text = ''
        this.filter()
      },
      filter() {
        if (!this.$store.getters.Searching) {
          this.$store.commit('setSearching', true)
          setTimeout(() => {
            this.filter()
          }, 30)
        }
        let datafilter = this.$store.getters.data
        let list_books = document.getElementById('list_books')
        let ctn_books = document.createElement('div')
        if (list_books) {
          if (list_books.firstChild) list_books.firstChild.remove()

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
              ctn_books.appendChild(div_books)
              list_books.appendChild(ctn_books)
            }
          })
        }
      }
    
  },

}
</script>

<style>
    @import '../assets/css/searchbar.css';
</style>