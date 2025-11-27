
import mongoose from 'mongoose';
import { Brand, Model, Variant } from '../server/db/schemas';
import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
// dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const LOCAL_URI = 'mongodb://localhost:27017/motoroctane';
const PROD_URI = process.env.MONGODB_URI || (() => {
    throw new Error('MONGODB_URI environment variable is required');
})();

if (!PROD_URI || PROD_URI.includes('localhost')) {
    console.error('❌ MONGODB_URI is not set to a remote production database.');
    console.error('Current URI:', PROD_URI);
    process.exit(1);
}

async function migrateData() {
    console.log('🚀 Starting migration from LOCAL to PRODUCTION...');

    // 1. READ FROM LOCAL
    console.log('\n📥 Reading data from LOCAL database...');
    await mongoose.connect(LOCAL_URI);

    const localBrands = await Brand.find({}).lean();
    const localModels = await Model.find({}).lean();
    const localVariants = await Variant.find({}).lean();

    console.log(`   Found ${localBrands.length} brands`);
    console.log(`   Found ${localModels.length} models`);
    console.log(`   Found ${localVariants.length} variants`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from LOCAL');

    // 2. WRITE TO PROD
    console.log('\n📤 Connecting to PRODUCTION database...');
    await mongoose.connect(PROD_URI);

    console.log('⚠️  WARNING: Wiping existing production data for Brands, Models, and Variants...');

    // Delete existing data
    await Brand.deleteMany({});
    await Model.deleteMany({});
    await Variant.deleteMany({});
    console.log('✅ Production collections cleared.');

    // Insert new data
    if (localBrands.length > 0) {
        console.log(`\n📝 Inserting ${localBrands.length} brands...`);
        await Brand.insertMany(localBrands);
    }

    if (localModels.length > 0) {
        console.log(`📝 Inserting ${localModels.length} models...`);
        await Model.insertMany(localModels);
    }

    if (localVariants.length > 0) {
        console.log(`📝 Inserting ${localVariants.length} variants...`);
        await Variant.insertMany(localVariants);
    }

    console.log('\n✨ Migration completed successfully!');
    console.log(`   Synced: ${localBrands.length} Brands, ${localModels.length} Models, ${localVariants.length} Variants`);

    await mongoose.disconnect();
}

migrateData().catch(console.error);
