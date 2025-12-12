import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gadizone';

async function checkTagNames() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const NewsTag = mongoose.model('NewsTag', new mongoose.Schema({}, { strict: false }));

        const tags = await NewsTag.find().lean();

        console.log('\n🏷️  All Tags:');
        tags.forEach((tag: any) => {
            console.log(`ID: ${tag._id} | Name: ${tag.name} | Type: ${tag.type}`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkTagNames();
