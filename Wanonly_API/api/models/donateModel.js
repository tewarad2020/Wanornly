const mongoose = require('mongoose');

const { Schema } = mongoose;

const donateSchema = new Schema(
    {
        username:{
            type: String,  
            required: 'username cannot be blank'
        },
        name: {
            type: String,  
            required: 'book name cannot be blank'
        },
        description: {
            type: String
        },
        imgURL: {
            type: String
        },
        fileName: {
            type: String,
            required:''
        },
        time_sent: {   //time when donate request was sent
            type: Date
        },
        time_approved: { //time when donate request was approved
            type: Date,
        }

    },
    { collection: 'donate_request' }
)

module.exports = mongoose.model('donate', donateSchema)