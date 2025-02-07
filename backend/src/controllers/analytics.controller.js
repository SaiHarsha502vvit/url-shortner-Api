import { getAnalyticsData, getAllAnalytics } from '../services/analytics.service.js';

// Get click statistics for a specific shortened URL
export const getClickStats = async (req, res) => {
    const { id } = req.params;

    try {
        const analytics = await getAnalyticsData(id);
        if (!analytics) {
            return res.status(404).json({ message: 'Short URL not found' });
        }
        res.status(200).json({ message: 'Analytics retrieved', data: analytics });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving analytics', error: error.message });
    }
};

// Get overall analytics data
export const getAnalytics = async (req, res) => {
    try {
        const overallData = await getAllAnalytics();
        res.status(200).json(overallData);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving overall analytics', error: error.message });
    }
};