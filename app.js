require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const authMiddleware = require('./middlewares/auth');

const app = express();

// Database connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// View engine
app.set('view engine', 'ejs');
app.set('views', './views');
require('dotenv').config({
    path: './.env',
})

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/profile', authMiddleware, require('./routes/profileRoutes'));

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));