const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const verifyToken = require('../middleware/verifyToken');

// GET all books
router.get('/', verifyToken, async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// POST a new book
router.post('/', verifyToken, async (req, res) => {
  const newBook = new Book(req.body);
  await newBook.save();
  res.json(newBook);
});

// PUT update a book
router.put('/:id', verifyToken, async (req, res) => {
  const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE a book
router.delete('/:id', verifyToken, async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: 'Book deleted' });
});

module.exports = router;
