
// backend/routes/book.js
const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const verifyToken = require('../middleware/verifyToken');

// ✅ POST: Upload book metadata
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, author, fileName } = req.body;

    if (!title || !author || !fileName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newBook = new Book({ title, author, fileUrl: fileName });
    await newBook.save();

    res.status(201).json(newBook);
  } catch (err) {
    console.error('Error uploading metadata:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ GET all books
router.get('/', verifyToken, async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});

// ✅ DELETE book by ID
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Book deleted', book });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting book' });
  }
});

module.exports = router;
