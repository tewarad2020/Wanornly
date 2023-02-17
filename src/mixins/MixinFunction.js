import axios from "axios"
export default{
    data(){
        return{
    reqCart:{
      user_id:"",
      ISBN:0,
      time_item:new Date(),
      request_book:1,
      status_request:"inCart",
      time_request:"0/0/0"
    },
        }
    },
    methods:{
        CheckAddToCart(ISBN,userID){
            this.CheckDuplicate(ISBN,userID)
        },
        async CheckDuplicate(ISBN,userID){
            await axios.get(`http://localhost:3000/carts/${userID}`)
                        .then(res=>res.data)
                          .then(data=>{
                            const filtered = data.filter(ele=>ele.ISBN===ISBN)
                            console.log(filtered)
                            if(filtered.length!==0){  //already have same book in cart
                                this.DuplicateHandle()
                                console.log("book is already in cart")
                            }
                            else{
                              this.AddToCart(ISBN,userID)
                            }
                          })
          },
          async AddToCart(ISBN,userID){
            this.reqCart ={
              ...this.reqCart,
              user_id:userID,
              ISBN:ISBN,
              time_item:new Date(),
            }
            console.log(this.reqCart)
             await axios.put(`http://localhost:3000/carts`,this.reqCart)  
             .then(response => console.log(response))
              .catch(error => console.log(error))          
          },
          DuplicateHandle(){
            alert("This book is already in cart")
          },
    }
}