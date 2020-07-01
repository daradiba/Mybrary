const mongoose = require('mongoose')
const Book = require('./book')

// Create Schema for Author
// In NoSQL systems, a Schema is similar to a Table in normal SQL systems
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

// Add a constraint: before ("pre") running the "remove" method, run a function
// having as parameter the callback "next", which will prevent deleting 
// an author that still has books associated
authorSchema.pre('remove', function(next) {
    Book.find({author: this.id}, (err, books) => {
        if (err) {
            next(err)
        } else if (books.length > 0) {
            next(new Error('This author has books still'))
        } else {
            next()
        }
    })
})

// Export the Schema as a Model
// 'Author' is the name of the "Table"
module.exports = mongoose.model('Author', authorSchema)