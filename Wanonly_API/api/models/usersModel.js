const { text } = require('body-parser');
const { Int32 } = require('bson');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const usersSchema = new Schema(
    {
        id: {
            type: String,  //gmail is user_id
            required: 'id cannot be blank'
        },
        username:{
            type:String,
            required: 'username cannot be blank'
        },
        role:{
            type:String,
            default: "customer"
        },
        change_name:{
            type:String
        },
        change_image:{
            type:String
        },
    },
    { collection: 'users' }
)

module.exports = mongoose.model('users', usersSchema)