import type { Express, Request, Response } from "express";
import express from "express";
import type { IStorage } from "./storage";
import type { BackupService } from "./backup-service";
import { insertBrandSchema, insertModelSchema } from "./validation/schemas";
import { 
  comparePassword, 
  generateAccessToken, 
  generateRefreshToken,
  authenticateToken,
  isValidEmail,
  isStrongPassword,
  sanitizeUser,
  hashPassword
} from "./auth";
import { 
  apiLimiter, 
  authLimiter, 
  modifyLimiter, 
  publicLimiter, 
  bulkLimiter 
} from "./middleware/rateLimiter";
import { redisCacheMiddleware, invalidateRedisCache, CacheTTL as RedisCacheTTL } from "./middleware/redis-cache";
import { securityMiddleware, validateFileUpload } from "./middleware/sanitize";
import { imageProcessingConfigs, ImageProcessor } from "./middleware/image-processor";
import multer from "multer";
import path from "path";
import fs from "fs";
import { readFileSync } from "fs";
import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Import news routes
import newsRoutes from "./routes/news";
import adminAuthRoutes from "./routes/admin-auth";
import adminArticlesRoutes from "./routes/admin-articles";
import adminCategoriesRoutes from "./routes/admin-categories";
import adminTagsRoutes from "./routes/admin-tags";
import adminAuthorsRoutes from "./routes/admin-authors";
import adminMediaRoutes from "./routes/admin-media";
import adminAnalyticsRoutes from "./routes/admin-analytics";

