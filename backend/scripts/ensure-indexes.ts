import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || '';

async function ensureIndexes() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;
        if (!db) throw new Error('Database connection not established');

        // Get all collections
        const collections = ['brands', 'models', 'variants'];

        for (const collectionName of collections) {
            console.log(`\n📊 Checking indexes for ${collectionName}...`);

            const collection = db.collection(collectionName);
            const existingIndexes = await collection.indexes();

            console.log(`Current indexes for ${collectionName}:`);
            existingIndexes.forEach((index: any) => {
                console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
            });

            // Create indexes based on collection
            console.log(`\n🔨 Creating/updating indexes for ${collectionName}...`);

            if (collectionName === 'brands') {
                await collection.createIndex({ id: 1 }, { unique: true, name: 'id_unique' });
                await collection.createIndex({ status: 1, ranking: 1 }, { name: 'status_ranking' });
                await collection.createIndex({ name: 1 }, { name: 'name_index' });
            } else if (collectionName === 'models') {
                await collection.createIndex({ id: 1 }, { unique: true, name: 'id_unique' });
                await collection.createIndex({ brandId: 1, status: 1 }, { name: 'brandId_status' });
                await collection.createIndex({ name: 1 }, { name: 'name_index' });
                await collection.createIndex({ isPopular: 1, popularRank: 1 }, { name: 'popular_rank' });
                await collection.createIndex({ isNew: 1, newRank: 1 }, { name: 'new_rank' });
                await collection.createIndex({ bodyType: 1, status: 1 }, { name: 'bodyType_status' });
            } else if (collectionName === 'variants') {
                await collection.createIndex({ id: 1 }, { unique: true, name: 'id_unique' });
                await collection.createIndex({ modelId: 1, brandId: 1, status: 1 }, { name: 'modelId_brandId_status' });
                await collection.createIndex({ brandId: 1, status: 1, price: 1 }, { name: 'brandId_status_price' });
                await collection.createIndex({ price: 1, fuelType: 1, transmission: 1 }, { name: 'price_fuel_trans' });
                await collection.createIndex({ price: 1, status: 1 }, { name: 'price_status' });
                await collection.createIndex({ modelId: 1 }, { name: 'modelId_index' }); // Critical for aggregation
            }

            console.log(`✅ Indexes created/updated for ${collectionName}`);
        }

        // Verify final state
        console.log('\n\n📋 Final Index Summary:');
        for (const collectionName of collections) {
            const collection = db.collection(collectionName);
            const indexes = await collection.indexes();
            console.log(`\n${collectionName} (${indexes.length} indexes):`);
            indexes.forEach((index: any) => {
                console.log(`  ✓ ${index.name}`);
            });
        }

        console.log('\n✅ All indexes verified and created successfully!');

    } catch (error) {
        console.error('❌ Error ensuring indexes:', error);
        throw error;
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

ensureIndexes()
    .then(() => {
        console.log('\n🎉 Index creation complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Failed to create indexes:', error);
        process.exit(1);
    });
