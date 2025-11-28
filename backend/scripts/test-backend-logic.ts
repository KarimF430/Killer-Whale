import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/motoroctane';

async function testBackendLogic() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const NewsTag = mongoose.model('NewsTag', new mongoose.Schema({}, { strict: false }));
        const NewsArticle = mongoose.model('NewsArticle', new mongoose.Schema({}, { strict: false }));

        // 1. Find tag by name "Hyundai"
        const tag = await NewsTag.findOne({ name: { $regex: '^Hyundai$', $options: 'i' } }).lean();

        if (!tag) {
            console.log('❌ Tag "Hyundai" not found');
            return;
        }

        console.log(`✅ Found Tag: ${tag.name} (ID: ${tag.id})`);

        // 2. Find articles with this tag ID
        const articles = await NewsArticle.find({
            tags: tag.id,
            status: 'published'
        }).limit(5).lean();

        console.log(`📰 Found ${articles.length} articles with tag ID ${tag.id}`);

        if (articles.length > 0) {
            console.log(`- First article: ${articles[0].title}`);
        } else {
            // Debug: Check one article's tags
            const oneArticle = await NewsArticle.findOne({ status: 'published' }).lean();
            console.log('Debug - Random article tags:', oneArticle?.tags);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

testBackendLogic();
