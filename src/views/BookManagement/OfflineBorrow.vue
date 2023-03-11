<template>
  <div class="ctn_ob_page">
    <h1>Offline Borrow</h1>
    <div>
      <form @submit.prevent="CheckoutBorrowOffline">
        <div>
          <label>customer userID (gmail)</label>
          <input type="text" v-model="borrowInfo.user_id" />
        </div>
        <div>
          <label>day borrow</label>
          <input type="number" v-model="dayLimit" />
        </div>
        <div @click="CheckoutBorrowOffline()">submit</div>
      </form>
    </div>
    
    <div class="searchbar_ctn">
      <Searchbar
        :searchModeProp="searchModeProp"
        @selectedBookISBN="AddToOfflineCart"
      />
    </div>

    <div class="ob_ctn" v-for="(item,ind) in offlineCartBooks" :key="ind">
            <p>{{ item.ISBN }}</p>
            <p>{{ item.name }}</p>
            <button @click="removeFromOfflineCart(item.ISBN)">delete</button>
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
      }
      if (this.borrowInfo.offlineCartISBN.includes(ISBN)) {
        alert("already in offline cart");
        return;
      }
      this.borrowInfo.offlineCartISBN.push(ISBN);
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
        if (data.length === 0) {
          //dont have this user in database
          console.log("not in user database");
          this.borrowInfo.isValidID = false;
          
        } else {
          console.log("user already in database");
          this.borrowInfo.isValidID = true;
          
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
  },

};
</script>

<style scoped>
@import "../../assets/css/offlineBorrow.css";
</style>
