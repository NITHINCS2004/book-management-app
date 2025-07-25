const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book');

const app = express();

// CORS for frontend
app.use(cors({ origin: 'https://book-management-app-iupm.vercel.app', credentials: true }));

// JSON parsing
app.use(express.json());

// Create uploads folder if missing
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));
// ✅ Routes
const bookRoutes = require('./routes/books');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;
