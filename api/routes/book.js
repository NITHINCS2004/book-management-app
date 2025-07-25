const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const verifyToken = require('../middleware/verifyToken');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Local disk storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// ✅ Upload Book (create)
router.post('/', verifyToken, upload.single('bookFile'), async (req, res) => {
  try {
    const { title, author } = req.body;
    if (!req.file) return res.status(400).json({ error: 'File upload failed' });

    const fileUrl = `/uploads/${req.file.filename}`;
    const newBook = new Book({ title, author, fileUrl });
    await newBook.save();

    res.status(201).json(newBook);
  } catch (err) {
    console.error('UPLOAD ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get All Books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete Book (also delete file)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    const filePath = path.join(__dirname, '..', book.fileUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // delete file

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
