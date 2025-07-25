const express = require('express');
const router = express.Router();
const multer = require('multer');
const Book = require('../models/Book');
const verifyToken = require('../middleware/verifyToken');

// Multer setup (memory storage for MongoDB)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📌 Upload book with image buffer
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  try {
    console.log('Incoming data:', req.body);
    console.log('Uploaded file:', req.file);

    const { title, author } = req.body;
    if (!title || !author || !req.file) {
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
    res.status(201).json(newBook);
  } catch (err) {
    console.error('Error uploading book:', err); // 👈 this line will help
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 📌 Get all books
router.get('/', verifyToken, async (req, res) => {
  try {
    const books = await Book.find();
    const booksWithImage = books.map(book => ({
      _id: book._id,
      title: book.title,
      author: book.author,
      image: `data:${book.image.contentType};base64,${book.image.data.toString('base64')}`,
    }));
    res.status(200).json(booksWithImage);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});

// 📌 Delete book
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Book deleted', book });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting book' });
  }
});

module.exports = router;
