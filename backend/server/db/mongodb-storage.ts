import mongoose from 'mongoose';
import { IStorage } from '../storage';
import { Brand, Model, Variant, AdminUser, PopularComparison } from './schemas';
import type { 
  InsertBrand,
  InsertModel,
  InsertVariant,
  InsertPopularComparison,
  InsertAdminUser
} from '../validation/schemas';

// Define MongoDB document types
type BrandType = {
  _id?: string;
  id: string;
  name: string;
  logo?: string;
  ranking: number;
  status: string;
  summary?: string;
  faqs: { question: string; answer: string }[];
  createdAt: Date;
};

type ModelType = {
  _id?: string;
  id: string;
  name: string;
  brandId: string;
  status: string;
  [key: string]: any; // For additional model fields
  createdAt: Date;
};

type VariantType = {
  _id?: string;
  id: string;
  name: string;
  brandId: string;
  modelId: string;
  price: number;
  status: string;
  [key: string]: any; // For additional variant fields
  createdAt: Date;
};

type PopularComparisonType = {
  _id?: string;
  id: string;
  model1Id: string;
  model2Id: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
};

type AdminUserType = {
  _id?: string;
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export class MongoDBStorage implements IStorage {
  private activeSessions: Map<string, string> = new Map();

  async connect(uri: string): Promise<void> {
    const { initializeMongoDBOptimized } = await import('./mongodb-config');
    await initializeMongoDBOptimized(uri);
  }

  // ============================================
  // BRANDS
  // ============================================

  async getBrands(includeInactive?: boolean): Promise<BrandType[]> {
    try {
      const filter = includeInactive ? {} : { status: 'active' };
      const brands = await Brand.find(filter).sort({ ranking: 1 }).lean();
      return brands as BrandType[];
    } catch (error) {
      console.error('getBrands error:', error);
      throw new Error('Failed to fetch brands');
    }
  }

  async getBrand(id: string): Promise<BrandType | undefined> {
    try {
      const brand = await Brand.findOne({ id }).lean();
      return brand ? (brand as BrandType) : undefined;
    } catch (error) {
      console.error('getBrand error:', error);
      throw new Error('Failed to fetch brand');
    }
  }

  async createBrand(brand: InsertBrand): Promise<BrandType> {
    try {
      // Generate unique ID using brand name and timestamp
      const slug = brand.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
      
      // Create unique ID with slug
      const baseId = `brand-${slug}`;
      let uniqueId = baseId;
      let counter = 1;
      
      // Check for existing IDs and make it unique
      while (await Brand.findOne({ id: uniqueId })) {
        uniqueId = `${baseId}-${counter}`;
        counter++;
      }
      
      // Auto-assign ranking (find next available ranking)
      const existingBrands = await Brand.find().select('ranking').sort({ ranking: 1 }).lean();
      const takenRankings = existingBrands.map(b => b.ranking);
      let nextRanking = 1;
      while (takenRankings.includes(nextRanking)) {
        nextRanking++;
      }
      
      const newBrand = new Brand({
        id: uniqueId,
        ...brand,
        ranking: nextRanking,
        createdAt: new Date()
      });
      
      await newBrand.save();
      console.log(`✅ Created brand: ${brand.name} with ID: ${uniqueId} and ranking: ${nextRanking}`);
      return newBrand.toObject() as BrandType;
    } catch (error) {
      console.error('createBrand error:', error);
      if (error.code === 11000) {
        // Duplicate key error
        throw new Error('Brand with this name already exists');
      }
      throw new Error('Failed to create brand');
    }
  }

  async updateBrand(id: string, brand: Partial<InsertBrand>): Promise<BrandType | undefined> {
    try {
      const updated = await Brand.findOneAndUpdate(
        { id },
        { $set: brand },
        { new: true }
      ).lean();
      return updated ? (updated as BrandType) : undefined;
    } catch (error) {
      console.error('updateBrand error:', error);
      throw new Error('Failed to update brand');
    }
  }

  async deleteBrand(id: string): Promise<boolean> {
    try {
      console.log(`🗑️ Starting cascade delete for brand: ${id}`);
      
      // Debug: Check if brand exists
      const brandExists = await Brand.findOne({ id }).lean();
      console.log(`🔍 Brand exists check: ${brandExists ? 'Found' : 'Not found'} - ${brandExists?.name || 'N/A'}`);
      
      // First, get all models for this brand
      console.log(`🔍 Searching for models with brandId: ${id}`);
      const modelsToDelete = await Model.find({ brandId: id }).lean();
      console.log(`📋 Found ${modelsToDelete.length} models to delete for brand ${id}`);
      
      if (modelsToDelete.length > 0) {
        console.log(`📋 Models found:`);
        modelsToDelete.forEach(model => {
          console.log(`  - ${model.name} (${model.id})`);
        });
      }
      
      // OPTIMIZED: Delete all variants in a single query using $in operator
      // This fixes the N+1 query problem (100 models = 1 query instead of 100 queries)
      if (modelsToDelete.length > 0) {
        const modelIds = modelsToDelete.map(m => m.id);
        console.log(`🔍 Deleting variants for ${modelIds.length} models in single query`);
        
        const variantDeleteResult = await Variant.deleteMany({ 
          modelId: { $in: modelIds } 
        });
        console.log(`🗑️ Deleted ${variantDeleteResult.deletedCount} variants for all models (optimized)`);
      }
      
      // Also delete variants by brandId (in case there are direct brand references)
      console.log(`🔍 Deleting variants with direct brandId reference`);
      const variantByBrandDeleteResult = await Variant.deleteMany({ brandId: id });
      console.log(`🗑️ Deleted ${variantByBrandDeleteResult.deletedCount} variants by brandId`);

      
      // Delete all models for this brand
      const modelDeleteResult = await Model.deleteMany({ brandId: id });
      console.log(`🗑️ Deleted ${modelDeleteResult.deletedCount} models for brand ${id}`);
      
      // Finally, delete the brand itself
      const brandDeleteResult = await Brand.deleteOne({ id });
      console.log(`🗑️ Deleted brand ${id}: ${brandDeleteResult.deletedCount > 0 ? 'Success' : 'Failed'}`);
      
      return brandDeleteResult.deletedCount > 0;
    } catch (error) {
      console.error('deleteBrand cascade error:', error);
      throw new Error('Failed to delete brand and related data');
    }
  }

  async getAvailableRankings(excludeBrandId?: string): Promise<number[]> {
    try {
      const filter = excludeBrandId ? { id: { $ne: excludeBrandId } } : {};
      const brands = await Brand.find(filter).select('ranking').lean();
      const takenRankings = brands.map(b => b.ranking);
      
      const allRankings = Array.from({ length: 50 }, (_, i) => i + 1);
      return allRankings.filter(ranking => !takenRankings.includes(ranking));
    } catch (error) {
      console.error('getAvailableRankings error:', error);
      throw new Error('Failed to fetch available rankings');
    }
  }

  // ============================================
  // MODELS
  // ============================================

  async getModels(brandId?: string): Promise<ModelType[]> {
    try {
      const filter = brandId ? { brandId, status: 'active' } : { status: 'active' };
      const models = await Model.find(filter).lean();
      return models as ModelType[];
    } catch (error) {
      console.error('getModels error:', error);
      throw new Error('Failed to fetch models');
    }
  }

  async getModel(id: string): Promise<ModelType | undefined> {
    try {
      const model = await Model.findOne({ id }).lean();
      return model ? (model as ModelType) : undefined;
    } catch (error) {
      console.error('getModel error:', error);
      throw new Error('Failed to fetch model');
    }
  }

  async createModel(model: InsertModel): Promise<ModelType> {
    try {
      // Generate unique ID using model name and brand
      const slug = model.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
      
      // Create unique ID with brand and model slug
      const baseId = `model-${model.brandId}-${slug}`;
      let uniqueId = baseId;
      let counter = 1;
      
      // Check for existing IDs and make it unique
      while (await Model.findOne({ id: uniqueId })) {
        uniqueId = `${baseId}-${counter}`;
        counter++;
      }
      
      const newModel = new Model({
        id: uniqueId,
        ...model,
        createdAt: new Date()
      });
      
      await newModel.save();
      console.log(`✅ Created model: ${model.name} with ID: ${uniqueId}`);
      return newModel.toObject() as ModelType;
    } catch (error) {
      console.error('createModel error:', error);
      if (error.code === 11000) {
        throw new Error('Model with this name already exists for this brand');
      }
      throw new Error('Failed to create model');
    }
  }

  async updateModel(id: string, model: Partial<InsertModel>): Promise<ModelType | undefined> {
    try {
      const updated = await Model.findOneAndUpdate(
        { id },
        { $set: model },
        { new: true }
      ).lean();
      return updated ? (updated as ModelType) : undefined;
    } catch (error) {
      console.error('updateModel error:', error);
      throw new Error('Failed to update model');
    }
  }

  async deleteModel(id: string): Promise<boolean> {
    try {
      console.log(`🗑️ Starting cascade delete for model: ${id}`);
      
      // First, delete all variants for this model
      const variantDeleteResult = await Variant.deleteMany({ modelId: id });
      console.log(`🗑️ Deleted ${variantDeleteResult.deletedCount} variants for model ${id}`);
      
      // Then, delete the model itself
      const modelDeleteResult = await Model.deleteOne({ id });
      console.log(`🗑️ Deleted model ${id}: ${modelDeleteResult.deletedCount > 0 ? 'Success' : 'Failed'}`);
      
      return modelDeleteResult.deletedCount > 0;
    } catch (error) {
      console.error('deleteModel cascade error:', error);
      throw new Error('Failed to delete model and related variants');
    }
  }

  // ============================================
  // VARIANTS
  // ============================================

  async getVariants(modelId?: string, brandId?: string): Promise<VariantType[]> {
    try {
      const filter: any = { status: 'active' };
      if (modelId) filter.modelId = modelId;
      if (brandId) filter.brandId = brandId;
      const variants = await Variant.find(filter).lean();
      return variants as VariantType[];
    } catch (error) {
      console.error('getVariants error:', error);
      throw new Error('Failed to fetch variants');
    }
  }

  async getVariant(id: string): Promise<VariantType | undefined> {
    try {
      const variant = await Variant.findOne({ id }).lean();
      return variant ? (variant as VariantType) : undefined;
    } catch (error) {
      console.error('getVariant error:', error);
      throw new Error('Failed to fetch variant');
    }
  }

  async createVariant(variant: InsertVariant): Promise<VariantType> {
    try {
      // Generate unique ID using variant name, model, and brand
      const slug = variant.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
      
      // Create unique ID with brand, model, and variant slug
      const baseId = `variant-${variant.brandId}-${variant.modelId}-${slug}`;
      let uniqueId = baseId;
      let counter = 1;
      
      // Check for existing IDs and make it unique
      while (await Variant.findOne({ id: uniqueId })) {
        uniqueId = `${baseId}-${counter}`;
        counter++;
      }
      
      const newVariant = new Variant({
        id: uniqueId,
        ...variant,
        createdAt: new Date()
      });
      
      await newVariant.save();
      console.log(`✅ Created variant: ${variant.name} with ID: ${uniqueId}`);
      return newVariant.toObject() as VariantType;
    } catch (error) {
      console.error('createVariant error:', error);
      if (error.code === 11000) {
        throw new Error('Variant with this name already exists for this model');
      }
      throw new Error('Failed to create variant');
    }
  }

  async updateVariant(id: string, variant: Partial<InsertVariant>): Promise<VariantType | undefined> {
    try {
      const updated = await Variant.findOneAndUpdate(
        { id },
        { $set: variant },
        { new: true }
      ).lean();
      return updated ? (updated as VariantType) : undefined;
    } catch (error) {
      console.error('updateVariant error:', error);
      throw new Error('Failed to update variant');
    }
  }

  async deleteVariant(id: string): Promise<boolean> {
    try {
      console.log('🗑️ Attempting to delete variant with ID:', id);
      
      // First check if variant exists
      const existingVariant = await Variant.findOne({ id });
      if (!existingVariant) {
        console.log('❌ Variant not found with ID:', id);
        return false;
      }
      
      console.log('✅ Found variant to delete:', existingVariant.name);
      
      const result = await Variant.deleteOne({ id });
      console.log('📊 Delete result:', {
        deletedCount: result.deletedCount,
        acknowledged: result.acknowledged
      });
      
      if (result.deletedCount > 0) {
        console.log('✅ Variant deleted successfully');
        return true;
      } else {
        console.log('⚠️ Delete operation completed but no documents were deleted');
        return false;
      }
    } catch (error) {
      console.error('❌ deleteVariant error:', error);
      throw new Error('Failed to delete variant');
    }
  }

  // ============================================
  // POPULAR COMPARISONS
  // ============================================

  async getPopularComparisons(): Promise<PopularComparisonType[]> {
    try {
      const comparisons = await PopularComparison.find({ isActive: true })
        .sort({ order: 1 })
        .lean();
      return comparisons as PopularComparisonType[];
    } catch (error) {
      console.error('getPopularComparisons error:', error);
      throw new Error('Failed to fetch popular comparisons');
    }
  }

  async savePopularComparisons(comparisons: InsertPopularComparison[]): Promise<PopularComparisonType[]> {
    try {
      // Clear existing
      await PopularComparison.deleteMany({});
      
      // Create new
      const newComparisons = comparisons.map((comp, index) => ({
        id: `comparison-${comp.model1Id}-${comp.model2Id}-${Date.now()}`,
        ...comp,
        order: comp.order || index + 1,
        isActive: comp.isActive ?? true,
        createdAt: new Date()
      }));
      
      await PopularComparison.insertMany(newComparisons);
      return await this.getPopularComparisons();
    } catch (error) {
      console.error('savePopularComparisons error:', error);
      throw new Error('Failed to save popular comparisons');
    }
  }

  // ============================================
  // ADMIN USERS
  // ============================================

  async getAdminUser(email: string): Promise<AdminUserType | undefined> {
    try {
      const user = await AdminUser.findOne({ email, isActive: true }).lean();
      return user ? (user as AdminUserType) : undefined;
    } catch (error) {
      console.error('getAdminUser error:', error);
      throw new Error('Failed to fetch admin user');
    }
  }

  async getAdminUserById(id: string): Promise<AdminUserType | undefined> {
    try {
      const user = await AdminUser.findOne({ id, isActive: true }).lean();
      return user ? (user as AdminUserType) : undefined;
    } catch (error) {
      console.error('getAdminUserById error:', error);
      throw new Error('Failed to fetch admin user');
    }
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUserType> {
    try {
      // Generate unique ID using email
      const emailSlug = user.email.split('@')[0].toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      const baseId = `admin-${emailSlug}`;
      let uniqueId = baseId;
      let counter = 1;
      
      // Check for existing IDs and make it unique
      while (await AdminUser.findOne({ id: uniqueId })) {
        uniqueId = `${baseId}-${counter}`;
        counter++;
      }
      
      const newUser = new AdminUser({
        id: uniqueId,
        ...user,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await newUser.save();
      console.log(`✅ Created admin user: ${user.email} with ID: ${uniqueId}`);
      return newUser.toObject() as AdminUserType;
    } catch (error) {
      console.error('createAdminUser error:', error);
      if (error.code === 11000) {
        throw new Error('Admin user with this email already exists');
      }
      throw new Error('Failed to create admin user');
    }
  }

  async updateAdminUserLogin(id: string): Promise<void> {
    try {
      await AdminUser.findOneAndUpdate(
        { id },
        { 
          $set: { 
            lastLogin: new Date(),
            updatedAt: new Date()
          }
        }
      );
    } catch (error) {
      console.error('updateAdminUserLogin error:', error);
      throw new Error('Failed to update admin user login');
    }
  }

  // ============================================
  // SESSION MANAGEMENT (In-Memory)
  // ============================================

  async createSession(userId: string, token: string): Promise<void> {
    this.activeSessions.set(userId, token);
  }

  async getActiveSession(userId: string): Promise<string | null> {
    return this.activeSessions.get(userId) || null;
  }

  async invalidateSession(userId: string): Promise<void> {
    this.activeSessions.delete(userId);
  }

  async isSessionValid(userId: string, token: string): Promise<boolean> {
    const activeToken = this.activeSessions.get(userId);
    return activeToken === token;
  }

  // ============================================
  // STATS
  // ============================================

  async getStats(): Promise<{ totalBrands: number; totalModels: number; totalVariants: number }> {
    try {
      const [totalBrands, totalModels, totalVariants] = await Promise.all([
        Brand.countDocuments(),
        Model.countDocuments(),
        Variant.countDocuments()
      ]);
      
      return { totalBrands, totalModels, totalVariants };
    } catch (error) {
      console.error('getStats error:', error);
      throw new Error('Failed to fetch stats');
    }
  }
}
