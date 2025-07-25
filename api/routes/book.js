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
const Book = require('../models/Book');
const verifyToken = require('../middleware/verifyToken');

const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// ✅ Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Setup Cloudinary Storage for Multer
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

// 🔽 GET all books
router.get('/', verifyToken, async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// 🔽 POST a new book with file (Cloudinary URL stored)
router.post('/', verifyToken, upload.single('bookFile'), async (req, res) => {
  const { title, author } = req.body;
  const fileUrl = req.file?.path || '';

  const newBook = new Book({ title, author, fileUrl });
  await newBook.save();
  res.json(newBook);
});

// 🔽 PUT to replace a book file and/or details
router.put('/:id', verifyToken, upload.single('bookFile'), async (req, res) => {
  const { title, author } = req.body;
  const updateData = { title, author };

  if (req.file) {
    updateData.fileUrl = req.file.path;
  }

  const updated = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(updated);
});

// 🔽 DELETE a book
router.delete('/:id', verifyToken, async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: 'Book deleted' });
});

module.exports = router;
