const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const verifyToken = require('../middleware/verifyToken');

const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Configure Cloudinary Storage with Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'book-files',
    resource_type: 'auto',
    allowed_formats: ['pdf', 'epub', 'docx'],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`
  }
});

const upload = multer({ storage });

/* 
====================
    API ROUTES
====================
*/

// ✅ GET all books
router.get('/', verifyToken, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST a new book with file upload
router.post('/', verifyToken, upload.single('bookFile'), async (req, res) => {
  try {
    const { title, author } = req.body;
    const fileUrl = req.file?.path || '';

    const newBook = new Book({ title, author, fileUrl });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT update a book (can replace file too)
router.put('/:id', verifyToken, upload.single('bookFile'), async (req, res) => {
  try {
    const { title, author } = req.body;
    const updateData = { title, author };

    if (req.file) {
      updateData.fileUrl = req.file.path;
    }

    const updated = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE a book
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
