
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-website';

async function checkIndexes() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const collections = ['brands', 'models', 'variants'];

        for (const collectionName of collections) {
            const collection = mongoose.connection.collection(collectionName);
            const indexes = await collection.indexes();
            console.log(`\n📊 Indexes for ${collectionName}:`);
            indexes.forEach(idx => {
                console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
            });
        }

    } catch (error) {
        console.error('❌ Error checking indexes:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected');
    }
}

checkIndexes();
