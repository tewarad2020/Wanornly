<template>
  <div>
    <br>
    <br>
    <br>
    <button @click="ShowAddBook">Add book</button>
    <button @click="ShowEditBook">Edit book</button>
    
    <div v-if="isShowAdd">
        <AddBook></AddBook>
    </div>
    <div v-if="isShowEdit">
        <EditBook :bookProp="testBookProp"></EditBook>
    </div>
    
    
  </div>
</template>



<script>
import AddBook from './AddBook.vue';
import EditBook from './EditBook.vue';


export default {
    name:"bookManager",
    components:{
        AddBook,
        EditBook,
       
    },
    data(){
       return{
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
    methods:{
        ShowAddBook(){
            this.isShowAdd = true;
            this.isShowEdit = false;
        },
        ShowEditBook(){
            this.isShowAdd = false;
            this.isShowEdit = true;
        },
    }
}
</script>

<style>

</style>