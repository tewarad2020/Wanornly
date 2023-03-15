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
            .then(response => {
              console.log(response)
              alert('update book completed')
            })
            .catch(error => console.log(error))
            // window.location.replace('/')
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

const personalHistoryHandler = {
      data(){
        return{
          historyData:[{
            _id:"",
            user_id:"",
            ISBN:0,
            time_resolved:null,
            time_return_limit:null,
            time_returned:null,
          }],
          historyAddReqBody:{
            user_id:"",
            ISBN:0,
            time_resolved:null,
            time_return_limit:null,
            time_returned:null,
          },
          currentUserAllBookHistory:null,
        }
      },
      mounted(){
        setTimeout(()=>{
            this.fetchHistory()
        },200)
       
      },
      methods:{
        async AddToHistory(cartData){
          this.historyAddReqBody = {
            user_id:cartData.user_id,
            ISBN:cartData.ISBN,
            time_resolved:cartData.time_resolved,
            time_return_limit:cartData.time_return_limit,
            time_returned: new Date(),
          };

          alert("Add this book to history complete");
          console.log('add To history:', this.historyAddReqBody);
          await axios
            .put(`http://localhost:3000/history`, this.historyAddReqBody)
            .then((response) => console.log(response))
            .catch((error) => console.log(error));
        },
        async fetchHistory(){
          try{
            const username = JSON.parse(localStorage.getItem("user_info")).username
            console.log(`username = ${username}` )
           await fetch(`http://localhost:3000/history/${username}`) //get history information
          .then(res => res.json())
          .then(data => {
            console.log('history: ',data)
            //this.cartData = data.filter(ele=>ele.status_request=="inCart")
            this.historyData = data
          
            const allBookData = this.$store.getters.data
  
            this.currentUserAllBookHistory = this.historyData.map(c=>{
                const [cBookData] = allBookData.filter(bd=>bd.ISBN==c.ISBN)
                return  {
                    ...c,
                    ...cBookData
                }
            })
           
          
            console.log('fetch history information successfully!')
          })
          }
          catch(err){
            console.log(err)
          }
        }
      }
}

const allCartHandler = {
  mixins:[bookHandler],
  data(){
      return{
          allRequest:[],
          requestBody :{
              user_id:"",
              ISBN:0,
              time_resolved:null,
              status_request:"inCart",
              time_return_limit:null
      },
      allRequestBook:[],
      dayLimit: 7,
      currentPageInfoFiltered:[],
      currentApproveFiltered:[],
      currentPendingFiltered:[],



      }
  },
  mounted(){
      //this.fetchAllRequest()
      setTimeout(()=>{
        this.fetchAllRequest()
      },200)
  },
  computed:{
    // currentPageInfoFiltered:function(){
     
    // } ,
    //   currentPendingFiltered:function(){
     
    // } ,
    // currentApproveFiltered:function(){

    // } ,

  },
  methods:{
    updateCurrentPageInfo(){
      let combined = []
      if(this.currentApproveFiltered?.length!=0 && this.currentReturnFiltered?.length!=0)
        combined = [].concat(this.currentApproveFiltered,this.currentReturnFiltered)   //just for test, actually is pending and borrowing not inCart

      this.currentPageInfoFiltered =  combined
    },
    updatePendingFiltered(){
      if(this.allRequestBook.length!=0 )
      {
          let pendingRequestBook =  this.allRequestBook.filter(ele=>ele.status_request=="pending")
          
          pendingRequestBook = pendingRequestBook.sort((a,b)=>{
              if(a.ISBN-b.ISBN!=0) return a.ISBN-b.ISBN
              else{ //same isbn then compare date
                  if(new Date(a.time_resolved).getTime()<new Date(b.time_resolved).getTime()) return -1
                  else return 1
              }
          })
          this.currentPendingFiltered =  pendingRequestBook
      }
        else{
          this.currentPendingFiltered = []
        }   
       
    },
    updateApproveFiltered(){
      if(this.allRequestBook.length!=0)
      {
       

          let ApproveRequestBook =  this.allRequestBook.filter(ele=>ele.status_request=="approve")
          
          ApproveRequestBook = ApproveRequestBook.sort((a,b)=>{
              if(new Date(a.time_return_limit).getTime()-new Date(b.time_return_limit).getTime()!=0) return new Date(a.time_return_limit).getTime()-new Date(b.time_return_limit).getTime()
              else{ //same isbn then compare date
                  if(new Date(a.time_resolved).getTime()<new Date(b.time_resolved).getTime()) return -1
                  else return 1
              }
          })
          this.currentApproveFiltered = ApproveRequestBook
      }
           
     else{
      this.currentApproveFiltered = []
     } 
    },
   addDaysAndRound(date, days) {
  var result = new Date(date);
 result.setDate(result.getDate() + days +1);
 result.setHours(0, 0, 0);
 return result;
 },
  async updateRequestStatus(user_id,ISBN,newStatus){

   let [newReq] = this.allRequest.filter(r=>r.ISBN==ISBN&&r.user_id==user_id)
   const thisDate = new Date()

   //check what is newStatus
   if(newStatus=="approve"){
    newReq = {
      ...newReq,
      time_resolved:thisDate, //time approve, deny
      time_return_limit: this.addDaysAndRound(thisDate,this.dayLimit), // time return limit if borrow
      status_request:newStatus
  }
   }
   else if(newStatus == "deny"){
    newReq = {
      ...newReq,
      time_resolved:thisDate, //time deny
      status_request:newStatus
    }
   }
 
      // newReq = {
      //     ...newReq,
      //     time_resolved:thisDate, //time approve, deny
      //     time_return_limit: this.addDaysAndRound(thisDate,this.dayLimit), // time return limit if borrow
      //     status_request:newStatus
      // }
    console.log(newReq)
    
    await axios.put(`http://localhost:3000/carts/${user_id}-${ISBN}`,newReq)
                   .then(()=>{console.log(`update status item :${ISBN} form cart of ${user_id}`)})
  
                   setTimeout(()=>{
                    this.fetchAllRequest()
                  },200)
  },
  
      async fetchAllRequest(){
          await axios.get('http://localhost:3000/carts')
                          .then(res=>res.data)
                              .then(data=>{
                                  // console.log(data)
                                  this.allRequest = data
                                 
          let allBookData = this.$store.getters.data
           do{
              setTimeout(() => {
                  allBookData = this.$store.getters.data
              }, 200);
           }while(allBookData==null)  

          this.allRequestBook = this.allRequest.map(c=>{
            const [cBookData] = allBookData.filter(bd=>bd.ISBN==c.ISBN)
            return  {
                ...c,
                ...cBookData
            }})
            
            this.updateApproveFiltered()
            this.updatePendingFiltered()
            this.updateCurrentPageInfo()
      })
      },
      async removeCart(user_id,ISBN){
        await axios.delete(`http://localhost:3000/carts/${user_id}-${ISBN}`)
                    .then(()=>{console.log(`remove item :${ISBN} form cart `)})
        
                    setTimeout(()=>{
                      this.fetchAllRequest()
                    },200)
     },
  }

}


