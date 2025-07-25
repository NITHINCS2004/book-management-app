const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // example
const bookRoutes = require('./routes/bookRoutes'); // example

const app = express();
app.use(cors({ origin: 'https://your-frontend.vercel.app', credentials: true }));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;