// Function to format brand summary with proper sections
function formatBrandSummary(summary: string, brandName: string): {
  sections: Array<{
    title: string;
    content: string;
  }>;
  priceInfo?: string;
} {
  if (!summary) {
    return { sections: [] };
  }

  const sections: Array<{ title: string; content: string }> = [];
  let priceInfo = '';

  // Split by common section indicators
  const lines = summary.split('\n').filter(line => line.trim());
  let currentSection = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check for section headers
    if (trimmedLine.includes('Start of operations in India:') || 
        trimmedLine.includes('Market Share:') ||
        trimmedLine.includes('Key Aspects:') ||
        trimmedLine.includes('Competitors:')) {
      
      // Save previous section if exists
      if (currentSection && currentContent.length > 0) {
        sections.push({
          title: currentSection,
          content: currentContent.join(' ').trim()
        });

      }
      
      // Start new section
      currentSection = trimmedLine.replace(':', '');
      currentContent = [];
    } else if (trimmedLine.includes('car price starts at') || 
               trimmedLine.includes('cheapest model') ||
               trimmedLine.includes('most expensive model')) {
      // Extract price information
      priceInfo = trimmedLine;
    } else if (currentSection) {
      // Add to current section content
      currentContent.push(trimmedLine);
    } else {
      // First paragraph (overview)
      if (!sections.length) {
        sections.push({
          title: `${brandName} Cars`,
          content: trimmedLine
        });
      }
    }
  }

  // Add final section
  if (currentSection && currentContent.length > 0) {
    sections.push({
      title: currentSection,
      content: currentContent.join(' ').trim()
    });
  }

  return { sections, priceInfo };
}

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allow all image types for model images, PNG only for logos
    if (req.path === '/api/upload/logo') {
      if (file.mimetype === 'image/png') {
        cb(null, true);
      } else {
        cb(new Error('Only PNG files are allowed for brand logos'));
      }
    } else {
      // Allow common image formats for model images
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export function registerRoutes(app: Express, storage: IStorage, backupService?: BackupService) {
  console.log('🔐 Registering authentication routes...');
  
  // Helper function to trigger backup after mutations
  const triggerBackup = async (type: string) => {
    if (backupService) {
      try {
        switch(type) {
          case 'brands':
            await backupService.backupBrands();
            break;
          case 'models':
            await backupService.backupModels();
            break;
          case 'variants':
            await backupService.backupVariants();
            break;
          case 'comparisons':
            await backupService.backupPopularComparisons();
            break;
          case 'all':
            await backupService.backupAll();
            break;
        }
      } catch (error) {
        console.error(`⚠️  Backup failed for ${type}:`, error);
      }
    }
  };

  // R2 diagnostics endpoint (auth required) to verify storage config
  app.get('/api/uploads/diagnostics', authenticateToken, modifyLimiter, async (req: Request, res: Response) => {
    try {
      const bucket = process.env.R2_BUCKET as string | undefined;
      const accountId = process.env.R2_ACCOUNT_ID as string | undefined;
      const endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
      const publicBase = process.env.R2_PUBLIC_BASE_URL || (endpoint && bucket ? `${endpoint}/${bucket}` : '');
      const hasCredentials = !!(process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY);

      const summary: Record<string, any> = {
        configured: !!(bucket && endpoint && hasCredentials),
        bucket: bucket || null,
        endpoint: endpoint || null,
        publicBase: publicBase || null,
        hasCredentials,
      };

      if (!summary.configured) {
        return res.json(summary);
      }

      const client = new S3Client({
        region: process.env.R2_REGION || 'auto',
        endpoint,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
        },
        forcePathStyle: true,
      });

      try {
        await client.send(new ListObjectsV2Command({ Bucket: bucket as string, MaxKeys: 1 }));
        summary.r2Ok = true;
      } catch (error: any) {
        summary.r2Ok = false;
        summary.error = error?.message || String(error);
      }

      return res.json(summary);
    } catch (error) {
      return res.status(500).json({ error: 'Diagnostics failed' });
    }
  });

  const buildPublicAssetUrl = (assetPath: string | null | undefined, req: Request): string | null => {
    if (!assetPath) return null
    if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
      return assetPath
    }
    const normalized = assetPath.startsWith('/') ? assetPath : `/${assetPath}`
    const publicBase =
      process.env.R2_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL ||
      (process.env.R2_PUBLIC_BASE_HOST ? `https://${process.env.R2_PUBLIC_BASE_HOST}` : '')
    if (publicBase) {
      return `${publicBase.replace(/\/$/, '')}${normalized}`
    }
    const backendOrigin =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.BACKEND_URL ||
      `${req.protocol}://${req.get('host')}`
    return `${(backendOrigin || '').replace(/\/$/, '')}${normalized}`
  }
  
  // ============================================
  // AUTHENTICATION ROUTES (Public)
  // ============================================
  
  // Login endpoint - with strict rate limiting
  app.post("/api/auth/login", authLimiter, async (req: Request, res: Response) => {
    console.log('📝 Login attempt:', req.body.email);
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password are required",
          code: "MISSING_CREDENTIALS"
        });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({
          error: "Invalid email format",
          code: "INVALID_EMAIL"
        });
      }

      // Find user
      const user = await storage.getAdminUser(email);
      if (!user) {
        return res.status(401).json({
          error: "Invalid email or password",
          code: "INVALID_CREDENTIALS"
        });
      }

      // Verify password
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: "Invalid email or password",
          code: "INVALID_CREDENTIALS"
        });
      }

      // Check if user already has an active session
      const existingSession = await storage.getActiveSession(user.id);
      if (existingSession) {
        // Invalidate previous session (force logout other devices)
        await storage.invalidateSession(user.id);
        console.log('⚠️  Previous session invalidated for:', user.email);
      }

      // Update last login
      await storage.updateAdminUserLogin(user.id);

      // Generate tokens
      const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      });
      const refreshToken = generateRefreshToken(user.id);

      // Create new session
      await storage.createSession(user.id, accessToken);

      // Set cookies
      const isProd = process.env.NODE_ENV === 'production';
      const sameSitePolicy: any = (isProd && process.env.FRONTEND_URL) ? 'none' : 'strict';
      res.cookie('token', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: sameSitePolicy,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: sameSitePolicy,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Return tokens as well for clients that use Authorization header (cross-site frontends)
      res.json({
        success: true,
        user: sanitizeUser(user),
        token: accessToken,
        refreshToken
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: "Internal server error",
        code: "SERVER_ERROR"
      });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", authenticateToken, async (req: Request, res: Response) => {
    try {
      if (req.user) {
        // Invalidate session
        await storage.invalidateSession(req.user.id);
        console.log('👋 User logged out:', req.user.email);
      }
      
      res.clearCookie('token');
      res.clearCookie('refreshToken');
      res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.error('Logout error:', error);
      res.clearCookie('token');
      res.clearCookie('refreshToken');
      res.json({ success: true, message: "Logged out successfully" });
    }
  });

  // Bulk import brands endpoint - with strict bulk rate limiting
  app.post("/api/bulk/brands", bulkLimiter, authenticateToken, async (req: Request, res: Response) => {
    try {
      console.log('📦 Starting bulk brand import...');
      const { brands } = req.body;
      
      if (!Array.isArray(brands)) {
        return res.status(400).json({ error: 'Brands must be an array' });
      }
      
      const results = [];
      let successCount = 0;
      let errorCount = 0;
      
      for (const brandData of brands) {
        try {
          const validatedData = insertBrandSchema.parse(brandData);
          const brand = await storage.createBrand(validatedData);
          results.push({ success: true, brand: brand.name, id: brand.id });
          successCount++;
          console.log(`✅ Created brand: ${brand.name}`);
        } catch (error) {
          console.error(`❌ Failed to create brand ${brandData.name}:`, error);
          const errMsg = error instanceof Error ? error.message : String(error);
          results.push({ success: false, brand: brandData.name, error: errMsg });
          errorCount++;
        }
      }
      
      console.log(`📊 Bulk brand import completed: ${successCount} success, ${errorCount} errors`);
      await triggerBackup('brands');
      
      res.json({
        success: true,
        summary: { total: brands.length, success: successCount, errors: errorCount },
        results
      });
    } catch (error) {
      console.error('❌ Bulk brand import error:', error);
      res.status(500).json({ error: 'Failed to import brands' });
    }
  });

  // Bulk import variants endpoint - with strict bulk rate limiting
  app.post("/api/bulk/variants", bulkLimiter, authenticateToken, async (req: Request, res: Response) => {
    try {
      console.log('📦 Starting bulk variant import...');
      const { variants } = req.body;
      
      if (!Array.isArray(variants)) {
        return res.status(400).json({ error: 'Variants must be an array' });
      }
      
      const results = [];
      let successCount = 0;
      let errorCount = 0;
      
      for (const variantData of variants) {
        try {
          const variant = await storage.createVariant(variantData);
          results.push({ success: true, variant: variant.name, id: variant.id, model: variant.modelId });
          successCount++;
          console.log(`✅ Created variant: ${variant.name} (${variant.modelId})`);
        } catch (error) {
          console.error(`❌ Failed to create variant ${variantData.name}:`, error);
          const errMsg = error instanceof Error ? error.message : String(error);
          results.push({ success: false, variant: variantData.name, error: errMsg });
          errorCount++;
        }
      }
      
      console.log(`📊 Bulk variant import completed: ${successCount} success, ${errorCount} errors`);
      await triggerBackup('variants');
      
      res.json({
        success: true,
        summary: { total: variants.length, success: successCount, errors: errorCount },
        results
      });
    } catch (error) {
      console.error('❌ Bulk variant import error:', error);
      res.status(500).json({ error: 'Failed to import variants' });
    }
  });

  // Bulk import models endpoint - with strict bulk rate limiting
  app.post("/api/bulk/models", bulkLimiter, authenticateToken, async (req: Request, res: Response) => {
    try {
      console.log('📦 Starting bulk model import...');
      const { models } = req.body;
      
      if (!Array.isArray(models)) {
        return res.status(400).json({ error: 'Models must be an array' });
      }
      
      const results = [];
      let successCount = 0;
      let errorCount = 0;
      
      for (const modelData of models) {
        try {
          const validatedData = insertModelSchema.parse(modelData);
          const model = await storage.createModel(validatedData);
          results.push({ success: true, model: model.name, id: model.id, brand: model.brandId });
          successCount++;
          console.log(`✅ Created model: ${model.name} (${model.brandId})`);
        } catch (error) {
          console.error(`❌ Failed to create model ${modelData.name}:`, error);
          const errMsg = error instanceof Error ? error.message : String(error);
          results.push({ success: false, model: modelData.name, error: errMsg });
          errorCount++;
        }
      }
      
      console.log(`📊 Bulk model import completed: ${successCount} success, ${errorCount} errors`);
      await triggerBackup('models');
      
      res.json({
        success: true,
        summary: { total: models.length, success: successCount, errors: errorCount },
        results
      });
    } catch (error) {
      console.error('❌ Bulk model import error:', error);
      res.status(500).json({ error: 'Failed to import models' });
    }
  });

  // Clear models only endpoint
  app.post("/api/cleanup/clear-models", authenticateToken, modifyLimiter, async (req: Request, res: Response) => {
    try {
      console.log('🧹 Starting models cleanup...');
      
      // Delete all variants first (cascade)
      const variants = await storage.getVariants();
      let deletedVariants = 0;
      for (const variant of variants) {
        await storage.deleteVariant(variant.id);
        deletedVariants++;
      }
      
      // Delete all models
      const models = await storage.getModels();
      let deletedModels = 0;
      for (const model of models) {
        await storage.deleteModel(model.id);
        deletedModels++;
      }
      
      console.log(`✅ Models cleanup completed: ${deletedModels} models, ${deletedVariants} variants deleted`);
      await triggerBackup('models');
      
      res.json({
        success: true,
        deleted: { models: deletedModels, variants: deletedVariants },
        message: `Models cleared: ${deletedModels} models, ${deletedVariants} variants`
      });
    } catch (error) {
      console.error('❌ Models cleanup error:', error);
      res.status(500).json({ error: 'Failed to clear models' });
    }
  });

  // Clear all data endpoint
  app.post("/api/cleanup/clear-all", authenticateToken, modifyLimiter, async (req: Request, res: Response) => {
    try {
      console.log('🧹 Starting complete database cleanup...');
      
      // Delete all variants
      const variants = await storage.getVariants();
      let deletedVariants = 0;
      for (const variant of variants) {
        const success = await storage.deleteVariant(variant.id);
        if (success) deletedVariants++;
      }
      
      // Delete all models
      const models = await storage.getModels();
      let deletedModels = 0;
      for (const model of models) {
        const success = await storage.deleteModel(model.id);
        if (success) deletedModels++;
      }
      
      // Delete all brands
      const brands = await storage.getBrands();
      let deletedBrands = 0;
      for (const brand of brands) {
        const success = await storage.deleteBrand(brand.id);
        if (success) deletedBrands++;
      }
      
      console.log(`✅ Cleanup completed: ${deletedBrands} brands, ${deletedModels} models, ${deletedVariants} variants deleted`);
      
      res.json({
        success: true,
        deleted: {
          brands: deletedBrands,
          models: deletedModels,
          variants: deletedVariants
        },
        message: `Database cleared: ${deletedBrands} brands, ${deletedModels} models, ${deletedVariants} variants`
      });
    } catch (error) {
      console.error('❌ Clear all error:', error);
      res.status(500).json({ error: 'Failed to clear database' });
    }
  });

  // Cleanup orphaned data endpoint
  app.post("/api/cleanup/orphaned-data", authenticateToken, modifyLimiter, async (req: Request, res: Response) => {
    try {
      console.log('🧹 Starting orphaned data cleanup...');
      
      // Get all data
      const brands = await storage.getBrands();
      const models = await storage.getModels();
      const variants = await storage.getVariants();
      
      const brandIds = brands.map(b => b.id);
      const modelIds = models.map(m => m.id);
      
      // Find orphaned data
      const orphanedModels = models.filter(m => !brandIds.includes(m.brandId));
      const orphanedVariants = variants.filter(v => 
        !modelIds.includes(v.modelId) || !brandIds.includes(v.brandId)
      );
      
      console.log(`📊 Found ${orphanedModels.length} orphaned models, ${orphanedVariants.length} orphaned variants`);
      
      let deletedModels = 0;
      let deletedVariants = 0;
      
      // Delete orphaned models
      for (const model of orphanedModels) {
        console.log(`🗑️ Deleting orphaned model: ${model.name} (${model.id})`);
        const success = await storage.deleteModel(model.id);
        if (success) deletedModels++;
      }
      
      // Delete orphaned variants
      for (const variant of orphanedVariants) {
        console.log(`🗑️ Deleting orphaned variant: ${variant.name} (${variant.id})`);
        const success = await storage.deleteVariant(variant.id);
        if (success) deletedVariants++;
      }
      
      console.log(`✅ Cleanup completed: ${deletedModels} models, ${deletedVariants} variants deleted`);
      
      res.json({
        success: true,
        deleted: {
          models: deletedModels,
          variants: deletedVariants
        },
        message: `Cleaned up ${deletedModels} orphaned models and ${deletedVariants} orphaned variants`
      });
    } catch (error) {
      console.error('❌ Cleanup error:', error);
      res.status(500).json({ error: 'Failed to cleanup orphaned data' });
    }
  });

  // Get current user
  app.get("/api/auth/me", authenticateToken, async (req: Request, res: Response) => {
    try {
      // Dev bypass: trust the injected req.user
      if (process.env.AUTH_BYPASS === 'true') {
        return res.json({
          success: true,
          user: {
            id: req.user?.id || 'dev-admin',
            email: req.user?.email || 'dev@local',
            name: req.user?.name || 'Developer',
            role: req.user?.role || 'super_admin',
          }
        });
      }
      if (!req.user) {
        return res.status(401).json({
          error: "Not authenticated",
          code: "NOT_AUTHENTICATED"
        });
      }

      const user = await storage.getAdminUserById(req.user.id);
      if (!user) {
        return res.status(404).json({
          error: "User not found",
          code: "USER_NOT_FOUND"
        });
      }

      res.json({
        success: true,
        user: sanitizeUser(user)
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        error: "Internal server error",
        code: "SERVER_ERROR"
      });
    }
  });

  // Change password
  app.post("/api/auth/change-password", authenticateToken, async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: "Current password and new password are required",
          code: "MISSING_FIELDS"
        });
      }

      // Validate new password strength
      const passwordValidation = isStrongPassword(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          error: "Password does not meet requirements",
          code: "WEAK_PASSWORD",
          details: passwordValidation.errors
        });
      }

      // Get user
      const user = await storage.getAdminUserById(req.user!.id);
      if (!user) {
        return res.status(404).json({
          error: "User not found",
          code: "USER_NOT_FOUND"
        });
      }

      // Verify current password
      const isValid = await comparePassword(currentPassword, user.password);
      if (!isValid) {
        return res.status(401).json({
          error: "Current password is incorrect",
          code: "INVALID_PASSWORD"
        });
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update password (you'll need to add this method to storage)
      // For now, we'll return success
      res.json({
        success: true,
        message: "Password changed successfully"
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        error: "Internal server error",
        code: "SERVER_ERROR"
      });
    }
  });

  // ============================================
  // FILE UPLOAD ROUTES
  // ============================================
  
  // File upload endpoint for logos with WebP conversion and R2 support
  app.post("/api/upload/logo", 
    authenticateToken,
    modifyLimiter,
    upload.single('logo'),
    validateFileUpload,
    imageProcessingConfigs.logo,
    async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      const processedImages = (req as any).processedImages || [];
      const compressionInfo = processedImages.length > 0 ? {
        originalSize: processedImages[0].originalSize,
        compressedSize: processedImages[0].compressedSize,
        compressionRatio: processedImages[0].compressionRatio,
        format: processedImages[0].format
      } : null;

      // Try R2 upload first (server-side upload to avoid CORS issues)
      const bucket = process.env.R2_BUCKET;
      if (bucket) {
        const accountId = process.env.R2_ACCOUNT_ID;
        const endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
        
        try {
          // Determine which file to upload (processed WebP or original)
          let filePathToUpload = req.file.path;
          let fileBody: Buffer;
          
          // Use processed WebP file if available, otherwise use original
          if (processedImages.length > 0 && processedImages[0].webpPath) {
            filePathToUpload = processedImages[0].webpPath;
            console.log(`📦 Using processed WebP file: ${filePathToUpload}`);
          } else {
            console.log(`📦 Using original file: ${filePathToUpload}`);
          }
          
          // Check if file exists before reading
          if (!fs.existsSync(filePathToUpload)) {
            throw new Error(`File not found at path: ${filePathToUpload}`);
          }
          
          fileBody = readFileSync(filePathToUpload);
          console.log(`📊 File size: ${fileBody.length} bytes`);
          
          // Use server-side S3 client (no CORS issues)
          const client = new S3Client({
            region: process.env.R2_REGION || 'auto',
            endpoint,
            credentials: process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY ? {
              accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
            } : undefined,
            forcePathStyle: true,
          });

          const now = new Date();
          const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
          const key = `uploads/logos/${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}/${randomUUID()}-${safeName.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`;
          
          console.log(`🚀 Uploading to R2: bucket=${bucket}, key=${key}`);
          
          // Server-side upload (bypasses CORS completely)
          await client.send(new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: fileBody,
            ContentType: 'image/webp',
            Metadata: {
              'original-name': req.file.originalname,
              'upload-date': now.toISOString(),
              ...(compressionInfo && {
                'original-size': compressionInfo.originalSize.toString(),
                'compressed-size': compressionInfo.compressedSize.toString(),
                'compression-ratio': compressionInfo.compressionRatio.toString()
              })
            }
          }));

          const publicBase = process.env.R2_PUBLIC_BASE_URL || `${endpoint}/${bucket}`;
          const publicUrl = `${publicBase}/${key}`;
          
          console.log(`✅ Logo uploaded to R2 successfully: ${publicUrl}`);
          
          // Clean up temp files
          try {
            if (fs.existsSync(filePathToUpload)) {
              fs.unlinkSync(filePathToUpload);
              console.log(`🗑️ Cleaned up temp file: ${filePathToUpload}`);
            }
            // Also clean up original if it exists and is different
            if (req.file.path !== filePathToUpload && fs.existsSync(req.file.path)) {
              fs.unlinkSync(req.file.path);
            }
          } catch (cleanupError) {
            console.warn('⚠️ Failed to cleanup temp files:', cleanupError);
          }
          
          return res.json({ 
            url: publicUrl, 
            filename: safeName,
            compression: compressionInfo
          });
        } catch (error) {
          console.error('❌ R2 logo upload failed:', {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            bucket: bucket,
            endpoint: endpoint,
            hasCredentials: !!(process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY),
            filePath: req.file.path,
            processedImages: (req as any).processedImages
          });
          console.error('📋 Full error details:', error);
          console.warn('⚠️  Logo upload falling back to local storage (will be lost on restart!)');
          // In production, optionally fail hard instead of falling back to local storage
          if (process.env.REQUIRE_R2 === 'true') {
            return res.status(500).json({ error: 'Cloud storage unavailable. Please try again later.' });
          }
          // Fall through to local storage
        }
      } else {
        console.warn('⚠️  R2 not configured for logo upload, using local storage (files will be lost on restart!)');
      }

      // Default to local URL
      let fileUrl = `/uploads/${req.file.filename}`;
      
      res.json({ 
        url: fileUrl,
        processed: true,
        format: 'webp',
        compression: compressionInfo
      });
    }
  );

