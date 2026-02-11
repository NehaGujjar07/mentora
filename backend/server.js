const express = require('express');
const dotenv = require('dotenv');

// Load env vars immediately
dotenv.config();
console.log("JWT_SECRET Loaded in server.js:", !!process.env.JWT_SECRET);

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Mentora API is running...');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/interview', require('./routes/interviewRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
