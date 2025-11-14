#!/usr/bin/env node

/**
 * Upload Issue Diagnostic Script
 * Diagnoses why uploaded images are not persisting
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('🔍 UPLOAD ISSUE DIAGNOSTIC\n');

// Check R2 Configuration
console.log('📋 R2 Configuration Check:');
const r2Config = {
  'R2_BUCKET': process.env.R2_BUCKET,
  'R2_ACCOUNT_ID': process.env.R2_ACCOUNT_ID,
  'R2_ACCESS_KEY_ID': process.env.R2_ACCESS_KEY_ID ? '✓ Set' : '❌ Missing',
  'R2_SECRET_ACCESS_KEY': process.env.R2_SECRET_ACCESS_KEY ? '✓ Set' : '❌ Missing',
  'R2_ENDPOINT': process.env.R2_ENDPOINT || 'Not set (will use default)',
  'R2_PUBLIC_BASE_URL': process.env.R2_PUBLIC_BASE_URL || 'Not set',
  'R2_REGION': process.env.R2_REGION || 'auto (default)'
};

for (const [key, value] of Object.entries(r2Config)) {
  console.log(`   ${key}: ${value}`);
}

console.log('\n📁 Local Upload Directory Check:');
const uploadDir = path.join(__dirname, '../uploads');
try {
  const stats = fs.statSync(uploadDir);
  console.log(`   ✓ Upload directory exists: ${uploadDir}`);
  
  const files = fs.readdirSync(uploadDir);
  console.log(`   📄 Files in upload directory: ${files.length}`);
  
  if (files.length > 0) {
    console.log('   Recent files:');
    files.slice(0, 5).forEach(file => {
      const filePath = path.join(uploadDir, file);
      const stat = fs.statSync(filePath);
      console.log(`     - ${file} (${(stat.size / 1024).toFixed(1)}KB, ${stat.mtime.toISOString()})`);
    });
  }
} catch (error) {
  console.log(`   ❌ Upload directory issue: ${error.message}`);
}

console.log('\n🔧 Issue Analysis:');

// Check if R2 is properly configured
const r2Issues = [];
if (!process.env.R2_BUCKET) r2Issues.push('R2_BUCKET not set');
if (!process.env.R2_ACCOUNT_ID) r2Issues.push('R2_ACCOUNT_ID not set');
if (!process.env.R2_ACCESS_KEY_ID) r2Issues.push('R2_ACCESS_KEY_ID not set');
if (!process.env.R2_SECRET_ACCESS_KEY) r2Issues.push('R2_SECRET_ACCESS_KEY not set');

if (r2Issues.length > 0) {
  console.log('❌ R2 Configuration Issues:');
  r2Issues.forEach(issue => console.log(`   - ${issue}`));
  console.log('\n💡 SOLUTION: Configure R2 credentials in your .env file');
  console.log('   This will ensure images are stored permanently in cloud storage');
} else {
  console.log('✅ R2 Configuration appears complete');
  console.log('   Images should be uploading to R2 cloud storage');
}

console.log('\n🎯 Root Cause Analysis:');

if (r2Issues.length > 0) {
  console.log('🔴 PRIMARY ISSUE: R2 Not Configured');
  console.log('   - Images are being stored locally on server');
  console.log('   - Local files get wiped on deployment/restart');
  console.log('   - Frontend shows broken images after restart');
  console.log('');
  console.log('📋 IMMEDIATE FIX NEEDED:');
  console.log('   1. Add R2 credentials to .env file');
  console.log('   2. Test R2 connection');
  console.log('   3. Re-upload images to store in R2');
} else {
  console.log('🟡 POSSIBLE ISSUES:');
  console.log('   1. R2 credentials might be incorrect');
  console.log('   2. R2 bucket permissions might be wrong');
  console.log('   3. Network connectivity to R2 might be failing');
  console.log('');
  console.log('📋 DEBUGGING STEPS:');
  console.log('   1. Check server logs for R2 upload errors');
  console.log('   2. Test R2 connection manually');
  console.log('   3. Verify bucket permissions');
}

console.log('\n🚀 RECOMMENDED ACTIONS:');
console.log('1. Configure R2 credentials (if missing)');
console.log('2. Test R2 connection: npm run test:r2');
console.log('3. Re-upload images through admin panel');
console.log('4. Verify images persist after server restart');

console.log('\n✅ Diagnostic complete!');
