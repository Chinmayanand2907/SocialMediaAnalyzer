const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

dotenv.config();

const connectDB = require('./config/db');
const youtubeRoutes = require('./routes/youtubeRoutes');
const authRoutes = require('./routes/authRoutes');

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

// Start server after database connection
const startServer = async () => {
  try {
    // Connect to database first
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();
    
    // Middleware
    app.use(cors({ 
      origin: process.env.CLIENT_URL || '*', 
      optionsSuccessStatus: 200,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(morgan('dev'));

    // Health check endpoint
    app.get('/health', (_req, res) => {
      res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // Routes
    app.use('/api/auth', authRoutes);
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

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📍 API endpoint: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the application
startServer();

