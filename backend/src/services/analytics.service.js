import Url from '../models/url.model.js';

const getAnalyticsData = async (shortId) => {
    try {
        const urlData = await Url.findOne({ shortId });
        if (!urlData) {
            throw new Error('URL not found');
        }
        return {
            originalUrl: urlData.originalUrl,
            shortId: urlData.shortId,
            clickHistory: urlData.clickHistory,
            totalClicks: urlData.clickHistory.length,
        };
    } catch (error) {
        throw new Error(`Error retrieving analytics data: ${error.message}`);
    }
};

const getAllAnalytics = async () => {
    try {
        const urls = await Url.find({});
        return urls.map(url => ({
            originalUrl: url.originalUrl,
            shortId: url.shortId,
            totalClicks: url.clickHistory.length,
        }));
    } catch (error) {
        throw new Error(`Error retrieving all analytics data: ${error.message}`);
    }
};

export { getAnalyticsData, getAllAnalytics };