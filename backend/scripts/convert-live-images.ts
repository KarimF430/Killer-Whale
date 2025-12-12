import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface LiveImage {
  url: string;
  type: 'hero' | 'gallery' | 'feature' | 'space' | 'storage' | 'color' | 'logo';
  modelId?: string;
  brandId?: string;
}

interface ConversionResult {
  originalPath: string;
  webpPath: string;
  originalSize: number;
  webpSize: number;
  compressionRatio: number;
  success: boolean;
  error?: string;
  imageType: string;
}

/**
 * Convert only images that are currently live on model and variant pages
 */
class LiveImageConverter {
  private mongoUrl: string;
  private uploadsDir: string;
  private results: ConversionResult[] = [];
  private liveImages: LiveImage[] = [];

  constructor() {
    this.mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/gadizone';
    this.uploadsDir = path.join(__dirname, '../../uploads');
  }

  /**
   * Extract image URLs from model data
   */
  private extractImageUrls(model: any): LiveImage[] {
    const images: LiveImage[] = [];

    // Hero image
    if (model.heroImage) {
      images.push({
        url: model.heroImage,
        type: 'hero',
        modelId: model._id?.toString()
      });
    }

    // Gallery images
    if (Array.isArray(model.galleryImages)) {
      model.galleryImages.forEach((img: any) => {
        if (img.url) {
          images.push({
            url: img.url,
            type: 'gallery',
            modelId: model._id?.toString()
          });
        }
      });
    }

    // Key feature images
    if (Array.isArray(model.keyFeatureImages)) {
      model.keyFeatureImages.forEach((img: any) => {
        if (img.url) {
          images.push({
            url: img.url,
            type: 'feature',
            modelId: model._id?.toString()
          });
        }
      });
    }

    // Space & comfort images
    if (Array.isArray(model.spaceComfortImages)) {
      model.spaceComfortImages.forEach((img: any) => {
        if (img.url) {
          images.push({
            url: img.url,
            type: 'space',
            modelId: model._id?.toString()
          });
        }
      });
    }

    // Storage & convenience images
    if (Array.isArray(model.storageConvenienceImages)) {
      model.storageConvenienceImages.forEach((img: any) => {
        if (img.url) {
          images.push({
            url: img.url,
            type: 'storage',
            modelId: model._id?.toString()
          });
        }
      });
    }

    // Color images
    if (Array.isArray(model.colorImages)) {
      model.colorImages.forEach((img: any) => {
        if (img.url) {
          images.push({
            url: img.url,
            type: 'color',
            modelId: model._id?.toString()
          });
        }
      });
    }

    return images;
  }

  /**
   * Get all live images from database
   */
  private async getLiveImages(): Promise<LiveImage[]> {
    const client = new MongoClient(this.mongoUrl);
    const images: LiveImage[] = [];

    try {
      await client.connect();
      const db = client.db();

      console.log('🔍 Scanning database for live images...');

      // Get all models
      const models = await db.collection('models').find({}).toArray();
      console.log(`📊 Found ${models.length} models in database`);

      for (const model of models) {
        const modelImages = this.extractImageUrls(model);
        images.push(...modelImages);
      }

      // Get brand logos
      const brands = await db.collection('brands').find({}).toArray();
      console.log(`📊 Found ${brands.length} brands in database`);

      for (const brand of brands) {
        if (brand.logo) {
          images.push({
            url: brand.logo,
            type: 'logo',
            brandId: brand._id?.toString()
          });
        }
      }

      console.log(`✅ Found ${images.length} live images in database`);
      return images;

    } catch (error) {
      console.error('❌ Error connecting to database:', error);
      throw error;
    } finally {
      await client.close();
    }
  }

