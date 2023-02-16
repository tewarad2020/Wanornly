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
              div_books.addEventListener('click', () => {
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
              let bookName = document.createElement('p')
              bookName.classList.add('bookName')
              let bookAuthor = document.createElement('p')
              bookAuthor.classList.add('bookAuthor')
              let box_info = document.createElement('div')
              box_info.classList.add('box_info')
              bookImg.src = book.image
              bookName.innerHTML = book.product_name
              bookAuthor.innerHTML = 'Author | ' + book.author_name
              div_books.appendChild(bookImg)
              box_info.appendChild(bookName)
              box_info.appendChild(bookAuthor)
              div_books.appendChild(box_info)
              ctn_books.appendChild(div_books)
              list_books.appendChild(ctn_books)
            }
          })
        }
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