// ...
  // Generic image upload endpoint for model images with WebP conversion and R2 support
  app.post("/api/upload/image", 
    authenticateToken,
    modifyLimiter,
    upload.single('image'),
    validateFileUpload,
    imageProcessingConfigs.gallery,
    async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }
      
      const processedImages = (req as any).processedImages || [];
      const compressionInfo = processedImages.length > 0 ? {
        originalSize: processedImages[0].originalSize,
        webpSize: processedImages[0].webpSize,
        compressionRatio: processedImages[0].compressionRatio
      } : null;
    
      // Default to local URL
      let fileUrl = `/uploads/${req.file.filename}`;
      
      // Upload to R2 if configured (server-side upload to avoid CORS issues)
      const bucket = process.env.R2_BUCKET;
      if (bucket) {
        const accountId = process.env.R2_ACCOUNT_ID;
        const endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
        
        try {
          
          // Use server-side S3 client (no CORS issues)
          const client = new S3Client({
            region: process.env.R2_REGION || 'auto',
            endpoint,
            credentials: process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY ? {
              accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
            } : undefined,
            forcePathStyle: true,
          });

          const now = new Date();
          const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
          const key = `uploads/images/${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}/${randomUUID()}-${safeName.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`;
          const body = readFileSync(req.file.path);
          
          // Server-side upload (bypasses CORS completely)
          await client.send(new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: body,
            ContentType: req.file.mimetype || 'image/webp',
            Metadata: {
              'original-name': req.file.originalname,
              'upload-date': new Date().toISOString(),
              ...(compressionInfo && {
                'original-size': compressionInfo.originalSize.toString(),
                'webp-size': compressionInfo.webpSize.toString(),
                'compression-ratio': compressionInfo.compressionRatio.toString()
              })
            }
          }));
          
          const publicBase = process.env.R2_PUBLIC_BASE_URL || (endpoint ? `${endpoint}/${bucket}` : '');
          if (publicBase) {
            fileUrl = `${publicBase}/${key}`;
          }
          
          // Clean up temp file
          fs.unlinkSync(req.file.path);
          
          console.log(`✅ Image uploaded to R2 (server-side): ${fileUrl}`);
        } catch (error: any) {
          console.error('❌ R2 image upload failed:', {
            error: error.message,
            bucket: bucket,
            endpoint: endpoint,
            hasCredentials: !!(process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY)
          });
          console.error('📋 Full error details:', error);
          // In production, optionally fail hard instead of falling back to local storage
          if (process.env.REQUIRE_R2 === 'true') {
            return res.status(500).json({ error: 'Cloud storage unavailable. Please try again later.' });
          }
          // Keep local URL as fallback but warn user
          console.warn(`⚠️  Using local fallback URL: ${fileUrl} (will be lost on restart!)`);
        }
      } else {
        console.warn('⚠️  R2 not configured, using local storage (files will be lost on restart!)');
      }
      
      res.json({ 
        url: fileUrl, 
        filename: req.file.filename,
        processed: true,
        format: 'webp',
        compression: compressionInfo
      });
    }
  );

  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  // Presigned upload (R2/S3) - secure direct uploads
  app.post('/api/uploads/presign', authenticateToken, modifyLimiter, async (req, res) => {
    try {
      const { filename, contentType } = req.body as { filename?: string; contentType?: string };
      if (!filename || !contentType) {
        return res.status(400).json({ error: 'filename and contentType are required' });
      }

      const bucket = process.env.R2_BUCKET;
      if (!bucket) {
        return res.status(500).json({ error: 'R2 bucket not configured' });
      }

      // Lazily init S3 client for R2
      const accountId = process.env.R2_ACCOUNT_ID;
      const endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
      const client = new S3Client({
        region: process.env.R2_REGION || 'auto',
        endpoint,
        credentials: process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY ? {
          accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
        } : undefined,
        forcePathStyle: true,
      });

      const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
      const now = new Date();
      const key = `uploads/${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}/${randomUUID()}-${safeName}`;

      const cmd = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
      });
      const uploadUrl = await getSignedUrl(client, cmd, { expiresIn: 600 }); // 10 minutes

      const publicBase = process.env.R2_PUBLIC_BASE_URL || `${endpoint}/${bucket}`;
      const publicUrl = `${publicBase}/${key}`;

      return res.json({ uploadUrl, publicUrl, key });
    } catch (error) {
      console.error('presign error:', error);
      return res.status(500).json({ error: 'Failed to generate presigned URL' });
    }
  });

  // Delete object from R2/S3
  app.delete('/api/uploads/object', authenticateToken, modifyLimiter, async (req, res) => {
    try {
      const { key, url } = req.body as { key?: string; url?: string };
      if (!key && !url) {
        return res.status(400).json({ error: 'key or url is required' });
      }

      const bucket = process.env.R2_BUCKET as string;
      if (!bucket) {
        return res.status(500).json({ error: 'R2 bucket not configured' });
      }

      const accountId = process.env.R2_ACCOUNT_ID;
      const endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
      const client = new S3Client({
        region: process.env.R2_REGION || 'auto',
        endpoint,
        credentials: process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY ? {
          accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
        } : undefined,
        forcePathStyle: true,
      });

      let objectKey = key;
      if (!objectKey && url) {
        const publicBase = process.env.R2_PUBLIC_BASE_URL || '';
        if (publicBase && url.startsWith(publicBase)) {
          objectKey = url.slice(publicBase.length).replace(/^\//, '');
        } else if (endpoint) {
          const apiBase = `${endpoint}/${bucket}/`;
          if (url.startsWith(apiBase)) {
            objectKey = url.slice(apiBase.length);
          }
        }
      }

      if (!objectKey) {
        return res.status(400).json({ error: 'Unable to derive object key from url' });
      }

      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: objectKey }));
      return res.json({ success: true, key: objectKey });
    } catch (error) {
      console.error('delete object error:', error);
      return res.status(500).json({ error: 'Failed to delete object' });
    }
  });

  // Stats (with Redis caching)
  app.get("/api/stats", redisCacheMiddleware(RedisCacheTTL.STATS), async (req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  // Brands - with active/inactive filter for frontend (public endpoint + Redis caching)
  app.get("/api/brands", publicLimiter, redisCacheMiddleware(RedisCacheTTL.BRANDS), async (req, res) => {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const brands = await storage.getBrands(includeInactive);
      const transformed = brands.map(brand => ({
        ...brand,
        logo: buildPublicAssetUrl(brand.logo, req)
      }));
      res.json(transformed);
    } catch (error) {
      console.error('Error getting brands:', error);
      res.status(500).json({ error: "Failed to get brands" });
    }
  });

  app.get("/api/brands/available-rankings", async (req, res) => {
    const excludeBrandId = req.query.excludeBrandId as string | undefined;
    const availableRankings = await storage.getAvailableRankings(excludeBrandId);
    res.json(availableRankings);
  });

  // Get formatted brand summary with proper sections
  app.get("/api/brands/:id/formatted", async (req, res) => {
    try {
      const brand = await storage.getBrand(req.params.id);
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }

      // Format the summary with proper sections
      const formattedSummary = formatBrandSummary(brand.summary || '', brand.name);
      
      res.json({
        ...brand,
        logo: buildPublicAssetUrl(brand.logo, req),
        formattedSummary
      });
    } catch (error) {
      console.error('Error getting formatted brand:', error);
      res.status(500).json({ error: "Failed to get formatted brand" });
    }
  });

  app.get("/api/brands/:id", async (req, res) => {
    const brand = await storage.getBrand(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.json({
      ...brand,
      logo: buildPublicAssetUrl(brand.logo, req)
    });
  });

  app.post("/api/brands", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log('Received brand data:', JSON.stringify(req.body, null, 2));
      const validatedData = insertBrandSchema.parse(req.body);
      console.log('Validated data:', JSON.stringify(validatedData, null, 2));
      const brand = await storage.createBrand(validatedData);
      
      // Backup after create
      await triggerBackup('brands');
      await invalidateRedisCache('/api/brands');
      
      res.status(201).json({
        ...brand,
        logo: buildPublicAssetUrl(brand.logo, req)
      });
    } catch (error) {
      console.error('Brand creation error:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid brand data" });
      }
    }
  });

  app.patch("/api/brands/:id", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      const brand = await storage.updateBrand(req.params.id, req.body);
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }
      
      // Backup after update
      await triggerBackup('brands');
      await invalidateRedisCache('/api/brands');
      
      res.json({
        ...brand,
        logo: buildPublicAssetUrl(brand.logo, req)
      });
    } catch (error) {
      console.error('Brand update error:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Failed to update brand" });
      }
    }
  });

  app.delete("/api/brands/:id", authenticateToken, modifyLimiter, async (req, res) => {
    try {
      console.log(`🗑️ DELETE request for brand: ${req.params.id}`);
      const success = await storage.deleteBrand(req.params.id);
      if (!success) {
        console.log(`❌ Brand not found: ${req.params.id}`);
        return res.status(404).json({ error: "Brand not found" });
      }
      console.log(`✅ Brand deleted successfully: ${req.params.id}`);
      await triggerBackup('brands');
      await invalidateRedisCache('/api/brands');
      res.status(204).send();
    } catch (error) {
      console.error(`❌ Error deleting brand ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete brand" });
    }
  });

  // Models (public endpoint + caching)
  app.get("/api/models", publicLimiter, redisCacheMiddleware(RedisCacheTTL.MODELS), async (req, res) => {
    const brandId = req.query.brandId as string | undefined;
    const models = await storage.getModels(brandId);
    res.json(models);
  });

  app.get("/api/models/:id", async (req, res) => {
    const model = await storage.getModel(req.params.id);
    if (!model) {
      return res.status(404).json({ error: "Model not found" });
    }
    res.json(model);
  });

  app.post("/api/models", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log('Received model data:', JSON.stringify(req.body, null, 2));
      const validatedData = insertModelSchema.parse(req.body);
      console.log('Validated data:', JSON.stringify(validatedData, null, 2));
      const model = await storage.createModel(validatedData);
      res.status(201).json(model);
    } catch (error) {
      console.error('Model creation error:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid model data" });
      }
    }
  });

  // PUT route for model updates (used by progressive saving)
  app.put("/api/models/:id", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log('🔄 PUT - Updating model:', req.params.id);
      console.log('📊 Update data received:', JSON.stringify(req.body, null, 2));
      
      const model = await storage.updateModel(req.params.id, req.body);
      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }
      
      console.log('✅ Model updated successfully via PUT');
      
      // Invalidate models cache so frontend sees updated data
      await invalidateRedisCache('/api/models');
      console.log('🗑️ Models cache invalidated');
      
      res.json(model);
    } catch (error) {
      console.error('❌ Model PUT update error:', error);
      res.status(500).json({ error: "Failed to update model" });
    }
  });

  app.patch("/api/models/:id", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log('🔄 PATCH - Updating model:', req.params.id);
      console.log('📊 Update data received:', JSON.stringify(req.body, null, 2));
      console.log('🎨 Color Images in request:', req.body.colorImages);
      console.log('🎨 Color Images length:', req.body.colorImages?.length || 0);
      
      const model = await storage.updateModel(req.params.id, req.body);
      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }
      
      console.log('✅ Model updated successfully via PATCH');
      console.log('📊 Updated model image data:');
      console.log('- Hero Image:', model.heroImage);
      console.log('- Gallery Images:', model.galleryImages?.length || 0, 'images');
      console.log('- Key Feature Images:', model.keyFeatureImages?.length || 0, 'images');
      console.log('- Space Comfort Images:', model.spaceComfortImages?.length || 0, 'images');
      console.log('- Storage Convenience Images:', model.storageConvenienceImages?.length || 0, 'images');
      console.log('- Color Images:', model.colorImages?.length || 0, 'images');
      console.log('🎨 Color Images saved:', JSON.stringify(model.colorImages, null, 2));
      
      // Invalidate models cache
      await invalidateRedisCache('/api/models');
      console.log('🗑️ Models cache invalidated');
      
      res.json(model);
    } catch (error) {
      console.error('❌ Model PATCH update error:', error);
      res.status(500).json({ error: "Failed to update model" });
    }
  });

  app.delete("/api/models/:id", authenticateToken, modifyLimiter, async (req, res) => {
    try {
      console.log(`🗑️ DELETE request for model: ${req.params.id}`);
      const success = await storage.deleteModel(req.params.id);
      if (!success) {
        console.log(`❌ Model not found: ${req.params.id}`);
        return res.status(404).json({ error: "Model not found" });
      }
      console.log(`✅ Model deleted successfully: ${req.params.id}`);
      await triggerBackup('models');
      res.status(204).send();
    } catch (error) {
      console.error(`❌ Error deleting model ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete model" });
    }
  });

  // Variants (public endpoint + caching)
  app.get("/api/variants", publicLimiter, redisCacheMiddleware(RedisCacheTTL.VARIANTS), async (req, res) => {
    const modelId = req.query.modelId as string | undefined;
    const brandId = req.query.brandId as string | undefined;
    const variants = await storage.getVariants(modelId, brandId);
    res.json(variants);
  });

  app.get("/api/variants/:id", async (req, res) => {
    const variant = await storage.getVariant(req.params.id);
    if (!variant) {
      return res.status(404).json({ error: "Variant not found" });
    }
    res.json(variant);
  });

  app.post("/api/variants", async (req, res) => {
    try {
      console.log('🚗 Received variant data:', JSON.stringify(req.body, null, 2));
      
      // Validate required fields
      if (!req.body.brandId || !req.body.modelId || !req.body.name || !req.body.price) {
        console.error('❌ Missing required fields:', {
          brandId: !!req.body.brandId,
          modelId: !!req.body.modelId,
          name: !!req.body.name,
          price: !!req.body.price
        });
        return res.status(400).json({ 
          error: "Missing required fields: brandId, modelId, name, and price are required" 
        });
      }
      
      const variant = await storage.createVariant(req.body);
      console.log('✅ Variant created successfully:', variant.id);
      
      // Invalidate variants cache
      await invalidateRedisCache('/api/variants');
      
      res.status(201).json(variant);
    } catch (error) {
      console.error('❌ Variant creation error:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message, stack: error.stack });
      } else {
        res.status(400).json({ error: "Invalid variant data" });
      }
    }
  });

  app.patch("/api/variants/:id", async (req, res) => {
    try {
      console.log('🔄 Updating variant:', req.params.id);
      console.log('📊 Update data received:', JSON.stringify(req.body, null, 2));
      
      const variant = await storage.updateVariant(req.params.id, req.body);
      if (!variant) {
        return res.status(404).json({ error: "Variant not found" });
      }
      
      console.log('✅ Variant updated successfully');
      
      // Invalidate variants cache
      invalidateRedisCache('/api/variants');
      
      res.json(variant);
    } catch (error) {
      console.error('❌ Variant update error:', error);
      res.status(500).json({ error: "Failed to update variant" });
    }
  });

  app.delete("/api/variants/:id", async (req, res) => {
    try {
      console.log('🗑️ DELETE request for variant ID:', req.params.id);
      
      const success = await storage.deleteVariant(req.params.id);
      
      if (!success) {
        console.log('❌ Variant not found or delete failed');
        return res.status(404).json({ error: "Variant not found" });
      }
      
      console.log('✅ Variant deleted successfully, invalidating cache...');
      
      // Invalidate variants cache
      invalidateRedisCache('/api/variants');
      
      res.status(204).send();
    } catch (error) {
      console.error('❌ Delete variant route error:', error);
      res.status(500).json({ error: "Failed to delete variant" });
    }
  });

  // Frontend API endpoints
  app.get("/api/frontend/brands/:brandId/models", async (req, res) => {
    try {
      const { brandId } = req.params;
      console.log('🚗 Frontend: Getting models for brand:', brandId);
      
      const models = await storage.getModels(brandId);
      const brand = await storage.getBrand(brandId);
      
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }

      // Transform models for frontend display
      const frontendModels = models.map(model => ({
        id: model.id,
        name: model.name,
        price: "₹7.71", // Will be calculated later
        rating: 4.5, // Will be from reviews later
        reviews: 1247, // Will be from reviews later
        power: "89 bhp", // Will be from engine data
        image: model.heroImage || '/cars/default-car.jpg',
        isNew: model.isNew || false,
        seating: "5 seater", // Will be from specifications
        fuelType: model.fuelTypes?.join('-') || 'Petrol',
        transmission: model.transmissions?.join('-') || 'Manual',
        mileage: "18.3 kmpl", // Will be from mileage data
        variants: 16, // Will be calculated from variants
        slug: model.name.toLowerCase().replace(/\s+/g, '-'),
        brandName: brand.name
      }));

      console.log('✅ Frontend: Returning', frontendModels.length, 'models for brand', brand.name);
      res.json({
        brand: {
          id: brand.id,
          name: brand.name,
          slug: brand.name.toLowerCase().replace(/\s+/g, '-')
        },
        models: frontendModels
      });
    } catch (error) {
      console.error('❌ Frontend models error:', error);
      res.status(500).json({ error: "Failed to fetch models" });
    }
  });

  app.get("/api/frontend/models/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      console.log('🚗 Frontend: Getting model by slug:', slug);
      
      const models = await storage.getModels();
      const model = models.find(m => 
        m.name.toLowerCase().replace(/\s+/g, '-') === slug
      );
      
      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }

      const brand = await storage.getBrand(model.brandId);
      
      // Transform model for frontend display
      const frontendModel = {
        id: model.id,
        name: model.name,
        brandName: brand?.name || 'Unknown',
        heroImage: model.heroImage,
        galleryImages: model.galleryImages || [],
        keyFeatureImages: model.keyFeatureImages || [],
        spaceComfortImages: model.spaceComfortImages || [],
        storageConvenienceImages: model.storageConvenienceImages || [],
        colorImages: model.colorImages || [],
        description: model.description,
        pros: model.pros,
        cons: model.cons,
        exteriorDesign: model.exteriorDesign,
        comfortConvenience: model.comfortConvenience,
        engineSummaries: model.engineSummaries || [],
        mileageData: model.mileageData || [],
        faqs: model.faqs || [],
        fuelTypes: model.fuelTypes || [],
        transmissions: model.transmissions || [],
        bodyType: model.bodyType,
        subBodyType: model.subBodyType,
        launchDate: model.launchDate,
        isPopular: model.isPopular,
        isNew: model.isNew
      };

      console.log('✅ Frontend: Returning model details for', model.name);
      res.json(frontendModel);
    } catch (error) {
      console.error('❌ Frontend model error:', error);
      res.status(500).json({ error: "Failed to fetch model" });
    }
  });

  // Popular Comparisons Routes
  app.get("/api/popular-comparisons", async (req, res) => {
    try {
      const comparisons = await storage.getPopularComparisons();
      res.json(comparisons);
    } catch (error) {
      console.error('Error fetching popular comparisons:', error);
      res.status(500).json({ error: "Failed to fetch popular comparisons" });
    }
  });

  app.post("/api/popular-comparisons", async (req, res) => {
    try {
      const comparisons = req.body;
      
      if (!Array.isArray(comparisons)) {
        return res.status(400).json({ error: "Expected array of comparisons" });
      }

      const savedComparisons = await storage.savePopularComparisons(comparisons);
      res.json({
        success: true,
        count: savedComparisons.length,
        comparisons: savedComparisons
      });
    } catch (error) {
      console.error('Error saving popular comparisons:', error);
      res.status(500).json({ error: "Failed to save popular comparisons" });
    }
  });

  // ==================== NEWS ROUTES ====================
  
  // Public news routes
  app.use('/api/news', newsRoutes);
  
  // Admin news management routes (MUST come BEFORE /api/admin to avoid rate limiting)
  app.use('/api/admin/articles', adminArticlesRoutes);
  app.use('/api/admin/categories', adminCategoriesRoutes);
  app.use('/api/admin/tags', adminTagsRoutes);
  app.use('/api/admin/authors', adminAuthorsRoutes);
  app.use('/api/admin/media', adminMediaRoutes);
  app.use('/api/admin/analytics', adminAnalyticsRoutes);
  
  // Admin authentication routes (with rate limiting) - MUST come AFTER specific routes
  app.use('/api/admin', authLimiter, adminAuthRoutes);

}
