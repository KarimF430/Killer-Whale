import mongoose from 'mongoose';
import { IStorage } from '../storage';
import { Brand as MongoBrand, Model as MongoModel, Variant as MongoVariant, AdminUser as MongoAdminUser, PopularComparison as MongoPopularComparison } from './schemas';
import type {
  Brand,
  Model,
  Variant,
  AdminUser,
  PopularComparison,
  InsertBrand,
  InsertModel,
  InsertVariant,
  InsertPopularComparison,
  InsertAdminUser
} from '@shared/schema';

// Helper function to map Mongoose documents to shared types
function mapBrand(doc: any): Brand {
  return {
    id: doc.id,
    name: doc.name,
    logo: doc.logo || null,
    ranking: doc.ranking,
    status: doc.status,
    summary: doc.summary || null,
    faqs: doc.faqs || [],
    createdAt: doc.createdAt
  };
}

function mapModel(doc: any): Model {
  return {
    id: doc.id,
    brandId: doc.brandId,
    name: doc.name,
    isPopular: doc.isPopular || false,
    isNew: doc.isNew || false,
    popularRank: doc.popularRank || null,
    newRank: doc.newRank || null,
    bodyType: doc.bodyType || null,
    subBodyType: doc.subBodyType || null,
    launchDate: doc.launchDate || null,
    fuelTypes: doc.fuelTypes || [],
    transmissions: doc.transmissions || [],
    brochureUrl: doc.brochureUrl || null,
    status: doc.status,
    headerSeo: doc.headerSeo || null,
    pros: doc.pros || null,
    cons: doc.cons || null,
    description: doc.description || null,
    exteriorDesign: doc.exteriorDesign || null,
    comfortConvenience: doc.comfortConvenience || null,
    engineSummaries: doc.engineSummaries || [],
    mileageData: doc.mileageData || [],
    faqs: doc.faqs || [],
    keySpecs: doc.keySpecs || [],
    heroImage: doc.heroImage || null,
    galleryImages: doc.galleryImages || [],
    keyFeatureImages: doc.keyFeatureImages || [],
    spaceComfortImages: doc.spaceComfortImages || [],
    storageConvenienceImages: doc.storageConvenienceImages || [],
    colorImages: doc.colorImages || [],
    createdAt: doc.createdAt
  };
}

