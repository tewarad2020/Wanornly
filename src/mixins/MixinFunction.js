import axios from "axios";
import store from "@/store";

const bookHandler ={
    data(){
      return{
        BookInfo:{
          ISBN:0,
          name:"",
          author:"",
          category:"",
          book_description:"",
          image:"",
          publisher:"",
          amount:0,
          borrow_count:0
          }
      }
    },
    methods:{
      async updateBook() {
        await  axios.put(`http://localhost:3000/books/${this.BookInfo.ISBN}`, this.BookInfo)
            .then(response => console.log(response))
            .catch(error => console.log(error))
            window.location.replace('/')
        },
        getBookInfo(ISBN){
          let allBooks = this.$store.getters.data
          do{
            setTimeout(() => {
                allBooks = this.$store.getters.data
            }, 200);
         }while(allBooks==null)  

          const [filteredBook] =  allBooks.filter(b=>b.ISBN==ISBN)
            this.BookInfo = filteredBook
        },
      },
    }


const cartHandler ={
    data(){
      return{
        cartData : [{
          user_id:"",
          ISBN:0,
          time_resolved:null,
          status_request:"inCart",
          time_return_limit:null
        }],
        currentUserAllBook:null,
        currentUserInCart:null,
        currentUserPending:null,
        currentUserDeny:null,
        currentUserApprove:null,
      }
    },
    mounted(){
      this.fetchCart()

    },
    computed:{
      currentInCartFiltered:function(){
        const InCartISBN = this.cartData.filter(ele=>ele.status_request=="inCart")
                                            .map(b=>b.ISBN)
        if(this.currentUserAllBook!=null)
        this.currentUserInCart = this.currentUserAllBook.filter(b=>InCartISBN.includes(b.ISBN))
        return this.currentUserInCart
      } ,
      currentPendingFiltered:function(){
        const PendingISBN = this.cartData.filter(ele=>ele.status_request=="pending")
                                            .map(b=>b.ISBN)
        if(this.currentUserAllBook!=null)
        this.currentUserPending = this.currentUserAllBook.filter(b=>PendingISBN.includes(b.ISBN))
        return this.currentUserPending
      } ,
      currentDenyFiltered:function(){
        const DenyISBN = this.cartData.filter(ele=>ele.status_request=="deny")
                                            .map(b=>b.ISBN)
        if(this.currentUserAllBook!=null)
        this.currentUserDeny = this.currentUserAllBook.filter(b=>DenyISBN.includes(b.ISBN))
        return this.currentUserDeny
      } ,
      currentApproveFiltered:function(){
        const ApproveISBN = this.cartData.filter(ele=>ele.status_request=="approve")
                                            .map(b=>b.ISBN)
        if(this.currentUserAllBook!=null)
        this.currentUserApprove = this.currentUserAllBook.filter(b=>ApproveISBN.includes(b.ISBN))
        return this.currentUserApprove
      } ,
    },
    methods:{
      async fetchCart (){
        try{
          const username = JSON.parse(localStorage.getItem("user_info")).username
          console.log(`username = ${username}` )
         await fetch(`http://localhost:3000/carts/${username}`) //get cart information
        .then(res => res.json())
        .then(data => {
          console.log('cart: ',data)
          //this.cartData = data.filter(ele=>ele.status_request=="inCart")
          this.cartData = data
        
          const allBookData = this.$store.getters.data

          this.currentUserAllBook = this.cartData.map(c=>{
              const [cBookData] = allBookData.filter(bd=>bd.ISBN==c.ISBN)
              return  {
                  ...c,
                  ...cBookData
              }
          })
          //this.currentUserAllBook = this.$store.getters.data.filter(b=>allCartISBN.includes(b.ISBN))
          
          store.commit('setCartData', data)
          console.log('fetch and store cart information successfully!')
        })
        }
        catch(err){
          console.log(err)
        }
      },
       async removeCart(user_id,ISBN){
        await axios.delete(`http://localhost:3000/carts/${user_id}-${ISBN}`)
                    .then(()=>{console.log(`remove item :${ISBN} form cart `)})
        
                   this.fetchCart()
     },
    }
}


const AddToCartHandler = {
  data() {
    return {
      reqCart: {
        user_id: "",
        ISBN: 0,
        time_resolved: null,
        status_request: "inCart",
        time_return_limit: null,
      },
      status_send: false,
    };
  },
 
  methods: {
    async CheckAddToCart(ISBN, userID) {
      await axios
        .get(`http://localhost:3000/carts/${userID}`)
        .then((res) => res.data)
        .then((data) => {
          const filtered = data.filter((ele) => ele.ISBN == ISBN);
          if (filtered.length !== 0) {
            //already have same book in cart
            this.DuplicateHandle();
            console.log("book is already in cart");
            this.status_send = false
          } else {
            this.AddToCart(ISBN, userID);
          }
        });
    },
    async AddToCart(ISBN, userID) {
      this.reqCart = {
        ...this.reqCart,
        user_id: userID,
        ISBN: ISBN,
        time_resolved: new Date(),
      };
      alert("Add this book to cart complete");
      this.status_send = true
      console.log('add To cart:', this.reqCart);
      await axios
        .put(`http://localhost:3000/carts`, this.reqCart)
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
    },
    DuplicateHandle() {
      alert("This book is already in cart");
    },
  },
};

export { AddToCartHandler,cartHandler ,bookHandler};
