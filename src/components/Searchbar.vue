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
            variable: {
              searchbar: null,
            }
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
          this.variable.searchbar.classList.remove('searchbar_passive')
          this.variable.searchbar.classList.add('searchbar_active')
          setTimeout(() => {
            this.filter()
          }, 30)
        }
        let datafilter = this.$store.getters.data
        let list_books = document.getElementById('list_books')
        let ctn_books = document.createElement('div')
        ctn_books.classList.add('ctn_books')
        if (list_books) {
          if (list_books.firstChild) list_books.firstChild.remove()

          datafilter.filter(book => {
            let name = book.product_name
            let id = book._id
            if (name) name = name.toLowerCase().replaceAll(' ', '');
            let author = book.author_name
            if (author) author = author.toLowerCase().replaceAll(' ', '');
            let newtext = this.text.toLowerCase().replaceAll(' ', '');
         
            if (name && author && (name.includes(newtext) || author.includes(newtext))) {
              let div_books = document.createElement('div')
              // div_books.addEventListener('click', () => {
              //   window.open(`/book/${id}`, '_blank');
              // })
              let cover_book = document.createElement('div')
              cover_book.classList.add('cover_book')
              cover_book.addEventListener('click', () => {
                window.open(`/book/${id}`, '_blank');
              })

              list_books.appendChild(ctn_books)
              let book_with = ctn_books.clientWidth
              div_books.style.overflow = `hidden`
              div_books.style.margin = `0 1% 0 1%`
              div_books.style.width = `${book_with / 4 * 0.92}px`
              div_books.style.height = `${book_with / 2.5 * 0.92}px`
              div_books.classList.add('div_books')
              list_books.firstChild.remove()

              let bookImg = document.createElement('img')
              bookImg.classList.add('bookImg')
              let bookName = document.createElement('div')
              bookName.classList.add('bookName')
              let bookAuthor = document.createElement('div')
              bookAuthor.classList.add('bookAuthor')
              let btn_addToCrat = document.createElement('div')
              btn_addToCrat.addEventListener('click', () => {this.addToCrat()})
              btn_addToCrat.innerHTML = 'add to Cart'
              btn_addToCrat.classList.add('btn_addToCrat')
              let box_info = document.createElement('div')
              box_info.classList.add('box_info')
              bookImg.src = book.image
              bookName.innerHTML = book.product_name
              bookAuthor.innerHTML = 'Author | ' + book.author_name
              cover_book.appendChild(bookImg)
              box_info.appendChild(bookName)
              box_info.appendChild(bookAuthor)
              cover_book.appendChild(box_info)
              div_books.appendChild(cover_book)
              div_books.appendChild(btn_addToCrat)
              ctn_books.appendChild(div_books)
              list_books.appendChild(ctn_books)
            }
          })
        }
      },
      addToCrat() {
        // code here bike koung
        console.log('addtocart')
      }
  },
  mounted() {
    let initial = () => {
      const searchbar = document.getElementById('list_books')
      this.variable.searchbar = searchbar
    }
    
    initial()
  }

}
</script>

<style>
    @import '../assets/css/searchbar.css';
</style>