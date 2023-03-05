const { text } = require('body-parser');
const { Int32 } = require('bson');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const cartSchema = new Schema(
    {
        user_id: {
            type: String,  //gmail is user_id
            required: 'user_id cannot be blank'
        },
        ISBN: {
            type: Number,
            required: 'ISBN cannot be blank'
        },
        time_resolved: {   //time addToCart, approve,deny, and when user returned 
            type: Date
        },
        status_request: {
            type: String,
            required: 'status_request cannot be blank'
        },
        time_return_limit: { //time limit when borrowing  //time_request(old)
            type: Date,
        }
    },
    { collection: 'cart' }
)

module.exports = mongoose.model('cart', cartSchema)