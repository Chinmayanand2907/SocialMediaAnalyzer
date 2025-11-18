const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();

const connectDB = require('./config/db');
const youtubeRoutes = require('./routes/youtubeRoutes');

if (!process.env.YOUTUBE_API_KEY) {
  console.error('Missing YOUTUBE_API_KEY in environment variables.');
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error('Missing MONGO_URI in environment variables.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Database
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*', optionsSuccessStatus: 200 }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Routes
app.use('/api', youtubeRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'YouTube Engagement Analyzer API' });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Server error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

