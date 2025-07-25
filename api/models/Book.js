const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  fileUrl: String
});

module.exports = mongoose.model('Book', bookSchema);
