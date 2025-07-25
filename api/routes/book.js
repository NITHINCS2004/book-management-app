/*const express = require('express');
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
*/

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Book = require('../models/Book');
const verifyToken = require('../middleware/verifyToken');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// GET all books
router.get('/', verifyToken, async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// POST a new book with file
router.post('/', verifyToken, upload.single('bookFile'), async (req, res) => {
  const { title, author } = req.body;
  const fileUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : '';

  const newBook = new Book({ title, author, fileUrl });
  await newBook.save();
  res.json(newBook);
});

// PUT to replace a book file and info
router.put('/:id', verifyToken, upload.single('bookFile'), async (req, res) => {
  const { title, author } = req.body;
  const updateData = { title, author };

  if (req.file) {
    updateData.fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }

  const updated = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(updated);
});

// DELETE a book
router.delete('/:id', verifyToken, async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: 'Book deleted' });
});

module.exports = router;
