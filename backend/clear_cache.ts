import { invalidateRedisCache } from './server/middleware/redis-cache';
import * as dotenv from 'dotenv';

dotenv.config();

async function clearCache() {
    try {
        console.log('🗑️ Clearing upcoming cars cache...');

        // Clear all upcoming cars cache entries
        await invalidateRedisCache('v2:upcoming-cars');

        console.log('✅ Cache cleared successfully!');
        console.log('');
        console.log('Please refresh the admin panel now.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to clear cache:', error);
        process.exit(1);
    }
}

clearCache();
