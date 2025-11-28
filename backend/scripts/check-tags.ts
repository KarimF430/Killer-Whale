import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/motoroctane';

async function checkTags() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const NewsArticle = mongoose.model('NewsArticle', new mongoose.Schema({}, { strict: false }));

        // Get a few articles to see their tags
        const articles = await NewsArticle.find({ status: 'published' }).limit(10).lean();

        console.log('\n🔍 Sample Article Tags:');
        articles.forEach((article: any) => {
            console.log(`Title: ${article.title}`);
            console.log(`Tags: ${JSON.stringify(article.tags)}`);
            console.log('---');
        });

        // Check specifically for 'hyundai'
        const hyundaiArticles = await NewsArticle.find({
            tags: { $regex: 'hyundai', $options: 'i' }
        }).countDocuments();

        console.log(`\n📊 Articles with 'hyundai' tag: ${hyundaiArticles}`);

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkTags();
