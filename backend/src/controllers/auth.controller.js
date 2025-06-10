import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import appConfig from '../config/app.config.js';

// Register a new user
export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        console.time('bcryptHash');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.timeEnd('bcryptHash');

        const newUser = new User({ username, email, password: hashedPassword });
        
        console.time('userSave');
        await newUser.save();
        console.timeEnd('userSave');

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Registration error:", error); // Log the actual error

        if (error.code === 11000) { // MongoDB duplicate key error
            let field = Object.keys(error.keyValue)[0];
            const displayField = field.charAt(0).toUpperCase() + field.slice(1);
            return res.status(409).json({ 
                message: `${displayField} already exists. Please choose a different ${field.toLowerCase()}.`,
                errorType: 'DuplicateKey',
                field: field.toLowerCase()
            });
        }

        if (error.name === 'ValidationError') {
            const validationErrors = {};
            for (const fieldKey in error.errors) {
                validationErrors[fieldKey] = error.errors[fieldKey].message;
            }
            return res.status(400).json({
                message: 'Validation failed. Please check the data you provided.',
                errorType: 'ValidationError',
                errors: validationErrors
            });
        }
        
        // For other errors, send a generic message
        res.status(500).json({ 
            message: 'Error registering user. An unexpected error occurred on our end. Please try again later.',
            errorType: 'InternalServerError',
            // For debugging in development, you might want to include more details:
            // detail: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Login user
export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, appConfig.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// Middleware to authenticate user
export const authenticate = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Token is not valid, authorization denied.' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid, authorization denied.' });
    }
};