function mapVariant(doc: any): Variant {
  return {
    id: doc.id,
    brandId: doc.brandId,
    modelId: doc.modelId,
    name: doc.name,
    price: doc.price,
    status: doc.status,
    description: doc.description || null,
    exteriorDesign: doc.exteriorDesign || null,
    comfortConvenience: doc.comfortConvenience || null,
    // Maps to specific schema fields instead of grouped objects
    fuelType: doc.fuelType || null,
    transmission: doc.transmission || null,

    // Safety Features
    globalNCAPRating: doc.globalNCAPRating || null,
    airbags: doc.airbags || null,
    airbagsLocation: doc.airbagsLocation || null,
    adasLevel: doc.adasLevel || null,
    adasFeatures: doc.adasFeatures || null,
    reverseCamera: doc.reverseCamera || null,
    reverseCameraGuidelines: doc.reverseCameraGuidelines || null,
    tyrePressureMonitor: doc.tyrePressureMonitor || null,
    hillHoldAssist: doc.hillHoldAssist || null,
    hillDescentControl: doc.hillDescentControl || null,
    rollOverMitigation: doc.rollOverMitigation || null,
    parkingSensor: doc.parkingSensor || null,
    discBrakes: doc.discBrakes || null,
    electronicStabilityProgram: doc.electronicStabilityProgram || null,
    abs: doc.abs || null,
    ebd: doc.ebd || null,
    brakeAssist: doc.brakeAssist || null,
    isofixMounts: doc.isofixMounts || null,
    seatbeltWarning: doc.seatbeltWarning || null,
    speedAlertSystem: doc.speedAlertSystem || null,
    speedSensingDoorLocks: doc.speedSensingDoorLocks || null,
    immobiliser: doc.immobiliser || null,

    // Entertainment & Connectivity
    touchScreenInfotainment: doc.touchScreenInfotainment || null,
    androidAppleCarplay: doc.androidAppleCarplay || null,
    speakers: doc.speakers || null,
    tweeters: doc.tweeters || null,
    subwoofers: doc.subwoofers || null,
    usbCChargingPorts: doc.usbCChargingPorts || null,
    usbAChargingPorts: doc.usbAChargingPorts || null,
    twelvevChargingPorts: doc.twelvevChargingPorts || null,
    wirelessCharging: doc.wirelessCharging || null,
    connectedCarTech: doc.connectedCarTech || null,

    // Comfort & Convenience
    ventilatedSeats: doc.ventilatedSeats || null,
    sunroof: doc.sunroof || null,
    airPurifier: doc.airPurifier || null,
    headsUpDisplay: doc.headsUpDisplay || null,
    cruiseControl: doc.cruiseControl || null,
    rainSensingWipers: doc.rainSensingWipers || null,
    automaticHeadlamp: doc.automaticHeadlamp || null,
    followMeHomeHeadlights: doc.followMeHomeHeadlights || null,
    keylessEntry: doc.keylessEntry || null,
    ignition: doc.ignition || null,
    ambientLighting: doc.ambientLighting || null,
    steeringAdjustment: doc.steeringAdjustment || null,
    airConditioning: doc.airConditioning || null,
    climateZones: doc.climateZones || null,
    rearACVents: doc.rearACVents || null,
    frontArmrest: doc.frontArmrest || null,
    rearArmrest: doc.rearArmrest || null,
    insideRearViewMirror: doc.insideRearViewMirror || null,
    outsideRearViewMirrors: doc.outsideRearViewMirrors || null,
    steeringMountedControls: doc.steeringMountedControls || null,
    rearWindshieldDefogger: doc.rearWindshieldDefogger || null,
    frontWindshieldDefogger: doc.frontWindshieldDefogger || null,
    cooledGlovebox: doc.cooledGlovebox || null,

    // Engine Data
    engineName: doc.engineName || null,
    engineSummary: doc.engineSummary || null,
    engineTransmission: doc.engineTransmission || null,
    enginePower: doc.enginePower || null,
    engineTorque: doc.engineTorque || null,
    engineSpeed: doc.engineSpeed || null,

    // Mileage
    mileageEngineName: doc.mileageEngineName || null,
    mileageCompanyClaimed: doc.mileageCompanyClaimed || null,
    mileageCityRealWorld: doc.mileageCityRealWorld || null,
    mileageHighwayRealWorld: doc.mileageHighwayRealWorld || null,

    // Other
    keyFeatures: doc.keyFeatures || null,
    headerSummary: doc.headerSummary || null,
    isValueForMoney: doc.isValueForMoney || false,
    highlightImages: doc.highlightImages || [],
    createdAt: doc.createdAt
  };
}

function mapPopularComparison(doc: any): PopularComparison {
  return {
    id: doc.id,
    model1Id: doc.model1Id,
    model2Id: doc.model2Id,
    order: doc.order,
    isActive: doc.isActive,
    createdAt: doc.createdAt
  };
}

