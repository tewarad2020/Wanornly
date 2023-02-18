<template>
  <div>
    <div id="profilePage">
      <div class="ctn_profile_img">
        <img :src="variable.user_info?.profileImage" alt="">
      </div>
      <div class="ctn_profile_info">
        <div class="profile_name">Name : {{ variable.user_info?.name }}</div>
        <div class="profile_username">Username : {{ variable.user_info?.username }}</div>
        <div class="profile_role">Role : {{ variable.user_info?.role }}</div>
        <div class="base_profile"></div>
      </div>
    </div>
    <div class="menu_profile">
        <div class="btn_addbook" v-if="variable.user_info?.role === 'admin'? true : false" @click="showAddBook">
          <Icon id="add_book_Icon" icon="material-symbols:add-box" />
          <div class="addbook_text">Add book</div>
        </div>
        <div class="btn_request" v-if="variable.user_info?.role === 'admin'? true : false" >
          <Icon id="request_Icon" icon="pajamas:requirements" />
          <div class="request_text">Requirements</div>
        </div>
    </div>
    <div v-if="isShowAdd" class="ctn_addbookpage">
      <AddBook></AddBook>
      <div class="btn_exit_addbook" @click="closeAddBook">X</div>
    </div>
  </div>
</template>

<script>
import AddBook from '../views/BookManagement/AddBook.vue'
import { Icon } from '@iconify/vue';

export default {
    name: 'profilePage',
    components: {
      AddBook,
      Icon
    },
    data() {
      return {
        variable: {
          user_info: null
        },
        isShowAdd:false,
        isShowEdit:false,
        testBookProp:{
        ISBN:"123",
        name:"dsfsdf",
        author:"dsfdsf",
        categoryID:0,
        book_description:"dfssf",
        image:"sdfs",
        publisher:"dsfds",
        amount:0
        },
      }
    },
    methods: {
      showAddBook(){
        this.isShowAdd = true;
      },
      closeAddBook() {
        this.isShowAdd = false;
      }
    },
    mounted() {
      let initail = () => {
        this.variable.user_info = JSON.parse(localStorage.getItem('user_info'))
        let ctn_profile_img = document.getElementsByClassName('ctn_profile_img')[0]
        ctn_profile_img.firstChild.style.width = `${ctn_profile_img.firstChild.clientHeight}px`
      }

      initail()
    }
}
</script>

<style>
  @import '../assets/css/profile.css';
</style>