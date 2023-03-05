<template>
  <div>
    <div id="profilePage">
      <div class="ctn_profile_img">
        <img :src="variable.user_info?.change_image? getProfileImage() : variable.user_info?.profileImage" alt="">
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
        <div class="btn_donation" v-if="variable.user_info?.role === 'admin'? true : false" >
          <Icon id="donation_Icon" icon="ic:outline-menu-book" />          
          <div class="donation_text">Donation</div>
        </div>
    </div>
    <div v-if="isShowAdd" class="ctn_addbookpage add_comp_active">
      <AddBook></AddBook>
      <div class="btn_exit_addbook" @click="closeAddBook">X</div>
    </div>
    
    <!-- test -->
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <h1>Mongo upload</h1>
      <div>
        <label for="file">Choose file
        </label>
        <input type="file" name="file" id="file" ref="file" accept="image/png, image/jpeg" @change="onChangeFileUpload()">
        <!-- <input type="submit" value="Submit" @click="postImage()"> -->
        <!-- <div @click="testpost()"> click me </div> -->
      </div>
    <div>
      <div @click="submitForm()">submit</div>
      <!-- <div @click="getImageTTT()">getImageTTT</div> -->
      <!-- <img src="http://localhost:3000/image/a56e459e10df9165f26dbdde642d0844.png" alt=""> -->
      <!-- <img id="testt" src="" alt=""> -->
    </div>
    <!-- test -->

  </div>
</template>

<script>
import AddBook from '../views/BookManagement/AddBook.vue'
import { Icon } from '@iconify/vue'
import axios from 'axios'

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
        add_comp: null,
        file: '',
      }
    },
    methods: {
      showAddBook(){
        this.isShowAdd = true;
        setTimeout(() => {
          this.add_comp = document.getElementsByClassName('add_comp_active')[0]
        }, 20);
      },
      closeAddBook() {
          this.add_comp.classList.add('add_comp_passive')
          this.add_comp.classList.remove('add_comp_active')
          setTimeout(() => {
            this.add_comp.classList.remove('add_comp_passive')
            this.add_comp.classList.add('add_comp_active')
            this.isShowAdd = false;
          }, 250)
      },
      async submitForm(){
        let formData = new FormData();
        formData.append('file', this.file);
        let username = JSON.parse(localStorage.getItem('user_info'))?.username

        await axios.post(`http://localhost:3000/upload/${username}`,
            formData,
            {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }
        ).then(async (data) => {
          await axios.put(`http://localhost:3000/user/${username}`, {change_image: data.data.file.filename})
            .then(response => console.log(response))
            .catch(error => console.log(error))
          // window.location.replace('/')
        })
        .catch(() => {
          console.log('FAILURE!!');
        });
      },
      onChangeFileUpload(){
        this.file = this.$refs.file.files[0];
      },
      getProfileImage() {
        console.log(`http://localhost:3000/image/${this.variable.user_info?.change_image}`)
        return `http://localhost:3000/image/${this.variable.user_info?.change_image}`
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