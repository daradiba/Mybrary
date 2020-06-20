const mongoose = require('mongoose')
const path = require('path')
const coverImageBasePath = 'uploads/bookCovers'

// Create Schema for Book
// In NoSQL systems, a Schema is similar to a Table in normal SQL systems
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
})

// Use a normal "function" instead of "arrow function" because
// we need to have acces to the "this" keyword, which is the actual Book
// We create here a "virtual property" which will derive its value from existing values
// in bookSchema - here from coverImageName
// The '/' path is the "public" folder  
bookSchema.virtual('coverImagePath').get(function() {
    if (this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

// Export the Schema as a Model
// 'Author' is the name of the "Table"
module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath
