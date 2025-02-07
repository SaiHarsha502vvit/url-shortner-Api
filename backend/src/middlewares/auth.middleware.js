import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { User } from '../models/user.model.js';

const verifyToken = promisify(jwt.verify);

export const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }

    try {
        const decoded = await verifyToken(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({ message: 'Token is not valid, authorization denied.' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid, authorization denied.' });
    }
};