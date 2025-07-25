const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  image: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model('Book', bookSchema);
