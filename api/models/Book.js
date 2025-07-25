const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  imageData: String, // base64 string
});

module.exports = mongoose.model('Book', bookSchema);
