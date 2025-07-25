const express = require('express');
const multer = require('multer');
const router = express.Router();
const Book = require('../models/Book');
const verifyToken = require('../middleware/verifyToken');

// Multer memory storage for buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST: Upload book with image
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { title, author } = req.body;
    if (!req.file || !title || !author) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newBook = new Book({
      title,
      author,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await newBook.save();
    res.status(201).json({ message: 'Book saved' });
  } catch (err) {
    console.error('Error uploading book:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET: All books
router.get('/', verifyToken, async (req, res) => {
  try {
    const books = await Book.find();
    const booksWithImage = books.map(book => ({
      _id: book._id,
      title: book.title,
      author: book.author,
      image: book.image?.data
        ? `data:${book.image.contentType};base64,${book.image.data.toString('base64')}`
        : null,
    }));
    res.status(200).json(booksWithImage);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});

// DELETE: Remove a book
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Book deleted', deleted });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting book' });
  }
});

module.exports = router;
