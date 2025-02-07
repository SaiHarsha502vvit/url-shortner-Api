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
import cors from 'cors'
dotenv.config();
const app = express();
app.set('trust proxy', 1);
const PORT = appConfig.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // If using cookies or authorization headers
  }));
  
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});