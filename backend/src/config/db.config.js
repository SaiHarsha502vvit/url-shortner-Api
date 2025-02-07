import mongoose from 'mongoose';
import appConfig from './app.config.js';

const connectToDatabase = async () => {
    try {
        await mongoose.connect(appConfig.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('Database connection successful');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

export default connectToDatabase;