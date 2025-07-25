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


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Routes
// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;
