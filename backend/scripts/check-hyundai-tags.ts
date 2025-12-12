import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gadizone';

async function checkHyundaiTags() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const NewsTag = mongoose.model('NewsTag', new mongoose.Schema({}, { strict: false }));

        // Find all tags with name Hyundai
        const tags = await NewsTag.find({ name: { $regex: 'Hyundai', $options: 'i' } }).lean();

        console.log('\n🏷️  Hyundai Tags found:');
        tags.forEach((tag: any) => {
            console.log(`ID (ObjectId): ${tag._id}`);
            console.log(`id (UUID): ${tag.id}`);
            console.log(`Name: ${tag.name}`);
            console.log('---');
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkHyundaiTags();
