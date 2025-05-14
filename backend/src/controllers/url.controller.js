import URL from '../models/url.model.js';
import { nanoid } from 'nanoid';
import { hasExpired } from '../utils/expiration.util.js';
import QRCode from 'qrcode';

// Create a shortened URL with optional custom alias and expiration
export const createShortUrl = async (req, res) => {
    const { originalUrl, customAlias, expiration } = req.body;

    try {
        const existingUrl = await URL.findOne({ originalUrl, user: req.user._id });
        if (existingUrl) {
            return res.status(400).json({ message: 'URL already exists', data: existingUrl });
        }

        const shortId = customAlias || nanoid(10);
        const newUrl = new URL({
            originalUrl,
            shortId,
            expirationDate: expiration ? new Date(expiration) : null,
            clickHistory: [],
            user: req.user._id // associate with user
        });

        await newUrl.save();
        res.status(201).json({ message: 'Short URL created', data: newUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error creating short URL', error });
    }
};

// Retrieve the original URL and update click history
export const getOriginalUrl = async (req, res) => {
    const { id } = req.params;

    try {
        const urlEntry = await URL.findOne({ shortId: id });
        if (!urlEntry) {
            return res.status(404).json({ message: 'Short URL not found' });
        }

        if (urlEntry.expirationDate && hasExpired(urlEntry.expirationDate)) {
            return res.status(410).json({ message: 'Short URL has expired' });
        }

        urlEntry.clickHistory.push({ timestamp: new Date() });
        await urlEntry.save();
        res.redirect(urlEntry.originalUrl);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving original URL', error });
    }
};

// Update a shortened URL
export const updateShortUrl = async (req, res) => {
    const { id } = req.params;
    const { originalUrl, customAlias, expiration } = req.body;

    try {
        const urlEntry = await URL.findOne({ shortId: id });
        if (!urlEntry) {
            return res.status(404).json({ message: 'Short URL not found' });
        }

        // Save current state to updateHistory
        urlEntry.updateHistory = urlEntry.updateHistory || [];
        urlEntry.updateHistory.push({
            originalUrl: urlEntry.originalUrl,
            shortId: urlEntry.shortId,
            expirationDate: urlEntry.expirationDate,
            updatedAt: new Date()
        });

        // Update fields if provided
        if (originalUrl) urlEntry.originalUrl = originalUrl;
        if (customAlias) urlEntry.shortId = customAlias;
        if (expiration) {
            const expDate = new Date(expiration);
            if (isNaN(expDate.getTime())) {
                return res.status(400).json({ message: 'Invalid expiration date provided' });
            }
            urlEntry.expirationDate = expDate;
        }

        await urlEntry.save();
        res.status(200).json({ message: 'Short URL updated successfully', data: urlEntry });
    } catch (error) {
        res.status(500).json({ message: 'Error updating short URL', error });
    }
};

// Delete a shortened URL
export const deleteShortLink = async (req, res) => {
    const { id } = req.params;
    try {
        const urlEntry = await URL.findOneAndDelete({ shortId: id });
        if (!urlEntry) {
            return res.status(404).json({ message: 'Short URL not found' });
        }
        res.status(200).json({ message: 'Short URL deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting short URL', error });
    }
};

// Generate QR code for a short URL
export const getQRCode = async (req, res) => {
    const { id } = req.params;
    try {
        const urlEntry = await URL.findOne({ shortId: id });
        if (!urlEntry) {
            return res.status(404).json({ message: 'Short URL not found' });
        }
        const shortUrl = `https://url-shortner-api-backend.onrender.com/api/urls/${urlEntry.shortId}`;
        const qrDataUrl = await QRCode.toDataURL(shortUrl);
        res.status(200).json({ qrCode: qrDataUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error generating QR code', error });
    }
};

// Get all URLs for the authenticated user
export const getUserUrls = async (req, res) => {
    try {
        const urls = await URL.find({ user: req.user._id });
        res.status(200).json(urls);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user URLs', error });
    }
};