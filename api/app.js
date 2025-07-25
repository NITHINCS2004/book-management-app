const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // ADD THIS when auth.js is present

const app = express();

app.use(cors({
  origin: 'https://book-management-app-iupm.vercel.app',
  credentials: true
}));

app.use(express.json());

// ✅ Mount API routes
app.use('/api/auth', authRoutes); // POST /api/auth/register, /api/auth/login

module.exports = app;
