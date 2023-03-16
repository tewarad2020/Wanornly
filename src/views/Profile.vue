<template>
  <div>
    <div id="profilePage">
      <div @click="clickShowEdit()" class="edit_Icon_ctn">
        <Icon id="edit_Icon" icon="material-symbols:edit" />
      </div>
      <div class="ctn_profile_img">
        <img id="profile_Img" src="" alt="">
      </div>
      <div class="ctn_profile_info">
        <div @click="clickShowEdit_name()" class="edit_Icon_ctn_name">
          <Icon id="edit_Icon_name" icon="material-symbols:edit" />
        </div>

        <div v-show="isShowEdit_name" class="edit_name_ctn">
          <!-- <h1>Name Edit</h1> -->
          <div class="ctn_form_name">
            <div class="input_ctn_name">
              <input type="text" name="text_name" id="text_name" ref="text_name" :maxlength="40" 
              v-model="nameChange" @keyup="onChangenameUpload()" @change="onChangenameUpload()">
            </div>
            <div class="submit_edit_name">
              <div class="submit_btn_name" @click="submitForm_name('Change')">submit</div>
              <div class="default_btn_name" @click="submitForm_name('Default')" >default</div>
            </div>
          </div>
        </div>

        <div class="profile_name">Name : {{ Name }}</div>
        <div class="profile_username">Username : {{ variable.user_info?.username }}</div>
        <div class="profile_role">Role : {{ variable.user_info?.role }}</div>
        <div class="base_profile"></div>
      </div>
    </div>
    <div class="menu_profile_1">
      <div class="btn_addbook" v-if="variable.user_info?.role === 'admin'? true : false" @click="showAddBook">
        <Icon id="add_book_Icon" icon="material-symbols:add-box" />
        <span class="addbook_text">Add book</span>
        <span class="addbook_explain">add new book to the library.</span>
      </div>
      <div class="btn_request" @click="() => $router.push('/requestManager')" v-if="variable.user_info?.role === 'admin'? true : false">
        <Icon id="request_Icon" icon="pajamas:requirements" />
        <span class="request_text" >Request Management</span>
        <span class="request_explain">approve/deny borrowing request.</span>
      </div>
      <div class="btn_return" @click="() => $router.push('/BorrowManager')" v-if="variable.user_info?.role === 'admin'? true : false">
        <Icon id="return_Icon" icon="material-symbols:assignment-return-outline-rounded" />
        <span class="return_text" >Return Management</span>
        <span class="return_explain">manage returning.</span>
      </div>
      <div class="btn_donation" @click="() => $router.push('/donate')" >
        <Icon id="donate_Icon" icon="mdi:donate" />         
        <span class="donation_text">Donation</span>
        <span class="donation_explain">send request for e-book donation.</span>
      </div>
      <div class="btn_OfflineBorrow" @click="() => $router.push('/offlineBorrow')" v-if="variable.user_info?.role === 'admin'? true : false" >
        <Icon id="OfflineBorrow_Icon" icon="ic:outline-menu-book" />          
        <span class="OfflineBorrow_text">OfflineBorrow</span>
        <span class="OfflineBorrow_explain">manage borrowing directly.</span>
      </div>
      <div class="btn_Donate_Manager" @click="() => $router.push('/DonateManager')" v-if="variable.user_info?.role === 'admin'? true : false" >
        <Icon id="request_Icon2" icon="pajamas:requirements" />        
        <span class="Donate_Manager_text">Donate Manager</span>
        <span class="Donate_Manager_explain">approve/deny donation request.</span>
      </div>
    </div>
    <!-- <div class="menu_profile_2">
      
    </div> -->
    <div v-if="isShowAdd" class="ctn_addbookpage add_comp_active">
      <AddBook></AddBook>
      <div class="btn_exit_addbook" @click="closeAddBook">X</div>
    </div>
    
    
    <div v-show="isShowEdit" class="edit_profile_ctn">
      <h1>Profile Edit</h1>
      <div class="input_ctn">
        <input type="file" name="file" id="file" ref="file" accept="image/png, image/jpeg" @change="onChangeFileUpload()">
      </div>
      <div class="submit_edit_profile">
        <div class="submit_btn" @click="submitForm()">submit</div>
        <div class="default_btn" @click="defaultForm()">default</div>
      </div>
    </div>

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
        isShowEdit_name: false,
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
        nameChange: '',
        Name: ''
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
            .then(response => {
              console.log('response: ', response)
              // console.log('data: ', data)
              localStorage.setItem('link_profile', data.data.file.filename)
            })
            .then(() => {
              this.getProfileImage()
              setTimeout(() => {
                window.location.replace('/profile')
              }, 100)
            })
            .catch(error => console.log(error))
        })
        .catch(() => {
          console.log('FAILURE!!');
        });
      },
      async defaultForm() {
        let username = JSON.parse(localStorage.getItem('user_info'))?.username
        await axios.put(`http://localhost:3000/user/${username}`, {change_image: ''})
        .then(response => {
          console.log('response: ', response)
          localStorage.setItem('link_profile', '')
        })
        .then(() => {
          // this.getProfileImage()
          setTimeout(() => {
            window.location.replace('/profile')
          }, 10)
        })
        .catch(error => console.log(error))
      },
      async submitForm_name(detail){
        if (detail === 'Default') {
          this.nameChange = ''
        }
        let username = await JSON.parse(localStorage.getItem('user_info'))?.username
        await axios.put(`http://localhost:3000/upload/${username}`, {change_name: this.nameChange})
        .then(response => {
          console.log('response: ', response)
          localStorage.setItem('name_profile', this.nameChange)
        })
        .then(() => {
          // this.getName()
          setTimeout(() => {
            window.location.replace('/profile')
          }, 20)
        })
        .catch(error => console.log(error))
      },
      onChangeFileUpload(){
        this.file = this.$refs.file.files[0]
      },
      onChangenameUpload() {
        this.nameChange = this.$refs.text_name.value
      },
      getProfileImage() {
        const profile_Img = document.getElementById('profile_Img')
        
        let link_profile = localStorage.getItem('link_profile')
        if (!link_profile){
          console.log('link: ', this.variable.user_info.profileImage)
          profile_Img.src = this.variable.user_info?.profileImage
        }else {
          profile_Img.src = `http://localhost:3000/image/${link_profile}`
        }
      },
      getName() {
        let name_profile = localStorage.getItem('name_profile')
        if (name_profile) {
          this.Name = name_profile
        }else {
          this.Name = this.variable.user_info?.name
        }
      },
      clickShowEdit() {
        let edit_profile_ctn = document.getElementsByClassName('edit_profile_ctn')[0]
        if (!this.isShowEdit) {
          this.isShowEdit = true
          edit_profile_ctn.classList.add('Edit_profile_active')
          setTimeout(() => {
            edit_profile_ctn.style.height = `${edit_profile_ctn.clientWidth * 0.35}px`
          }, 20)
        }else {
          edit_profile_ctn.classList.remove('Edit_profile_active')
          edit_profile_ctn.classList.add('Edit_profile_passive')
          setTimeout(() => {
            this.isShowEdit = false
            edit_profile_ctn.classList.remove('Edit_profile_passive')
          }, 250)
        }
      },
      clickShowEdit_name() {
        let edit_name_ctn = document.getElementsByClassName('edit_name_ctn')[0]
        let ctn_profile_info = document.getElementsByClassName('ctn_profile_info')[0]
        let text_name = document.getElementById('text_name')
        let profile_name = document.getElementsByClassName('profile_name')[0]
        if (!this.isShowEdit_name) {
          text_name.value = this.nameChange
          this.nameChange = this.Name
          this.Name = ''
          console.log('text_name: ', text_name)
          this.isShowEdit_name = true
          edit_name_ctn.classList.add('Edit_profile_active')
          setTimeout(() => {
            let leftsize = profile_name.getBoundingClientRect().left - ctn_profile_info.getBoundingClientRect().left
            let topsize = profile_name.getBoundingClientRect().top - ctn_profile_info.getBoundingClientRect().top
            edit_name_ctn.style.left = `${leftsize}px`
            edit_name_ctn.style.top = `${topsize}px`
            edit_name_ctn.style.width = `${profile_name.clientWidth}px`
            edit_name_ctn.style.height = `${profile_name.clientHeight}px`
          }, 20)
        }else {
          text_name.value = this.nameChange
          this.nameChange = this.Name
          this.Name = this.variable.user_info.name
          edit_name_ctn.classList.remove('Edit_profile_active')
          edit_name_ctn.classList.add('Edit_profile_passive')
          setTimeout(() => {
            this.isShowEdit_name = false
            edit_name_ctn.classList.remove('Edit_profile_passive')
          }, 250)
        }
      }
    },
    mounted() {
      let initail = () => {
        this.variable.user_info = JSON.parse(localStorage.getItem('user_info'))
        let profilePage = document.getElementById('profilePage')
        profilePage.style.height = `${profilePage.clientWidth * 0.153}px`
        let ctn_profile_img = document.getElementsByClassName('ctn_profile_img')[0]
        ctn_profile_img.firstChild.style.width = `${ctn_profile_img.firstChild.clientHeight}px`
        this.getProfileImage()
        this.getName()
        let edit_Icon_ctn = document.getElementsByClassName('edit_Icon_ctn')[0]
        edit_Icon_ctn.style.height = `${edit_Icon_ctn.clientWidth}px`
        let edit_Icon_ctn_name = document.getElementsByClassName('edit_Icon_ctn_name')[0]
        edit_Icon_ctn_name.style.height = `${edit_Icon_ctn_name.clientWidth}px`

        setTimeout(() => {
          let menu_profile_1 = document.getElementsByClassName('menu_profile_1')[0]
          menu_profile_1.style.height = `${menu_profile_1.clientWidth * .20}px`
          let add_book_Icon = document.getElementById('add_book_Icon')
          add_book_Icon.style.width = `${add_book_Icon.clientHeight}px`
          let request_Icon = document.getElementById('request_Icon')
          request_Icon.style.width = `${request_Icon.clientHeight}px`
          let return_Icon = document.getElementById('return_Icon')
          return_Icon.style.width = `${return_Icon.clientHeight}px`
          let donate_Icon = document.getElementById('donate_Icon')
          donate_Icon.style.width = `${donate_Icon.clientHeight}px`
          let OfflineBorrow_Icon = document.getElementById('OfflineBorrow_Icon')
          OfflineBorrow_Icon.style.width = `${OfflineBorrow_Icon.clientHeight}px`
          let request_Icon2 = document.getElementById('request_Icon2')
          request_Icon2.style.width = `${request_Icon2.clientHeight}px`
        }, 100);
      }

      initail()
    }
}
</script>

<style>
  @import '../assets/css/profile.css';
</style>