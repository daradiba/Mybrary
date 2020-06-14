const mongoose = require('mongoose')

// Create Schema for Author
// In NoSQL systems, a Schema is similar to a Table in normal SQL systems
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

// Export the Schema as a Model
// 'Author' is the name of the "Table"
module.exports = mongoose.model('Author', authorSchema)