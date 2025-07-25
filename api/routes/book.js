const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const verifyToken = require('../middleware/verifyToken');

const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Storage Setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'books',
    resource_type: 'raw', // ✅ needed for PDF
    allowed_formats: ['pdf'],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`
  }
});

const upload = multer({ storage });

/* === ROUTES === */

// ✅ POST: Upload Book (PDF only)
router.post('/', verifyToken, upload.single('bookFile'), async (req, res) => {
  try {
    const { title, author } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: 'File upload failed' });
    }

    const fileUrl = req.file.path;

    const newBook = new Book({ title, author, fileUrl });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    console.error('UPLOAD ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});
