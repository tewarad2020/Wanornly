<template>
  <div class="ctn_ob_page">
    <h1>Offline Borrow</h1>
    <div class="searchbar_ctn">
      <Searchbar class="searchbar_box"
        :searchModeProp="searchModeProp"
        @selectedBookISBN="AddToOfflineCart"
      />
    </div>

    <div  class="ctn_data_text">
      <form @submit.prevent="CheckoutBorrowOffline">
        <div class="box_customer">
          <label>Customer userID (G-mail)</label>
          <div class="ctn_SWO">
            <input type="text" v-model="borrowInfo.user_id" list="Username" placeholder="gmail">
              <datalist id="Username"></datalist>
          </div>
        </div>

        <div class="box_day">
          <label>Day borrow</label>
          <input type="number" v-model="dayLimit" />
        </div>

        <div class="box_submit" @click="CheckoutBorrowOffline()">submit</div>
      </form>
    </div>

    <div class="ob_ctn" v-for="(item,ind) in offlineCartBooks" :key="ind">
        <div class="ob_book_img">
          <img class="ob_book_img_item" :src="item.image" alt="">
        </div>
        <div class="ob_book_text">
          <p>ISBN | {{ item.ISBN }}</p>
          <p>Book name | {{ item.name }}</p>
          <p>Author | {{ item.author }}</p>
        </div>  
        <div class="btn_delete_ob" @click="removeFromOfflineCart(item.ISBN)">X</div>
    </div>

   
  </div>
</template>

<script>
import axios from "axios";
import { allCartHandler } from "@/mixins/MixinFunction";
import Searchbar from "../../components/Searchbar.vue";

export default {
  name: "offlineBorrow",
  components: {
    Searchbar,
  },
  mixins: [allCartHandler],
  data() {
    return {
      searchModeProp: "forOffline",
      allUser: {},
      borrowInfo: {
        user_id: "",
        offlineCartISBN: [],
        isValidID: false,
      },
    };
  },
  computed:{
    offlineCartBooks:function(){
        let allBooks = this.$store.getters.data

        if(allBooks!=null){
          let inCartBook =  allBooks.filter(ele=>this.borrowInfo.offlineCartISBN.includes(ele.ISBN))
          return inCartBook
      }
           
      return null
    }
  },
  methods: {
    removeFromOfflineCart(ISBN){
      this.borrowInfo.offlineCartISBN = this.borrowInfo.offlineCartISBN.filter(incartISBN =>incartISBN!=ISBN)
    },
    AddToOfflineCart(ISBN) {
      let [found] = this.allRequest.filter(
        (bookreq) =>
          bookreq.user_id == this.borrowInfo.user_id &&
          bookreq.ISBN == ISBN &&
          bookreq.status_request == "approve"
      );

      if (found != null) {
        // if currently borrow
        alert("already borrow");
        return;
      }else if (this.borrowInfo.offlineCartISBN.includes(ISBN)) {
        alert("already in offline cart");
        return;
      }
      this.borrowInfo.offlineCartISBN.push(ISBN);
      alert("Successful selection of books");
      console.log("book in offlineCart", this.borrowInfo.offlineCartISBN);
    },
    async CheckoutBorrowOffline() {
      await this.CheckValidUsername()
      if (!this.borrowInfo.isValidID) {
        console.log("username not valid");
        return;
      }
      if (this.dayLimit <= 0) {
        alert("time borrow limit must be more than 0");
        return;
      }

      if (!this.OfflineCartValidation()) {
        console.log("cart not valid");
        return;
      }

     await this.updateAllBook()
     await this.pushAllRequestStatus();
     this.resetCart()
    },
    OfflineCartValidation() {
      this.borrowInfo.offlineCartISBN.map((bookISBN) => {
        this.getBookInfo(bookISBN);
        if (this.BookInfo.amount <= 0) {
          // book amount is 0
          alert("this book amount is not sufficient:", bookISBN);
          return false;
        }
      });
      return true
    },
    async updateAllBook() {
      this.borrowInfo.offlineCartISBN.map((bookISBN) => {
        this.getBookInfo(bookISBN);

        this.BookInfo = {
          ...this.BookInfo,
          amount: this.BookInfo.amount - 1,
          borrow_count: this.BookInfo.borrow_count + 1,
        }; //decrease amount
        this.updateBook();
      });
    },
    async pushAllRequestStatus() {
      const thisDate = new Date();

      this.borrowInfo.offlineCartISBN.map(async (bookISBN) => {
        let newReq = {
          user_id: this.borrowInfo.user_id,
          ISBN: bookISBN,
          time_resolved: thisDate,
          status_request: "approve",
          time_return_limit: this.addDaysAndRound(thisDate, this.dayLimit),
        };

        console.log(newReq);
        await this.removeCart(this.borrowInfo.user_id,bookISBN) //remove then add 
        await axios
          .put(
            `http://localhost:3000/carts/`,
            newReq
          )
          .then(() => {
            console.log(
              `update status item :${bookISBN} form cart of ${this.borrowInfo.user_id}`
            );
          });
      });

      this.fetchAllRequest();
    },  
    async CheckValidUsername() {
    await fetch(`http://localhost:3000/user/${this.borrowInfo.user_id}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log('data: ', data === false)
        if (Array.isArray(data)) {
          console.log("user already in database");
          this.borrowInfo.isValidID = true;
        } else {
          console.log("not in user database");
          this.borrowInfo.isValidID = false;
        }
      });
    },
    resetCart(){
      this.borrowInfo = {
        user_id: "",
          offlineCartISBN: [],
          isValidID: false,
      }
      this.dayLimit = 0
    },
    async getUser() {
      await axios.get(`http://localhost:3000/user`)
      .then(res=>res.data)
      .then(data=>{
        console.log("fetch User:",data)
        if (data.length > 0){
          this.allUser = data
          let Username = document.getElementById('Username')
          let options = '';
          this.allUser.forEach(element => {
              options += '<option value="' + element.id + '" />'
          })
          Username.innerHTML = options
        }
      })
    },
  },
  mounted() {
    let innit = () => {
        this.getUser()
    }

    innit()
  },
  watch: {
    offlineCartBooks() {
      setTimeout(() => {
        let ob_book_img = document.querySelectorAll('.ob_book_img')
        let ob_book_text = document.querySelectorAll('.ob_book_text')
        for (let i=0;i<ob_book_img.length;i++) {
          ob_book_img[i].style.height = `${ob_book_img[0].clientWidth * 1.2}px`
          ob_book_text[i].style.height = `${ob_book_img[0].clientWidth * 1.2}px`
        }
      }, 100)
    }
  }

};
</script>

<style scoped>
@import "../../assets/css/offlineBorrow.css";
</style>
