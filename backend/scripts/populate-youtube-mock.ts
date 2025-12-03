import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoDBStorage } from '../server/db/mongodb-storage';
import { getRedisClient, closeRedisConnection } from '../server/config/redis-config';

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnv = path.resolve(__dirname, '../../.env');
const backendEnv = path.resolve(__dirname, '../.env');

dotenv.config({ path: rootEnv });
dotenv.config({ path: backendEnv, override: true });

async function main() {
    console.log('🚀 Populating Redis with realistic YouTube data...');

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
                // Also resolve on error to avoid hanging, though main try/catch handles it
                redis.once('error', (err) => console.error('Redis error:', err));
            });
            console.log('✅ Redis connected');
        }

        const storage = new MongoDBStorage();

        // Realistic data for MotorOctane
        const mockData = {
            featuredVideo: {
                id: "VideoID_1",
                title: "New Mahindra BE 6 vs Tata Curvv EV - The Ultimate EV SUV Battle!",
                thumbnail: "https://img.youtube.com/vi/VideoID_1/maxresdefault.jpg",
                duration: "18:45",
                views: "250K",
                likes: "15K",
                publishedAt: "1 day ago",
                channelName: "MotorOctane"
            },
            relatedVideos: [
                {
                    id: "VideoID_2",
                    title: "Toyota Fortuner 2025 Facelift - What's New?",
                    thumbnail: "https://img.youtube.com/vi/VideoID_2/maxresdefault.jpg",
                    duration: "12:30",
                    views: "180K",
                    likes: "12K",
                    publishedAt: "3 days ago",
                    channelName: "MotorOctane"
                },
                {
                    id: "VideoID_3",
                    title: "Maruti Suzuki Dzire 2024 Review - Best Sedan Under 10 Lakhs?",
                    thumbnail: "https://img.youtube.com/vi/VideoID_3/maxresdefault.jpg",
                    duration: "14:15",
                    views: "320K",
                    likes: "20K",
                    publishedAt: "1 week ago",
                    channelName: "MotorOctane"
                },
                {
                    id: "VideoID_4",
                    title: "Honda Amaze 2025 - First Look & Walkaround",
                    thumbnail: "https://img.youtube.com/vi/VideoID_4/maxresdefault.jpg",
                    duration: "08:50",
                    views: "150K",
                    likes: "8K",
                    publishedAt: "2 weeks ago",
                    channelName: "MotorOctane"
                }
            ]
        };

        // Save to Redis with current timestamp
        await storage.saveYouTubeCache(mockData, Date.now());

        console.log('✅ Redis populated with realistic data');
    } catch (error) {
        console.error('❌ Failed to populate Redis:', error);
    } finally {
        await closeRedisConnection();
        process.exit(0);
    }
}

main();