  /**
   * Convert URL to file path
   */
  private urlToFilePath(url: string): string | null {
    // Remove /uploads/ prefix and get filename
    const filename = url.replace(/^\/uploads\//, '');
    if (!filename || filename === url) {
      return null;
    }
    return path.join(this.uploadsDir, filename);
  }

  /**
   * Convert single image to WebP
   */
  private async convertImage(
    filePath: string, 
    imageType: string,
    quality: number = 80
  ): Promise<ConversionResult> {
    const result: ConversionResult = {
      originalPath: filePath,
      webpPath: '',
      originalSize: 0,
      webpSize: 0,
      compressionRatio: 0,
      success: false,
      imageType
    };

    try {
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        result.error = 'File not found';
        return result;
      }

      // Get original file size
      const originalStats = await fs.stat(filePath);
      result.originalSize = originalStats.size;

      // Parse file path
      const parsedPath = path.parse(filePath);
      const webpPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);
      result.webpPath = webpPath;

      // Check if WebP already exists
      try {
        await fs.access(webpPath);
        console.log(`     ⏭️  WebP already exists, skipping...`);
        const webpStats = await fs.stat(webpPath);
        result.webpSize = webpStats.size;
        result.compressionRatio = ((result.originalSize - result.webpSize) / result.originalSize) * 100;
        result.success = true;
        return result;
      } catch {
        // WebP doesn't exist, proceed with conversion
      }

      // Get image metadata
      const image = sharp(filePath);
      const metadata = await image.metadata();

      console.log(`     📸 Converting: ${parsedPath.base}`);
      console.log(`        Size: ${metadata.width}x${metadata.height}, ${(result.originalSize / 1024).toFixed(1)}KB`);

      // Convert to WebP with appropriate settings based on image type
      const webpOptions = this.getWebPOptions(imageType, quality);
      
      await image
        .webp(webpOptions)
        .toFile(webpPath);

      // Get WebP file size
      const webpStats = await fs.stat(webpPath);
      result.webpSize = webpStats.size;
      result.compressionRatio = ((result.originalSize - result.webpSize) / result.originalSize) * 100;

      console.log(`        ✅ WebP: ${(result.webpSize / 1024).toFixed(1)}KB (${result.compressionRatio.toFixed(1)}% ${result.compressionRatio > 0 ? 'smaller' : 'larger'})`);

      result.success = true;
      return result;

    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Unknown error';
      console.error(`        ❌ Error: ${result.error}`);
      return result;
    }
  }

  /**
   * Get WebP options based on image type
   */
  private getWebPOptions(imageType: string, baseQuality: number) {
    const qualityMap = {
      'logo': 90,
      'hero': 85,
      'gallery': 80,
      'feature': 80,
      'space': 75,
      'storage': 75,
      'color': 80
    };

    const quality = qualityMap[imageType as keyof typeof qualityMap] || baseQuality;

    return {
      quality,
      effort: 6
    };
  }

  /**
   * Convert all live images
   */
  async convertLiveImages(options: {
    dryRun?: boolean;
    removeOriginals?: boolean;
  } = {}): Promise<void> {
    const { dryRun = false, removeOriginals = false } = options;

    console.log('\n🚀 Starting live image conversion to WebP...');
    console.log(`📁 Uploads directory: ${this.uploadsDir}`);
    console.log(`🔍 Dry run: ${dryRun ? 'Yes' : 'No'}`);
    console.log(`🗑️  Remove originals: ${removeOriginals ? 'Yes' : 'No'}\n`);

    // Get live images from database
    this.liveImages = await this.getLiveImages();

    if (this.liveImages.length === 0) {
      console.log('✅ No live images found!');
      return;
    }

    // Group by image type for better reporting
    const imagesByType = this.liveImages.reduce((acc, img) => {
      acc[img.type] = (acc[img.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n📊 Live images by type:');
    Object.entries(imagesByType).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} images`);
    });
    console.log('');

    // Convert each live image
    let processed = 0;
    let converted = 0;
    let skipped = 0;
    let failed = 0;
    let totalOriginalSize = 0;
    let totalWebpSize = 0;

    for (const liveImage of this.liveImages) {
      processed++;
      console.log(`\n[${processed}/${this.liveImages.length}] Processing: ${liveImage.type} image`);
      console.log(`   URL: ${liveImage.url}`);

      const filePath = this.urlToFilePath(liveImage.url);
      if (!filePath) {
        console.log('   ❌ Invalid URL format, skipping...');
        failed++;
        continue;
      }

      if (dryRun) {
        console.log('   🔍 [DRY RUN] Would convert this image');
        continue;
      }

      const result = await this.convertImage(filePath, liveImage.type);
      this.results.push(result);

      if (result.success) {
        if (result.compressionRatio === 0) {
          skipped++;
        } else {
          converted++;
          totalOriginalSize += result.originalSize;
          totalWebpSize += result.webpSize;

          // Remove original if requested
          if (removeOriginals && result.originalSize > 0) {
            try {
              await fs.unlink(result.originalPath);
              console.log(`        🗑️  Original file removed`);
            } catch (error) {
              console.error(`        ⚠️  Failed to remove original: ${error}`);
            }
          }
        }
      } else {
        failed++;
      }
    }

    // Print summary
    const totalSaved = totalOriginalSize - totalWebpSize;
    const averageCompression = totalOriginalSize > 0 
      ? (totalSaved / totalOriginalSize) * 100 
      : 0;

    console.log('\n' + '='.repeat(60));
    console.log('📊 LIVE IMAGE CONVERSION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total live images:     ${this.liveImages.length}`);
    console.log(`Successfully converted: ${converted}`);
    console.log(`Already existed:       ${skipped}`);
    console.log(`Failed:                ${failed}`);
    console.log('');
    console.log(`Original total size:   ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`WebP total size:       ${(totalWebpSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Space saved:           ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Average compression:   ${averageCompression.toFixed(1)}%`);
    console.log('='.repeat(60));
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  
  const dryRun = args.includes('--dry-run');
  const removeOriginals = args.includes('--remove-originals');

  const converter = new LiveImageConverter();
  
  try {
    await converter.convertLiveImages({
      dryRun,
      removeOriginals
    });

    console.log('\n✅ Live image conversion complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Conversion failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { LiveImageConverter };
