import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoDBStorage } from '../server/db/mongodb-storage';
import { fetchAndCacheYouTubeVideos } from '../server/scheduled-youtube-fetch';
import { getRedisClient, closeRedisConnection } from '../server/config/redis-config';

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnv = path.resolve(__dirname, '../../.env');
const backendEnv = path.resolve(__dirname, '../.env');

dotenv.config({ path: rootEnv });
dotenv.config({ path: backendEnv, override: true });

async function main() {
    console.log('🚀 Triggering manual YouTube fetch...');

    try {
        // Ensure Redis is connected
        const redis = getRedisClient();
        if (!redis) {
            throw new Error('Redis client not available');
        }

        if (redis.status !== 'ready') {
            console.log('⏳ Waiting for Redis connection...');
            await new Promise((resolve) => {
                redis.once('ready', resolve);
                redis.once('error', (err) => console.error('Redis error:', err));
            });
            console.log('✅ Redis connected');
        }

        const storage = new MongoDBStorage();
        // We don't need to connect to MongoDB for this specific operation 
        // as we are only using the Redis-based saveYouTubeCache method

        await fetchAndCacheYouTubeVideos(storage);

        console.log('✅ Manual fetch completed');
    } catch (error) {
        console.error('❌ Manual fetch failed:', error);
    } finally {
        await closeRedisConnection();
        process.exit(0);
    }
}

main();
