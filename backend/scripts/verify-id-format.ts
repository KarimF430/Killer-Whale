
import mongoose from 'mongoose';
import { MongoDBStorage } from '../server/db/mongodb-storage';
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

async function verifyIds() {
    console.log('🔍 Verifying ID format...');

    const storage = new MongoDBStorage();
    await storage.connect(PROD_URI);

    // Fetch one model
    const models = await storage.getModels();
    if (models.length > 0) {
        const model = models[0];
        console.log('\n✅ Sample Model:');
        console.log(`   Name: ${model.name}`);
        console.log(`   ID:   ${model.id}`);

        if (model.id.includes('model-brand-')) {
            console.log('\n🎉 SUCCESS: ID is a Slug!');
        } else {
            console.log('\n❌ FAILURE: ID is NOT a Slug (likely an ObjectId).');
        }
    } else {
        console.log('❌ No models found.');
    }

    // Fetch one variant
    const variants = await storage.getVariants();
    if (variants.length > 0) {
        const variant = variants[0];
        console.log('\n✅ Sample Variant:');
        console.log(`   Name: ${variant.name}`);
        console.log(`   ID:   ${variant.id}`);

        if (variant.id.includes('variant-')) { // Assuming variant IDs start with variant- or similar pattern? 
            // Actually variant IDs usually follow model pattern or are just slugs. 
            // Let's just check if it looks like an ObjectId (24 hex chars)
            const isObjectId = /^[0-9a-fA-F]{24}$/.test(variant.id);
            if (!isObjectId) {
                console.log('\n🎉 SUCCESS: Variant ID is a Slug!');
            } else {
                console.log('\n❌ FAILURE: Variant ID is an ObjectId.');
            }
        }
    }

    process.exit(0);
}

verifyIds().catch(console.error);
