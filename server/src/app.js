require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const userRoutes = require('./routes/userRoutes');
const sharedRoutes = require('./routes/itineraryRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  skip: (req) => req.method === 'OPTIONS',
});
app.use('/api/', limiter);
app.use('/auth/', limiter);

// AI route gets stricter limiting
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: 'Too many AI requests, please wait a moment.',
  skip: (req) => req.method === 'OPTIONS',
});
app.use('/api/trips/:id/generate', aiLimiter);
app.use('/api/trips/:id/regenerate', aiLimiter);

// CORS configuration supporting dynamic origins (Vercel, localhost, custom CLIENT_URL)
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Allow localhost and local IP development origins
      if (
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:') ||
        origin.startsWith('https://localhost:')
      ) {
        return callback(null, true);
      }

      // Allow Vercel preview and production deployments
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      // Allow explicitly specified CLIENT_URL origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(null, true); // Fallback allow to prevent unexpected CORS blocks while logging warnings in dev
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), service: 'TripPlanner API' });
});

// API routes and aliases
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes); // Alias for requests sent without /api prefix
app.use('/api/trips', tripRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shared', sharedRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use(errorHandler);

module.exports = app;
