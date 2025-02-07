import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

const windowMinutes = process.env.RATE_LIMIT_WINDOW ? parseInt(process.env.RATE_LIMIT_WINDOW, 10) : 15;
const windowMs = windowMinutes * 60 * 1000;
const max = process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 100;
const message = process.env.RATE_LIMIT_MESSAGE || 'Too many requests from this IP, please try again later.';

// Debug: log rate limiter settings
console.log('Rate Limiter Settings:', windowMs, max, message);

const rateLimiter = rateLimit({
    windowMs,
    max,
    message
});

export default rateLimiter;