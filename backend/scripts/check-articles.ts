import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/motoroctane';

async function checkArticles() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const NewsArticle = mongoose.model('NewsArticle', new mongoose.Schema({}, { strict: false }));

        const total = await NewsArticle.countDocuments();
        const published = await NewsArticle.countDocuments({ status: 'published' });
        const draft = await NewsArticle.countDocuments({ status: 'draft' });

        console.log(`\n📊 Article Statistics:`);
        console.log(`   Total: ${total}`);
        console.log(`   Published: ${published}`);
        console.log(`   Draft: ${draft}`);

        // Get sample article
        const sample = await NewsArticle.findOne().lean();
        console.log(`\n📄 Sample Article:`);
        console.log(`   Title: ${sample?.title}`);
        console.log(`   Status: ${sample?.status}`);
        console.log(`   Publish Date: ${sample?.publishDate}`);

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkArticles();
