const express = require('express')
const router = express.Router()
// const multer = require('multer')
// const path = require('path')
// const fs = require('fs')
const Book = require('../models/book')
const Author = require('../models/author')
// const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
// Configure "multer" in order to be used with our project
// const upload = multer({
//     dest: uploadPath,
//     fileFilter: (req, file, callback) => {
//         callback(null, imageMimeTypes.includes(file.mimetype))
//     }
// })

// All Books Route
router.get('/', async (req, res) => {
    // Use "let" instead of "const" because we reassign the "query" variable
    let query = Book.find()
    if (req.query.title != null && req.query.title != '') {
        // 'title' is Book.title from the database
        // 'i' stands for "insensitive", meaning "not case sensitive"
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }     
})

// New Book Route (for displaying the Form)
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

// Create Book Route (for actually creating a new Book)
// upload.single('cover') is necessary only when we use "multer" library
// router.post('/', upload.single('cover'), async (req, res) => {
router.post('/', async (req, res) => {
    // const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        // coverImageName: fileName,
        description: req.body.description
    })

    saveCover(book, req.body.cover)

    try {
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect(`books`)
    } catch {
        // We no longer need this section, since the Cover 
        // will be stored into the database, not on the server anymore
        // if (book.coverImageName != null) {
        //     removeBookCover(book.coverImageName)
        // }
        renderNewPage(res, book, true)
    }
})

// We no longer need this function, since the Cover 
// will be stored into the database, not on the server anymore 
// function removeBookCover(fileName) {
//     fs.unlink(path.join(uploadPath, fileName), err => {
//         if (err) console.error(err)
//     })
// }

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMessage = 'Error Creating Book'
        res.render('books/new', params)
    } catch {
        res.redirect('/books')
    }
}

// coverEncoded is the JSON object representation of the cover
// sent from the client (browser) in the body of the request
function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

module.exports = router