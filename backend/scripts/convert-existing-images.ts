import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ConversionResult {
  originalPath: string;
  webpPath: string;
  originalSize: number;
  webpSize: number;
  compressionRatio: number;
  success: boolean;
  error?: string;
}

interface ConversionStats {
  totalFiles: number;
  converted: number;
  failed: number;
  skipped: number;
  totalOriginalSize: number;
  totalWebpSize: number;
  totalSaved: number;
  averageCompression: number;
}

/**
 * Convert existing uploaded images to WebP format
 */
class ExistingImageConverter {
  private uploadsDir: string;
  private results: ConversionResult[] = [];
  private stats: ConversionStats = {
    totalFiles: 0,
    converted: 0,
    failed: 0,
    skipped: 0,
    totalOriginalSize: 0,
    totalWebpSize: 0,
    totalSaved: 0,
    averageCompression: 0
  };

  constructor(uploadsDir?: string) {
    this.uploadsDir = uploadsDir || path.join(__dirname, '../../uploads');
  }

  /**
   * Check if file is an image
   */
  private isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif'];
    const ext = path.extname(filename).toLowerCase();
    return imageExtensions.includes(ext);
  }

  /**
   * Check if WebP version already exists
   */
  private async webpExists(filePath: string): Promise<boolean> {
    const parsedPath = path.parse(filePath);
    const webpPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);
    
    try {
      await fs.access(webpPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Convert single image to WebP
   */
  private async convertImage(filePath: string, quality: number = 80): Promise<ConversionResult> {
    const result: ConversionResult = {
      originalPath: filePath,
      webpPath: '',
      originalSize: 0,
      webpSize: 0,
      compressionRatio: 0,
      success: false
    };

    try {
      // Get original file size
      const originalStats = await fs.stat(filePath);
      result.originalSize = originalStats.size;

      // Parse file path
      const parsedPath = path.parse(filePath);
      const webpPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);
      result.webpPath = webpPath;

      // Get image metadata
      const image = sharp(filePath);
      const metadata = await image.metadata();

      console.log(`  📸 Converting: ${parsedPath.base}`);
      console.log(`     Size: ${metadata.width}x${metadata.height}, ${(result.originalSize / 1024).toFixed(1)}KB`);

      // Convert to WebP
      await image
        .webp({ 
          quality,
          effort: 6
        })
        .toFile(webpPath);

      // Get WebP file size
      const webpStats = await fs.stat(webpPath);
      result.webpSize = webpStats.size;
      result.compressionRatio = ((result.originalSize - result.webpSize) / result.originalSize) * 100;

      console.log(`     ✅ WebP: ${(result.webpSize / 1024).toFixed(1)}KB (${result.compressionRatio.toFixed(1)}% smaller)`);

      result.success = true;
      return result;

    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Unknown error';
      console.error(`     ❌ Error: ${result.error}`);
      return result;
    }
  }

  /**
   * Scan directory recursively for images
   */
  private async scanDirectory(dir: string): Promise<string[]> {
    const imagePaths: string[] = [];

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          const subImages = await this.scanDirectory(fullPath);
          imagePaths.push(...subImages);
        } else if (entry.isFile() && this.isImageFile(entry.name)) {
          // Check if it's not already a WebP file
          if (path.extname(entry.name).toLowerCase() !== '.webp') {
            imagePaths.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error);
    }

    return imagePaths;
  }

  /**
   * Convert all images in uploads directory
   */
  async convertAll(options: {
    quality?: number;
    removeOriginals?: boolean;
    dryRun?: boolean;
  } = {}): Promise<ConversionStats> {
    const { quality = 80, removeOriginals = false, dryRun = false } = options;

    console.log('\n🚀 Starting bulk image conversion to WebP...');
    console.log(`📁 Uploads directory: ${this.uploadsDir}`);
    console.log(`⚙️  Quality: ${quality}%`);
    console.log(`🗑️  Remove originals: ${removeOriginals ? 'Yes' : 'No'}`);
    console.log(`🔍 Dry run: ${dryRun ? 'Yes' : 'No'}\n`);

    // Check if uploads directory exists
    try {
      await fs.access(this.uploadsDir);
    } catch {
      console.error(`❌ Uploads directory not found: ${this.uploadsDir}`);
      return this.stats;
    }

    // Scan for all images
    console.log('🔍 Scanning for images...');
    const imagePaths = await this.scanDirectory(this.uploadsDir);
    this.stats.totalFiles = imagePaths.length;

    console.log(`📊 Found ${imagePaths.length} image(s) to process\n`);

    if (imagePaths.length === 0) {
      console.log('✅ No images to convert!');
      return this.stats;
    }

    // Process each image
    for (let i = 0; i < imagePaths.length; i++) {
      const imagePath = imagePaths[i];
      console.log(`\n[${i + 1}/${imagePaths.length}] Processing: ${path.basename(imagePath)}`);

      // Check if WebP already exists
      const webpAlreadyExists = await this.webpExists(imagePath);
      if (webpAlreadyExists) {
        console.log('  ⏭️  WebP version already exists, skipping...');
        this.stats.skipped++;
        continue;
      }

      if (dryRun) {
        console.log('  🔍 [DRY RUN] Would convert this image');
        continue;
      }

      // Convert image
      const result = await this.convertImage(imagePath, quality);
      this.results.push(result);

      if (result.success) {
        this.stats.converted++;
        this.stats.totalOriginalSize += result.originalSize;
        this.stats.totalWebpSize += result.webpSize;

        // Remove original if requested
        if (removeOriginals) {
          try {
            await fs.unlink(imagePath);
            console.log(`     🗑️  Original file removed`);
          } catch (error) {
            console.error(`     ⚠️  Failed to remove original: ${error}`);
          }
        }
      } else {
        this.stats.failed++;
      }
    }

    // Calculate final stats
    this.stats.totalSaved = this.stats.totalOriginalSize - this.stats.totalWebpSize;
    this.stats.averageCompression = this.stats.totalOriginalSize > 0
      ? (this.stats.totalSaved / this.stats.totalOriginalSize) * 100
      : 0;

    // Print summary
    this.printSummary();

    return this.stats;
  }

  /**
   * Print conversion summary
   */
  private printSummary(): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 CONVERSION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total files found:     ${this.stats.totalFiles}`);
    console.log(`Successfully converted: ${this.stats.converted}`);
    console.log(`Already existed:       ${this.stats.skipped}`);
    console.log(`Failed:                ${this.stats.failed}`);
    console.log('');
    console.log(`Original total size:   ${(this.stats.totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`WebP total size:       ${(this.stats.totalWebpSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Space saved:           ${(this.stats.totalSaved / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Average compression:   ${this.stats.averageCompression.toFixed(1)}%`);
    console.log('='.repeat(60));
  }

  /**
   * Get conversion results
   */
  getResults(): ConversionResult[] {
    return this.results;
  }

  /**
   * Get conversion statistics
   */
  getStats(): ConversionStats {
    return this.stats;
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  const quality = parseInt(args.find(arg => arg.startsWith('--quality='))?.split('=')[1] || '80');
  const removeOriginals = args.includes('--remove-originals');
  const dryRun = args.includes('--dry-run');
  const uploadsDir = args.find(arg => arg.startsWith('--dir='))?.split('=')[1];

  const converter = new ExistingImageConverter(uploadsDir);
  
  try {
    await converter.convertAll({
      quality,
      removeOriginals,
      dryRun
    });

    console.log('\n✅ Conversion complete!');
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

export { ExistingImageConverter };
export type { ConversionResult, ConversionStats };
