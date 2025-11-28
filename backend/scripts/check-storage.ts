import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { newsStorage } from '../server/db/news-storage';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/motoroctane';

async function checkStorage() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Check getAllTags
        const tags = await newsStorage.getAllTags();
        const hyundaiTag = tags.find(t => t.name === 'Hyundai');

        if (hyundaiTag) {
            console.log(`✅ Found Hyundai tag via storage: ${hyundaiTag.name} (${hyundaiTag.id})`);
        } else {
            console.log('❌ Hyundai tag not found via storage');
        }

        // 2. Check getAllArticles
        const articles = await newsStorage.getAllArticles();
        console.log(`📰 Total articles via storage: ${articles.length}`);

        if (hyundaiTag) {
            const hyundaiArticles = articles.filter(a => a.tags.includes(hyundaiTag.id));
            console.log(`📊 Articles with Hyundai tag ID (${hyundaiTag.id}): ${hyundaiArticles.length}`);

            if (hyundaiArticles.length > 0) {
                console.log(`- First match: ${hyundaiArticles[0].title}`);
                console.log(`- Tags: ${JSON.stringify(hyundaiArticles[0].tags)}`);
            } else {
                // Debug: check first article tags
                if (articles.length > 0) {
                    console.log('Debug - First article tags:', articles[0].tags);
                }
            }
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkStorage();
