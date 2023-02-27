<template>
   <div class="bm_page">
        <h1>Borrow Management</h1>
        <div class="bm_ctn" v-for="(item,ind) in currentApproveFiltered" :key="ind">
            <p>{{ item.ISBN }}</p>
            <p>{{ item.name }}</p>
            <p>{{ item.user_id }}</p>
            <p>{{ item.status_request }}</p>
            <p>{{  new Date(item.time_return_limit).toString()  }}</p>
            <!-- <label>day borrow limit</label>
            <input type="number" v-model="dayLimit" placeholder="0"/> -->
            <button @click="ApproveCheck(item.user_id,item.ISBN)">return</button>
            <button @click="DenyPerform(item.user_id,item.ISBN)">undo</button>
        </div>
    </div>
</template>

<script>
import { cartHandler } from '../../mixins/MixinFunction'
export default {
    name:"borrowManager",
    data(){
        return{

        }
    },
    mixins:[cartHandler]

}
</script>

<style>
     @import "../../assets/css/borrowManager.css";
</style>