const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

// All Authors Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {authors: authors, searchOptions: req.query})
    } catch {
        res.redirect('/')
    }
    
})

// New Author Route (for displaying the Form)
router.get('/new', (req, res) => {
    res.render('authors/new', {author: new Author()})
})

// Create Author Route (for actually creating a new Author)
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({author: author.id}).limit(6).exec()
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {author: author})
    } catch {
        res.redirect('/authors')
    }
})

router.put('/:id', async (req, res) => {
    // We declare variable "author" outside the try-catch and don't use "const" inside
    // "try" because we need to assign it a value both in "try" and in "catch" block
    let author
    try {
        // Get the Author from mongoose database by the "id" passed in "put" method
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        // Don't forget the slash in front of "authors", because this is a full URL, 
        // not a relative path
        res.redirect(`/authors/${author.id}`)
    } catch {
        if (author == null) {
            res.redirect('/')
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating Author'
            })
        }       
    }
})

router.delete('/:id', async (req, res) => {
    // We declare variable "author" outside the try-catch and don't use "const" inside
    // "try" because we need to assign it a value both in "try" and in "catch" block
    let author
    try {
        // Get the Author from mongoose database by the "id" passed in "put" method
        author = await Author.findById(req.params.id)
        // Delete the "author" from the database
        await author.remove()
        res.redirect('/authors')
    } catch {
        if (author == null) {
            res.redirect('/')
        } else {
            // Don't forget the slash in front of "authors", because this is 
            // a full URL, not a relative path
            res.redirect(`/authors/${author.id}`)
        }       
    }
})

module.exports = router