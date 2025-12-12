import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Brand, Model, Variant } from '../server/db/schemas.ts';

// Load environment variables
dotenv.config({ path: './.env' });

const OLD_BASE = 'https://68f29b8a9b7761d61a0c03abb5e11db0.r2.cloudflarestorage.com/killerwhale/';
const NEW_BASE_URL = process.env.R2_PUBLIC_BASE_URL || 'https://pub-a4a4bb84fc2d41cba103f4e2a8b5d185.r2.dev';
const NEW_BASE = NEW_BASE_URL.endsWith('/') ? NEW_BASE_URL : NEW_BASE_URL + '/';

console.log('🔧 Logo URL Repair Script');
console.log(`📤 Old base: ${OLD_BASE}`);
console.log(`📥 New base: ${NEW_BASE}`);

async function testUrlAccessibility(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function fixBrandLogos() {
  console.log('\n1. 🏷️  Fixing Brand Logos...');
  const brands = await Brand.find({
    logo: { $regex: '^https://68f29b8a9b7761d61a0c03abb5e11db0\\.r2\\.cloudflarestorage\\.com/killerwhale/' }
  });
  
  console.log(`   Found ${brands.length} brands with old R2 URLs`);
  
  let fixed = 0, failed = 0;
  
  for (const brand of brands) {
    const oldUrl = brand.logo;
    const newUrl = oldUrl.replace(OLD_BASE, NEW_BASE);
    
    console.log(`   Testing: ${brand.name}`);
    console.log(`     Old: ${oldUrl}`);
    console.log(`     New: ${newUrl}`);
    
    // Test if new URL is accessible
    const accessible = await testUrlAccessibility(newUrl);
    if (accessible) {
      brand.logo = newUrl;
      await brand.save();
      console.log(`     ✅ Fixed and saved`);
      fixed++;
    } else {
      console.log(`     ❌ New URL not accessible, skipping`);
      failed++;
    }
  }
  
  return { fixed, failed, total: brands.length };
}

async function fixModelImages() {
  console.log('\n2. 🚗 Fixing Model Images...');
  const models = await Model.find({
    $or: [
      { heroImage: { $regex: '^https://68f29b8a9b7761d61a0c03abb5e11db0\\.r2\\.cloudflarestorage\\.com/killerwhale/' } },
      { 'galleryImages.url': { $regex: '^https://68f29b8a9b7761d61a0c03abb5e11db0\\.r2\\.cloudflarestorage\\.com/killerwhale/' } }
    ]
  });
  
  console.log(`   Found ${models.length} models with old R2 URLs`);
  
  let fixed = 0, failed = 0;
  
  for (const model of models) {
    let modelUpdated = false;
    
    // Fix heroImage
    if (model.heroImage && model.heroImage.includes(OLD_BASE)) {
      const oldUrl = model.heroImage;
      const newUrl = oldUrl.replace(OLD_BASE, NEW_BASE);
      
      const accessible = await testUrlAccessibility(newUrl);
      if (accessible) {
        model.heroImage = newUrl;
        modelUpdated = true;
        console.log(`   ✅ Fixed hero image for ${model.name}`);
      } else {
        console.log(`   ❌ Hero image not accessible for ${model.name}`);
      }
    }
    
    // Fix galleryImages
    if (model.galleryImages && Array.isArray(model.galleryImages)) {
      for (const img of model.galleryImages) {
        if (img.url && img.url.includes(OLD_BASE)) {
          const oldUrl = img.url;
          const newUrl = oldUrl.replace(OLD_BASE, NEW_BASE);
          
          const accessible = await testUrlAccessibility(newUrl);
          if (accessible) {
            img.url = newUrl;
            modelUpdated = true;
            console.log(`   ✅ Fixed gallery image for ${model.name}`);
          } else {
            console.log(`   ❌ Gallery image not accessible for ${model.name}`);
          }
        }
      }
    }
    
    if (modelUpdated) {
      await model.save();
      fixed++;
    } else {
      failed++;
    }
  }
  
  return { fixed, failed, total: models.length };
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const apply = process.argv.includes('--apply');
  
  if (!dryRun && !apply) {
    console.log('\n❓ Usage:');
    console.log('   node scripts/fix-logo-urls.js --dry-run   # Test what would be changed');
    console.log('   node scripts/fix-logo-urls.js --apply     # Actually make the changes');
    process.exit(1);
  }
  
  if (dryRun) {
    console.log('\n🔍 DRY RUN MODE - No changes will be made\n');
  } else {
    console.log('\n✍️  APPLY MODE - Changes will be saved to database\n');
  }
  
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gadizone';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    if (dryRun) {
      // In dry run, just count what would be changed
      const brandCount = await Brand.countDocuments({
        logo: { $regex: '^https://68f29b8a9b7761d61a0c03abb5e11db0\\.r2\\.cloudflarestorage\\.com/killerwhale/' }
      });
      
      const modelCount = await Model.countDocuments({
        $or: [
          { heroImage: { $regex: '^https://68f29b8a9b7761d61a0c03abb5e11db0\\.r2\\.cloudflarestorage\\.com/killerwhale/' } },
          { 'galleryImages.url': { $regex: '^https://68f29b8a9b7761d61a0c03abb5e11db0\\.r2\\.cloudflarestorage\\.com/killerwhale/' } }
        ]
      });
      
      console.log(`\n📊 DRY RUN RESULTS:`);
      console.log(`   ${brandCount} brands would be updated`);
      console.log(`   ${modelCount} models would be updated`);
      console.log(`\nRun with --apply to make these changes.`);
    } else {
      // Actually fix the URLs
      const brandResults = await fixBrandLogos();
      const modelResults = await fixModelImages();
      
      console.log(`\n📊 REPAIR COMPLETE:`);
      console.log(`   Brands: ${brandResults.fixed} fixed, ${brandResults.failed} failed, ${brandResults.total} total`);
      console.log(`   Models: ${modelResults.fixed} fixed, ${modelResults.failed} failed, ${modelResults.total} total`);
      
      const totalFixed = brandResults.fixed + modelResults.fixed;
      const totalFailed = brandResults.failed + modelResults.failed;
      
      if (totalFixed > 0) {
        console.log(`\n✅ Successfully repaired ${totalFixed} image URLs`);
      }
      if (totalFailed > 0) {
        console.log(`\n⚠️  ${totalFailed} URLs could not be repaired (images not accessible at new location)`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

main().catch(console.error);
