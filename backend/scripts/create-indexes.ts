/**
 * Database Index Creation Script
 * Run this to ensure all indexes are created for optimal performance
 * 
 * Usage: tsx backend/scripts/create-indexes.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Brand, Model, Variant, AdminUser, PopularComparison } from '../server/db/schemas';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/motoroctane';

async function createIndexes() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📊 Creating indexes for optimal performance...\n');

    // Brand Indexes
    console.log('Creating Brand indexes...');
    await Brand.createIndexes();
    console.log('✅ Brand indexes created');

    // Model Indexes  
    console.log('Creating Model indexes...');
    await Model.createIndexes();
    console.log('✅ Model indexes created');

    // Variant Indexes
    console.log('Creating Variant indexes...');
    await Variant.createIndexes();
    console.log('✅ Variant indexes created');

    // AdminUser Indexes
    console.log('Creating AdminUser indexes...');
    await AdminUser.createIndexes();
    console.log('✅ AdminUser indexes created');

    // PopularComparison Indexes
    console.log('Creating PopularComparison indexes...');
    await PopularComparison.createIndexes();
    console.log('✅ PopularComparison indexes created');

    // List all indexes
    console.log('\n📋 Listing all indexes:\n');
    
    const brandIndexes = await Brand.collection.getIndexes();
    console.log('Brand indexes:', Object.keys(brandIndexes));
    
    const modelIndexes = await Model.collection.getIndexes();
    console.log('Model indexes:', Object.keys(modelIndexes));
    
    const variantIndexes = await Variant.collection.getIndexes();
    console.log('Variant indexes:', Object.keys(variantIndexes));
    
    const adminUserIndexes = await AdminUser.collection.getIndexes();
    console.log('AdminUser indexes:', Object.keys(adminUserIndexes));
    
    const popularComparisonIndexes = await PopularComparison.collection.getIndexes();
    console.log('PopularComparison indexes:', Object.keys(popularComparisonIndexes));

    console.log('\n✅ All indexes created successfully!');
    console.log('🚀 Database is now optimized for 1M+ users\n');

  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
createIndexes();
