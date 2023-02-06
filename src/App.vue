<template>

  <span ref="nevbarRef"><Navbar/></span>
  <router-view/>

  <router-link to='/'>Home</router-link> | 
  <router-link to='/book'>Book</router-link>

</template>

<script>
  import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
      Navbar,
  },
  data() {
    return {
      winScroll: {
        X : 0,
        Y : 0
      }, 
      path: {
        coverPath : require('./assets/images/1187343.png'),
      },
      reference: {
        navRef : null
      },
      variable: {
        
      }
    }
  },

  methods: {
    setWindowScroll() {
      this.winScroll.X = window.pageXOffset
      this.winScroll.Y = window.pageYOffset
      // console.log(this.winScroll.Y)
      this.nevbarTokkle()
    },
    nevbarTokkle() {
      if (this.winScroll.Y >= 350) {
        this.reference.navRef.classList.remove("active")
        this.reference.navRef.classList.add("noactive")
      }else {
        if (this.reference.navRef.className !== '') {
          this.reference.navRef.classList.remove("noactive")
          this.reference.navRef.classList.add("active")
        }
      }
    }
  },

  watch: {
    $route (to, from){
        console.log(from) 
        console.log(to)
        // if (to.name === 'bookPage') {
        //   console.log('asd')
        //   this.$router.replace({ path: '/' })
        // }
    }
  },
  
  mounted() {
    // Initial
    let initial = () => {
      window.addEventListener("scroll", () => {this.setWindowScroll()})
      this.reference.navRef = this.$refs.nevbarRef.childNodes[0]
    }


    // Proces
    initial()
  },
}
</script>

<style>
  @import './assets/css/app.css';
</style>
