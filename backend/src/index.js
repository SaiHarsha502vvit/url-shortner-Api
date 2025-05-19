import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import appConfig from './config/app.config.js';
import urlRoutes from './routes/url.routes.js';
import authRoutes from './routes/auth.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import rateLimiter from './middlewares/rateLimiter.middleware.js';
import { authenticate } from './controllers/auth.controller.js';
import connectToDatabase from './config/db.config.js';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();
const app = express();

// for testing purpose
app.set('trust proxy', 1);
const PORT = appConfig.PORT || 5000;

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (
      /^https?:\/\/localhost:\d+$/.test(origin) ||
      origin === "https://urlshortner.alasaiharsha.me"
    ) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(helmet());
app.use(express.json());
app.use(rateLimiter);

app.get('/', (req, res) => {
    res.send('Welcome to the URL Shortener API');
});
app.use('/api/urls', urlRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analytics', authenticate, analyticsRoutes);

// Connect to database then start server
connectToDatabase();

// Centralized error handler (should be after all routes)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
    // Do not expose stack in production
  });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});