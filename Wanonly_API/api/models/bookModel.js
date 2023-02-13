const { text } = require('body-parser');
const { Int32 } = require('bson');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const bookSchema = new Schema(
    {
        ISBN: {
            type: Number,
            required: 'ISBN cannot be blank'
        },
        name: {
            type: String,
            required: 'name cannot be blank'
        },
        author: {
            type: String,
            required: 'author cannot be blank'
        },
        categoryID: {
            type: Number,
            required: 'categoryID cannot be blank'
        },
        book_description: {
            type: String,
            required: 'book_description cannot be blank'
        },
        image: {
            type: String,
            required: 'image cannot be blank'
        },
        publisher: {
            type: String,
            required: 'publisher cannot be blank'
        },
        file_book: {
            type: String
        },
        amount: {
            type: Number,
            required: 'amount cannot be blank'
        }
    },
    { collection: 'book' }
)

module.exports = mongoose.model('book', bookSchema)