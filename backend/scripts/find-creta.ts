
import mongoose from 'mongoose';
import { Model } from '../server/db/schemas';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PROD_URI = process.env.MONGODB_URI || (() => {
    throw new Error('MONGODB_URI environment variable is required');
})();

async function findCreta() {
    console.log('🔍 Searching for "Creta"...');

    await mongoose.connect(PROD_URI);

    const cretas = await Model.find({ name: 'Creta' }).lean();

    console.log(`\nFound ${cretas.length} Creta model(s):`);
    cretas.forEach(m => {
        console.log('------------------------------------------------');
        console.log(`Name: ${m.name}`);
        console.log(`_id:  ${m._id}`);
        console.log(`id:   ${m.id}`);
    });

    process.exit(0);
}

findCreta().catch(console.error);
