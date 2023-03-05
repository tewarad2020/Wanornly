const { text } = require('body-parser');
const { Int32 } = require('bson');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const historySchema = new Schema(
    {
        user_id: {
            type: String,  //gmail is user_id
            required: 'user_id cannot be blank'
        },
        ISBN: {
            type: Number,
            required: 'ISBN cannot be blank'
        },
        time_resolved: {   //time addToCart, approve,deny
            type: Date
        },
        time_return_limit: { //time limit when borrowing  //time_request(old)
            type: Date,
        },
        time_returned:{  //time when return
            type:Date,
        }
    },
    { collection: 'history' }
)

module.exports = mongoose.model('history', historySchema)