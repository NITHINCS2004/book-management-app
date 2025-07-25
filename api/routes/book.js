const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const verifyToken = require('../middleware/verifyToken');

// Create Book (Admin only)
router.post('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: 'Invalid book data' });
  }
});

// Get all books (any user)
router.get('/', verifyToken, async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// Update book (Admin only)
router.put('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Update failed' });
  }
});

// Delete book (Admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Delete failed' });
  }
});

module.exports = router;
