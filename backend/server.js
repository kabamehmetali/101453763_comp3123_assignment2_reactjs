// server.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Connect to MongoDB database
connectDB();

// Initialize Express app
const app = express();

// Enable CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true,
  })
);


// Set security HTTP headers
app.use(helmet());

// Prevent Cross-Site Scripting (XSS) attacks
app.use(xss());

// Prevent HTTP Parameter Pollution attacks
app.use(hpp());

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 10 minutes',
});
app.use(limiter);

// HTTP request logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware to parse JSON bodies
app.use(express.json());

// Route files
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Serve the React frontend
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
  );
}

// Error handling middleware (optional but recommended)
// const errorHandler = require('./middleware/errorHandler');
// app.use(errorHandler);

// Set the port from environment variables or default to 6000
const PORT = process.env.PORT || 6000;

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
