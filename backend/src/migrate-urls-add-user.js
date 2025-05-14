// Migration script to remove all Url documents without a user field
// Usage: node src/scripts/migrate-urls-add-user.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Url from './models/url.model.js';
import appConfig from './config/app.config.js';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

async function migrate() {
  try {
    await mongoose.connect(appConfig.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Find URLs without a user field
    const orphanedUrls = await Url.find({ $or: [ { user: { $exists: false } }, { user: null } ] });
    console.log(`Found ${orphanedUrls.length} orphaned URLs.`);

    if (orphanedUrls.length > 0) {
      console.log(`Found ${orphanedUrls.length} orphaned URLs. Printing and removing them...`);
      for (const url of orphanedUrls) {
        console.log('Orphaned URL:', url);
        await url.deleteOne(); // Remove the orphaned URL
      }
      console.log('All orphaned URLs removed. Migration complete.');
    } else {
      console.log('No orphaned URLs found.');
    }
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