const personalCartHandler ={
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
        currentUserReturn:null,
      }
    },
    mounted(){
      setTimeout(()=>{
        this.fetchCart()
      },200)
      

    },
    computed:{
      currentInCartFiltered:function(){
        // const InCartISBN = this.cartData.filter(ele=>ele.status_request=="inCart")
        //                                     .map(b=>b.ISBN)
        // if(this.currentUserAllBook!=null)
        // this.currentUserInCart = this.currentUserAllBook.filter(b=>InCartISBN.includes(b.ISBN))
        // return this.currentUserInCart
        if(this.currentUserAllBook!=null)
        this.currentUserInCart = this.currentUserAllBook.filter(ele=>ele.status_request=="inCart")
        return this.currentUserInCart
      } ,
      currentPendingFiltered:function(){
        // const PendingISBN = this.cartData.filter(ele=>ele.status_request=="pending")
        //                                     .map(b=>b.ISBN)
        if(this.currentUserAllBook!=null)
        this.currentUserPending = this.currentUserAllBook.filter(ele=>ele.status_request=="pending")
        return this.currentUserPending
      } ,
      currentDenyFiltered:function(){
        // const DenyISBN = this.cartData.filter(ele=>ele.status_request=="deny")
        //                                     .map(b=>b.ISBN)
        if(this.currentUserAllBook!=null)
        this.currentUserDeny = this.currentUserAllBook.filter(ele=>ele.status_request=="deny")
        return this.currentUserDeny
      } ,
      currentApproveFiltered:function(){
        // const ApproveISBN = this.cartData.filter(ele=>ele.status_request=="approve")
        //                                     .map(b=>b.ISBN)
        if(this.currentUserAllBook!=null)
        this.currentUserApprove = this.currentUserAllBook.filter(ele=>ele.status_request=="approve")
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
        
                    setTimeout(()=>{
                      this.fetchCart()
                    },200)
                    
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
          const filtered = data.filter((ele) => ele.ISBN == ISBN && 
          (ele.status_request=="inCart" || ele.status_request=="pending" || ele.status_request=="approve"));
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

export { AddToCartHandler,personalCartHandler ,bookHandler ,allCartHandler , personalHistoryHandler};
