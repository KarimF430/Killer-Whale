
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-website';

async function createIndexes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    // Brands Indexes
    console.log('\n🔨 Creating indexes for brands...');
    const brands = db.collection('brands');
    await brands.createIndexes([
      { key: { id: 1 }, unique: true, background: true },
      { key: { status: 1, ranking: 1 }, background: true },
      { key: { name: 1 }, background: true }
    ]);
    console.log('✅ Brands indexes created');

    // Models Indexes
    console.log('\n🔨 Creating indexes for models...');
    const models = db.collection('models');
    await models.createIndexes([
      { key: { id: 1 }, unique: true, background: true },
      { key: { brandId: 1, status: 1 }, background: true },
      { key: { name: 1 }, background: true },
      { key: { isPopular: 1, popularRank: 1 }, background: true },
      { key: { isNew: 1, newRank: 1 }, background: true },
      { key: { bodyType: 1, status: 1 }, background: true }
    ]);
    console.log('✅ Models indexes created');

    // Variants Indexes
    console.log('\n🔨 Creating indexes for variants...');
    const variants = db.collection('variants');
    await variants.createIndexes([
      { key: { id: 1 }, unique: true, background: true },
      { key: { modelId: 1, brandId: 1, status: 1 }, background: true },
      { key: { brandId: 1, status: 1, price: 1 }, background: true },
      { key: { price: 1, fuelType: 1, transmission: 1 }, background: true },
      { key: { isValueForMoney: 1, status: 1 }, background: true },
      { key: { fuelType: 1, status: 1 }, background: true },
      { key: { transmission: 1, status: 1 }, background: true },
      { key: { createdAt: -1 }, background: true },
      { key: { price: 1, status: 1 }, background: true }
    ]);
    console.log('✅ Variants indexes created');

  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected');
  }
}

createIndexes();
