/*const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // ADD THIS when auth.js is present
const bookRoutes = require('./routes/book');

const app = express();

app.use(cors({ origin: 'https://book-management-app-iupm.vercel.app', credentials: true }));


app.use(express.json());

// Mount API routes
app.use('/api/auth', authRoutes); // POST /api/auth/register, /api/auth/login
app.use('/api/books', bookRoutes);


module.exports = app;
*/
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const app = express();

// Middlewares
app.use(cors({ origin: 'https://book-management-app-iupm.vercel.app', credentials: true }));


app.use(express.json());
app.use('/api/auth', authRoutes);
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Book routes
const bookRoutes = require('./routes/book');
app.use('/api/books', bookRoutes);

module.exports = app;
