

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


dotenv.config({ path: './.env' });


connectDB();


const app = express();


app.use(
  cors({
    origin: 'http://localhost:3000', 
    credentials: true,
  })
);



app.use(helmet());


app.use(xss());


app.use(hpp());


const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again after 10 minutes',
});
app.use(limiter);


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


app.use(express.json());


const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');


app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);


if (process.env.NODE_ENV === 'production') {
  
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
  );
}

// Error handling middleware (optional but recommended)
// const errorHandler = require('./middleware/errorHandler');
// app.use(errorHandler);


const PORT = process.env.PORT || 6000;


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