function mapAdminUser(doc: any): AdminUser {
  return {
    id: doc.id,
    email: doc.email,
    password: doc.password,
    name: doc.name,
    role: doc.role,
    isActive: doc.isActive,
    lastLogin: doc.lastLogin || null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

export class MongoDBStorage implements IStorage {
  private activeSessions: Map<string, string> = new Map();

  async connect(uri: string): Promise<void> {
    const { initializeMongoDBOptimized } = await import('./mongodb-config');
    await initializeMongoDBOptimized(uri);
  }

  // ============================================
  // BRANDS
  // ============================================

  async getBrands(includeInactive?: boolean): Promise<Brand[]> {
    try {
      const filter = includeInactive ? {} : { status: 'active' };
      const brands = await MongoBrand.find(filter).sort({ ranking: 1 }).lean();
      return brands.map(mapBrand);
    } catch (error) {
      console.error('getBrands error:', error);
      throw new Error('Failed to fetch brands');
    }
  }

  async getBrand(id: string): Promise<Brand | undefined> {
    try {
      const brand = await MongoBrand.findOne({ id }).lean();
      return brand ? mapBrand(brand) : undefined;
    } catch (error) {
      console.error('getBrand error:', error);
      throw new Error('Failed to fetch brand');
    }
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    try {
      const newBrand = await MongoBrand.create(brand);
      return mapBrand(newBrand.toObject());
    } catch (error) {
      console.error('createBrand error:', error);
      throw new Error('Failed to create brand');
    }
  }

  async updateBrand(id: string, brand: Partial<InsertBrand>): Promise<Brand | undefined> {
    try {
      const updatedBrand = await MongoBrand.findOneAndUpdate(
        { id },
        { $set: brand },
        { new: true }
      ).lean();
      return updatedBrand ? mapBrand(updatedBrand) : undefined;
    } catch (error) {
      console.error('updateBrand error:', error);
      throw new Error('Failed to update brand');
    }
  }

  async deleteBrand(id: string): Promise<boolean> {
    try {
      const result = await MongoBrand.deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('deleteBrand error:', error);
      throw new Error('Failed to delete brand');
    }
  }

  async getAvailableRankings(excludeBrandId?: string): Promise<number[]> {
    try {
      const filter = excludeBrandId ? { id: { $ne: excludeBrandId } } : {};
      const brands = await MongoBrand.find(filter).select('ranking').lean();
      return brands.map(b => b.ranking).sort((a, b) => a - b);
    } catch (error) {
      console.error('getAvailableRankings error:', error);
      throw new Error('Failed to fetch available rankings');
    }
  }

  // ============================================
  // MODELS
  // ============================================

  async getModels(brandId?: string): Promise<Model[]> {
    try {
      const filter: any = {};
      if (brandId) filter.brandId = brandId;

      const models = await MongoModel.find(filter).sort({ name: 1 }).lean();
      return models.map(mapModel);
    } catch (error) {
      console.error('getModels error:', error);
      throw new Error('Failed to fetch models');
    }
  }

  async getModel(id: string): Promise<Model | undefined> {
    try {
      const model = await MongoModel.findOne({ id }).lean();
      return model ? mapModel(model) : undefined;
    } catch (error) {
      console.error('getModel error:', error);
      throw new Error('Failed to fetch model');
    }
  }

  async createModel(model: InsertModel): Promise<Model> {
    try {
      const newModel = await MongoModel.create(model);
      return mapModel(newModel.toObject());
    } catch (error) {
      console.error('createModel error:', error);
      throw new Error('Failed to create model');
    }
  }

  async updateModel(id: string, model: Partial<InsertModel>): Promise<Model | undefined> {
    try {
      const updatedModel = await MongoModel.findOneAndUpdate(
        { id },
        { $set: model },
        { new: true }
      ).lean();
      return updatedModel ? mapModel(updatedModel) : undefined;
    } catch (error) {
      console.error('updateModel error:', error);
      throw new Error('Failed to update model');
    }
  }

  async deleteModel(id: string): Promise<boolean> {
    try {
      // First delete all variants associated with this model
      await MongoVariant.deleteMany({ modelId: id });

      // Then delete the model
      const modelDeleteResult = await MongoModel.deleteOne({ id });

      return modelDeleteResult.deletedCount > 0;
    } catch (error) {
      console.error('deleteModel cascade error:', error);
      throw new Error('Failed to delete model and related variants');
    }
  }

  async getPopularModels(limit: number = 20): Promise<Model[]> {
    try {
      const models = await MongoModel.find({ isPopular: true, status: 'active' })
        .sort({ popularRank: 1 })
        .limit(limit)
        .lean();
      return models.map(mapModel);
    } catch (error) {
      console.error('getPopularModels error:', error);
      throw new Error('Failed to fetch popular models');
    }
  }

  // ============================================
  // VARIANTS
  // ============================================

  async getVariants(modelId?: string, brandId?: string): Promise<Variant[]> {
    try {
      const filter: any = {};
      if (modelId) filter.modelId = modelId;
      if (brandId) filter.brandId = brandId;

      const variants = await MongoVariant.find(filter).sort({ price: 1 }).lean();
      return variants.map(mapVariant);
    } catch (error) {
      console.error('getVariants error:', error);
      throw new Error('Failed to fetch variants');
    }
  }

  async getVariant(id: string): Promise<Variant | undefined> {
    try {
      const variant = await MongoVariant.findOne({ id }).lean();
      return variant ? mapVariant(variant) : undefined;
    } catch (error) {
      console.error('getVariant error:', error);
      throw new Error('Failed to fetch variant');
    }
  }

  async createVariant(variant: InsertVariant): Promise<Variant> {
    try {
      const newVariant = await MongoVariant.create(variant);
      return mapVariant(newVariant.toObject());
    } catch (error) {
      console.error('createVariant error:', error);
      throw new Error('Failed to create variant');
    }
  }

  async updateVariant(id: string, variant: Partial<InsertVariant>): Promise<Variant | undefined> {
    try {
      const updatedVariant = await MongoVariant.findOneAndUpdate(
        { id },
        { $set: variant },
        { new: true }
      ).lean();
      return updatedVariant ? mapVariant(updatedVariant) : undefined;
    } catch (error) {
      console.error('updateVariant error:', error);
      throw new Error('Failed to update variant');
    }
  }

  async deleteVariant(id: string): Promise<boolean> {
    try {
      const result = await MongoVariant.deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('deleteVariant error:', error);
      throw new Error('Failed to delete variant');
    }
  }

  // ============================================
  // POPULAR COMPARISONS
  // ============================================

  async getPopularComparisons(): Promise<PopularComparison[]> {
    try {
      const comparisons = await MongoPopularComparison.find({ isActive: true })
        .sort({ order: 1 })
        .lean();
      return comparisons.map(mapPopularComparison);
    } catch (error) {
      console.error('getPopularComparisons error:', error);
      throw new Error('Failed to fetch popular comparisons');
    }
  }

  async savePopularComparisons(comparisons: InsertPopularComparison[]): Promise<PopularComparison[]> {
    try {
      // Clear existing comparisons
      await MongoPopularComparison.deleteMany({});

      // Insert new comparisons
      const result = await MongoPopularComparison.insertMany(comparisons);
      return result.map(c => mapPopularComparison(c.toObject()));
    } catch (error) {
      console.error('savePopularComparisons error:', error);
      throw new Error('Failed to save popular comparisons');
    }
  }

  // ============================================
  // ADMIN USERS
  // ============================================

  async getAdminUser(email: string): Promise<AdminUser | undefined> {
    try {
      const user = await MongoAdminUser.findOne({ email }).lean();
      return user ? mapAdminUser(user) : undefined;
    } catch (error) {
      console.error('getAdminUser error:', error);
      throw new Error('Failed to fetch admin user');
    }
  }

  async getAdminUserById(id: string): Promise<AdminUser | undefined> {
    try {
      const user = await MongoAdminUser.findOne({ id }).lean();
      return user ? mapAdminUser(user) : undefined;
    } catch (error) {
      console.error('getAdminUserById error:', error);
      throw new Error('Failed to fetch admin user by ID');
    }
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    try {
      const newUser = await MongoAdminUser.create(user);
      return mapAdminUser(newUser.toObject());
    } catch (error) {
      console.error('createAdminUser error:', error);
      throw new Error('Failed to create admin user');
    }
  }

  async updateAdminUserLogin(id: string): Promise<void> {
    try {
      await MongoAdminUser.updateOne(
        { id },
        { $set: { lastLogin: new Date() } }
      );
    } catch (error) {
      console.error('updateAdminUserLogin error:', error);
      throw new Error('Failed to update admin user login');
    }
  }

  // ============================================
  // SESSION MANAGEMENT
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

  async getStats(): Promise<{
    totalBrands: number;
    totalModels: number;
    totalVariants: number;
  }> {
    try {
      const [totalBrands, totalModels, totalVariants] = await Promise.all([
        MongoBrand.countDocuments({ status: 'active' }),
        MongoModel.countDocuments({ status: 'active' }),
        MongoVariant.countDocuments({ status: 'active' })
      ]);

      return {
        totalBrands,
        totalModels,
        totalVariants
      };
    } catch (error) {
      console.error('getStats error:', error);
      throw new Error('Failed to fetch stats');
    }
  }
}
