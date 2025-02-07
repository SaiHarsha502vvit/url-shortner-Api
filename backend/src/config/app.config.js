import dotenv from 'dotenv';
dotenv.config();

const appConfig = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    MONGODB_URI: process.env.DATABASE_URI || 'mongodb://localhost:27017/url_shortener',
    RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || '1m',
    RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || 100,
    CACHE_TTL: process.env.CACHE_TTL || 3600, // Time to live for cache in seconds
};

export default appConfig;