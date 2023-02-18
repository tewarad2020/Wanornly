import axios from "axios";
import store from "@/store";

const cartHandler ={
    data(){
      return{
        cartData : [{
          user_id:"",
          ISBN:0,
          time_item:null,
          status_request:"inCart",
          time_request:null
        }],
        allBookHistory:null,
        bookInCart:null,
        bookPending:null,
      }
    },
    mounted(){
      this.fetchCart()

    },
    computed:{
      InCartFiltered:function(){
        const InCartISBN = this.cartData.filter(ele=>ele.status_request=="inCart")
                                            .map(b=>b.ISBN)
        if(this.allBookHistory!=null)
        this.bookInCart = this.allBookHistory.filter(b=>InCartISBN.includes(b.ISBN))
        return this.bookInCart
      } ,
      PendingFiltered:function(){
        const PendingISBN = this.cartData.filter(ele=>ele.status_request=="pending")
                                            .map(b=>b.ISBN)
        if(this.allBookHistory!=null)
        this.bookPending = this.allBookHistory.filter(b=>PendingISBN.includes(b.ISBN))
        return this.bookPending
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

          this.allBookHistory = this.cartData.map(c=>{
              const [cBookData] = allBookData.filter(bd=>bd.ISBN==c.ISBN)
              return  {
                  ...c,
                  ...cBookData
              }
          })
          //this.allBookHistory = this.$store.getters.data.filter(b=>allCartISBN.includes(b.ISBN))
          
          store.commit('setCartData', data)
          console.log('fetch and store cart information successfully!')
        })
        }
        catch(err){
          console.log(err)
        }
      }
    }
}


const AddToCartHandler = {
  data() {
    return {
      reqCart: {
        user_id: "",
        ISBN: 0,
        time_item: null,
        status_request: "inCart",
        time_request: null,
      },
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
        time_item: new Date(),
      };
      console.log(this.reqCart);
      await axios
        .put(`http://localhost:3000/carts`, this.reqCart)
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
      alert("Add this book to cart complete");
    },
    DuplicateHandle() {
      alert("This book is already in cart");
    },
  },
};

export { AddToCartHandler,cartHandler};
