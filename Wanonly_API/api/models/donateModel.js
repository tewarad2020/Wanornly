const mongoose = require('mongoose');

const { Schema } = mongoose;

const donateSchema = new Schema(
    {
        username:{
            type: String,  
            required: 'username cannot be blank'
        },
        ISBN: {
            type: String
        },
        name: {
            type: String,  
            required: 'book name cannot be blank'
        },
        category: {
            type: String
        },
        book_description: {
            type: String
        },
        author: {
            type: String
        },
        publisher: {
            type: String
        },
        image: {
            type: String
        },
        status: {
            type: String,
            require: ''
        },
        realFileName: {
            type: String,
            required:''
        },
        fileName: {
            type: String,
            required:''
        },
        time_sent: {   //time when donate request was sent
            type: Date
        },
        time_resolved: { //time when donate request was approved
            type: Date,
        }

    },
    { collection: 'donate_request' }
)

module.exports = mongoose.model('donate', donateSchema)