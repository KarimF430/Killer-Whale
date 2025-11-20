
import mongoose from 'mongoose';
import { MongoDBStorage } from '../server/db/mongodb-storage';
import { Model } from '../server/db/schemas';
import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PROD_URI = 'mongodb+srv://motoroctane_user21:U2kcCNN7h5Y56Je6@cluster0.hok00oq.mongodb.net/motoroctane?retryWrites=true&w=majority&appName=Cluster0';

async function inspectData() {
    console.log('🔍 Inspecting Raw Data...');

    await mongoose.connect(PROD_URI);

    // Fetch raw documents using Mongoose model directly
    const models = await Model.find({}).limit(5).lean();

    console.log('\n📊 Raw Model Data (First 5):');
    models.forEach(m => {
        console.log('------------------------------------------------');
        console.log(`Name: ${m.name}`);
        console.log(`_id (ObjectId): ${m._id}`);
        console.log(`id (String):    ${m.id}`);

        if (m._id.toString() === m.id) {
            console.log('⚠️  WARNING: id field matches _id! This is likely the issue.');
        } else {
            console.log('✅ OK: id is different from _id.');
        }
    });

    process.exit(0);
}

inspectData().catch(console.error);
