#!/usr/bin/env node

/**
 * R2 Upload Test Script
 * Tests if R2 uploads are actually working
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('🧪 R2 UPLOAD TEST\n');

async function testR2Upload() {
  try {
    // Check configuration
    const bucket = process.env.R2_BUCKET;
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    
    if (!bucket || !accountId || !accessKeyId || !secretAccessKey) {
      console.log('❌ Missing R2 configuration');
      return false;
    }
    
    console.log('📋 Configuration:');
    console.log(`   Bucket: ${bucket}`);
    console.log(`   Account ID: ${accountId}`);
    console.log(`   Endpoint: ${process.env.R2_ENDPOINT || 'default'}`);
    console.log(`   Public Base: ${process.env.R2_PUBLIC_BASE_URL}`);
    
    // Create S3 client
    const endpoint = process.env.R2_ENDPOINT || `https://${accountId}.r2.cloudflarestorage.com`;
    const client = new S3Client({
      region: process.env.R2_REGION || 'auto',
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
    });
    
    console.log('\n🔗 Testing R2 connection...');
    
    // Create a test file
    const testContent = `Test upload from backend at ${new Date().toISOString()}`;
    const testKey = `test-uploads/backend-test-${Date.now()}.txt`;
    
    console.log(`📤 Uploading test file: ${testKey}`);
    
    // Upload test file
    const uploadCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain',
      Metadata: {
        'test': 'true',
        'uploaded-by': 'backend-diagnostic',
        'timestamp': new Date().toISOString()
      }
    });
    
    await client.send(uploadCommand);
    console.log('✅ Upload successful!');
    
    // Verify the file exists
    console.log('🔍 Verifying upload...');
    const headCommand = new HeadObjectCommand({
      Bucket: bucket,
      Key: testKey
    });
    
    const headResult = await client.send(headCommand);
    console.log('✅ File verified in R2!');
    console.log(`   Size: ${headResult.ContentLength} bytes`);
    console.log(`   Last Modified: ${headResult.LastModified}`);
    console.log(`   Content Type: ${headResult.ContentType}`);
    
    // Generate public URL
    const publicBase = process.env.R2_PUBLIC_BASE_URL;
    if (publicBase) {
      const publicUrl = `${publicBase}/${testKey}`;
      console.log(`🌐 Public URL: ${publicUrl}`);
      console.log('   You can test this URL in your browser');
    }
    
    console.log('\n✅ R2 UPLOAD TEST PASSED!');
    console.log('   R2 is working correctly');
    console.log('   The issue might be in the upload route error handling');
    
    return true;
    
  } catch (error) {
    console.log('\n❌ R2 UPLOAD TEST FAILED!');
    console.log(`   Error: ${error.message}`);
    
    if (error.name === 'CredentialsProviderError') {
      console.log('   Issue: Invalid R2 credentials');
      console.log('   Fix: Check R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY');
    } else if (error.name === 'NoSuchBucket') {
      console.log('   Issue: R2 bucket does not exist');
      console.log('   Fix: Create the bucket in Cloudflare dashboard');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log('   Issue: Network connectivity problem');
      console.log('   Fix: Check internet connection and R2 endpoint');
    } else {
      console.log('   Issue: Unknown R2 error');
      console.log('   Debug: Check R2 bucket permissions and settings');
    }
    
    return false;
  }
}

// Run the test
testR2Upload().then(success => {
  if (success) {
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Check upload route logs for specific errors');
    console.log('2. Add better error logging to upload routes');
    console.log('3. Test actual image upload through admin panel');
  } else {
    console.log('\n🔧 FIX R2 CONFIGURATION:');
    console.log('1. Verify R2 credentials in .env file');
    console.log('2. Check R2 bucket exists and has correct permissions');
    console.log('3. Test R2 connection from Cloudflare dashboard');
  }
}).catch(error => {
  console.error('Script error:', error);
});
