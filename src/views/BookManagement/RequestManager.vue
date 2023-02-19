<template>
    <div class="rm_page">
        <h1>Request Management</h1>
        <div class="rm_ctn" v-for="(item,ind) in currentPendingFiltered" :key="ind">
            <p>{{ item.ISBN }}</p>
            <p>{{ item.name }}</p>
            <p>{{ item.user_id }}</p>
            <p>{{ item.status_request }}</p>
            <p>{{ item.time_request }}</p>
            <button @click="ApproveCheck(item.user_id,item.ISBN)">approve</button>
            <button @click="DenyPerform(item.user_id,item.ISBN)">deny</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { bookHandler } from '@/mixins/MixinFunction';

export default {
    name:"requestManager",
    mixins:[bookHandler],
    data(){
        return{
            allRequest:[{
                user_id:"",
                ISBN:0,
                time_item:null,
                status_request:"inCart",
                time_request:null
        }],
            requestBody :{
                user_id:"",
                ISBN:0,
                time_item:null,
                status_request:"inCart",
                time_request:null
        },
        allRequestBook:null,


        }
    },
    mounted(){
        this.fetchAllRequest()
    },
    computed:{
        currentPendingFiltered:function(){
        if(this.allRequestBook!=null && this.allRequest!=null)
        {
            const PendingPair = this.allRequest.filter(ele=>ele.status_request=="pending")
                                            .map(b=>{return{user_id:b.user_id,ISBN:b.ISBN}})

            let pendingRequestBook =  this.allRequestBook.filter(b=>{
               const findResult =  PendingPair.filter(pair=>pair.user_id==b.user_id && pair.ISBN==b.ISBN)
                if(findResult.length!=0){ //found 
                    return true
                }
                    return false
            })
            
            pendingRequestBook = pendingRequestBook.sort((a,b)=>{
                if(a.ISBN-b.ISBN!=0) return a.ISBN-b.ISBN
                else{ //same isbn then compare date
                    if(new Date(a.time_request).getTime()<new Date(b.time_request).getTime()) return -1
                    else return 1
                }
            })
            return pendingRequestBook
        }
             
        return null
      } ,
    },
    methods:{
    async updateRequestStatus(user_id,ISBN,newStatus){

     let [newReq] = this.allRequest.filter(r=>r.ISBN==ISBN&&r.user_id==user_id)
        newReq = {
            ...newReq,
            time_item:new Date(), //time approve, deny
            status_request:newStatus
        }
      console.log(newReq)
      
      await axios.put(`http://localhost:3000/carts/${user_id}-${ISBN}`,newReq)
                     .then(()=>{console.log(`update status item :${ISBN} form cart of ${user_id}`)})
    
     this.fetchAllRequest()
    },
        async ApproveCheck(user_id,ISBN){
            this.getBookInfo(ISBN)
            if(this.BookInfo.amount<=0){ // book amount is 0
                alert("this book amount is not sufficient")
            }
            else{ //book amount is sufficient
                this.BookInfo ={
                    ...this.BookInfo,
                    amount:this.BookInfo.amount-1
                } //decrease amount 
                this.updateBook()
                this.ApprovePerform(user_id,ISBN)
            }
        },
        async ApprovePerform(user_id,ISBN){
            await this.updateRequestStatus(user_id,ISBN,"approve")
            alert(`approve this book from ${user_id} book ISBN:${ISBN}`)
        },
        async DenyPerform(user_id,ISBN){
            await this.updateRequestStatus(user_id,ISBN,"deny")
            alert(`deny this book from ${user_id} book ISBN:${ISBN}`)
        },
        async fetchAllRequest(){
            await axios.get('http://localhost:3000/carts')
                            .then(res=>res.data)
                                .then(data=>{
                                    console.log(data)
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
        
        })
        },
    }

}
</script>

<style>
    @import '../../assets/css/requestManager.css';
</style>