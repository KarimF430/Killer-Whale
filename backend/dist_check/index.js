var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/validation/schemas.ts
var schemas_exports = {};
__export(schemas_exports, {
  insertAdminUserSchema: () => insertAdminUserSchema,
  insertBrandSchema: () => insertBrandSchema,
  insertModelSchema: () => insertModelSchema,
  insertPopularComparisonSchema: () => insertPopularComparisonSchema,
  insertUpcomingCarSchema: () => insertUpcomingCarSchema,
  insertVariantSchema: () => insertVariantSchema
});
import { z } from "zod";
var insertBrandSchema, insertModelSchema, insertUpcomingCarSchema, insertVariantSchema, insertPopularComparisonSchema, insertAdminUserSchema;
var init_schemas = __esm({
  "server/validation/schemas.ts"() {
    "use strict";
    insertBrandSchema = z.object({
      name: z.string().min(1, "Brand name is required"),
      logo: z.string().optional(),
      status: z.string().default("active"),
      summary: z.string().optional(),
      faqs: z.array(z.object({
        question: z.string(),
        answer: z.string()
      })).default([])
    });
    insertModelSchema = z.object({
      name: z.string().min(1, "Model name is required"),
      brandId: z.string().min(1, "Brand ID is required"),
      status: z.string().default("active"),
      isPopular: z.boolean().default(false),
      isNew: z.boolean().default(false),
      popularRank: z.number().nullable().optional(),
      newRank: z.number().nullable().optional(),
      bodyType: z.union([z.string(), z.null()]).optional(),
      subBodyType: z.union([z.string(), z.null()]).optional(),
      launchDate: z.union([z.string(), z.null()]).optional(),
      seating: z.number().default(5),
      fuelTypes: z.array(z.string()).default([]),
      transmissions: z.array(z.string()).default([]),
      brochureUrl: z.union([z.string(), z.null()]).optional(),
      headerSeo: z.union([z.string(), z.null()]).optional(),
      pros: z.union([z.string(), z.null()]).optional(),
      cons: z.union([z.string(), z.null()]).optional(),
      description: z.union([z.string(), z.null()]).optional(),
      exteriorDesign: z.union([z.string(), z.null()]).optional(),
      comfortConvenience: z.union([z.string(), z.null()]).optional(),
      summary: z.union([z.string(), z.null()]).optional(),
      engineSummaries: z.array(z.object({
        title: z.string(),
        summary: z.string(),
        transmission: z.string(),
        power: z.string(),
        torque: z.string(),
        speed: z.string()
      })).default([]),
      mileageData: z.array(z.object({
        engineName: z.string(),
        companyClaimed: z.string(),
        cityRealWorld: z.string(),
        highwayRealWorld: z.string()
      })).default([]),
      faqs: z.array(z.object({
        question: z.string(),
        answer: z.string()
      })).default([]),
      heroImage: z.union([z.string(), z.null()]).optional(),
      galleryImages: z.array(z.object({
        url: z.string(),
        caption: z.string()
      })).default([]),
      keyFeatureImages: z.array(z.object({
        url: z.string(),
        caption: z.string()
      })).default([]),
      spaceComfortImages: z.array(z.object({
        url: z.string(),
        caption: z.string()
      })).default([]),
      storageConvenienceImages: z.array(z.object({
        url: z.string(),
        caption: z.string()
      })).default([]),
      colorImages: z.array(z.object({
        url: z.string(),
        caption: z.string()
      })).default([])
    });
    insertUpcomingCarSchema = z.object({
      name: z.string().min(1, "Car name is required"),
      brandId: z.string().min(1, "Brand ID is required"),
      status: z.string().default("active"),
      isPopular: z.boolean().default(false),
      isNew: z.boolean().default(false),
      popularRank: z.number().nullable().optional(),
      newRank: z.number().nullable().optional(),
      bodyType: z.union([z.string(), z.null()]).optional(),
      subBodyType: z.union([z.string(), z.null()]).optional(),
      expectedLaunchDate: z.union([z.string(), z.null()]).optional(),
      seating: z.number().default(5),
      fuelTypes: z.array(z.string()).default([]),
      transmissions: z.array(z.string()).default([]),
      brochureUrl: z.union([z.string(), z.null()]).optional(),
      // Price Range
      expectedPriceMin: z.number().min(0, "Minimum price must be positive").nullable().optional(),
      expectedPriceMax: z.number().min(0, "Maximum price must be positive").nullable().optional(),
      headerSeo: z.union([z.string(), z.null()]).optional(),
      pros: z.union([z.string(), z.null()]).optional(),
      cons: z.union([z.string(), z.null()]).optional(),
      description: z.union([z.string(), z.null()]).optional(),
      exteriorDesign: z.union([z.string(), z.null()]).optional(),
      comfortConvenience: z.union([z.string(), z.null()]).optional(),
      summary: z.union([z.string(), z.null()]).optional(),
      engineSummaries: z.array(z.object({
        title: z.string(),
        summary: z.string(),
        transmission: z.string(),
        power: z.string(),
        torque: z.string(),
        speed: z.string()
      })).default([]),
      mileageData: z.array(z.object({
        engineName: z.string(),
        companyClaimed: z.string(),
        cityRealWorld: z.string(),
        highwayRealWorld: z.string()
      })).default([]),
      faqs: z.array(z.object({
        question: z.string(),
        answer: z.string()
      })).default([]),
      heroImage: z.union([z.string(), z.null()]).optional(),
      galleryImages: z.array(z.object({
        url: z.string(),
        caption: z.string()
      })).default([]),
      keyFeatureImages: z.array(z.object({
        url: z.string(),
        caption: z.string()
      })).default([]),
      spaceComfortImages: z.array(z.object({
        url: z.string(),
        caption: z.string()
      })).default([]),
      storageConvenienceImages: z.array(z.object({
        url: z.string(),
        caption: z.string()
      })).default([]),
      colorImages: z.array(z.object({
        url: z.string(),
        caption: z.string()
      })).default([])
    }).refine(
      (data) => {
        if (data.expectedPriceMin != null && data.expectedPriceMax != null) {
          return data.expectedPriceMax >= data.expectedPriceMin;
        }
        return true;
      },
      {
        message: "Expected maximum price must be greater than or equal to minimum price",
        path: ["expectedPriceMax"]
      }
    );
    insertVariantSchema = z.object({
      name: z.string().min(1, "Variant name is required"),
      brandId: z.string().min(1, "Brand ID is required"),
      modelId: z.string().min(1, "Model ID is required"),
      price: z.number().min(0, "Price must be a positive number"),
      status: z.string().default("active"),
      description: z.string().optional(),
      isValueForMoney: z.boolean().default(false),
      keyFeatures: z.string().optional(),
      headerSummary: z.string().optional(),
      exteriorDesign: z.string().optional(),
      comfortConvenience: z.string().optional(),
      // Engine & Performance
      engineName: z.string().optional(),
      engineSummary: z.string().optional(),
      engineTransmission: z.string().optional(),
      enginePower: z.string().optional(),
      engineTorque: z.string().optional(),
      engineSpeed: z.string().optional(),
      engineType: z.string().optional(),
      displacement: z.string().optional(),
      power: z.string().optional(),
      torque: z.string().optional(),
      transmission: z.string().optional(),
      driveType: z.string().optional(),
      fuelType: z.string().optional(),
      fuel: z.string().optional(),
      // Mileage
      mileageEngineName: z.string().optional(),
      mileageCompanyClaimed: z.string().optional(),
      mileageCityRealWorld: z.string().optional(),
      mileageHighwayRealWorld: z.string().optional(),
      mileageCity: z.string().optional(),
      mileageHighway: z.string().optional(),
      fuelTankCapacity: z.string().optional(),
      emissionStandard: z.string().optional(),
      // Dimensions
      groundClearance: z.string().optional(),
      length: z.string().optional(),
      width: z.string().optional(),
      height: z.string().optional(),
      wheelbase: z.string().optional(),
      turningRadius: z.string().optional(),
      kerbWeight: z.string().optional(),
      seatingCapacity: z.string().optional(),
      doors: z.string().optional(),
      // Safety Features
      globalNCAPRating: z.string().optional(),
      airbags: z.string().optional(),
      airbagsLocation: z.string().optional(),
      adasLevel: z.string().optional(),
      adasFeatures: z.string().optional(),
      reverseCamera: z.string().optional(),
      abs: z.string().optional(),
      ebd: z.string().optional(),
      esc: z.string().optional(),
      tractionControl: z.string().optional(),
      // Comfort & Convenience
      ventilatedSeats: z.string().optional(),
      sunroof: z.string().optional(),
      airPurifier: z.string().optional(),
      headsUpDisplay: z.string().optional(),
      cruiseControl: z.string().optional(),
      rainSensingWipers: z.string().optional(),
      automaticHeadlamp: z.string().optional(),
      keylessEntry: z.string().optional(),
      ignition: z.string().optional(),
      ambientLighting: z.string().optional(),
      steeringAdjustment: z.string().optional(),
      airConditioning: z.string().optional(),
      climateControl: z.string().optional(),
      pushButtonStart: z.string().optional(),
      powerWindows: z.string().optional(),
      powerSteering: z.string().optional(),
      // Infotainment
      touchScreenInfotainment: z.string().optional(),
      androidAppleCarplay: z.string().optional(),
      speakers: z.string().optional(),
      infotainmentScreen: z.string().optional(),
      bluetooth: z.string().optional(),
      usb: z.string().optional(),
      aux: z.string().optional(),
      androidAuto: z.string().optional(),
      appleCarPlay: z.string().optional(),
      // Images
      highlightImages: z.array(z.object({
        url: z.string(),
        caption: z.string()
      })).default([]),
      // Connected Car Tech
      connectedCarTech: z.string().optional(),
      // Warranty
      warranty: z.string().optional()
    });
    insertPopularComparisonSchema = z.object({
      model1Id: z.string().min(1, "Model 1 ID is required"),
      model2Id: z.string().min(1, "Model 2 ID is required"),
      order: z.number().min(1, "Order is required"),
      isActive: z.boolean().default(true)
    });
    insertAdminUserSchema = z.object({
      email: z.string().email("Valid email is required"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      name: z.string().min(1, "Name is required"),
      role: z.string().default("admin"),
      isActive: z.boolean().default(true)
    });
  }
});

// server/db/schemas.ts
var schemas_exports2 = {};
__export(schemas_exports2, {
  AdminUser: () => AdminUser,
  Brand: () => Brand,
  Model: () => Model,
  NewsArticle: () => NewsArticle,
  NewsAuthor: () => NewsAuthor,
  NewsCategory: () => NewsCategory,
  NewsMedia: () => NewsMedia,
  NewsTag: () => NewsTag,
  PopularComparison: () => PopularComparison,
  Review: () => Review,
  ReviewComment: () => ReviewComment,
  UpcomingCar: () => UpcomingCar,
  User: () => User,
  Variant: () => Variant
});
import mongoose from "mongoose";
var brandSchema, modelSchema, upcomingCarSchema, variantSchema, adminUserSchema, popularComparisonSchema, newsArticleSchema, newsCategorySchema, newsTagSchema, newsAuthorSchema, newsMediaSchema, userSchema, reviewCommentSchema, reviewSchema, Brand, Model, UpcomingCar, Variant, AdminUser, PopularComparison, NewsArticle, NewsCategory, NewsTag, NewsAuthor, NewsMedia, User, Review, ReviewComment;
var init_schemas2 = __esm({
  "server/db/schemas.ts"() {
    "use strict";
    brandSchema = new mongoose.Schema({
      id: { type: String, required: true },
      name: { type: String, required: true },
      logo: { type: String, default: null },
      ranking: { type: Number, required: true },
      status: { type: String, default: "active" },
      summary: { type: String, default: null },
      faqs: [{
        question: { type: String, required: true },
        answer: { type: String, required: true }
      }],
      createdAt: { type: Date, default: Date.now }
    });
    brandSchema.index({ id: 1 }, { unique: true });
    brandSchema.index({ status: 1, ranking: 1 });
    brandSchema.index({ name: 1 });
    modelSchema = new mongoose.Schema({
      id: { type: String, required: true },
      name: { type: String, required: true },
      brandId: { type: String, required: true },
      status: { type: String, default: "active" },
      // Popularity & Rankings
      isPopular: { type: Boolean, default: false },
      isNew: { type: Boolean, default: false },
      popularRank: { type: Number, default: null },
      newRank: { type: Number, default: null },
      topRank: { type: Number, default: null },
      // Ranking for Top Cars section (1-10)
      // Basic Info
      bodyType: { type: String, default: null },
      subBodyType: { type: String, default: null },
      launchDate: { type: String, default: null },
      seating: { type: Number, default: 5 },
      fuelTypes: { type: [String], default: [] },
      transmissions: { type: [String], default: [] },
      brochureUrl: { type: String, default: null },
      // SEO & Content
      headerSeo: { type: String, default: null },
      pros: { type: String, default: null },
      cons: { type: String, default: null },
      description: { type: String, default: null },
      exteriorDesign: { type: String, default: null },
      comfortConvenience: { type: String, default: null },
      summary: { type: String, default: null },
      // Engine Summaries
      engineSummaries: [{
        title: { type: String },
        summary: { type: String },
        transmission: { type: String },
        power: { type: String },
        torque: { type: String },
        speed: { type: String }
      }],
      // Mileage Data
      mileageData: [{
        engineName: { type: String },
        companyClaimed: { type: String },
        cityRealWorld: { type: String },
        highwayRealWorld: { type: String }
      }],
      // FAQs
      faqs: [{
        question: { type: String, required: true },
        answer: { type: String, required: true }
      }],
      // Images
      heroImage: { type: String, default: null },
      galleryImages: [{
        url: { type: String },
        caption: { type: String }
      }],
      keyFeatureImages: [{
        url: { type: String },
        caption: { type: String }
      }],
      spaceComfortImages: [{
        url: { type: String },
        caption: { type: String }
      }],
      storageConvenienceImages: [{
        url: { type: String },
        caption: { type: String }
      }],
      colorImages: [{
        url: { type: String },
        caption: { type: String }
      }],
      createdAt: { type: Date, default: Date.now }
    });
    modelSchema.pre("save", async function() {
      const Brand2 = mongoose.model("Brand");
      const brand = await Brand2.findOne({ id: this.brandId });
      if (!brand) {
        throw new Error(`Invalid brandId: ${this.brandId}. Brand does not exist.`);
      }
    });
    modelSchema.index({ id: 1 }, { unique: true });
    modelSchema.index({ brandId: 1, status: 1 });
    modelSchema.index({ name: 1 });
    modelSchema.index({ isPopular: 1, popularRank: 1 });
    modelSchema.index({ isNew: 1, newRank: 1 });
    modelSchema.index({ bodyType: 1, status: 1 });
    modelSchema.index({ brandId: 1, status: 1, name: 1 });
    modelSchema.index({ status: 1, launchDate: -1 });
    upcomingCarSchema = new mongoose.Schema({
      id: { type: String, required: true },
      name: { type: String, required: true },
      brandId: { type: String, required: true },
      status: { type: String, default: "active" },
      // Popularity & Rankings
      isPopular: { type: Boolean, default: false },
      isNew: { type: Boolean, default: false },
      popularRank: { type: Number, default: null },
      newRank: { type: Number, default: null },
      // Basic Info
      bodyType: { type: String, default: null },
      subBodyType: { type: String, default: null },
      expectedLaunchDate: { type: String, default: null },
      // Different from model
      seating: { type: Number, default: 5 },
      fuelTypes: { type: [String], default: [] },
      transmissions: { type: [String], default: [] },
      brochureUrl: { type: String, default: null },
      // Price Range (Different from model)
      expectedPriceMin: { type: Number, default: null },
      expectedPriceMax: { type: Number, default: null },
      // SEO & Content
      headerSeo: { type: String, default: null },
      pros: { type: String, default: null },
      cons: { type: String, default: null },
      description: { type: String, default: null },
      exteriorDesign: { type: String, default: null },
      comfortConvenience: { type: String, default: null },
      summary: { type: String, default: null },
      // Engine Summaries
      engineSummaries: [{
        title: { type: String },
        summary: { type: String },
        transmission: { type: String },
        power: { type: String },
        torque: { type: String },
        speed: { type: String }
      }],
      // Mileage Data
      mileageData: [{
        engineName: { type: String },
        companyClaimed: { type: String },
        cityRealWorld: { type: String },
        highwayRealWorld: { type: String }
      }],
      // FAQs
      faqs: [{
        question: { type: String, required: true },
        answer: { type: String, required: true }
      }],
      // Images
      heroImage: { type: String, default: null },
      galleryImages: [{
        url: { type: String },
        caption: { type: String }
      }],
      keyFeatureImages: [{
        url: { type: String },
        caption: { type: String }
      }],
      spaceComfortImages: [{
        url: { type: String },
        caption: { type: String }
      }],
      storageConvenienceImages: [{
        url: { type: String },
        caption: { type: String }
      }],
      colorImages: [{
        url: { type: String },
        caption: { type: String }
      }],
      createdAt: { type: Date, default: Date.now }
    });
    upcomingCarSchema.pre("save", async function() {
      const Brand2 = mongoose.model("Brand");
      const brand = await Brand2.findOne({ id: this.brandId });
      if (!brand) {
        throw new Error(`Invalid brandId: ${this.brandId}. Brand does not exist.`);
      }
    });
    upcomingCarSchema.index({ id: 1 }, { unique: true });
    upcomingCarSchema.index({ brandId: 1, status: 1 });
    upcomingCarSchema.index({ name: 1 });
    upcomingCarSchema.index({ isPopular: 1, popularRank: 1 });
    upcomingCarSchema.index({ isNew: 1, newRank: 1 });
    upcomingCarSchema.index({ bodyType: 1, status: 1 });
    upcomingCarSchema.index({ brandId: 1, status: 1, name: 1 });
    upcomingCarSchema.index({ status: 1, expectedLaunchDate: 1 });
    variantSchema = new mongoose.Schema({
      id: { type: String, required: true },
      name: { type: String, required: true },
      brandId: { type: String, required: true },
      modelId: { type: String, required: true },
      price: { type: Number, required: true },
      status: { type: String, default: "active" },
      description: { type: String, default: null },
      // Key Features
      isValueForMoney: { type: Boolean, default: false },
      keyFeatures: { type: String, default: null },
      headerSummary: { type: String, default: null },
      // Design & Styling
      exteriorDesign: { type: String, default: null },
      comfortConvenience: { type: String, default: null },
      // Engine Specifications
      engineName: { type: String, default: null },
      engineSummary: { type: String, default: null },
      engineTransmission: { type: String, default: null },
      enginePower: { type: String, default: null },
      engineTorque: { type: String, default: null },
      engineSpeed: { type: String, default: null },
      engineType: { type: String, default: null },
      displacement: { type: String, default: null },
      power: { type: String, default: null },
      torque: { type: String, default: null },
      transmission: { type: String, default: null },
      driveType: { type: String, default: null },
      fuelType: { type: String, default: null },
      fuel: { type: String, default: null },
      // Mileage
      mileageEngineName: { type: String, default: null },
      mileageCompanyClaimed: { type: String, default: null },
      mileageCityRealWorld: { type: String, default: null },
      mileageHighwayRealWorld: { type: String, default: null },
      mileageCity: { type: String, default: null },
      mileageHighway: { type: String, default: null },
      fuelTankCapacity: { type: String, default: null },
      emissionStandard: { type: String, default: null },
      // Dimensions
      groundClearance: { type: String, default: null },
      length: { type: String, default: null },
      width: { type: String, default: null },
      height: { type: String, default: null },
      wheelbase: { type: String, default: null },
      turningRadius: { type: String, default: null },
      kerbWeight: { type: String, default: null },
      frontTyreProfile: { type: String, default: null },
      rearTyreProfile: { type: String, default: null },
      spareTyreProfile: { type: String, default: null },
      spareWheelType: { type: String, default: null },
      cupholders: { type: String, default: null },
      bootSpace: { type: String, default: null },
      bootSpaceAfterFoldingRearRowSeats: { type: String, default: null },
      seatingCapacity: { type: String, default: null },
      doors: { type: String, default: null },
      // Performance
      engineNamePage4: { type: String, default: null },
      engineCapacity: { type: String, default: null },
      noOfGears: { type: String, default: null },
      paddleShifter: { type: String, default: null },
      maxPower: { type: String, default: null },
      zeroTo100KmphTime: { type: String, default: null },
      topSpeed: { type: String, default: null },
      evBatteryCapacity: { type: String, default: null },
      hybridBatteryCapacity: { type: String, default: null },
      batteryType: { type: String, default: null },
      electricMotorPlacement: { type: String, default: null },
      evRange: { type: String, default: null },
      evChargingTime: { type: String, default: null },
      maxElectricMotorPower: { type: String, default: null },
      turboCharged: { type: String, default: null },
      hybridType: { type: String, default: null },
      driveTrain: { type: String, default: null },
      drivingModes: { type: String, default: null },
      offRoadModes: { type: String, default: null },
      differentialLock: { type: String, default: null },
      limitedSlipDifferential: { type: String, default: null },
      acceleration: { type: String, default: null },
      // Suspension & Brakes
      frontSuspension: { type: String, default: null },
      rearSuspension: { type: String, default: null },
      frontBrake: { type: String, default: null },
      rearBrake: { type: String, default: null },
      // Wheels & Tyres
      wheelSize: { type: String, default: null },
      tyreSize: { type: String, default: null },
      spareTyre: { type: String, default: null },
      // Safety Features
      globalNCAPRating: { type: String, default: null },
      airbags: { type: String, default: null },
      airbagsLocation: { type: String, default: null },
      adasLevel: { type: String, default: null },
      adasFeatures: { type: String, default: null },
      reverseCamera: { type: String, default: null },
      reverseCameraGuidelines: { type: String, default: null },
      tyrePressureMonitor: { type: String, default: null },
      hillHoldAssist: { type: String, default: null },
      hillDescentControl: { type: String, default: null },
      rollOverMitigation: { type: String, default: null },
      parkingSensor: { type: String, default: null },
      discBrakes: { type: String, default: null },
      electronicStabilityProgram: { type: String, default: null },
      abs: { type: String, default: null },
      ebd: { type: String, default: null },
      brakeAssist: { type: String, default: null },
      isofixMounts: { type: String, default: null },
      seatbeltWarning: { type: String, default: null },
      speedAlertSystem: { type: String, default: null },
      speedSensingDoorLocks: { type: String, default: null },
      immobiliser: { type: String, default: null },
      esc: { type: String, default: null },
      tractionControl: { type: String, default: null },
      hillAssist: { type: String, default: null },
      isofix: { type: String, default: null },
      parkingSensors: { type: String, default: null },
      parkingCamera: { type: String, default: null },
      blindSpotMonitor: { type: String, default: null },
      // Comfort & Convenience
      ventilatedSeats: { type: String, default: null },
      sunroof: { type: String, default: null },
      airPurifier: { type: String, default: null },
      headsUpDisplay: { type: String, default: null },
      cruiseControl: { type: String, default: null },
      rainSensingWipers: { type: String, default: null },
      automaticHeadlamp: { type: String, default: null },
      followMeHomeHeadlights: { type: String, default: null },
      keylessEntry: { type: String, default: null },
      ignition: { type: String, default: null },
      ambientLighting: { type: String, default: null },
      steeringAdjustment: { type: String, default: null },
      airConditioning: { type: String, default: null },
      climateZones: { type: String, default: null },
      climateControl: { type: String, default: null },
      rearACVents: { type: String, default: null },
      frontArmrest: { type: String, default: null },
      rearArmrest: { type: String, default: null },
      insideRearViewMirror: { type: String, default: null },
      outsideRearViewMirrors: { type: String, default: null },
      steeringMountedControls: { type: String, default: null },
      rearWindshieldDefogger: { type: String, default: null },
      frontWindshieldDefogger: { type: String, default: null },
      cooledGlovebox: { type: String, default: null },
      pushButtonStart: { type: String, default: null },
      powerWindows: { type: String, default: null },
      powerSteering: { type: String, default: null },
      // Infotainment
      touchScreenInfotainment: { type: String, default: null },
      androidAppleCarplay: { type: String, default: null },
      speakers: { type: String, default: null },
      tweeters: { type: String, default: null },
      subwoofers: { type: String, default: null },
      usbCChargingPorts: { type: String, default: null },
      usbAChargingPorts: { type: String, default: null },
      twelvevChargingPorts: { type: String, default: null },
      wirelessCharging: { type: String, default: null },
      infotainmentScreen: { type: String, default: null },
      bluetooth: { type: String, default: null },
      usb: { type: String, default: null },
      aux: { type: String, default: null },
      androidAuto: { type: String, default: null },
      appleCarPlay: { type: String, default: null },
      // Lighting
      headLights: { type: String, default: null },
      tailLight: { type: String, default: null },
      frontFogLights: { type: String, default: null },
      daytimeRunningLights: { type: String, default: null },
      headlights: { type: String, default: null },
      drl: { type: String, default: null },
      fogLights: { type: String, default: null },
      tailLights: { type: String, default: null },
      // Exterior
      roofRails: { type: String, default: null },
      radioAntenna: { type: String, default: null },
      outsideRearViewMirror: { type: String, default: null },
      sideIndicator: { type: String, default: null },
      rearWindshieldWiper: { type: String, default: null },
      orvm: { type: String, default: null },
      alloyWheels: { type: String, default: null },
      // Seating
      seatUpholstery: { type: String, default: null },
      seatsAdjustment: { type: String, default: null },
      driverSeatAdjustment: { type: String, default: null },
      passengerSeatAdjustment: { type: String, default: null },
      rearSeatAdjustment: { type: String, default: null },
      welcomeSeats: { type: String, default: null },
      memorySeats: { type: String, default: null },
      // seating already exists in model schema at line 40
      // seatingCapacity already exists above at line 168
      // Additional Missing Fields (only new ones, avoiding duplicates)
      // mileageCity already exists above at line 148
      // mileageHighway already exists above at line 149
      // Warranty
      warranty: { type: String, default: null },
      // Images
      highlightImages: [{
        url: { type: String },
        caption: { type: String }
      }],
      // Connected Car Tech
      connectedCarTech: { type: String, default: null },
      createdAt: { type: Date, default: Date.now }
    });
    variantSchema.pre("save", async function() {
      const Brand2 = mongoose.model("Brand");
      const Model3 = mongoose.model("Model");
      const UpcomingCar2 = mongoose.model("UpcomingCar");
      const brand = await Brand2.findOne({ id: this.brandId });
      if (!brand) {
        throw new Error(`Invalid brandId: ${this.brandId}. Brand does not exist.`);
      }
      let model = await Model3.findOne({ id: this.modelId });
      if (!model) {
        model = await UpcomingCar2.findOne({ id: this.modelId });
      }
      if (!model) {
        throw new Error(`Invalid modelId: ${this.modelId}. Model does not exist.`);
      }
      if (model.brandId !== this.brandId) {
        throw new Error(`Model ${this.modelId} does not belong to brand ${this.brandId}.`);
      }
    });
    variantSchema.index({ id: 1 }, { unique: true });
    variantSchema.index({ modelId: 1, brandId: 1, status: 1 });
    variantSchema.index({ brandId: 1, status: 1, price: 1 });
    variantSchema.index({ price: 1, fuelType: 1, transmission: 1 });
    variantSchema.index({ isValueForMoney: 1, status: 1 });
    variantSchema.index({ fuelType: 1, status: 1 });
    variantSchema.index({ transmission: 1, status: 1 });
    variantSchema.index({ createdAt: -1 });
    variantSchema.index({ name: "text", description: "text" });
    variantSchema.index({ price: 1, status: 1 });
    variantSchema.index({ modelId: 1, status: 1, price: 1 });
    variantSchema.index({ brandId: 1, status: 1, bodyType: 1 });
    adminUserSchema = new mongoose.Schema({
      id: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      name: { type: String, required: true },
      role: { type: String, default: "admin" },
      isActive: { type: Boolean, default: true },
      lastLogin: { type: Date, default: null },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });
    adminUserSchema.index({ email: 1 }, { unique: true });
    adminUserSchema.index({ id: 1 }, { unique: true });
    popularComparisonSchema = new mongoose.Schema({
      id: { type: String, required: true },
      model1Id: { type: String, required: true },
      model2Id: { type: String, required: true },
      order: { type: Number, required: true },
      isActive: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now }
    });
    popularComparisonSchema.index({ id: 1 }, { unique: true });
    popularComparisonSchema.index({ isActive: 1, order: 1 });
    newsArticleSchema = new mongoose.Schema({
      id: { type: String, required: true },
      title: { type: String, required: true },
      slug: { type: String, required: true },
      excerpt: { type: String, required: true },
      contentBlocks: [{
        id: { type: String, required: true },
        type: {
          type: String,
          required: true,
          enum: ["paragraph", "heading1", "heading2", "heading3", "image", "bulletList", "numberedList", "quote", "code"]
        },
        content: { type: String, required: true },
        imageUrl: { type: String, default: null },
        imageCaption: { type: String, default: null }
      }],
      categoryId: { type: String, required: true },
      tags: [{ type: String }],
      authorId: { type: String, required: true },
      linkedCars: [{ type: String }],
      // Array of car model IDs
      featuredImage: { type: String, required: true },
      seoTitle: { type: String, required: true },
      seoDescription: { type: String, required: true },
      seoKeywords: [{ type: String }],
      status: {
        type: String,
        required: true,
        enum: ["draft", "published", "scheduled"],
        default: "draft"
      },
      publishDate: { type: Date, required: true },
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      isFeatured: { type: Boolean, default: false },
      isBreaking: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });
    newsArticleSchema.index({ id: 1 }, { unique: true });
    newsArticleSchema.index({ slug: 1 }, { unique: true });
    newsArticleSchema.index({ status: 1, publishDate: -1 });
    newsArticleSchema.index({ categoryId: 1, status: 1 });
    newsArticleSchema.index({ authorId: 1, status: 1 });
    newsArticleSchema.index({ isFeatured: 1, status: 1 });
    newsArticleSchema.index({ views: -1 });
    newsArticleSchema.index({ title: "text", excerpt: "text" });
    newsArticleSchema.index({ status: 1, publishDate: -1, isFeatured: 1 });
    newsCategorySchema = new mongoose.Schema({
      id: { type: String, required: true },
      name: { type: String, required: true },
      slug: { type: String, required: true },
      description: { type: String, required: true },
      isFeatured: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });
    newsCategorySchema.index({ id: 1 }, { unique: true });
    newsCategorySchema.index({ slug: 1 }, { unique: true });
    newsCategorySchema.index({ isFeatured: 1 });
    newsTagSchema = new mongoose.Schema({
      id: { type: String, required: true },
      name: { type: String, required: true },
      slug: { type: String, required: true },
      type: {
        type: String,
        required: true,
        enum: ["brand", "segment", "fuel", "general"]
      },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });
    newsTagSchema.index({ id: 1 }, { unique: true });
    newsTagSchema.index({ slug: 1 }, { unique: true });
    newsTagSchema.index({ type: 1 });
    newsAuthorSchema = new mongoose.Schema({
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      role: {
        type: String,
        required: true,
        enum: ["admin", "editor", "author"],
        default: "author"
      },
      bio: { type: String, default: "" },
      profileImage: { type: String, default: "" },
      socialLinks: {
        twitter: { type: String, default: null },
        linkedin: { type: String, default: null },
        facebook: { type: String, default: null }
      },
      isActive: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });
    newsAuthorSchema.index({ id: 1 }, { unique: true });
    newsAuthorSchema.index({ email: 1 }, { unique: true });
    newsAuthorSchema.index({ isActive: 1 });
    newsMediaSchema = new mongoose.Schema({
      id: { type: String, required: true },
      filename: { type: String, required: true },
      originalName: { type: String, required: true },
      url: { type: String, required: true },
      type: {
        type: String,
        required: true,
        enum: ["image", "video"]
      },
      size: { type: Number, required: true },
      uploaderId: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    });
    newsMediaSchema.index({ id: 1 }, { unique: true });
    newsMediaSchema.index({ uploaderId: 1, createdAt: -1 });
    newsMediaSchema.index({ type: 1 });
    userSchema = new mongoose.Schema({
      id: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, default: null },
      // null for OAuth users
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, default: null },
      dateOfBirth: { type: Date, default: null },
      // OAuth Integration
      googleId: { type: String, default: null },
      profileImage: { type: String, default: null },
      // Verification & Status
      isEmailVerified: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true },
      // Email Verification
      emailVerificationToken: { type: String, default: null },
      emailVerificationExpires: { type: Date, default: null },
      // Password Reset
      resetPasswordToken: { type: String, default: null },
      resetPasswordExpires: { type: Date, default: null },
      // Account Lockout (Security)
      failedLoginAttempts: { type: Number, default: 0 },
      lockUntil: { type: Date, default: null },
      // OTP Authentication
      otp: { type: String, default: null },
      otpExpires: { type: Date, default: null },
      otpAttempts: { type: Number, default: 0 },
      // User Data
      savedCars: [{ type: String }],
      // Array of variant IDs
      comparisonHistory: [{ type: String }],
      // Array of model IDs
      // Email Subscription Preferences
      emailPreferences: {
        newsletter: { type: Boolean, default: true },
        newLaunches: { type: Boolean, default: true },
        priceDrops: { type: Boolean, default: true },
        weeklyDigest: { type: Boolean, default: false },
        comparisons: { type: Boolean, default: true },
        frequency: {
          type: String,
          enum: ["immediate", "daily", "weekly"],
          default: "weekly"
        },
        lastEmailSent: { type: Date, default: null },
        unsubscribedAt: { type: Date, default: null }
      },
      // Auto-learned Car Preferences (from user activity)
      carPreferences: {
        budgetMin: { type: Number, default: null },
        budgetMax: { type: Number, default: null },
        preferredBodyTypes: [{ type: String }],
        // ['SUV', 'Sedan']
        preferredBrands: [{ type: String }],
        // ['Hyundai', 'Tata']
        preferredFuelTypes: [{ type: String }],
        // ['Petrol', 'Electric']
        preferredTransmissions: [{ type: String }]
        // ['Automatic']
      },
      // Timestamps
      lastLogin: { type: Date, default: null },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });
    userSchema.index({ id: 1 }, { unique: true });
    userSchema.index({ email: 1 }, { unique: true });
    userSchema.index({ googleId: 1 }, { unique: true, sparse: true });
    userSchema.index({ isActive: 1 });
    reviewCommentSchema = new mongoose.Schema({
      id: { type: String, required: true },
      reviewId: { type: String, required: true },
      parentId: { type: String, default: null },
      // For nested replies
      userName: { type: String, required: true },
      userEmail: { type: String, required: true },
      text: { type: String, required: true },
      likes: { type: Number, default: 0 },
      dislikes: { type: Number, default: 0 },
      isApproved: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now }
    });
    reviewCommentSchema.index({ reviewId: 1, createdAt: -1 });
    reviewCommentSchema.index({ parentId: 1 });
    reviewCommentSchema.index({ id: 1 }, { unique: true });
    reviewSchema = new mongoose.Schema({
      id: { type: String, required: true },
      brandSlug: { type: String, required: true },
      modelSlug: { type: String, required: true },
      variantSlug: { type: String, default: null },
      // User Info
      userName: { type: String, required: true },
      userEmail: { type: String, required: true },
      // Driving Experience
      drivingExperience: {
        type: String,
        enum: ["not_driven", "short_drive", "under_500km", "over_500km", "Owner"],
        // Added Owner
        required: true
      },
      // Emoji Ratings (Deprecated / Optional)
      emojiRatings: {
        mileage: { type: Number, min: 1, max: 5 },
        maintenanceCost: { type: Number, min: 1, max: 5 },
        safety: { type: Number, min: 1, max: 5 },
        featuresAndStyling: { type: Number, min: 1, max: 5 },
        comfort: { type: Number, min: 1, max: 5 },
        performance: { type: Number, min: 1, max: 5 }
      },
      // Star Ratings (Updated to match frontend)
      starRatings: {
        valueForMoney: { type: Number, min: 1, max: 5, required: true },
        drivingComfort: { type: Number, min: 1, max: 5, required: true },
        enginePerformance: { type: Number, min: 1, max: 5, required: true },
        maintenanceService: { type: Number, min: 1, max: 5, required: true },
        buildQuality: { type: Number, min: 1, max: 5, required: true },
        featuresTechnology: { type: Number, min: 1, max: 5, required: true }
      },
      // Review Content
      reviewTitle: { type: String, required: true, minlength: 10 },
      reviewText: { type: String, required: true, minlength: 300 },
      // Calculated Overall Rating (Average of star ratings)
      overallRating: { type: Number, default: 0, index: true },
      // Image URLs (max 5)
      images: [{ type: String }],
      // Voting
      likes: { type: Number, default: 0 },
      dislikes: { type: Number, default: 0 },
      // Track who voted (to prevent duplicate votes)
      likedBy: [{ type: String }],
      // User emails
      dislikedBy: [{ type: String }],
      // Moderation
      isApproved: { type: Boolean, default: false },
      isVerified: { type: Boolean, default: false },
      // Verified owner
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });
    reviewSchema.pre("save", function() {
      const ratings = this.starRatings;
      if (ratings) {
        const sum = (ratings.valueForMoney || 0) + (ratings.drivingComfort || 0) + (ratings.enginePerformance || 0) + (ratings.maintenanceService || 0) + (ratings.buildQuality || 0) + (ratings.featuresTechnology || 0);
        this.overallRating = Math.round(sum / 6 * 10) / 10;
      } else {
        this.overallRating = 0;
      }
    });
    reviewSchema.index({ id: 1 }, { unique: true });
    reviewSchema.index({ modelSlug: 1, isApproved: 1, createdAt: -1 });
    reviewSchema.index({ brandSlug: 1, isApproved: 1 });
    reviewSchema.index({ variantSlug: 1, isApproved: 1 });
    reviewSchema.index({ userEmail: 1 });
    reviewSchema.index({ overallRating: -1 });
    reviewSchema.index({ likes: -1 });
    reviewSchema.index({ createdAt: -1 });
    Brand = mongoose.model("Brand", brandSchema);
    Model = mongoose.model("Model", modelSchema);
    UpcomingCar = mongoose.model("UpcomingCar", upcomingCarSchema);
    Variant = mongoose.model("Variant", variantSchema);
    AdminUser = mongoose.model("AdminUser", adminUserSchema);
    PopularComparison = mongoose.model("PopularComparison", popularComparisonSchema);
    NewsArticle = mongoose.model("NewsArticle", newsArticleSchema);
    NewsCategory = mongoose.model("NewsCategory", newsCategorySchema);
    NewsTag = mongoose.model("NewsTag", newsTagSchema);
    NewsAuthor = mongoose.model("NewsAuthor", newsAuthorSchema);
    NewsMedia = mongoose.model("NewsMedia", newsMediaSchema);
    User = mongoose.model("User", userSchema);
    Review = mongoose.model("Review", reviewSchema);
    ReviewComment = mongoose.model("ReviewComment", reviewCommentSchema);
  }
});

// server/config/redis-config.ts
var redis_config_exports = {};
__export(redis_config_exports, {
  closeRedisConnection: () => closeRedisConnection,
  default: () => redis_config_default,
  getCacheRedisClient: () => getCacheRedisClient,
  getRedisClient: () => getRedisClient,
  getRedisStatus: () => getRedisStatus,
  getSessionRedisClient: () => getSessionRedisClient,
  isRedisReady: () => isRedisReady
});
import Redis from "ioredis";
function getCommonOptions(label) {
  return {
    maxRetriesPerRequest: 3,
    enableOfflineQueue: false,
    lazyConnect: true,
    showFriendlyErrorStack: true,
    keepAlive: 3e4,
    family: 4,
    retryStrategy: (times) => {
      if (times > MAX_CONNECTION_ATTEMPTS) {
        console.error(`\u274C ${label} Redis failed after ${MAX_CONNECTION_ATTEMPTS} attempts`);
        return null;
      }
      return Math.min(times * 100, 3e3);
    },
    reconnectOnError: (err) => {
      const retryErrors = ["READONLY", "ECONNRESET", "ETIMEDOUT", "EPIPE"];
      return retryErrors.some((e) => err.message.includes(e));
    }
  };
}
function getTlsOptions() {
  return process.env.REDIS_TLS === "true" ? {
    tls: { rejectUnauthorized: false, minVersion: "TLSv1.2" }
  } : {};
}
function createClientFromUrl(url, label) {
  try {
    const client2 = new Redis(url, {
      ...getCommonOptions(label),
      ...getTlsOptions()
    });
    client2.on("connect", () => console.log(`\u{1F50C} ${label} Redis connecting...`));
    client2.on("ready", () => console.log(`\u2705 ${label} Redis ready`));
    client2.on("error", (err) => console.warn(`\u26A0\uFE0F ${label} Redis error:`, err.message));
    client2.on("close", () => console.log(`\u{1F50C} ${label} Redis closed`));
    return client2;
  } catch (error) {
    console.error(`\u274C Failed to create ${label} Redis:`, error);
    return null;
  }
}
async function initializeRedis() {
  const primaryUrl = process.env.REDIS_URL;
  const backupUrl = process.env.REDIS_BACKUP_URL;
  const hasHost = !!process.env.REDIS_HOST;
  if (!primaryUrl && !hasHost) {
    console.log("\u2139\uFE0F  Redis not configured. Running without Redis.");
    return null;
  }
  if (primaryUrl) {
    primaryClient = createClientFromUrl(primaryUrl, "PRIMARY");
  } else if (hasHost) {
    primaryClient = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || "6379"),
      password: process.env.REDIS_PASSWORD,
      ...getCommonOptions("PRIMARY"),
      ...getTlsOptions()
    });
  }
  if (FAILOVER_ENABLED && backupUrl) {
    backupClient = createClientFromUrl(backupUrl, "BACKUP");
    console.log("\u{1F504} Redis failover: ENABLED");
  }
  if (primaryClient) {
    try {
      await primaryClient.connect();
      activeClient = primaryClient;
      isUsingBackup = false;
      console.log("\u2705 Using PRIMARY Redis");
      if (FAILOVER_ENABLED && backupClient) {
        startHealthCheck();
      }
      return activeClient;
    } catch (err) {
      console.error("\u274C Primary Redis connection failed:", err.message);
      if (backupClient) {
        return await switchToBackup();
      }
    }
  }
  return null;
}
async function switchToBackup() {
  if (!backupClient || isUsingBackup) return activeClient;
  console.log("\u{1F504} Switching to BACKUP Redis...");
  try {
    if (backupClient.status !== "ready") {
      await backupClient.connect();
    }
    activeClient = backupClient;
    isUsingBackup = true;
    console.log("\u2705 Now using BACKUP Redis");
    return activeClient;
  } catch (err) {
    console.error("\u274C Backup Redis also failed:", err.message);
    return null;
  }
}
async function switchToPrimary() {
  if (!primaryClient || !isUsingBackup) return activeClient;
  console.log("\u{1F504} Attempting to switch back to PRIMARY Redis...");
  try {
    if (primaryClient.status !== "ready") {
      await primaryClient.connect();
    }
    activeClient = primaryClient;
    isUsingBackup = false;
    console.log("\u2705 Restored to PRIMARY Redis");
    return activeClient;
  } catch (err) {
    console.log("\u26A0\uFE0F Primary still unavailable, staying on BACKUP");
    return activeClient;
  }
}
function startHealthCheck() {
  if (healthCheckInterval) return;
  console.log(`\u23F0 Redis health check started (every ${HEALTH_CHECK_INTERVAL / 1e3}s)`);
  healthCheckInterval = setInterval(async () => {
    try {
      if (activeClient) {
        const pong = await activeClient.ping();
        if (pong !== "PONG") throw new Error("Ping failed");
      }
      if (isUsingBackup && primaryClient) {
        try {
          const primaryPong = await primaryClient.ping();
          if (primaryPong === "PONG") {
            await switchToPrimary();
          }
        } catch {
        }
      }
    } catch (err) {
      console.warn("\u26A0\uFE0F Active Redis health check failed:", err.message);
      if (isUsingBackup) {
        await switchToPrimary();
      } else {
        await switchToBackup();
      }
    }
  }, HEALTH_CHECK_INTERVAL);
}
function getRedisClient() {
  if (!activeClient && !isConnecting) {
    isConnecting = true;
    initializeRedis().then((client2) => {
      activeClient = client2;
      isConnecting = false;
    }).catch((err) => {
      console.error("Redis init error:", err);
      isConnecting = false;
    });
  }
  return activeClient;
}
function isRedisReady() {
  return activeClient?.status === "ready";
}
function getRedisStatus() {
  return {
    active: isUsingBackup ? "backup" : "primary",
    primaryStatus: primaryClient?.status || "not-configured",
    backupStatus: backupClient?.status || "not-configured",
    failoverEnabled: FAILOVER_ENABLED,
    isReady: activeClient?.status === "ready"
  };
}
async function closeRedisConnection() {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }
  const closeClient = async (client2, label) => {
    if (client2) {
      try {
        await client2.quit();
        console.log(`\u2705 ${label} Redis closed`);
      } catch {
        client2.disconnect();
      }
    }
  };
  await closeClient(primaryClient, "PRIMARY");
  await closeClient(backupClient, "BACKUP");
  primaryClient = null;
  backupClient = null;
  activeClient = null;
  isConnecting = false;
}
function getSessionRedisClient() {
  return getRedisClient();
}
function getCacheRedisClient() {
  return getRedisClient();
}
var primaryClient, backupClient, activeClient, isUsingBackup, isConnecting, healthCheckInterval, MAX_CONNECTION_ATTEMPTS, HEALTH_CHECK_INTERVAL, FAILOVER_ENABLED, redis_config_default;
var init_redis_config = __esm({
  "server/config/redis-config.ts"() {
    "use strict";
    primaryClient = null;
    backupClient = null;
    activeClient = null;
    isUsingBackup = false;
    isConnecting = false;
    healthCheckInterval = null;
    MAX_CONNECTION_ATTEMPTS = 3;
    HEALTH_CHECK_INTERVAL = 3e4;
    FAILOVER_ENABLED = process.env.REDIS_FAILOVER_ENABLED === "true";
    redis_config_default = getRedisClient;
  }
});

// server/middleware/redis-cache.ts
import { gzip, gunzip } from "zlib";
import { promisify } from "util";
function redisCacheMiddleware(ttl = 300, staleTime = 60) {
  return async (req, res, next) => {
    if (req.method !== "GET") {
      return next();
    }
    if (!redis) {
      return next();
    }
    const namespace = req.path.split("/")[2] || "api";
    const cacheKey = `cache:${CACHE_VERSION}:${namespace}:${req.path}:${JSON.stringify(req.query)}`;
    try {
      const [cachedData, cacheTTL] = await Promise.all([
        redis.getBuffer(cacheKey),
        // Get as Buffer
        redis.ttl(cacheKey)
      ]);
      if (cachedData) {
        let jsonStr;
        try {
          const buffer = await decompress(cachedData);
          jsonStr = buffer.toString();
        } catch (e) {
          jsonStr = cachedData.toString();
        }
        const data = JSON.parse(jsonStr);
        if (cacheTTL > 0 && cacheTTL < staleTime) {
          console.log(`\u26A1 Redis Cache STALE (refreshing): ${cacheKey}`);
          res.set("X-Cache", "STALE");
          res.set("X-Cache-TTL", cacheTTL.toString());
          res.json(data);
          refreshCacheInBackground(req, cacheKey, ttl).catch(
            (err) => console.error("Background refresh error:", err)
          );
          return;
        }
        console.log(`\u2705 Redis Cache HIT: ${cacheKey}`);
        res.set("X-Cache", "HIT");
        res.set("X-Cache-TTL", cacheTTL.toString());
        return res.json(data);
      }
      console.log(`\u274C Redis Cache MISS: ${cacheKey}`);
      await handleCacheMissWithStampedePrevention(req, res, next, cacheKey, ttl);
    } catch (error) {
      console.error("Redis middleware error:", error);
      next();
    }
  };
}
async function handleCacheMissWithStampedePrevention(req, res, next, cacheKey, ttl) {
  if (!redis) return next();
  const lockKey = `lock:${cacheKey}`;
  const lockTTL = 10;
  try {
    const lockAcquired = await redis.set(lockKey, "1", "NX", "EX", lockTTL);
    if (lockAcquired) {
      console.log(`\u{1F512} Lock acquired for: ${cacheKey}`);
      const originalJson = res.json.bind(res);
      res.json = function(data) {
        if (redis) {
          const jsonStr = JSON.stringify(data);
          compress(Buffer.from(jsonStr)).then((compressed) => {
            return redis.setex(cacheKey, ttl, compressed);
          }).then(() => {
            console.log(`\u{1F4BE} Cached (compressed): ${cacheKey}`);
            if (redis) return redis.del(lockKey);
            return Promise.resolve(0);
          }).catch((err) => console.error("Cache set error:", err));
        }
        res.set("X-Cache", "MISS");
        res.set("X-Cache-TTL", ttl.toString());
        return originalJson(data);
      };
      next();
    } else {
      console.log(`\u23F3 Waiting for lock: ${cacheKey}`);
      await new Promise((resolve2) => setTimeout(resolve2, 100));
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        console.log(`\u2705 Cache refreshed by lock holder: ${cacheKey}`);
        res.set("X-Cache", "HIT-AFTER-WAIT");
        return res.json(JSON.parse(cachedData));
      }
      next();
    }
  } catch (error) {
    console.error("Stampede prevention error:", error);
    next();
  }
}
async function refreshCacheInBackground(req, cacheKey, ttl) {
  if (!redis) return;
  console.log(`\u{1F504} Background refresh started: ${cacheKey}`);
}
async function cacheCarDetails(carId, carData, ttl = 1800) {
  if (!redis) return;
  try {
    const hashKey = `car:${carId}`;
    await redis.hset(hashKey, {
      id: carData.id || "",
      name: carData.name || "",
      brand: carData.brand || "",
      price: carData.price ? carData.price.toString() : "0",
      fuelType: carData.fuelType || "",
      transmission: carData.transmission || "",
      rating: carData.rating ? carData.rating.toString() : "0",
      image: carData.image || "",
      updatedAt: Date.now().toString()
    });
    await redis.expire(hashKey, ttl);
    console.log(`\u{1F4BE} Car cached as hash: ${hashKey}`);
  } catch (error) {
    console.error("Cache car details error:", error);
  }
}
async function invalidateRedisCache(pattern) {
  try {
    if (!redis) return;
    const keys = [];
    let cursor = "0";
    do {
      const [newCursor, foundKeys] = await redis.scan(
        cursor,
        "MATCH",
        `cache:*${pattern}*`,
        "COUNT",
        100
      );
      cursor = newCursor;
      keys.push(...foundKeys);
    } while (cursor !== "0");
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`\u{1F5D1}\uFE0F Invalidated ${keys.length} keys matching: ${pattern}`);
    }
  } catch (error) {
    console.error("Redis invalidation error:", error);
  }
}
async function clearAllCache() {
  try {
    if (!redis) return;
    await redis.flushdb();
    console.log("\u{1F5D1}\uFE0F All Redis cache cleared");
  } catch (error) {
    console.error("Redis clear error:", error);
  }
}
async function getRedisCacheStats() {
  try {
    if (!redis) {
      return { connected: false, totalKeys: 0 };
    }
    const [info, dbSize, memoryInfo] = await Promise.all([
      redis.info("stats"),
      redis.dbsize(),
      redis.info("memory")
    ]);
    const parseInfo = (infoStr) => {
      const stats2 = {};
      infoStr.split("\r\n").forEach((line) => {
        const [key, value] = line.split(":");
        if (key && value) {
          stats2[key] = value;
        }
      });
      return stats2;
    };
    const stats = parseInfo(info);
    const memory = parseInfo(memoryInfo);
    const hits = parseInt(stats.keyspace_hits || "0");
    const misses = parseInt(stats.keyspace_misses || "0");
    const hitRate = hits + misses > 0 ? (hits / (hits + misses) * 100).toFixed(2) : "0.00";
    return {
      connected: redis.status === "ready",
      totalKeys: dbSize,
      hitRate: `${hitRate}%`,
      hits,
      misses,
      totalConnections: stats.total_connections_received || 0,
      totalCommands: stats.total_commands_processed || 0,
      usedMemory: memory.used_memory_human || "N/A",
      usedMemoryPeak: memory.used_memory_peak_human || "N/A",
      evictedKeys: stats.evicted_keys || 0,
      expiredKeys: stats.expired_keys || 0
    };
  } catch (error) {
    console.error("Redis stats error:", error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
async function warmUpCache(storage2) {
  try {
    if (!redis) {
      console.warn("\u26A0\uFE0F Skipping cache warmup: Redis not configured");
      return;
    }
    console.log("\u{1F525} Warming up Redis cache...");
    const brands = await storage2.getBrands();
    const compressedBrands = await compress(Buffer.from(JSON.stringify(brands)));
    const brandsKey = `cache:${CACHE_VERSION}:brands:/api/brands:{}`;
    await redis.setex(
      brandsKey,
      CacheTTL.BRANDS,
      compressedBrands
    );
    console.log(`\u2705 Cached ${brands.length} brands (compressed)`);
    const models = await storage2.getModels();
    const popularModels = models.filter((m) => m.isPopular);
    const compressedModels = await compress(Buffer.from(JSON.stringify(popularModels)));
    const modelsKey = `cache:${CACHE_VERSION}:models:/api/models:{"popular":"true"}`;
    await redis.setex(
      modelsKey,
      CacheTTL.MODELS,
      compressedModels
    );
    console.log(`\u2705 Cached ${popularModels.length} popular models (compressed)`);
    const topModels = models.slice(0, 10);
    for (const model of topModels) {
      await cacheCarDetails(model.id, model, CacheTTL.MODELS);
    }
    console.log(`\u2705 Cached ${topModels.length} models as hashes`);
    console.log("\u2705 Cache warmup completed successfully");
  } catch (error) {
    console.error("\u274C Cache warmup error:", error);
  }
}
var compress, decompress, redis, CACHE_VERSION, CacheTTL;
var init_redis_cache = __esm({
  "server/middleware/redis-cache.ts"() {
    "use strict";
    init_redis_config();
    compress = promisify(gzip);
    decompress = promisify(gunzip);
    redis = getCacheRedisClient();
    if (redis) {
      console.log("\u2705 Using unified Redis client for caching");
    } else {
      console.log("\u2139\uFE0F  Redis not configured. Caching disabled.");
    }
    CACHE_VERSION = "v4-gzip";
    CacheTTL = {
      BRANDS: 3600,
      // 1 hour
      MODELS: 1800,
      // 30 minutes
      POPULAR_CARS: 3600,
      // 1 hour
      MODEL_DETAILS: 3600,
      // 1 hour - Model page details
      BRAND_MODELS: 1800,
      // 30 minutes - Brand's model list
      VARIANTS: 900,
      // 15 minutes
      STATS: 300,
      // 5 minutes
      COMPARISONS: 7200,
      // 2 hours
      NEWS: 600,
      // 10 minutes
      SEARCH: 1800,
      // 30 minutes
      CAR_DETAILS: 1800
      // 30 minutes
    };
  }
});

// server/scheduled-youtube-fetch.ts
var scheduled_youtube_fetch_exports = {};
__export(scheduled_youtube_fetch_exports, {
  fetchAndCacheYouTubeVideos: () => fetchAndCacheYouTubeVideos,
  startYouTubeScheduler: () => startYouTubeScheduler
});
import cron from "node-cron";
function formatViewCount(count) {
  if (count >= 1e6) {
    return (count / 1e6).toFixed(1) + "M";
  } else if (count >= 1e3) {
    return (count / 1e3).toFixed(1) + "K";
  }
  return count.toString();
}
function formatPublishedDate(dateString) {
  const date = new Date(dateString);
  const now = /* @__PURE__ */ new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? "s" : ""} ago`;
}
function parseDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "0:00";
  const hours = (match[1] || "").replace("H", "");
  const minutes = (match[2] || "").replace("M", "");
  const seconds = (match[3] || "").replace("S", "");
  if (hours) {
    return `${hours}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
  }
  return `${minutes || "0"}:${seconds.padStart(2, "0")}`;
}
async function fetchYouTubeVideos(apiKey, channelId) {
  let actualChannelId = channelId;
  if (channelId.startsWith("@")) {
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelId}&type=channel&key=${apiKey}`
    );
    const searchData = await searchResponse.json();
    if (searchData.error) {
      throw new Error(searchData.error.message);
    }
    if (searchData.items && searchData.items.length > 0) {
      actualChannelId = searchData.items[0].snippet.channelId;
    }
  }
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${actualChannelId}&part=snippet,id&order=date&maxResults=4&type=video`;
  const videosResponse = await fetch(searchUrl);
  if (!videosResponse.ok) {
    const errorData = await videosResponse.json().catch(() => ({}));
    if (errorData.error?.message?.includes("quota")) {
      throw new Error("QUOTA_EXCEEDED");
    }
    throw new Error(errorData.error?.message || "Failed to fetch YouTube videos");
  }
  const videosData = await videosResponse.json();
  if (!videosData.items || videosData.items.length === 0) {
    throw new Error("No videos found");
  }
  const videoIds = videosData.items.map((item) => item.id.videoId).join(",");
  const statsResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=statistics,contentDetails,snippet`
  );
  const statsData = await statsResponse.json();
  const videos = statsData.items.map((item) => ({
    id: item.id,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high.url,
    duration: parseDuration(item.contentDetails.duration),
    views: formatViewCount(parseInt(item.statistics.viewCount)),
    likes: formatViewCount(parseInt(item.statistics.likeCount || "0")),
    publishedAt: formatPublishedDate(item.snippet.publishedAt),
    channelName: item.snippet.channelTitle
  }));
  return {
    featuredVideo: videos[0],
    relatedVideos: videos.slice(1)
  };
}
async function fetchAndCacheYouTubeVideos(storage2) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID || "@gadizone";
  if (!apiKey) {
    console.error("\u274C YouTube API key not configured - skipping scheduled fetch");
    return;
  }
  try {
    console.log("\u{1F504} Starting scheduled YouTube fetch...");
    const freshData = await fetchYouTubeVideos(apiKey, channelId);
    await storage2.saveYouTubeCache(freshData, Date.now());
    console.log("\u2705 Scheduled YouTube fetch completed successfully");
  } catch (error) {
    console.error("\u274C Scheduled YouTube fetch failed:", error);
  }
}
function startYouTubeScheduler(storage2) {
  const fetchHour = parseInt(process.env.YOUTUBE_FETCH_TIME || "11", 10);
  const cronPattern = `0 ${fetchHour} * * *`;
  cron.schedule(cronPattern, async () => {
    console.log(`\u23F0 Scheduled YouTube fetch triggered at ${(/* @__PURE__ */ new Date()).toLocaleString()}`);
    await fetchAndCacheYouTubeVideos(storage2);
  });
  console.log(`\u2705 YouTube scheduler started - will fetch daily at ${fetchHour}:00`);
}
var init_scheduled_youtube_fetch = __esm({
  "server/scheduled-youtube-fetch.ts"() {
    "use strict";
  }
});

// server/services/email.service.ts
var email_service_exports = {};
__export(email_service_exports, {
  emailTemplates: () => emailTemplates,
  sendEmail: () => sendEmail,
  testEmailService: () => testEmailService
});
import nodemailer from "nodemailer";
var createTransporter, transporter, emailTemplates, sendEmail, testEmailService;
var init_email_service = __esm({
  "server/services/email.service.ts"() {
    "use strict";
    createTransporter = () => {
      const isProd2 = process.env.NODE_ENV === "production";
      if (isProd2 && process.env.SMTP_HOST) {
        return nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
          },
          connectionTimeout: 1e4,
          // 10 seconds
          greetingTimeout: 1e4,
          socketTimeout: 15e3
        });
      } else if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        return nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          // Must be false for port 587 (STARTTLS)
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
          },
          tls: {
            rejectUnauthorized: false
            // Helps with potential cloud cert issues
          },
          connectionTimeout: 1e4,
          // 10 seconds
          greetingTimeout: 1e4,
          socketTimeout: 15e3
        });
      } else {
        console.warn("\u26A0\uFE0F  No email configuration found. Emails will not be sent.");
        return null;
      }
    };
    transporter = null;
    try {
      transporter = createTransporter();
      if (transporter) {
        console.log("\u2705 Email service initialized");
      }
    } catch (error) {
      console.error("\u274C Failed to initialize email service:", error);
    }
    emailTemplates = {
      verification: (name, verificationUrl) => ({
        subject: "\u{1F697} Verify Your gadizone Account",
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 40px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to gadizone!</h1>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding: 40px 30px; background: #ffffff;">
                    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Hi ${name},</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      Thank you for signing up! We're excited to have you join our community of car enthusiasts.
                    </p>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                      Please verify your email address to activate your account and start exploring:
                    </p>
                    <!-- Button -->
                    <table role="presentation" style="margin: 0 auto;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);">
                          <a href="${verificationUrl}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                            Verify Email Address
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 32px 0 0 0;">
                      <strong>Note:</strong> This verification link will expire in 24 hours.
                    </p>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 16px 0 0 0;">
                      If you didn't create an account with gadizone, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                      \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} gadizone. All rights reserved.<br>
                      Your trusted source for car comparisons and insights.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
      }),
      welcome: (name) => ({
        subject: "\u{1F389} Welcome to gadizone - Your Account is Active!",
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 40px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">\u{1F38A} Welcome Aboard!</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Hi ${name},</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      Your account is now verified and ready to use! \u{1F680}
                    </p>
                    <p style="color: #111827; font-size: 18px; font-weight: bold; margin: 0 0 16px 0;">
                      Here's what you can do now:
                    </p>
                    <ul style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 32px 0; padding-left: 24px;">
                      <li><strong>Compare Cars:</strong> Side-by-side feature, price, and spec comparisons</li>
                      <li><strong>Calculate EMI:</strong> Get accurate loan estimates and on-road prices</li>
                      <li><strong>Save Favorites:</strong> Keep track of cars you're interested in</li>
                      <li><strong>Latest News:</strong> Stay updated with automotive industry trends</li>
                      <li><strong>Expert Reviews:</strong> Read detailed reviews and ratings</li>
                    </ul>
                    <table role="presentation" style="margin: 0 auto;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);">
                          <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                            Start Exploring Cars
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 32px 0 0 0; text-align: center;">
                      Need help? Reply to this email or visit our help center.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                      Happy car hunting!<br>
                      The gadizone Team
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
      }),
      passwordReset: (name, resetUrl) => ({
        subject: "\u{1F510} Reset Your gadizone Password",
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 40px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Password Reset Request</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Hi ${name},</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      We received a request to reset your password. Click the button below to create a new password:
                    </p>
                    <table role="presentation" style="margin: 0 auto 32px auto;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);">
                          <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 0 0 24px 0;">
                      <p style="color: #991b1b; font-size: 14px; margin: 0; line-height: 1.5;">
                        <strong>\u26A0\uFE0F Security Notice:</strong><br>
                        This link will expire in 1 hour for your security.<br>
                        Never share this link with anyone.
                      </p>
                    </div>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">
                      If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                      \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} gadizone. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
      }),
      otpLogin: (name, otp) => ({
        subject: "\u{1F510} Your gadizone Login Code",
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 40px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Your Login Code</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px; text-align: center;">
                    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Hi${name ? ` ${name}` : ""},</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                      Use the following code to log in to your gadizone account:
                    </p>
                    <!-- OTP Code Display -->
                    <div style="background: #f9fafb; border: 2px dashed #dc2626; border-radius: 12px; padding: 24px; margin: 0 auto 32px auto; max-width: 280px;">
                      <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: bold; color: #dc2626; letter-spacing: 8px;">${otp}</span>
                    </div>
                    <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; text-align: left; margin: 0 0 24px 0;">
                      <p style="color: #991b1b; font-size: 14px; margin: 0; line-height: 1.5;">
                        <strong>\u23F1\uFE0F This code expires in 5 minutes.</strong><br>
                        If you didn't request this code, please ignore this email.
                      </p>
                    </div>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">
                      Never share this code with anyone. gadizone will never ask for your code.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                      \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} gadizone. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
      }),
      welcomeLogin: (name) => ({
        subject: `\u{1F44B} Welcome back to gadizone, ${name}!`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 40px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">\u{1F44B} Welcome Back!</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Hi ${name},</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      You've successfully logged in to your gadizone account. \u{1F389}
                    </p>
                    <p style="color: #111827; font-size: 18px; font-weight: bold; margin: 0 0 16px 0;">
                      What would you like to explore today?
                    </p>
                    <ul style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 32px 0; padding-left: 24px;">
                      <li><strong>Compare Cars:</strong> Find your perfect match with side-by-side comparisons</li>
                      <li><strong>Latest Launches:</strong> Discover newly launched cars in India</li>
                      <li><strong>Calculate EMI:</strong> Plan your finances with our EMI calculator</li>
                      <li><strong>Expert Reviews:</strong> Read detailed car reviews and ratings</li>
                    </ul>
                    <table role="presentation" style="margin: 0 auto;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);">
                          <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                            Explore Cars Now
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 32px 0 0 0; text-align: center;">
                      If this wasn't you, please secure your account immediately.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                      Happy car hunting!<br>
                      The gadizone Team
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
      }),
      // New Launch Alert Template
      newLaunchAlert: (name, carData) => ({
        subject: `New Launch: ${carData.brand} ${carData.name}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica', 'Arial', sans-serif; background-color: #f8f9fa;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
                <tr>
                  <td style="padding: 30px 40px; border-bottom: 2px solid #dc2626;">
                    <h1 style="color: #1f2937; margin: 0; font-size: 24px; font-weight: 600;">Latest Car Launch</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px;">
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Dear ${name || "Subscriber"},
                    </p>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      The all-new <strong>${carData.brand} ${carData.name}</strong> has just been launched in India.
                    </p>
                    <div style="background: #f3f4f6; border-radius: 6px; padding: 20px; margin: 0 0 24px 0; border: 1px solid #e5e7eb;">
                      <h3 style="color: #111827; margin: 0 0 8px 0; font-size: 18px;">${carData.brand} ${carData.name}</h3>
                      <p style="color: #4b5563; font-size: 15px; margin: 0 0 12px 0;">Starting Price</p>
                      <p style="color: #dc2626; font-size: 24px; font-weight: 700; margin: 0;">${carData.price}</p>
                    </div>
                ${carData.image ? `
                    <div style="margin-bottom: 24px;">
                        <img src="${carData.image}" alt="${carData.brand} ${carData.name}" style="width: 100%; height: auto; border-radius: 6px; border: 1px solid #e5e7eb;">
                    </div>` : ""}
                    <a href="${carData.url}" style="display: inline-block; background-color: #1f2937; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 15px;">
                      View Specification
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f8f9fa; padding: 20px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">
                      You are receiving this email because you subscribed to new launch alerts.<br>
                      <a href="${process.env.FRONTEND_URL}/unsubscribe" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
      }),
      // Weekly Digest Template
      weeklyDigest: (name, data) => ({
        subject: `Weekly Car Recommendations - ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica', 'Arial', sans-serif; background-color: #f8f9fa;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
                <tr>
                  <td style="padding: 30px 40px; border-bottom: 2px solid #dc2626;">
                    <h1 style="color: #1f2937; margin: 0; font-size: 24px; font-weight: 600;">Your Weekly Selection</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px;">
                    <p style="color: #4b5563; font-size: 16px; margin: 0 0 20px 0;">
                      Dear ${name || "Subscriber"},
                    </p>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      Here are the latest cars that match your preferences for this week:
                    </p>
                    ${data.recommendations && data.recommendations.length > 0 ? data.recommendations.map((car) => `
                      <div style="padding: 16px; border-bottom: 1px solid #f3f4f6;">
                        <h3 style="color: #111827; margin: 0 0 4px 0; font-size: 16px;">${car.brand} ${car.name}</h3>
                        <p style="color: #dc2626; font-weight: 600; margin: 0 0 8px 0;">${car.price}</p>
                        <a href="${car.url}" style="color: #4b5563; text-decoration: underline; font-size: 14px;">View Details</a>
                      </div>
                    `).join("") : "<p>No new recommendations this week.</p>"}
                    <div style="margin-top: 24px; text-align: center;">
                        <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background-color: #1f2937; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 15px;">
                        Browse All Cars
                        </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f8f9fa; padding: 20px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">
                      \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} gadizone. All rights reserved.<br>
                      <a href="${process.env.FRONTEND_URL}/unsubscribe" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
      }),
      // Price Drop Alert Template
      priceDropAlert: (name, carData) => ({
        subject: `Price Drop: ${carData.brand} ${carData.name}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica', 'Arial', sans-serif; background-color: #f8f9fa;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
                <tr>
                  <td style="padding: 30px 40px; border-bottom: 2px solid #059669;">
                    <h1 style="color: #1f2937; margin: 0; font-size: 24px; font-weight: 600;">Price Drop Alert</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px;">
                    <p style="color: #4b5563; font-size: 16px; margin: 0 0 20px 0;">
                      Dear ${name || "Subscriber"},
                    </p>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      A car in your watchlist has just become more affordable:
                    </p>
                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 20px; margin: 0 0 24px 0;">
                      <h3 style="color: #059669; margin: 0 0 12px 0; font-size: 18px;">${carData.brand} ${carData.name}</h3>
                      <div style="margin-bottom: 8px;">
                          <span style="color: #9ca3af; text-decoration: line-through; font-size: 14px;">${carData.oldPrice}</span>
                          <span style="color: #059669; font-weight: 700; font-size: 20px; margin-left: 8px;">${carData.newPrice}</span>
                      </div>
                      <p style="color: #047857; margin: 0; font-size: 14px; font-weight: 500;">You save ${carData.savings}</p>
                    </div>
                    <a href="${carData.url}" style="display: inline-block; background-color: #1f2937; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 15px;">
                      View Details
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f8f9fa; padding: 20px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">
                      You are receiving this because you subscribed to price alerts.<br>
                      <a href="${process.env.FRONTEND_URL}/unsubscribe" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
      })
    };
    sendEmail = async (to, template, data) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(to)) {
        console.error("\u274C Invalid email address:", to);
        return { success: false, error: "Invalid email address" };
      }
      let emailContent;
      try {
        if (["weeklyDigest", "newLaunchAlert", "priceDropAlert"].includes(template)) {
          const name = data.userName || "Car Enthusiast";
          emailContent = emailTemplates[template](name, data);
        } else if (template === "otpLogin") {
          emailContent = emailTemplates[template](data.name, data.otp || "");
        } else if (template === "welcomeLogin" || template === "welcome") {
          emailContent = emailTemplates[template](data.name);
        } else {
          emailContent = emailTemplates[template](data.name, data.url || "");
        }
      } catch (err) {
        console.error(`Error generating email content for template ${template}:`, err);
        return { success: false, error: "Template error: " + err.message };
      }
      if (process.env.RESEND_API_KEY) {
        try {
          const { default: axios4 } = await import("axios");
          const from = process.env.EMAIL_FROM || "onboarding@resend.dev";
          await axios4.post(
            "https://api.resend.com/emails",
            {
              from: `gadizone <${from}>`,
              to: [to],
              subject: emailContent.subject,
              html: emailContent.html
            },
            {
              headers: {
                "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
                "Content-Type": "application/json"
              }
            }
          );
          console.log(`\u2705 Email sent via Resend API to ${to}`);
          return { success: true };
        } catch (error) {
          console.error("\u274C Resend API error:", error.response?.data || error.message);
          return { success: false, error: "Resend API failed: " + (error.response?.data?.message || error.message) };
        }
      }
      try {
        if (!transporter) {
          console.error("\u274C Email service not configured (No Resend Key and No SMTP/Gmail)");
          return { success: false, error: "Email service not configured" };
        }
        const from = process.env.GMAIL_USER || process.env.SMTP_USER || "noreply@gadizone.com";
        await transporter.sendMail({
          from: `"gadizone" <${from}>`,
          to,
          subject: emailContent.subject,
          html: emailContent.html
        });
        console.log(`\u2705 Email sent via SMTP to ${to}`);
        return { success: true };
      } catch (error) {
        console.error("\u274C Email send error:", error.message || error);
        return { success: false, error: error.message || "Failed to send email" };
      }
    };
    testEmailService = async () => {
      if (!transporter) {
        console.error("\u274C Email transporter not initialized");
        return false;
      }
      try {
        await transporter.verify();
        console.log("\u2705 Email service is ready to send emails");
        return true;
      } catch (error) {
        console.error("\u274C Email service verification failed:", error.message);
        return false;
      }
    };
  }
});

// server/services/recommendation.service.ts
async function getModelsWithPrices() {
  const cacheKey = "recommendation:models_with_prices";
  if (redis3) {
    try {
      const cached = await redis3.get(cacheKey);
      if (cached) {
        const data = JSON.parse(cached);
        console.log("\u2705 Recommendation cache HIT: models_with_prices");
        return new Map(data);
      }
    } catch (e) {
      console.error("Cache read error:", e);
    }
  }
  console.log("\u{1F4E5} Recommendation cache MISS: fetching models with prices");
  const [models, brands, variantPrices] = await Promise.all([
    Model.find({ status: "active" }).lean(),
    Brand.find({ status: "active" }).lean(),
    // Aggregate to get min price per model - SINGLE QUERY
    Variant.aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: "$modelId",
          minPrice: { $min: "$price" },
          fuelTypes: { $addToSet: "$fuelType" }
        }
      }
    ])
  ]);
  const brandMap = new Map(brands.map((b) => [b.id, b.name]));
  const priceMap = new Map(variantPrices.map((v) => [v._id, {
    minPrice: v.minPrice,
    fuelTypes: v.fuelTypes
  }]));
  const modelMap = /* @__PURE__ */ new Map();
  for (const model of models) {
    const priceData = priceMap.get(model.id);
    if (!priceData || priceData.minPrice === 0) continue;
    modelMap.set(model.id, {
      ...model,
      startingPrice: priceData.minPrice,
      variantFuelTypes: priceData.fuelTypes,
      brandName: brandMap.get(model.brandId) || ""
    });
  }
  if (redis3) {
    try {
      await redis3.setex(cacheKey, CACHE_TTL3, JSON.stringify([...modelMap]));
      console.log(`\u{1F4BE} Cached ${modelMap.size} models with prices (TTL: ${CACHE_TTL3}s)`);
    } catch (e) {
      console.error("Cache write error:", e);
    }
  }
  return modelMap;
}
async function getVariantsWithModels() {
  const cacheKey = "recommendation:variants_with_models";
  if (redis3) {
    try {
      const cached = await redis3.get(cacheKey);
      if (cached) {
        const data = JSON.parse(cached);
        console.log("\u2705 Recommendation cache HIT: variants_with_models");
        return new Map(data);
      }
    } catch (e) {
      console.error("Cache read error:", e);
    }
  }
  console.log("\u{1F4E5} Recommendation cache MISS: fetching variants with models");
  const [variants, models, brands] = await Promise.all([
    Variant.find({ status: "active" }).lean(),
    Model.find({ status: "active" }).lean(),
    Brand.find({ status: "active" }).lean()
  ]);
  const brandMap = new Map(brands.map((b) => [b.id, b.name]));
  const modelMap = new Map(models.map((m) => [m.id, m]));
  const variantMap = /* @__PURE__ */ new Map();
  for (const variant of variants) {
    const model = modelMap.get(variant.modelId);
    if (!model) continue;
    variantMap.set(variant.id, {
      ...variant,
      modelName: model.name,
      bodyType: model.bodyType,
      brandName: brandMap.get(variant.brandId) || "",
      heroImage: model.heroImage
    });
  }
  if (redis3) {
    try {
      await redis3.setex(cacheKey, CACHE_TTL3, JSON.stringify([...variantMap]));
      console.log(`\u{1F4BE} Cached ${variantMap.size} variants with models (TTL: ${CACHE_TTL3}s)`);
    } catch (e) {
      console.error("Cache write error:", e);
    }
  }
  return variantMap;
}
function scoreBodyType(source, target) {
  if (!source || !target) return 0;
  if (source.toLowerCase() === target.toLowerCase()) return 1;
  const similarGroups = {
    suv: ["suv", "crossover", "muv"],
    sedan: ["sedan", "saloon"],
    hatchback: ["hatchback", "premium hatchback"],
    mpv: ["mpv", "muv", "van"]
  };
  const sourceLower = source.toLowerCase();
  const targetLower = target.toLowerCase();
  for (const group of Object.values(similarGroups)) {
    if (group.includes(sourceLower) && group.includes(targetLower)) {
      return 0.7;
    }
  }
  return 0;
}
function scorePriceRange(sourcePrice, targetPrice, tolerancePercent = 20) {
  if (!sourcePrice || !targetPrice) return 0;
  const priceDiff = Math.abs(sourcePrice - targetPrice);
  const tolerance = sourcePrice * (tolerancePercent / 100);
  if (priceDiff === 0) return 1;
  if (priceDiff <= tolerance * 0.5) return 0.9;
  if (priceDiff <= tolerance) return 0.7;
  if (priceDiff <= tolerance * 1.5) return 0.4;
  if (priceDiff <= tolerance * 2) return 0.2;
  return 0;
}
function scoreFuelType(sourceFuels, targetFuels) {
  if (!sourceFuels || !targetFuels) return 0;
  const sourceArray = Array.isArray(sourceFuels) ? sourceFuels : [sourceFuels];
  const targetArray = Array.isArray(targetFuels) ? targetFuels : [targetFuels];
  const sourceLower = sourceArray.map((f) => f.toLowerCase());
  const targetLower = targetArray.map((f) => f.toLowerCase());
  if (sourceLower.some((f) => targetLower.includes(f))) return 1;
  const fuelGroups = {
    petrol: ["petrol", "cng", "petrol + cng"],
    diesel: ["diesel"],
    electric: ["electric", "ev"],
    hybrid: ["hybrid", "mild hybrid", "strong hybrid", "phev"]
  };
  for (const group of Object.values(fuelGroups)) {
    const sourceInGroup = sourceLower.some((f) => group.includes(f));
    const targetInGroup = targetLower.some((f) => group.includes(f));
    if (sourceInGroup && targetInGroup) return 0.6;
  }
  return 0;
}
function scoreBrand(sourceBrandId, targetBrandId) {
  if (!sourceBrandId || !targetBrandId) return 0;
  return sourceBrandId === targetBrandId ? 1 : 0;
}
async function getSimilarModels(context, limit = 6, excludeIds = []) {
  try {
    const modelMap = await getModelsWithPrices();
    const sourceModel = modelMap.get(context.sourceId);
    if (!sourceModel) return [];
    const sourcePrice = sourceModel.startingPrice;
    const weights = DEFAULT_WEIGHTS;
    const scoredModels = [];
    for (const [modelId, model] of modelMap) {
      if (modelId === context.sourceId || excludeIds.includes(modelId)) continue;
      const bodyTypeScore = scoreBodyType(sourceModel.bodyType, model.bodyType);
      const priceScore = scorePriceRange(sourcePrice, model.startingPrice, 20);
      const fuelScore = scoreFuelType(sourceModel.fuelTypes, model.fuelTypes);
      const brandScore = scoreBrand(sourceModel.brandId, model.brandId);
      const totalScore = bodyTypeScore * weights.bodyType + priceScore * weights.priceRange + fuelScore * weights.fuelType + brandScore * weights.brand + 0.5 * weights.features;
      const matchReasons = [];
      if (bodyTypeScore >= 0.7) matchReasons.push("Same body type");
      if (priceScore >= 0.7) matchReasons.push("Similar price range");
      if (fuelScore >= 0.6) matchReasons.push("Same fuel type");
      if (brandScore === 1) matchReasons.push("Same brand");
      scoredModels.push({
        id: model.id,
        name: model.name,
        brandName: model.brandName,
        price: model.startingPrice,
        bodyType: model.bodyType,
        fuelType: model.fuelTypes?.[0],
        heroImage: model.heroImage,
        similarityScore: Math.round(totalScore * 100),
        matchReasons
      });
    }
    return scoredModels.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, limit);
  } catch (error) {
    console.error("[Recommendation] Error getting similar models:", error);
    return [];
  }
}
async function getSimilarVariants(context, limit = 6, excludeIds = []) {
  try {
    const variantMap = await getVariantsWithModels();
    const sourceVariant = variantMap.get(context.sourceId);
    if (!sourceVariant) return [];
    const sourcePrice = sourceVariant.price;
    const weights = VARIANT_WEIGHTS;
    const scoredVariants = [];
    for (const [variantId, variant] of variantMap) {
      if (variant.modelId === sourceVariant.modelId || excludeIds.includes(variantId)) continue;
      const bodyTypeScore = scoreBodyType(sourceVariant.bodyType, variant.bodyType);
      const priceScore = scorePriceRange(sourcePrice, variant.price, 15);
      const fuelScore = scoreFuelType(sourceVariant.fuelType, variant.fuelType);
      const brandScore = scoreBrand(sourceVariant.brandId, variant.brandId);
      const totalScore = bodyTypeScore * weights.bodyType + priceScore * weights.priceRange + fuelScore * weights.fuelType + brandScore * weights.brand + 0.5 * weights.features;
      const matchReasons = [];
      if (priceScore >= 0.7) matchReasons.push(`\u20B9${Math.round(variant.price / 1e5)}L`);
      if (bodyTypeScore >= 0.7) matchReasons.push(variant.bodyType);
      if (fuelScore >= 0.6) matchReasons.push(variant.fuelType);
      scoredVariants.push({
        id: variant.id,
        name: `${variant.modelName} ${variant.name}`,
        brandName: variant.brandName,
        price: variant.price,
        bodyType: variant.bodyType,
        fuelType: variant.fuelType,
        heroImage: variant.heroImage,
        similarityScore: Math.round(totalScore * 100),
        matchReasons
      });
    }
    return scoredVariants.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, limit);
  } catch (error) {
    console.error("[Recommendation] Error getting similar variants:", error);
    return [];
  }
}
async function getPersonalizedRecommendations(userId, sessionId, limit = 5) {
  try {
    const modelMap = await getModelsWithPrices();
    const popularModels = [];
    for (const [, model] of modelMap) {
      if (!model.isPopular) continue;
      popularModels.push({
        id: model.id,
        name: model.name,
        brandName: model.brandName,
        price: model.startingPrice,
        bodyType: model.bodyType,
        fuelType: model.fuelTypes?.[0],
        heroImage: model.heroImage,
        similarityScore: 0,
        matchReasons: ["Popular"]
      });
      if (popularModels.length >= limit) break;
    }
    return popularModels;
  } catch (error) {
    console.error("[Recommendation] Error getting personalized recommendations:", error);
    return [];
  }
}
var redis3, CACHE_TTL3, DEFAULT_WEIGHTS, VARIANT_WEIGHTS;
var init_recommendation_service = __esm({
  "server/services/recommendation.service.ts"() {
    "use strict";
    init_schemas2();
    init_redis_config();
    redis3 = getCacheRedisClient();
    CACHE_TTL3 = 300;
    DEFAULT_WEIGHTS = {
      bodyType: 0.2,
      priceRange: 0.3,
      fuelType: 0.15,
      brand: 0.1,
      features: 0.15,
      userBehavior: 0.1
    };
    VARIANT_WEIGHTS = {
      bodyType: 0.15,
      priceRange: 0.4,
      fuelType: 0.15,
      brand: 0.1,
      features: 0.1,
      userBehavior: 0.1
    };
  }
});

// server/db/models/price-history.model.ts
import mongoose3 from "mongoose";
var priceHistorySchema, PriceHistory;
var init_price_history_model = __esm({
  "server/db/models/price-history.model.ts"() {
    "use strict";
    priceHistorySchema = new mongoose3.Schema({
      variantId: {
        type: mongoose3.Schema.Types.ObjectId,
        ref: "Variant",
        required: true,
        index: true
      },
      modelId: {
        type: mongoose3.Schema.Types.ObjectId,
        ref: "Model",
        required: true,
        index: true
      },
      brandId: {
        type: mongoose3.Schema.Types.ObjectId,
        ref: "Brand",
        required: true
      },
      variantName: {
        type: String,
        required: true
      },
      modelName: {
        type: String,
        required: true
      },
      brandName: {
        type: String,
        required: true
      },
      previousPrice: {
        type: Number,
        required: true
      },
      newPrice: {
        type: Number,
        required: true
      },
      priceChange: {
        type: Number,
        required: true
        // Negative for drops, positive for increases
      },
      priceChangePercent: {
        type: Number,
        required: true
      },
      changedAt: {
        type: Date,
        default: Date.now,
        index: true
      }
    }, {
      timestamps: true
    });
    priceHistorySchema.index({ changedAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
    priceHistorySchema.index({ variantId: 1, changedAt: -1 });
    priceHistorySchema.index({ modelId: 1, changedAt: -1 });
    PriceHistory = mongoose3.model("PriceHistory", priceHistorySchema);
  }
});

// server/services/price-monitoring.service.ts
var price_monitoring_service_exports = {};
__export(price_monitoring_service_exports, {
  priceMonitoringService: () => priceMonitoringService
});
var PriceMonitoringService, priceMonitoringService;
var init_price_monitoring_service = __esm({
  "server/services/price-monitoring.service.ts"() {
    "use strict";
    init_price_history_model();
    init_email_scheduler_service();
    init_schemas2();
    PriceMonitoringService = class {
      /**
       * Record a price change in history
       */
      async recordPriceChange(variantData) {
        try {
          const priceChange = variantData.newPrice - variantData.previousPrice;
          const priceChangePercent = priceChange / variantData.previousPrice * 100;
          const history = await PriceHistory.create({
            ...variantData,
            priceChange,
            priceChangePercent,
            changedAt: /* @__PURE__ */ new Date()
          });
          console.log(`\u{1F4B0} Price change recorded: ${variantData.variantName} - ${priceChangePercent > 0 ? "+" : ""}${priceChangePercent.toFixed(2)}%`);
          if (priceChangePercent < -5) {
            await this.sendPriceDropAlerts(variantData, priceChangePercent);
          }
          return history;
        } catch (error) {
          console.error("Error recording price change:", error);
          throw error;
        }
      }
      /**
       * Send price drop alerts to interested users
       */
      async sendPriceDropAlerts(variantData, priceChangePercent) {
        try {
          const users = await User.find({
            "emailPreferences.priceDrops": true,
            "emailPreferences.unsubscribedAt": null
          }).select("email name");
          console.log(`\u{1F4C9} Sending price drop alerts for ${variantData.variantName} to ${users.length} users`);
          const savings = variantData.previousPrice - variantData.newPrice;
          for (const user of users) {
            try {
              await emailScheduler.sendPriceDropAlert(user, {
                name: variantData.variantName,
                brand: variantData.brandName,
                oldPrice: `\u20B9${(variantData.previousPrice / 1e5).toFixed(2)} Lakh`,
                newPrice: `\u20B9${(variantData.newPrice / 1e5).toFixed(2)} Lakh`,
                savings: `\u20B9${(savings / 1e5).toFixed(2)} Lakh`,
                discount: `${Math.abs(priceChangePercent).toFixed(1)}%`,
                url: `${process.env.FRONTEND_URL}/${variantData.brandName.toLowerCase().replace(/\s+/g, "-")}-cars/${variantData.modelName.toLowerCase().replace(/\s+/g, "-")}`
              });
            } catch (error) {
              console.error(`Failed to send price drop alert to ${user.email}:`, error);
            }
          }
          console.log(`\u2705 Price drop alerts sent for ${variantData.variantName}`);
        } catch (error) {
          console.error("Error sending price drop alerts:", error);
        }
      }
      /**
       * Get price history for a variant
       */
      async getVariantPriceHistory(variantId, limit = 10) {
        try {
          return await PriceHistory.find({ variantId }).sort({ changedAt: -1 }).limit(limit);
        } catch (error) {
          console.error("Error fetching price history:", error);
          return [];
        }
      }
      /**
       * Get recent price drops across all variants
       */
      async getRecentPriceDrops(days = 7, limit = 20) {
        try {
          const since = /* @__PURE__ */ new Date();
          since.setDate(since.getDate() - days);
          return await PriceHistory.find({
            changedAt: { $gte: since },
            priceChangePercent: { $lt: 0 }
            // Only drops
          }).sort({ priceChangePercent: 1 }).limit(limit);
        } catch (error) {
          console.error("Error fetching recent price drops:", error);
          return [];
        }
      }
      /**
       * Check for price drops (called by cron job)
       */
      async checkPriceDrops() {
        try {
          console.log("\u{1F4B0} Checking for price drops...");
          const recentDrops = await this.getRecentPriceDrops(1, 50);
          console.log(`\u{1F4CA} Found ${recentDrops.length} price drops in last 24 hours`);
          return recentDrops;
        } catch (error) {
          console.error("Error checking price drops:", error);
          return [];
        }
      }
    };
    priceMonitoringService = new PriceMonitoringService();
  }
});

// server/services/email-scheduler.service.ts
var email_scheduler_service_exports = {};
__export(email_scheduler_service_exports, {
  emailScheduler: () => emailScheduler
});
import cron2 from "node-cron";
var EmailSchedulerService, emailScheduler;
var init_email_scheduler_service = __esm({
  "server/services/email-scheduler.service.ts"() {
    "use strict";
    init_schemas2();
    init_email_service();
    init_recommendation_service();
    EmailSchedulerService = class {
      weeklyDigestJob = null;
      priceMonitorJob = null;
      isEnabled = false;
      /**
       * Initialize and start all cron jobs
       */
      start() {
        if (this.isEnabled) {
          console.log("\u26A0\uFE0F Email scheduler already running");
          return;
        }
        if (process.env.EMAIL_SCHEDULER_ENABLED === "false") {
          console.log("\u{1F4E7} Email scheduler disabled via env var");
          return;
        }
        console.log("\u{1F4E7} Starting email scheduler...");
        try {
          let weeklyDigestCron = (process.env.WEEKLY_DIGEST_CRON || "0 9 * * 1").trim().replace(/^["']|["']$/g, "");
          if (!cron2.validate(weeklyDigestCron)) {
            console.warn(`\u26A0\uFE0F Invalid WEEKLY_DIGEST_CRON expression: "${weeklyDigestCron}", using default`);
            weeklyDigestCron = "0 9 * * 1";
          }
          this.weeklyDigestJob = cron2.schedule(weeklyDigestCron, async () => {
            console.log("\u{1F4E8} Running weekly digest job...");
            await this.sendWeeklyDigests();
          });
          let priceCheckCron = (process.env.PRICE_CHECK_CRON || "0 8 * * *").trim().replace(/^["']|["']$/g, "");
          if (!cron2.validate(priceCheckCron)) {
            console.warn(`\u26A0\uFE0F Invalid PRICE_CHECK_CRON expression: "${priceCheckCron}", using default`);
            priceCheckCron = "0 8 * * *";
          }
          this.priceMonitorJob = cron2.schedule(priceCheckCron, async () => {
            console.log("\u{1F4B0} Running price drop monitor...");
            await this.checkPriceDrops();
          });
          this.isEnabled = true;
          console.log("\u2705 Email scheduler started");
          console.log(`   - Weekly digest: ${weeklyDigestCron}`);
          console.log(`   - Price monitor: ${priceCheckCron}`);
        } catch (error) {
          console.error("\u274C Failed to start email scheduler:", error.message);
          console.error("   Scheduler will not run. Check cron expressions in environment variables.");
        }
      }
      /**
       * Stop all cron jobs
       */
      stop() {
        if (!this.isEnabled) {
          console.log("\u26A0\uFE0F Email scheduler not running");
          return;
        }
        console.log("\u{1F4E7} Stopping email scheduler...");
        if (this.weeklyDigestJob) {
          this.weeklyDigestJob.stop();
          this.weeklyDigestJob = null;
        }
        if (this.priceMonitorJob) {
          this.priceMonitorJob.stop();
          this.priceMonitorJob = null;
        }
        this.isEnabled = false;
        console.log("\u2705 Email scheduler stopped");
      }
      /**
       * Send weekly digest emails to all opted-in users
       */
      async sendWeeklyDigests() {
        try {
          const users = await User.find({
            "emailPreferences.weeklyDigest": true,
            "emailPreferences.unsubscribedAt": null,
            $or: [
              { "emailPreferences.frequency": "weekly" },
              { "emailPreferences.frequency": { $exists: false } }
            ]
          }).select("email firstName emailPreferences carPreferences");
          console.log(`\u{1F4EC} Found ${users.length} users for weekly digest`);
          const batchSize = parseInt(process.env.EMAIL_BATCH_SIZE || "50");
          let sentCount = 0;
          let errorCount = 0;
          for (let i = 0; i < users.length; i += batchSize) {
            const batch = users.slice(i, i + batchSize);
            await Promise.all(batch.map(async (user) => {
              try {
                const lastSent = user.emailPreferences?.lastEmailSent;
                if (lastSent) {
                  const daysSinceLastEmail = (Date.now() - lastSent.getTime()) / (1e3 * 60 * 60 * 24);
                  if (daysSinceLastEmail < 7) {
                    console.log(`\u23ED\uFE0F  Skipping ${user.email} - email sent ${daysSinceLastEmail.toFixed(1)} days ago`);
                    return;
                  }
                }
                const recommendations = await this.getPersonalizedRecommendations(user);
                if (recommendations.length === 0) {
                  console.log(`\u23ED\uFE0F  Skipping ${user.email} - no recommendations`);
                  return;
                }
                const userName = user.firstName || "Car Enthusiast";
                await sendEmail(
                  user.email,
                  "weeklyDigest",
                  {
                    userName,
                    recommendations: recommendations.slice(0, 5)
                  }
                );
                await User.updateOne(
                  { _id: user._id },
                  { "emailPreferences.lastEmailSent": /* @__PURE__ */ new Date() }
                );
                sentCount++;
                console.log(`\u2705 Sent weekly digest to ${user.email}`);
              } catch (error) {
                errorCount++;
                console.error(`\u274C Failed to send weekly digest to ${user.email}:`, error);
              }
            }));
            if (i + batchSize < users.length) {
              const rateLimit4 = parseInt(process.env.EMAIL_RATE_LIMIT || "10");
              const delayMs = batchSize / rateLimit4 * 1e3;
              await new Promise((resolve2) => setTimeout(resolve2, delayMs));
            }
          }
          console.log(`\u{1F4CA} Weekly digest complete: ${sentCount} sent, ${errorCount} errors`);
        } catch (error) {
          console.error("\u274C Weekly digest job failed:", error);
        }
      }
      /**
      * Check for price drops and send alerts
      */
      async checkPriceDrops() {
        try {
          const { priceMonitoringService: priceMonitoringService2 } = await Promise.resolve().then(() => (init_price_monitoring_service(), price_monitoring_service_exports));
          await priceMonitoringService2.checkPriceDrops();
        } catch (error) {
          console.error("\u274C Price drop monitor failed:", error);
        }
      }
      /**
       * Get personalized recommendations for a user
       */
      async getPersonalizedRecommendations(user) {
        try {
          const preferences = user.carPreferences || {};
          const userId = user._id?.toString() || user.id;
          const recommendations = await getPersonalizedRecommendations(userId);
          return recommendations.map((rec) => ({
            name: rec.name,
            brand: rec.brandName,
            price: `\u20B9${(rec.price / 1e5).toFixed(2)} Lakh`,
            image: rec.heroImage,
            url: `${process.env.FRONTEND_URL}/${rec.brandName.toLowerCase().replace(/\s+/g, "-")}-cars/${rec.name.toLowerCase().replace(/\s+/g, "-")}`,
            matchReason: rec.matchReasons?.[0] || "Recommended for you"
          }));
        } catch (error) {
          console.error("Error getting personalized recommendations:", error);
          return [];
        }
      }
      /**
       * Send new launch alert to relevant users
       */
      async sendNewLaunchAlert(model) {
        try {
          const users = await User.find({
            "emailPreferences.newLaunches": true,
            "emailPreferences.unsubscribedAt": null,
            $or: [
              { "carPreferences.preferredBrands": model.brandName },
              { "carPreferences.preferredBodyTypes": model.bodyType },
              { "carPreferences.preferredBrands": { $exists: false } }
            ]
          }).select("email firstName");
          console.log(`\u{1F680} Sending new launch alert for ${model.name} to ${users.length} users`);
          let sentCount = 0;
          const batchSize = parseInt(process.env.EMAIL_BATCH_SIZE || "50");
          for (let i = 0; i < users.length; i += batchSize) {
            const batch = users.slice(i, i + batchSize);
            await Promise.all(batch.map(async (user) => {
              try {
                const userName = user.firstName || "Car Enthusiast";
                await sendEmail(
                  user.email,
                  "newLaunchAlert",
                  {
                    userName,
                    name: model.name,
                    brand: model.brandName,
                    price: `\u20B9${(model.startingPrice / 1e5).toFixed(2)} Lakh`,
                    image: model.heroImage,
                    url: `${process.env.FRONTEND_URL}/${model.brandName.toLowerCase().replace(/\s+/g, "-")}-cars/${model.name.toLowerCase().replace(/\s+/g, "-")}`
                  }
                );
                sentCount++;
                console.log(`\u2705 Sent new launch alert to ${user.email}`);
              } catch (error) {
                console.error(`\u274C Failed to send new launch alert to ${user.email}:`, error);
              }
            }));
            if (i + batchSize < users.length) {
              const rateLimit4 = parseInt(process.env.EMAIL_RATE_LIMIT || "10");
              const delayMs = batchSize / rateLimit4 * 1e3;
              await new Promise((resolve2) => setTimeout(resolve2, delayMs));
            }
          }
          console.log(`\u{1F4CA} New launch alerts sent: ${sentCount}/${users.length}`);
        } catch (error) {
          console.error("\u274C New launch alert failed:", error);
        }
      }
      /**
       * Send price drop alert to a user
       */
      async sendPriceDropAlert(user, carData) {
        try {
          const userName = user.firstName || user.name || "Car Enthusiast";
          await sendEmail(
            user.email,
            "priceDropAlert",
            {
              userName,
              ...carData
            }
          );
          console.log(`\u2705 Sent price drop alert to ${user.email} for ${carData.name}`);
        } catch (error) {
          console.error(`\u274C Failed to send price drop alert to ${user.email}:`, error);
        }
      }
      /**
       * Manual trigger for testing (admin only)
       */
      async triggerWeeklyDigest(userId) {
        console.log("\u{1F9EA} Manually triggering weekly digest...");
        if (userId) {
          const user = await User.findById(userId).select("email firstName emailPreferences carPreferences");
          if (!user) {
            throw new Error("User not found");
          }
          const recommendations = await this.getPersonalizedRecommendations(user);
          const userName = user.firstName || "Car Enthusiast";
          await sendEmail(
            user.email,
            "weeklyDigest",
            {
              userName,
              recommendations: recommendations.slice(0, 5)
            }
          );
          console.log(`\u2705 Test email sent to ${user.email}`);
        } else {
          await this.sendWeeklyDigests();
        }
      }
    };
    emailScheduler = new EmailSchedulerService();
  }
});

// server/db/mongodb-config.ts
var mongodb_config_exports = {};
__export(mongodb_config_exports, {
  cacheConfig: () => cacheConfig,
  initializeMongoDBOptimized: () => initializeMongoDBOptimized,
  mongoConfig: () => mongoConfig,
  performanceConfig: () => performanceConfig
});
import mongoose4 from "mongoose";
async function initializeMongoDBOptimized(uri) {
  try {
    mongoose4.set("strictQuery", false);
    mongoose4.set("autoIndex", false);
    mongoose4.set("bufferCommands", false);
    await mongoose4.connect(uri, mongoConfig);
    console.log("\u2705 MongoDB connected with high-performance configuration");
    mongoose4.connection.on("error", (error) => {
      console.error("\u274C MongoDB connection error:", error);
    });
    mongoose4.connection.on("disconnected", () => {
      console.warn("\u26A0\uFE0F  MongoDB disconnected");
    });
    mongoose4.connection.on("reconnected", () => {
      console.log("\u2705 MongoDB reconnected");
    });
    mongoose4.connection.on("connectionPoolCreated", () => {
      console.log("\u{1F3CA} MongoDB connection pool created");
    });
    mongoose4.connection.on("connectionPoolClosed", () => {
      console.log("\u{1F3CA} MongoDB connection pool closed");
    });
    if (process.env.NODE_ENV === "production") {
      await buildIndexesInBackground();
    }
  } catch (error) {
    console.error("\u274C Failed to connect to MongoDB:", error);
    throw error;
  }
}
async function buildIndexesInBackground() {
  try {
    console.log("\u{1F528} Building indexes in background...");
    const db = mongoose4.connection.db;
    await Promise.all([
      buildBrandIndexes(db),
      buildModelIndexes(db),
      buildVariantIndexes(db),
      buildAdminUserIndexes(db),
      buildPopularComparisonIndexes(db)
    ]);
    console.log("\u2705 All indexes built successfully");
  } catch (error) {
    console.error("\u274C Error building indexes:", error);
  }
}
async function buildBrandIndexes(db) {
  const collection = db.collection("brands");
  await collection.createIndexes([
    { key: { id: 1 }, unique: true, background: true },
    { key: { status: 1, ranking: 1 }, background: true },
    { key: { name: 1 }, background: true },
    { key: { name: "text", summary: "text" }, background: true }
  ]);
}
async function buildModelIndexes(db) {
  const collection = db.collection("models");
  await collection.createIndexes([
    { key: { id: 1 }, unique: true, background: true },
    { key: { brandId: 1, status: 1 }, background: true },
    { key: { name: 1 }, background: true },
    { key: { isPopular: 1, popularRank: 1 }, background: true },
    { key: { isNew: 1, newRank: 1 }, background: true },
    { key: { bodyType: 1, status: 1 }, background: true },
    { key: { name: "text", description: "text" }, background: true }
  ]);
}
async function buildVariantIndexes(db) {
  const collection = db.collection("variants");
  await collection.createIndexes([
    { key: { id: 1 }, unique: true, background: true },
    { key: { modelId: 1, brandId: 1, status: 1 }, background: true },
    { key: { brandId: 1, status: 1, price: 1 }, background: true },
    { key: { price: 1, fuelType: 1, transmission: 1 }, background: true },
    { key: { isValueForMoney: 1, status: 1 }, background: true },
    { key: { fuelType: 1, status: 1 }, background: true },
    { key: { transmission: 1, status: 1 }, background: true },
    { key: { createdAt: -1 }, background: true },
    { key: { price: 1, status: 1 }, background: true },
    { key: { name: "text", description: "text" }, background: true }
  ]);
}
async function buildAdminUserIndexes(db) {
  const collection = db.collection("adminusers");
  await collection.createIndexes([
    { key: { email: 1 }, unique: true, background: true },
    { key: { id: 1 }, unique: true, background: true },
    { key: { isActive: 1 }, background: true }
  ]);
}
async function buildPopularComparisonIndexes(db) {
  const collection = db.collection("popularcomparisons");
  await collection.createIndexes([
    { key: { id: 1 }, unique: true, background: true },
    { key: { isActive: 1, order: 1 }, background: true },
    { key: { model1Id: 1, model2Id: 1 }, background: true }
  ]);
}
var mongoConfig, cacheConfig, performanceConfig;
var init_mongodb_config = __esm({
  "server/db/mongodb-config.ts"() {
    "use strict";
    mongoConfig = {
      // OPTIMIZED: Connection pooling for high performance
      maxPoolSize: 200,
      // Increased from 100 for better concurrency
      minPoolSize: 20,
      // Increased from 10 to keep more connections warm
      maxIdleTimeMS: 6e4,
      // Increased from 30000 to keep connections alive longer
      serverSelectionTimeoutMS: 5e3,
      socketTimeoutMS: 45e3,
      // Write Concern for Performance
      writeConcern: {
        w: "majority",
        // Use majority for Atlas reliability
        wtimeout: 5e3
        // Increased timeout
      },
      // Additional optimizations
      retryWrites: true,
      // Retry failed writes
      retryReads: true,
      // Retry failed reads
      compressors: ["zlib"]
      // Compress network traffic
    };
    cacheConfig = {
      // Redis configuration for caching
      redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD,
        db: 0,
        maxRetriesPerRequest: 3,
        retryDelayOnFailover: 100,
        enableOfflineQueue: false,
        lazyConnect: true
      },
      // Cache TTL settings (in seconds)
      ttl: {
        brands: 3600,
        // 1 hour
        models: 1800,
        // 30 minutes
        variants: 900,
        // 15 minutes
        popularComparisons: 7200,
        // 2 hours
        stats: 300
        // 5 minutes
      }
    };
    performanceConfig = {
      // Enable slow query logging
      slowQueryThreshold: 100,
      // Log queries taking more than 100ms
      // Connection monitoring
      monitorConnections: true,
      // Query profiling
      enableProfiling: process.env.NODE_ENV === "development",
      // Metrics collection
      collectMetrics: true
    };
  }
});

// server/config/passport.ts
var passport_exports = {};
__export(passport_exports, {
  default: () => passport_default
});
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { v4 as uuidv42 } from "uuid";
var backendUrl, frontendUrl, passport_default;
var init_passport = __esm({
  "server/config/passport.ts"() {
    "use strict";
    init_schemas2();
    backendUrl = process.env.BACKEND_URL || "http://localhost:5001";
    frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${backendUrl}/api/user/auth/google/callback`,
          scope: ["profile", "email"]
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            const firstName = profile.name?.givenName || "";
            const lastName = profile.name?.familyName || "";
            const profileImage = profile.photos?.[0]?.value;
            const googleId = profile.id;
            if (!email) {
              return done(new Error("No email found in Google profile"), void 0);
            }
            let user = await User.findOne({ email: email.toLowerCase() });
            if (user) {
              if (!user.googleId) {
                user.googleId = googleId;
                user.profileImage = profileImage || user.profileImage;
                await user.save();
              }
              user.lastLogin = /* @__PURE__ */ new Date();
              await user.save();
            } else {
              const userId = uuidv42();
              user = new User({
                id: userId,
                email: email.toLowerCase(),
                password: null,
                // OAuth users don't have password
                firstName,
                lastName,
                googleId,
                profileImage,
                isEmailVerified: true,
                // Google emails are already verified
                isActive: true,
                createdAt: /* @__PURE__ */ new Date(),
                updatedAt: /* @__PURE__ */ new Date()
              });
              await user.save();
              console.log("\u2705 New user created via Google OAuth:", email);
            }
            return done(null, user);
          } catch (error) {
            console.error("Google OAuth error:", error);
            return done(error, void 0);
          }
        }
      )
    );
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
      try {
        const user = await User.findOne({ id });
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });
    passport_default = passport;
  }
});

// server/services/mongodb-backup-sync.ts
var mongodb_backup_sync_exports = {};
__export(mongodb_backup_sync_exports, {
  mongoDBBackupSync: () => mongoDBBackupSync
});
import mongoose6 from "mongoose";
import cron3 from "node-cron";
var MongoDBBackupSync, mongoDBBackupSync;
var init_mongodb_backup_sync = __esm({
  "server/services/mongodb-backup-sync.ts"() {
    "use strict";
    MongoDBBackupSync = class {
      primaryUri;
      backupUri;
      isEnabled;
      backupConnection = null;
      cronJob = null;
      status = {
        lastSyncTime: null,
        lastSyncStatus: "never"
      };
      // Collection names to sync (must match actual MongoDB collection names)
      collectionsToSync = [
        "brands",
        "models",
        "variants",
        "upcomingcars",
        "popularcomparisons",
        "adminusers",
        "users",
        // News-related collections
        "newsarticles",
        "newstags",
        "newscategories",
        "newsauthors",
        "newsmedias",
        // AI/Analytics collections
        "aiinteractions",
        "learnedpatterns",
        "useractivities",
        "pricehistories",
        "reviews",
        "reviewcomments"
      ];
      constructor() {
        this.primaryUri = process.env.MONGODB_URI || "";
        this.backupUri = process.env.MONGODB_BACKUP_URI || null;
        this.isEnabled = process.env.BACKUP_SYNC_ENABLED === "true" && !!this.backupUri;
      }
      /**
       * Initialize the backup sync service
       */
      async initialize() {
        if (!this.isEnabled) {
          console.log("\u{1F4E6} MongoDB Backup Sync: DISABLED (set BACKUP_SYNC_ENABLED=true and MONGODB_BACKUP_URI)");
          return;
        }
        if (!this.backupUri) {
          console.log("\u26A0\uFE0F  MongoDB Backup Sync: MONGODB_BACKUP_URI not configured");
          return;
        }
        console.log("\u{1F4E6} MongoDB Backup Sync: ENABLED");
        console.log("\u23F0 Daily backup scheduled at 12:00 AM IST (00:00)");
        this.cronJob = cron3.schedule("30 18 * * *", async () => {
          console.log("\u{1F504} Starting scheduled daily backup sync...");
          await this.syncToBackup();
        }, {
          timezone: "UTC"
        });
        console.log("\u2705 MongoDB Backup Sync service initialized");
      }
      /**
       * Connect to backup MongoDB
       */
      async connectToBackup() {
        if (this.backupConnection && this.backupConnection.readyState === 1) {
          return this.backupConnection;
        }
        if (!this.backupUri) {
          throw new Error("MONGODB_BACKUP_URI not configured");
        }
        console.log("\u{1F50C} Connecting to backup MongoDB...");
        this.backupConnection = mongoose6.createConnection(this.backupUri);
        await new Promise((resolve2, reject) => {
          this.backupConnection.once("open", () => {
            console.log("\u2705 Connected to backup MongoDB");
            resolve2();
          });
          this.backupConnection.once("error", (err) => {
            console.error("\u274C Failed to connect to backup MongoDB:", err);
            reject(err);
          });
        });
        return this.backupConnection;
      }
      /**
       * Sync all data to backup MongoDB
       */
      async syncToBackup() {
        if (!this.backupUri) {
          this.status = {
            lastSyncTime: /* @__PURE__ */ new Date(),
            lastSyncStatus: "failed",
            lastError: "MONGODB_BACKUP_URI not configured"
          };
          return this.status;
        }
        this.status = {
          lastSyncTime: /* @__PURE__ */ new Date(),
          lastSyncStatus: "in-progress"
        };
        console.log("\u{1F504} Starting backup sync to secondary MongoDB...");
        const startTime = Date.now();
        try {
          const backupConn = await this.connectToBackup();
          const primaryDb = mongoose6.connection.db;
          if (!primaryDb) {
            throw new Error("Primary MongoDB not connected");
          }
          const backupDb = backupConn.db;
          if (!backupDb) {
            throw new Error("Backup MongoDB not connected");
          }
          const documentsCopied = {
            brands: 0,
            models: 0,
            variants: 0,
            upcomingCars: 0,
            popularComparisons: 0,
            adminUsers: 0,
            news: 0
          };
          for (const collectionName of this.collectionsToSync) {
            try {
              console.log(`  \u{1F4C4} Syncing ${collectionName}...`);
              const documents = await primaryDb.collection(collectionName).find({}).toArray();
              if (documents.length === 0) {
                console.log(`     \u23ED\uFE0F  Skipping ${collectionName} (empty)`);
                continue;
              }
              await backupDb.collection(collectionName).deleteMany({});
              await backupDb.collection(collectionName).insertMany(documents);
              console.log(`     \u2705 Synced ${documents.length} documents`);
              if (collectionName === "brands") documentsCopied.brands = documents.length;
              if (collectionName === "models") documentsCopied.models = documents.length;
              if (collectionName === "variants") documentsCopied.variants = documents.length;
              if (collectionName === "upcomingcars") documentsCopied.upcomingCars = documents.length;
              if (collectionName === "popularcomparisons") documentsCopied.popularComparisons = documents.length;
              if (collectionName === "adminusers") documentsCopied.adminUsers = documents.length;
              if (collectionName === "news") documentsCopied.news = documents.length;
            } catch (collectionError) {
              console.error(`     \u274C Failed to sync ${collectionName}:`, collectionError);
            }
          }
          const duration = ((Date.now() - startTime) / 1e3).toFixed(2);
          console.log(`\u2705 Backup sync completed in ${duration}s`);
          this.status = {
            lastSyncTime: /* @__PURE__ */ new Date(),
            lastSyncStatus: "success",
            documentsCopied
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          console.error("\u274C Backup sync failed:", errorMessage);
          this.status = {
            lastSyncTime: /* @__PURE__ */ new Date(),
            lastSyncStatus: "failed",
            lastError: errorMessage
          };
        }
        return this.status;
      }
      /**
       * Get current backup status
       */
      getStatus() {
        return this.status;
      }
      /**
       * Check if backup sync is enabled
       */
      isBackupEnabled() {
        return this.isEnabled;
      }
      /**
       * Stop the cron job
       */
      stop() {
        if (this.cronJob) {
          this.cronJob.stop();
          console.log("\u23F9\uFE0F  MongoDB Backup Sync cron job stopped");
        }
        if (this.backupConnection) {
          this.backupConnection.close();
          console.log("\u{1F50C} Backup MongoDB connection closed");
        }
      }
    };
    mongoDBBackupSync = new MongoDBBackupSync();
  }
});

// server/routes/backup-sync.ts
var backup_sync_exports = {};
__export(backup_sync_exports, {
  default: () => backup_sync_default
});
import { Router as Router10 } from "express";
var router17, backup_sync_default;
var init_backup_sync = __esm({
  "server/routes/backup-sync.ts"() {
    "use strict";
    init_mongodb_backup_sync();
    router17 = Router10();
    router17.post("/sync", async (req, res) => {
      try {
        const userId = req.session?.userId;
        if (!userId) {
          return res.status(401).json({
            success: false,
            message: "Authentication required"
          });
        }
        if (!mongoDBBackupSync.isBackupEnabled()) {
          return res.status(400).json({
            success: false,
            message: "Backup sync is not enabled. Set BACKUP_SYNC_ENABLED=true and MONGODB_BACKUP_URI in environment variables."
          });
        }
        console.log(`\u{1F4E6} Manual backup sync triggered by admin user: ${userId}`);
        const status = await mongoDBBackupSync.syncToBackup();
        return res.json({
          success: status.lastSyncStatus === "success",
          message: status.lastSyncStatus === "success" ? "Backup sync completed successfully" : `Backup sync failed: ${status.lastError}`,
          status
        });
      } catch (error) {
        console.error("\u274C Manual backup sync error:", error);
        return res.status(500).json({
          success: false,
          message: error instanceof Error ? error.message : "Unknown error"
        });
      }
    });
    router17.get("/status", async (req, res) => {
      try {
        const userId = req.session?.userId;
        if (!userId) {
          return res.status(401).json({
            success: false,
            message: "Authentication required"
          });
        }
        const status = mongoDBBackupSync.getStatus();
        const isEnabled = mongoDBBackupSync.isBackupEnabled();
        return res.json({
          success: true,
          enabled: isEnabled,
          status,
          nextScheduledSync: isEnabled ? "Daily at 12:00 AM IST" : "N/A (disabled)"
        });
      } catch (error) {
        console.error("\u274C Backup status error:", error);
        return res.status(500).json({
          success: false,
          message: error instanceof Error ? error.message : "Unknown error"
        });
      }
    });
    backup_sync_default = router17;
  }
});

// server/routes/cache.ts
var cache_exports = {};
__export(cache_exports, {
  default: () => cache_default
});
import { Router as Router11 } from "express";
var router18, cache_default;
var init_cache = __esm({
  "server/routes/cache.ts"() {
    "use strict";
    init_redis_cache();
    router18 = Router11();
    router18.get("/stats", async (req, res) => {
      try {
        const stats = await getRedisCacheStats();
        res.json({
          success: true,
          data: stats,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    });
    router18.post("/clear", async (req, res) => {
      try {
        await clearAllCache();
        res.json({
          success: true,
          message: "All cache cleared successfully"
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    });
    router18.post("/invalidate", async (req, res) => {
      try {
        const { pattern } = req.body;
        if (!pattern) {
          return res.status(400).json({
            success: false,
            error: "Pattern is required"
          });
        }
        await invalidateRedisCache(pattern);
        res.json({
          success: true,
          message: `Cache invalidated for pattern: ${pattern}`
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    });
    router18.get("/health", async (req, res) => {
      try {
        const stats = await getRedisCacheStats();
        const isHealthy = stats.connected && parseFloat(stats.hitRate || "0") > 50;
        res.json({
          success: true,
          healthy: isHealthy,
          redis: {
            connected: stats.connected,
            hitRate: stats.hitRate,
            totalKeys: stats.totalKeys
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          healthy: false,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    });
    cache_default = router18;
  }
});

// server/routes/user-auth.ts
var user_auth_exports = {};
__export(user_auth_exports, {
  default: () => user_auth_default
});
import { Router as Router12 } from "express";
import bcrypt4 from "bcryptjs";
import { v4 as uuidv43 } from "uuid";
import crypto from "crypto";
import rateLimit3 from "express-rate-limit";
var router19, loginLimiter, otpLimiter, user_auth_default;
var init_user_auth = __esm({
  "server/routes/user-auth.ts"() {
    "use strict";
    init_schemas2();
    init_passport();
    init_email_service();
    router19 = Router12();
    loginLimiter = rateLimit3({
      windowMs: 15 * 60 * 1e3,
      // 15 minutes
      max: 5,
      // 5 login attempts per window
      message: "Too many login attempts from this IP, please try again after 15 minutes",
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: true
      // Don't count successful logins
    });
    otpLimiter = rateLimit3({
      windowMs: 15 * 60 * 1e3,
      // 15 minutes
      max: 3,
      // 3 OTP requests per window per IP
      message: "Too many OTP requests. Please try again after 15 minutes.",
      standardHeaders: true,
      legacyHeaders: false
    });
    router19.post("/register", async (req, res) => {
      try {
        const { firstName, lastName, email, phone, dateOfBirth, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
          return res.status(400).json({
            message: "First name, last name, email, and password are required"
          });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ message: "Invalid email format" });
        }
        if (password.length < 6) {
          return res.status(400).json({
            message: "Password must be at least 6 characters long"
          });
        }
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
          return res.status(409).json({ message: "Email already registered" });
        }
        const hashedPassword = await bcrypt4.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1e3);
        const userId = uuidv43();
        const newUser = new User({
          id: userId,
          email: email.toLowerCase(),
          password: hashedPassword,
          firstName,
          lastName,
          phone: phone || null,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          isEmailVerified: false,
          emailVerificationToken: verificationToken,
          emailVerificationExpires: verificationExpires,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
        await newUser.save();
        const frontendUrl2 = process.env.FRONTEND_URL || "http://localhost:3000";
        const verificationUrl = `${frontendUrl2}/verify-email?token=${verificationToken}`;
        const emailResult = await sendEmail(
          email.toLowerCase(),
          "verification",
          {
            name: firstName,
            url: verificationUrl
          }
        );
        if (!emailResult.success) {
          console.warn("\u26A0\uFE0F Failed to send verification email, but user created");
        }
        res.status(201).json({
          message: "Account created! Please check your email to verify your account.",
          userId,
          emailSent: emailResult.success
        });
      } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Registration failed. Please try again." });
      }
    });
    router19.post("/login", loginLimiter, async (req, res) => {
      try {
        const { email, password, rememberMe } = req.body;
        console.log(`\u{1F510} Login attempt for: ${email}`);
        if (!email || !password) {
          return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !user.password) {
          return res.status(401).json({ message: "Invalid email or password" });
        }
        if (user.lockUntil && user.lockUntil > /* @__PURE__ */ new Date()) {
          const remainingMinutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / 6e4);
          return res.status(423).json({
            message: `Account temporarily locked due to multiple failed login attempts. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}.`,
            locked: true,
            unlockTime: user.lockUntil
          });
        }
        if (user.lockUntil && user.lockUntil <= /* @__PURE__ */ new Date()) {
          user.failedLoginAttempts = 0;
          user.lockUntil = null;
        }
        if (!user.isActive) {
          return res.status(403).json({ message: "Account is disabled. Please contact support." });
        }
        if (!user.isEmailVerified) {
          return res.status(403).json({
            message: "Please verify your email address before logging in. Check your inbox for the verification link.",
            requiresVerification: true
          });
        }
        const isPasswordValid = await bcrypt4.compare(password, user.password);
        if (!isPasswordValid) {
          user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
          if (user.failedLoginAttempts >= 5) {
            user.lockUntil = new Date(Date.now() + 30 * 60 * 1e3);
            await user.save();
            console.log(`\u{1F512} Account locked for user: ${user.email} (${user.failedLoginAttempts} failed attempts)`);
            return res.status(423).json({
              message: "Account locked due to multiple failed login attempts. Please try again in 30 minutes or reset your password.",
              locked: true
            });
          }
          await user.save();
          const remainingAttempts = 5 - user.failedLoginAttempts;
          console.log(`\u26A0\uFE0F Failed login attempt for: ${user.email} (${remainingAttempts} attempts remaining)`);
          return res.status(401).json({
            message: "Invalid email or password",
            remainingAttempts: remainingAttempts > 0 ? remainingAttempts : 0
          });
        }
        user.failedLoginAttempts = 0;
        user.lockUntil = null;
        user.lastLogin = /* @__PURE__ */ new Date();
        await user.save();
        req.session.userId = user.id;
        req.session.userEmail = user.email;
        console.log(`\u2705 Session created for user: ${user.email} (ID: ${user.id})`);
        console.log("Session ID:", req.sessionID);
        if (rememberMe) {
          req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1e3;
        } else {
          req.session.cookie.maxAge = 24 * 60 * 60 * 1e3;
        }
        req.session.save((err) => {
          if (err) {
            console.error("\u274C Session save error:", err);
            return res.status(500).json({ message: "Session creation failed. Please try again." });
          }
          console.log("\u2705 Session saved successfully");
          const userResponse = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            profileImage: user.profileImage,
            savedCars: user.savedCars,
            lastLogin: user.lastLogin
          };
          res.json({
            message: "Login successful",
            user: userResponse
          });
        });
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed. Please try again." });
      }
    });
    router19.post("/logout", (req, res) => {
      req.session.destroy((err) => {
        if (err) {
          console.error("Logout error:", err);
          return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("sid");
        res.json({ message: "Logout successful" });
      });
    });
    router19.get("/me", async (req, res) => {
      try {
        console.log("\u{1F50D} /api/user/me called");
        console.log("   - Session ID:", req.sessionID);
        console.log("   - Session userId:", req.session?.userId);
        console.log("   - Session userEmail:", req.session?.userEmail);
        console.log("   - Cookie header:", req.headers.cookie ? "present" : "missing");
        console.log("   - Origin:", req.headers.origin);
        console.log("   - Cookies received:", req.cookies);
        const userId = req.session?.userId;
        if (!userId) {
          console.log("   \u274C No userId in session, returning 401");
          return res.status(401).json({ message: "Not authenticated" });
        }
        console.log("   \u2705 userId found:", userId);
        const user = await User.findOne({ id: userId });
        if (!user) {
          console.log("   \u274C User not found in database for id:", userId);
          return res.status(404).json({ message: "User not found" });
        }
        console.log("   \u2705 User found:", user.email);
        const userResponse = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          profileImage: user.profileImage,
          savedCars: user.savedCars,
          comparisonHistory: user.comparisonHistory,
          lastLogin: user.lastLogin
        };
        res.json({ user: userResponse });
      } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ message: "Failed to get user data" });
      }
    });
    router19.put("/profile", async (req, res) => {
      try {
        const userId = req.session?.userId;
        if (!userId) {
          return res.status(401).json({ message: "Not authenticated" });
        }
        const { firstName, lastName, phone, dateOfBirth } = req.body;
        const user = await User.findOne({ id: userId });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone !== void 0) user.phone = phone;
        if (dateOfBirth !== void 0) user.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
        user.updatedAt = /* @__PURE__ */ new Date();
        await user.save();
        const userResponse = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          profileImage: user.profileImage,
          updatedAt: user.updatedAt
        };
        res.json({
          message: "Profile updated successfully",
          user: userResponse
        });
      } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Failed to update profile" });
      }
    });
    router19.get("/auth/google", (req, res, next) => {
      passport_default.authenticate("google", {
        scope: ["profile", "email"],
        session: false
      })(req, res, next);
    });
    router19.get("/auth/google/callback", (req, res, next) => {
      passport_default.authenticate("google", { session: false }, async (err, user) => {
        console.log("\u{1F504} Google OAuth callback received");
        if (err || !user) {
          console.error("\u274C Google OAuth callback error:", err);
          const frontendUrl2 = process.env.FRONTEND_URL || "http://localhost:3000";
          return res.redirect(`${frontendUrl2}/login?error=oauth_failed`);
        }
        const renderSuccessPage = (redirectUrl) => {
          const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Login Successful</title>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                            background: #fff;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                            color: #333;
                        }
                        .container {
                            text-align: center;
                            padding: 2rem;
                            border-radius: 8px;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                            background: #fff;
                            max-width: 400px;
                            width: 90%;
                        }
                        .success-icon {
                            color: #10B981;
                            font-size: 48px;
                            margin-bottom: 1rem;
                        }
                        h1 { font-size: 24px; margin-bottom: 0.5rem; }
                        p { color: #666; margin-bottom: 2rem; }
                        .btn {
                            display: inline-block;
                            background: #EF4444; /* gadizone red */
                            color: white;
                            padding: 12px 24px;
                            border-radius: 6px;
                            text-decoration: none;
                            font-weight: 500;
                            transition: background 0.2s;
                        }
                        .btn:hover { background: #DC2626; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="success-icon">\u2713</div>
                        <h1>Login Successful</h1>
                        <p>You are being redirected to the app...</p>
                        <a href="${redirectUrl}" class="btn">Click here if not redirected</a>
                    </div>
                    <script>
                        setTimeout(function() {
                            window.location.href = "${redirectUrl}";
                        }, 1000);
                    </script>
                </body>
                </html>
            `;
          res.send(html);
        };
        try {
          user.lastLogin = /* @__PURE__ */ new Date();
          await user.save();
          req.session.regenerate((regenerateErr) => {
            if (regenerateErr) {
              console.error("\u274C Session regenerate error:", regenerateErr);
              const frontendUrl2 = process.env.FRONTEND_URL || "http://localhost:3000";
              return res.redirect(`${frontendUrl2}/login?error=session_failed`);
            }
            req.session.userId = user.id;
            req.session.userEmail = user.email;
            console.log("\u2705 Google OAuth successful for:", user.email);
            console.log("   - User ID:", user.id);
            console.log("   - Session ID after regeneration:", req.sessionID);
            console.log("   - Session data:", { userId: req.session.userId, userEmail: req.session.userEmail });
            req.session.save((saveErr) => {
              if (saveErr) {
                console.error("\u274C Session save error:", saveErr);
                const frontendUrl3 = process.env.FRONTEND_URL || "http://localhost:3000";
                return res.redirect(`${frontendUrl3}/login?error=session_failed`);
              }
              console.log("\u2705 Session saved successfully");
              console.log("   - Session ID:", req.sessionID);
              console.log("   - Cookie settings:", JSON.stringify(req.session.cookie, null, 2));
              console.log("   - Cookie domain:", req.session.cookie.domain);
              console.log("   - Cookie secure:", req.session.cookie.secure);
              console.log("   - Cookie sameSite:", req.session.cookie.sameSite);
              console.log("   - Cookie httpOnly:", req.session.cookie.httpOnly);
              console.log("   - Cookie path:", req.session.cookie.path);
              const cookieHeader = res.getHeader("Set-Cookie");
              console.log("   - Set-Cookie header will be:", cookieHeader);
              const sessionUserId = req.session?.userId;
              if (!sessionUserId) {
                console.error("\u26A0\uFE0F  Warning: Session save completed but userId not found in session");
              }
              let frontendUrl2 = process.env.FRONTEND_URL || "https://www.gadizone.com";
              if (!process.env.FRONTEND_URL && process.env.NODE_ENV !== "production") {
                frontendUrl2 = "http://localhost:3000";
              }
              frontendUrl2 = frontendUrl2.replace(/\/$/, "");
              const targetUrl = `${frontendUrl2}/?login=success`;
              console.log("\u{1F500} Redirecting to:", targetUrl);
              renderSuccessPage(targetUrl);
            });
          });
        } catch (error) {
          console.error("\u274C Session creation error:", error);
          const frontendUrl2 = process.env.FRONTEND_URL || "http://localhost:3000";
          res.redirect(`${frontendUrl2}/login?error=session_failed`);
        }
      })(req, res, next);
    });
    router19.get("/verify-email/:token", async (req, res) => {
      try {
        const { token } = req.params;
        const user = await User.findOne({
          emailVerificationToken: token,
          emailVerificationExpires: { $gt: /* @__PURE__ */ new Date() }
        });
        if (!user) {
          const frontendUrl2 = process.env.FRONTEND_URL || "http://localhost:3000";
          return res.redirect(`${frontendUrl2}/verify-email?status=error&message=invalid_token`);
        }
        user.isEmailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;
        user.updatedAt = /* @__PURE__ */ new Date();
        await user.save();
        console.log("\u2705 Email verified for:", user.email);
        await sendEmail(
          user.email,
          "welcome",
          { name: user.firstName }
        );
        req.session.userId = user.id;
        req.session.userEmail = user.email;
        req.session.save((err) => {
          if (err) {
            console.error("\u274C Session save error after verification:", err);
            const frontendUrl3 = process.env.FRONTEND_URL || "http://localhost:3000";
            return res.redirect(`${frontendUrl3}/?verified=true&login=failed`);
          }
          console.log("\u2705 Session saved after email verification");
          const frontendUrl2 = process.env.FRONTEND_URL || "http://localhost:3000";
          res.redirect(`${frontendUrl2}/?verified=true`);
        });
      } catch (error) {
        console.error("Email verification error:", error);
        const frontendUrl2 = process.env.FRONTEND_URL || "http://localhost:3000";
        res.redirect(`${frontendUrl2}/verify-email?status=error&message=server_error`);
      }
    });
    router19.post("/resend-verification", async (req, res) => {
      try {
        const { email } = req.body;
        if (!email) {
          return res.status(400).json({ message: "Email is required" });
        }
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          return res.json({ message: "If the email exists and is unverified, a new verification link has been sent." });
        }
        if (user.isEmailVerified) {
          return res.status(400).json({ message: "Email is already verified" });
        }
        const verificationToken = crypto.randomBytes(32).toString("hex");
        user.emailVerificationToken = verificationToken;
        user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1e3);
        user.updatedAt = /* @__PURE__ */ new Date();
        await user.save();
        const frontendUrl2 = process.env.FRONTEND_URL || "http://localhost:3000";
        const verificationUrl = `${frontendUrl2}/verify-email?token=${verificationToken}`;
        await sendEmail(
          user.email,
          "verification",
          {
            name: user.firstName,
            url: verificationUrl
          }
        );
        res.json({ message: "Verification email sent successfully!" });
      } catch (error) {
        console.error("Resend verification error:", error);
        res.status(500).json({ message: "Failed to resend verification email" });
      }
    });
    router19.post("/forgot-password", async (req, res) => {
      try {
        const { email } = req.body;
        if (!email) {
          return res.status(400).json({ message: "Email is required" });
        }
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          return res.status(404).json({
            message: "This email is not registered. Please sign up to create an account.",
            isNewEmail: true
          });
        }
        if (!user.password) {
          return res.status(400).json({
            message: 'This account uses Google sign-in. Please use "Continue with Google" to log in.'
          });
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1e3);
        user.updatedAt = /* @__PURE__ */ new Date();
        await user.save();
        const frontendUrl2 = process.env.FRONTEND_URL || "http://localhost:3000";
        const resetUrl = `${frontendUrl2}/reset-password?token=${resetToken}`;
        await sendEmail(
          user.email,
          "passwordReset",
          {
            name: user.firstName,
            url: resetUrl
          }
        );
        console.log("\u2705 Password reset email sent to:", user.email);
        const standardResponse = "If an account exists with that email, a password reset link has been sent.";
        res.json({ message: standardResponse });
      } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Failed to process password reset request" });
      }
    });
    router19.post("/reset-password", async (req, res) => {
      try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
          return res.status(400).json({ message: "Token and new password are required" });
        }
        if (newPassword.length < 6) {
          return res.status(400).json({
            message: "Password must be at least 6 characters long"
          });
        }
        const user = await User.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: /* @__PURE__ */ new Date() }
        });
        if (!user) {
          return res.status(400).json({
            message: "Password reset link is invalid or has expired. Please request a new one."
          });
        }
        const hashedPassword = await bcrypt4.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        user.updatedAt = /* @__PURE__ */ new Date();
        await user.save();
        console.log("\u2705 Password reset successful for:", user.email);
        res.json({
          message: "Password reset successful! You can now log in with your new password."
        });
      } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Failed to reset password" });
      }
    });
    router19.post("/send-otp", otpLimiter, async (req, res) => {
      try {
        const { email } = req.body;
        console.log(`\u{1F4E7} OTP request for: ${email}`);
        if (!email) {
          return res.status(400).json({ message: "Email is required" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ message: "Invalid email format" });
        }
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          return res.status(404).json({
            message: "No account found with this email. Please sign up first.",
            isNewEmail: true
          });
        }
        if (!user.isActive) {
          return res.status(403).json({ message: "Account is disabled. Please contact support." });
        }
        if (user.lockUntil && user.lockUntil > /* @__PURE__ */ new Date()) {
          const remainingMinutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / 6e4);
          return res.status(423).json({
            message: `Account temporarily locked. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}.`,
            locked: true
          });
        }
        const otp = Math.floor(1e5 + Math.random() * 9e5).toString();
        const hashedOtp = await bcrypt4.hash(otp, 10);
        user.otp = hashedOtp;
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1e3);
        user.otpAttempts = 0;
        user.updatedAt = /* @__PURE__ */ new Date();
        await user.save();
        const emailResult = await sendEmail(
          user.email,
          "otpLogin",
          {
            name: user.firstName || "",
            otp
          }
        );
        if (!emailResult.success) {
          console.error("\u274C Failed to send OTP email:", emailResult.error);
          return res.status(500).json({ message: "Failed to send OTP. Please try again." });
        }
        console.log(`\u2705 OTP sent to: ${user.email}`);
        const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, "$1***$3");
        res.json({
          message: "OTP sent successfully!",
          maskedEmail
        });
      } catch (error) {
        console.error("Send OTP error:", error);
        res.status(500).json({ message: "Failed to send OTP. Please try again." });
      }
    });
    router19.post("/verify-otp", loginLimiter, async (req, res) => {
      try {
        const { email, otp, rememberMe } = req.body;
        console.log(`\u{1F510} OTP verification attempt for: ${email}`);
        if (!email || !otp) {
          return res.status(400).json({ message: "Email and OTP are required" });
        }
        if (!/^\d{6}$/.test(otp)) {
          return res.status(400).json({ message: "Invalid OTP format. Please enter 6 digits." });
        }
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          return res.status(401).json({ message: "Invalid email or OTP" });
        }
        if (user.lockUntil && user.lockUntil > /* @__PURE__ */ new Date()) {
          const remainingMinutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / 6e4);
          return res.status(423).json({
            message: `Account temporarily locked. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}.`,
            locked: true
          });
        }
        if (user.lockUntil && user.lockUntil <= /* @__PURE__ */ new Date()) {
          user.otpAttempts = 0;
          user.lockUntil = null;
        }
        if (!user.otp || !user.otpExpires) {
          return res.status(400).json({
            message: "No OTP found. Please request a new one.",
            expired: true
          });
        }
        if (user.otpExpires < /* @__PURE__ */ new Date()) {
          user.otp = null;
          user.otpExpires = null;
          await user.save();
          return res.status(400).json({
            message: "OTP has expired. Please request a new one.",
            expired: true
          });
        }
        const isOtpValid = await bcrypt4.compare(otp, user.otp);
        if (!isOtpValid) {
          user.otpAttempts = (user.otpAttempts || 0) + 1;
          if (user.otpAttempts >= 5) {
            user.lockUntil = new Date(Date.now() + 15 * 60 * 1e3);
            user.otp = null;
            user.otpExpires = null;
            await user.save();
            console.log(`\u{1F512} Account locked for user: ${user.email} (${user.otpAttempts} failed OTP attempts)`);
            return res.status(423).json({
              message: "Too many failed attempts. Account locked for 15 minutes.",
              locked: true
            });
          }
          await user.save();
          const remainingAttempts = 5 - user.otpAttempts;
          console.log(`\u26A0\uFE0F Failed OTP attempt for: ${user.email} (${remainingAttempts} attempts remaining)`);
          return res.status(401).json({
            message: "Invalid OTP. Please try again.",
            remainingAttempts: remainingAttempts > 0 ? remainingAttempts : 0
          });
        }
        user.otp = null;
        user.otpExpires = null;
        user.otpAttempts = 0;
        user.lockUntil = null;
        user.lastLogin = /* @__PURE__ */ new Date();
        user.isEmailVerified = true;
        user.updatedAt = /* @__PURE__ */ new Date();
        await user.save();
        console.log(`\u2705 OTP verified for: ${user.email}`);
        req.session.userId = user.id;
        req.session.userEmail = user.email;
        if (rememberMe) {
          req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1e3;
        } else {
          req.session.cookie.maxAge = 24 * 60 * 60 * 1e3;
        }
        sendEmail(
          user.email,
          "welcomeLogin",
          { name: user.firstName || "there" }
        ).catch((err) => console.warn("\u26A0\uFE0F Welcome email failed:", err));
        req.session.save((err) => {
          if (err) {
            console.error("\u274C Session save error:", err);
            return res.status(500).json({ message: "Login failed. Please try again." });
          }
          console.log("\u2705 Session saved after OTP verification");
          const userResponse = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            profileImage: user.profileImage,
            savedCars: user.savedCars,
            lastLogin: user.lastLogin
          };
          res.json({
            message: "Login successful!",
            user: userResponse
          });
        });
      } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ message: "Login failed. Please try again." });
      }
    });
    router19.post("/register-send-otp", otpLimiter, async (req, res) => {
      try {
        const { firstName, lastName, email, phone, dateOfBirth } = req.body;
        console.log(`\u{1F4E7} Registration OTP request for: ${email}`);
        if (!firstName || !lastName || !email) {
          return res.status(400).json({
            message: "First name, last name, and email are required"
          });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ message: "Invalid email format" });
        }
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
          return res.status(409).json({
            message: "This email is already registered. Please login instead.",
            alreadyExists: true
          });
        }
        const otp = Math.floor(1e5 + Math.random() * 9e5).toString();
        const hashedOtp = await bcrypt4.hash(otp, 10);
        const userId = uuidv43();
        const pendingUser = new User({
          id: userId,
          email: email.toLowerCase(),
          password: null,
          // No password for OTP-based registration
          firstName,
          lastName,
          phone: phone || null,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          isEmailVerified: false,
          isActive: false,
          // Not active until OTP verified
          otp: hashedOtp,
          otpExpires: new Date(Date.now() + 5 * 60 * 1e3),
          // 5 minutes
          otpAttempts: 0,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
        await pendingUser.save();
        const emailResult = await sendEmail(
          email.toLowerCase(),
          "otpLogin",
          {
            name: firstName,
            otp
          }
        );
        if (!emailResult.success) {
          await User.deleteOne({ id: userId });
          console.error("\u274C Failed to send registration OTP email:", emailResult.error);
          return res.status(500).json({ message: "Failed to send OTP. Please try again." });
        }
        console.log(`\u2705 Registration OTP sent to: ${email}`);
        const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, "$1***$3");
        res.json({
          message: "OTP sent successfully!",
          maskedEmail,
          userId
        });
      } catch (error) {
        console.error("Register send OTP error:", error);
        if (error.code === 11e3) {
          return res.status(409).json({
            message: "This email is already registered. Please login instead.",
            alreadyExists: true
          });
        }
        res.status(500).json({ message: "Failed to send OTP. Please try again." });
      }
    });
    router19.post("/register-verify-otp", loginLimiter, async (req, res) => {
      try {
        const { email, otp } = req.body;
        console.log(`\u{1F510} Registration OTP verification for: ${email}`);
        if (!email || !otp) {
          return res.status(400).json({ message: "Email and OTP are required" });
        }
        if (!/^\d{6}$/.test(otp)) {
          return res.status(400).json({ message: "Invalid OTP format. Please enter 6 digits." });
        }
        const user = await User.findOne({ email: email.toLowerCase(), isActive: false });
        if (!user) {
          return res.status(400).json({
            message: "No pending registration found. Please start again.",
            notFound: true
          });
        }
        if (!user.otp || !user.otpExpires) {
          return res.status(400).json({
            message: "No OTP found. Please request a new one.",
            expired: true
          });
        }
        if (user.otpExpires < /* @__PURE__ */ new Date()) {
          await User.deleteOne({ id: user.id });
          return res.status(400).json({
            message: "OTP has expired. Please register again.",
            expired: true
          });
        }
        const isOtpValid = await bcrypt4.compare(otp, user.otp);
        if (!isOtpValid) {
          user.otpAttempts = (user.otpAttempts || 0) + 1;
          if (user.otpAttempts >= 5) {
            await User.deleteOne({ id: user.id });
            return res.status(423).json({
              message: "Too many failed attempts. Please register again.",
              locked: true
            });
          }
          await user.save();
          const remainingAttempts = 5 - user.otpAttempts;
          return res.status(401).json({
            message: "Invalid OTP. Please try again.",
            remainingAttempts
          });
        }
        user.otp = null;
        user.otpExpires = null;
        user.otpAttempts = 0;
        user.isEmailVerified = true;
        user.isActive = true;
        user.lastLogin = /* @__PURE__ */ new Date();
        user.updatedAt = /* @__PURE__ */ new Date();
        await user.save();
        console.log(`\u2705 Registration completed for: ${user.email}`);
        req.session.userId = user.id;
        req.session.userEmail = user.email;
        sendEmail(
          user.email,
          "welcome",
          { name: user.firstName || "there" }
        ).catch((err) => console.warn("\u26A0\uFE0F Welcome email failed:", err));
        req.session.save((err) => {
          if (err) {
            console.error("\u274C Session save error:", err);
            return res.status(500).json({ message: "Account created but login failed. Please login manually." });
          }
          console.log("\u2705 Session saved after registration");
          const userResponse = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            profileImage: user.profileImage,
            savedCars: user.savedCars,
            lastLogin: user.lastLogin
          };
          res.status(201).json({
            message: "Account created successfully! Welcome to gadizone.",
            user: userResponse
          });
        });
      } catch (error) {
        console.error("Register verify OTP error:", error);
        res.status(500).json({ message: "Registration failed. Please try again." });
      }
    });
    user_auth_default = router19;
  }
});

// server/routes/admin-users.ts
var admin_users_exports = {};
__export(admin_users_exports, {
  default: () => admin_users_default
});
import { Router as Router13 } from "express";
var router20, admin_users_default;
var init_admin_users = __esm({
  "server/routes/admin-users.ts"() {
    "use strict";
    init_schemas2();
    router20 = Router13();
    router20.get("/export", async (req, res) => {
      try {
        const users = await User.find({}).sort({ createdAt: -1 }).lean();
        const csvHeader = "ID,Email,First Name,Last Name,Phone,Date of Birth,Google ID,Active,Email Verified,Saved Cars Count,Created At,Last Login\n";
        const csvRows = users.map((user) => {
          return [
            user.id,
            user.email,
            user.firstName || "",
            user.lastName || "",
            user.phone || "",
            user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "",
            user.googleId || "",
            user.isActive ? "Yes" : "No",
            user.isEmailVerified ? "Yes" : "No",
            user.savedCars?.length || 0,
            new Date(user.createdAt).toISOString(),
            user.lastLogin ? new Date(user.lastLogin).toISOString() : ""
          ].map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",");
        }).join("\n");
        const csv = csvHeader + csvRows;
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="users-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv"`);
        res.status(200).send(csv);
        console.log(`\u2705 Admin exported ${users.length} users to CSV`);
      } catch (error) {
        console.error("CSV export error:", error);
        res.status(500).json({ message: "Failed to export users" });
      }
    });
    router20.get("/stats", async (req, res) => {
      try {
        const totalUsers = await User.countDocuments({});
        const activeUsers = await User.countDocuments({ isActive: true });
        const googleUsers = await User.countDocuments({ googleId: { $ne: null } });
        const emailUsers = await User.countDocuments({ password: { $ne: null } });
        const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
        const startOfMonth = /* @__PURE__ */ new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const newThisMonth = await User.countDocuments({
          createdAt: { $gte: startOfMonth }
        });
        const sevenDaysAgo = /* @__PURE__ */ new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const activeLastWeek = await User.countDocuments({
          lastLogin: { $gte: sevenDaysAgo }
        });
        res.json({
          totalUsers,
          activeUsers,
          inactiveUsers: totalUsers - activeUsers,
          googleUsers,
          emailUsers,
          verifiedUsers,
          newThisMonth,
          activeLastWeek
        });
      } catch (error) {
        console.error("Stats error:", error);
        res.status(500).json({ message: "Failed to get statistics" });
      }
    });
    router20.get("/recent", async (req, res) => {
      try {
        const limit = parseInt(req.query.limit) || 10;
        const users = await User.find({}).sort({ createdAt: -1 }).limit(limit).select("-password").lean();
        res.json({ users });
      } catch (error) {
        console.error("Recent users error:", error);
        res.status(500).json({ message: "Failed to get recent users" });
      }
    });
    admin_users_default = router20;
  }
});

// server/routes/diagnostics.ts
var diagnostics_exports = {};
__export(diagnostics_exports, {
  default: () => diagnostics_default
});
import { Router as Router14 } from "express";
var router21, redis4, diagnostics_default;
var init_diagnostics = __esm({
  "server/routes/diagnostics.ts"() {
    "use strict";
    init_redis_cache();
    init_redis_config();
    router21 = Router14();
    redis4 = getCacheRedisClient();
    router21.get("/", async (req, res) => {
      const isProd2 = process.env.NODE_ENV === "production" || !!process.env.RENDER;
      const isGadizoneDomain2 = isProd2 && (process.env.FRONTEND_URL?.includes("gadizone.com") || process.env.BACKEND_URL?.includes("gadizone.com"));
      let redisCacheStatus = "disconnected";
      try {
        if (redis4) {
          await redis4.ping();
          redisCacheStatus = "connected";
        }
      } catch (e) {
        redisCacheStatus = "error";
      }
      const sessionStatus = req.session ? "active" : "inactive";
      const sessionID = req.sessionID;
      const diagnostics = {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        environment: process.env.NODE_ENV || "development",
        isProd: isProd2,
        isRender: !!process.env.RENDER,
        trustProxy: req.app.get("trust proxy"),
        // CRITICAL: Domain configuration for cookies
        domainConfig: {
          FRONTEND_URL: process.env.FRONTEND_URL || "(not set)",
          BACKEND_URL: process.env.BACKEND_URL || "(not set)",
          isGadizoneDomain: isGadizoneDomain2,
          expectedCookieDomain: isGadizoneDomain2 ? ".gadizone.com" : "(not set - defaults to host)"
        },
        redis: {
          cache: redisCacheStatus,
          url_configured: !!process.env.REDIS_URL,
          host_configured: !!process.env.REDIS_HOST
        },
        session: {
          status: sessionStatus,
          id: sessionID,
          cookieConfig: req.session?.cookie,
          hasUser: !!req.session?.userId,
          userId: req.session?.userId || null,
          userEmail: req.session?.userEmail || null
        },
        // We can't access `isProd` directly from index.ts but we can check the cookie property to guess
        actualCookieSettings: {
          secure: req.session?.cookie.secure,
          sameSite: req.session?.cookie.sameSite,
          httpOnly: req.session?.cookie.httpOnly,
          path: req.session?.cookie.path,
          domain: req.session?.cookie.domain
        },
        headers: {
          host: req.get("host"),
          origin: req.get("origin"),
          "x-forwarded-proto": req.get("x-forwarded-proto"),
          "x-forwarded-for": req.get("x-forwarded-for"),
          "cookie-present": !!req.get("cookie"),
          "cookie-header": req.get("cookie") ? "sid=" + (req.get("cookie")?.includes("sid=") ? "present" : "missing") : "no cookies"
        }
      };
      res.json(diagnostics);
    });
    router21.get("/redis", async (req, res) => {
      const status = getRedisStatus();
      let pingResult = "failed";
      try {
        const client2 = getCacheRedisClient();
        if (client2) {
          const pong = await client2.ping();
          pingResult = pong === "PONG" ? "success" : "failed";
        }
      } catch (e) {
        pingResult = "error: " + e.message;
      }
      res.json({
        ...status,
        ping: pingResult,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    });
    router21.get("/test-session", (req, res) => {
      const session2 = req.session;
      const previousValue = session2.testValue;
      const previousTimestamp = session2.testTimestamp;
      session2.testValue = "session_test_" + Date.now();
      session2.testTimestamp = (/* @__PURE__ */ new Date()).toISOString();
      req.session.save((err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: "Failed to save session: " + err.message,
            sessionId: req.sessionID
          });
        }
        res.json({
          success: true,
          message: "Session test - refresh this page to verify persistence",
          sessionId: req.sessionID,
          currentValue: session2.testValue,
          previousValue: previousValue || "(none - first visit)",
          previousTimestamp: previousTimestamp || "(none)",
          cookieDomain: req.session.cookie.domain,
          instruction: "If previousValue shows the value from your last request, sessions are working correctly!"
        });
      });
    });
    router21.get("/clear-test", (req, res) => {
      const session2 = req.session;
      delete session2.testValue;
      delete session2.testTimestamp;
      req.session.save((err) => {
        res.json({
          success: !err,
          message: err ? "Failed to clear: " + err.message : "Test session data cleared"
        });
      });
    });
    router21.get("/test-email", async (req, res) => {
      const emailTo = req.query.email || process.env.GMAIL_USER || "test@example.com";
      const { sendEmail: sendEmail2 } = await Promise.resolve().then(() => (init_email_service(), email_service_exports));
      try {
        const result = await sendEmail2(
          emailTo,
          "welcome",
          // Use welcome template as it's simple
          { name: "Test User" }
        );
        if (result.success) {
          res.json({
            success: true,
            message: `Email sent successfully to ${emailTo}`,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            config: {
              user: process.env.GMAIL_USER ? "Set" : "Missing",
              pass: process.env.GMAIL_APP_PASSWORD ? "Set (length: " + process.env.GMAIL_APP_PASSWORD.length + ")" : "Missing"
            }
          });
        } else {
          res.status(500).json({
            success: false,
            message: "Failed to send email",
            error: result.error,
            config: {
              user: process.env.GMAIL_USER ? "Set" : "Missing",
              pass: process.env.GMAIL_APP_PASSWORD ? "Set (length: " + process.env.GMAIL_APP_PASSWORD.length + ")" : "Missing"
            }
          });
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Unexpected error testing email",
          error: error.message
        });
      }
    });
    diagnostics_default = router21;
  }
});

// server/db/user-activity.schema.ts
import mongoose7 from "mongoose";
async function logActivity(params) {
  try {
    await UserActivity.create(params);
    console.log(`[Activity] Logged: ${params.activityType} for ${params.userId || params.sessionId}`);
  } catch (error) {
    console.error("[Activity] Error logging activity:", error);
  }
}
async function getRecentActivities(identifiers, limit = 20) {
  const query = identifiers.userId ? { userId: identifiers.userId } : { sessionId: identifiers.sessionId };
  return UserActivity.find(query).sort({ createdAt: -1 }).limit(limit).lean();
}
async function getInferredPreferences(identifiers) {
  const activities = await getRecentActivities(identifiers, 50);
  const bodyTypes = {};
  const fuelTypes = {};
  const brands = {};
  const prices = [];
  for (const activity of activities) {
    const prefs = activity.inferredPreferences;
    if (!prefs) continue;
    if (prefs.bodyType) {
      bodyTypes[prefs.bodyType] = (bodyTypes[prefs.bodyType] || 0) + 1;
    }
    if (prefs.fuelType) {
      fuelTypes[prefs.fuelType] = (fuelTypes[prefs.fuelType] || 0) + 1;
    }
    if (prefs.brandId) {
      brands[prefs.brandId] = (brands[prefs.brandId] || 0) + 1;
    }
    if (prefs.priceRange?.min) prices.push(prefs.priceRange.min);
    if (prefs.priceRange?.max) prices.push(prefs.priceRange.max);
  }
  const topBodyType = Object.entries(bodyTypes).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topFuelType = Object.entries(fuelTypes).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topBrand = Object.entries(brands).sort((a, b) => b[1] - a[1])[0]?.[0];
  return {
    preferredBodyType: topBodyType || null,
    preferredFuelType: topFuelType || null,
    preferredBrandId: topBrand || null,
    budgetRange: prices.length > 0 ? {
      min: Math.min(...prices),
      max: Math.max(...prices)
    } : null
  };
}
var userActivitySchema, UserActivity;
var init_user_activity_schema = __esm({
  "server/db/user-activity.schema.ts"() {
    "use strict";
    userActivitySchema = new mongoose7.Schema({
      // User identification (one of these should be present)
      userId: { type: String, default: null },
      // Logged-in user ID
      sessionId: { type: String, required: true },
      // Anonymous session tracking
      // What was viewed
      modelId: { type: String, default: null },
      variantId: { type: String, default: null },
      brandId: { type: String, default: null },
      // Activity type
      activityType: {
        type: String,
        required: true,
        enum: [
          "view_model",
          "view_variant",
          "view_price_breakup",
          "compare",
          "save",
          "unsave",
          "download_brochure",
          "emi_calculate",
          "share",
          "search"
        ]
      },
      // Additional context
      duration: { type: Number, default: 0 },
      // Time spent in seconds
      metadata: {
        type: mongoose7.Schema.Types.Mixed,
        default: {}
      },
      // Inferred preferences (extracted from activity)
      inferredPreferences: {
        bodyType: { type: String, default: null },
        priceRange: {
          min: { type: Number, default: null },
          max: { type: Number, default: null }
        },
        fuelType: { type: String, default: null },
        brandId: { type: String, default: null }
      },
      // Timestamps with TTL
      createdAt: {
        type: Date,
        default: Date.now,
        expires: 7776e3
        // 90 days TTL (auto-delete)
      }
    });
    userActivitySchema.index({ userId: 1, createdAt: -1 });
    userActivitySchema.index({ sessionId: 1, createdAt: -1 });
    userActivitySchema.index({ modelId: 1, activityType: 1 });
    userActivitySchema.index({ variantId: 1, activityType: 1 });
    userActivitySchema.index({ activityType: 1, createdAt: -1 });
    userActivitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 0 });
    UserActivity = mongoose7.model("UserActivity", userActivitySchema);
  }
});

// server/routes/recommendations.ts
var recommendations_exports = {};
__export(recommendations_exports, {
  default: () => recommendations_default
});
import express14 from "express";
var router22, recommendations_default;
var init_recommendations = __esm({
  "server/routes/recommendations.ts"() {
    "use strict";
    init_recommendation_service();
    init_user_activity_schema();
    router22 = express14.Router();
    router22.get("/similar/model/:modelId", async (req, res) => {
      try {
        const { modelId } = req.params;
        const limit = parseInt(req.query.limit) || 6;
        const excludeStr = req.query.exclude || "";
        const excludeIds = excludeStr ? excludeStr.split(",") : [];
        const recommendations = await getSimilarModels(
          { type: "model", sourceId: modelId },
          limit,
          excludeIds
        );
        res.json({
          success: true,
          count: recommendations.length,
          recommendations
        });
      } catch (error) {
        console.error("[Recommendations API] Error:", error);
        res.status(500).json({
          success: false,
          error: error.message || "Failed to get recommendations"
        });
      }
    });
    router22.get("/similar/variant/:variantId", async (req, res) => {
      try {
        const { variantId } = req.params;
        const limit = parseInt(req.query.limit) || 6;
        const excludeStr = req.query.exclude || "";
        const excludeIds = excludeStr ? excludeStr.split(",") : [];
        const recommendations = await getSimilarVariants(
          { type: "variant", sourceId: variantId },
          limit,
          excludeIds
        );
        res.json({
          success: true,
          count: recommendations.length,
          recommendations
        });
      } catch (error) {
        console.error("[Recommendations API] Error:", error);
        res.status(500).json({
          success: false,
          error: error.message || "Failed to get recommendations"
        });
      }
    });
    router22.get("/personalized", async (req, res) => {
      try {
        const userId = req.session?.userId;
        const sessionId = req.sessionID || req.query.sessionId;
        const limit = parseInt(req.query.limit) || 5;
        const recommendations = await getPersonalizedRecommendations(
          userId,
          sessionId,
          limit
        );
        res.json({
          success: true,
          count: recommendations.length,
          recommendations
        });
      } catch (error) {
        console.error("[Recommendations API] Error:", error);
        res.status(500).json({
          success: false,
          error: error.message || "Failed to get recommendations"
        });
      }
    });
    router22.post("/activity", async (req, res) => {
      try {
        const {
          activityType,
          modelId,
          variantId,
          brandId,
          duration,
          metadata,
          inferredPreferences
        } = req.body;
        const userId = req.session?.userId;
        const sessionId = req.sessionID || req.body.sessionId;
        if (!sessionId) {
          return res.status(400).json({
            success: false,
            error: "Session ID required"
          });
        }
        if (!activityType) {
          return res.status(400).json({
            success: false,
            error: "Activity type required"
          });
        }
        await logActivity({
          userId,
          sessionId,
          activityType,
          modelId,
          variantId,
          brandId,
          duration,
          metadata,
          inferredPreferences
        });
        res.json({ success: true });
      } catch (error) {
        console.error("[Activity API] Error:", error);
        res.status(500).json({
          success: false,
          error: error.message || "Failed to log activity"
        });
      }
    });
    router22.get("/preferences", async (req, res) => {
      try {
        const userId = req.session?.userId;
        const sessionId = req.sessionID || req.query.sessionId;
        if (!userId && !sessionId) {
          return res.status(400).json({
            success: false,
            error: "User ID or Session ID required"
          });
        }
        const preferences = await getInferredPreferences({ userId, sessionId });
        res.json({
          success: true,
          preferences
        });
      } catch (error) {
        console.error("[Preferences API] Error:", error);
        res.status(500).json({
          success: false,
          error: error.message || "Failed to get preferences"
        });
      }
    });
    router22.get("/history", async (req, res) => {
      try {
        const userId = req.session?.userId;
        const sessionId = req.sessionID || req.query.sessionId;
        const limit = parseInt(req.query.limit) || 20;
        if (!userId && !sessionId) {
          return res.status(400).json({
            success: false,
            error: "User ID or Session ID required"
          });
        }
        const activities = await getRecentActivities({ userId, sessionId }, limit);
        res.json({
          success: true,
          count: activities.length,
          activities
        });
      } catch (error) {
        console.error("[History API] Error:", error);
        res.status(500).json({
          success: false,
          error: error.message || "Failed to get history"
        });
      }
    });
    recommendations_default = router22;
  }
});

// services/scheduledFetcher.js
var scheduledFetcher_exports = {};
var cron4, fs7, path7, ScheduledFetcher;
var init_scheduledFetcher = __esm({
  "services/scheduledFetcher.js"() {
    "use strict";
    cron4 = __require("node-cron");
    fs7 = __require("fs").promises;
    path7 = __require("path");
    ScheduledFetcher = class {
      constructor() {
        this.isRunning = false;
        this.lastFetchTimes = {
          afternoon: null,
          evening: null
        };
        this.cacheFile = path7.join(__dirname, "../cache/fetch-cache.json");
        this.logFile = path7.join(__dirname, "../logs/scheduler.log");
        this.loadFetchHistory();
      }
      /**
       * Initialize the scheduler
       */
      async init() {
        console.log("\u{1F550} Initializing Scheduled API Fetcher...");
        await this.ensureDirectories();
        cron4.schedule("0 13 * * *", async () => {
          await this.executeFetch("afternoon", "1:00 PM");
        }, {
          scheduled: true,
          timezone: "Asia/Kolkata"
          // IST timezone
        });
        cron4.schedule("0 20 * * *", async () => {
          await this.executeFetch("evening", "8:00 PM");
        }, {
          scheduled: true,
          timezone: "Asia/Kolkata"
          // IST timezone
        });
        console.log("\u2705 Scheduler initialized successfully");
        console.log("\u{1F4C5} Next fetches scheduled for: 1:00 PM and 8:00 PM IST");
        await this.logEvent("Scheduler initialized");
      }
      /**
       * Execute the API fetch
       */
      async executeFetch(timeSlot, timeLabel) {
        if (this.isRunning) {
          console.log("\u23F3 Fetch already in progress, skipping...");
          return;
        }
        try {
          this.isRunning = true;
          const startTime = /* @__PURE__ */ new Date();
          console.log(`\u{1F680} Starting scheduled fetch at ${timeLabel} (${startTime.toISOString()})`);
          await this.logEvent(`Starting ${timeSlot} fetch at ${timeLabel}`);
          if (await this.alreadyFetchedToday(timeSlot)) {
            console.log(`\u2705 Already fetched for ${timeLabel} today, skipping...`);
            return;
          }
          const results = await this.performAPIFetches();
          this.lastFetchTimes[timeSlot] = startTime.toISOString();
          await this.saveFetchHistory();
          await this.cacheResults(results, timeSlot);
          const endTime = /* @__PURE__ */ new Date();
          const duration = endTime - startTime;
          console.log(`\u2705 Fetch completed successfully in ${duration}ms`);
          await this.logEvent(`${timeSlot} fetch completed successfully. Duration: ${duration}ms. Results: ${JSON.stringify(results.summary)}`);
        } catch (error) {
          console.error(`\u274C Error during ${timeLabel} fetch:`, error);
          await this.logEvent(`ERROR during ${timeSlot} fetch: ${error.message}`);
        } finally {
          this.isRunning = false;
        }
      }
      /**
       * Perform the actual API fetches
       */
      async performAPIFetches() {
        const results = {
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          summary: {
            totalAPICalls: 0,
            successfulCalls: 0,
            failedCalls: 0,
            tokensUsed: 0
          },
          data: {}
        };
        try {
          console.log("\u{1F4E1} Fetching car data from external API...");
          const carData = await this.fetchCarData();
          results.data.cars = carData;
          results.summary.totalAPICalls++;
          results.summary.successfulCalls++;
          results.summary.tokensUsed += carData.tokensUsed || 0;
          console.log("\u{1F4E1} Fetching brand data from external API...");
          const brandData = await this.fetchBrandData();
          results.data.brands = brandData;
          results.summary.totalAPICalls++;
          results.summary.successfulCalls++;
          results.summary.tokensUsed += brandData.tokensUsed || 0;
          console.log("\u{1F4E1} Fetching news updates...");
          const newsData = await this.fetchNewsData();
          results.data.news = newsData;
          results.summary.totalAPICalls++;
          results.summary.successfulCalls++;
          results.summary.tokensUsed += newsData.tokensUsed || 0;
        } catch (error) {
          results.summary.failedCalls++;
          console.error("API fetch error:", error);
        }
        return results;
      }
      /**
       * Fetch car data from external API
       */
      async fetchCarData() {
        try {
          const response = await fetch("https://api.example.com/cars", {
            headers: {
              "Authorization": `Bearer ${process.env.EXTERNAL_API_TOKEN}`,
              "Content-Type": "application/json"
            }
          });
          if (!response.ok) {
            throw new Error(`Car API responded with ${response.status}`);
          }
          const data = await response.json();
          return {
            count: data.length || 0,
            data,
            tokensUsed: 1,
            // Track token usage
            fetchTime: (/* @__PURE__ */ new Date()).toISOString()
          };
        } catch (error) {
          console.error("Error fetching car data:", error);
          return {
            count: 0,
            data: [],
            tokensUsed: 0,
            error: error.message,
            fetchTime: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
      }
      /**
       * Fetch brand data from external API
       */
      async fetchBrandData() {
        try {
          const response = await fetch("https://api.example.com/brands", {
            headers: {
              "Authorization": `Bearer ${process.env.EXTERNAL_API_TOKEN}`,
              "Content-Type": "application/json"
            }
          });
          if (!response.ok) {
            throw new Error(`Brand API responded with ${response.status}`);
          }
          const data = await response.json();
          return {
            count: data.length || 0,
            data,
            tokensUsed: 1,
            // Track token usage
            fetchTime: (/* @__PURE__ */ new Date()).toISOString()
          };
        } catch (error) {
          console.error("Error fetching brand data:", error);
          return {
            count: 0,
            data: [],
            tokensUsed: 0,
            error: error.message,
            fetchTime: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
      }
      /**
       * Fetch news data from external API
       */
      async fetchNewsData() {
        try {
          const response = await fetch("https://api.example.com/news", {
            headers: {
              "Authorization": `Bearer ${process.env.EXTERNAL_API_TOKEN}`,
              "Content-Type": "application/json"
            }
          });
          if (!response.ok) {
            throw new Error(`News API responded with ${response.status}`);
          }
          const data = await response.json();
          return {
            count: data.length || 0,
            data,
            tokensUsed: 1,
            // Track token usage
            fetchTime: (/* @__PURE__ */ new Date()).toISOString()
          };
        } catch (error) {
          console.error("Error fetching news data:", error);
          return {
            count: 0,
            data: [],
            tokensUsed: 0,
            error: error.message,
            fetchTime: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
      }
      /**
       * Check if we already fetched today for the given time slot
       */
      async alreadyFetchedToday(timeSlot) {
        const lastFetch = this.lastFetchTimes[timeSlot];
        if (!lastFetch) return false;
        const lastFetchDate = new Date(lastFetch);
        const today = /* @__PURE__ */ new Date();
        return lastFetchDate.getDate() === today.getDate() && lastFetchDate.getMonth() === today.getMonth() && lastFetchDate.getFullYear() === today.getFullYear();
      }
      /**
       * Cache the results
       */
      async cacheResults(results, timeSlot) {
        try {
          const cacheData = {
            [timeSlot]: results,
            lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
          };
          let existingCache = {};
          try {
            const cacheContent = await fs7.readFile(this.cacheFile, "utf8");
            existingCache = JSON.parse(cacheContent);
          } catch (error) {
          }
          const updatedCache = { ...existingCache, ...cacheData };
          await fs7.writeFile(this.cacheFile, JSON.stringify(updatedCache, null, 2));
          console.log(`\u{1F4BE} Results cached for ${timeSlot}`);
        } catch (error) {
          console.error("Error caching results:", error);
        }
      }
      /**
       * Get cached results
       */
      async getCachedResults(timeSlot = null) {
        try {
          const cacheContent = await fs7.readFile(this.cacheFile, "utf8");
          const cache4 = JSON.parse(cacheContent);
          if (timeSlot) {
            return cache4[timeSlot] || null;
          }
          return cache4;
        } catch (error) {
          console.error("Error reading cache:", error);
          return null;
        }
      }
      /**
       * Load fetch history
       */
      async loadFetchHistory() {
        try {
          const historyFile = path7.join(__dirname, "../cache/fetch-history.json");
          const historyContent = await fs7.readFile(historyFile, "utf8");
          this.lastFetchTimes = JSON.parse(historyContent);
        } catch (error) {
          this.lastFetchTimes = {
            afternoon: null,
            evening: null
          };
        }
      }
      /**
       * Save fetch history
       */
      async saveFetchHistory() {
        try {
          const historyFile = path7.join(__dirname, "../cache/fetch-history.json");
          await fs7.writeFile(historyFile, JSON.stringify(this.lastFetchTimes, null, 2));
        } catch (error) {
          console.error("Error saving fetch history:", error);
        }
      }
      /**
       * Ensure necessary directories exist
       */
      async ensureDirectories() {
        const dirs = [
          path7.dirname(this.cacheFile),
          path7.dirname(this.logFile)
        ];
        for (const dir of dirs) {
          try {
            await fs7.mkdir(dir, { recursive: true });
          } catch (error) {
          }
        }
      }
      /**
       * Log events
       */
      async logEvent(message) {
        try {
          const timestamp = (/* @__PURE__ */ new Date()).toISOString();
          const logEntry = `[${timestamp}] ${message}
`;
          await fs7.appendFile(this.logFile, logEntry);
        } catch (error) {
          console.error("Error writing to log file:", error);
        }
      }
      /**
       * Get scheduler status
       */
      getStatus() {
        return {
          isRunning: this.isRunning,
          lastFetchTimes: this.lastFetchTimes,
          nextScheduledTimes: [
            "13:00 IST (1:00 PM)",
            "20:00 IST (8:00 PM)"
          ]
        };
      }
      /**
       * Manual trigger for testing (use sparingly to save tokens)
       */
      async manualTrigger(timeSlot = "manual") {
        console.log("\u{1F527} Manual trigger initiated...");
        await this.executeFetch(timeSlot, "Manual Trigger");
      }
    };
    module.exports = ScheduledFetcher;
  }
});

// server/schedulerIntegration.js
var schedulerIntegration_exports = {};
var ScheduledFetcher2, SchedulerIntegration;
var init_schedulerIntegration = __esm({
  "server/schedulerIntegration.js"() {
    "use strict";
    ScheduledFetcher2 = (init_scheduledFetcher(), __toCommonJS(scheduledFetcher_exports));
    SchedulerIntegration = class {
      constructor(app2) {
        this.app = app2;
        this.scheduler = new ScheduledFetcher2();
      }
      /**
       * Initialize the scheduler and add API routes
       */
      async init() {
        try {
          await this.scheduler.init();
          this.addSchedulerRoutes();
          console.log("\u2705 Scheduler integration completed");
        } catch (error) {
          console.error("\u274C Error initializing scheduler:", error);
        }
      }
      /**
       * Add API routes for scheduler management
       */
      addSchedulerRoutes() {
        this.app.get("/api/scheduler/status", (req, res) => {
          try {
            const status = this.scheduler.getStatus();
            res.json({
              success: true,
              status,
              message: "Scheduler status retrieved successfully"
            });
          } catch (error) {
            res.status(500).json({
              success: false,
              error: error.message
            });
          }
        });
        this.app.get("/api/scheduler/cache/:timeSlot?", async (req, res) => {
          try {
            const { timeSlot } = req.params;
            const cachedData = await this.scheduler.getCachedResults(timeSlot);
            res.json({
              success: true,
              data: cachedData,
              message: "Cached data retrieved successfully"
            });
          } catch (error) {
            res.status(500).json({
              success: false,
              error: error.message
            });
          }
        });
        this.app.post("/api/scheduler/trigger", async (req, res) => {
          try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
              return res.status(401).json({
                success: false,
                error: "Authentication required"
              });
            }
            const { reason } = req.body;
            if (!reason) {
              return res.status(400).json({
                success: false,
                error: "Reason for manual trigger is required"
              });
            }
            console.log(`\u{1F527} Manual trigger requested. Reason: ${reason}`);
            await this.scheduler.manualTrigger("manual");
            res.json({
              success: true,
              message: "Manual fetch triggered successfully",
              warning: "Manual triggers consume API tokens. Use sparingly."
            });
          } catch (error) {
            res.status(500).json({
              success: false,
              error: error.message
            });
          }
        });
        this.app.get("/api/scheduler/logs", async (req, res) => {
          try {
            const fs9 = __require("fs").promises;
            const path9 = __require("path");
            const logFile = path9.join(__dirname, "../logs/scheduler.log");
            try {
              const logContent = await fs9.readFile(logFile, "utf8");
              const logs = logContent.split("\n").filter((line) => line.trim()).slice(-100).reverse();
              res.json({
                success: true,
                logs,
                count: logs.length
              });
            } catch (error) {
              res.json({
                success: true,
                logs: [],
                count: 0,
                message: "No logs found"
              });
            }
          } catch (error) {
            res.status(500).json({
              success: false,
              error: error.message
            });
          }
        });
        console.log("\u{1F4E1} Scheduler API routes added:");
        console.log("   GET  /api/scheduler/status");
        console.log("   GET  /api/scheduler/cache/:timeSlot?");
        console.log("   POST /api/scheduler/trigger");
        console.log("   GET  /api/scheduler/logs");
      }
    };
    module.exports = SchedulerIntegration;
  }
});

// server/index.ts
import express15 from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import path8 from "path";
import { fileURLToPath as fileURLToPath3 } from "url";
import fs8 from "fs";

// server/routes.ts
init_schemas();
init_schemas2();
import express9 from "express";

// server/auth.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
var AUTH_BYPASS = process.env.AUTH_BYPASS === "true";
if (AUTH_BYPASS && process.env.NODE_ENV === "production") {
  throw new Error("\u{1F6A8} SECURITY ERROR: AUTH_BYPASS cannot be enabled in production!");
}
var JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && !AUTH_BYPASS) {
  throw new Error("JWT_SECRET environment variable is required");
}
var JWT_EXPIRES_IN = "24h";
var REFRESH_TOKEN_EXPIRES_IN = "7d";
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}
async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}
function generateAccessToken(user) {
  if (!JWT_SECRET && AUTH_BYPASS) return "dev-access-token";
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}
function generateRefreshToken(userId) {
  if (!JWT_SECRET && AUTH_BYPASS) return "dev-refresh-token";
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN
  });
}
function verifyToken(token) {
  try {
    if (AUTH_BYPASS) {
      return {
        id: "dev-admin",
        email: "dev@local",
        name: "Developer",
        role: "super_admin"
      };
    }
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
function authenticateToken(req, res, next) {
  if (AUTH_BYPASS) {
    req.user = {
      id: "dev-admin",
      email: "dev@local",
      name: "Developer",
      role: "super_admin"
    };
    return next();
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1] || req.cookies?.token;
  if (!token) {
    return res.status(401).json({
      error: "Access denied. No token provided.",
      code: "NO_TOKEN"
    });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({
      error: "Invalid or expired token.",
      code: "INVALID_TOKEN"
    });
  }
  req.user = {
    id: decoded.id,
    email: decoded.email,
    name: decoded.name,
    role: decoded.role
  };
  next();
}
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function isStrongPassword(password) {
  const errors = [];
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain lowercase letters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain uppercase letters");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain numbers");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain special characters");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
function sanitizeUser(user) {
  const { password, ...sanitized } = user;
  return sanitized;
}

// server/middleware/rateLimiter.ts
init_redis_cache();
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
var redis2 = getCacheRedisClient();
function makeStore(prefix) {
  try {
    if (!redis2 || redis2.status !== "ready") return void 0;
    return new RedisStore({
      sendCommand: (...args) => redis2.call(...args),
      prefix
    });
  } catch (e) {
    return void 0;
  }
}
var apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 100,
  // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes"
  },
  standardHeaders: true,
  // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  // Disable the `X-RateLimit-*` headers
  store: makeStore("rl:api:"),
  // Skip rate limiting for certain IPs (e.g., internal services)
  skip: (req) => {
    if (process.env.NODE_ENV === "development" && req.ip === "127.0.0.1") {
      return true;
    }
    return false;
  }
});
var authLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 5,
  // Limit each IP to 5 login attempts per windowMs
  message: {
    error: "Too many login attempts from this IP, please try again after 15 minutes.",
    retryAfter: "15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore("rl:auth:"),
  skipSuccessfulRequests: true
  // Don't count successful logins
});
var modifyLimiter = rateLimit({
  windowMs: 60 * 1e3,
  // 1 minute
  max: 20,
  // Limit each IP to 20 POST/PUT/PATCH/DELETE requests per minute
  message: {
    error: "Too many modification requests, please slow down.",
    retryAfter: "1 minute"
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore("rl:modify:"),
  // Only apply to modification methods
  skip: (req) => {
    return !["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
  }
});
var publicLimiter = rateLimit({
  windowMs: 60 * 1e3,
  // 1 minute
  max: 60,
  // Limit each IP to 60 requests per minute
  message: {
    error: "Too many requests, please slow down.",
    retryAfter: "1 minute"
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore("rl:public:")
});
var bulkLimiter = rateLimit({
  windowMs: 60 * 60 * 1e3,
  // 1 hour
  max: 10,
  // Limit each IP to 10 bulk operations per hour
  message: {
    error: "Too many bulk operations, please try again later.",
    retryAfter: "1 hour"
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore("rl:bulk:")
});

// server/routes.ts
init_redis_cache();

// server/middleware/sanitize.ts
function sanitizeString(input) {
  if (typeof input !== "string") return input;
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/on\w+\s*=\s*["'][^"']*["']/gi, "").replace(/on\w+\s*=\s*[^\s>]*/gi, "").replace(/javascript:/gi, "").replace(/data:text\/html/gi, "").trim();
}
function sanitizeObject(obj) {
  if (obj === null || obj === void 0) {
    return obj;
  }
  if (typeof obj === "string") {
    return sanitizeString(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }
  if (typeof obj === "object") {
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  return obj;
}
function sanitizeInput(req, res, next) {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  next();
}
function validateFileUpload(req, res, next) {
  if (!req.file) {
    return next();
  }
  const file = req.file;
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return res.status(400).json({
      error: "File too large",
      maxSize: "10MB"
    });
  }
  const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];
  if (file.fieldname === "logo" || file.fieldname === "image") {
    if (!allowedImageTypes.includes(file.mimetype)) {
      return res.status(400).json({
        error: "Invalid file type",
        allowed: ["JPEG", "PNG", "WebP", "SVG"]
      });
    }
  }
  file.originalname = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
  next();
}
function validateMongoQuery(req, res, next) {
  const dangerousOperators = ["$where", "$regex", "$ne", "$gt", "$lt"];
  const checkForOperators = (obj) => {
    if (typeof obj === "string") {
      return dangerousOperators.some((op) => obj.includes(op));
    }
    if (Array.isArray(obj)) {
      return obj.some((item) => checkForOperators(item));
    }
    if (typeof obj === "object" && obj !== null) {
      for (const key in obj) {
        if (dangerousOperators.includes(key) || checkForOperators(obj[key])) {
          return true;
        }
      }
    }
    return false;
  };
  if (req.body && checkForOperators(req.body)) {
    return res.status(400).json({
      error: "Invalid input detected",
      code: "INVALID_QUERY"
    });
  }
  next();
}
function securityMiddleware(req, res, next) {
  sanitizeInput(req, res, () => {
    validateMongoQuery(req, res, next);
  });
}

// server/middleware/security.ts
import rateLimit2 from "express-rate-limit";
var ALLOWED_IPS = [
  "127.0.0.1",
  // Localhost IPv4
  "::1",
  // Localhost IPv6
  "27.107.129.231"
  // Your current IP
  // Add more trusted IPs below:
  // '203.0.113.5',      // Office IP
  // '198.51.100.10',    // Admin IP
];
var ipWhitelist = (req, res, next) => {
  const clientIp = req.ip || req.socket.remoteAddress;
  if (process.env.NODE_ENV === "development") {
    return next();
  }
  if (clientIp && ALLOWED_IPS.includes(clientIp)) {
    next();
  } else {
    console.warn(`\u{1F6AB} Blocked access to admin route from IP: ${clientIp}`);
    res.status(403).json({ message: "Access denied: IP not whitelisted" });
  }
};
var BAD_BOT_SIGNATURES = [
  "headless",
  "selenium",
  "puppeteer",
  "playwright",
  "curl",
  "wget",
  "python-requests",
  "scrapy",
  "bot",
  "crawler",
  "spider"
];
var GOOD_BOTS = [
  "googlebot",
  "bingbot",
  "duckduckbot",
  "slurp",
  // Yahoo
  "facebot",
  "twitterbot"
];
var botDetector = (req, res, next) => {
  const userAgent = req.get("User-Agent")?.toLowerCase() || "";
  const isBadBot = BAD_BOT_SIGNATURES.some((sig) => userAgent.includes(sig));
  const isGoodBot = GOOD_BOTS.some((sig) => userAgent.includes(sig));
  if (isBadBot && !isGoodBot) {
    console.warn(`\u{1F916} Blocked bot access: ${userAgent}`);
    return res.status(403).json({ message: "Access denied: Bot detected" });
  }
  next();
};
var ddosShield = rateLimit2({
  windowMs: 1 * 60 * 1e3,
  // 1 minute
  max: 10,
  // Limit each IP to 10 requests per minute
  message: {
    error: "DDoS protection activated. Too many requests.",
    retryAfter: "1 minute"
  },
  standardHeaders: true,
  legacyHeaders: false
});

// server/middleware/image-processor.ts
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
var ImageProcessor = class {
  static defaultOptions = {
    quality: 85,
    maxWidth: 1920,
    maxHeight: 1080,
    createThumbnail: true,
    thumbnailSize: 300,
    keepOriginal: false
  };
  /**
   * Process single uploaded image
   */
  static async processImage(filePath, options = {}) {
    const opts = { ...this.defaultOptions, ...options };
    try {
      const originalStats = await fs.stat(filePath);
      const originalSize = originalStats.size;
      const parsedPath = path.parse(filePath);
      const webpPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);
      const thumbnailPath = opts.createThumbnail ? path.join(parsedPath.dir, `${parsedPath.name}_thumb.webp`) : void 0;
      const image = sharp(filePath);
      const metadata = await image.metadata();
      console.log(`\u{1F5BC}\uFE0F Processing image: ${parsedPath.base}`);
      console.log(`\u{1F4CA} Original: ${metadata.width}x${metadata.height}, ${(originalSize / 1024).toFixed(1)}KB`);
      let processedImage = image;
      if (metadata.width && metadata.height) {
        if (metadata.width > opts.maxWidth || metadata.height > opts.maxHeight) {
          processedImage = processedImage.resize(opts.maxWidth, opts.maxHeight, {
            fit: "inside",
            withoutEnlargement: true
          });
        }
      }
      await processedImage.webp({
        quality: opts.quality,
        effort: 6
        // Higher effort for better compression
      }).toFile(webpPath);
      if (opts.createThumbnail && thumbnailPath) {
        await sharp(filePath).resize(opts.thumbnailSize, opts.thumbnailSize, {
          fit: "cover",
          position: "center"
        }).webp({ quality: opts.quality }).toFile(thumbnailPath);
      }
      const webpStats = await fs.stat(webpPath);
      const webpSize = webpStats.size;
      const compressionRatio = (originalSize - webpSize) / originalSize * 100;
      console.log(`\u2705 WebP created: ${(webpSize / 1024).toFixed(1)}KB (${compressionRatio.toFixed(1)}% smaller)`);
      if (!opts.keepOriginal) {
        await fs.unlink(filePath);
        console.log(`\u{1F5D1}\uFE0F Original file removed: ${parsedPath.base}`);
      }
      return {
        originalPath: filePath,
        webpPath,
        thumbnailPath,
        originalSize,
        webpSize,
        compressionRatio
      };
    } catch (error) {
      console.error(`\u274C Error processing image ${filePath}:`, error);
      throw new Error(`Image processing failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  /**
   * Process multiple images
   */
  static async processMultipleImages(filePaths, options = {}) {
    const results = [];
    for (const filePath of filePaths) {
      try {
        const result = await this.processImage(filePath, options);
        results.push(result);
      } catch (error) {
        console.error(`\u274C Failed to process ${filePath}:`, error);
      }
    }
    return results;
  }
  /**
   * Express middleware for automatic image processing
   */
  static middleware(options = {}) {
    return async (req, res, next) => {
      try {
        if (!req.files && !req.file) {
          return next();
        }
        const files = req.files || (req.file ? [req.file] : []);
        const processedImages = [];
        console.log(`\u{1F504} Processing ${files.length} uploaded image(s)...`);
        for (const file of files) {
          if (!file.mimetype.startsWith("image/")) {
            continue;
          }
          try {
            const result = await this.processImage(file.path, options);
            processedImages.push(result);
            file.path = result.webpPath;
            file.filename = path.basename(result.webpPath);
            file.mimetype = "image/webp";
            file.size = result.webpSize;
          } catch (error) {
            console.error(`\u274C Failed to process ${file.filename}:`, error);
          }
        }
        req.processedImages = processedImages;
        console.log(`\u2705 Successfully processed ${processedImages.length} image(s)`);
        next();
      } catch (error) {
        console.error("\u274C Image processing middleware error:", error);
        next();
      }
    };
  }
  /**
   * Get optimized image sizes for different use cases
   */
  static getImageSizes() {
    return {
      logo: { maxWidth: 200, maxHeight: 200, quality: 90 },
      hero: { maxWidth: 1920, maxHeight: 1080, quality: 85 },
      gallery: { maxWidth: 1200, maxHeight: 800, quality: 80 },
      thumbnail: { maxWidth: 300, maxHeight: 300, quality: 75 },
      feature: { maxWidth: 800, maxHeight: 600, quality: 80 }
    };
  }
  /**
   * Clean up old image files
   */
  static async cleanupOldImages(directory, maxAge = 7 * 24 * 60 * 60 * 1e3) {
    try {
      const files = await fs.readdir(directory);
      const now = Date.now();
      let cleanedCount = 0;
      for (const file of files) {
        const filePath = path.join(directory, file);
        const stats = await fs.stat(filePath);
        if (now - stats.mtime.getTime() > maxAge) {
          await fs.unlink(filePath);
          cleanedCount++;
        }
      }
      if (cleanedCount > 0) {
        console.log(`\u{1F9F9} Cleaned up ${cleanedCount} old image files`);
      }
    } catch (error) {
      console.error("\u274C Error cleaning up old images:", error);
    }
  }
};
var imageProcessingConfigs = {
  // Logo images - high quality, small size
  logo: ImageProcessor.middleware({
    quality: 90,
    maxWidth: 200,
    maxHeight: 200,
    createThumbnail: false,
    keepOriginal: false
  }),
  // Hero images - high quality, large size
  hero: ImageProcessor.middleware({
    quality: 85,
    maxWidth: 1920,
    maxHeight: 1080,
    createThumbnail: true,
    thumbnailSize: 400,
    keepOriginal: false
  }),
  // Gallery images - balanced quality and size
  gallery: ImageProcessor.middleware({
    quality: 80,
    maxWidth: 1200,
    maxHeight: 800,
    createThumbnail: true,
    thumbnailSize: 300,
    keepOriginal: false
  }),
  // Feature images - medium quality and size
  feature: ImageProcessor.middleware({
    quality: 80,
    maxWidth: 800,
    maxHeight: 600,
    createThumbnail: true,
    thumbnailSize: 200,
    keepOriginal: false
  }),
  // News images - optimized for web
  news: ImageProcessor.middleware({
    quality: 75,
    maxWidth: 1e3,
    maxHeight: 700,
    createThumbnail: true,
    thumbnailSize: 250,
    keepOriginal: false
  })
};

// server/routes.ts
import multer3 from "multer";
import path4 from "path";
import fs4 from "fs";
import { readFileSync as readFileSync2 } from "fs";
import { randomUUID as randomUUID4 } from "crypto";
import { S3Client as S3Client3, PutObjectCommand as PutObjectCommand3, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// server/routes/news.ts
import express from "express";

// server/db/news-storage.ts
init_schemas2();
import { v4 as uuidv4 } from "uuid";
var NewsStorage = class {
  async initialize() {
    try {
      const categoriesCount = await NewsCategory.countDocuments();
      if (categoriesCount === 0) {
        await this.createDefaultCategories();
      }
      console.log("\u2705 News storage initialized successfully (MongoDB)");
    } catch (error) {
      console.error("\u274C Error initializing news storage:", error);
    }
  }
  async createDefaultCategories() {
    const defaultCategories = [
      {
        id: uuidv4(),
        name: "News",
        slug: "news",
        description: "Latest automotive news and updates",
        isFeatured: true,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: uuidv4(),
        name: "Reviews",
        slug: "reviews",
        description: "Expert car reviews and road tests",
        isFeatured: true,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: uuidv4(),
        name: "Buying Guide",
        slug: "buying-guide",
        description: "Car buying guides and tips",
        isFeatured: true,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: uuidv4(),
        name: "Comparison",
        slug: "comparison",
        description: "Car comparisons and head-to-head reviews",
        isFeatured: false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
    await NewsCategory.insertMany(defaultCategories);
    console.log("\u2705 Created default news categories");
  }
  // ==================== ARTICLES ====================
  async getAllArticles() {
    const articles = await NewsArticle.find().lean();
    return articles.map(this.mapArticle);
  }
  async getArticleById(id) {
    const article = await NewsArticle.findOne({ id }).lean();
    return article ? this.mapArticle(article) : void 0;
  }
  async getArticleBySlug(slug) {
    const article = await NewsArticle.findOne({ slug }).lean();
    return article ? this.mapArticle(article) : void 0;
  }
  async createArticle(articleData) {
    const article = new NewsArticle({
      ...articleData,
      id: uuidv4(),
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    await article.save();
    return this.mapArticle(article.toObject());
  }
  async updateArticle(id, updates) {
    const article = await NewsArticle.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: /* @__PURE__ */ new Date() },
      { new: true }
    ).lean();
    return article ? this.mapArticle(article) : null;
  }
  async deleteArticle(id) {
    const result = await NewsArticle.deleteOne({ id });
    return result.deletedCount > 0;
  }
  async incrementArticleViews(id) {
    await NewsArticle.updateOne({ id }, { $inc: { views: 1 } });
  }
  // ==================== CATEGORIES ====================
  async getAllCategories() {
    const categories = await NewsCategory.find().lean();
    return categories.map(this.mapCategory);
  }
  async getCategoryById(id) {
    const category = await NewsCategory.findOne({ id }).lean();
    return category ? this.mapCategory(category) : void 0;
  }
  async createCategory(categoryData) {
    const category = new NewsCategory({
      ...categoryData,
      id: uuidv4(),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    await category.save();
    return this.mapCategory(category.toObject());
  }
  async updateCategory(id, updates) {
    const category = await NewsCategory.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: /* @__PURE__ */ new Date() },
      { new: true }
    ).lean();
    return category ? this.mapCategory(category) : null;
  }
  async deleteCategory(id) {
    const result = await NewsCategory.deleteOne({ id });
    return result.deletedCount > 0;
  }
  // ==================== TAGS ====================
  async getAllTags() {
    const tags = await NewsTag.find().lean();
    return tags.map(this.mapTag);
  }
  async getTagById(id) {
    const tag = await NewsTag.findOne({ id }).lean();
    return tag ? this.mapTag(tag) : void 0;
  }
  async createTag(tagData) {
    const tag = new NewsTag({
      ...tagData,
      id: uuidv4(),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    await tag.save();
    return this.mapTag(tag.toObject());
  }
  async updateTag(id, updates) {
    const tag = await NewsTag.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: /* @__PURE__ */ new Date() },
      { new: true }
    ).lean();
    return tag ? this.mapTag(tag) : null;
  }
  async deleteTag(id) {
    const result = await NewsTag.deleteOne({ id });
    return result.deletedCount > 0;
  }
  // ==================== AUTHORS ====================
  async getAllAuthors() {
    const authors = await NewsAuthor.find().lean();
    return authors.map(this.mapAuthor);
  }
  async getAuthorById(id) {
    const author = await NewsAuthor.findOne({ id }).lean();
    return author ? this.mapAuthor(author) : void 0;
  }
  async getAuthorByEmail(email) {
    const author = await NewsAuthor.findOne({ email }).lean();
    return author ? this.mapAuthor(author) : void 0;
  }
  async createAuthor(authorData) {
    const author = new NewsAuthor({
      ...authorData,
      id: uuidv4(),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    await author.save();
    return this.mapAuthor(author.toObject());
  }
  async updateAuthor(id, updates) {
    const author = await NewsAuthor.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: /* @__PURE__ */ new Date() },
      { new: true }
    ).lean();
    return author ? this.mapAuthor(author) : null;
  }
  async deleteAuthor(id) {
    const result = await NewsAuthor.deleteOne({ id });
    return result.deletedCount > 0;
  }
  // ==================== MEDIA ====================
  async getAllMedia() {
    const media = await NewsMedia.find().lean();
    return media.map(this.mapMedia);
  }
  async getMediaById(id) {
    const media = await NewsMedia.findOne({ id }).lean();
    return media ? this.mapMedia(media) : void 0;
  }
  async createMedia(mediaData) {
    const media = new NewsMedia({
      ...mediaData,
      id: uuidv4(),
      createdAt: /* @__PURE__ */ new Date()
    });
    await media.save();
    return this.mapMedia(media.toObject());
  }
  async deleteMedia(id) {
    const result = await NewsMedia.deleteOne({ id });
    return result.deletedCount > 0;
  }
  // ==================== ANALYTICS ====================
  async getAnalytics() {
    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      scheduledArticles,
      categories,
      authors,
      topArticles
    ] = await Promise.all([
      NewsArticle.countDocuments(),
      NewsArticle.countDocuments({ status: "published" }),
      NewsArticle.countDocuments({ status: "draft" }),
      NewsArticle.countDocuments({ status: "scheduled" }),
      NewsCategory.find().lean(),
      NewsAuthor.find().lean(),
      NewsArticle.find({ status: "published" }).sort({ views: -1 }).limit(5).select("id title views publishDate").lean()
    ]);
    const totalViews = await NewsArticle.aggregate([
      { $group: { _id: null, total: { $sum: "$views" } } }
    ]);
    const categoryStats = await Promise.all(
      categories.map(async (cat) => ({
        category: cat.name,
        count: await NewsArticle.countDocuments({ categoryId: cat.id })
      }))
    );
    const authorStats = await Promise.all(
      authors.map(async (author) => ({
        author: author.name,
        count: await NewsArticle.countDocuments({ authorId: author.id })
      }))
    );
    return {
      totalArticles,
      publishedArticles,
      draftArticles,
      scheduledArticles,
      totalViews: totalViews[0]?.total || 0,
      categoryStats,
      authorStats,
      topArticles: topArticles.map((a) => ({
        id: a.id,
        title: a.title,
        views: a.views,
        publishDate: a.publishDate
      }))
    };
  }
  // ==================== MAPPING FUNCTIONS ====================
  mapArticle(doc) {
    return {
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt,
      contentBlocks: doc.contentBlocks || [],
      categoryId: doc.categoryId,
      tags: doc.tags || [],
      authorId: doc.authorId,
      linkedCars: doc.linkedCars || [],
      featuredImage: doc.featuredImage,
      seoTitle: doc.seoTitle,
      seoDescription: doc.seoDescription,
      seoKeywords: doc.seoKeywords || [],
      status: doc.status,
      publishDate: doc.publishDate instanceof Date ? doc.publishDate.toISOString() : doc.publishDate,
      views: doc.views || 0,
      likes: doc.likes || 0,
      comments: doc.comments || 0,
      isFeatured: doc.isFeatured || false,
      isBreaking: doc.isBreaking || false,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt
    };
  }
  mapCategory(doc) {
    return {
      id: doc.id,
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      isFeatured: doc.isFeatured || false,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt
    };
  }
  mapTag(doc) {
    return {
      id: doc.id,
      name: doc.name,
      slug: doc.slug,
      type: doc.type,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt
    };
  }
  mapAuthor(doc) {
    return {
      id: doc.id,
      name: doc.name,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      bio: doc.bio || "",
      profileImage: doc.profileImage || "",
      socialLinks: doc.socialLinks || {},
      isActive: doc.isActive !== void 0 ? doc.isActive : true,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt
    };
  }
  mapMedia(doc) {
    return {
      id: doc.id,
      filename: doc.filename,
      originalName: doc.originalName,
      url: doc.url,
      type: doc.type,
      size: doc.size,
      uploaderId: doc.uploaderId,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt
    };
  }
};
var newsStorage = new NewsStorage();

// server/routes/news.ts
init_redis_cache();
var router = express.Router();
router.get("/", redisCacheMiddleware(CacheTTL.NEWS), async (req, res) => {
  try {
    res.set("Cache-Control", "public, max-age=600, s-maxage=600, stale-while-revalidate=1800");
    const { category, tag, search, page = "1", limit = "10" } = req.query;
    let articles = await newsStorage.getAllArticles();
    articles = articles.filter((a) => a.status === "published");
    if (category && typeof category === "string") {
      articles = articles.filter((a) => a.categoryId === category);
    }
    const debugInfo = {
      tagParam: tag,
      articlesCount: articles.length
    };
    if (tag && typeof tag === "string") {
      console.log(`\u{1F50D} Filtering by tag: ${tag}`);
      const allTags = await newsStorage.getAllTags();
      const tagObj = allTags.find((t) => t.name.toLowerCase() === tag.toLowerCase() || t.id === tag);
      debugInfo.allTagsCount = allTags.length;
      if (tagObj) {
        console.log(`\u2705 Found tag object: ${tagObj.name} (${tagObj.id})`);
        debugInfo.foundTag = { name: tagObj.name, id: tagObj.id };
        const initialCount = articles.length;
        articles = articles.filter((a) => a.tags.includes(tagObj.id));
        console.log(`\u{1F4CA} Filtered from ${initialCount} to ${articles.length} articles`);
        debugInfo.filteredCount = articles.length;
      } else {
        console.log(`\u274C Tag object not found for: ${tag}`);
        debugInfo.tagFound = false;
        articles = articles.filter((a) => a.tags.includes(tag));
      }
    }
    if (search && typeof search === "string") {
      const searchLower = search.toLowerCase();
      articles = articles.filter(
        (a) => a.title.toLowerCase().includes(searchLower) || a.excerpt.toLowerCase().includes(searchLower)
      );
    }
    articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedArticles = articles.slice(startIndex, endIndex);
    res.json({
      articles: paginatedArticles,
      total: articles.length,
      page: pageNum,
      totalPages: Math.ceil(articles.length / limitNum),
      debug: debugInfo
      // Return debug info
    });
  } catch (error) {
    console.error("Get articles error:", error);
    res.status(500).json({ error: "Failed to get articles" });
  }
});
router.get("/featured/list", async (req, res) => {
  try {
    const articles = await newsStorage.getAllArticles();
    const featuredArticles = articles.filter((a) => a.status === "published" && a.isFeatured).sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()).slice(0, 5);
    res.json(featuredArticles);
  } catch (error) {
    console.error("Get featured articles error:", error);
    res.status(500).json({ error: "Failed to get featured articles" });
  }
});
router.get("/trending/list", async (req, res) => {
  try {
    const articles = await newsStorage.getAllArticles();
    const trendingArticles = articles.filter((a) => a.status === "published").sort((a, b) => b.views - a.views).slice(0, 10);
    res.json(trendingArticles);
  } catch (error) {
    console.error("Get trending articles error:", error);
    res.status(500).json({ error: "Failed to get trending articles" });
  }
});
router.get("/categories/list", async (req, res) => {
  try {
    const categories = await newsStorage.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Failed to get categories" });
  }
});
router.get("/tags/list", async (req, res) => {
  try {
    const tags = await newsStorage.getAllTags();
    res.json(tags);
  } catch (error) {
    console.error("Get tags error:", error);
    res.status(500).json({ error: "Failed to get tags" });
  }
});
router.get("/:slug", async (req, res) => {
  try {
    const article = await newsStorage.getArticleBySlug(req.params.slug);
    if (!article || article.status !== "published") {
      return res.status(404).json({ error: "Article not found" });
    }
    await newsStorage.incrementArticleViews(article.id);
    res.json(article);
  } catch (error) {
    console.error("Get article error:", error);
    res.status(500).json({ error: "Failed to get article" });
  }
});
var news_default = router;

// server/routes/admin-auth.ts
import express2 from "express";
import bcrypt2 from "bcryptjs";

// server/middleware/auth.ts
import jwt2 from "jsonwebtoken";
var JWT_SECRET2 = process.env.JWT_SECRET || "your-secret-key-change-in-production";
var generateToken = (payload) => {
  return jwt2.sign(payload, JWT_SECRET2, { expiresIn: "7d" });
};
var verifyToken2 = (token) => {
  try {
    return jwt2.verify(token, JWT_SECRET2);
  } catch (error) {
    return null;
  }
};
var authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    const decoded = verifyToken2(token);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};
var adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// server/routes/admin-auth.ts
var router2 = express2.Router();
router2.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const author = await newsStorage.getAuthorByEmail(email);
    if (!author) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (!author.isActive) {
      return res.status(401).json({ error: "Account is inactive" });
    }
    const isPasswordValid = await bcrypt2.compare(password, author.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = generateToken({
      id: author.id,
      email: author.email,
      role: author.role
    });
    res.json({
      token,
      user: {
        id: author.id,
        name: author.name,
        email: author.email,
        role: author.role,
        profileImage: author.profileImage
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});
router2.get("/profile", authMiddleware, async (req, res) => {
  try {
    const author = await newsStorage.getAuthorById(req.user.id);
    if (!author) {
      return res.status(404).json({ error: "User not found" });
    }
    const { password, ...authorData } = author;
    res.json(authorData);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
});
router2.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, bio, profileImage, socialLinks } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (bio) updates.bio = bio;
    if (profileImage) updates.profileImage = profileImage;
    if (socialLinks) updates.socialLinks = socialLinks;
    const updatedAuthor = await newsStorage.updateAuthor(req.user.id, updates);
    if (!updatedAuthor) {
      return res.status(404).json({ error: "User not found" });
    }
    const { password, ...authorData } = updatedAuthor;
    res.json(authorData);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});
router2.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }
    const author = await newsStorage.getAuthorById(req.user.id);
    if (!author) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt2.compare(currentPassword, author.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }
    const hashedPassword = await bcrypt2.hash(newPassword, 10);
    await newsStorage.updateAuthor(req.user.id, { password: hashedPassword });
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
});
var admin_auth_default = router2;

// server/routes/admin-articles.ts
import express3 from "express";
var router3 = express3.Router();
function generateSlug(title) {
  return title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/(^-|-$)/g, "");
}
router3.get("/", async (req, res) => {
  try {
    const { category, status, search, page = "1", limit = "1000" } = req.query;
    let articles = await newsStorage.getAllArticles();
    if (category && typeof category === "string") {
      articles = articles.filter((a) => a.categoryId === category);
    }
    if (status && typeof status === "string") {
      articles = articles.filter((a) => a.status === status);
    }
    if (search && typeof search === "string") {
      const searchLower = search.toLowerCase();
      articles = articles.filter(
        (a) => a.title.toLowerCase().includes(searchLower) || a.excerpt.toLowerCase().includes(searchLower)
      );
    }
    articles.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedArticles = articles.slice(startIndex, endIndex);
    res.json({
      articles: paginatedArticles,
      total: articles.length,
      page: pageNum,
      totalPages: Math.ceil(articles.length / limitNum)
    });
  } catch (error) {
    console.error("Get articles error:", error);
    res.status(500).json({ error: "Failed to get articles" });
  }
});
router3.get("/:id", async (req, res) => {
  try {
    const article = await newsStorage.getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    console.error("Get article error:", error);
    res.status(500).json({ error: "Failed to get article" });
  }
});
router3.post("/", async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      contentBlocks = [],
      categoryId,
      tags = [],
      linkedCars = [],
      featuredImage,
      seoTitle,
      seoDescription,
      seoKeywords = [],
      status = "draft",
      publishDate,
      isFeatured = false,
      isBreaking = false
    } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const finalSlug = slug ? generateSlug(slug) : generateSlug(title);
    const existingArticle = await newsStorage.getArticleBySlug(finalSlug);
    if (existingArticle) {
      return res.status(400).json({ error: "Slug already exists" });
    }
    const article = await newsStorage.createArticle({
      title,
      slug: finalSlug,
      excerpt,
      contentBlocks,
      categoryId,
      tags,
      authorId: "admin",
      // Default author for now
      linkedCars,
      featuredImage: featuredImage || "",
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      seoKeywords,
      status,
      publishDate: publishDate || (/* @__PURE__ */ new Date()).toISOString(),
      isFeatured,
      isBreaking
    });
    res.status(201).json(article);
  } catch (error) {
    console.error("Create article error:", error);
    res.status(500).json({ error: "Failed to create article" });
  }
});
router3.put("/:id", async (req, res) => {
  try {
    const article = await newsStorage.getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    const updates = { ...req.body };
    delete updates.id;
    delete updates.createdAt;
    delete updates.views;
    delete updates.likes;
    delete updates.comments;
    if (updates.title) {
      updates.slug = generateSlug(updates.title);
    } else if (updates.slug) {
      updates.slug = generateSlug(updates.slug);
    }
    if (updates.slug && updates.slug !== article.slug) {
      const existingArticle = await newsStorage.getArticleBySlug(updates.slug);
      if (existingArticle) {
        return res.status(400).json({ error: "Slug already exists" });
      }
    }
    const updatedArticle = await newsStorage.updateArticle(req.params.id, updates);
    res.json(updatedArticle);
  } catch (error) {
    console.error("Update article error:", error);
    res.status(500).json({ error: "Failed to update article" });
  }
});
router3.delete("/:id", async (req, res) => {
  try {
    const article = await newsStorage.getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    await newsStorage.deleteArticle(req.params.id);
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Delete article error:", error);
    res.status(500).json({ error: "Failed to delete article" });
  }
});
router3.post("/bulk/update-status", async (req, res) => {
  try {
    const { articleIds, status } = req.body;
    if (!articleIds || !Array.isArray(articleIds) || !status) {
      return res.status(400).json({ error: "Article IDs and status are required" });
    }
    const results = await Promise.all(
      articleIds.map((id) => newsStorage.updateArticle(id, { status }))
    );
    res.json({
      message: `Updated ${results.filter((r) => r !== null).length} articles`,
      updated: results.filter((r) => r !== null).length
    });
  } catch (error) {
    console.error("Bulk update error:", error);
    res.status(500).json({ error: "Failed to bulk update articles" });
  }
});
router3.post("/bulk/delete", async (req, res) => {
  try {
    const { articleIds } = req.body;
    if (!articleIds || !Array.isArray(articleIds)) {
      return res.status(400).json({ error: "Article IDs are required" });
    }
    const results = await Promise.all(
      articleIds.map((id) => newsStorage.deleteArticle(id))
    );
    res.json({
      message: `Deleted ${results.filter((r) => r === true).length} articles`,
      deleted: results.filter((r) => r === true).length
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({ error: "Failed to bulk delete articles" });
  }
});
var admin_articles_default = router3;

// server/routes/admin-categories.ts
import express4 from "express";
var router4 = express4.Router();
router4.get("/", async (req, res) => {
  try {
    const categories = await newsStorage.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Failed to get categories" });
  }
});
router4.get("/:id", async (req, res) => {
  try {
    const category = await newsStorage.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({ error: "Failed to get category" });
  }
});
router4.post("/", async (req, res) => {
  try {
    const { name, slug, description, isFeatured = false } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const category = await newsStorage.createCategory({
      name,
      slug: finalSlug,
      description: description || "",
      isFeatured
    });
    res.status(201).json(category);
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});
router4.put("/:id", async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.id;
    delete updates.createdAt;
    const category = await newsStorage.updateCategory(req.params.id, updates);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
});
router4.delete("/:id", async (req, res) => {
  try {
    const deleted = await newsStorage.deleteCategory(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});
var admin_categories_default = router4;

// server/routes/admin-tags.ts
import express5 from "express";
var router5 = express5.Router();
router5.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    let tags = await newsStorage.getAllTags();
    if (type && typeof type === "string") {
      tags = tags.filter((t) => t.type === type);
    }
    res.json(tags);
  } catch (error) {
    console.error("Get tags error:", error);
    res.status(500).json({ error: "Failed to get tags" });
  }
});
router5.get("/:id", async (req, res) => {
  try {
    const tag = await newsStorage.getTagById(req.params.id);
    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }
    res.json(tag);
  } catch (error) {
    console.error("Get tag error:", error);
    res.status(500).json({ error: "Failed to get tag" });
  }
});
router5.post("/", async (req, res) => {
  try {
    const { name, slug, type = "general" } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const tag = await newsStorage.createTag({
      name,
      slug: finalSlug,
      type
    });
    res.status(201).json(tag);
  } catch (error) {
    console.error("Create tag error:", error);
    res.status(500).json({ error: "Failed to create tag" });
  }
});
router5.put("/:id", async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.id;
    delete updates.createdAt;
    const tag = await newsStorage.updateTag(req.params.id, updates);
    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }
    res.json(tag);
  } catch (error) {
    console.error("Update tag error:", error);
    res.status(500).json({ error: "Failed to update tag" });
  }
});
router5.delete("/:id", async (req, res) => {
  try {
    const deleted = await newsStorage.deleteTag(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Tag not found" });
    }
    res.json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Delete tag error:", error);
    res.status(500).json({ error: "Failed to delete tag" });
  }
});
var admin_tags_default = router5;

// server/routes/admin-authors.ts
import express6 from "express";
import bcrypt3 from "bcryptjs";
var router6 = express6.Router();
router6.use(authMiddleware);
router6.get("/", async (req, res) => {
  try {
    const { role, isActive } = req.query;
    let authors = await newsStorage.getAllAuthors();
    if (role && typeof role === "string") {
      authors = authors.filter((a) => a.role === role);
    }
    if (isActive !== void 0) {
      const activeFilter = isActive === "true";
      authors = authors.filter((a) => a.isActive === activeFilter);
    }
    const authorsWithoutPassword = authors.map(({ password, ...author }) => author);
    res.json(authorsWithoutPassword);
  } catch (error) {
    console.error("Get authors error:", error);
    res.status(500).json({ error: "Failed to get authors" });
  }
});
router6.get("/:id", async (req, res) => {
  try {
    const author = await newsStorage.getAuthorById(req.params.id);
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }
    const { password, ...authorData } = author;
    res.json(authorData);
  } catch (error) {
    console.error("Get author error:", error);
    res.status(500).json({ error: "Failed to get author" });
  }
});
router6.post("/", adminOnly, async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "author",
      bio = "",
      profileImage = "",
      socialLinks = {},
      isActive = true
    } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    const existingAuthor = await newsStorage.getAuthorByEmail(email);
    if (existingAuthor) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt3.hash(password, 10);
    const author = await newsStorage.createAuthor({
      name,
      email,
      password: hashedPassword,
      role,
      bio,
      profileImage,
      socialLinks,
      isActive
    });
    const { password: _, ...authorData } = author;
    res.status(201).json(authorData);
  } catch (error) {
    console.error("Create author error:", error);
    res.status(500).json({ error: "Failed to create author" });
  }
});
router6.put("/:id", adminOnly, async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.id;
    delete updates.createdAt;
    delete updates.password;
    const author = await newsStorage.updateAuthor(req.params.id, updates);
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }
    const { password, ...authorData } = author;
    res.json(authorData);
  } catch (error) {
    console.error("Update author error:", error);
    res.status(500).json({ error: "Failed to update author" });
  }
});
router6.post("/:id/reset-password", adminOnly, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const hashedPassword = await bcrypt3.hash(newPassword, 10);
    const author = await newsStorage.updateAuthor(req.params.id, { password: hashedPassword });
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});
router6.delete("/:id", adminOnly, async (req, res) => {
  try {
    const deleted = await newsStorage.deleteAuthor(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Author not found" });
    }
    res.json({ message: "Author deleted successfully" });
  } catch (error) {
    console.error("Delete author error:", error);
    res.status(500).json({ error: "Failed to delete author" });
  }
});
var admin_authors_default = router6;

// server/routes/admin-media.ts
import express7 from "express";
import multer from "multer";
import path2 from "path";
import { fileURLToPath } from "url";
import fs2 from "fs/promises";
import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
var __filename = fileURLToPath(import.meta.url);
var __dirname2 = path2.dirname(__filename);
var router7 = express7.Router();
var storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir3 = path2.join(process.cwd(), "uploads/news");
    await fs2.mkdir(uploadDir3, { recursive: true });
    cb(null, uploadDir3);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path2.extname(file.originalname));
  }
});
var upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi/;
    const extname = allowedTypes.test(path2.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only images and videos are allowed"));
    }
  }
});
router7.get("/", async (req, res) => {
  try {
    const { type, uploader } = req.query;
    let media = await newsStorage.getAllMedia();
    if (type && typeof type === "string") {
      media = media.filter((m) => m.type === type);
    }
    if (uploader && typeof uploader === "string") {
      media = media.filter((m) => m.uploaderId === uploader);
    }
    media.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(media);
  } catch (error) {
    console.error("Get media error:", error);
    res.status(500).json({ error: "Failed to get media" });
  }
});
router7.post("/upload", upload.single("file"), imageProcessingConfigs.news, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileType = req.file.mimetype.startsWith("image/") ? "image" : "video";
    let fileUrl = `/uploads/news/${req.file.filename}`;
    const bucket = process.env.R2_BUCKET;
    if (bucket) {
      try {
        const accountId2 = process.env.R2_ACCOUNT_ID;
        const endpoint = process.env.R2_ENDPOINT || (accountId2 ? `https://${accountId2}.r2.cloudflarestorage.com` : void 0);
        const client2 = new S3Client({
          region: process.env.R2_REGION || "auto",
          endpoint,
          credentials: process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY ? {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
          } : void 0,
          forcePathStyle: true
        });
        const now = /* @__PURE__ */ new Date();
        const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
        const key = `uploads/news/${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}/${randomUUID()}-${safeName.replace(/\.(jpg|jpeg|png)$/i, ".webp")}`;
        const body = await fs2.readFile(req.file.path);
        await client2.send(new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: req.file.mimetype || "application/octet-stream",
          CacheControl: "public, max-age=31536000, immutable"
        }));
        const publicBase = process.env.R2_PUBLIC_BASE_URL || (endpoint ? `${endpoint}/${bucket}` : "");
        if (publicBase) {
          fileUrl = `${publicBase}/${key}`;
        }
      } catch (e) {
        console.error("R2 upload failed, serving local URL:", e);
        fileUrl = `/uploads/news/${req.file.filename}`;
      }
    }
    const media = await newsStorage.createMedia({
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: fileUrl,
      type: fileType,
      size: req.file.size,
      uploaderId: "admin"
      // Default uploader since auth is removed
    });
    res.status(201).json({ ...media, url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});
router7.post("/upload-multiple", upload.array("files", 10), imageProcessingConfigs.news, async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const bucket = process.env.R2_BUCKET;
    const accountId2 = process.env.R2_ACCOUNT_ID;
    const endpoint = process.env.R2_ENDPOINT || (accountId2 ? `https://${accountId2}.r2.cloudflarestorage.com` : void 0);
    const client2 = bucket ? new S3Client({
      region: process.env.R2_REGION || "auto",
      endpoint,
      credentials: process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY ? {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
      } : void 0,
      forcePathStyle: true
    }) : null;
    const uploadedMedia = await Promise.all(
      req.files.map(async (file) => {
        const fileType = file.mimetype.startsWith("image/") ? "image" : "video";
        let fileUrl = `/uploads/news/${file.filename}`;
        if (bucket && client2) {
          try {
            const now = /* @__PURE__ */ new Date();
            const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
            const key = `uploads/news/${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}/${randomUUID()}-${safeName.replace(/\.(jpg|jpeg|png)$/i, ".webp")}`;
            const body = await fs2.readFile(file.path);
            await client2.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: file.mimetype || "application/octet-stream", CacheControl: "public, max-age=31536000, immutable" }));
            const publicBase = process.env.R2_PUBLIC_BASE_URL || (endpoint ? `${endpoint}/${bucket}` : "");
            if (publicBase) fileUrl = `${publicBase}/${key}`;
          } catch (e) {
            console.error("R2 upload failed (multiple), serving local URL:", e);
          }
        }
        return newsStorage.createMedia({
          filename: file.filename,
          originalName: file.originalname,
          url: fileUrl,
          type: fileType,
          size: file.size,
          uploaderId: "admin"
        });
      })
    );
    res.status(201).json(uploadedMedia);
  } catch (error) {
    console.error("Upload multiple error:", error);
    res.status(500).json({ error: "Failed to upload files" });
  }
});
router7.delete("/:id", async (req, res) => {
  try {
    const media = await newsStorage.getMediaById(req.params.id);
    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }
    const filePath = path2.join(process.cwd(), media.url.replace(/^\//, ""));
    try {
      await fs2.unlink(filePath);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
    await newsStorage.deleteMedia(req.params.id);
    res.json({ message: "Media deleted successfully" });
  } catch (error) {
    console.error("Delete media error:", error);
    res.status(500).json({ error: "Failed to delete media" });
  }
});
var admin_media_default = router7;

// server/routes/admin-analytics.ts
import express8 from "express";
var router8 = express8.Router();
router8.use(authMiddleware);
router8.get("/dashboard", async (req, res) => {
  try {
    const analytics = await newsStorage.getAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ error: "Failed to get analytics" });
  }
});
router8.get("/articles-by-month", async (req, res) => {
  try {
    const articles = await newsStorage.getAllArticles();
    const monthlyData = {};
    articles.forEach((article) => {
      const date = new Date(article.publishDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });
    const chartData = Object.entries(monthlyData).map(([month, count]) => ({ month, count })).sort((a, b) => a.month.localeCompare(b.month)).slice(-12);
    res.json(chartData);
  } catch (error) {
    console.error("Get articles by month error:", error);
    res.status(500).json({ error: "Failed to get articles by month" });
  }
});
router8.get("/top-articles", async (req, res) => {
  try {
    const { limit = "10" } = req.query;
    const articles = await newsStorage.getAllArticles();
    const topArticles = articles.filter((a) => a.status === "published").sort((a, b) => b.views - a.views).slice(0, parseInt(limit)).map((a) => ({
      id: a.id,
      title: a.title,
      views: a.views,
      likes: a.likes,
      comments: a.comments,
      publishDate: a.publishDate
    }));
    res.json(topArticles);
  } catch (error) {
    console.error("Get top articles error:", error);
    res.status(500).json({ error: "Failed to get top articles" });
  }
});
router8.get("/articles-by-category", async (req, res) => {
  try {
    const articles = await newsStorage.getAllArticles();
    const categories = await newsStorage.getAllCategories();
    const categoryData = categories.map((cat) => ({
      category: cat.name,
      count: articles.filter((a) => a.categoryId === cat.id).length,
      published: articles.filter((a) => a.categoryId === cat.id && a.status === "published").length
    }));
    res.json(categoryData);
  } catch (error) {
    console.error("Get articles by category error:", error);
    res.status(500).json({ error: "Failed to get articles by category" });
  }
});
router8.get("/author-performance", async (req, res) => {
  try {
    const articles = await newsStorage.getAllArticles();
    const authors = await newsStorage.getAllAuthors();
    const authorData = authors.map((author) => {
      const authorArticles = articles.filter((a) => a.authorId === author.id);
      const totalViews = authorArticles.reduce((sum, a) => sum + a.views, 0);
      const totalLikes = authorArticles.reduce((sum, a) => sum + a.likes, 0);
      return {
        author: author.name,
        totalArticles: authorArticles.length,
        publishedArticles: authorArticles.filter((a) => a.status === "published").length,
        totalViews,
        totalLikes,
        avgViews: authorArticles.length > 0 ? Math.round(totalViews / authorArticles.length) : 0
      };
    });
    authorData.sort((a, b) => b.totalArticles - a.totalArticles);
    res.json(authorData);
  } catch (error) {
    console.error("Get author performance error:", error);
    res.status(500).json({ error: "Failed to get author performance" });
  }
});
router8.get("/export", async (req, res) => {
  try {
    const { type = "articles" } = req.query;
    if (type === "articles") {
      const articles = await newsStorage.getAllArticles();
      const headers = ["ID", "Title", "Category", "Author", "Status", "Views", "Likes", "Comments", "Publish Date"];
      const rows = articles.map((a) => [
        a.id,
        a.title,
        a.categoryId,
        a.authorId,
        a.status,
        a.views,
        a.likes,
        a.comments,
        a.publishDate
      ]);
      const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=articles.csv");
      res.send(csv);
    } else {
      res.status(400).json({ error: "Invalid export type" });
    }
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ error: "Failed to export data" });
  }
});
var admin_analytics_default = router8;

// server/routes/ai-chat.ts
init_schemas2();
import Groq from "groq-sdk";

// server/ai-engine/web-scraper.ts
import axios2 from "axios";
import * as cheerio from "cheerio";

// server/ai-engine/ollama-client.ts
import axios from "axios";
var OLLAMA_BASE_URL = process.env.OLLAMA_URL || "http://localhost:11434";
var MODEL_NAME = "llama3.1:8b";
async function queryOllama(prompt, temperature = 0.3) {
  try {
    const response = await axios.post(
      `${OLLAMA_BASE_URL}/api/generate`,
      {
        model: MODEL_NAME,
        prompt,
        stream: false,
        options: {
          temperature,
          top_p: 0.9,
          top_k: 40
        }
      },
      {
        timeout: 3e4
        // 30 second timeout
      }
    );
    return response.data.response.trim();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNREFUSED") {
        throw new Error("Ollama server is not running. Please start it with: ollama serve");
      }
      throw new Error(`Ollama request failed: ${error.message}`);
    }
    throw error;
  }
}

// server/ai-engine/web-scraper.ts
async function scrapeReddit(carModel) {
  const reviews = [];
  try {
    const searchQuery = encodeURIComponent(`${carModel} review OR experience OR owner`);
    const url = `https://www.reddit.com/r/CarsIndia/search.json?q=${searchQuery}&restrict_sr=1&sort=relevance&limit=25`;
    const response = await axios2.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
      },
      timeout: 1e4
    });
    const posts = response.data.data.children;
    for (const post of posts) {
      const data = post.data;
      if (!data.selftext || data.selftext.length < 50) continue;
      const analysis = await analyzeReviewWithAI(data.selftext, carModel);
      reviews.push({
        source: "reddit",
        carModel,
        author: data.author,
        date: new Date(data.created_utc * 1e3),
        content: data.selftext,
        upvotes: data.ups,
        sentiment: analysis.sentiment,
        pros: analysis.pros,
        cons: analysis.cons,
        commonIssues: analysis.issues
      });
    }
    console.log(`\u2705 Scraped ${reviews.length} Reddit reviews for ${carModel}`);
    return reviews;
  } catch (error) {
    console.error("Reddit scraping error:", error);
    return [];
  }
}
async function scrapeTeamBHP(carModel) {
  const reviews = [];
  try {
    const searchQuery = encodeURIComponent(carModel);
    const url = `https://www.team-bhp.com/forum/search.php?searchid=${searchQuery}`;
    const response = await axios2.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
      },
      timeout: 1e4
    });
    const $ = cheerio.load(response.data);
    $(".threadtitle").each((i, elem) => {
      const title = $(elem).text().trim();
      const link = $(elem).attr("href");
      if (title.toLowerCase().includes("review") || title.toLowerCase().includes("ownership") || title.toLowerCase().includes("experience")) {
      }
    });
    console.log(`\u2705 Found ${reviews.length} Team-BHP reviews for ${carModel}`);
    return reviews;
  } catch (error) {
    console.error("Team-BHP scraping error:", error);
    return [];
  }
}
async function analyzeReviewWithAI(reviewText, carModel) {
  const prompt = `Analyze this car review for ${carModel}:

"${reviewText}"

Extract:
1. Sentiment: positive, negative, or neutral
2. Pros: list of positive points mentioned
3. Cons: list of negative points mentioned
4. Issues: any problems or issues mentioned

Return ONLY valid JSON:
{
  "sentiment": "positive" | "negative" | "neutral",
  "pros": ["pro1", "pro2"],
  "cons": ["con1", "con2"],
  "issues": ["issue1", "issue2"]
}

Focus on:
- Build quality
- Reliability
- Mileage/fuel efficiency
- Comfort
- Features
- Service experience
- Value for money`;
  try {
    const response = await queryOllama(prompt, 0.2);
    let jsonStr = response.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI analysis error:", error);
    return {
      sentiment: reviewText.toLowerCase().includes("good") || reviewText.toLowerCase().includes("great") ? "positive" : "neutral",
      pros: [],
      cons: [],
      issues: []
    };
  }
}
function aggregateReviews(reviews) {
  if (reviews.length === 0) {
    return {
      model: "",
      totalReviews: 0,
      averageSentiment: 0,
      topPros: [],
      topCons: [],
      commonIssues: [],
      ownerRecommendation: 0,
      lastUpdated: /* @__PURE__ */ new Date()
    };
  }
  const sentimentScores = reviews.map((r) => {
    if (r.sentiment === "positive") return 1;
    if (r.sentiment === "negative") return -1;
    return 0;
  });
  const avgSentiment = sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length;
  const prosCount = {};
  reviews.forEach((r) => {
    r.pros.forEach((pro) => {
      prosCount[pro] = (prosCount[pro] || 0) + 1;
    });
  });
  const topPros = Object.entries(prosCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([pro]) => pro);
  const consCount = {};
  reviews.forEach((r) => {
    r.cons.forEach((con) => {
      consCount[con] = (consCount[con] || 0) + 1;
    });
  });
  const topCons = Object.entries(consCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([con]) => con);
  const issuesCount = {};
  reviews.forEach((r) => {
    r.commonIssues.forEach((issue) => {
      issuesCount[issue] = (issuesCount[issue] || 0) + 1;
    });
  });
  const commonIssues = Object.entries(issuesCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([issue]) => issue);
  const ownerRecommendation = Math.round((avgSentiment + 1) / 2 * 100);
  return {
    model: reviews[0].carModel,
    totalReviews: reviews.length,
    averageSentiment: avgSentiment,
    topPros,
    topCons,
    commonIssues,
    ownerRecommendation,
    lastUpdated: /* @__PURE__ */ new Date()
  };
}
var cache = {};
var CACHE_DURATION = 24 * 60 * 60 * 1e3;
function getCachedIntelligence(carModel) {
  const cached = cache[carModel];
  if (!cached) return null;
  const age = Date.now() - cached.timestamp;
  if (age > CACHE_DURATION) {
    delete cache[carModel];
    return null;
  }
  return cached.data;
}
function setCachedIntelligence(carModel, data) {
  cache[carModel] = {
    data,
    timestamp: Date.now()
  };
}
async function getCarIntelligence(carModel) {
  const cached = getCachedIntelligence(carModel);
  if (cached) {
    console.log(`\u2705 Using cached intelligence for ${carModel}`);
    return cached;
  }
  console.log(`\u{1F577}\uFE0F Scraping web for ${carModel}...`);
  const [redditReviews, teamBHPReviews] = await Promise.all([
    scrapeReddit(carModel),
    scrapeTeamBHP(carModel)
  ]);
  const allReviews = [...redditReviews, ...teamBHPReviews];
  const intelligence = aggregateReviews(allReviews);
  setCachedIntelligence(carModel, intelligence);
  console.log(`\u2705 Intelligence gathered: ${intelligence.totalReviews} reviews, ${intelligence.ownerRecommendation}% recommendation`);
  return intelligence;
}

// server/ai-engine/expert-knowledge.ts
var HEAD_TO_HEAD = {
  // Compact SUV Wars
  "creta_seltos": {
    cars: ["Hyundai Creta", "Kia Seltos"],
    winner: { overall: "tie", resale: "creta", features: "seltos", safety: "tie", value: "tie" },
    insight: "Same platform, different personalities. Creta is the sensible elder sibling, Seltos is the flashy younger one.",
    forWhom: {
      car1: "Family-first buyers who value resale and service network",
      car2: "Tech enthusiasts who want the 'wow' factor"
    },
    proTip: "Creta's resale is \u20B91-2L higher after 5 years. That's a free vacation."
  },
  "nexon_brezza": {
    cars: ["Tata Nexon", "Maruti Brezza"],
    winner: { overall: "nexon", resale: "brezza", features: "nexon", safety: "nexon", value: "nexon" },
    insight: "Nexon destroyed the 'Maruti is safest' myth. 5-star NCAP changed the game.",
    forWhom: {
      car1: "Safety-conscious families willing to accept lower resale",
      car2: "Those who prioritize service network and resale over everything"
    },
    proTip: "Nexon EV has the best range in segment. Consider if you have home charging."
  },
  "seltos_nexon": {
    cars: ["Kia Seltos", "Tata Nexon"],
    winner: { overall: "seltos", resale: "seltos", features: "seltos", safety: "nexon", value: "nexon" },
    insight: "Seltos is premium but pricey. Nexon gives 80% of features at 70% price.",
    forWhom: {
      car1: "Those who can stretch budget for premium experience",
      car2: "Value-seekers who won't compromise on safety"
    },
    proTip: "Seltos HTX+ is the sweet spot variant. Nexon XZ+ is its competition."
  },
  "creta_xuv300": {
    cars: ["Hyundai Creta", "Mahindra XUV300"],
    winner: { overall: "creta", resale: "creta", features: "creta", safety: "xuv300", value: "xuv300" },
    insight: "XUV300 punches above its weight in safety but Creta owns the segment.",
    forWhom: {
      car1: "Those who want the segment leader with proven track record",
      car2: "Budget buyers who want SUV feel with top safety"
    },
    proTip: "XUV300 has better diesel than Creta. Consider if you drive 20K+ km/year."
  },
  // Premium SUV Battle
  "xuv700_safari": {
    cars: ["Mahindra XUV700", "Tata Safari"],
    winner: { overall: "xuv700", resale: "xuv700", features: "xuv700", safety: "tie", value: "xuv700" },
    insight: "XUV700 came and ate Safari's lunch. Same-ish price, more features, ADAS.",
    forWhom: {
      car1: "Tech lovers who want ADAS and panoramic sunroof",
      car2: "Those who prefer Safari's classic SUV stance and cabin feel"
    },
    proTip: "XUV700 AX5 with ADAS is the smart buy. Skip AX7 unless you need roof rails."
  },
  "xuv700_harrier": {
    cars: ["Mahindra XUV700", "Tata Harrier"],
    winner: { overall: "xuv700", resale: "tie", features: "xuv700", safety: "tie", value: "xuv700" },
    insight: "Harrier looks meaner but XUV700 is smarter. Literally, it has ADAS.",
    forWhom: {
      car1: "Those who want the 'best in class' bragging rights",
      car2: "Those who prefer Harrier's aggressive design language"
    },
    proTip: "Both have same engine. XUV700 diesel tuned for more power."
  },
  "fortuner_gloster": {
    cars: ["Toyota Fortuner", "MG Gloster"],
    winner: { overall: "fortuner", resale: "fortuner", features: "gloster", safety: "gloster", value: "gloster" },
    insight: "Gloster gives you Fortuner-level space at \u20B98L less. But Toyota resale is unbeatable.",
    forWhom: {
      car1: "Those buying for the badge and bullet-proof resale",
      car2: "Those who want more features for less money"
    },
    proTip: "Fortuner's resale after 5 years pays for a Swift. Think about that."
  },
  // Sedan Showdowns
  "city_verna": {
    cars: ["Honda City", "Hyundai Verna"],
    winner: { overall: "city", resale: "city", features: "verna", safety: "verna", value: "tie" },
    insight: "City is the Toyota of sedans - boring but brilliant. Verna is the looker.",
    forWhom: {
      car1: "Those who want refinement and long-term reliability",
      car2: "Those who want a head-turner with more features"
    },
    proTip: "City hybrid exists. 26 kmpl real-world. Best kept secret in the market."
  },
  "ciaz_verna": {
    cars: ["Maruti Ciaz", "Hyundai Verna"],
    winner: { overall: "verna", resale: "ciaz", features: "verna", safety: "verna", value: "ciaz" },
    insight: "Ciaz is for sensible dads. Verna is for those who want some flair.",
    forWhom: {
      car1: "Budget-conscious buyers who prioritize space and mileage",
      car2: "Those willing to pay more for looks and features"
    },
    proTip: "Ciaz CNG is the best taxi/daily driver combo. Commercial viability."
  },
  // Hatchback Battles
  "swift_altroz": {
    cars: ["Maruti Swift", "Tata Altroz"],
    winner: { overall: "swift", resale: "swift", features: "altroz", safety: "altroz", value: "tie" },
    insight: "Swift is the crowd favorite but Altroz is catching up with 5-star safety.",
    forWhom: {
      car1: "Those who want proven reliability and fun driving",
      car2: "Safety-first buyers who want premium hatch feel"
    },
    proTip: "Swift resale is almost like gold. Altroz safety is almost like a bigger car."
  },
  "i20_altroz": {
    cars: ["Hyundai i20", "Tata Altroz"],
    winner: { overall: "i20", resale: "i20", features: "i20", safety: "altroz", value: "altroz" },
    insight: "i20 is the feature king. Altroz is the safety king. Pick your priority.",
    forWhom: {
      car1: "Feature lovers who want premium hatchback experience",
      car2: "Those who prioritize safety over bells and whistles"
    },
    proTip: "i20 N-Line is hilariously fun. If you can stretch budget, try it."
  },
  "baleno_glanza": {
    cars: ["Maruti Baleno", "Toyota Glanza"],
    winner: { overall: "tie", resale: "baleno", features: "tie", safety: "tie", value: "glanza" },
    insight: "Same car, different badges. Glanza from Toyota dealer = better service.",
    forWhom: {
      car1: "Those who want Maruti service network",
      car2: "Those who prefer Toyota's ownership experience"
    },
    proTip: "Glanza gets Toyota's service reputation. Sometimes worth the \u20B910K extra."
  }
};
var OBJECTIONS = {
  "tata_service": {
    objection: "Tata service is bad",
    response: "This was true in 2018, but Tata has transformed. They now have 1200+ touchpoints and 98% parts availability. Customer satisfaction scores have improved 300% since 2020.",
    data: "1200+ service centers, 98% parts availability, 24/7 RSA",
    alternative: "If still worried, consider extended warranty. Costs \u20B915K for 5 years of peace of mind."
  },
  "tata_resale": {
    objection: "Tata resale is bad",
    response: "Nexon resale is now 60-65% after 3 years - almost matching Hyundai. The safety reputation is driving demand for used Tatas.",
    data: "Nexon: 60-65% after 3 years, Harrier: 58-62%",
    alternative: "Buy Nexon in popular color (white/red) for best resale."
  },
  "maruti_safety": {
    objection: "Maruti cars are unsafe",
    response: "Valid concern for older models. But Maruti is adding 6 airbags to ALL new models by 2024. New Brezza and Grand Vitara have ESP standard.",
    data: "6 airbags becoming standard, HEARTECT platform on new models",
    alternative: "Wait for 2025 Swift facelift with improved safety. Or consider Baleno which already has 6 airbags."
  },
  "kia_service": {
    objection: "Kia is new, service will be a problem",
    response: "Kia has expanded to 300+ service centers in 4 years. Plus their 7-year warranty is industry-best - you literally don't need to worry for 7 years.",
    data: "300+ service centers, 7-year warranty, 24/7 RSA",
    alternative: "Their customer satisfaction scores are actually higher than most established brands."
  },
  "xuv700_waiting": {
    objection: "XUV700 has 6 month waiting",
    response: "True for AX7 diesel automatic. But AX5 petrol has 2-3 week delivery. Javelin color across variants has shortest wait.",
    data: "AX5 Petrol: 2-3 weeks, AX7 Diesel AT: 6 months, Javelin color: fastest",
    alternative: "Consider AX5 with ADAS option pack. You get key features without the wait."
  },
  "diesel_vs_petrol": {
    objection: "Should I buy diesel or petrol?",
    response: "Simple rule: If you drive less than 15,000 km/year, petrol wins. Diesel needs highway runs to stay healthy. City-only diesel = expensive repairs.",
    data: "Break-even: 15K km/year, Diesel maintenance: 20% higher",
    alternative: "For city use, consider CNG or mild-hybrid petrol. Best of both worlds."
  },
  "automatic_reliability": {
    objection: "Automatic cars are unreliable",
    response: "That was true for old AMTs. Modern CVT and torque converters are bulletproof. Toyota Glanza CVT has near-zero complaints. Hyundai DCT is also refined now.",
    data: "CVT: Most reliable, Torque Converter: Proven, DCT: Improved since 2022",
    alternative: "Avoid AMT if budget allows. CVT or proper automatic worth the extra \u20B91L."
  },
  "sunroof_leak": {
    objection: "Sunroof will leak",
    response: "Modern sunroofs with proper drainage don't leak. Just clean the drainage channels once a year. I've seen more issues from people NOT using the sunroof than from using it.",
    data: "Leaks happen when drainage is blocked - maintenance issue, not design flaw",
    alternative: "If paranoid, skip sunroof. But you're missing out on Goa trip vibes."
  },
  "first_year_problems": {
    objection: "Never buy a car in its first year",
    response: "Partially valid. BUT modern cars are much better tested. XUV700 launched with minimal issues. Nexon facelift was flawless from day 1.",
    data: "First 6 months = most updates. After that, stable platform.",
    alternative: "Wait 3-6 months after launch if you can. Let early adopters find issues."
  },
  "ev_charging": {
    objection: "No charging infrastructure for EVs",
    response: "If you have home charging, you never need public chargers for daily use. 80% of EV owners charge at home. Range anxiety is mostly a myth.",
    data: "Average daily commute: 40km. EV range: 300km. You charge once a week at home.",
    alternative: "Tata/MG have best charging networks. Nexon EV MAX has 437km range."
  }
};
var PRO_TIPS = {
  "negotiation": [
    "Best time to buy: March (year-end targets) and September (festive discounts)",
    "Monday morning = Worst time. Weekend = Salespeople are desperate.",
    "Ask for 'dead stock' cars. 2-3 month old inventory gets heavy discounts.",
    "Never negotiate on price first. Get accessories free, then negotiate.",
    "Threaten to walk away. Works 80% of the time."
  ],
  "insurance": [
    "NEVER take dealer insurance. It's 20-30% more expensive.",
    "Zero depreciation add-on is MUST for first 3 years.",
    "Compare on Policybazaar. Same IDV, different prices.",
    "Don't over-insure. IDV should be realistic market value."
  ],
  "waiting_hacks": [
    "Less popular colors = shorter wait. Sometimes 2 weeks vs 2 months.",
    "Base/mid variants often have shorter waits than top variants.",
    "Ask dealer for 'cancelled bookings'. Instant delivery sometimes.",
    "Book at multiple dealers. Cancel the slower ones."
  ],
  "test_drive": [
    "Always test drive in traffic. Empty roads tell you nothing.",
    "Test the back seat. That's where your family will be.",
    "Check boot with shopping bags. Sales pics are deceptive.",
    "Listen for rattles at 60+ kmph. New cars shouldn't rattle.",
    "Test drive the specific variant you're buying, not the top model."
  ],
  "ownership_costs": [
    "Service cost varies 2x between brands. Maruti cheapest, Kia priciest.",
    "Tyres are expensive. Budget \u20B930-40K every 40,000 km.",
    "Extended warranty is worth it for Korean/Tata cars.",
    "Insurance drops ~15% each year. First year is painful."
  ],
  "resale_secrets": [
    "White/Silver cars resell 5-10% higher. Avoid unusual colors.",
    "Petrol > Diesel for resale in post-2020 cars (diesel bans)",
    "Manual > Automatic for resale (buyers fear auto repairs)",
    "Keep all service records. Missing records = \u20B950K off value.",
    "Low mileage < 10K/year actually hurts resale (cars need running)"
  ]
};
var REGIONAL_ADVICE = {
  "mumbai": {
    traffic: "Stop-and-go traffic 80% of the time",
    fuel: "Petrol + CNG is king. Diesel doesn't make sense for most.",
    recommendation: "Automatic/CVT mandatory. Compact preferred. CNG if available.",
    avoid: "Large SUVs unless you have a driver. Parking is a nightmare.",
    tip: "WagonR/Celerio CNG is the ultimate Mumbai car. Fight me."
  },
  "delhi": {
    traffic: "Mix of highway and city. Metro + car combo works best.",
    fuel: "Petrol preferred. BS6 diesel OK for now but uncertain future.",
    recommendation: "Good AC is critical. Air purifier feature is actually useful.",
    avoid: "Diesel if unsure about 10/15 year policy changes.",
    tip: "NCR has strict pollution norms. Keep emission papers ready."
  },
  "bangalore": {
    traffic: "Unpredictable. Can be 2 hours for 20km.",
    fuel: "Petrol for city. Diesel if doing Chennai/Mysore trips often.",
    recommendation: "Ground clearance 180mm+ (speed breakers everywhere). Good sound system (you'll be stuck in traffic).",
    avoid: "Low cars suffer. Avoid if < 170mm ground clearance.",
    tip: "ORR commute? Consider car + metro hybrid lifestyle."
  },
  "chennai": {
    traffic: "Better than Bangalore but waterlogging is real.",
    fuel: "Petrol + CNG growing. Diesel still popular for outstation.",
    recommendation: "Good ground clearance (flooding). Rust protection important (sea air).",
    avoid: "Low sedans during monsoon can be risky.",
    tip: "Get underbody anti-rust coating. Sea air corrodes fast."
  },
  "pune": {
    traffic: "City traffic bad. Outskirts and Mumbai highway = excellent.",
    fuel: "Petrol for city dwellers. Diesel for Mumbai commuters.",
    recommendation: "Balanced car works. Something that handles both city and highway.",
    avoid: "Pure city cars if doing Mumbai trips often.",
    tip: "Expressway + city driving = diesel often makes sense here."
  },
  "hyderabad": {
    traffic: "ORR is excellent. Old city is chaos.",
    fuel: "Petrol preferred. CNG network growing.",
    recommendation: "SUV preferred (road conditions vary). Automatic for old city.",
    avoid: "Low ground clearance in old city area.",
    tip: "If living in Gachibowli/Hitech City area, you'll barely face traffic."
  },
  "tier2_tier3": {
    traffic: "Generally manageable. Highways matter more.",
    fuel: "Diesel makes more sense (longer distances).",
    recommendation: "Maruti/Tata preferred (service network). Sturdy build for road conditions.",
    avoid: "Premium brands with limited service network.",
    tip: "Check nearest authorized service center before buying. Should be < 50km."
  }
};
var COMPETITORS = {
  "creta": ["seltos", "grand_vitara", "hyryder"],
  "seltos": ["creta", "grand_vitara", "hyryder"],
  "nexon": ["brezza", "venue", "sonet"],
  "brezza": ["nexon", "venue", "sonet"],
  "xuv700": ["safari", "harrier", "hector"],
  "safari": ["xuv700", "hector", "harrier"],
  "harrier": ["xuv700", "safari", "hector"],
  "swift": ["altroz", "i20", "baleno"],
  "altroz": ["swift", "i20", "baleno"],
  "i20": ["altroz", "swift", "baleno"],
  "city": ["verna", "ciaz", "virtus"],
  "verna": ["city", "ciaz", "slavia"],
  "fortuner": ["gloster", "endeavour"],
  "punch": ["magnite", "eiger", "fronx"],
  "magnite": ["punch", "fronx", "eiger"]
};
function getHeadToHead(car1, car2) {
  const key1 = `${car1.toLowerCase()}_${car2.toLowerCase()}`;
  const key2 = `${car2.toLowerCase()}_${car1.toLowerCase()}`;
  return HEAD_TO_HEAD[key1] || HEAD_TO_HEAD[key2] || null;
}
function getCompetitors(carName) {
  const normalized = carName.toLowerCase().replace(/\s+/g, "_");
  return COMPETITORS[normalized] || [];
}
function getRegionalAdvice(city) {
  const normalized = city.toLowerCase();
  return REGIONAL_ADVICE[normalized] || REGIONAL_ADVICE["tier2_tier3"];
}
function getRandomProTip(category) {
  if (category && PRO_TIPS[category]) {
    const tips2 = PRO_TIPS[category];
    return tips2[Math.floor(Math.random() * tips2.length)];
  }
  const categories = Object.keys(PRO_TIPS);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const tips = PRO_TIPS[randomCategory];
  return tips[Math.floor(Math.random() * tips.length)];
}

// server/ai-engine/fuzzy-match.ts
function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          // substitution
          matrix[i][j - 1] + 1,
          // insertion
          matrix[i - 1][j] + 1
          // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}
function findBestCarMatches(query, carNames, maxDistance = 2) {
  const queryWords = query.toLowerCase().split(/\s+/);
  const matches = [];
  for (const car of carNames) {
    const carLower = car.toLowerCase();
    if (query.toLowerCase().includes(carLower)) {
      matches.push({
        car,
        distance: 0,
        similarity: 1
      });
      continue;
    }
    for (const word of queryWords) {
      if (word.length < 3) continue;
      const distance = levenshtein(word, carLower);
      const threshold = Math.min(maxDistance, Math.floor(word.length / 3));
      if (distance <= threshold) {
        const similarity = 1 - distance / Math.max(word.length, carLower.length);
        matches.push({
          car,
          distance,
          similarity
        });
        break;
      }
    }
  }
  return matches.sort((a, b) => {
    if (a.distance !== b.distance) return a.distance - b.distance;
    return b.similarity - a.similarity;
  });
}
var CAR_ALIASES = {
  // Common typos
  "creat": "creta",
  "creata": "creta",
  "nexn": "nexon",
  "nexoon": "nexon",
  "selto": "seltos",
  "brezz": "brezza",
  "briza": "brezza",
  "swft": "swift",
  "balenoo": "baleno",
  // Informal names
  "xv700": "xuv700",
  "xv400": "xuv400",
  "fortunner": "fortuner",
  "inoova": "innova",
  // Brand shortcuts
  "tata": "tata",
  "maruti": "maruti",
  "suzuki": "maruti",
  "honda": "honda",
  "hyundai": "hyundai",
  "hundai": "hyundai",
  "hundayi": "hyundai",
  "mahindra": "mahindra",
  "mahendra": "mahindra",
  "kiya": "kia",
  // Model shortcuts
  "safari fa": "safari",
  "harrier ev": "harrier",
  "punch ev": "punch",
  "tiago ev": "tiago",
  "grand vitara": "grand vitara",
  "urban cruiser": "urban cruiser hyryder"
};

// server/ai-engine/vector-store.ts
var HF_API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2";
var EMBEDDING_DIMENSIONS = 384;
var vectorStore = [];
var isInitialized = false;
var lastInitTime = 0;
var CACHE_TTL = 36e5;
async function generateEmbedding(text) {
  const HF_API_KEY = process.env.HF_API_KEY;
  if (!HF_API_KEY) {
    console.warn("\u26A0\uFE0F HF_API_KEY not set, using fallback keyword matching");
    return generateFallbackEmbedding(text);
  }
  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: text.slice(0, 512),
        // Limit input size
        options: { wait_for_model: true }
      })
    });
    if (!response.ok) {
      const error = await response.text();
      console.error("HF API error:", error);
      return generateFallbackEmbedding(text);
    }
    const embedding = await response.json();
    if (Array.isArray(embedding) && Array.isArray(embedding[0])) {
      return embedding[0];
    }
    if (Array.isArray(embedding) && embedding.length === EMBEDDING_DIMENSIONS) {
      return embedding;
    }
    console.warn("Unexpected embedding format:", typeof embedding);
    return generateFallbackEmbedding(text);
  } catch (error) {
    console.error("Embedding generation failed:", error);
    return generateFallbackEmbedding(text);
  }
}
function generateFallbackEmbedding(text) {
  const words = text.toLowerCase().split(/\s+/);
  const embedding = new Array(EMBEDDING_DIMENSIONS).fill(0);
  words.forEach((word, i) => {
    const hash = simpleHash(word);
    const index = Math.abs(hash) % EMBEDDING_DIMENSIONS;
    embedding[index] += 1 / (i + 1);
  });
  const norm = Math.sqrt(embedding.reduce((s, v) => s + v * v, 0)) || 1;
  return embedding.map((v) => v / norm);
}
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}
function buildCarTextForEmbedding(model, brandName) {
  const parts = [
    brandName,
    model.name,
    model.bodyType,
    model.summary,
    model.pros,
    model.cons,
    model.description,
    model.fuelTypes?.join(" "),
    model.engineSummaries?.map((e) => `${e.title} ${e.summary}`).join(" "),
    model.mileageData?.map((m) => `${m.engineName} ${m.companyClaimed}`).join(" "),
    model.faqs?.slice(0, 5).map((f) => `${f.question} ${f.answer}`).join(" ")
  ].filter(Boolean);
  return parts.join(" ").slice(0, 512);
}
async function initializeVectorStore() {
  if (isInitialized && Date.now() - lastInitTime < CACHE_TTL) {
    console.log("\u{1F4CA} Vector store already initialized, using cache");
    return;
  }
  console.log("\u{1F504} Initializing vector store...");
  const startTime = Date.now();
  try {
    const { Model: Model3, Brand: Brand2 } = await Promise.resolve().then(() => (init_schemas2(), schemas_exports2));
    const models = await Model3.find({ status: "active" }).select("id name brandId bodyType summary pros cons description fuelTypes engineSummaries mileageData faqs minPrice maxPrice").lean();
    const brands = await Brand2.find({}).select("id name").lean();
    const brandMap = new Map(brands.map((b) => [b.id, b.name]));
    console.log(`\u{1F4CA} Processing ${models.length} car models...`);
    const batchSize = 5;
    const newVectorStore = [];
    for (let i = 0; i < models.length; i += batchSize) {
      const batch = models.slice(i, i + batchSize);
      const embeddings = await Promise.all(
        batch.map(async (model) => {
          const brandName = brandMap.get(model.brandId) || "";
          const text = buildCarTextForEmbedding(model, brandName);
          const embedding = await generateEmbedding(text);
          return {
            id: model.id || model._id?.toString(),
            name: model.name,
            brandName,
            embedding,
            data: { ...model, brandName }
          };
        })
      );
      newVectorStore.push(...embeddings);
      if (i + batchSize < models.length) {
        await new Promise((r) => setTimeout(r, 100));
      }
    }
    vectorStore = newVectorStore;
    isInitialized = true;
    lastInitTime = Date.now();
    const duration = Date.now() - startTime;
    console.log(`\u2705 Vector store initialized: ${vectorStore.length} cars in ${duration}ms`);
  } catch (error) {
    console.error("\u274C Failed to initialize vector store:", error);
    throw error;
  }
}
function cosineSimilarity(a, b) {
  if (a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}
async function semanticCarSearch(query, filters, limit = 5) {
  if (!isInitialized) {
    await initializeVectorStore();
  }
  const lowerQuery = query.toLowerCase();
  const isEVQuery = lowerQuery.includes("ev") || lowerQuery.includes("electric") || lowerQuery.includes("battery") || lowerQuery.includes("charging");
  const queryEmbedding = await generateEmbedding(query);
  const scored = vectorStore.map((entry) => {
    let score = cosineSimilarity(queryEmbedding, entry.embedding);
    const isEVModel = entry.name.toLowerCase().includes("ev") || entry.data.fuelTypes?.some((f) => f.toLowerCase() === "electric");
    if (!isEVQuery && isEVModel) {
      score = score * 0.7;
    } else if (isEVQuery && isEVModel) {
      score = score * 1.1;
    } else if (!isEVQuery && !isEVModel) {
      score = score * 1.05;
    }
    return {
      ...entry,
      score,
      isEV: isEVModel
    };
  });
  const minScore = filters?.minScore || 0.3;
  let filtered = scored.filter((entry) => entry.score >= minScore);
  if (filters?.budget) {
    filtered = filtered.filter(
      (entry) => entry.data.minPrice && entry.data.minPrice <= filters.budget
    );
  }
  if (filters?.bodyType) {
    const bodyTypeLower = filters.bodyType.toLowerCase();
    filtered = filtered.filter(
      (entry) => entry.data.bodyType?.toLowerCase().includes(bodyTypeLower)
    );
  }
  if (filters?.fuelType) {
    const fuelTypeLower = filters.fuelType.toLowerCase();
    filtered = filtered.filter(
      (entry) => entry.data.fuelTypes?.some((f) => f.toLowerCase().includes(fuelTypeLower))
    );
  }
  filtered.sort((a, b) => b.score - a.score);
  const results = filtered.slice(0, limit).map((entry) => ({
    ...entry.data,
    searchScore: entry.score,
    matchType: "semantic",
    isEV: entry.isEV
  }));
  console.log(`\u{1F50D} Semantic search: "${query.slice(0, 50)}..." \u2192 ${results.length} results (EV query: ${isEVQuery}, top score: ${results[0]?.searchScore?.toFixed(3) || "N/A"})`);
  return results;
}
var KNOWN_CAR_NAMES = [
  // Popular Models
  "swift",
  "creta",
  "nexon",
  "seltos",
  "venue",
  "brezza",
  "baleno",
  "i20",
  "i10",
  "sonet",
  "carens",
  "innova",
  "fortuner",
  "city",
  "elevate",
  "amaze",
  "thar",
  "scorpio",
  "xuv700",
  "xuv400",
  "xuv300",
  "bolero",
  "harrier",
  "safari",
  "punch",
  "tiago",
  "tigor",
  "altroz",
  "curvv",
  "fronx",
  "jimny",
  "invicto",
  "hycross",
  "grand vitara",
  "ertiga",
  "xl6",
  "dzire",
  "s-presso",
  "wagonr",
  "alto",
  "eeco",
  "verna",
  "exter",
  "aura",
  "alcazar",
  // Brand names
  "tata",
  "maruti",
  "hyundai",
  "kia",
  "mahindra",
  "honda",
  "toyota",
  "mg",
  "skoda",
  "volkswagen"
];
function extractCarNamesFromQuery(query) {
  const lowerQuery = query.toLowerCase();
  const extracted = [];
  for (const carName of KNOWN_CAR_NAMES) {
    if (lowerQuery.includes(carName)) {
      extracted.push(carName);
    }
  }
  for (const [alias, resolved] of Object.entries(CAR_ALIASES)) {
    if (lowerQuery.includes(alias) && !extracted.includes(resolved)) {
      extracted.push(resolved);
    }
  }
  if (extracted.length === 0) {
    const fuzzyMatches = findBestCarMatches(query, KNOWN_CAR_NAMES, 2);
    for (const match of fuzzyMatches) {
      if (match.similarity >= 0.7) {
        extracted.push(match.car);
      }
    }
  }
  return [...new Set(extracted)];
}
async function exactNameSearch(query, limit = 5) {
  const { Model: Model3, Brand: Brand2 } = await Promise.resolve().then(() => (init_schemas2(), schemas_exports2));
  const carNames = extractCarNamesFromQuery(query);
  if (carNames.length === 0) {
    return [];
  }
  console.log(`\u{1F3AF} Exact search: found car names [${carNames.join(", ")}] in query`);
  const namePatterns = carNames.map((name) => ({
    name: { $regex: new RegExp(`^${name}$|^${name}\\s|\\s${name}$|\\s${name}\\s`, "i") }
  }));
  const brandPatterns = carNames.map((name) => ({
    brandId: { $regex: name, $options: "i" }
  }));
  const results = await Model3.find({
    status: "active",
    $or: [...namePatterns]
  }).select("id name brandId bodyType summary pros cons minPrice maxPrice fuelTypes").limit(limit).lean();
  const brands = await Brand2.find({}).select("id name").lean();
  const brandMap = new Map(brands.map((b) => [b.id, b.name]));
  const scored = results.map((car) => {
    const carNameLower = car.name.toLowerCase();
    let score = 0.85;
    for (const searchName of carNames) {
      if (carNameLower === searchName) {
        score = 1;
        break;
      } else if (carNameLower.startsWith(searchName) || carNameLower.endsWith(searchName)) {
        score = 0.95;
      } else if (carNameLower.includes(searchName)) {
        score = Math.max(score, 0.9);
      }
    }
    const isEV = carNameLower.includes("ev") || car.fuelTypes?.some((f) => f.toLowerCase() === "electric");
    return {
      ...car,
      brandName: brandMap.get(car.brandId) || "",
      searchScore: score,
      matchType: "exact",
      isEV
    };
  });
  scored.sort((a, b) => b.searchScore - a.searchScore);
  console.log(`\u{1F3AF} Exact search: ${scored.length} matches found`);
  return scored.slice(0, limit);
}
async function hybridCarSearch(query, filters, limit = 5) {
  const lowerQuery = query.toLowerCase();
  const isEVQuery = lowerQuery.includes("ev") || lowerQuery.includes("electric") || lowerQuery.includes("battery") || lowerQuery.includes("charging");
  const exactResults = await exactNameSearch(query, limit);
  const hasExactMatches = exactResults.length > 0 && exactResults.some((r) => r.searchScore >= 0.9);
  const vectorResults = await semanticCarSearch(query, filters, limit);
  const { Model: Model3, Brand: Brand2 } = await Promise.resolve().then(() => (init_schemas2(), schemas_exports2));
  const keywords = lowerQuery.split(/\s+/).filter((w) => w.length > 2);
  const baseQuery = {
    status: "active",
    $or: keywords.flatMap((kw) => [
      { name: { $regex: kw, $options: "i" } },
      { summary: { $regex: kw, $options: "i" } },
      { pros: { $regex: kw, $options: "i" } }
    ])
  };
  if (!isEVQuery) {
    baseQuery.name = { $not: { $regex: "\\bEV\\b", $options: "i" } };
    baseQuery.fuelTypes = { $not: { $elemMatch: { $regex: "^electric$", $options: "i" } } };
  }
  const keywordResults = await Model3.find(baseQuery).select("id name brandId bodyType summary pros cons minPrice maxPrice fuelTypes").limit(5).lean();
  const brands = await Brand2.find({}).select("id name").lean();
  const brandMap = new Map(brands.map((b) => [b.id, b.name]));
  const enrichedKeyword = keywordResults.map((car) => {
    const isEVModel = car.name.toLowerCase().includes("ev") || car.fuelTypes?.some((f) => f.toLowerCase() === "electric");
    return {
      ...car,
      brandName: brandMap.get(car.brandId) || "",
      matchType: "keyword",
      searchScore: isEVModel && !isEVQuery ? 0.3 : 0.5,
      // Lower score for EV if not requested
      isEV: isEVModel
    };
  });
  const seen = /* @__PURE__ */ new Set();
  const merged = [];
  for (const car of exactResults) {
    const id = car.id || car._id?.toString();
    if (id && !seen.has(id) && (!car.isEV || isEVQuery)) {
      seen.add(id);
      merged.push(car);
    }
  }
  for (const car of vectorResults) {
    const id = car.id || car._id?.toString();
    if (id && !seen.has(id) && (!car.isEV || isEVQuery)) {
      seen.add(id);
      merged.push(car);
    }
  }
  if (merged.length < limit) {
    for (const car of vectorResults) {
      const id = car.id || car._id?.toString();
      if (id && !seen.has(id)) {
        seen.add(id);
        merged.push(car);
      }
    }
  }
  for (const car of enrichedKeyword.filter((c) => !c.isEV || isEVQuery)) {
    const id = car.id || car._id?.toString();
    if (id && !seen.has(id) && merged.length < limit + 2) {
      seen.add(id);
      merged.push(car);
    }
  }
  merged.sort((a, b) => {
    const matchPriority = { exact: 3, semantic: 2, keyword: 1 };
    const aPriority = matchPriority[a.matchType] || 0;
    const bPriority = matchPriority[b.matchType] || 0;
    if (aPriority !== bPriority) return bPriority - aPriority;
    if (!isEVQuery) {
      if (a.isEV && !b.isEV) return 1;
      if (!a.isEV && b.isEV) return -1;
    }
    return (b.searchScore || 0) - (a.searchScore || 0);
  });
  console.log(`\u{1F500} Hybrid search: ${exactResults.length} exact + ${vectorResults.length} semantic + ${enrichedKeyword.length} keyword \u2192 ${merged.length} merged (EV: ${isEVQuery})`);
  return merged.slice(0, limit);
}
function getVectorStoreStats() {
  return {
    initialized: isInitialized,
    totalVectors: vectorStore.length,
    lastInitTime: lastInitTime ? new Date(lastInitTime).toISOString() : null,
    cacheAge: lastInitTime ? Math.round((Date.now() - lastInitTime) / 1e3) : null
  };
}
async function refreshVectorStore() {
  isInitialized = false;
  lastInitTime = 0;
  vectorStore = [];
  await initializeVectorStore();
}

// server/ai-engine/self-learning.ts
import mongoose2 from "mongoose";
var interactionSchema = new mongoose2.Schema({
  sessionId: { type: String, required: true, index: true },
  query: { type: String, required: true },
  queryLower: { type: String, index: true },
  // For pattern matching
  queryType: {
    type: String,
    enum: ["comparison", "recommendation", "price", "features", "safety", "mileage", "general"],
    default: "general",
    index: true
  },
  response: { type: String, required: true },
  carsRecommended: [{
    modelId: String,
    modelName: String,
    brandName: String,
    clicked: { type: Boolean, default: false }
  }],
  feedback: {
    type: String,
    enum: ["thumbs_up", "thumbs_down", "none"],
    default: "none",
    index: true
  },
  feedbackText: String,
  responseTimeMs: Number,
  contextUsed: String,
  // What RAG context was provided
  createdAt: { type: Date, default: Date.now, index: true }
});
interactionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
var learnedPatternSchema = new mongoose2.Schema({
  patternKey: { type: String, required: true, unique: true },
  // Normalized query pattern
  queryType: {
    type: String,
    enum: ["comparison", "recommendation", "price", "features", "safety", "mileage", "general"],
    required: true
  },
  exampleQueries: [String],
  // Original queries that matched this pattern
  successfulContext: String,
  // Context that led to positive feedback
  keywords: [String],
  // Extracted keywords for matching
  successCount: { type: Number, default: 0 },
  failCount: { type: Number, default: 0 },
  successRate: { type: Number, default: 0.5 },
  lastUsed: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});
learnedPatternSchema.index({ queryType: 1, successRate: -1 });
learnedPatternSchema.index({ keywords: 1 });
var AIInteraction = mongoose2.models.AIInteraction || mongoose2.model("AIInteraction", interactionSchema);
var LearnedPattern = mongoose2.models.LearnedPattern || mongoose2.model("LearnedPattern", learnedPatternSchema);
function classifyQuery(query) {
  const lower = query.toLowerCase();
  if (lower.includes(" vs ") || lower.includes("compare") || lower.includes("versus") || lower.includes("better than") || lower.includes("difference between")) {
    return "comparison";
  }
  if (lower.includes("best") || lower.includes("recommend") || lower.includes("suggest") || lower.includes("which car") || lower.includes("should i buy") || lower.includes("good car")) {
    return "recommendation";
  }
  if (lower.includes("price") || lower.includes("cost") || lower.includes("lakh") || lower.includes("budget") || lower.includes("on-road") || lower.includes("emi")) {
    return "price";
  }
  if (lower.includes("safe") || lower.includes("ncap") || lower.includes("airbag") || lower.includes("crash") || lower.includes("adas")) {
    return "safety";
  }
  if (lower.includes("mileage") || lower.includes("fuel efficiency") || lower.includes("kmpl") || lower.includes("average") || lower.includes("economy")) {
    return "mileage";
  }
  if (lower.includes("feature") || lower.includes("sunroof") || lower.includes("touchscreen") || lower.includes("automatic") || lower.includes("ventilated") || lower.includes("cruise")) {
    return "features";
  }
  return "general";
}
function extractPatternKey(query) {
  let pattern = query.toLowerCase();
  const carPatterns = [
    "creta",
    "seltos",
    "nexon",
    "brezza",
    "venue",
    "sonet",
    "punch",
    "swift",
    "baleno",
    "i20",
    "altroz",
    "tiago",
    "glanza",
    "city",
    "verna",
    "ciaz",
    "amaze",
    "dzire",
    "xuv700",
    "xuv400",
    "hector",
    "harrier",
    "safari",
    "thar",
    "fortuner",
    "innova",
    "ertiga",
    "carens",
    "alcazar",
    "hyundai",
    "tata",
    "maruti",
    "mahindra",
    "kia",
    "honda",
    "toyota",
    "mg"
  ];
  for (const car of carPatterns) {
    pattern = pattern.replace(new RegExp(`\\b${car}\\b`, "gi"), "{CAR}");
  }
  pattern = pattern.replace(/₹?\s*\d+\.?\d*\s*(lakh|lakhs|l|k|cr)?/gi, "{PRICE}");
  pattern = pattern.replace(/\b\d+\b/g, "{NUM}");
  pattern = pattern.replace(/\s+/g, " ").trim();
  return pattern;
}
function extractKeywords(query) {
  const lower = query.toLowerCase();
  const keywords = [];
  const keywordMaps = {
    "family": ["family", "kids", "parents", "space", "comfort", "safe"],
    "budget": ["budget", "cheap", "affordable", "value", "money", "lakh"],
    "city": ["city", "traffic", "parking", "small", "compact", "daily"],
    "highway": ["highway", "road trip", "travel", "long drive", "touring"],
    "safety": ["safe", "safety", "ncap", "airbag", "adas", "crash"],
    "mileage": ["mileage", "fuel", "efficiency", "petrol", "diesel", "cng"],
    "features": ["features", "sunroof", "touchscreen", "automatic", "camera"],
    "suv": ["suv", "crossover", "ground clearance", "offroad"],
    "sedan": ["sedan", "saloon", "boot space"],
    "hatchback": ["hatchback", "hatch", "compact"]
  };
  for (const [category, words] of Object.entries(keywordMaps)) {
    if (words.some((word) => lower.includes(word))) {
      keywords.push(category);
    }
  }
  return keywords;
}
async function recordInteraction(sessionId, query, response, carsRecommended, contextUsed, responseTimeMs) {
  try {
    const interaction = await AIInteraction.create({
      sessionId,
      query,
      queryLower: query.toLowerCase(),
      queryType: classifyQuery(query),
      response,
      carsRecommended: carsRecommended.map((car) => ({
        ...car,
        clicked: false
      })),
      contextUsed,
      responseTimeMs
    });
    console.log(`\u{1F4DD} Recorded interaction: ${interaction._id}`);
    return interaction._id.toString();
  } catch (error) {
    console.error("Failed to record interaction:", error);
    return "";
  }
}
async function recordFeedback(sessionId, queryText, feedback, feedbackText) {
  try {
    const interaction = await AIInteraction.findOneAndUpdate(
      { sessionId, queryLower: queryText.toLowerCase() },
      {
        $set: {
          feedback,
          feedbackText
        }
      },
      { new: true, sort: { createdAt: -1 } }
    );
    if (!interaction) {
      console.warn(`\u26A0\uFE0F Interaction not found for feedback: ${queryText.slice(0, 50)}...`);
      return;
    }
    if (feedback === "thumbs_up") {
      await learnFromSuccess(interaction);
    } else {
      await learnFromFailure(interaction);
    }
    console.log(`\u{1F44D}/\u{1F44E} Feedback recorded: ${feedback} for "${queryText.slice(0, 30)}..."`);
  } catch (error) {
    console.error("Failed to record feedback:", error);
  }
}
async function recordCarClick(sessionId, modelId) {
  try {
    await AIInteraction.updateOne(
      { sessionId, "carsRecommended.modelId": modelId },
      {
        $set: {
          "carsRecommended.$.clicked": true
        }
      }
    );
    console.log(`\u{1F697} Car click recorded: ${modelId}`);
  } catch (error) {
    console.error("Failed to record car click:", error);
  }
}
async function learnFromSuccess(interaction) {
  try {
    const patternKey = extractPatternKey(interaction.query);
    const keywords = extractKeywords(interaction.query);
    await LearnedPattern.findOneAndUpdate(
      { patternKey },
      {
        $set: {
          queryType: interaction.queryType,
          successfulContext: interaction.contextUsed?.slice(0, 500),
          lastUsed: /* @__PURE__ */ new Date()
        },
        $addToSet: {
          exampleQueries: { $each: [interaction.query.slice(0, 200)] },
          keywords: { $each: keywords }
        },
        $inc: { successCount: 1 }
      },
      { upsert: true, new: true }
    ).then(async (pattern) => {
      const total = pattern.successCount + pattern.failCount;
      const successRate = total > 0 ? pattern.successCount / total : 0.5;
      await LearnedPattern.updateOne(
        { _id: pattern._id },
        { $set: { successRate } }
      );
    });
    console.log(`\u{1F4DA} Learned from success: "${patternKey.slice(0, 50)}..."`);
  } catch (error) {
    console.error("Failed to learn from success:", error);
  }
}
async function learnFromFailure(interaction) {
  try {
    const patternKey = extractPatternKey(interaction.query);
    await LearnedPattern.findOneAndUpdate(
      { patternKey },
      {
        $set: { lastUsed: /* @__PURE__ */ new Date() },
        $inc: { failCount: 1 }
      }
    ).then(async (pattern) => {
      if (pattern) {
        const total = pattern.successCount + pattern.failCount;
        const successRate = total > 0 ? pattern.successCount / total : 0.5;
        await LearnedPattern.updateOne(
          { _id: pattern._id },
          { $set: { successRate } }
        );
      }
    });
    console.log(`\u{1F4C9} Learned from failure: "${patternKey.slice(0, 50)}..."`);
  } catch (error) {
    console.error("Failed to learn from failure:", error);
  }
}
async function getLearnedContext(query) {
  try {
    const queryType = classifyQuery(query);
    const keywords = extractKeywords(query);
    const patternKey = extractPatternKey(query);
    const patterns = await LearnedPattern.find({
      $or: [
        { patternKey },
        { queryType, keywords: { $in: keywords } }
      ],
      successRate: { $gte: 0.6 }
    }).sort({ successRate: -1 }).limit(3).lean();
    if (patterns.length === 0) {
      return "";
    }
    let context = "\n\n**\u{1F4DA} Learned from past successful responses:**\n";
    for (const pattern of patterns) {
      if (pattern.successfulContext) {
        context += `- [${pattern.queryType}] ${pattern.successfulContext.slice(0, 150)}...
`;
      }
    }
    console.log(`\u{1F9E0} Found ${patterns.length} learned patterns for "${query.slice(0, 30)}..."`);
    return context;
  } catch (error) {
    console.error("Failed to get learned context:", error);
    return "";
  }
}
async function getLearningMetrics() {
  try {
    const now = /* @__PURE__ */ new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
    const totalInteractions = await AIInteraction.countDocuments();
    const totalWithFeedback = await AIInteraction.countDocuments({ feedback: { $ne: "none" } });
    const totalThumbsUp = await AIInteraction.countDocuments({ feedback: "thumbs_up" });
    const totalThumbsDown = await AIInteraction.countDocuments({ feedback: "thumbs_down" });
    const totalCarClicks = await AIInteraction.countDocuments({ "carsRecommended.clicked": true });
    const last24hInteractions = await AIInteraction.countDocuments({ createdAt: { $gte: oneDayAgo } });
    const last24hThumbsUp = await AIInteraction.countDocuments({ createdAt: { $gte: oneDayAgo }, feedback: "thumbs_up" });
    const last7dInteractions = await AIInteraction.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const totalPatterns = await LearnedPattern.countDocuments();
    const highSuccessPatterns = await LearnedPattern.countDocuments({ successRate: { $gte: 0.7 } });
    const topPatterns = await LearnedPattern.find().sort({ successRate: -1, successCount: -1 }).limit(10).select("patternKey queryType successRate successCount lastUsed").lean();
    const queryTypeStats = await AIInteraction.aggregate([
      { $group: { _id: "$queryType", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const satisfactionRate = totalWithFeedback > 0 ? (totalThumbsUp / totalWithFeedback * 100).toFixed(1) : "N/A";
    const avgResponseTime = await AIInteraction.aggregate([
      { $match: { responseTimeMs: { $exists: true } } },
      { $group: { _id: null, avg: { $avg: "$responseTimeMs" } } }
    ]);
    return {
      overview: {
        totalInteractions,
        last24hInteractions,
        last7dInteractions,
        satisfactionRate: `${satisfactionRate}%`,
        carClickRate: totalInteractions > 0 ? `${(totalCarClicks / totalInteractions * 100).toFixed(1)}%` : "N/A",
        avgResponseTimeMs: avgResponseTime[0]?.avg?.toFixed(0) || "N/A"
      },
      feedback: {
        totalWithFeedback,
        thumbsUp: totalThumbsUp,
        thumbsDown: totalThumbsDown,
        last24hThumbsUp
      },
      learning: {
        totalPatterns,
        highSuccessPatterns,
        topPatterns: topPatterns.map((p) => ({
          pattern: p.patternKey.slice(0, 50),
          type: p.queryType,
          successRate: `${(p.successRate * 100).toFixed(0)}%`,
          uses: p.successCount
        }))
      },
      queryTypes: queryTypeStats.map((q) => ({
        type: q._id,
        count: q.count
      })),
      lastUpdated: now.toISOString()
    };
  } catch (error) {
    console.error("Failed to get learning metrics:", error);
    return { error: "Failed to get metrics" };
  }
}
async function getRecentInteractions(limit = 20) {
  try {
    return await AIInteraction.find().sort({ createdAt: -1 }).limit(limit).select("query queryType feedback responseTimeMs createdAt carsRecommended").lean();
  } catch (error) {
    console.error("Failed to get recent interactions:", error);
    return [];
  }
}

// server/routes/ai-chat.ts
var groqApiKey = process.env.GROQ_API_KEY || process.env.HF_API_KEY || "";
var groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;
var cachedCarNames = null;
var cacheTimestamp = 0;
var CAR_NAMES_CACHE_TTL = 3e5;
async function getActiveCarNames() {
  if (cachedCarNames && Date.now() - cacheTimestamp < CAR_NAMES_CACHE_TTL) {
    return cachedCarNames;
  }
  try {
    const variants = await Variant.find({ status: "active" }).select("name brandId").lean();
    const names = /* @__PURE__ */ new Set();
    variants.forEach((v) => {
      const nameWords = v.name.toLowerCase().split(/\s+/);
      nameWords.forEach((word) => {
        if (word.length > 2) names.add(word);
      });
      if (v.brandId) {
        names.add(v.brandId.toLowerCase());
      }
    });
    cachedCarNames = Array.from(names);
    cacheTimestamp = Date.now();
    console.log(`\u{1F4CA} Cached ${cachedCarNames.length} car names from database`);
    return cachedCarNames;
  } catch (error) {
    console.error("Failed to fetch car names:", error);
    return [
      "creta",
      "seltos",
      "nexon",
      "punch",
      "brezza",
      "venue",
      "sonet",
      "swift",
      "baleno",
      "i20",
      "altroz",
      "tiago",
      "kwid",
      "city",
      "verna",
      "ciaz",
      "amaze",
      "dzire",
      "xuv700",
      "hector",
      "harrier",
      "safari",
      "compass",
      "fortuner",
      "innova",
      "ertiga",
      "xl6",
      "carens",
      "alcazar",
      "scorpio",
      "thar",
      "jimny",
      "grand vitara",
      "hyryder"
    ];
  }
}
async function extractCarNamesFromQuery2(query) {
  const lowerQuery = query.toLowerCase();
  const carKeywords = await getActiveCarNames();
  const found = [];
  carKeywords.forEach((car) => {
    if (lowerQuery.includes(car)) {
      found.push(car);
    }
  });
  return found;
}
async function aiChatHandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const startTime = Date.now();
  try {
    const { message, sessionId = "web-" + Date.now(), conversationHistory = [] } = req.body;
    console.log("\u{1F50D} User:", message);
    await initializeVectorStore().catch((err) => {
      console.warn("\u26A0\uFE0F Vector store init failed, using fallback:", err.message);
    });
    const messages = [
      {
        role: "system",
        content: `You are "Karan" - India's sharpest car consultant with 15+ years in the automotive industry.

## \u26A0\uFE0F CRITICAL RULES
1. **NEVER ASSUME** - Don't assume city, family, budget, or use case unless the user mentions it
2. **USE ONLY PROVIDED DATA** - Base your response on the car data provided below, not generic knowledge
3. **DIRECT ANSWERS** - If asked "Creta or Nexon?", compare THOSE cars directly, don't add context
4. **CITE DATA** - Reference actual prices, features, pros/cons from the database data provided

## \u{1F3AD} YOUR PERSONALITY
- **Witty & Relatable:** Light Indian humor, but keep it brief
- **Honest:** "I'll be real with you..." - don't sugarcoat
- **Data-Driven:** Always reference the actual specs/prices provided
- **Confident:** Take clear sides in comparisons

## \u{1F4CA} COMPARISON FORMAT (When comparing cars)

**[Car A] vs [Car B] - Quick Verdict**

| Factor | [Car A] | [Car B] | Winner |
|--------|---------|---------|--------|
| Price | \u20B9X-YL | \u20B9X-YL | Tie/A/B |
| Safety | X stars | Y stars | A/B |
| Mileage | X kmpl | Y kmpl | A/B |

**Key Differences:**
1. [Most important difference from database]
2. [Second difference]
3. [Third difference]

**My Pick:** [Clear winner] because [specific reason from data]

## \u{1F6AB} DON'T DO THIS
\u274C "Creta or Nexon for a city-dwelling family" (user didn't say family or city)
\u274C "Assuming you need 5 seats..." (don't assume)
\u274C Inventing features not in the provided data

## \u2705 DO THIS
\u2713 "Here's how Creta and Nexon compare based on specs:"
\u2713 Use actual prices from database (minPrice, maxPrice)
\u2713 Reference pros/cons from the data provided
\u2713 If info missing, say "I don't have that data" rather than guessing

## \u{1F3AF} KNOWN VERDICTS (Use these for quick answers)
- **Safety King:** Nexon (5\u2605 Global NCAP) > Creta (4\u2605)
- **Resale Value:** Creta > Nexon (Hyundai holds value better)
- **Features:** Creta (panoramic sunroof, ventilated seats) > Nexon
- **Build Quality:** Nexon (Tata's solid build) > Creta
- **Mileage:** Similar (17-18 kmpl real-world)
- **After-Sales:** Hyundai slightly better network than Tata`
      }
    ];
    conversationHistory.forEach((msg) => {
      messages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      });
    });
    let ragContext = "";
    let expertContext = "";
    const carNames = await extractCarNamesFromQuery2(message);
    const lowerMessage = message.toLowerCase();
    try {
      if (carNames.length >= 2 && carNames[0] && carNames[1]) {
        const comparison = getHeadToHead(carNames[0], carNames[1]);
        if (comparison) {
          expertContext += `

 **\u{1F9E0} EXPERT COMPARISON KNOWLEDGE:**
`;
          expertContext += `Insight: ${comparison.insight}
`;
          expertContext += `Winners: Overall = ${comparison.winner.overall}, Resale = ${comparison.winner.resale}, Features = ${comparison.winner.features}
`;
          expertContext += `${comparison.cars[0]} is for: ${comparison.forWhom.car1}
`;
          expertContext += `${comparison.cars[1]} is for: ${comparison.forWhom.car2}
`;
          expertContext += `Pro Tip: ${comparison.proTip}
`;
          console.log(`\u{1F9E0} Expert: Injected comparison knowledge for ${carNames[0]} vs ${carNames[1]} `);
        }
      }
    } catch (e) {
      console.error("Expert comparison injection error:", e);
    }
    try {
      const objectionTopics = ["service", "resale", "safety", "waiting", "diesel", "petrol", "automatic", "sunroof", "ev", "charging"];
      for (const topic of objectionTopics) {
        if (lowerMessage.includes(topic)) {
          const brandTopics = ["tata service", "tata resale", "maruti safety", "kia service", "xuv700 waiting", "diesel vs petrol"];
          for (const bt of brandTopics) {
            const parts = bt.split(" ");
            if (parts.length >= 2 && lowerMessage.includes(parts[0]) && lowerMessage.includes(parts[1])) {
              const objectionKey = bt.replace(" ", "_");
              if (OBJECTIONS && OBJECTIONS[objectionKey]) {
                const obj = OBJECTIONS[objectionKey];
                expertContext += `

 **\u{1F6E1}\uFE0F OBJECTION HANDLING:**
`;
                expertContext += `User concern: "${obj.objection}"
`;
                expertContext += `Expert response: ${obj.response}
`;
                expertContext += `Data: ${obj.data}
`;
                if (obj.alternative) expertContext += `Alternative: ${obj.alternative}
`;
                console.log(`\u{1F6E1}\uFE0F Expert: Injected objection handling for "${objectionKey}"`);
                break;
              }
            }
          }
        }
      }
    } catch (e) {
      console.error("Expert objection injection error:", e);
    }
    try {
      const cities = ["mumbai", "delhi", "bangalore", "chennai", "pune", "hyderabad"];
      for (const city of cities) {
        if (lowerMessage.includes(city)) {
          const advice = getRegionalAdvice(city);
          if (advice) {
            expertContext += `

 **\u{1F4CD} REGIONAL INTELLIGENCE(${city.toUpperCase()}):**
`;
            expertContext += `Traffic: ${advice.traffic || "N/A"}
`;
            expertContext += `Fuel recommendation: ${advice.fuel || "N/A"}
`;
            expertContext += `Best choice: ${advice.recommendation || "N/A"}
`;
            expertContext += `Avoid: ${advice.avoid || "N/A"}
`;
            expertContext += `Local tip: ${advice.tip || "N/A"}
`;
            console.log(`\u{1F4CD} Expert: Injected regional advice for ${city}`);
            break;
          }
        }
      }
    } catch (e) {
      console.error("Expert regional injection error:", e);
    }
    try {
      if (lowerMessage.includes("negotiat") || lowerMessage.includes("discount") || lowerMessage.includes("deal")) {
        const tip = getRandomProTip("negotiation");
        if (tip) expertContext += `

 **\u{1F4A1} PRO TIP(Negotiation):** ${tip}
`;
      }
      if (lowerMessage.includes("test drive") || lowerMessage.includes("showroom")) {
        const tip = getRandomProTip("test_drive");
        if (tip) expertContext += `

 **\u{1F4A1} PRO TIP(Test Drive):** ${tip}
`;
      }
      if (lowerMessage.includes("insurance")) {
        const tip = getRandomProTip("insurance");
        if (tip) expertContext += `

 **\u{1F4A1} PRO TIP(Insurance):** ${tip}
`;
      }
      if (lowerMessage.includes("waiting") || lowerMessage.includes("delivery")) {
        const tip = getRandomProTip("waiting_hacks");
        if (tip) expertContext += `

 **\u{1F4A1} PRO TIP(Waiting):** ${tip}
`;
      }
    } catch (e) {
      console.error("Expert pro tips injection error:", e);
    }
    try {
      if (carNames.length === 1 && carNames[0]) {
        const competitors = getCompetitors(carNames[0]);
        if (competitors && competitors.length > 0) {
          expertContext += `

 **\u{1F504} KEY COMPETITORS:** ${competitors.slice(0, 3).join(", ")}
`;
          console.log(`\u{1F504} Expert: Added competitors for ${carNames[0]}: ${competitors.slice(0, 3).join(", ")} `);
        }
      }
    } catch (e) {
      console.error("Expert competitor injection error:", e);
    }
    let vectorSearchResults = [];
    try {
      vectorSearchResults = await hybridCarSearch(message, {}, 5);
      if (vectorSearchResults.length > 0) {
        console.log(`\u{1F9E0} Vector search: Found ${vectorSearchResults.length} semantic matches`);
        ragContext = "\n\n**\u{1F50D} Cars Found (AI-Matched to Your Query):**\n";
        for (const car of vectorSearchResults) {
          const minPrice = car.minPrice ? (car.minPrice / 1e5).toFixed(2) : "N/A";
          const maxPrice = car.maxPrice ? (car.maxPrice / 1e5).toFixed(2) : "N/A";
          ragContext += `
 ** ${car.brandName || ""} ${car.name}** (Score: ${car.searchScore?.toFixed(2) || "N/A"}):
`;
          ragContext += `- Price: \u20B9${minPrice} L - \u20B9${maxPrice} L
`;
          if (car.bodyType) ragContext += `- Type: ${car.bodyType}
`;
          if (car.pros) ragContext += `- Pros: ${car.pros}
`;
          if (car.cons) ragContext += `- Cons: ${car.cons}
`;
          if (car.summary) ragContext += `- Summary: ${car.summary.slice(0, 150)}...
`;
        }
      }
    } catch (e) {
      console.error("Vector search error:", e);
    }
    if (vectorSearchResults.length === 0 && carNames.length > 0) {
      console.log(`\u{1F50D} RAG Fallback: Using keyword search for: ${carNames.join(", ")} `);
      try {
        const regexQueries = carNames.map((name) => ({
          name: { $regex: name, $options: "i" }
        }));
        const carData = await Variant.find({
          $or: regexQueries,
          status: "active"
        }).limit(10).lean();
        if (carData.length > 0) {
          console.log(`\u{1F4CA} Keyword RAG: Found ${carData.length} cars`);
          ragContext = "\n\n**Real-Time Database Data:**\n";
          carData.forEach((car) => {
            const price = car.price ? (car.price / 1e5).toFixed(2) : "N/A";
            ragContext += `
${car.brandId || "Unknown"} ${car.name}:
`;
            ragContext += `- Price: \u20B9${price} L
`;
            if (car.fuelType) ragContext += `- Fuel: ${car.fuelType}
`;
            if (car.transmission) ragContext += `- Transmission: ${car.transmission}
`;
            if (car.seatingCapacity) ragContext += `- Seating: ${car.seatingCapacity}
`;
            if (car.mileage) ragContext += `- Mileage: ${car.mileage} km / l
`;
            if (car.globalNCAPRating) ragContext += `- Safety: ${car.globalNCAPRating} stars
`;
          });
        }
      } catch (e) {
        console.error("RAG fetch error:", e);
      }
    }
    let learnedContext = "";
    try {
      learnedContext = await getLearnedContext(message);
      if (learnedContext) {
        console.log(`\u{1F4DA} Using learned context from past successes`);
      }
    } catch (e) {
      console.error("Learned context error:", e);
    }
    const fullContext = ragContext + expertContext + learnedContext;
    messages.push({
      role: "user",
      content: message + fullContext
    });
    if (!groq) {
      return res.status(503).json({
        error: "AI service unavailable",
        reply: "Sorry, the AI service is currently unavailable. Please try again later!"
      });
    }
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      max_tokens: 500,
      // Increased to handle larger contexts with expert knowledge
      temperature: 0.7
    });
    let aiResponse = completion.choices[0]?.message?.content || "How can I help you?";
    console.log("\u{1F916} AI Raw Response:", aiResponse);
    if (aiResponse.includes("FIND_CARS:")) {
      const match = aiResponse.match(/FIND_CARS:\s*({.*?})/);
      if (match) {
        try {
          const requirements = JSON.parse(match[1]);
          console.log("\u{1F697} AI wants to find cars:", requirements);
          const cars = await findMatchingCars(requirements);
          return res.json({
            reply: `Great! I found ${cars.length} cars that match your needs: `,
            cars,
            needsMoreInfo: false,
            conversationState: {
              stage: "showing_results",
              collectedInfo: requirements,
              confidence: 1
            }
          });
        } catch (e) {
          console.error("Failed to parse requirements:", e);
        }
      }
    }
    aiResponse = aiResponse.replace(/SEARCH:.*$/im, "").replace(/FIND_CARS:.*$/im, "").trim();
    const needsMoreInfo = aiResponse.includes("?") || aiResponse.toLowerCase().includes("budget") || aiResponse.toLowerCase().includes("seating") || aiResponse.toLowerCase().includes("how many");
    const responseTimeMs = Date.now() - startTime;
    const carsRecommended = vectorSearchResults.slice(0, 3).map((car) => ({
      modelId: car.id || car._id?.toString() || "",
      modelName: car.name || "",
      brandName: car.brandName || ""
    }));
    try {
      await recordInteraction(
        sessionId,
        message,
        aiResponse,
        carsRecommended,
        fullContext.slice(0, 500),
        responseTimeMs
      );
      console.log(`\u{1F4DD} Interaction recorded(${responseTimeMs}ms)`);
    } catch (e) {
      console.error("Failed to record interaction:", e);
    }
    res.json({
      reply: aiResponse,
      needsMoreInfo,
      cars: vectorSearchResults.slice(0, 3),
      // Return top matched cars
      sessionId,
      // Return for feedback tracking
      conversationState: {
        stage: needsMoreInfo ? "gathering_requirements" : "greeting",
        collectedInfo: {},
        confidence: 0
      }
    });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({
      error: "Failed to process request",
      reply: "Sorry, I'm having trouble right now. Please try again!"
    });
  }
}
async function findMatchingCars(requirements) {
  console.log("\u{1F9E0} AI Brain: Finding matching cars for requirements:", requirements);
  try {
    const query = { status: "active" };
    if (requirements.budget) {
      const maxBudget = typeof requirements.budget === "object" ? requirements.budget.max : requirements.budget;
      query.price = { $lte: maxBudget * 1.2 };
      console.log(`\u{1F4B0} Budget filter: \u2264 \u20B9${maxBudget * 1.2} `);
    }
    if (requirements.seating) {
      query.seatingCapacity = { $gte: requirements.seating };
      console.log(`\u{1F465} Seating filter: \u2265 ${requirements.seating} `);
    }
    if (requirements.fuelType && requirements.fuelType !== "any") {
      query.fuelType = { $regex: new RegExp(requirements.fuelType, "i") };
      console.log(`\u26FD Fuel filter: ${requirements.fuelType} `);
    }
    console.log("\u{1F50D} MongoDB Query:", JSON.stringify(query));
    let variants = await Variant.find(query).limit(20).lean();
    console.log(`\u{1F4CA} Found ${variants.length} variants from database`);
    if (variants.length === 0) {
      console.log("\u26A0\uFE0F No cars found in database matching criteria");
      return [];
    }
    if (requirements.usage) {
      const beforeFilter = variants.length;
      if (requirements.usage === "city") {
        const filtered = variants.filter((v) => {
          const isAutomatic = v.transmission && v.transmission.toLowerCase().includes("automatic");
          const mileage = parseFloat(v.mileageCompanyClaimed || v.mileageCityRealWorld || "0");
          const goodMileage = mileage > 15;
          return isAutomatic || goodMileage;
        });
        if (filtered.length > 0) {
          variants = filtered;
          console.log(`\u{1F3D9}\uFE0F City usage filter: ${variants.length} cars(automatic / good mileage)`);
        } else {
          console.log(`\u{1F3D9}\uFE0F City usage filter too strict(0 results), keeping all ${beforeFilter} cars`);
        }
      } else if (requirements.usage === "highway") {
        const filtered = variants.filter((v) => {
          const isDiesel = v.fuelType && v.fuelType.toLowerCase().includes("diesel");
          const mileage = parseFloat(v.mileageCompanyClaimed || v.mileageHighwayRealWorld || "0");
          const goodMileage = mileage > 18;
          return isDiesel || goodMileage;
        });
        if (filtered.length > 0) {
          variants = filtered;
          console.log(`\u{1F6E3}\uFE0F Highway usage filter: ${variants.length} cars(diesel / high mileage)`);
        } else {
          console.log(`\u{1F6E3}\uFE0F Highway usage filter too strict(0 results), keeping all ${beforeFilter} cars`);
        }
      }
    }
    if (requirements.budget) {
      const targetBudget = typeof requirements.budget === "object" ? requirements.budget.max : requirements.budget;
      variants.sort((a, b) => {
        const diffA = Math.abs(a.price - targetBudget);
        const diffB = Math.abs(b.price - targetBudget);
        return diffA - diffB;
      });
    }
    const top3 = variants.slice(0, 3);
    console.log(`\u{1F3AF} Selected top 3 cars: `, top3.map((v) => `${v.brandId} ${v.name} `));
    const enrichedCars = await Promise.all(
      top3.map(async (car) => {
        let intelligence = { imageUrl: "", ownerRecommendation: 0, totalReviews: 0, topPros: [], commonIssues: [], model: "", averageSentiment: 0, topCons: [], lastUpdated: /* @__PURE__ */ new Date() };
        try {
          intelligence = await getCarIntelligence(`${car.brandId} ${car.name} `);
          if (!intelligence.imageUrl) intelligence.imageUrl = "";
        } catch (e) {
          console.error(`Web intelligence failed for ${car.brandId} ${car.name}: `, e);
        }
        const reasons = [];
        if (requirements.budget) {
          const budgetLakhs = (typeof requirements.budget === "object" ? requirements.budget.max : requirements.budget) / 1e5;
          const priceLakhs = car.price / 1e5;
          reasons.push(`\u20B9${priceLakhs.toFixed(1)}L fits your \u20B9${budgetLakhs}L budget`);
        }
        const mileage = car.mileageCompanyClaimed || car.mileageCityRealWorld;
        if (mileage) {
          reasons.push(`${mileage} km / l mileage`);
        }
        if (requirements.usage === "city" && car.transmission) {
          reasons.push(`${car.transmission} for city driving`);
        }
        if (intelligence.ownerRecommendation > 0) {
          reasons.push(`${intelligence.ownerRecommendation}% owner recommendation`);
        }
        return {
          id: car._id.toString(),
          brand: car.brandId,
          // Use brandId from schema
          name: car.name,
          variant: car.name,
          // Variant name is in name field
          price: car.price,
          mileage: mileage || null,
          fuelType: car.fuelType || car.fuel || null,
          transmission: car.transmission || null,
          seatingCapacity: null,
          // Not in variant schema
          image: intelligence.imageUrl || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400",
          matchScore: 85 + Math.floor(Math.random() * 15),
          // 85-100
          reasons: reasons.slice(0, 3),
          // Top 3 reasons
          webIntelligence: intelligence
        };
      })
    );
    return enrichedCars;
  } catch (error) {
    console.error("\u274C AI Car Selection Error:", error);
    return [];
  }
}

// server/routes/quirky-bit.ts
init_schemas2();
import { Router } from "express";
import Groq2 from "groq-sdk";
import axios3 from "axios";
import * as cheerio2 from "cheerio";
var router9 = Router();
var groqApiKey2 = process.env.GROQ_API_KEY || process.env.HF_API_KEY || "";
var groq2 = groqApiKey2 ? new Groq2({ apiKey: groqApiKey2 }) : null;
var cache2 = /* @__PURE__ */ new Map();
var CACHE_TTL2 = 36e5;
var QUIRKY_THEMES = [
  { theme: "SAFETY", angle: "safety rating, crash protection, family security" },
  { theme: "MILEAGE", angle: "fuel efficiency, petrol savings, long drives" },
  { theme: "TECH", angle: "features, infotainment, connected tech, ADAS" },
  { theme: "VALUE", angle: "price vs competition, resale value, EMI" },
  { theme: "INDIAN_LIFE", angle: "Diwali trips, traffic jams, potholes, monsoon" },
  { theme: "STYLE", angle: "looks, road presence, Instagram-worthy, alloys" },
  { theme: "FAMILY", angle: "boot space, rear seat comfort, AC cooling" },
  { theme: "COMPARISON", angle: "vs competitors, why this over rivals" },
  { theme: "OWNERSHIP", angle: "service cost, spare parts, insurance" },
  { theme: "POWER", angle: "acceleration, turbo, driving pleasure" },
  { theme: "BRAND", angle: "brand reputation, heritage, trust" },
  { theme: "TRENDING", angle: "latest updates, new launch, waiting period" }
];
function getCurrentTheme() {
  const hour = (/* @__PURE__ */ new Date()).getHours();
  const theme = QUIRKY_THEMES[hour % QUIRKY_THEMES.length];
  return `Focus on: ${theme.theme} - ${theme.angle}`;
}
async function fetchRealTimeNews(query) {
  try {
    const searchUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query + " car india news")}&hl=en-IN&gl=IN&ceid=IN:en`;
    const { data } = await axios3.get(searchUrl, { timeout: 3e3 });
    const $ = cheerio2.load(data, { xmlMode: true });
    const queryWords = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    const newsItems = [];
    $("item").each((_, elem) => {
      if (newsItems.length >= 2) return false;
      const title = $(elem).find("title").text();
      const titleLower = title.toLowerCase();
      const pubDate = $(elem).find("pubDate").text();
      const isRelevant = queryWords.some((word) => titleLower.includes(word));
      if (isRelevant) {
        const cleanTitle = title.split(" - ").slice(0, -1).join(" - ") || title;
        newsItems.push(`- ${cleanTitle} (${new Date(pubDate).toLocaleDateString()})`);
      }
    });
    if (newsItems.length === 0) {
      console.log(`\u26A0\uFE0F No relevant news found for: ${query}`);
    } else {
      console.log(`\u2705 Found ${newsItems.length} relevant news for: ${query}`);
    }
    return newsItems.join("\n");
  } catch (error) {
    console.error("\u26A0\uFE0F News fetch failed:", error instanceof Error ? error.message : error);
    return "";
  }
}
router9.get("/:type/:id", async (req, res) => {
  const { type, id } = req.params;
  if (!["brand", "model", "variant", "price", "comparison"].includes(type)) {
    return res.status(400).json({ error: "Invalid type. Must be brand, model, variant, price, or comparison" });
  }
  const currentHour = (/* @__PURE__ */ new Date()).getHours();
  const cacheKey = `${type}-${id}-hour${currentHour}`;
  const cached = cache2.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL2) {
    console.log(`\u2705 Cache hit for ${cacheKey}`);
    return res.json(cached.data);
  }
  try {
    let context = "";
    let entityName = "";
    let dataSummary = "";
    if (type === "brand") {
      let brand;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        brand = await Brand.findById(id);
      } else {
        const searchName = id.replace(/^brand-/, "").replace(/-/g, " ");
        brand = await Brand.findOne({
          name: { $regex: new RegExp(searchName, "i") }
        });
      }
      if (!brand) {
        console.warn(`\u26A0\uFE0F Brand not found for ID: ${id}, using fallback`);
        context = `Brand: ${id.replace(/^brand-/, "").replace(/-/g, " ")}`;
        entityName = id.replace(/^brand-/, "").replace(/-/g, " ");
      } else {
        context = `Brand: ${brand.name}`;
        entityName = brand.name;
        dataSummary = `
                Name: ${brand.name}
                Market Ranking: ${brand.ranking || "N/A"}
                Summary: ${brand.summary || "N/A"}
                `;
      }
    } else if (type === "model") {
      let model;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        model = await Model.findById(id);
      }
      if (!model) {
        const searchName = id.replace(/-/g, " ");
        model = await Model.findOne({ name: { $regex: new RegExp(searchName, "i") } });
      }
      if (!model) {
        console.warn(`\u26A0\uFE0F Model not found for ID: ${id}, using fallback`);
        context = `${id.replace(/-/g, " ")}`;
        entityName = id.replace(/-/g, " ");
      } else {
        const brand = await Brand.findOne({ id: model.brandId });
        const brandName = brand ? brand.name : "Unknown Brand";
        context = `${brandName} ${model.name}`;
        entityName = model.name;
        const mileage = model.mileageData?.[0];
        const engine = model.engineSummaries?.[0];
        dataSummary = `
                Car: ${brandName} ${model.name}
                Body Type: ${model.bodyType || "N/A"}
                Launch Date: ${model.launchDate || "N/A"}
                Pros: ${model.pros || "N/A"}
                Cons: ${model.cons || "N/A"}
                Mileage: ${mileage ? `Claimed: ${mileage.companyClaimed}, City: ${mileage.cityRealWorld}` : "N/A"}
                Engine: ${engine ? `${engine.power} Power, ${engine.torque} Torque` : "N/A"}
                Seating: ${model.seating}
                Fuel Types: ${model.fuelTypes?.join(", ") || "N/A"}
                `;
      }
    } else if (type === "variant") {
      let variant;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        variant = await Variant.findById(id);
      }
      if (!variant) {
        const searchName = id.replace(/-/g, " ");
        variant = await Variant.findOne({ name: { $regex: new RegExp(searchName, "i") } });
      }
      if (!variant) {
        console.warn(`\u26A0\uFE0F Variant not found for ID: ${id}, using fallback`);
        context = `${id.replace(/-/g, " ")}`;
        entityName = id.replace(/-/g, " ");
      } else {
        const model = await Model.findOne({ id: variant.modelId });
        const brand = await Brand.findOne({ id: variant.brandId });
        const brandName = brand ? brand.name : "";
        const modelName = model ? model.name : "";
        context = `${brandName} ${modelName} ${variant.name}`;
        entityName = variant.name;
        dataSummary = `
                Variant: ${brandName} ${modelName} ${variant.name}
                Price: \u20B9${variant.price ? (variant.price / 1e5).toFixed(2) + " Lakh" : "N/A"}
                Key Features: ${variant.keyFeatures || "N/A"}
                Value for Money: ${variant.isValueForMoney ? "Yes" : "No"}
                Engine: ${variant.engineName || "N/A"} - ${variant.power || "N/A"} Power
                Mileage: ${variant.mileageCompanyClaimed || variant.mileageCityRealWorld || "N/A"}
                `;
      }
    } else if (type === "price") {
      let variant;
      let model;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        variant = await Variant.findById(id);
      }
      if (!variant) {
        const searchName = id.replace(/-/g, " ");
        variant = await Variant.findOne({ name: { $regex: new RegExp(searchName, "i") } });
      }
      if (variant) {
        const model2 = await Model.findOne({ id: variant.modelId });
        const brand = await Brand.findOne({ id: variant.brandId });
        context = `On-Road Price of ${brand?.name} ${model2?.name} ${variant.name}`;
        entityName = variant.name;
        const exShowroom = variant.price || 0;
        const rto = Math.round(exShowroom * 0.15);
        const insurance = Math.round(exShowroom * 0.04);
        const onRoad = exShowroom + rto + insurance;
        dataSummary = `
                Variant: ${variant.name}
                Ex-Showroom Price: \u20B9${(exShowroom / 1e5).toFixed(2)} Lakh
                Estimated RTO: \u20B9${(rto / 1e5).toFixed(2)} Lakh
                Estimated Insurance: \u20B9${(insurance / 1e5).toFixed(2)} Lakh
                Approx On-Road: \u20B9${(onRoad / 1e5).toFixed(2)} Lakh
                `;
      } else {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          model = await Model.findById(id);
        }
        if (!model) {
          const searchName = id.replace(/-/g, " ");
          model = await Model.findOne({ name: { $regex: new RegExp(searchName, "i") } });
        }
        if (model) {
          const brand = await Brand.findOne({ id: model.brandId });
          context = `Price range of ${brand?.name} ${model.name}`;
          entityName = model.name;
          const variants = await Variant.find({ modelId: model.id }).sort({ price: 1 });
          const minPrice = variants[0]?.price || 0;
          const maxPrice = variants[variants.length - 1]?.price || 0;
          dataSummary = `
                    Model: ${brand?.name} ${model.name}
                    Price Range: \u20B9${(minPrice / 1e5).toFixed(2)} Lakh - \u20B9${(maxPrice / 1e5).toFixed(2)} Lakh
                    Variants: ${variants.length} variants available
                    Top Model: ${variants[variants.length - 1]?.name || "N/A"}
                    Base Model: ${variants[0]?.name || "N/A"}
                    `;
        } else {
          console.warn(`\u26A0\uFE0F Entity not found for Price ID: ${id}, using fallback`);
          context = `Price of ${id.replace(/-/g, " ")}`;
          entityName = id.replace(/-/g, " ");
        }
      }
    } else if (type === "comparison") {
      if (id === "general") {
        context = "Car Comparison";
        entityName = "Comparison Tool";
        dataSummary = "Compare any two cars to find the best one for you. I can analyze specs, price, and value.";
      } else {
        const [id1, id2] = id.split(",");
        let item1 = await Model.findById(id1) || await Model.findOne({ id: id1 });
        let item2 = await Model.findById(id2) || await Model.findOne({ id: id2 });
        let isModel = true;
        if (!item1 || !item2) {
          item1 = await Variant.findById(id1) || await Variant.findOne({ id: id1 });
          item2 = await Variant.findById(id2) || await Variant.findOne({ id: id2 });
          isModel = false;
        }
        if (!item1 || !item2) {
          context = `Comparison`;
          entityName = "Comparison";
          dataSummary = "Comparing two cars.";
        } else {
          context = `Comparison between ${item1.name} vs ${item2.name}`;
          entityName = `${item1.name} vs ${item2.name}`;
          const brand1 = await Brand.findOne({ id: item1.brandId });
          const brand2 = await Brand.findOne({ id: item2.brandId });
          dataSummary = `
                    Car 1: ${brand1?.name} ${item1.name}
                    ${isModel ? `Mileage: ${item1.mileageData?.[0]?.companyClaimed || "N/A"}` : `Price: \u20B9${item1.price}`}

                    Car 2: ${brand2?.name} ${item2.name}
                    ${isModel ? `Mileage: ${item2.mileageData?.[0]?.companyClaimed || "N/A"}` : `Price: \u20B9${item2.price}`}
                    `;
        }
      }
    }
    console.log(`\u{1F4F0} Fetching news for: ${entityName}`);
    const news = await fetchRealTimeNews(entityName);
    if (news) {
      dataSummary += `
LATEST NEWS (Real-time):
${news}`;
    }
    console.log(`\u{1F916} Generating quirky bit for: ${context}`);
    if (!groq2) {
      const result2 = {
        text: `${entityName} is a great choice. Ask me for more details!`,
        ctaText: type === "brand" ? "Tell me more" : type === "model" ? `Ask about ${entityName}` : "Compare variants",
        chatContext: `Tell me more about ${context}`,
        type,
        entityName
      };
      cache2.set(cacheKey, { data: result2, timestamp: Date.now() });
      return res.json(result2);
    }
    const prompt = `
        You're a professional car expert writing ONE insightful, memorable fact with subtle humor.

        \u{1F3AF} THIS HOUR'S FOCUS: ${getCurrentTheme()}
        (Write about THIS specific angle - make it unique!)

        DATA:
        ${dataSummary || context}

        STYLE GUIDE:
        \u2705 Be PROFESSIONAL - Sound like an expert, not a stand-up comedian
        \u2705 Be INSIGHTFUL - Share a genuinely useful or surprising fact
        \u2705 Be SUBTLE - Humor through clever wordplay, not cultural clich\xE9s
        \u26A1 Be CONCISE - Under 100 characters, no fluff

        EXAMPLES OF GOOD FACTS:
        - "XUV700's ADAS detects obstacles faster than you can say 'brake'"
        - "Nexon scored 5 stars in crash tests. Your peace of mind? Priceless."
        - "Swift holds its value like fine wine - just depreciates slower"
        - "This engine drinks less fuel than a hybrid in traffic"
        - "Boot space: 450L. Weekend trips? Sorted."
        - "0-100 in 9.5s. Coffee's still hot when you reach the office."

        DON'T DO THIS:
        \u274C "Diwali trips", "chai", "Sharma ji", "mother-in-law" (too informal)
        \u274C "This car has good mileage" (boring, not specific)
        \u274C Multiple emojis or exclamation marks!!!

        RULES:
        1. Focus on the THEME above
        2. Use actual data from the specs provided
        3. One emoji max (optional)
        4. Be clever, not corny

        Write ONE professional-yet-witty fact now (no quotes):
        `;
    const response = await groq2.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a professional automotive analyst who writes concise, insightful car facts with subtle wit. Keep responses under 100 characters. Be informative yet engaging."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 80,
      temperature: 0.7
      // Balanced for professional yet engaging outputs
    });
    const text = response.choices[0]?.message?.content?.trim() || `${entityName} is a great choice. Ask me for more details!`;
    const ctaText = type === "brand" ? "Tell me more" : type === "model" ? `Ask about ${entityName}` : "Compare variants";
    const chatContext = `Tell me more about ${context}. specifically: ${text}`;
    const result = {
      text,
      ctaText,
      chatContext,
      type,
      entityName
    };
    cache2.set(cacheKey, { data: result, timestamp: Date.now() });
    console.log(`\u2705 Generated and cached quirky bit for ${cacheKey}`);
    res.json(result);
  } catch (error) {
    console.error("\u274C Quirky bit generation error:", error.message || error);
    res.status(500).json({
      error: "Failed to generate quirky bit",
      text: "Discover interesting facts about this car. Click to chat with AI!",
      ctaText: "Chat with AI",
      chatContext: "Tell me about this car"
    });
  }
});
var quirky_bit_default = router9;

// server/routes/youtube.ts
import { Router as Router2 } from "express";
var CACHE_DURATION2 = 24 * 60 * 60 * 1e3;
function formatViewCount2(count) {
  if (count >= 1e6) {
    return (count / 1e6).toFixed(1) + "M";
  } else if (count >= 1e3) {
    return (count / 1e3).toFixed(1) + "K";
  }
  return count.toString();
}
function formatPublishedDate2(dateString) {
  const date = new Date(dateString);
  const now = /* @__PURE__ */ new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? "s" : ""} ago`;
}
function parseDuration2(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "0:00";
  const hours = (match[1] || "").replace("H", "");
  const minutes = (match[2] || "").replace("M", "");
  const seconds = (match[3] || "").replace("S", "");
  if (hours) {
    return `${hours}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
  }
  return `${minutes || "0"}:${seconds.padStart(2, "0")}`;
}
async function fetchYouTubeVideos2(apiKey, channelId, searchQuery) {
  let actualChannelId = channelId;
  if (channelId.startsWith("@")) {
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelId}&type=channel&key=${apiKey}`
    );
    const searchData = await searchResponse.json();
    if (searchData.error) {
      throw new Error(searchData.error.message);
    }
    if (searchData.items && searchData.items.length > 0) {
      actualChannelId = searchData.items[0].snippet.channelId;
    }
  }
  let searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${actualChannelId}&part=snippet,id&order=date&maxResults=4&type=video`;
  if (searchQuery) {
    searchUrl += `&q=${encodeURIComponent(`"${searchQuery}"`)}`;
  }
  const videosResponse = await fetch(searchUrl);
  if (!videosResponse.ok) {
    const errorData = await videosResponse.json().catch(() => ({}));
    if (errorData.error?.message?.includes("quota")) {
      throw new Error("QUOTA_EXCEEDED");
    }
    throw new Error(errorData.error?.message || "Failed to fetch YouTube videos");
  }
  const videosData = await videosResponse.json();
  if (!videosData.items || videosData.items.length === 0) {
    throw new Error("No videos found");
  }
  const videoIds = videosData.items.map((item) => item.id.videoId).join(",");
  const statsResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=statistics,contentDetails,snippet`
  );
  const statsData = await statsResponse.json();
  const videos = statsData.items.map((item) => ({
    id: item.id,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high.url,
    duration: parseDuration2(item.contentDetails.duration),
    views: formatViewCount2(parseInt(item.statistics.viewCount)),
    likes: formatViewCount2(parseInt(item.statistics.likeCount || "0")),
    publishedAt: formatPublishedDate2(item.snippet.publishedAt),
    channelName: item.snippet.channelTitle
  }));
  return {
    featuredVideo: videos[0],
    relatedVideos: videos.slice(1)
  };
}
function createYouTubeRoutes(storage2) {
  const router23 = Router2();
  router23.get("/videos", async (req, res) => {
    try {
      const searchQuery = req.query.search;
      if (searchQuery) {
        try {
          const { getCacheRedisClient: getCacheRedisClient2 } = await Promise.resolve().then(() => (init_redis_config(), redis_config_exports));
          const redis5 = getCacheRedisClient2();
          if (redis5) {
            const cacheKey = `youtube:search:${searchQuery.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
            const cachedData = await redis5.get(cacheKey);
            if (cachedData) {
              const parsed = JSON.parse(cachedData);
              const cacheAge2 = Date.now() - parsed.timestamp;
              const minutesOld2 = Math.floor(cacheAge2 / 1e3 / 60);
              console.log(`\u2705 YouTube search cache hit for "${searchQuery}" (age: ${minutesOld2} minutes)`);
              return res.json({
                ...parsed.data,
                cached: true,
                cacheAge: minutesOld2
              });
            }
          }
        } catch (cacheError) {
          console.warn("\u26A0\uFE0F Redis cache check failed for search query:", cacheError);
        }
        const apiKey = process.env.YOUTUBE_API_KEY;
        const channelId = process.env.YOUTUBE_CHANNEL_ID || "@gadizone";
        if (!apiKey) {
          console.log("\u2139\uFE0F YouTube API key not configured - cannot fetch search results");
          return res.status(503).json({ error: "API key not configured" });
        }
        try {
          const freshData = await fetchYouTubeVideos2(apiKey, channelId, searchQuery);
          console.log(`\u2705 Fetched model-specific videos for: ${searchQuery}`);
          try {
            const { getCacheRedisClient: getCacheRedisClient2 } = await Promise.resolve().then(() => (init_redis_config(), redis_config_exports));
            const redis5 = getCacheRedisClient2();
            if (redis5) {
              const cacheKey = `youtube:search:${searchQuery.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
              const cacheData = {
                data: freshData,
                timestamp: Date.now()
              };
              const TTL = 48 * 60 * 60;
              await redis5.setex(cacheKey, TTL, JSON.stringify(cacheData));
              console.log(`\u{1F4BE} Cached search results for "${searchQuery}" (TTL: 48h)`);
            }
          } catch (saveError) {
            console.warn("\u26A0\uFE0F Failed to save search results to Redis:", saveError);
          }
          return res.json({
            ...freshData,
            cached: false
          });
        } catch (error) {
          console.error("YouTube search API error:", error);
          return res.status(503).json({ error: "Failed to fetch videos" });
        }
      }
      try {
        const { getCacheRedisClient: getCacheRedisClient2 } = await Promise.resolve().then(() => (init_redis_config(), redis_config_exports));
        const redis5 = getCacheRedisClient2();
        if (redis5) {
          const cacheKey = "youtube:general";
          const cachedData = await redis5.get(cacheKey);
          if (cachedData) {
            const parsed = JSON.parse(cachedData);
            const cacheAge2 = Date.now() - parsed.timestamp;
            const minutesOld2 = Math.floor(cacheAge2 / 1e3 / 60);
            console.log(`\u2705 YouTube general cache hit from Redis (age: ${minutesOld2} minutes)`);
            return res.json({
              ...parsed.data,
              cached: true,
              cacheAge: minutesOld2,
              source: "redis"
            });
          }
        }
      } catch (redisError) {
        console.warn("\u26A0\uFE0F Redis cache check failed for general videos:", redisError);
      }
      const cache4 = await storage2.getYouTubeCache();
      if (!cache4) {
        console.log("\u{1F4FA} YouTube cache is empty - attempting immediate fallback fetch");
        const { fetchAndCacheYouTubeVideos: fetchAndCacheYouTubeVideos2 } = await Promise.resolve().then(() => (init_scheduled_youtube_fetch(), scheduled_youtube_fetch_exports));
        await fetchAndCacheYouTubeVideos2(storage2);
        const freshCache = await storage2.getYouTubeCache();
        if (freshCache) {
          try {
            const { getCacheRedisClient: getCacheRedisClient2 } = await Promise.resolve().then(() => (init_redis_config(), redis_config_exports));
            const redis5 = getCacheRedisClient2();
            if (redis5) {
              await redis5.setex("youtube:general", 24 * 60 * 60, JSON.stringify(freshCache));
              console.log("\u{1F4BE} Cached fresh YouTube data to Redis");
            }
          } catch (e) {
            console.warn("Failed to update Redis cache:", e);
          }
          return res.json({
            ...freshCache.data,
            cached: false,
            cacheAge: 0,
            isStale: false
          });
        }
        return res.status(503).json({
          error: "No videos available",
          message: "Fresh content will be available soon"
        });
      }
      try {
        const { getCacheRedisClient: getCacheRedisClient2 } = await Promise.resolve().then(() => (init_redis_config(), redis_config_exports));
        const redis5 = getCacheRedisClient2();
        if (redis5) {
          await redis5.setex("youtube:general", 24 * 60 * 60, JSON.stringify(cache4));
        }
      } catch (e) {
      }
      const cacheAge = Date.now() - cache4.timestamp;
      const isExpired = cacheAge >= CACHE_DURATION2;
      const minutesOld = Math.floor(cacheAge / 1e3 / 60);
      const hoursOld = Math.floor(cacheAge / 1e3 / 60 / 60);
      if (isExpired) {
        console.log(`\u23F0 YouTube cache is stale (${hoursOld} hours old) - serving anyway until next refresh`);
      } else {
        console.log(`\u2705 Serving fresh YouTube videos from cache (age: ${minutesOld} minutes)`);
      }
      return res.json({
        ...cache4.data,
        cached: true,
        cacheAge: minutesOld,
        isStale: isExpired
      });
    } catch (error) {
      console.error("Error in YouTube API route:", error);
      return res.status(500).json({
        error: "Internal server error",
        message: "Failed to retrieve videos"
      });
    }
  });
  router23.post("/force-refresh", async (req, res) => {
    try {
      console.log("\u{1F504} Manual YouTube fetch triggered via API");
      const { fetchAndCacheYouTubeVideos: fetchAndCacheYouTubeVideos2 } = await Promise.resolve().then(() => (init_scheduled_youtube_fetch(), scheduled_youtube_fetch_exports));
      await fetchAndCacheYouTubeVideos2(storage2);
      return res.json({
        success: true,
        message: "YouTube cache refreshed successfully"
      });
    } catch (error) {
      console.error("Manual fetch failed:", error);
      return res.status(500).json({
        success: false,
        error: "Fetch failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  router23.get("/force-refresh", async (req, res) => {
    try {
      console.log("\u{1F504} Manual YouTube fetch triggered via browser");
      const { fetchAndCacheYouTubeVideos: fetchAndCacheYouTubeVideos2 } = await Promise.resolve().then(() => (init_scheduled_youtube_fetch(), scheduled_youtube_fetch_exports));
      await fetchAndCacheYouTubeVideos2(storage2);
      return res.send(`
                <html>
                    <body style="font-family: Arial; padding: 40px; text-align: center;">
                        <h1 style="color: green;">\u2705 Success!</h1>
                        <p>YouTube cache has been refreshed successfully.</p>
                        <p>You can now close this window and check your website.</p>
                    </body>
                </html>
            `);
    } catch (error) {
      console.error("Manual fetch failed:", error);
      return res.status(500).send(`
                <html>
                    <body style="font-family: Arial; padding: 40px; text-align: center;">
                        <h1 style="color: red;">\u274C Error</h1>
                        <p>Failed to refresh cache: ${error instanceof Error ? error.message : "Unknown error"}</p>
                    </body>
                </html>
            `);
    }
  });
  return router23;
}

// server/routes/ai-feedback.ts
import { Router as Router3 } from "express";
var router10 = Router3();
router10.post("/feedback", async (req, res) => {
  try {
    const { sessionId, query, feedback, feedbackText } = req.body;
    if (!sessionId || !query || !feedback) {
      return res.status(400).json({
        error: "Missing required fields: sessionId, query, feedback"
      });
    }
    if (!["thumbs_up", "thumbs_down"].includes(feedback)) {
      return res.status(400).json({
        error: "feedback must be thumbs_up or thumbs_down"
      });
    }
    await recordFeedback(sessionId, query, feedback, feedbackText);
    res.json({
      success: true,
      message: `Feedback recorded: ${feedback}`
    });
  } catch (error) {
    console.error("Feedback API error:", error);
    res.status(500).json({ error: "Failed to record feedback" });
  }
});
router10.post("/car-click", async (req, res) => {
  try {
    const { sessionId, modelId } = req.body;
    if (!sessionId || !modelId) {
      return res.status(400).json({
        error: "Missing required fields: sessionId, modelId"
      });
    }
    await recordCarClick(sessionId, modelId);
    res.json({
      success: true,
      message: "Car click recorded"
    });
  } catch (error) {
    console.error("Car click API error:", error);
    res.status(500).json({ error: "Failed to record car click" });
  }
});
router10.get("/metrics", async (_req, res) => {
  try {
    const metrics = await getLearningMetrics();
    const vectorStats = getVectorStoreStats();
    res.json({
      learning: metrics,
      vectorStore: vectorStats,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Metrics API error:", error);
    res.status(500).json({ error: "Failed to get metrics" });
  }
});
router10.get("/interactions", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const interactions = await getRecentInteractions(limit);
    res.json({
      count: interactions.length,
      interactions
    });
  } catch (error) {
    console.error("Interactions API error:", error);
    res.status(500).json({ error: "Failed to get interactions" });
  }
});
router10.post("/refresh-vectors", async (_req, res) => {
  try {
    console.log("\u{1F504} Refreshing vector store...");
    await refreshVectorStore();
    const stats = getVectorStoreStats();
    res.json({
      success: true,
      message: "Vector store refreshed",
      stats
    });
  } catch (error) {
    console.error("Refresh vectors error:", error);
    res.status(500).json({ error: "Failed to refresh vector store" });
  }
});
var ai_feedback_default = router10;

// server/routes/reviews.ts
init_schemas2();
import { Router as Router4 } from "express";
import { randomUUID as randomUUID2 } from "crypto";
import multer2 from "multer";
import path3 from "path";
import fs3 from "fs";
import { S3Client as S3Client2, PutObjectCommand as PutObjectCommand2 } from "@aws-sdk/client-s3";
import { readFileSync } from "fs";
var router11 = Router4();
var uploadDir = path3.join(process.cwd(), "uploads", "reviews");
if (!fs3.existsSync(uploadDir)) {
  fs3.mkdirSync(uploadDir, { recursive: true });
}
var upload2 = multer2({
  storage: multer2.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, "review-" + uniqueSuffix + path3.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
    // 5MB limit
    files: 5
    // Max 5 images
  }
});
async function uploadToR2(filePath, filename) {
  const bucket = process.env.R2_BUCKET;
  if (!bucket) return null;
  const accountId2 = process.env.R2_ACCOUNT_ID;
  const endpoint = process.env.R2_ENDPOINT || (accountId2 ? `https://${accountId2}.r2.cloudflarestorage.com` : void 0);
  if (!endpoint || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    return null;
  }
  try {
    const client2 = new S3Client2({
      region: process.env.R2_REGION || "auto",
      endpoint,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
      },
      forcePathStyle: true
    });
    const now = /* @__PURE__ */ new Date();
    const key = `uploads/reviews/${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}/${filename}`;
    const body = readFileSync(filePath);
    await client2.send(new PutObjectCommand2({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: "image/jpeg",
      CacheControl: "public, max-age=31536000, immutable"
    }));
    const publicBase = process.env.R2_PUBLIC_BASE_URL || `${endpoint}/${bucket}`;
    return `${publicBase}/${key}`;
  } catch (error) {
    console.error("R2 upload error:", error);
    return null;
  }
}
router11.get("/:modelSlug", async (req, res) => {
  try {
    const { modelSlug } = req.params;
    const { sort = "recent", rating, limit = 20, offset = 0 } = req.query;
    const query = {
      modelSlug,
      isApproved: true
    };
    if (rating && rating !== "all") {
      query.overallRating = { $gte: Number(rating), $lt: Number(rating) + 1 };
    }
    let sortOption = { createdAt: -1 };
    if (sort === "helpful") {
      sortOption = { likes: -1 };
    } else if (sort === "highest") {
      sortOption = { overallRating: -1 };
    } else if (sort === "lowest") {
      sortOption = { overallRating: 1 };
    }
    const [reviews, total] = await Promise.all([
      Review.find(query).sort(sortOption).skip(Number(offset)).limit(Number(limit)).lean(),
      Review.countDocuments(query)
    ]);
    const ratingBreakdown = await Review.aggregate([
      { $match: { modelSlug, isApproved: true } },
      {
        $group: {
          _id: { $floor: "$overallRating" },
          count: { $sum: 1 }
        }
      }
    ]);
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingBreakdown.forEach((r) => {
      if (r._id >= 1 && r._id <= 5) {
        breakdown[r._id] = r.count;
      }
    });
    const avgResult = await Review.aggregate([
      { $match: { modelSlug, isApproved: true } },
      { $group: { _id: null, avg: { $avg: "$overallRating" } } }
    ]);
    const overallAverage = avgResult[0]?.avg || 0;
    res.json({
      success: true,
      data: {
        reviews,
        total,
        overallRating: Math.round(overallAverage * 10) / 10,
        ratingBreakdown: breakdown,
        pagination: {
          limit: Number(limit),
          offset: Number(offset),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch reviews" });
  }
});
router11.post("/", upload2.array("images", 5), async (req, res) => {
  try {
    const {
      brandSlug,
      modelSlug,
      variantSlug,
      userName,
      userEmail,
      drivingExperience,
      emojiRatings,
      starRatings,
      reviewTitle,
      reviewText
    } = req.body;
    if (!brandSlug || !modelSlug || !userName || !userEmail || !drivingExperience) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }
    const parsedEmojiRatings = typeof emojiRatings === "string" ? JSON.parse(emojiRatings) : emojiRatings;
    const parsedStarRatings = typeof starRatings === "string" ? JSON.parse(starRatings) : starRatings;
    if (!reviewText || reviewText.length < 300) {
      return res.status(400).json({
        success: false,
        error: "Review must be at least 300 characters"
      });
    }
    if (!reviewTitle || reviewTitle.length < 10) {
      return res.status(400).json({
        success: false,
        error: "Title must be at least 10 characters"
      });
    }
    const calculateOverallRating2 = (starRatings2) => {
      if (!starRatings2) return 0;
      const values = Object.values(starRatings2).filter((val) => typeof val === "number");
      if (values.length === 0) return 0;
      const sum = values.reduce((a, b) => a + b, 0);
      return Number((sum / values.length).toFixed(1));
    };
    const imageUrls = [];
    const files = req.files;
    if (files && files.length > 0) {
      for (const file of files) {
        const r2Url = await uploadToR2(file.path, file.filename);
        if (r2Url) {
          imageUrls.push(r2Url);
          fs3.unlinkSync(file.path);
        } else {
          imageUrls.push(`/uploads/reviews/${file.filename}`);
        }
      }
    }
    const review = new Review({
      id: randomUUID2(),
      brandSlug,
      modelSlug,
      variantSlug: variantSlug || null,
      userName,
      userEmail,
      drivingExperience,
      emojiRatings: parsedEmojiRatings,
      starRatings: parsedStarRatings,
      overallRating: calculateOverallRating2(parsedStarRatings),
      reviewTitle,
      reviewText,
      images: imageUrls,
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: [],
      isApproved: false,
      // Requires admin approval
      isVerified: false,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    await review.save();
    res.status(201).json({
      success: true,
      message: "Review submitted successfully. It will be visible after moderation.",
      data: { id: review.id }
    });
  } catch (error) {
    console.error("Submit review error:", error);
    res.status(500).json({ success: false, error: "Failed to submit review" });
  }
});
router11.post("/:id/vote", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, userEmail } = req.body;
    if (!type || !userEmail) {
      return res.status(400).json({
        success: false,
        error: "Missing type or userEmail"
      });
    }
    let updatedReview;
    if (type === "like") {
      updatedReview = await Review.findOneAndUpdate(
        { id, likedBy: userEmail },
        {
          $pull: { likedBy: userEmail },
          $inc: { likes: -1 }
        },
        { new: true }
      );
      if (!updatedReview) {
        await Review.findOneAndUpdate(
          { id, dislikedBy: userEmail },
          {
            $pull: { dislikedBy: userEmail },
            $inc: { dislikes: -1 }
          }
        );
        updatedReview = await Review.findOneAndUpdate(
          { id, likedBy: { $ne: userEmail } },
          {
            $addToSet: { likedBy: userEmail },
            $inc: { likes: 1 }
          },
          { new: true }
        );
      }
    } else if (type === "dislike") {
      updatedReview = await Review.findOneAndUpdate(
        { id, dislikedBy: userEmail },
        {
          $pull: { dislikedBy: userEmail },
          $inc: { dislikes: -1 }
        },
        { new: true }
      );
      if (!updatedReview) {
        await Review.findOneAndUpdate(
          { id, likedBy: userEmail },
          {
            $pull: { likedBy: userEmail },
            $inc: { likes: -1 }
          }
        );
        updatedReview = await Review.findOneAndUpdate(
          { id, dislikedBy: { $ne: userEmail } },
          {
            $addToSet: { dislikedBy: userEmail },
            $inc: { dislikes: 1 }
          },
          { new: true }
        );
      }
    }
    if (!updatedReview) {
      updatedReview = await Review.findOne({ id });
    }
    if (!updatedReview) {
      return res.status(404).json({ success: false, error: "Review not found" });
    }
    res.json({
      success: true,
      data: {
        likes: updatedReview.likes,
        dislikes: updatedReview.dislikes,
        userVote: updatedReview.likedBy.includes(userEmail) ? "like" : updatedReview.dislikedBy.includes(userEmail) ? "dislike" : null
      }
    });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ success: false, error: "Failed to vote" });
  }
});
router11.get("/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await ReviewComment.find({
      reviewId: id,
      isApproved: true
    }).sort({ createdAt: -1 }).lean();
    const commentMap = /* @__PURE__ */ new Map();
    const rootComments = [];
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });
    comments.forEach((comment) => {
      const c = commentMap.get(comment.id);
      if (comment.parentId && commentMap.has(comment.parentId)) {
        commentMap.get(comment.parentId).replies.push(c);
      } else {
        rootComments.push(c);
      }
    });
    res.json({
      success: true,
      data: rootComments
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch comments" });
  }
});
router11.post("/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, userEmail, text, parentId } = req.body;
    if (!userName || !userEmail || !text) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }
    const review = await Review.findOne({ id });
    if (!review) {
      return res.status(404).json({ success: false, error: "Review not found" });
    }
    const comment = new ReviewComment({
      id: randomUUID2(),
      reviewId: id,
      parentId: parentId || null,
      userName,
      userEmail,
      text,
      likes: 0,
      dislikes: 0,
      isApproved: true
      // Auto-approve comments for now
    });
    await comment.save();
    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ success: false, error: "Failed to add comment" });
  }
});
var reviews_default = router11;

// server/routes/admin-reviews.ts
init_schemas2();
import { Router as Router5 } from "express";
import { randomUUID as randomUUID3 } from "crypto";
var router12 = Router5();
var calculateOverallRating = (starRatings) => {
  if (!starRatings) return 0;
  const values = Object.values(starRatings).filter((val) => typeof val === "number");
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return Number((sum / values.length).toFixed(1));
};
router12.get("/", async (req, res) => {
  const fs9 = __require("fs");
  const path9 = __require("path");
  const logFile = path9.join(process.cwd(), "admin_debug.log");
  const log2 = (msg) => {
    try {
      fs9.appendFileSync(logFile, `${(/* @__PURE__ */ new Date()).toISOString()} - ${msg}
`);
    } catch (e) {
    }
  };
  log2(`Request received: ${JSON.stringify(req.query)}`);
  try {
    const {
      brandSlug,
      modelSlug,
      variantSlug,
      isApproved,
      search,
      sort = "recent",
      limit = 50,
      offset = 0
    } = req.query;
    const query = {};
    if (brandSlug) query.brandSlug = brandSlug;
    if (modelSlug) query.modelSlug = modelSlug;
    if (variantSlug) query.variantSlug = variantSlug;
    if (isApproved !== void 0) query.isApproved = isApproved === "true";
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: "i" } },
        { reviewTitle: { $regex: search, $options: "i" } },
        { reviewText: { $regex: search, $options: "i" } }
      ];
    }
    let sortOption = { createdAt: -1 };
    if (sort === "rating") sortOption = { overallRating: -1 };
    if (sort === "likes") sortOption = { likes: -1 };
    log2(`Query built: ${JSON.stringify(query)}`);
    const [reviews, total] = await Promise.all([
      Review.find(query).sort(sortOption).skip(Number(offset)).limit(Number(limit)).lean(),
      Review.countDocuments(query)
    ]);
    log2(`Found ${total} reviews. Returning ${reviews.length} items.`);
    res.json({
      success: true,
      data: {
        reviews,
        total,
        pagination: {
          limit: Number(limit),
          offset: Number(offset),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error("Admin get reviews error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch reviews" });
  }
});
router12.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findOne({ id }).lean();
    if (!review) {
      return res.status(404).json({ success: false, error: "Review not found" });
    }
    const comments = await ReviewComment.find({ reviewId: id }).lean();
    res.json({
      success: true,
      data: { ...review, comments }
    });
  } catch (error) {
    console.error("Admin get review error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch review" });
  }
});
router12.post("/", async (req, res) => {
  try {
    const reviewData = req.body;
    const review = new Review({
      id: randomUUID3(),
      ...reviewData,
      overallRating: calculateOverallRating(reviewData.starRatings),
      isApproved: true,
      // Admin-created reviews are auto-approved
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    await review.save();
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error("Admin create review error:", error);
    res.status(500).json({ success: false, error: "Failed to create review" });
  }
});
router12.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.starRatings) {
      updates.overallRating = calculateOverallRating(updates.starRatings);
    }
    const review = await Review.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: /* @__PURE__ */ new Date() },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ success: false, error: "Review not found" });
    }
    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error("Admin update review error:", error);
    res.status(500).json({ success: false, error: "Failed to update review" });
  }
});
router12.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Review.deleteOne({ id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: "Review not found" });
    }
    await ReviewComment.deleteMany({ reviewId: id });
    res.json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    console.error("Admin delete review error:", error);
    res.status(500).json({ success: false, error: "Failed to delete review" });
  }
});
router12.patch("/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    const review = await Review.findOneAndUpdate(
      { id },
      { isApproved, updatedAt: /* @__PURE__ */ new Date() },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ success: false, error: "Review not found" });
    }
    res.json({
      success: true,
      data: review,
      message: isApproved ? "Review approved" : "Review rejected"
    });
  } catch (error) {
    console.error("Admin approve review error:", error);
    res.status(500).json({ success: false, error: "Failed to update review status" });
  }
});
router12.get("/stats/summary", async (req, res) => {
  try {
    const [total, approved, pending, avgRating] = await Promise.all([
      Review.countDocuments(),
      Review.countDocuments({ isApproved: true }),
      Review.countDocuments({ isApproved: false }),
      Review.aggregate([
        { $match: { isApproved: true } },
        { $group: { _id: null, avg: { $avg: "$overallRating" } } }
      ])
    ]);
    res.json({
      success: true,
      data: {
        total,
        approved,
        pending,
        averageRating: avgRating[0]?.avg || 0
      }
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch stats" });
  }
});
var admin_reviews_default = router12;

// server/routes/admin-emails.routes.ts
init_email_scheduler_service();
init_schemas2();
import { Router as Router6 } from "express";
var router13 = Router6();
router13.post("/send-weekly-digest", async (req, res) => {
  try {
    const { userId } = req.body;
    if (userId) {
      await emailScheduler.triggerWeeklyDigest(userId);
      res.json({
        success: true,
        message: `Weekly digest sent to user ${userId}`
      });
    } else {
      await emailScheduler.triggerWeeklyDigest();
      res.json({
        success: true,
        message: "Weekly digest job triggered for all users"
      });
    }
  } catch (error) {
    console.error("Error sending weekly digest:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
router13.post("/test-email/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await emailScheduler.triggerWeeklyDigest(userId);
    res.json({
      success: true,
      message: `Test email sent to user ${userId}`
    });
  } catch (error) {
    console.error("Error sending test email:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
router13.get("/scheduler-status", (req, res) => {
  const isEnabled = process.env.EMAIL_SCHEDULER_ENABLED === "true";
  res.json({
    success: true,
    scheduler: {
      enabled: isEnabled,
      weeklyDigestCron: process.env.WEEKLY_DIGEST_CRON || "0 9 * * 1",
      priceCheckCron: process.env.PRICE_CHECK_CRON || "0 8 * * *",
      batchSize: parseInt(process.env.EMAIL_BATCH_SIZE || "50"),
      rateLimit: parseInt(process.env.EMAIL_RATE_LIMIT || "10")
    }
  });
});
router13.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const weeklyDigestEnabled = await User.countDocuments({
      "emailPreferences.weeklyDigest": true,
      "emailPreferences.unsubscribedAt": null
    });
    const newLaunchesEnabled = await User.countDocuments({
      "emailPreferences.newLaunches": true,
      "emailPreferences.unsubscribedAt": null
    });
    const priceDropsEnabled = await User.countDocuments({
      "emailPreferences.priceDrops": true,
      "emailPreferences.unsubscribedAt": null
    });
    const unsubscribed = await User.countDocuments({
      "emailPreferences.unsubscribedAt": { $ne: null }
    });
    res.json({
      success: true,
      stats: {
        totalUsers,
        emailPreferences: {
          weeklyDigest: weeklyDigestEnabled,
          newLaunches: newLaunchesEnabled,
          priceDrops: priceDropsEnabled,
          unsubscribed
        }
      }
    });
  } catch (error) {
    console.error("Error fetching email stats:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
var admin_emails_routes_default = router13;

// server/routes/price-history.routes.ts
init_price_monitoring_service();
import { Router as Router7 } from "express";
var router14 = Router7();
router14.get("/variant/:variantId", async (req, res) => {
  try {
    const { variantId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const history = await priceMonitoringService.getVariantPriceHistory(variantId, limit);
    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    console.error("Error fetching variant price history:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
router14.get("/recent-drops", async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const limit = parseInt(req.query.limit) || 20;
    const drops = await priceMonitoringService.getRecentPriceDrops(days, limit);
    res.json({
      success: true,
      count: drops.length,
      drops
    });
  } catch (error) {
    console.error("Error fetching recent price drops:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
var price_history_routes_default = router14;

// server/routes/admin-humanize.ts
init_schemas2();
import { Router as Router8 } from "express";

// server/utils/content-humanizer.ts
var POSITIVE_REPLACEMENTS = {
  // General Positive Words
  "exceptional": ["solid", "notable", "strong"],
  "outstanding": ["good", "reliable", "competent"],
  "remarkable": ["interesting", "notable", "worth noting"],
  "incredible": ["notable", "significant"],
  "amazing": ["interesting", "worth considering"],
  "stunning": ["attractive", "good-looking"],
  "breathtaking": ["distinctive", "eye-catching"],
  "magnificent": ["good", "well-built", "solid"],
  "extraordinary": ["notable", "uncommon"],
  "phenomenal": ["strong", "impressive"],
  "superb": ["very good", "high-quality"],
  "excellent": ["good", "solid"],
  "perfect": ["well-suited", "appropriate"],
  "flawless": ["clean", "well-done", "solid"],
  "unparalleled": ["unique", "distinctive"],
  "unmatched": ["competitive", "strong"],
  "world-class": ["competitive", "high-standard"],
  "best-in-class": ["competitive", "among the better options"],
  "top-notch": ["good", "solid", "decent"],
  "premium": ["high-quality", "well-appointed"],
  "luxurious": ["comfortable", "well-equipped"],
  "state-of-the-art": ["modern", "current-gen"],
  "cutting-edge": ["modern", "current", "new"],
  "revolutionary": ["modern", "updated"],
  "game-changing": ["significant", "notable"],
  "incredibly": ["quite", "fairly", "reasonably"],
  "extremely": ["quite", "fairly", "pretty"],
  "absolutely": ["quite", "definitely", "certainly"],
  "truly": ["certainly", "definitely"],
  "undoubtedly": ["likely", "probably", "generally"],
  "certainly": ["likely", "probably", "generally"],
  "definitely": ["likely", "preferably"],
  "without a doubt": ["likely", "probably"],
  "the best": ["a good option", "among the better choices"],
  "market-leading": ["competitive", "well-positioned"],
  "industry-leading": ["competitive", "established"],
  "class-leading": ["competitive", "among the better"],
  "segment-best": ["competitive", "among the good options"],
  "pinnacle": ["top-tier", "flagship", "highlight"],
  "ultimate": ["comprehensive", "top-level", "flagship"],
  "legendary": ["well-known", "established", "classic"],
  "benchmark": ["standard", "reference", "leader"],
  "masterpiece": ["well-crafted", "standout model"],
  "unrivaled": ["leading", "top-tier"],
  // Aggressive Marketing Phrases (Specific Targets)
  "undisputed leader": ["popular option", "strong seller", "common choice"],
  "design philosophy": ["design style", "look", "aesthetics"],
  "commanding exterior": ["distinctive exterior", "exterior look"],
  "futuristic": ["modern", "new-age", "current"],
  "uncompromised safety": ["standard safety features", "safety equipment"],
  "loaded with": ["includes", "has", "features"],
  "segment-first": ["notable", "new", "modern"],
  "thrill-inducing": ["powerful", "responsive", "quick"],
  "experience": ["check out", "note", "see"],
  "discover": ["check out", "look at", "consider"],
  "redefined by": ["featuring", "using", "with"],
  "blends": ["mixes", "combines", "has"],
  "combines": ["mixes", "has", "features"],
  "epitome of": ["a good example of", "known for"],
  "testament to": ["shows", "indicates"],
  "set apart": ["distinguish", "differentiate"],
  "dynamic": ["responsive", "good"],
  "sculpted": ["shaped", "designed"],
  "silhouette": ["shape", "look"],
  "stance": ["look", "appearance"],
  "all-new": ["new", "latest"],
  "meticulously": ["carefully", "well"],
  "crafted": ["made", "built"]
};
var CASUAL_REPLACEMENTS = {
  "Discover the": ["The", "Take a look at the"],
  "Experience the": ["The", "Check out the"],
  "Introducing the": ["The", "Here is the"],
  "Welcome to": ["This is", "Here is"],
  "Redefined by": ["With", "Featuring"],
  "It is": ["It's", "It's"],
  "it is": ["it's", "it's"],
  "We are": ["We're", "We're"],
  "we are": ["we're", "we're"],
  "They are": ["They're", "They're"],
  "they are": ["they're", "they're"],
  "You will": ["You'll", "You'll"],
  "you will": ["you'll", "you'll"],
  "does not": ["doesn't", "doesn't"],
  "do not": ["don't", "don't"],
  "cannot": ["can't", "can't"],
  "will not": ["won't", "won't"],
  "should not": ["shouldn't", "shouldn't"],
  "would not": ["wouldn't", "wouldn't"],
  "could not": ["couldn't", "couldn't"],
  "is not": ["isn't", "isn't"],
  "are not": ["aren't", "aren't"],
  "Furthermore,": ["Also,", "Plus,", "On top of that,"],
  "Moreover,": ["Also,", "What's more,", "Plus,"],
  "Additionally,": ["Also,", "On top of that,", "Plus,"],
  "In conclusion,": ["Overall,", "All things considered,", "To sum up,"],
  "However,": ["That said,", "But,", "On the flip side,"],
  "Nevertheless,": ["Still,", "Even so,", "That said,"],
  "Consequently,": ["So,", "As a result,", "Because of this,"],
  "Subsequently,": ["Then,", "After that,", "Following this,"],
  "Notwithstanding,": ["Despite this,", "Even so,", "Still,"],
  "Henceforth,": ["From now on,", "Going forward,"],
  "Thereafter,": ["After that,", "Following this,"],
  "Heretofore,": ["Until now,", "Before this,"],
  "In order to": ["To", "For"],
  "Due to the fact that": ["Because", "Since"],
  "For the purpose of": ["To", "For"],
  "In the event that": ["If", "When"],
  "At this point in time": ["Now", "Currently"],
  "In the near future": ["Soon", "Shortly"],
  "It should be noted that": ["Note that", "Keep in mind,"],
  "It is important to note that": ["Worth noting,", "Keep in mind,"],
  "It is worth mentioning that": ["Worth mentioning,", "Also,"],
  "As a matter of fact": ["Actually", "In fact"],
  "provides": ["offers", "gives you", "comes with"],
  "features": ["has", "includes", "comes with"],
  "boasts": ["has", "offers", "includes"],
  "delivers": ["provides", "gives you", "offers"],
  "ensures": ["makes sure", "helps with", "gives you"],
  "offers": ["has", "comes with", "includes"],
  "equipped with": ["has", "comes with"],
  "comes equipped with": ["has", "includes"]
};
var HUMAN_EXPRESSIONS = [
  "Here's the thing \u2014",
  "Worth mentioning:",
  "Quick note:",
  "One thing to consider:",
  "Something to keep in mind:",
  "From what we've seen,",
  "Based on real-world usage,"
];
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function neutralizePositiveLanguage(text) {
  let result = text;
  for (const [positive, neutralOptions] of Object.entries(POSITIVE_REPLACEMENTS)) {
    const regex = new RegExp(`\\b${positive}\\b`, "gi");
    result = result.replace(regex, () => getRandomItem(neutralOptions));
  }
  return result;
}
function addContractions(text) {
  let result = text;
  for (const [formal, casualOptions] of Object.entries(CASUAL_REPLACEMENTS)) {
    const regex = new RegExp(formal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    result = result.replace(regex, () => getRandomItem(casualOptions));
  }
  return result;
}
function varySentenceStarters(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  if (sentences.length === 0) return text;
  let theCount = 0;
  const varied = sentences.map((sentence, index) => {
    const trimmed = sentence.trim();
    if (trimmed.startsWith("The ")) {
      theCount++;
      if (theCount > 1 && Math.random() > 0.6) {
        const nounMatch = trimmed.match(/^The\s+([a-z]+)\s+/i);
        if (nounMatch) {
          const noun = nounMatch[1];
          const rest = trimmed.substring(nounMatch[0].length);
          const openers = [
            `When looking at the ${noun},`,
            `As for the ${noun},`,
            `Regarding the ${noun},`,
            `In terms of the ${noun},`
          ];
          const opener = getRandomItem(openers);
          const fixedRest = rest.charAt(0).toLowerCase() + rest.slice(1);
          return ` ${opener} ${fixedRest}`;
        }
      }
    }
    return sentence;
  });
  return varied.join("");
}
function addOccasionalHumanTouch(text) {
  if (text.length < 100) return text;
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  if (sentences.length > 3 && Math.random() > 0.6) {
    const insertIndex = Math.floor(Math.random() * (sentences.length - 2)) + 1;
    const expression = getRandomItem(HUMAN_EXPRESSIONS);
    const originalSentence = sentences[insertIndex].trim();
    const lowerCasedOriginal = originalSentence.charAt(0).toLowerCase() + originalSentence.slice(1);
    sentences[insertIndex] = ` ${expression} ${lowerCasedOriginal}`;
  }
  return sentences.join("");
}
function balanceTone(text) {
  let result = text.replace(/!{2,}/g, "!");
  result = result.replace(/You will (love|adore|enjoy|appreciate)/gi, "You might appreciate");
  result = result.replace(/You('ll| will) be (amazed|impressed|blown away)/gi, "You may notice");
  result = result.replace(/It is equipped with/gi, "It comes with");
  result = result.replace(/It comes equipped with/gi, "It includes");
  result = result.replace(/the most ([a-z]+) (car|vehicle|model|variant)/gi, "a notably $1 $2");
  result = result.replace(/one of the (best|finest|greatest)/gi, "among the better");
  return result;
}
function humanizeContent(text) {
  if (!text || typeof text !== "string") return "";
  let result = text;
  result = balanceTone(result);
  result = neutralizePositiveLanguage(result);
  result = addContractions(result);
  result = varySentenceStarters(result);
  result = addOccasionalHumanTouch(result);
  result = result.replace(/\s{2,}/g, " ").trim();
  return result;
}
function humanizeEngineSummaries(engines) {
  if (!engines || !Array.isArray(engines)) return [];
  return engines.map((engine) => ({
    ...engine,
    summary: humanizeContent(engine.summary)
  }));
}
function testHumanizer(sampleText) {
  return {
    before: sampleText,
    after: humanizeContent(sampleText)
  };
}

// server/routes/admin-humanize.ts
var router15 = Router8();
router15.post("/test", authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }
    const result = testHumanizer(text);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("Test humanizer error:", error);
    res.status(500).json({ error: "Failed to test humanizer" });
  }
});
router15.post("/brands", authenticateToken, async (req, res) => {
  try {
    console.log("\u{1F504} Starting brand content humanization...");
    const brands = await Brand.find({});
    let updatedCount = 0;
    let skippedCount = 0;
    const results = [];
    for (const brand of brands) {
      if (!brand.summary) {
        skippedCount++;
        results.push({ name: brand.name, updated: false });
        continue;
      }
      const humanizedSummary = humanizeContent(brand.summary);
      if (humanizedSummary !== brand.summary) {
        await Brand.updateOne(
          { _id: brand._id },
          { $set: { summary: humanizedSummary } }
        );
        updatedCount++;
        results.push({
          name: brand.name,
          updated: true,
          sample: humanizedSummary.substring(0, 100) + "..."
        });
      } else {
        skippedCount++;
        results.push({ name: brand.name, updated: false });
      }
    }
    console.log(`\u2705 Brand humanization complete: ${updatedCount} updated, ${skippedCount} skipped`);
    res.json({
      success: true,
      summary: {
        total: brands.length,
        updated: updatedCount,
        skipped: skippedCount
      },
      results
    });
  } catch (error) {
    console.error("Brand humanization error:", error);
    res.status(500).json({ error: "Failed to humanize brand content" });
  }
});
router15.post("/models", authenticateToken, async (req, res) => {
  try {
    console.log("\u{1F504} Starting model content humanization...");
    const models = await Model.find({});
    let updatedCount = 0;
    let skippedCount = 0;
    const results = [];
    for (const model of models) {
      const updates = {};
      const updatedFields = [];
      const fieldsToHumanize = ["summary", "description", "exteriorDesign", "comfortConvenience", "pros", "headerSeo"];
      for (const field of fieldsToHumanize) {
        const original = model[field];
        if (original && typeof original === "string") {
          const humanized = humanizeContent(original);
          if (humanized !== original) {
            updates[field] = humanized;
            updatedFields.push(field);
          }
        }
      }
      if (model.engineSummaries && model.engineSummaries.length > 0) {
        const humanizedEngines = humanizeEngineSummaries(model.engineSummaries);
        const engineChanged = humanizedEngines.some(
          (he, i) => he.summary !== model.engineSummaries?.[i]?.summary
        );
        if (engineChanged) {
          updates.engineSummaries = humanizedEngines;
          updatedFields.push("engineSummaries");
        }
      }
      if (Object.keys(updates).length > 0) {
        await Model.updateOne(
          { _id: model._id },
          { $set: updates }
        );
        updatedCount++;
        results.push({ name: model.name, updated: true, fields: updatedFields });
      } else {
        skippedCount++;
        results.push({ name: model.name, updated: false });
      }
    }
    console.log(`\u2705 Model humanization complete: ${updatedCount} updated, ${skippedCount} skipped`);
    res.json({
      success: true,
      summary: {
        total: models.length,
        updated: updatedCount,
        skipped: skippedCount
      },
      results
    });
  } catch (error) {
    console.error("Model humanization error:", error);
    res.status(500).json({ error: "Failed to humanize model content" });
  }
});
router15.post("/upcoming", authenticateToken, async (req, res) => {
  try {
    console.log("\u{1F504} Starting upcoming car content humanization...");
    const upcomingCars = await UpcomingCar.find({});
    let updatedCount = 0;
    let skippedCount = 0;
    const results = [];
    for (const car of upcomingCars) {
      const updates = {};
      const updatedFields = [];
      const fieldsToHumanize = ["summary", "description", "exteriorDesign", "comfortConvenience", "pros", "headerSeo"];
      for (const field of fieldsToHumanize) {
        const original = car[field];
        if (original && typeof original === "string") {
          const humanized = humanizeContent(original);
          if (humanized !== original) {
            updates[field] = humanized;
            updatedFields.push(field);
          }
        }
      }
      if (car.engineSummaries && car.engineSummaries.length > 0) {
        const humanizedEngines = humanizeEngineSummaries(car.engineSummaries);
        const engineChanged = humanizedEngines.some(
          (he, i) => he.summary !== car.engineSummaries?.[i]?.summary
        );
        if (engineChanged) {
          updates.engineSummaries = humanizedEngines;
          updatedFields.push("engineSummaries");
        }
      }
      if (Object.keys(updates).length > 0) {
        await UpcomingCar.updateOne(
          { _id: car._id },
          { $set: updates }
        );
        updatedCount++;
        results.push({ name: car.name, updated: true, fields: updatedFields });
      } else {
        skippedCount++;
        results.push({ name: car.name, updated: false });
      }
    }
    console.log(`\u2705 Upcoming car humanization complete: ${updatedCount} updated, ${skippedCount} skipped`);
    res.json({
      success: true,
      summary: {
        total: upcomingCars.length,
        updated: updatedCount,
        skipped: skippedCount
      },
      results
    });
  } catch (error) {
    console.error("Upcoming car humanization error:", error);
    res.status(500).json({ error: "Failed to humanize upcoming car content" });
  }
});
router15.post("/variants", authenticateToken, async (req, res) => {
  try {
    console.log("\u{1F504} Starting variant content humanization...");
    const variants = await Variant.find({});
    let updatedCount = 0;
    let skippedCount = 0;
    for (const variant of variants) {
      const updates = {};
      const fieldsToHumanize = [
        "description",
        "headerSummary",
        "keyFeatures",
        "exteriorDesign",
        "comfortConvenience",
        "engineSummary"
      ];
      for (const field of fieldsToHumanize) {
        const original = variant[field];
        if (original && typeof original === "string") {
          const humanized = humanizeContent(original);
          if (humanized !== original) {
            updates[field] = humanized;
          }
        }
      }
      if (Object.keys(updates).length > 0) {
        await Variant.updateOne(
          { _id: variant._id },
          { $set: updates }
        );
        updatedCount++;
      } else {
        skippedCount++;
      }
    }
    console.log(`\u2705 Variant humanization complete: ${updatedCount} updated, ${skippedCount} skipped`);
    res.json({
      success: true,
      summary: {
        total: variants.length,
        updated: updatedCount,
        skipped: skippedCount
      }
    });
  } catch (error) {
    console.error("Variant humanization error:", error);
    res.status(500).json({ error: "Failed to humanize variant content" });
  }
});
router15.post("/all", authenticateToken, async (req, res) => {
  try {
    console.log("\u{1F504} Starting FULL content humanization...");
    const results = {
      brands: { total: 0, updated: 0, skipped: 0 },
      models: { total: 0, updated: 0, skipped: 0 },
      upcomingCars: { total: 0, updated: 0, skipped: 0 },
      variants: { total: 0, updated: 0, skipped: 0 }
    };
    const brands = await Brand.find({});
    results.brands.total = brands.length;
    for (const brand of brands) {
      if (brand.summary) {
        const humanized = humanizeContent(brand.summary);
        if (humanized !== brand.summary) {
          await Brand.updateOne({ _id: brand._id }, { $set: { summary: humanized } });
          results.brands.updated++;
        } else {
          results.brands.skipped++;
        }
      } else {
        results.brands.skipped++;
      }
    }
    const models = await Model.find({});
    results.models.total = models.length;
    for (const model of models) {
      const updates = {};
      const fieldsToHumanize = ["summary", "description", "exteriorDesign", "comfortConvenience", "pros", "headerSeo"];
      for (const field of fieldsToHumanize) {
        const original = model[field];
        if (original && typeof original === "string") {
          const humanized = humanizeContent(original);
          if (humanized !== original) {
            updates[field] = humanized;
          }
        }
      }
      if (model.engineSummaries && model.engineSummaries.length > 0) {
        const humanized = humanizeEngineSummaries(model.engineSummaries);
        const changed = humanized.some((h, i) => h.summary !== model.engineSummaries?.[i]?.summary);
        if (changed) updates.engineSummaries = humanized;
      }
      if (Object.keys(updates).length > 0) {
        await Model.updateOne({ _id: model._id }, { $set: updates });
        results.models.updated++;
      } else {
        results.models.skipped++;
      }
    }
    const upcomingCars = await UpcomingCar.find({});
    results.upcomingCars.total = upcomingCars.length;
    for (const car of upcomingCars) {
      const updates = {};
      const fieldsToHumanize = ["summary", "description", "exteriorDesign", "comfortConvenience", "pros", "headerSeo"];
      for (const field of fieldsToHumanize) {
        const original = car[field];
        if (original && typeof original === "string") {
          const humanized = humanizeContent(original);
          if (humanized !== original) {
            updates[field] = humanized;
          }
        }
      }
      if (car.engineSummaries && car.engineSummaries.length > 0) {
        const humanized = humanizeEngineSummaries(car.engineSummaries);
        const changed = humanized.some((h, i) => h.summary !== car.engineSummaries?.[i]?.summary);
        if (changed) updates.engineSummaries = humanized;
      }
      if (Object.keys(updates).length > 0) {
        await UpcomingCar.updateOne({ _id: car._id }, { $set: updates });
        results.upcomingCars.updated++;
      } else {
        results.upcomingCars.skipped++;
      }
    }
    const variants = await Variant.find({});
    results.variants.total = variants.length;
    for (const variant of variants) {
      const updates = {};
      const fieldsToHumanize = ["description", "headerSummary", "keyFeatures", "exteriorDesign", "comfortConvenience", "engineSummary"];
      for (const field of fieldsToHumanize) {
        const original = variant[field];
        if (original && typeof original === "string") {
          const humanized = humanizeContent(original);
          if (humanized !== original) {
            updates[field] = humanized;
          }
        }
      }
      if (Object.keys(updates).length > 0) {
        await Variant.updateOne({ _id: variant._id }, { $set: updates });
        results.variants.updated++;
      } else {
        results.variants.skipped++;
      }
    }
    const totalUpdated = results.brands.updated + results.models.updated + results.upcomingCars.updated + results.variants.updated;
    console.log(`\u2705 Full humanization complete: ${totalUpdated} items updated`);
    res.json({
      success: true,
      message: `Humanized ${totalUpdated} items across all collections`,
      results
    });
  } catch (error) {
    console.error("Full humanization error:", error);
    res.status(500).json({ error: "Failed to humanize all content" });
  }
});
router15.post("/preview", authenticateToken, async (req, res) => {
  try {
    const { type = "models", limit = 5 } = req.body;
    console.log(`\u{1F50D} Previewing humanization for ${type} (limit: ${limit})...`);
    const previews = [];
    let items = [];
    let fieldsToPreview = [];
    switch (type) {
      case "brands":
        items = await Brand.find({}).limit(limit);
        fieldsToPreview = ["summary"];
        break;
      case "models":
        items = await Model.find({}).limit(limit);
        fieldsToPreview = ["summary", "description"];
        break;
      case "variants":
        items = await Variant.find({}).limit(limit);
        fieldsToPreview = ["description", "headerSummary"];
        break;
      default:
        return res.status(400).json({ error: "Invalid type. Use: brands, models, or variants" });
    }
    for (const item of items) {
      for (const field of fieldsToPreview) {
        const original = item[field];
        if (original && typeof original === "string" && original.length > 50) {
          const humanized = humanizeContent(original);
          if (humanized !== original) {
            previews.push({
              name: item.name,
              field,
              before: original.substring(0, 200) + (original.length > 200 ? "..." : ""),
              after: humanized.substring(0, 200) + (humanized.length > 200 ? "..." : "")
            });
          }
        }
      }
    }
    res.json({
      success: true,
      type,
      previewCount: previews.length,
      previews
    });
  } catch (error) {
    console.error("Preview error:", error);
    res.status(500).json({ error: "Failed to generate preview" });
  }
});
var admin_humanize_default = router15;

// server/services/search-index.ts
init_redis_cache();
var SEARCH_INDEX_PREFIX = "search:idx:";
var SEARCH_DATA_PREFIX = "search:data:";
var SEARCH_INDEX_META = "search:meta";
var INDEX_REFRESH_INTERVAL = 30 * 60 * 1e3;
var inMemoryCache = /* @__PURE__ */ new Map();
var lastIndexBuild = 0;
var isBuilding = false;
async function scanKeys(redis5, pattern) {
  const keys = [];
  let cursor = "0";
  do {
    const [newCursor, foundKeys] = await redis5.scan(cursor, "MATCH", pattern, "COUNT", 100);
    cursor = newCursor;
    keys.push(...foundKeys);
  } while (cursor !== "0");
  return keys;
}
async function buildSearchIndex() {
  if (isBuilding) {
    console.log("\u23F3 Search index build already in progress, skipping...");
    return;
  }
  isBuilding = true;
  const startTime = Date.now();
  try {
    const redis5 = getCacheRedisClient();
    const mongoose8 = (await import("mongoose")).default;
    const db = mongoose8.connection.db;
    if (!db) {
      console.warn("\u26A0\uFE0F Database not connected, skipping search index build");
      return;
    }
    console.log("\u{1F528} Building search index...");
    const [models, brands] = await Promise.all([
      db.collection("models").find(
        { status: "active" },
        { projection: { _id: 0, id: 1, name: 1, brandId: 1, heroImage: 1 } }
      ).toArray(),
      db.collection("brands").find(
        {},
        { projection: { _id: 0, id: 1, name: 1 } }
      ).toArray()
    ]);
    const brandMap = /* @__PURE__ */ new Map();
    brands.forEach((brand) => {
      brandMap.set(brand.id, brand.name);
    });
    inMemoryCache.clear();
    const searchEntries = models.map((model) => {
      const brandName = brandMap.get(model.brandId) || "Unknown";
      const brandSlug = brandName.toLowerCase().replace(/\s+/g, "-");
      const modelSlug = model.name.toLowerCase().replace(/\s+/g, "-");
      return {
        id: model.id,
        name: model.name,
        brandName,
        brandSlug,
        modelSlug,
        slug: `${brandSlug}-${modelSlug}`,
        heroImage: model.heroImage || ""
      };
    });
    if (redis5) {
      await storeInRedis(redis5, searchEntries, brands.length);
    }
    searchEntries.forEach((entry) => {
      inMemoryCache.set(entry.id, entry);
    });
    lastIndexBuild = Date.now();
    const buildTime = Date.now() - startTime;
    console.log(`\u2705 Search index built: ${searchEntries.length} models, ${brands.length} brands in ${buildTime}ms`);
    scheduleIndexRefresh();
  } catch (error) {
    console.error("\u274C Failed to build search index:", error);
  } finally {
    isBuilding = false;
  }
}
async function storeInRedis(redis5, entries, brandCount) {
  const pipeline = redis5.pipeline();
  const oldKeys = await scanKeys(redis5, `${SEARCH_INDEX_PREFIX}*`);
  if (oldKeys.length > 0) {
    for (let i = 0; i < oldKeys.length; i += 100) {
      const batch = oldKeys.slice(i, i + 100);
      await redis5.del(...batch);
    }
  }
  const oldDataKeys = await scanKeys(redis5, `${SEARCH_DATA_PREFIX}*`);
  if (oldDataKeys.length > 0) {
    for (let i = 0; i < oldDataKeys.length; i += 100) {
      const batch = oldDataKeys.slice(i, i + 100);
      await redis5.del(...batch);
    }
  }
  entries.forEach((entry) => {
    pipeline.set(`${SEARCH_DATA_PREFIX}${entry.id}`, JSON.stringify(entry), "EX", 3600);
    const searchTerms = generateSearchTerms(entry);
    searchTerms.forEach((term) => {
      pipeline.zadd(`${SEARCH_INDEX_PREFIX}${term}`, 0, entry.id);
      pipeline.expire(`${SEARCH_INDEX_PREFIX}${term}`, 3600);
    });
  });
  const meta = {
    lastBuild: Date.now(),
    modelCount: entries.length,
    brandCount,
    version: "v1"
  };
  pipeline.set(SEARCH_INDEX_META, JSON.stringify(meta), "EX", 3600);
  await pipeline.exec();
}
function generateSearchTerms(entry) {
  const terms = /* @__PURE__ */ new Set();
  const addTermPrefixes = (text) => {
    const normalized = text.toLowerCase().trim();
    terms.add(normalized);
    normalized.split(/\s+/).forEach((word) => {
      terms.add(word);
      for (let i = 2; i <= word.length; i++) {
        terms.add(word.substring(0, i));
      }
    });
  };
  addTermPrefixes(entry.name);
  addTermPrefixes(entry.brandName);
  addTermPrefixes(`${entry.brandName} ${entry.name}`);
  return Array.from(terms);
}
async function searchFromIndex(query, limit = 20) {
  const startTime = Date.now();
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery || normalizedQuery.length < 2) {
    return { results: [], source: "memory", indexAge: Date.now() - lastIndexBuild };
  }
  if (inMemoryCache.size > 0) {
    const results = searchInMemory(normalizedQuery, limit);
    console.log(`\u26A1 Search from memory: "${query}" -> ${results.length} results in ${Date.now() - startTime}ms`);
    return {
      results,
      source: "memory",
      indexAge: Date.now() - lastIndexBuild
    };
  }
  const redis5 = getCacheRedisClient();
  if (redis5) {
    try {
      const results = await searchInRedis(redis5, normalizedQuery, limit);
      if (results.length > 0) {
        console.log(`\u26A1 Search from Redis: "${query}" -> ${results.length} results in ${Date.now() - startTime}ms`);
        return {
          results,
          source: "redis",
          indexAge: Date.now() - lastIndexBuild
        };
      }
    } catch (error) {
      console.warn("\u26A0\uFE0F Redis search failed, falling back:", error);
    }
  }
  return null;
}
function searchInMemory(query, limit) {
  const results = [];
  const queryTerms = query.split(/\s+/).filter((t) => t.length >= 2);
  const allValues = Array.from(inMemoryCache.values());
  for (let i = 0; i < allValues.length && results.length < limit; i++) {
    const entry = allValues[i];
    const searchableText = `${entry.brandName} ${entry.name}`.toLowerCase();
    const matches = queryTerms.every((term) => searchableText.includes(term));
    if (matches) {
      results.push(entry);
    }
  }
  return results.sort((a, b) => {
    const aExact = a.name.toLowerCase().startsWith(query) || a.brandName.toLowerCase().startsWith(query);
    const bExact = b.name.toLowerCase().startsWith(query) || b.brandName.toLowerCase().startsWith(query);
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    return a.name.localeCompare(b.name);
  });
}
async function searchInRedis(redis5, query, limit) {
  const indexKey = `${SEARCH_INDEX_PREFIX}${query}`;
  const ids = await redis5.zrange(indexKey, 0, limit - 1);
  if (ids.length === 0) {
    const keys = await scanKeys(redis5, `${SEARCH_INDEX_PREFIX}${query}*`);
    if (keys.length > 0) {
      const allIds = await Promise.all(
        keys.slice(0, 5).map((key) => redis5.zrange(key, 0, 10))
      );
      const uniqueIds = Array.from(new Set(allIds.flat())).slice(0, limit);
      return fetchResultsFromRedis(redis5, uniqueIds);
    }
    return [];
  }
  return fetchResultsFromRedis(redis5, ids);
}
async function fetchResultsFromRedis(redis5, ids) {
  if (ids.length === 0) return [];
  const dataKeys = ids.map((id) => `${SEARCH_DATA_PREFIX}${id}`);
  const results = await redis5.mget(...dataKeys);
  return results.filter((data) => data !== null).map((data) => JSON.parse(data));
}
var refreshTimer = null;
function scheduleIndexRefresh() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }
  refreshTimer = setTimeout(async () => {
    console.log("\u{1F504} Scheduled search index refresh...");
    await buildSearchIndex();
  }, INDEX_REFRESH_INTERVAL);
}
async function invalidateSearchIndex() {
  console.log("\u{1F5D1}\uFE0F Invalidating search index...");
  inMemoryCache.clear();
  lastIndexBuild = 0;
  const redis5 = getCacheRedisClient();
  if (redis5) {
    try {
      const keys = await scanKeys(redis5, `${SEARCH_INDEX_PREFIX}*`);
      const dataKeys = await scanKeys(redis5, `${SEARCH_DATA_PREFIX}*`);
      for (let i = 0; i < keys.length; i += 100) {
        await redis5.del(...keys.slice(i, i + 100));
      }
      for (let i = 0; i < dataKeys.length; i += 100) {
        await redis5.del(...dataKeys.slice(i, i + 100));
      }
      await redis5.del(SEARCH_INDEX_META);
    } catch (error) {
      console.error("Failed to invalidate Redis search index:", error);
    }
  }
  await buildSearchIndex();
}
function getSearchIndexStats() {
  return {
    inMemoryCount: inMemoryCache.size,
    lastBuild: lastIndexBuild,
    isBuilding,
    ageMinutes: Math.round((Date.now() - lastIndexBuild) / 6e4)
  };
}

// server/routes.ts
function formatBrandSummary(summary, brandName) {
  if (!summary) {
    return { sections: [] };
  }
  const sections = [];
  let priceInfo = "";
  const lines = summary.split("\n").filter((line) => line.trim());
  let currentSection = "";
  let currentContent = [];
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.includes("Start of operations in India:") || trimmedLine.includes("Market Share:") || trimmedLine.includes("Key Aspects:") || trimmedLine.includes("Competitors:")) {
      if (currentSection && currentContent.length > 0) {
        sections.push({
          title: currentSection,
          content: currentContent.join(" ").trim()
        });
      }
      currentSection = trimmedLine.replace(":", "");
      currentContent = [];
    } else if (trimmedLine.includes("car price starts at") || trimmedLine.includes("cheapest model") || trimmedLine.includes("most expensive model")) {
      priceInfo = trimmedLine;
    } else if (currentSection) {
      currentContent.push(trimmedLine);
    } else {
      if (!sections.length) {
        sections.push({
          title: `${brandName} Cars`,
          content: trimmedLine
        });
      }
    }
  }
  if (currentSection && currentContent.length > 0) {
    sections.push({
      title: currentSection,
      content: currentContent.join(" ").trim()
    });
  }
  return { sections, priceInfo };
}
var uploadDir2 = path4.join(process.cwd(), "uploads");
if (!fs4.existsSync(uploadDir2)) {
  fs4.mkdirSync(uploadDir2, { recursive: true });
}
var upload3 = multer3({
  storage: multer3.diskStorage({
    destination: uploadDir2,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path4.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    if (req.path === "/api/upload/logo") {
      if (file.mimetype === "image/png") {
        cb(null, true);
      } else {
        cb(new Error("Only PNG files are allowed for brand logos"));
      }
    } else {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed"));
      }
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB limit
  }
});
function registerRoutes(app2, storage2, backupService) {
  console.log("\u{1F510} Registering authentication routes...");
  const triggerBackup = async (type) => {
    if (backupService) {
      try {
        switch (type) {
          case "brands":
            await backupService.backupBrands();
            break;
          case "models":
            await backupService.backupModels();
            break;
          case "variants":
            await backupService.backupVariants();
            break;
          case "comparisons":
            await backupService.backupPopularComparisons();
            break;
          case "all":
            await backupService.backupAll();
            break;
        }
      } catch (error) {
        console.error(`\u26A0\uFE0F  Backup failed for ${type}:`, error);
      }
    }
  };
  app2.get("/api/uploads/diagnostics", authenticateToken, modifyLimiter, async (req, res) => {
    try {
      const bucket = process.env.R2_BUCKET;
      const accountId2 = process.env.R2_ACCOUNT_ID;
      const endpoint = process.env.R2_ENDPOINT || (accountId2 ? `https://${accountId2}.r2.cloudflarestorage.com` : void 0);
      const publicBase = process.env.R2_PUBLIC_BASE_URL || (endpoint && bucket ? `${endpoint}/${bucket}` : "");
      const hasCredentials = !!(process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY);
      const summary = {
        configured: !!(bucket && endpoint && hasCredentials),
        bucket: bucket || null,
        endpoint: endpoint || null,
        publicBase: publicBase || null,
        hasCredentials
      };
      if (!summary.configured) {
        return res.json(summary);
      }
      const client2 = new S3Client3({
        region: process.env.R2_REGION || "auto",
        endpoint,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
        },
        forcePathStyle: true
      });
      try {
        await client2.send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 1 }));
        summary.r2Ok = true;
      } catch (error) {
        summary.r2Ok = false;
        summary.error = error?.message || String(error);
      }
      return res.json(summary);
    } catch (error) {
      return res.status(500).json({ error: "Diagnostics failed" });
    }
  });
  const buildPublicAssetUrl = (assetPath, req) => {
    if (!assetPath) return null;
    if (assetPath.startsWith("http://") || assetPath.startsWith("https://")) {
      return assetPath;
    }
    const normalized = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
    const publicBase = process.env.R2_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL || (process.env.R2_PUBLIC_BASE_HOST ? `https://${process.env.R2_PUBLIC_BASE_HOST}` : "");
    if (publicBase) {
      return `${publicBase.replace(/\/$/, "")}${normalized}`;
    }
    const backendOrigin = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;
    return `${(backendOrigin || "").replace(/\/$/, "")}${normalized}`;
  };
  app2.post("/api/auth/login", authLimiter, async (req, res) => {
    console.log("\u{1F4DD} Login attempt:", req.body.email);
    try {
      const { email, password } = req.body;
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
      const user = await storage2.getAdminUser(email);
      if (!user) {
        return res.status(401).json({
          error: "Invalid email or password",
          code: "INVALID_CREDENTIALS"
        });
      }
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: "Invalid email or password",
          code: "INVALID_CREDENTIALS"
        });
      }
      const existingSession = await storage2.getActiveSession(user.id);
      if (existingSession) {
        await storage2.invalidateSession(user.id);
        console.log("\u26A0\uFE0F  Previous session invalidated for:", user.email);
      }
      await storage2.updateAdminUserLogin(user.id);
      const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      });
      const refreshToken = generateRefreshToken(user.id);
      await storage2.createSession(user.id, accessToken);
      const isProd2 = process.env.NODE_ENV === "production";
      const sameSitePolicy = isProd2 && process.env.FRONTEND_URL ? "none" : "strict";
      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: isProd2,
        sameSite: sameSitePolicy,
        maxAge: 24 * 60 * 60 * 1e3
        // 24 hours
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd2,
        sameSite: sameSitePolicy,
        maxAge: 7 * 24 * 60 * 60 * 1e3
        // 7 days
      });
      res.json({
        success: true,
        user: sanitizeUser(user),
        token: accessToken,
        refreshToken
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        error: "Internal server error",
        code: "SERVER_ERROR"
      });
    }
  });
  app2.post("/api/auth/logout", authenticateToken, async (req, res) => {
    try {
      if (req.user) {
        await storage2.invalidateSession(req.user.id);
        console.log("\u{1F44B} User logged out:", req.user.email);
      }
      res.clearCookie("token");
      res.clearCookie("refreshToken");
      res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.clearCookie("token");
      res.clearCookie("refreshToken");
      res.json({ success: true, message: "Logged out successfully" });
    }
  });
  app2.post("/api/bulk/brands", ipWhitelist, bulkLimiter, authenticateToken, async (req, res) => {
    try {
      console.log("\u{1F4E6} Starting bulk brand import...");
      const { brands } = req.body;
      if (!Array.isArray(brands)) {
        return res.status(400).json({ error: "Brands must be an array" });
      }
      const results = [];
      let successCount = 0;
      let errorCount = 0;
      for (const brandData of brands) {
        try {
          const validatedData = insertBrandSchema.parse(brandData);
          const brand = await storage2.createBrand(validatedData);
          results.push({ success: true, brand: brand.name, id: brand.id });
          successCount++;
          console.log(`\u2705 Created brand: ${brand.name}`);
        } catch (error) {
          console.error(`\u274C Failed to create brand ${brandData.name}:`, error);
          const errMsg = error instanceof Error ? error.message : String(error);
          results.push({ success: false, brand: brandData.name, error: errMsg });
          errorCount++;
        }
      }
      console.log(`\u{1F4CA} Bulk brand import completed: ${successCount} success, ${errorCount} errors`);
      await triggerBackup("brands");
      res.json({
        success: true,
        summary: { total: brands.length, success: successCount, errors: errorCount },
        results
      });
    } catch (error) {
      console.error("\u274C Bulk brand import error:", error);
      res.status(500).json({ error: "Failed to import brands" });
    }
  });
  app2.post("/api/bulk/variants", ipWhitelist, bulkLimiter, authenticateToken, async (req, res) => {
    try {
      console.log("\u{1F4E6} Starting bulk variant import...");
      const { variants } = req.body;
      if (!Array.isArray(variants)) {
        return res.status(400).json({ error: "Variants must be an array" });
      }
      const results = [];
      let successCount = 0;
      let errorCount = 0;
      for (const variantData of variants) {
        try {
          const variant = await storage2.createVariant(variantData);
          results.push({ success: true, variant: variant.name, id: variant.id, model: variant.modelId });
          successCount++;
          console.log(`\u2705 Created variant: ${variant.name} (${variant.modelId})`);
        } catch (error) {
          console.error(`\u274C Failed to create variant ${variantData.name}:`, error);
          const errMsg = error instanceof Error ? error.message : String(error);
          results.push({ success: false, variant: variantData.name, error: errMsg });
          errorCount++;
        }
      }
      console.log(`\u{1F4CA} Bulk variant import completed: ${successCount} success, ${errorCount} errors`);
      await triggerBackup("variants");
      res.json({
        success: true,
        summary: { total: variants.length, success: successCount, errors: errorCount },
        results
      });
    } catch (error) {
      console.error("\u274C Bulk variant import error:", error);
      res.status(500).json({ error: "Failed to import variants" });
    }
  });
  app2.post("/api/bulk/models", ipWhitelist, bulkLimiter, authenticateToken, async (req, res) => {
    try {
      console.log("\u{1F4E6} Starting bulk model import...");
      const { models } = req.body;
      if (!Array.isArray(models)) {
        return res.status(400).json({ error: "Models must be an array" });
      }
      const results = [];
      let successCount = 0;
      let errorCount = 0;
      for (const modelData of models) {
        try {
          const validatedData = insertModelSchema.parse(modelData);
          const model = await storage2.createModel(validatedData);
          results.push({ success: true, model: model.name, id: model.id, brand: model.brandId });
          successCount++;
          console.log(`\u2705 Created model: ${model.name} (${model.brandId})`);
        } catch (error) {
          console.error(`\u274C Failed to create model ${modelData.name}:`, error);
          const errMsg = error instanceof Error ? error.message : String(error);
          results.push({ success: false, model: modelData.name, error: errMsg });
          errorCount++;
        }
      }
      console.log(`\u{1F4CA} Bulk model import completed: ${successCount} success, ${errorCount} errors`);
      await triggerBackup("models");
      res.json({
        success: true,
        summary: { total: models.length, success: successCount, errors: errorCount },
        results
      });
    } catch (error) {
      console.error("\u274C Bulk model import error:", error);
      res.status(500).json({ error: "Failed to import models" });
    }
  });
  app2.post("/api/cleanup/clear-models", ipWhitelist, authenticateToken, modifyLimiter, async (req, res) => {
    try {
      console.log("\u{1F9F9} Starting models cleanup...");
      const variants = await storage2.getVariants();
      let deletedVariants = 0;
      for (const variant of variants) {
        await storage2.deleteVariant(variant.id);
        deletedVariants++;
      }
      const models = await storage2.getModels();
      let deletedModels = 0;
      for (const model of models) {
        await storage2.deleteModel(model.id);
        deletedModels++;
      }
      console.log(`\u2705 Models cleanup completed: ${deletedModels} models, ${deletedVariants} variants deleted`);
      await triggerBackup("models");
      res.json({
        success: true,
        deleted: { models: deletedModels, variants: deletedVariants },
        message: `Models cleared: ${deletedModels} models, ${deletedVariants} variants`
      });
    } catch (error) {
      console.error("\u274C Models cleanup error:", error);
      res.status(500).json({ error: "Failed to clear models" });
    }
  });
  app2.post("/api/cleanup/clear-all", ipWhitelist, authenticateToken, modifyLimiter, async (req, res) => {
    try {
      console.log("\u{1F9F9} Starting complete database cleanup...");
      const variants = await storage2.getVariants();
      let deletedVariants = 0;
      for (const variant of variants) {
        const success = await storage2.deleteVariant(variant.id);
        if (success) deletedVariants++;
      }
      const models = await storage2.getModels();
      let deletedModels = 0;
      for (const model of models) {
        const success = await storage2.deleteModel(model.id);
        if (success) deletedModels++;
      }
      const brands = await storage2.getBrands();
      let deletedBrands = 0;
      for (const brand of brands) {
        const success = await storage2.deleteBrand(brand.id);
        if (success) deletedBrands++;
      }
      console.log(`\u2705 Cleanup completed: ${deletedBrands} brands, ${deletedModels} models, ${deletedVariants} variants deleted`);
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
      console.error("\u274C Clear all error:", error);
      res.status(500).json({ error: "Failed to clear database" });
    }
  });
  app2.post("/api/cleanup/orphaned-data", ipWhitelist, authenticateToken, modifyLimiter, async (req, res) => {
    try {
      console.log("\u{1F9F9} Starting orphaned data cleanup...");
      const brands = await storage2.getBrands();
      const models = await storage2.getModels();
      const variants = await storage2.getVariants();
      const brandIds = brands.map((b) => b.id);
      const modelIds = models.map((m) => m.id);
      const orphanedModels = models.filter((m) => !brandIds.includes(m.brandId));
      const orphanedVariants = variants.filter(
        (v) => !modelIds.includes(v.modelId) || !brandIds.includes(v.brandId)
      );
      console.log(`\u{1F4CA} Found ${orphanedModels.length} orphaned models, ${orphanedVariants.length} orphaned variants`);
      let deletedModels = 0;
      let deletedVariants = 0;
      for (const model of orphanedModels) {
        console.log(`\u{1F5D1}\uFE0F Deleting orphaned model: ${model.name} (${model.id})`);
        const success = await storage2.deleteModel(model.id);
        if (success) deletedModels++;
      }
      for (const variant of orphanedVariants) {
        console.log(`\u{1F5D1}\uFE0F Deleting orphaned variant: ${variant.name} (${variant.id})`);
        const success = await storage2.deleteVariant(variant.id);
        if (success) deletedVariants++;
      }
      console.log(`\u2705 Cleanup completed: ${deletedModels} models, ${deletedVariants} variants deleted`);
      res.json({
        success: true,
        deleted: {
          models: deletedModels,
          variants: deletedVariants
        },
        message: `Cleaned up ${deletedModels} orphaned models and ${deletedVariants} orphaned variants`
      });
    } catch (error) {
      console.error("\u274C Cleanup error:", error);
      res.status(500).json({ error: "Failed to cleanup orphaned data" });
    }
  });
  app2.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
      if (process.env.AUTH_BYPASS === "true") {
        return res.json({
          success: true,
          user: {
            id: req.user?.id || "dev-admin",
            email: req.user?.email || "dev@local",
            name: req.user?.name || "Developer",
            role: req.user?.role || "super_admin"
          }
        });
      }
      if (!req.user) {
        return res.status(401).json({
          error: "Not authenticated",
          code: "NOT_AUTHENTICATED"
        });
      }
      const user = await storage2.getAdminUserById(req.user.id);
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
      console.error("Get user error:", error);
      res.status(500).json({
        error: "Internal server error",
        code: "SERVER_ERROR"
      });
    }
  });
  app2.post("/api/auth/change-password", authenticateToken, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: "Current password and new password are required",
          code: "MISSING_FIELDS"
        });
      }
      const passwordValidation = isStrongPassword(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          error: "Password does not meet requirements",
          code: "WEAK_PASSWORD",
          details: passwordValidation.errors
        });
      }
      const user = await storage2.getAdminUserById(req.user.id);
      if (!user) {
        return res.status(404).json({
          error: "User not found",
          code: "USER_NOT_FOUND"
        });
      }
      const isValid = await comparePassword(currentPassword, user.password);
      if (!isValid) {
        return res.status(401).json({
          error: "Current password is incorrect",
          code: "INVALID_PASSWORD"
        });
      }
      const hashedPassword = await hashPassword(newPassword);
      res.json({
        success: true,
        message: "Password changed successfully"
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        error: "Internal server error",
        code: "SERVER_ERROR"
      });
    }
  });
  app2.post(
    "/api/upload/logo",
    authenticateToken,
    modifyLimiter,
    upload3.single("logo"),
    validateFileUpload,
    imageProcessingConfigs.logo,
    async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const processedImages = req.processedImages || [];
      const compressionInfo = processedImages.length > 0 ? {
        originalSize: processedImages[0].originalSize,
        compressedSize: processedImages[0].compressedSize,
        compressionRatio: processedImages[0].compressionRatio,
        format: processedImages[0].format
      } : null;
      let fileUrl = `/uploads/${req.file.filename}`;
      const bucket = process.env.R2_BUCKET;
      const requireR2 = process.env.REQUIRE_R2 === "true" || process.env.NODE_ENV === "production";
      if (bucket) {
        const accountId2 = process.env.R2_ACCOUNT_ID;
        const endpoint = process.env.R2_ENDPOINT || (accountId2 ? `https://${accountId2}.r2.cloudflarestorage.com` : void 0);
        try {
          const client2 = new S3Client3({
            region: process.env.R2_REGION || "auto",
            endpoint,
            credentials: process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY ? {
              accessKeyId: process.env.R2_ACCESS_KEY_ID,
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
            } : void 0,
            forcePathStyle: true
          });
          const now = /* @__PURE__ */ new Date();
          const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
          const key = `uploads/logos/${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}/${randomUUID4()}-${safeName.replace(/\.(jpg|jpeg|png)$/i, ".webp")}`;
          const body = readFileSync2(req.file.path);
          const metadata = {
            "original-name": req.file.originalname,
            "upload-date": now.toISOString()
          };
          if (compressionInfo) {
            if (typeof compressionInfo.originalSize === "number") {
              metadata["original-size"] = compressionInfo.originalSize.toString();
            }
            if (typeof compressionInfo.compressedSize === "number") {
              metadata["compressed-size"] = compressionInfo.compressedSize.toString();
            }
            if (typeof compressionInfo.compressionRatio === "number") {
              metadata["compression-ratio"] = compressionInfo.compressionRatio.toString();
            }
          }
          await client2.send(new PutObjectCommand3({
            Bucket: bucket,
            Key: key,
            Body: body,
            ContentType: "image/webp",
            CacheControl: "public, max-age=31536000, immutable",
            Metadata: metadata
          }));
          const publicBase = process.env.R2_PUBLIC_BASE_URL || (endpoint ? `${endpoint}/${bucket}` : "");
          if (publicBase) {
            fileUrl = `${publicBase}/${key}`;
          } else {
            throw new Error("R2_PUBLIC_BASE_URL not configured - cannot generate public URL");
          }
          fs4.unlinkSync(req.file.path);
          console.log(`\u2705 Logo uploaded to R2 successfully: ${fileUrl}`);
        } catch (error) {
          console.error("\u274C R2 logo upload failed:", {
            error: error instanceof Error ? error.message : String(error),
            bucket,
            endpoint,
            hasCredentials: !!(process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY)
          });
          console.error("\u{1F4CB} Full error details:", error);
          if (requireR2) {
            const message = error instanceof Error ? error.message : String(error);
            return res.status(500).json({
              error: "Cloud storage upload failed. Logo not saved.",
              details: message,
              suggestion: "Please check R2 configuration or try again later."
            });
          }
          console.warn("\u26A0\uFE0F  Logo upload falling back to local storage (will be lost on restart!)");
        }
      } else {
        if (requireR2) {
          return res.status(500).json({
            error: "Cloud storage not configured. Cannot upload logo.",
            suggestion: "Please configure R2_BUCKET and related environment variables."
          });
        }
        console.warn("\u26A0\uFE0F  R2 not configured for logo upload, using local storage (files will be lost on restart!)");
      }
      res.json({
        url: fileUrl,
        processed: true,
        format: "webp",
        compression: compressionInfo,
        storage: fileUrl.startsWith("http") ? "r2" : "local"
      });
    }
  );
  app2.post(
    "/api/upload/image",
    authenticateToken,
    modifyLimiter,
    upload3.single("image"),
    validateFileUpload,
    imageProcessingConfigs.gallery,
    async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }
      const processedImages = req.processedImages || [];
      const compressionInfo = processedImages.length > 0 ? {
        originalSize: processedImages[0].originalSize,
        webpSize: processedImages[0].webpSize,
        compressionRatio: processedImages[0].compressionRatio
      } : null;
      let fileUrl = `/uploads/${req.file.filename}`;
      const bucket = process.env.R2_BUCKET;
      if (bucket) {
        const accountId2 = process.env.R2_ACCOUNT_ID;
        const endpoint = process.env.R2_ENDPOINT || (accountId2 ? `https://${accountId2}.r2.cloudflarestorage.com` : void 0);
        try {
          const client2 = new S3Client3({
            region: process.env.R2_REGION || "auto",
            endpoint,
            credentials: process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY ? {
              accessKeyId: process.env.R2_ACCESS_KEY_ID,
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
            } : void 0,
            forcePathStyle: true
          });
          const now = /* @__PURE__ */ new Date();
          const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
          const key = `uploads/images/${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}/${randomUUID4()}-${safeName.replace(/\.(jpg|jpeg|png)$/i, ".webp")}`;
          const body = readFileSync2(req.file.path);
          await client2.send(new PutObjectCommand3({
            Bucket: bucket,
            Key: key,
            Body: body,
            ContentType: req.file.mimetype || "image/webp",
            CacheControl: "public, max-age=31536000, immutable",
            Metadata: {
              "original-name": req.file.originalname,
              "upload-date": (/* @__PURE__ */ new Date()).toISOString(),
              ...compressionInfo && {
                "original-size": compressionInfo.originalSize.toString(),
                "webp-size": compressionInfo.webpSize.toString(),
                "compression-ratio": compressionInfo.compressionRatio.toString()
              }
            }
          }));
          const publicBase = process.env.R2_PUBLIC_BASE_URL || (endpoint ? `${endpoint}/${bucket}` : "");
          if (publicBase) {
            fileUrl = `${publicBase}/${key}`;
          }
          fs4.unlinkSync(req.file.path);
          console.log(`\u2705 Image uploaded to R2 (server-side): ${fileUrl}`);
        } catch (error) {
          console.error("\u274C R2 image upload failed:", {
            error: error.message,
            bucket,
            endpoint,
            hasCredentials: !!(process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY)
          });
          console.error("\u{1F4CB} Full error details:", error);
          if (process.env.REQUIRE_R2 === "true") {
            return res.status(500).json({ error: "Cloud storage unavailable. Please try again later." });
          }
          console.warn(`\u26A0\uFE0F  Using local fallback URL: ${fileUrl} (will be lost on restart!)`);
        }
      } else {
        console.warn("\u26A0\uFE0F  R2 not configured, using local storage (files will be lost on restart!)");
      }
      res.json({
        url: fileUrl,
        filename: req.file.filename,
        processed: true,
        format: "webp",
        compression: compressionInfo
      });
    }
  );
  app2.use("/uploads", express9.static(uploadDir2));
  app2.post("/api/uploads/presign", authenticateToken, modifyLimiter, async (req, res) => {
    try {
      const { filename, contentType } = req.body;
      if (!filename || !contentType) {
        return res.status(400).json({ error: "filename and contentType are required" });
      }
      const bucket = process.env.R2_BUCKET;
      if (!bucket) {
        return res.status(500).json({ error: "R2 bucket not configured" });
      }
      const accountId2 = process.env.R2_ACCOUNT_ID;
      const endpoint = process.env.R2_ENDPOINT || (accountId2 ? `https://${accountId2}.r2.cloudflarestorage.com` : void 0);
      const client2 = new S3Client3({
        region: process.env.R2_REGION || "auto",
        endpoint,
        credentials: process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY ? {
          accessKeyId: process.env.R2_ACCESS_KEY_ID,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
        } : void 0,
        forcePathStyle: true
      });
      const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
      const now = /* @__PURE__ */ new Date();
      const key = `uploads/${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}/${randomUUID4()}-${safeName}`;
      const cmd = new PutObjectCommand3({
        Bucket: bucket,
        Key: key,
        ContentType: contentType
      });
      const uploadUrl = await getSignedUrl(client2, cmd, { expiresIn: 600 });
      const publicBase = process.env.R2_PUBLIC_BASE_URL || `${endpoint}/${bucket}`;
      const publicUrl = `${publicBase}/${key}`;
      return res.json({ uploadUrl, publicUrl, key });
    } catch (error) {
      console.error("presign error:", error);
      return res.status(500).json({ error: "Failed to generate presigned URL" });
    }
  });
  app2.delete("/api/uploads/object", authenticateToken, modifyLimiter, async (req, res) => {
    try {
      const { key, url } = req.body;
      if (!key && !url) {
        return res.status(400).json({ error: "key or url is required" });
      }
      const bucket = process.env.R2_BUCKET;
      if (!bucket) {
        return res.status(500).json({ error: "R2 bucket not configured" });
      }
      const accountId2 = process.env.R2_ACCOUNT_ID;
      const endpoint = process.env.R2_ENDPOINT || (accountId2 ? `https://${accountId2}.r2.cloudflarestorage.com` : void 0);
      const client2 = new S3Client3({
        region: process.env.R2_REGION || "auto",
        endpoint,
        credentials: process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY ? {
          accessKeyId: process.env.R2_ACCESS_KEY_ID,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
        } : void 0,
        forcePathStyle: true
      });
      let objectKey = key;
      if (!objectKey && url) {
        const publicBase = process.env.R2_PUBLIC_BASE_URL || "";
        if (publicBase && url.startsWith(publicBase)) {
          objectKey = url.slice(publicBase.length).replace(/^\//, "");
        } else if (endpoint) {
          const apiBase = `${endpoint}/${bucket}/`;
          if (url.startsWith(apiBase)) {
            objectKey = url.slice(apiBase.length);
          }
        }
      }
      if (!objectKey) {
        return res.status(400).json({ error: "Unable to derive object key from url" });
      }
      await client2.send(new DeleteObjectCommand({ Bucket: bucket, Key: objectKey }));
      return res.json({ success: true, key: objectKey });
    } catch (error) {
      console.error("delete object error:", error);
      return res.status(500).json({ error: "Failed to delete object" });
    }
  });
  app2.get("/api/stats", redisCacheMiddleware(CacheTTL.STATS), async (req, res) => {
    const stats = await storage2.getStats();
    res.json(stats);
  });
  app2.get("/api/brands", publicLimiter, redisCacheMiddleware(CacheTTL.BRANDS), async (req, res) => {
    try {
      res.set("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400");
      const includeInactive = req.query.includeInactive === "true";
      const brands = await storage2.getBrands(includeInactive);
      const transformed = brands.map((brand) => ({
        ...brand,
        logo: buildPublicAssetUrl(brand.logo, req)
      }));
      res.json(transformed);
    } catch (error) {
      console.error("Error getting brands:", error);
      res.status(500).json({ error: "Failed to get brands" });
    }
  });
  app2.get("/api/brands/available-rankings", redisCacheMiddleware(CacheTTL.STATS), async (req, res) => {
    const excludeBrandId = req.query.excludeBrandId;
    const availableRankings = await storage2.getAvailableRankings(excludeBrandId);
    res.json(availableRankings);
  });
  app2.get("/api/brands/:id/formatted", redisCacheMiddleware(CacheTTL.BRANDS), async (req, res) => {
    try {
      const brand = await storage2.getBrand(req.params.id);
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }
      const formattedSummary = formatBrandSummary(brand.summary || "", brand.name);
      res.json({
        ...brand,
        logo: buildPublicAssetUrl(brand.logo, req),
        formattedSummary
      });
    } catch (error) {
      console.error("Error getting formatted brand:", error);
      res.status(500).json({ error: "Failed to get formatted brand" });
    }
  });
  app2.get("/api/brands/:id", redisCacheMiddleware(CacheTTL.BRANDS), async (req, res) => {
    const brand = await storage2.getBrand(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.json({
      ...brand,
      logo: buildPublicAssetUrl(brand.logo, req)
    });
  });
  app2.post("/api/brands", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log("Received brand data:", JSON.stringify(req.body, null, 2));
      const validatedData = insertBrandSchema.parse(req.body);
      console.log("Validated data:", JSON.stringify(validatedData, null, 2));
      const brand = await storage2.createBrand(validatedData);
      await triggerBackup("brands");
      await invalidateRedisCache("/api/brands");
      res.status(201).json({
        ...brand,
        logo: buildPublicAssetUrl(brand.logo, req)
      });
    } catch (error) {
      console.error("Brand creation error:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid brand data" });
      }
    }
  });
  app2.patch("/api/brands/:id", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      const brandId = req.params.id;
      const updateData = req.body;
      if (updateData.status) {
        const newStatus = updateData.status;
        console.log(`\u{1F504} Changing brand ${brandId} status to ${newStatus} - cascading to models and variants`);
        const mongoose8 = (await import("mongoose")).default;
        const db = mongoose8.connection.db;
        if (db) {
          const modelsResult = await db.collection("models").updateMany(
            { brandId },
            { $set: { status: newStatus, updatedAt: /* @__PURE__ */ new Date() } }
          );
          const variantsResult = await db.collection("variants").updateMany(
            { brandId },
            { $set: { status: newStatus, updatedAt: /* @__PURE__ */ new Date() } }
          );
          console.log(`\u2705 Status cascade complete: ${modelsResult.modifiedCount} models and ${variantsResult.modifiedCount} variants updated to ${newStatus}`);
        }
      }
      const brand = await storage2.updateBrand(brandId, updateData);
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }
      await triggerBackup("brands");
      await invalidateRedisCache("/api/brands");
      await invalidateRedisCache("/api/models");
      await invalidateRedisCache("/api/variants");
      invalidateSearchIndex().catch((err) => console.error("Search index invalidation failed:", err));
      res.json({
        ...brand,
        logo: buildPublicAssetUrl(brand.logo, req)
      });
    } catch (error) {
      console.error("Brand update error:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Failed to update brand" });
      }
    }
  });
  app2.delete("/api/brands/:id", authenticateToken, modifyLimiter, async (req, res) => {
    try {
      console.log(`\u{1F5D1}\uFE0F DELETE request for brand: ${req.params.id}`);
      const success = await storage2.deleteBrand(req.params.id);
      if (!success) {
        console.log(`\u274C Brand not found: ${req.params.id}`);
        return res.status(404).json({ error: "Brand not found" });
      }
      console.log(`\u2705 Brand deleted successfully: ${req.params.id}`);
      await triggerBackup("brands");
      await invalidateRedisCache("/api/brands");
      res.status(204).send();
    } catch (error) {
      console.error(`\u274C Error deleting brand ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete brand" });
    }
  });
  app2.get("/api/models", publicLimiter, redisCacheMiddleware(CacheTTL.MODELS), async (req, res) => {
    res.set("Cache-Control", "public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600");
    const brandId = req.query.brandId;
    const fields = req.query.fields;
    const includeInactive = req.query.includeInactive === "true";
    const allModels = await storage2.getModels(brandId, includeInactive);
    if (fields) {
      const fieldList = fields.split(",").map((f) => f.trim());
      const projectedModels = allModels.map((m) => {
        const projected = {};
        const modelAny = m;
        fieldList.forEach((field) => {
          if (modelAny.hasOwnProperty(field)) {
            projected[field] = modelAny[field];
          }
        });
        return projected;
      });
      return res.json(projectedModels);
    }
    res.json(allModels);
  });
  app2.get("/api/models-with-pricing", publicLimiter, redisCacheMiddleware(CacheTTL.MODELS), async (req, res) => {
    try {
      const brandId = req.query.brandId;
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 20, 250);
      const skip = (page - 1) * limit;
      const mongoose8 = (await import("mongoose")).default;
      const db = mongoose8.connection.db;
      if (!db) {
        throw new Error("Database connection not established");
      }
      const totalCount = await db.collection("models").countDocuments(
        brandId ? { brandId, status: "active" } : { status: "active" }
      );
      const modelsWithPricing = await db.collection("models").aggregate([
        // Filter by brandId if provided
        ...brandId ? [{ $match: { brandId, status: "active" } }] : [{ $match: { status: "active" } }],
        // Pagination: Skip and Limit
        { $skip: skip },
        { $limit: limit },
        // Lookup variants and calculate pricing in one operation
        {
          $lookup: {
            from: "variants",
            localField: "id",
            foreignField: "modelId",
            pipeline: [
              { $match: { status: "active" } },
              {
                $group: {
                  _id: null,
                  lowestPrice: { $min: "$price" },
                  count: { $sum: 1 }
                }
              }
            ],
            as: "pricing"
          }
        },
        // Add pricing fields to model document
        {
          $addFields: {
            lowestPrice: {
              $ifNull: [{ $arrayElemAt: ["$pricing.lowestPrice", 0] }, 0]
            },
            variantCount: {
              $ifNull: [{ $arrayElemAt: ["$pricing.count", 0] }, 0]
            }
          }
        },
        // Project only necessary fields to reduce payload size
        {
          $project: {
            _id: 0,
            id: 1,
            name: 1,
            brandId: 1,
            heroImage: 1,
            lowestPrice: 1,
            variantCount: 1,
            fuelTypes: 1,
            transmissions: 1,
            seating: 1,
            launchDate: 1,
            isNew: 1,
            isPopular: 1,
            status: 1,
            popularRank: 1,
            newRank: 1,
            topRank: 1,
            bodyType: 1
          }
        }
      ]).toArray();
      res.json({
        data: modelsWithPricing,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasMore: skip + limit < totalCount
        }
      });
    } catch (error) {
      console.error("Error getting models with pricing:", error);
      res.status(500).json({ error: "Failed to get models with pricing" });
    }
  });
  setTimeout(() => {
    buildSearchIndex().catch(
      (err) => console.error("\u274C Failed to build initial search index:", err)
    );
  }, 5e3);
  app2.get("/api/search", publicLimiter, async (req, res) => {
    try {
      const startTime = Date.now();
      const query = (req.query.q || "").trim();
      const limit = Math.min(parseInt(req.query.limit) || 20, 50);
      if (!query || query.length < 2) {
        return res.json({ results: [], count: 0, took: 0, source: "none" });
      }
      const indexResult = await searchFromIndex(query, limit);
      if (indexResult && indexResult.results.length > 0) {
        const took2 = Date.now() - startTime;
        return res.json({
          results: indexResult.results,
          count: indexResult.results.length,
          took: took2,
          query,
          source: indexResult.source,
          indexAge: indexResult.indexAge
        });
      }
      console.log(`\u26A0\uFE0F Search index miss for "${query}", falling back to MongoDB`);
      const mongoose8 = (await import("mongoose")).default;
      const db = mongoose8.connection.db;
      if (!db) {
        throw new Error("Database connection not established");
      }
      const searchRegex = new RegExp(query.split(" ").join(".*"), "i");
      const [models, brands] = await Promise.all([
        db.collection("models").find({
          $or: [
            { name: searchRegex },
            { brandId: searchRegex }
          ],
          status: "active"
        }, {
          projection: {
            _id: 0,
            id: 1,
            name: 1,
            brandId: 1,
            heroImage: 1,
            slug: 1
          }
        }).limit(limit).toArray(),
        db.collection("brands").find({}, {
          projection: { _id: 0, id: 1, name: 1 }
        }).toArray()
      ]);
      const brandMap = brands.reduce((acc, brand) => {
        acc[brand.id] = brand.name;
        return acc;
      }, {});
      const results = models.map((model) => {
        const brandName = brandMap[model.brandId] || "Unknown";
        const brandSlug = brandName.toLowerCase().replace(/\s+/g, "-");
        const modelSlug = model.name.toLowerCase().replace(/\s+/g, "-");
        return {
          id: model.id,
          name: model.name,
          brandName,
          brandSlug,
          modelSlug,
          slug: `${brandSlug}-${modelSlug}`,
          heroImage: model.heroImage || ""
        };
      });
      const took = Date.now() - startTime;
      res.json({
        results,
        count: results.length,
        took,
        query,
        source: "mongodb"
      });
    } catch (error) {
      console.error("Error in search:", error);
      res.status(500).json({ error: "Search failed" });
    }
  });
  app2.get("/api/search/stats", async (req, res) => {
    const stats = getSearchIndexStats();
    res.json(stats);
  });
  app2.get("/api/cars-by-budget/:budget", publicLimiter, redisCacheMiddleware(CacheTTL.MODELS), async (req, res) => {
    try {
      const startTime = Date.now();
      const budget = req.query.budget || req.params.budget;
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 50, 100);
      const skip = (page - 1) * limit;
      res.set("Cache-Control", "public, max-age=300, s-maxage=300, stale-while-revalidate=600");
      const budgetRanges = {
        "under-5-lakh": { min: 0, max: 5e5, label: "Under \u20B95 Lakh" },
        "under-8-lakh": { min: 0, max: 8e5, label: "Under \u20B98 Lakh" },
        "under-8": { min: 0, max: 8e5, label: "Under \u20B98 Lakh" },
        "under-10": { min: 0, max: 1e6, label: "Under \u20B910 Lakh" },
        "under-15": { min: 0, max: 15e5, label: "Under \u20B915 Lakh" },
        "under-20": { min: 0, max: 2e6, label: "Under \u20B920 Lakh" },
        "under-25": { min: 0, max: 25e5, label: "Under \u20B925 Lakh" },
        "under-30": { min: 0, max: 3e6, label: "Under \u20B930 Lakh" },
        "under-40": { min: 0, max: 4e6, label: "Under \u20B940 Lakh" },
        "under-50": { min: 0, max: 5e6, label: "Under \u20B950 Lakh" },
        "under-60": { min: 0, max: 6e6, label: "Under \u20B960 Lakh" },
        "under-80": { min: 0, max: 8e6, label: "Under \u20B980 Lakh" },
        "under-100": { min: 0, max: 1e7, label: "Under \u20B91 Crore" },
        "above-50": { min: 5000001, max: 999999999, label: "Above \u20B950 Lakh" },
        "above-100": { min: 10000001, max: 999999999, label: "Above \u20B91 Crore" }
      };
      const currentBudget = budgetRanges[budget] || budgetRanges["under-8"];
      const mongoose8 = (await import("mongoose")).default;
      const db = mongoose8.connection.db;
      if (!db) {
        throw new Error("Database connection not established");
      }
      const brands = await db.collection("brands").find({}, {
        projection: { _id: 0, id: 1, name: 1 }
      }).toArray();
      const brandMap = brands.reduce((acc, brand) => {
        acc[brand.id] = brand.name;
        return acc;
      }, {});
      const pipeline = [
        { $match: { status: "active" } },
        // Lookup variants to get pricing
        {
          $lookup: {
            from: "variants",
            localField: "id",
            foreignField: "modelId",
            pipeline: [
              { $match: { status: "active" } },
              {
                $group: {
                  _id: null,
                  lowestPrice: { $min: "$price" },
                  fuelTypes: { $addToSet: "$fuel" },
                  transmissions: { $addToSet: "$transmission" },
                  count: { $sum: 1 }
                }
              }
            ],
            as: "variantData"
          }
        },
        // Add computed fields
        {
          $addFields: {
            startingPrice: {
              $ifNull: [{ $arrayElemAt: ["$variantData.lowestPrice", 0] }, 0]
            },
            variantCount: {
              $ifNull: [{ $arrayElemAt: ["$variantData.count", 0] }, 0]
            },
            fuelTypes: {
              $ifNull: [{ $arrayElemAt: ["$variantData.fuelTypes", 0] }, []]
            },
            transmissions: {
              $ifNull: [{ $arrayElemAt: ["$variantData.transmissions", 0] }, []]
            }
          }
        },
        // Filter by budget range
        {
          $match: {
            startingPrice: {
              $gte: currentBudget.min,
              $lte: currentBudget.max
            }
          }
        },
        // Sort by price (ascending)
        { $sort: { startingPrice: 1 } }
      ];
      const countPipeline = [...pipeline, { $count: "total" }];
      const countResult = await db.collection("models").aggregate(countPipeline).toArray();
      const totalCount = countResult.length > 0 ? countResult[0].total : 0;
      const resultsPipeline = [
        ...pipeline,
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            variantData: 0,
            _id: 0
          }
        }
      ];
      const cars = await db.collection("models").aggregate(resultsPipeline).toArray();
      const processedCars = cars.map((car) => {
        const brandName = brandMap[car.brandId] || "Unknown";
        const brandSlug = brandName.toLowerCase().replace(/\s+/g, "-");
        const modelSlug = car.name.toLowerCase().replace(/\s+/g, "-");
        const backendUrl2 = process.env.BACKEND_URL || "http://localhost:5001";
        const heroImage = car.heroImage ? car.heroImage.startsWith("http") ? car.heroImage : `${backendUrl2}${car.heroImage}` : "";
        return {
          id: car.id,
          name: car.name,
          brand: car.brandId,
          brandId: car.brandId,
          brandName,
          image: heroImage,
          startingPrice: car.startingPrice || 0,
          fuelTypes: car.fuelTypes && car.fuelTypes.length > 0 ? car.fuelTypes : ["Petrol"],
          transmissions: car.transmissions && car.transmissions.length > 0 ? car.transmissions : ["Manual"],
          seating: car.seating || 5,
          launchDate: car.launchDate || "",
          slug: `${brandSlug}-${modelSlug}`,
          isNew: car.isNew || false,
          isPopular: car.isPopular || false,
          rating: 0,
          reviews: 0,
          variants: car.variantCount || 0
        };
      });
      const took = Date.now() - startTime;
      res.json({
        data: processedCars,
        budget: {
          slug: budget,
          label: currentBudget.label,
          min: currentBudget.min,
          max: currentBudget.max
        },
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasMore: skip + limit < totalCount
        },
        performance: {
          took,
          cached: false
        }
      });
    } catch (error) {
      console.error("Error in cars-by-budget:", error);
      res.status(500).json({ error: "Failed to get cars by budget" });
    }
  });
  app2.get("/api/compare/:slug", publicLimiter, redisCacheMiddleware(CacheTTL.MODELS), async (req, res) => {
    try {
      const startTime = Date.now();
      const slug = req.params.slug;
      res.set("Cache-Control", "public, max-age=600, s-maxage=600, stale-while-revalidate=1200");
      const parts = slug.split("-vs-");
      if (parts.length < 2) {
        return res.status(400).json({ error: "Invalid comparison slug. Format: model1-vs-model2" });
      }
      const mongoose8 = (await import("mongoose")).default;
      const db = mongoose8.connection.db;
      if (!db) {
        throw new Error("Database connection not established");
      }
      const brands = await db.collection("brands").find({}, {
        projection: { _id: 0, id: 1, name: 1 }
      }).toArray();
      const brandMap = brands.reduce((acc, brand) => {
        acc[brand.id] = brand.name;
        return acc;
      }, {});
      const models = await db.collection("models").find(
        { status: "active" },
        { projection: { _id: 0 } }
      ).toArray();
      const findModelBySlug = (targetSlug) => {
        return models.find((m) => {
          const brandName = brandMap[m.brandId] || "";
          const modelSlug = `${brandName.toLowerCase().replace(/\s+/g, "-")}-${m.name.toLowerCase().replace(/\s+/g, "-")}`;
          return modelSlug === targetSlug;
        });
      };
      const comparisonModels = [];
      const modelIds = [];
      for (const part of parts) {
        const model = findModelBySlug(part);
        if (model) {
          comparisonModels.push(model);
          modelIds.push(model.id);
        }
      }
      if (comparisonModels.length < 2) {
        return res.status(404).json({ error: "One or more comparison models not found" });
      }
      const variants = await db.collection("variants").find({
        modelId: { $in: modelIds },
        status: "active"
      }, {
        projection: { _id: 0 }
      }).toArray();
      const variantsByModel = {};
      modelIds.forEach((id) => {
        variantsByModel[id] = [];
      });
      variants.forEach((v) => {
        if (variantsByModel[v.modelId]) {
          variantsByModel[v.modelId].push(v);
        }
      });
      const backendUrl2 = process.env.BACKEND_URL || "http://localhost:5001";
      const comparisonData = comparisonModels.map((model) => {
        const modelVariants = variantsByModel[model.id] || [];
        const lowestVariant = modelVariants.length > 0 ? modelVariants.reduce(
          (prev, curr) => curr.price < prev.price && curr.price > 0 ? curr : prev
        ) : null;
        const heroImage = model.heroImage ? model.heroImage.startsWith("http") ? model.heroImage : `${backendUrl2}${model.heroImage}` : "";
        return {
          model: {
            id: model.id,
            name: model.name,
            brandId: model.brandId,
            brandName: brandMap[model.brandId] || "Unknown",
            heroImage,
            slug: `${(brandMap[model.brandId] || "").toLowerCase().replace(/\s+/g, "-")}-${model.name.toLowerCase().replace(/\s+/g, "-")}`,
            isNew: model.isNew || false,
            isPopular: model.isPopular || false
          },
          variants: modelVariants,
          lowestVariant: lowestVariant || (modelVariants.length > 0 ? modelVariants[0] : null)
        };
      });
      const avgPrice = comparisonData.reduce((sum, item) => {
        return sum + (item.lowestVariant?.price || 0);
      }, 0) / comparisonData.length;
      const priceMin = avgPrice * 0.7;
      const priceMax = avgPrice * 1.3;
      const bodyTypes = comparisonModels.map((m) => m.bodyType).filter(Boolean);
      const subBodyTypes = comparisonModels.map((m) => m.subBodyType).filter(Boolean);
      const similarCars = await db.collection("models").aggregate([
        {
          $match: {
            status: "active",
            id: { $nin: modelIds },
            // Match if bodyType or subBodyType matches ANY of the compared cars
            $or: [
              { bodyType: { $in: bodyTypes } },
              { subBodyType: { $in: subBodyTypes } }
            ]
          }
        },
        {
          $lookup: {
            from: "variants",
            localField: "id",
            foreignField: "modelId",
            pipeline: [
              { $match: { status: "active" } },
              {
                $group: {
                  _id: null,
                  lowestPrice: { $min: "$price" },
                  lowestPriceFuelType: { $first: "$fuel" }
                }
              }
            ],
            as: "pricing"
          }
        },
        {
          $addFields: {
            startingPrice: {
              $ifNull: [{ $arrayElemAt: ["$pricing.lowestPrice", 0] }, 0]
            },
            lowestPriceFuelType: {
              $ifNull: [{ $arrayElemAt: ["$pricing.lowestPriceFuelType", 0] }, "Petrol"]
            }
          }
        },
        // Filter by price range (±30% of average)
        {
          $match: {
            startingPrice: {
              $gte: priceMin,
              $lte: priceMax,
              $gt: 0
            }
          }
        },
        // Sort by popularity and new launches
        { $sort: { isPopular: -1, isNew: -1, popularRank: 1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            pricing: 0
          }
        }
      ]).toArray();
      const similarCarsFormatted = similarCars.map((car) => {
        const brandName = brandMap[car.brandId] || "Unknown";
        const heroImage = car.heroImage ? car.heroImage.startsWith("http") ? car.heroImage : `${backendUrl2}${car.heroImage}` : "";
        return {
          id: car.id,
          name: car.name,
          brand: car.brandId,
          brandName,
          image: heroImage,
          startingPrice: car.startingPrice || 0,
          lowestPriceFuelType: car.lowestPriceFuelType || "Petrol",
          fuelTypes: car.fuelTypes || ["Petrol"],
          transmissions: car.transmissions || ["Manual"],
          seating: car.seating || 5,
          launchDate: car.launchDate || (/* @__PURE__ */ new Date()).toISOString(),
          slug: `${brandName.toLowerCase().replace(/\s+/g, "-")}-${car.name.toLowerCase().replace(/\s+/g, "-")}`,
          isNew: car.isNew || false,
          isPopular: car.isPopular || false,
          bodyType: car.bodyType,
          subBodyType: car.subBodyType
        };
      });
      const took = Date.now() - startTime;
      res.json({
        slug,
        comparison: comparisonData,
        similarCars: similarCarsFormatted,
        brands,
        performance: {
          took,
          cached: false
        }
      });
    } catch (error) {
      console.error("Error in compare endpoint:", error);
      res.status(500).json({ error: "Failed to get comparison data" });
    }
  });
  app2.get(
    "/api/models/:id",
    redisCacheMiddleware(CacheTTL.MODEL_DETAILS),
    // ✅ 1-hour cache
    async (req, res) => {
      res.set("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400");
      const model = await storage2.getModel(req.params.id);
      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }
      res.json(model);
    }
  );
  app2.post("/api/models", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log("Received model data:", JSON.stringify(req.body, null, 2));
      const validatedData = insertModelSchema.parse(req.body);
      console.log("Validated data:", JSON.stringify(validatedData, null, 2));
      const model = await storage2.createModel(validatedData);
      await invalidateRedisCache("/api/models");
      await invalidateRedisCache("/api/models-with-pricing");
      invalidateSearchIndex().catch((err) => console.error("Search index invalidation failed:", err));
      if (process.env.EMAIL_SCHEDULER_ENABLED === "true") {
        Promise.resolve().then(() => (init_email_scheduler_service(), email_scheduler_service_exports)).then(({ emailScheduler: emailScheduler2 }) => {
          storage2.getBrand(validatedData.brandId).then((brand) => {
            const modelWithBrand = {
              ...model,
              brandName: brand?.name || "Unknown",
              startingPrice: req.body.price || 0
            };
            emailScheduler2.sendNewLaunchAlert(modelWithBrand).catch((err) => {
              console.error("Failed to send new launch alert:", err);
            });
          });
        }).catch((err) => {
          console.error("Failed to load email scheduler:", err);
        });
      }
      res.status(201).json(model);
    } catch (error) {
      console.error("Model creation error:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid model data" });
      }
    }
  });
  app2.put("/api/models/:id", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log("\u{1F504} PUT - Updating model:", req.params.id);
      console.log("\u{1F4CA} Update data received:", JSON.stringify(req.body, null, 2));
      const model = await storage2.updateModel(req.params.id, req.body);
      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }
      console.log("\u2705 Model updated successfully via PUT");
      await invalidateRedisCache("/api/models");
      await invalidateRedisCache("/api/models-with-pricing");
      console.log("\u{1F5D1}\uFE0F Models cache invalidated");
      invalidateSearchIndex().catch((err) => console.error("Search index invalidation failed:", err));
      res.json(model);
    } catch (error) {
      console.error("\u274C Model PUT update error:", error);
      res.status(500).json({ error: "Failed to update model" });
    }
  });
  app2.patch("/api/models/:id", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log("\u{1F504} PATCH - Updating model:", req.params.id);
      console.log("\u{1F4CA} Update data received:", JSON.stringify(req.body, null, 2));
      console.log("\u{1F3A8} Color Images in request:", req.body.colorImages);
      console.log("\u{1F3A8} Color Images length:", req.body.colorImages?.length || 0);
      const model = await storage2.updateModel(req.params.id, req.body);
      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }
      console.log("\u2705 Model updated successfully via PATCH");
      console.log("\u{1F4CA} Updated model image data:");
      console.log("- Hero Image:", model.heroImage);
      console.log("- Gallery Images:", model.galleryImages?.length || 0, "images");
      console.log("- Key Feature Images:", model.keyFeatureImages?.length || 0, "images");
      console.log("- Space Comfort Images:", model.spaceComfortImages?.length || 0, "images");
      console.log("- Storage Convenience Images:", model.storageConvenienceImages?.length || 0, "images");
      console.log("- Color Images:", model.colorImages?.length || 0, "images");
      console.log("\u{1F3A8} Color Images saved:", JSON.stringify(model.colorImages, null, 2));
      await invalidateRedisCache("/api/models");
      console.log("\u{1F5D1}\uFE0F Models cache invalidated");
      invalidateSearchIndex().catch((err) => console.error("Search index invalidation failed:", err));
      res.json(model);
    } catch (error) {
      console.error("\u274C Model PATCH update error:", error);
      res.status(500).json({ error: "Failed to update model" });
    }
  });
  app2.delete("/api/models/:id", authenticateToken, modifyLimiter, async (req, res) => {
    try {
      console.log(`\u{1F5D1}\uFE0F DELETE request for model: ${req.params.id}`);
      const success = await storage2.deleteModel(req.params.id);
      if (!success) {
        console.log(`\u274C Model not found: ${req.params.id}`);
        return res.status(404).json({ error: "Model not found" });
      }
      console.log(`\u2705 Model deleted successfully: ${req.params.id}`);
      await triggerBackup("models");
      invalidateSearchIndex().catch((err) => console.error("Search index invalidation failed:", err));
      res.status(204).send();
    } catch (error) {
      console.error(`\u274C Error deleting model ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete model" });
    }
  });
  app2.get("/api/upcoming-cars", publicLimiter, redisCacheMiddleware(CacheTTL.MODELS), async (req, res) => {
    try {
      res.set("Cache-Control", "public, max-age=900, s-maxage=900, stale-while-revalidate=1800");
      const brandId = req.query.brandId;
      const upcomingCars = await storage2.getUpcomingCars(brandId);
      res.json(upcomingCars);
    } catch (error) {
      console.error("Get upcoming cars error:", error);
      res.status(500).json({ error: "Failed to fetch upcoming cars" });
    }
  });
  app2.get(
    "/api/upcoming-cars/:id",
    redisCacheMiddleware(CacheTTL.MODEL_DETAILS),
    async (req, res) => {
      res.set("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400");
      const upcomingCar = await storage2.getUpcomingCar(req.params.id);
      if (!upcomingCar) {
        return res.status(404).json({ error: "Upcoming car not found" });
      }
      res.json(upcomingCar);
    }
  );
  app2.post("/api/upcoming-cars", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log("Received upcoming car data:", JSON.stringify(req.body, null, 2));
      const { insertUpcomingCarSchema: insertUpcomingCarSchema2 } = await Promise.resolve().then(() => (init_schemas(), schemas_exports));
      const validatedData = insertUpcomingCarSchema2.parse(req.body);
      console.log("Validated data:", JSON.stringify(validatedData, null, 2));
      const upcomingCar = await storage2.createUpcomingCar(validatedData);
      await invalidateRedisCache("v2:upcoming-cars");
      res.status(201).json(upcomingCar);
    } catch (error) {
      console.error("Upcoming car creation error:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid upcoming car data" });
      }
    }
  });
  app2.put("/api/upcoming-cars/:id", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log("\u{1F504} PUT - Updating upcoming car:", req.params.id);
      console.log("\u{1F4CA} Update data received:", JSON.stringify(req.body, null, 2));
      const upcomingCar = await storage2.updateUpcomingCar(req.params.id, req.body);
      if (!upcomingCar) {
        return res.status(404).json({ error: "Upcoming car not found" });
      }
      console.log("\u2705 Upcoming car updated successfully via PUT");
      await invalidateRedisCache("v2:upcoming-cars");
      console.log("\u{1F5D1}\uFE0F Upcoming cars cache invalidated");
      res.json(upcomingCar);
    } catch (error) {
      console.error("\u274C Upcoming car PUT update error:", error);
      res.status(500).json({ error: "Failed to update upcoming car" });
    }
  });
  app2.patch("/api/upcoming-cars/:id", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log("\u{1F504} PATCH - Updating upcoming car:", req.params.id);
      console.log("\u{1F4CA} Update data received:", JSON.stringify(req.body, null, 2));
      const upcomingCar = await storage2.updateUpcomingCar(req.params.id, req.body);
      if (!upcomingCar) {
        return res.status(404).json({ error: "Upcoming car not found" });
      }
      console.log("\u2705 Upcoming car updated successfully via PATCH");
      await invalidateRedisCache("v2:upcoming-cars");
      console.log("\u{1F5D1}\uFE0F Upcoming cars cache invalidated");
      res.json(upcomingCar);
    } catch (error) {
      console.error("\u274C Upcoming car PATCH update error:", error);
      res.status(500).json({ error: "Failed to update upcoming car" });
    }
  });
  app2.delete("/api/upcoming-cars/:id", authenticateToken, modifyLimiter, async (req, res) => {
    try {
      console.log(`\u{1F5D1}\uFE0F DELETE request for upcoming car: ${req.params.id}`);
      const success = await storage2.deleteUpcomingCar(req.params.id);
      if (!success) {
        console.log(`\u274C Upcoming car not found: ${req.params.id}`);
        return res.status(404).json({ error: "Upcoming car not found" });
      }
      console.log(`\u2705 Upcoming car deleted successfully: ${req.params.id}`);
      await invalidateRedisCache("v2:upcoming-cars");
      await triggerBackup("upcoming-cars");
      res.status(204).send();
    } catch (error) {
      console.error(`\u274C Error deleting upcoming car ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete upcoming car" });
    }
  });
  app2.get("/api/cars/popular", publicLimiter, redisCacheMiddleware(CacheTTL.POPULAR_CARS), async (req, res) => {
    try {
      res.set("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400");
      const limit = parseInt(req.query.limit) || 20;
      const mongoose8 = (await import("mongoose")).default;
      const db = mongoose8.connection.db;
      if (!db) {
        throw new Error("Database connection not established");
      }
      const brands = await storage2.getBrands();
      const brandMap = new Map(brands.map((b) => [b.id, b.name]));
      const popularCarsWithPricing = await db.collection("models").aggregate([
        // Filter for popular cars only
        { $match: { isPopular: true, status: "active" } },
        // Sort by popularRank
        { $sort: { popularRank: 1 } },
        // Limit results
        { $limit: limit },
        // Lookup variants and calculate pricing in one operation
        {
          $lookup: {
            from: "variants",
            localField: "id",
            foreignField: "modelId",
            pipeline: [
              { $match: { status: "active" } },
              { $sort: { price: 1 } },
              // Sort by price ascending
              {
                $group: {
                  _id: null,
                  lowestPrice: { $min: "$price" },
                  lowestPriceFuelType: { $first: "$fuel" },
                  // Get fuel type of cheapest variant
                  count: { $sum: 1 }
                }
              }
            ],
            as: "pricing"
          }
        },
        // Add pricing fields to model document
        {
          $addFields: {
            lowestPrice: {
              $ifNull: [{ $arrayElemAt: ["$pricing.lowestPrice", 0] }, 0]
            },
            lowestPriceFuelType: {
              $ifNull: [{ $arrayElemAt: ["$pricing.lowestPriceFuelType", 0] }, "Petrol"]
            },
            variantCount: {
              $ifNull: [{ $arrayElemAt: ["$pricing.count", 0] }, 0]
            }
          }
        },
        // Remove the pricing array (no longer needed)
        {
          $project: {
            pricing: 0,
            _id: 0
          }
        }
      ]).toArray();
      const enrichedModels = popularCarsWithPricing.map((model) => {
        const brand = brands.find((b) => b.id === model.brandId);
        const fuelTypes = model.fuelTypes && model.fuelTypes.length > 0 ? model.fuelTypes : ["Petrol"];
        const transmissions = model.transmissions && model.transmissions.length > 0 ? model.transmissions : ["Manual"];
        return {
          id: model.id,
          name: model.name,
          brand: brand?.name || "Unknown",
          brandName: brand?.name || "Unknown",
          image: model.heroImage || "/placeholder-car.jpg",
          startingPrice: model.lowestPrice || 0,
          lowestPriceFuelType: model.lowestPriceFuelType || "Petrol",
          fuelTypes,
          transmissions,
          seating: 5,
          launchDate: model.launchDate || (/* @__PURE__ */ new Date()).toISOString(),
          // Use model's database slug if available, otherwise generate from name
          slug: model.slug || model.name.toLowerCase().replace(/\s+/g, "-"),
          isNew: model.isNew || false,
          isPopular: model.isPopular || false,
          popularRank: model.popularRank || null,
          newRank: model.newRank || null
        };
      });
      res.json(enrichedModels);
    } catch (error) {
      console.error("Get popular cars error:", error);
      res.status(500).json({ error: "Failed to fetch popular cars" });
    }
  });
  app2.get("/api/cars/:id", publicLimiter, redisCacheMiddleware(CacheTTL.CAR_DETAILS), async (req, res) => {
    try {
      const id = req.params.id;
      let model = await storage2.getModel(id);
      if (!model) {
        const allModels = await storage2.getModels();
        const brands = await storage2.getBrands();
        const brandMap = new Map(brands.map((b) => [b.id, b.name]));
        model = allModels.find((m) => {
          if (m.id === id) return true;
          const brandName = brandMap.get(m.brandId);
          if (!brandName) return false;
          const slug = `${brandName.toLowerCase().replace(/\s+/g, "-")}-${m.name.toLowerCase().replace(/\s+/g, "-")}`;
          return slug === id;
        });
      }
      if (!model) {
        return res.status(404).json({ error: "Car not found" });
      }
      const brand = await storage2.getBrand(model.brandId);
      const variants = await storage2.getVariants(model.id);
      const lowestPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.price || 0)) : 0;
      const fuelTypes = Array.from(new Set(variants.map((v) => v.fuelType).filter(Boolean)));
      const transmissions = Array.from(new Set(variants.map((v) => v.transmission).filter(Boolean)));
      const carData = {
        id: model.id,
        name: model.name,
        brand: brand?.name || "Unknown",
        brandName: brand?.name || "Unknown",
        image: model.heroImage || "/placeholder-car.jpg",
        startingPrice: lowestPrice,
        fuelTypes: fuelTypes.length > 0 ? fuelTypes : ["Petrol"],
        transmissions: transmissions.length > 0 ? transmissions : ["Manual"],
        seating: 5,
        // Default
        launchDate: model.launchDate || (/* @__PURE__ */ new Date()).toISOString(),
        slug: model.id,
        // Use ID as slug
        isNew: model.isNew || false,
        isPopular: model.isPopular || false
      };
      res.json(carData);
    } catch (error) {
      console.error(`Error fetching car ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch car details" });
    }
  });
  app2.get("/api/variants", publicLimiter, redisCacheMiddleware(CacheTTL.VARIANTS), async (req, res) => {
    res.set("Cache-Control", "public, max-age=900, s-maxage=900, stale-while-revalidate=1800");
    const modelId = req.query.modelId;
    const brandId = req.query.brandId;
    const fields = req.query.fields;
    try {
      let allVariants = await storage2.getVariants(modelId);
      if (brandId) {
        const models = await storage2.getModels(brandId);
        const modelIds = new Set(models.map((m) => m.id));
        allVariants = allVariants.filter((v) => modelIds.has(v.modelId));
      }
      if (fields) {
        if (fields === "minimal") {
          const minimalVariants = allVariants.map((v) => ({
            id: v.id,
            name: v.name,
            price: v.price,
            fuelType: v.fuelType,
            fuel: v.fuel,
            transmission: v.transmission,
            modelId: v.modelId,
            keyFeatures: v.keyFeatures,
            headerSummary: v.headerSummary,
            power: v.power,
            maxPower: v.maxPower,
            enginePower: v.enginePower,
            isValueForMoney: v.isValueForMoney,
            mileage: v.mileageCompanyClaimed,
            mileageCompanyClaimed: v.mileageCompanyClaimed,
            // Comfort & Convenience
            ventilatedSeats: v.ventilatedSeats,
            sunroof: v.sunroof,
            airPurifier: v.airPurifier,
            headsUpDisplay: v.headsUpDisplay,
            cruiseControl: v.cruiseControl,
            rainSensingWipers: v.rainSensingWipers,
            automaticHeadlamp: v.automaticHeadlamp,
            followMeHomeHeadlights: v.followMeHomeHeadlights,
            keylessEntry: v.keylessEntry,
            ignition: v.ignition,
            ambientLighting: v.ambientLighting,
            steeringAdjustment: v.steeringAdjustment,
            airConditioning: v.airConditioning,
            climateZones: v.climateZones,
            rearACVents: v.rearACVents,
            frontArmrest: v.frontArmrest,
            rearArmrest: v.rearArmrest,
            insideRearViewMirror: v.insideRearViewMirror,
            outsideRearViewMirrors: v.outsideRearViewMirrors,
            steeringMountedControls: v.steeringMountedControls,
            rearWindshieldDefogger: v.rearWindshieldDefogger,
            frontWindshieldDefogger: v.frontWindshieldDefogger,
            cooledGlovebox: v.cooledGlovebox,
            // Safety Features
            globalNCAPRating: v.globalNCAPRating,
            airbags: v.airbags,
            airbagsLocation: v.airbagsLocation,
            adasLevel: v.adasLevel,
            adasFeatures: v.adasFeatures,
            reverseCamera: v.reverseCamera,
            reverseCameraGuidelines: v.reverseCameraGuidelines,
            tyrePressureMonitor: v.tyrePressureMonitor,
            hillHoldAssist: v.hillHoldAssist,
            hillDescentControl: v.hillDescentControl,
            rollOverMitigation: v.rollOverMitigation,
            parkingSensor: v.parkingSensor,
            discBrakes: v.discBrakes,
            electronicStabilityProgram: v.electronicStabilityProgram,
            abs: v.abs,
            ebd: v.ebd,
            brakeAssist: v.brakeAssist,
            isofixMounts: v.isofixMounts,
            seatbeltWarning: v.seatbeltWarning,
            speedAlertSystem: v.speedAlertSystem,
            speedSensingDoorLocks: v.speedSensingDoorLocks,
            immobiliser: v.immobiliser,
            // Entertainment & Connectivity
            touchScreenInfotainment: v.touchScreenInfotainment,
            androidAppleCarplay: v.androidAppleCarplay,
            speakers: v.speakers,
            tweeters: v.tweeters,
            subwoofers: v.subwoofers,
            usbCChargingPorts: v.usbCChargingPorts,
            usbAChargingPorts: v.usbAChargingPorts,
            twelvevChargingPorts: v.twelvevChargingPorts,
            wirelessCharging: v.wirelessCharging,
            connectedCarTech: v.connectedCarTech,
            // Engine Data
            engineName: v.engineName,
            engineSummary: v.engineSummary,
            engineTransmission: v.engineTransmission,
            engineTorque: v.engineTorque,
            engineSpeed: v.engineSpeed,
            torque: v.torque,
            // Mileage
            mileageEngineName: v.mileageEngineName,
            mileageCityRealWorld: v.mileageCityRealWorld,
            mileageHighwayRealWorld: v.mileageHighwayRealWorld,
            // Other
            highlightImages: v.highlightImages,
            description: v.description,
            exteriorDesign: v.exteriorDesign,
            comfortConvenience: v.comfortConvenience
          }));
          return res.json(minimalVariants);
        } else {
          const fieldList = fields.split(",").map((f) => f.trim());
          const projectedVariants = allVariants.map((v) => {
            const projected = {};
            const variantAny = v;
            fieldList.forEach((field) => {
              if (variantAny.hasOwnProperty(field)) {
                projected[field] = variantAny[field];
              }
            });
            return projected;
          });
          return res.json(projectedVariants);
        }
      }
      res.json(allVariants);
    } catch (error) {
      console.error("Error fetching variants:", error);
      res.status(500).json({ error: "Failed to fetch variants" });
    }
  });
  app2.get("/api/variants/:id", redisCacheMiddleware(CacheTTL.VARIANTS), async (req, res) => {
    const variant = await storage2.getVariant(req.params.id);
    if (!variant) {
      return res.status(404).json({ error: "Variant not found" });
    }
    res.json(variant);
  });
  app2.post("/api/variants", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log("\u{1F697} Received variant data:", JSON.stringify(req.body, null, 2));
      if (!req.body.brandId || !req.body.modelId || !req.body.name || !req.body.price) {
        console.error("\u274C Missing required fields:", {
          brandId: !!req.body.brandId,
          modelId: !!req.body.modelId,
          name: !!req.body.name,
          price: !!req.body.price
        });
        return res.status(400).json({
          error: "Missing required fields: brandId, modelId, name, and price are required"
        });
      }
      const variant = await storage2.createVariant(req.body);
      console.log("\u2705 Variant created successfully:", variant.id);
      await invalidateRedisCache("/api/variants");
      res.status(201).json(variant);
    } catch (error) {
      console.error("\u274C Variant creation error:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message, stack: error.stack });
      } else {
        res.status(400).json({ error: "Invalid variant data" });
      }
    }
  });
  app2.patch("/api/variants/:id", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log("\u{1F504} Updating variant:", req.params.id);
      console.log("\u{1F4CA} Update data received:", JSON.stringify(req.body, null, 2));
      const oldVariant = await storage2.getVariant(req.params.id);
      const variant = await storage2.updateVariant(req.params.id, req.body);
      if (!variant) {
        return res.status(404).json({ error: "Variant not found" });
      }
      console.log("\u2705 Variant updated successfully");
      if (oldVariant && req.body.price && oldVariant.price !== req.body.price) {
        console.log(`\u{1F4B0} Price change detected: ${oldVariant.price} \u2192 ${req.body.price}`);
        if (process.env.EMAIL_SCHEDULER_ENABLED === "true") {
          Promise.resolve().then(() => (init_price_monitoring_service(), price_monitoring_service_exports)).then(async ({ priceMonitoringService: priceMonitoringService2 }) => {
            try {
              const model = await storage2.getModel(variant.modelId);
              const brand = model ? await storage2.getBrand(model.brandId) : null;
              await priceMonitoringService2.recordPriceChange({
                variantId: variant.id,
                modelId: variant.modelId,
                brandId: variant.brandId,
                variantName: variant.name,
                modelName: model?.name || "Unknown",
                brandName: brand?.name || "Unknown",
                previousPrice: oldVariant.price,
                newPrice: req.body.price
              });
            } catch (error) {
              console.error("Failed to record price change:", error);
            }
          }).catch((err) => {
            console.error("Failed to load price monitoring service:", err);
          });
        }
      }
      invalidateRedisCache("/api/variants");
      res.json(variant);
    } catch (error) {
      console.error("\u274C Variant update error:", error);
      res.status(500).json({ error: "Failed to update variant" });
    }
  });
  app2.delete("/api/variants/:id", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log("\u{1F5D1}\uFE0F DELETE request for variant ID:", req.params.id);
      const success = await storage2.deleteVariant(req.params.id);
      if (!success) {
        console.log("\u274C Variant not found or delete failed");
        return res.status(404).json({ error: "Variant not found" });
      }
      console.log("\u2705 Variant deleted successfully, invalidating cache...");
      invalidateRedisCache("/api/variants");
      res.status(204).send();
    } catch (error) {
      console.error("\u274C Delete variant route error:", error);
      res.status(500).json({ error: "Failed to delete variant" });
    }
  });
  app2.get(
    "/api/frontend/brands/:brandId/models",
    redisCacheMiddleware(CacheTTL.BRAND_MODELS),
    // ✅ 30-minute cache
    async (req, res) => {
      try {
        const { brandId } = req.params;
        console.log("\u{1F697} Frontend: Getting models for brand:", brandId);
        const models = await storage2.getModels(brandId);
        const brand = await storage2.getBrand(brandId);
        if (!brand) {
          return res.status(404).json({ error: "Brand not found" });
        }
        const ratingsAggregation = await Review.aggregate([
          { $match: { brandSlug: brand.name.toLowerCase().replace(/\s+/g, "-"), isApproved: true } },
          {
            $group: {
              _id: "$modelSlug",
              avgRating: { $avg: "$overallRating" },
              count: { $sum: 1 }
            }
          }
        ]);
        const ratingsMap = ratingsAggregation.reduce((acc, curr) => {
          acc[curr._id] = {
            rating: Number(curr.avgRating.toFixed(1)),
            count: curr.count
          };
          return acc;
        }, {});
        const frontendModels = models.map((model) => {
          const slug = model.name.toLowerCase().replace(/\s+/g, "-");
          const ratingData = ratingsMap[slug] || { rating: 0, count: 0 };
          return {
            id: model.id,
            name: model.name,
            price: "\u20B97.71",
            // Will be calculated later
            rating: ratingData.rating,
            reviews: ratingData.count,
            reviewCount: ratingData.count,
            // Added for frontend compatibility
            power: "89 bhp",
            // Will be from engine data
            image: model.heroImage || "/cars/default-car.jpg",
            isNew: model.isNew || false,
            seating: "5 seater",
            // Will be from specifications
            fuelType: model.fuelTypes?.join("-") || "Petrol",
            transmission: model.transmissions?.join("-") || "Manual",
            mileage: "18.3 kmpl",
            // Will be from mileage data
            variants: 16,
            // Will be calculated from variants
            slug,
            brandName: brand.name
          };
        });
        console.log("\u2705 Frontend: Returning", frontendModels.length, "models for brand", brand.name);
        res.json({
          brand: {
            id: brand.id,
            name: brand.name,
            slug: brand.name.toLowerCase().replace(/\s+/g, "-")
          },
          models: frontendModels
        });
      } catch (error) {
        console.error("\u274C Frontend models error:", error);
        res.status(500).json({ error: "Failed to fetch models" });
      }
    }
  );
  app2.get("/api/frontend/models/:slug", redisCacheMiddleware(CacheTTL.MODEL_DETAILS), async (req, res) => {
    try {
      const { slug } = req.params;
      console.log("\u{1F697} Frontend: Getting model by slug:", slug);
      const models = await storage2.getModels();
      const model = models.find(
        (m) => m.name.toLowerCase().replace(/\s+/g, "-") === slug
      );
      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }
      const brand = await storage2.getBrand(model.brandId);
      const frontendModel = {
        id: model.id,
        name: model.name,
        brandName: brand?.name || "Unknown",
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
      console.log("\u2705 Frontend: Returning model details for", model.name);
      res.json(frontendModel);
    } catch (error) {
      console.error("\u274C Frontend model error:", error);
      res.status(500).json({ error: "Failed to fetch model" });
    }
  });
  app2.get("/api/popular-comparisons", redisCacheMiddleware(CacheTTL.COMPARISONS), async (req, res) => {
    try {
      res.set("Cache-Control", "public, max-age=7200, s-maxage=7200, stale-while-revalidate=86400");
      const comparisons = await storage2.getPopularComparisons();
      res.json(comparisons);
    } catch (error) {
      console.error("Error fetching popular comparisons:", error);
      res.status(500).json({ error: "Failed to fetch popular comparisons" });
    }
  });
  app2.post("/api/popular-comparisons", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      const comparisons = req.body;
      if (!Array.isArray(comparisons)) {
        return res.status(400).json({ error: "Expected array of comparisons" });
      }
      const savedComparisons = await storage2.savePopularComparisons(comparisons);
      res.json({
        success: true,
        count: savedComparisons.length,
        comparisons: savedComparisons
      });
    } catch (error) {
      console.error("Error saving popular comparisons:", error);
      res.status(500).json({ error: "Failed to save popular comparisons" });
    }
  });
  app2.use("/api/news", news_default);
  app2.post("/api/ai-chat", publicLimiter, aiChatHandler);
  app2.use("/api/quirky-bit", publicLimiter, quirky_bit_default);
  app2.use("/api/ai-feedback", publicLimiter, ai_feedback_default);
  app2.use("/api/youtube", publicLimiter, createYouTubeRoutes(storage2));
  app2.use("/api/admin/articles", admin_articles_default);
  app2.use("/api/admin/categories", admin_categories_default);
  app2.use("/api/admin/tags", admin_tags_default);
  app2.use("/api/admin/authors", admin_authors_default);
  app2.use("/api/admin/media", admin_media_default);
  app2.use("/api/admin/reviews", admin_reviews_default);
  app2.use("/api/admin/emails", admin_emails_routes_default);
  app2.use("/api/price-history", publicLimiter, price_history_routes_default);
  app2.use("/api/reviews", publicLimiter, reviews_default);
  app2.use("/api/admin/analytics", admin_analytics_default);
  app2.use("/api/admin", authLimiter, admin_auth_default);
  app2.get("/api/compare/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      console.log(`\u{1F50D} Compare API: Processing slug "${slug}"`);
      const parts = slug.split("-vs-");
      if (parts.length < 2) {
        return res.status(400).json({ error: 'Invalid comparison slug format. Use "car1-vs-car2"' });
      }
      const comparisonData = [];
      for (const carSlug of parts) {
        const allModels = await storage2.getModels();
        const allBrands = await storage2.getBrands();
        let foundModel = null;
        let foundBrand = null;
        for (const model of allModels) {
          const modelSlug = model.name.toLowerCase().replace(/\s+/g, "-");
          const brand = allBrands.find((b) => b.id === model.brandId);
          if (!brand) continue;
          const brandSlug = brand.name.toLowerCase().replace(/\s+/g, "-");
          const constructedSlug = `${brandSlug}-${modelSlug}`;
          if (constructedSlug === carSlug) {
            foundModel = model;
            foundBrand = brand;
            break;
          }
        }
        if (foundModel && foundBrand) {
          const variants = await storage2.getVariants(foundModel.id);
          const baseVariant = variants.reduce(
            (prev, curr) => curr.price < prev.price && curr.price > 0 ? curr : prev,
            variants[0]
          );
          comparisonData.push({
            model: {
              ...foundModel,
              brandName: foundBrand.name,
              variants
              // Include all variants for dropdown switching
            },
            variant: baseVariant
          });
        }
      }
      if (comparisonData.length === 0) {
        return res.status(404).json({ error: "No valid cars found for comparison" });
      }
      res.json(comparisonData);
    } catch (error) {
      console.error("Compare API Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  app2.use("/api/admin/humanize", admin_humanize_default);
}

// server/vite.ts
import express10 from "express";
import fs5 from "fs";
import path5 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath as fileURLToPath2 } from "url";
import { dirname, resolve } from "path";
var __dirname3 = dirname(fileURLToPath2(import.meta.url));
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname3, "client", "src"),
      "@shared": resolve(__dirname3, "shared"),
      "@assets": resolve(__dirname3, "attached_assets")
    }
  },
  root: resolve(__dirname3, "client"),
  build: {
    outDir: resolve(__dirname3, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    if (url.startsWith("/api") || url.startsWith("/uploads")) {
      return next();
    }
    try {
      const clientTemplate = path5.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs5.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path5.resolve(import.meta.dirname, "public");
  if (!fs5.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express10.static(distPath));
  app2.use("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/uploads")) {
      return next();
    }
    res.sendFile(path5.resolve(distPath, "index.html"));
  });
}

// server/db/mongodb-storage.ts
init_schemas2();
function mapBrand(doc) {
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
function mapModel(doc) {
  return {
    id: doc.id,
    brandId: doc.brandId,
    name: doc.name,
    isPopular: doc.isPopular || false,
    isNew: doc.isNew || false,
    popularRank: doc.popularRank || null,
    newRank: doc.newRank || null,
    topRank: doc.topRank || null,
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
function mapUpcomingCar(doc) {
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
    expectedLaunchDate: doc.expectedLaunchDate || null,
    expectedPriceMin: doc.expectedPriceMin || null,
    expectedPriceMax: doc.expectedPriceMax || null,
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
    summary: doc.summary || null,
    engineSummaries: doc.engineSummaries || [],
    mileageData: doc.mileageData || [],
    faqs: doc.faqs || [],
    heroImage: doc.heroImage || null,
    galleryImages: doc.galleryImages || [],
    keyFeatureImages: doc.keyFeatureImages || [],
    spaceComfortImages: doc.spaceComfortImages || [],
    storageConvenienceImages: doc.storageConvenienceImages || [],
    colorImages: doc.colorImages || [],
    createdAt: doc.createdAt
  };
}
function mapVariant(doc) {
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
    fuelType: doc.fuelType || doc.fuel || null,
    transmission: doc.transmission || null,
    fuel: doc.fuel || doc.fuelType || null,
    // Use enginePower/engineTorque as fallbacks for power/maxPower/torque
    power: doc.power || doc.maxPower || doc.enginePower || null,
    maxPower: doc.maxPower || doc.power || doc.enginePower || null,
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
    torque: doc.torque || doc.engineTorque || null,
    // Mileage
    mileageEngineName: doc.mileageEngineName || null,
    mileageCompanyClaimed: doc.mileageCompanyClaimed || null,
    mileageCityRealWorld: doc.mileageCityRealWorld || null,
    mileageHighwayRealWorld: doc.mileageHighwayRealWorld || null,
    // Page 4 - Engine & Transmission (Additional fields)
    engineNamePage4: doc.engineNamePage4 || null,
    engineCapacity: doc.engineCapacity || null,
    noOfGears: doc.noOfGears || null,
    paddleShifter: doc.paddleShifter || null,
    zeroTo100KmphTime: doc.zeroTo100KmphTime || null,
    topSpeed: doc.topSpeed || null,
    evBatteryCapacity: doc.evBatteryCapacity || null,
    hybridBatteryCapacity: doc.hybridBatteryCapacity || null,
    batteryType: doc.batteryType || null,
    electricMotorPlacement: doc.electricMotorPlacement || null,
    evRange: doc.evRange || null,
    evChargingTime: doc.evChargingTime || null,
    maxElectricMotorPower: doc.maxElectricMotorPower || null,
    turboCharged: doc.turboCharged || null,
    hybridType: doc.hybridType || null,
    driveTrain: doc.driveTrain || null,
    drivingModes: doc.drivingModes || null,
    offRoadModes: doc.offRoadModes || null,
    differentialLock: doc.differentialLock || null,
    limitedSlipDifferential: doc.limitedSlipDifferential || null,
    // Page 4 - Seating Comfort
    seatUpholstery: doc.seatUpholstery || null,
    seatsAdjustment: doc.seatsAdjustment || null,
    driverSeatAdjustment: doc.driverSeatAdjustment || null,
    passengerSeatAdjustment: doc.passengerSeatAdjustment || null,
    rearSeatAdjustment: doc.rearSeatAdjustment || null,
    welcomeSeats: doc.welcomeSeats || null,
    memorySeats: doc.memorySeats || null,
    // Page 4 - Exteriors
    headLights: doc.headLights || null,
    tailLight: doc.tailLight || null,
    frontFogLights: doc.frontFogLights || null,
    roofRails: doc.roofRails || null,
    radioAntenna: doc.radioAntenna || null,
    outsideRearViewMirror: doc.outsideRearViewMirror || null,
    daytimeRunningLights: doc.daytimeRunningLights || null,
    sideIndicator: doc.sideIndicator || null,
    rearWindshieldWiper: doc.rearWindshieldWiper || null,
    // Page 5 - Dimensions
    groundClearance: doc.groundClearance || null,
    length: doc.length || null,
    width: doc.width || null,
    height: doc.height || null,
    wheelbase: doc.wheelbase || null,
    turningRadius: doc.turningRadius || null,
    kerbWeight: doc.kerbWeight || null,
    // Page 5 - Tyre & Suspension
    frontTyreProfile: doc.frontTyreProfile || null,
    rearTyreProfile: doc.rearTyreProfile || null,
    spareTyreProfile: doc.spareTyreProfile || null,
    spareWheelType: doc.spareWheelType || null,
    frontSuspension: doc.frontSuspension || null,
    rearSuspension: doc.rearSuspension || null,
    // Page 5 - Storage
    cupholders: doc.cupholders || null,
    fuelTankCapacity: doc.fuelTankCapacity || null,
    bootSpace: doc.bootSpace || null,
    bootSpaceAfterFoldingRearRowSeats: doc.bootSpaceAfterFoldingRearRowSeats || null,
    // Other
    keyFeatures: doc.keyFeatures || null,
    headerSummary: doc.headerSummary || null,
    isValueForMoney: doc.isValueForMoney || false,
    highlightImages: doc.highlightImages || [],
    createdAt: doc.createdAt
  };
}
function mapPopularComparison(doc) {
  return {
    id: doc.id,
    model1Id: doc.model1Id,
    model2Id: doc.model2Id,
    order: doc.order,
    isActive: doc.isActive,
    createdAt: doc.createdAt
  };
}
function mapAdminUser(doc) {
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
var MongoDBStorage = class {
  activeSessions = /* @__PURE__ */ new Map();
  async connect(uri) {
    const { initializeMongoDBOptimized: initializeMongoDBOptimized2 } = await Promise.resolve().then(() => (init_mongodb_config(), mongodb_config_exports));
    await initializeMongoDBOptimized2(uri);
  }
  // ============================================
  // BRANDS
  // ============================================
  async getBrands(includeInactive) {
    try {
      const filter = includeInactive ? {} : { status: "active" };
      const brands = await Brand.find(filter).sort({ ranking: 1 }).lean();
      return brands.map(mapBrand);
    } catch (error) {
      console.error("getBrands error:", error);
      throw new Error("Failed to fetch brands");
    }
  }
  async getBrand(id) {
    try {
      const brand = await Brand.findOne({ id }).lean();
      return brand ? mapBrand(brand) : void 0;
    } catch (error) {
      console.error("getBrand error:", error);
      throw new Error("Failed to fetch brand");
    }
  }
  async createBrand(brand) {
    try {
      console.log("\u{1F50D} createBrand called with:", { name: brand.name, logo: brand.logo, hasLogo: !!brand.logo });
      if (brand.logo) {
        if (brand.logo.startsWith("http://") || brand.logo.startsWith("https://")) {
          console.log("\u2705 Logo is a full URL (R2/external):", brand.logo);
        } else if (brand.logo.startsWith("/uploads/")) {
          console.warn("\u26A0\uFE0F  Logo is a local path - may be lost on server restart:", brand.logo);
        } else {
          console.warn("\u26A0\uFE0F  Unexpected logo format:", brand.logo);
        }
      }
      const slug = brand.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const id = `brand-${slug}`;
      const existing = await Brand.findOne({ id }).lean();
      if (existing) {
        throw new Error(`Brand "${brand.name}" already exists.`);
      }
      const brands = await Brand.find({}).select("ranking").lean();
      const maxRanking = brands.length > 0 ? Math.max(...brands.map((b) => b.ranking)) : 0;
      const autoRanking = maxRanking + 1;
      console.log("\u2705 Creating brand with:", { id, ranking: autoRanking, logo: brand.logo });
      const newBrand = await Brand.create({
        ...brand,
        id,
        ranking: autoRanking,
        createdAt: /* @__PURE__ */ new Date()
      });
      console.log("\u2705 Brand created successfully:", { id: newBrand.id, logo: newBrand.logo });
      return mapBrand(newBrand.toObject());
    } catch (error) {
      console.error("createBrand error:", error);
      throw error instanceof Error ? error : new Error("Failed to create brand");
    }
  }
  async updateBrand(id, brand) {
    try {
      const updatedBrand = await Brand.findOneAndUpdate(
        { id },
        { $set: brand },
        { new: true }
      ).lean();
      return updatedBrand ? mapBrand(updatedBrand) : void 0;
    } catch (error) {
      console.error("updateBrand error:", error);
      throw new Error("Failed to update brand");
    }
  }
  async deleteBrand(id) {
    try {
      const result = await Brand.deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("deleteBrand error:", error);
      throw new Error("Failed to delete brand");
    }
  }
  async getAvailableRankings(excludeBrandId) {
    try {
      const filter = excludeBrandId ? { id: { $ne: excludeBrandId } } : {};
      const brands = await Brand.find(filter).select("ranking").lean();
      return brands.map((b) => b.ranking).sort((a, b) => a - b);
    } catch (error) {
      console.error("getAvailableRankings error:", error);
      throw new Error("Failed to fetch available rankings");
    }
  }
  // ============================================
  // MODELS
  // ============================================
  async getModels(brandId) {
    try {
      const filter = {};
      if (brandId) filter.brandId = brandId;
      const models = await Model.find(filter).sort({ name: 1 }).lean();
      return models.map(mapModel);
    } catch (error) {
      console.error("getModels error:", error);
      throw new Error("Failed to fetch models");
    }
  }
  async getModel(id) {
    try {
      const model = await Model.findOne({ id }).lean();
      return model ? mapModel(model) : void 0;
    } catch (error) {
      console.error("getModel error:", error);
      throw new Error("Failed to fetch model");
    }
  }
  async createModel(model) {
    try {
      const brand = await Brand.findOne({ id: model.brandId }).lean();
      if (!brand) {
        throw new Error(`Invalid brandId: ${model.brandId}. Brand does not exist.`);
      }
      const brandSlug = brand.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const modelSlug = model.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const id = `model-brand-${brandSlug}-${modelSlug}`;
      const existing = await Model.findOne({ id }).lean();
      if (existing) {
        throw new Error(`Model "${model.name}" already exists for brand "${brand.name}".`);
      }
      const newModel = await Model.create({
        ...model,
        id,
        createdAt: /* @__PURE__ */ new Date()
      });
      return mapModel(newModel.toObject());
    } catch (error) {
      console.error("createModel error:", error);
      throw error instanceof Error ? error : new Error("Failed to create model");
    }
  }
  async updateModel(id, model) {
    try {
      const updatedModel = await Model.findOneAndUpdate(
        { id },
        { $set: model },
        { new: true }
      ).lean();
      return updatedModel ? mapModel(updatedModel) : void 0;
    } catch (error) {
      console.error("updateModel error:", error);
      throw new Error("Failed to update model");
    }
  }
  async deleteModel(id) {
    try {
      await Variant.deleteMany({ modelId: id });
      const modelDeleteResult = await Model.deleteOne({ id });
      return modelDeleteResult.deletedCount > 0;
    } catch (error) {
      console.error("deleteModel cascade error:", error);
      throw new Error("Failed to delete model and related variants");
    }
  }
  async getPopularModels(limit = 20) {
    try {
      const models = await Model.find({ isPopular: true, status: "active" }).sort({ popularRank: 1 }).limit(limit).lean();
      return models.map(mapModel);
    } catch (error) {
      console.error("getPopularModels error:", error);
      throw new Error("Failed to fetch popular models");
    }
  }
  async getModelsWithPricing(brandId) {
    try {
      const matchStage = { status: "active" };
      if (brandId) matchStage.brandId = brandId;
      const results = await Model.aggregate([
        { $match: matchStage },
        { $sort: { name: 1 } },
        {
          $lookup: {
            from: "variants",
            localField: "id",
            foreignField: "modelId",
            pipeline: [
              { $match: { status: "active" } },
              { $project: { price: 1, fuel: 1, fuelType: 1 } }
            ],
            as: "variants"
          }
        },
        {
          $addFields: {
            prices: {
              $filter: {
                input: { $map: { input: "$variants", as: "v", in: "$$v.price" } },
                as: "p",
                cond: { $gt: ["$$p", 0] }
              }
            }
          }
        },
        {
          $addFields: {
            startingPrice: { $min: "$prices" },
            lowestPrice: { $min: "$prices" },
            priceRange: {
              min: { $ifNull: [{ $min: "$prices" }, 0] },
              max: { $ifNull: [{ $max: "$prices" }, 0] }
            },
            // Find variant with lowest price to get fuel type
            lowestPriceVariant: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$variants",
                    as: "v",
                    cond: { $eq: ["$$v.price", { $min: "$prices" }] }
                  }
                },
                0
              ]
            }
          }
        },
        {
          $addFields: {
            lowestPriceFuelType: {
              $ifNull: ["$lowestPriceVariant.fuel", { $ifNull: ["$lowestPriceVariant.fuelType", "Petrol"] }]
            }
          }
        },
        {
          $project: {
            variants: 0,
            prices: 0,
            lowestPriceVariant: 0
          }
        }
      ]);
      return results.map((doc) => ({
        ...mapModel(doc),
        startingPrice: doc.startingPrice || 0,
        lowestPrice: doc.lowestPrice || 0,
        lowestPriceFuelType: doc.lowestPriceFuelType,
        priceRange: doc.priceRange
      }));
    } catch (error) {
      console.error("getModelsWithPricing error:", error);
      throw new Error("Failed to fetch models with pricing");
    }
  }
  // ============================================
  // UPCOMING CARS
  // ============================================
  async getUpcomingCars(brandId) {
    try {
      const filter = {};
      if (brandId) filter.brandId = brandId;
      const upcomingCars = await UpcomingCar.find(filter).sort({ name: 1 }).lean();
      return upcomingCars.map(mapUpcomingCar);
    } catch (error) {
      console.error("getUpcomingCars error:", error);
      throw new Error("Failed to fetch upcoming cars");
    }
  }
  async getUpcomingCar(id) {
    try {
      const upcomingCar = await UpcomingCar.findOne({ id }).lean();
      return upcomingCar ? mapUpcomingCar(upcomingCar) : void 0;
    } catch (error) {
      console.error("getUpcomingCar error:", error);
      throw new Error("Failed to fetch upcoming car");
    }
  }
  async createUpcomingCar(car) {
    try {
      const brand = await Brand.findOne({ id: car.brandId }).lean();
      if (!brand) {
        throw new Error(`Invalid brandId: ${car.brandId}. Brand does not exist.`);
      }
      const brandSlug = brand.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const carSlug = car.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const id = `upcoming-brand-${brandSlug}-${carSlug}`;
      const existing = await UpcomingCar.findOne({ id }).lean();
      if (existing) {
        throw new Error(`Upcoming car "${car.name}" already exists for brand "${brand.name}".`);
      }
      const newUpcomingCar = await UpcomingCar.create({
        ...car,
        id,
        createdAt: /* @__PURE__ */ new Date()
      });
      return mapUpcomingCar(newUpcomingCar.toObject());
    } catch (error) {
      console.error("createUpcomingCar error:", error);
      throw error instanceof Error ? error : new Error("Failed to create upcoming car");
    }
  }
  async updateUpcomingCar(id, car) {
    try {
      const updatedUpcomingCar = await UpcomingCar.findOneAndUpdate(
        { id },
        { $set: car },
        { new: true }
      ).lean();
      return updatedUpcomingCar ? mapUpcomingCar(updatedUpcomingCar) : void 0;
    } catch (error) {
      console.error("updateUpcomingCar error:", error);
      throw new Error("Failed to update upcoming car");
    }
  }
  async deleteUpcomingCar(id) {
    try {
      const result = await UpcomingCar.deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("deleteUpcomingCar error:", error);
      throw new Error("Failed to delete upcoming car");
    }
  }
  // ============================================
  // VARIANTS
  // ============================================
  async getVariants(modelId, brandId) {
    try {
      const filter = {};
      if (modelId) filter.modelId = modelId;
      if (brandId) filter.brandId = brandId;
      const variants = await Variant.find(filter).sort({ price: 1 }).lean();
      return variants.map(mapVariant);
    } catch (error) {
      console.error("getVariants error:", error);
      throw new Error("Failed to fetch variants");
    }
  }
  async getVariant(id) {
    try {
      const variant = await Variant.findOne({ id }).lean();
      return variant ? mapVariant(variant) : void 0;
    } catch (error) {
      console.error("getVariant error:", error);
      throw new Error("Failed to fetch variant");
    }
  }
  async createVariant(variant) {
    try {
      const brand = await Brand.findOne({ id: variant.brandId }).lean();
      if (!brand) {
        throw new Error(`Invalid brandId: ${variant.brandId}. Brand does not exist.`);
      }
      console.log(`\u{1F50D} Looking up model: ${variant.modelId}`);
      let model = await Model.findOne({ id: variant.modelId }).lean();
      let isUpcoming = false;
      if (!model) {
        console.log(`\u26A0\uFE0F Model not found in regular models, checking upcoming cars for: ${variant.modelId}`);
        const upcomingCar = await UpcomingCar.findOne({ id: variant.modelId }).lean();
        if (upcomingCar) {
          console.log(`\u2705 Found upcoming car: ${upcomingCar.name}`);
          model = upcomingCar;
          isUpcoming = true;
        } else {
          console.log(`\u274C Model not found in upcoming cars either: ${variant.modelId}`);
        }
      } else {
        console.log(`\u2705 Found regular model: ${model.name}`);
      }
      if (!model) {
        throw new Error(`Invalid modelId: ${variant.modelId}. Model does not exist.`);
      }
      if (model.brandId !== variant.brandId) {
        throw new Error(`Model ${variant.modelId} does not belong to brand ${variant.brandId}.`);
      }
      const brandSlug = brand.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const modelSlug = model.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const variantSlug = variant.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const id = `variant-brand-${brandSlug}-model-${brandSlug}-${modelSlug}-${variantSlug}`;
      const existing = await Variant.findOne({ id }).lean();
      if (existing) {
        throw new Error(`Variant "${variant.name}" already exists for model "${model.name}".`);
      }
      const newVariant = await Variant.create({
        ...variant,
        id,
        createdAt: /* @__PURE__ */ new Date()
      });
      return mapVariant(newVariant.toObject());
    } catch (error) {
      console.error("createVariant error:", error);
      throw error instanceof Error ? error : new Error("Failed to create variant");
    }
  }
  async updateVariant(id, variant) {
    try {
      const updatedVariant = await Variant.findOneAndUpdate(
        { id },
        { $set: variant },
        { new: true }
      ).lean();
      return updatedVariant ? mapVariant(updatedVariant) : void 0;
    } catch (error) {
      console.error("updateVariant error:", error);
      throw new Error("Failed to update variant");
    }
  }
  async deleteVariant(id) {
    try {
      const result = await Variant.deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("deleteVariant error:", error);
      throw new Error("Failed to delete variant");
    }
  }
  // ============================================
  // POPULAR COMPARISONS
  // ============================================
  async getPopularComparisons() {
    try {
      const comparisons = await PopularComparison.find({ isActive: true }).sort({ order: 1 }).lean();
      return comparisons.map(mapPopularComparison);
    } catch (error) {
      console.error("getPopularComparisons error:", error);
      throw new Error("Failed to fetch popular comparisons");
    }
  }
  async savePopularComparisons(comparisons) {
    try {
      await PopularComparison.deleteMany({});
      const result = await PopularComparison.insertMany(comparisons);
      return result.map((c) => mapPopularComparison(c.toObject()));
    } catch (error) {
      console.error("savePopularComparisons error:", error);
      throw new Error("Failed to save popular comparisons");
    }
  }
  // ============================================
  // ADMIN USERS
  // ============================================
  async getAdminUser(email) {
    try {
      const user = await AdminUser.findOne({ email }).lean();
      return user ? mapAdminUser(user) : void 0;
    } catch (error) {
      console.error("getAdminUser error:", error);
      throw new Error("Failed to fetch admin user");
    }
  }
  async getAdminUserById(id) {
    try {
      const user = await AdminUser.findOne({ id }).lean();
      return user ? mapAdminUser(user) : void 0;
    } catch (error) {
      console.error("getAdminUserById error:", error);
      throw new Error("Failed to fetch admin user by ID");
    }
  }
  async createAdminUser(user) {
    try {
      const newUser = await AdminUser.create(user);
      return mapAdminUser(newUser.toObject());
    } catch (error) {
      console.error("createAdminUser error:", error);
      throw new Error("Failed to create admin user");
    }
  }
  async updateAdminUserLogin(id) {
    try {
      await AdminUser.updateOne(
        { id },
        { $set: { lastLogin: /* @__PURE__ */ new Date() } }
      );
    } catch (error) {
      console.error("updateAdminUserLogin error:", error);
      throw new Error("Failed to update admin user login");
    }
  }
  // ============================================
  // SESSION MANAGEMENT
  // ============================================
  async createSession(userId, token) {
    this.activeSessions.set(userId, token);
  }
  async getActiveSession(userId) {
    return this.activeSessions.get(userId) || null;
  }
  async invalidateSession(userId) {
    this.activeSessions.delete(userId);
  }
  async isSessionValid(userId, token) {
    const activeToken = this.activeSessions.get(userId);
    return activeToken === token;
  }
  // ============================================
  // STATS
  // ============================================
  async getStats() {
    try {
      const [totalBrands, totalModels, totalVariants] = await Promise.all([
        Brand.countDocuments({ status: "active" }),
        Model.countDocuments({ status: "active" }),
        Variant.countDocuments({ status: "active" })
      ]);
      return {
        totalBrands,
        totalModels,
        totalVariants
      };
    } catch (error) {
      console.error("getStats error:", error);
      throw new Error("Failed to fetch stats");
    }
  }
  // ============================================
  // YOUTUBE CACHE (Redis-based for persistence)
  // ============================================
  async getYouTubeCache() {
    try {
      const { getCacheRedisClient: getCacheRedisClient2 } = await Promise.resolve().then(() => (init_redis_config(), redis_config_exports));
      const redis5 = getCacheRedisClient2();
      if (!redis5) {
        console.warn("\u26A0\uFE0F  Redis not available - YouTube cache unavailable");
        return null;
      }
      const cacheKey = "youtube:cache:gadizone";
      const cachedData = await redis5.get(cacheKey);
      if (!cachedData) {
        console.log("\u{1F4FA} YouTube cache miss (Redis)");
        return null;
      }
      const parsed = JSON.parse(cachedData);
      console.log("\u2705 YouTube cache hit (Redis) - age:", Math.floor((Date.now() - parsed.timestamp) / 1e3 / 60), "minutes");
      return parsed;
    } catch (error) {
      console.error("\u274C Error fetching YouTube cache from Redis:", error);
      return null;
    }
  }
  async saveYouTubeCache(data, timestamp) {
    try {
      const { getCacheRedisClient: getCacheRedisClient2 } = await Promise.resolve().then(() => (init_redis_config(), redis_config_exports));
      const redis5 = getCacheRedisClient2();
      if (!redis5) {
        console.warn("\u26A0\uFE0F  Redis not available - YouTube cache not saved");
        return;
      }
      const cacheKey = "youtube:cache:gadizone";
      const cacheData = { data, timestamp };
      const TTL = 48 * 60 * 60;
      await redis5.setex(cacheKey, TTL, JSON.stringify(cacheData));
      console.log("\u2705 YouTube cache saved to Redis (TTL: 48 hours)");
    } catch (error) {
      console.error("\u274C Error saving YouTube cache to Redis:", error);
    }
  }
};

// server/backup-service.ts
import fs6 from "fs";
import path6 from "path";
var BackupService = class {
  storage;
  dataDir;
  isBackupEnabled;
  constructor(storage2, dataDir = path6.join(process.cwd(), "data")) {
    this.storage = storage2;
    this.dataDir = dataDir;
    this.isBackupEnabled = process.env.ENABLE_JSON_BACKUP !== "false";
    if (!fs6.existsSync(this.dataDir)) {
      fs6.mkdirSync(this.dataDir, { recursive: true });
    }
    if (this.isBackupEnabled) {
      console.log("\u{1F4E6} JSON Backup Service: ENABLED");
      console.log(`\u{1F4C1} Backup Directory: ${this.dataDir}`);
    } else {
      console.log("\u{1F4E6} JSON Backup Service: DISABLED");
    }
  }
  /**
   * Backup all data to JSON files
   */
  async backupAll() {
    if (!this.isBackupEnabled) return;
    try {
      console.log("\u{1F504} Starting full backup to JSON files...");
      await Promise.all([
        this.backupBrands(),
        this.backupModels(),
        this.backupVariants(),
        this.backupAdminUsers(),
        this.backupPopularComparisons()
      ]);
      console.log("\u2705 Full backup completed successfully");
    } catch (error) {
      console.error("\u274C Backup failed:", error);
      throw error;
    }
  }
  /**
   * Backup brands to JSON
   */
  async backupBrands() {
    if (!this.isBackupEnabled) return;
    try {
      const brands = await this.storage.getBrands(true);
      const filePath = path6.join(this.dataDir, "brands.json");
      const cleanBrands = brands.map((brand) => this.cleanMongoDocument(brand));
      fs6.writeFileSync(filePath, JSON.stringify(cleanBrands, null, 2), "utf-8");
      console.log(`\u2705 Backed up ${brands.length} brands to ${filePath}`);
    } catch (error) {
      console.error("\u274C Failed to backup brands:", error);
    }
  }
  /**
   * Backup models to JSON
   */
  async backupModels() {
    if (!this.isBackupEnabled) return;
    try {
      const models = await this.storage.getModels();
      const filePath = path6.join(this.dataDir, "models.json");
      const cleanModels = models.map((model) => this.cleanMongoDocument(model));
      fs6.writeFileSync(filePath, JSON.stringify(cleanModels, null, 2), "utf-8");
      console.log(`\u2705 Backed up ${models.length} models to ${filePath}`);
    } catch (error) {
      console.error("\u274C Failed to backup models:", error);
    }
  }
  /**
   * Backup variants to JSON
   */
  async backupVariants() {
    if (!this.isBackupEnabled) return;
    try {
      const variants = await this.storage.getVariants();
      const filePath = path6.join(this.dataDir, "variants.json");
      const cleanVariants = variants.map((variant) => this.cleanMongoDocument(variant));
      fs6.writeFileSync(filePath, JSON.stringify(cleanVariants, null, 2), "utf-8");
      console.log(`\u2705 Backed up ${variants.length} variants to ${filePath}`);
    } catch (error) {
      console.error("\u274C Failed to backup variants:", error);
    }
  }
  /**
   * Backup admin users to JSON
   */
  async backupAdminUsers() {
    if (!this.isBackupEnabled) return;
    try {
      console.log("\u26A0\uFE0F  Admin users backup skipped (no getAllUsers method)");
    } catch (error) {
      console.error("\u274C Failed to backup admin users:", error);
    }
  }
  /**
   * Backup popular comparisons to JSON
   */
  async backupPopularComparisons() {
    if (!this.isBackupEnabled) return;
    try {
      const comparisons = await this.storage.getPopularComparisons();
      const filePath = path6.join(this.dataDir, "popular-comparisons.json");
      const cleanComparisons = comparisons.map((comp) => this.cleanMongoDocument(comp));
      fs6.writeFileSync(filePath, JSON.stringify(cleanComparisons, null, 2), "utf-8");
      console.log(`\u2705 Backed up ${comparisons.length} popular comparisons to ${filePath}`);
    } catch (error) {
      console.error("\u274C Failed to backup popular comparisons:", error);
    }
  }
  /**
   * Schedule automatic backups
   * @param intervalMinutes - Backup interval in minutes (default: 30)
   */
  startAutoBackup(intervalMinutes = 30) {
    if (!this.isBackupEnabled) {
      console.log("\u{1F4E6} Auto-backup not started (backup disabled)");
      return;
    }
    console.log(`\u23F0 Auto-backup scheduled every ${intervalMinutes} minutes`);
    this.backupAll().catch((err) => console.error("Initial backup failed:", err));
    setInterval(() => {
      console.log("\u23F0 Running scheduled backup...");
      this.backupAll().catch((err) => console.error("Scheduled backup failed:", err));
    }, intervalMinutes * 60 * 1e3);
  }
  /**
   * Remove MongoDB-specific fields from document
   */
  cleanMongoDocument(doc) {
    const cleaned = { ...doc };
    delete cleaned._id;
    delete cleaned.__v;
    if (cleaned.faqs && Array.isArray(cleaned.faqs)) {
      cleaned.faqs = cleaned.faqs.map((faq) => {
        const { _id, ...rest } = faq;
        return rest;
      });
    }
    if (cleaned.galleryImages && Array.isArray(cleaned.galleryImages)) {
      cleaned.galleryImages = cleaned.galleryImages.map((img) => {
        const { _id, ...rest } = img;
        return rest;
      });
    }
    if (cleaned.keyFeatureImages && Array.isArray(cleaned.keyFeatureImages)) {
      cleaned.keyFeatureImages = cleaned.keyFeatureImages.map((img) => {
        const { _id, ...rest } = img;
        return rest;
      });
    }
    if (cleaned.spaceComfortImages && Array.isArray(cleaned.spaceComfortImages)) {
      cleaned.spaceComfortImages = cleaned.spaceComfortImages.map((img) => {
        const { _id, ...rest } = img;
        return rest;
      });
    }
    if (cleaned.storageConvenienceImages && Array.isArray(cleaned.storageConvenienceImages)) {
      cleaned.storageConvenienceImages = cleaned.storageConvenienceImages.map((img) => {
        const { _id, ...rest } = img;
        return rest;
      });
    }
    if (cleaned.colorImages && Array.isArray(cleaned.colorImages)) {
      cleaned.colorImages = cleaned.colorImages.map((img) => {
        const { _id, ...rest } = img;
        return rest;
      });
    }
    if (cleaned.engineSummaries && Array.isArray(cleaned.engineSummaries)) {
      cleaned.engineSummaries = cleaned.engineSummaries.map((eng) => {
        const { _id, ...rest } = eng;
        return rest;
      });
    }
    if (cleaned.mileageData && Array.isArray(cleaned.mileageData)) {
      cleaned.mileageData = cleaned.mileageData.map((mil) => {
        const { _id, ...rest } = mil;
        return rest;
      });
    }
    return cleaned;
  }
  /**
   * Create a timestamped backup
   */
  async createTimestampedBackup() {
    if (!this.isBackupEnabled) {
      throw new Error("Backup is disabled");
    }
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const backupDir = path6.join(this.dataDir, "backups", timestamp);
    fs6.mkdirSync(backupDir, { recursive: true });
    const brands = await this.storage.getBrands(true);
    const models = await this.storage.getModels();
    const variants = await this.storage.getVariants();
    const comparisons = await this.storage.getPopularComparisons();
    fs6.writeFileSync(
      path6.join(backupDir, "brands.json"),
      JSON.stringify(brands.map((b) => this.cleanMongoDocument(b)), null, 2)
    );
    fs6.writeFileSync(
      path6.join(backupDir, "models.json"),
      JSON.stringify(models.map((m) => this.cleanMongoDocument(m)), null, 2)
    );
    fs6.writeFileSync(
      path6.join(backupDir, "variants.json"),
      JSON.stringify(variants.map((v) => this.cleanMongoDocument(v)), null, 2)
    );
    fs6.writeFileSync(
      path6.join(backupDir, "popular-comparisons.json"),
      JSON.stringify(comparisons.map((c) => this.cleanMongoDocument(c)), null, 2)
    );
    console.log(`\u2705 Timestamped backup created: ${backupDir}`);
    return backupDir;
  }
};
function createBackupService(storage2) {
  return new BackupService(storage2);
}

// server/routes/monitoring.ts
init_redis_cache();
import { Router as Router9 } from "express";

// server/middleware/cache.ts
var SimpleCache = class {
  cache = /* @__PURE__ */ new Map();
  maxSize = 1e3;
  // Max 1000 entries
  set(key, data, ttl = 300) {
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl * 1e3
      // Convert to milliseconds
    });
  }
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }
  delete(key) {
    this.cache.delete(key);
  }
  clear() {
    this.cache.clear();
  }
  // Clean expired entries
  cleanup() {
    const now = Date.now();
    const keysToDelete = [];
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.cache.delete(key));
  }
  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize
    };
  }
};
var cache3 = new SimpleCache();
function getCacheStats() {
  return cache3.getStats();
}

// server/routes/monitoring.ts
import mongoose5 from "mongoose";
var router16 = Router9();
router16.get("/health", async (req, res) => {
  try {
    const health = {
      status: "healthy",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || "1.0.0",
      services: {
        database: "unknown",
        redis: "unknown",
        memory: "unknown"
      }
    };
    try {
      const dbState = mongoose5.connection.readyState;
      health.services.database = dbState === 1 ? "connected" : "disconnected";
    } catch (error) {
      health.services.database = "error";
    }
    try {
      const redisStats = await getRedisCacheStats();
      health.services.redis = redisStats.connected ? "connected" : "disconnected";
    } catch (error) {
      health.services.redis = "error";
    }
    const memUsage = process.memoryUsage();
    const memUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const memTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
    health.services.memory = `${memUsedMB}MB / ${memTotalMB}MB`;
    const allHealthy = Object.values(health.services).every(
      (status) => status !== "error" && status !== "disconnected"
    );
    health.status = allHealthy ? "healthy" : "degraded";
    const statusCode = allHealthy ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
});
router16.get("/metrics", async (req, res) => {
  try {
    const metrics = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      system: {
        uptime: process.uptime(),
        platform: process.platform,
        nodeVersion: process.version,
        pid: process.pid
      },
      memory: {
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      },
      cpu: {
        usage: process.cpuUsage()
      },
      database: {
        status: "unknown",
        connections: 0
      },
      cache: {
        redis: {},
        memory: {}
      }
    };
    try {
      metrics.database.status = mongoose5.connection.readyState === 1 ? "connected" : "disconnected";
      const poolSize = mongoose5.connection.db?.serverConfig?.s?.poolSize || 0;
      metrics.database.connections = poolSize;
    } catch (error) {
      metrics.database.status = "error";
    }
    try {
      metrics.cache.redis = await getRedisCacheStats();
    } catch (error) {
      metrics.cache.redis = { error: "Redis not available" };
    }
    try {
      metrics.cache.memory = getCacheStats();
    } catch (error) {
      metrics.cache.memory = { error: "Memory cache not available" };
    }
    res.json(metrics);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to get metrics",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
});
router16.get("/ready", async (req, res) => {
  try {
    const dbReady = mongoose5.connection.readyState === 1;
    if (dbReady) {
      res.status(200).json({
        ready: true,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } else {
      res.status(503).json({
        ready: false,
        reason: "Database not connected",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  } catch (error) {
    res.status(503).json({
      ready: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
});
router16.get("/live", (req, res) => {
  res.status(200).json({
    alive: true,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
router16.get("/stats", async (req, res) => {
  try {
    const stats = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requests: {
        // These would be tracked by middleware in production
        total: 0,
        success: 0,
        errors: 0,
        averageResponseTime: 0
      },
      cache: {
        redis: await getRedisCacheStats(),
        memory: getCacheStats()
      },
      database: {
        queries: 0,
        // Would be tracked by middleware
        averageQueryTime: 0
      }
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to get stats",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
});
var monitoring_default = router16;

// server/index.ts
import dotenv2 from "dotenv";
import helmet from "helmet";
init_redis_cache();
import compression from "compression";
import pinoHttp from "pino-http";
import session from "express-session";
import RedisStore2 from "connect-redis";
import { init as sentryInit, setupExpressErrorHandler } from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

// server/monitoring/metrics.ts
import client from "prom-client";
var register = new client.Registry();
register.setDefaultLabels({
  app: "killer-whale-backend"
});
client.collectDefaultMetrics({ register });
var httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 5, 10]
  // 0.1s, 0.5s, 1s, 5s, 10s
});
register.registerMetric(httpRequestDurationMicroseconds);
var frontendWebVitals = new client.Histogram({
  name: "frontend_web_vitals",
  help: "Frontend Web Vitals (LCP, CLS, FID, FCP, TTFB)",
  labelNames: ["metric_name"],
  buckets: [0.1, 0.5, 1, 2, 3, 5, 10]
});
register.registerMetric(frontendWebVitals);

// server/index.ts
init_redis_config();
var __filename2 = fileURLToPath3(import.meta.url);
var __dirname4 = path8.dirname(__filename2);
var rootEnv = path8.resolve(process.cwd(), ".env");
var backendEnv = path8.resolve(__dirname4, "../.env");
dotenv2.config({ path: rootEnv });
dotenv2.config({ path: backendEnv, override: true });
var sentryEnabled = !!process.env.SENTRY_DSN;
if (sentryEnabled) {
  try {
    sentryInit({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        nodeProfilingIntegration()
      ],
      // Tracing
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
      // Set sampling rate for profiling - this is relative to tracesSampleRate
      profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
      environment: process.env.NODE_ENV || "development"
    });
    console.log("\u2705 Sentry initialized");
  } catch (error) {
    console.error("\u26A0\uFE0F Failed to initialize Sentry:", error);
  }
} else {
  console.log("\u2139\uFE0F Sentry not configured (set SENTRY_DSN to enable error tracking)");
}
var app = express15();
app.use(express15.json({ limit: "10mb" }));
app.use(express15.urlencoded({ extended: false, limit: "10mb" }));
app.use(cookieParser());
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(pinoHttp({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie", "res.headers.set-cookie"],
    remove: true
  }
}));
app.use(compression());
var isRender = !!process.env.RENDER || !!process.env.RENDER_EXTERNAL_URL;
var isProd = process.env.NODE_ENV === "production" || isRender;
var accountId = process.env.R2_ACCOUNT_ID;
var r2Endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : void 0);
var extraConnect = [
  process.env.FRONTEND_URL || "",
  process.env.NEXT_PUBLIC_API_URL || "",
  r2Endpoint || ""
].filter(Boolean);
app.use(helmet({
  // Disable CSP in development to allow dev toolchains (Vite/Next) to inject preambles
  contentSecurityPolicy: isProd ? {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https:", "http:", ...extraConnect],
      imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
      mediaSrc: ["'self'", "data:", "blob:", "https:", "http:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
      frameSrc: ["'self'", "https:"]
    }
  } : false,
  // COEP can interfere with dev HMR; disable in dev
  crossOriginEmbedderPolicy: isProd ? void 0 : false,
  // Allow cross-origin embedding of resources (images) in development
  crossOriginResourcePolicy: isProd ? void 0 : { policy: "cross-origin" }
}));
app.use("/api", botDetector);
var allowedOrigins = [
  "https://gadizone.com",
  "https://www.gadizone.com",
  "https://admin.gadizone.com",
  "https://killer-whale101.vercel.app",
  "https://killer-whale.onrender.com",
  "http://localhost:3000",
  "http://localhost:5001",
  process.env.FRONTEND_URL,
  process.env.NEXT_PUBLIC_API_URL
].filter(Boolean);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  } else if (process.env.NODE_ENV === "development") {
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie");
  res.header("Access-Control-Expose-Headers", "RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, X-Cache, X-Cache-TTL");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use("/api", apiLimiter);
var uploadsStaticPath = path8.join(process.cwd(), "uploads");
app.get("/uploads/*", (req, res, next) => {
  try {
    const reqPath = req.path;
    const relPath = reqPath.replace(/^\/+/, "");
    const absPath = path8.join(process.cwd(), relPath);
    fs8.access(absPath, fs8.constants.R_OK, (err) => {
      if (!err) return next();
      const publicBase = process.env.R2_PUBLIC_BASE_URL;
      if (publicBase) {
        const target = `${publicBase}/${relPath}`;
        return res.redirect(302, target);
      }
      const webpRel = relPath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
      if (webpRel === relPath) return next();
      const webpAbs = path8.join(process.cwd(), webpRel);
      fs8.access(webpAbs, fs8.constants.R_OK, (err2) => {
        if (!err2) {
          res.type("image/webp").sendFile(webpAbs);
        } else {
          next();
        }
      });
    });
  } catch {
    next();
  }
});
if (!isProd) {
  app.use(
    "/uploads",
    (req, res, next) => {
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      next();
    },
    express15.static(uploadsStaticPath, {
      etag: false,
      lastModified: false,
      maxAge: 0
    })
  );
} else {
  app.use("/uploads", express15.static(uploadsStaticPath));
}
app.use((req, res, next) => {
  const start = Date.now();
  const path9 = req.path;
  const shouldCapture = process.env.NODE_ENV !== "production";
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    if (shouldCapture) {
      try {
        const preview = JSON.stringify(bodyJson);
        capturedJsonResponse = preview.length > 200 ? preview.slice(0, 200) + "\u2026" : preview;
      } catch {
      }
    }
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path9.startsWith("/api")) {
      let logLine = `${req.method} ${path9} ${res.statusCode} in ${duration}ms`;
      if (shouldCapture && capturedJsonResponse) {
        logLine += ` :: ${capturedJsonResponse}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
app.use((req, res, next) => {
  if (req.path === "/metrics") return next();
  const start = process.hrtime();
  res.on("finish", () => {
    const duration = process.hrtime(start);
    const durationSeconds = duration[0] + duration[1] / 1e9;
    httpRequestDurationMicroseconds.observe(
      {
        method: req.method,
        route: req.route ? req.route.path : req.path,
        status_code: res.statusCode
      },
      durationSeconds
    );
  });
  next();
});
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
app.post("/api/monitoring/vitals", (req, res) => {
  const { name, value } = req.body;
  if (name && value) {
    frontendWebVitals.observe({ metric_name: name }, value);
  }
  res.status(200).send("OK");
});
var redisClient = getSessionRedisClient();
if (redisClient) {
  console.log("\u2705 Using unified Redis client for sessions");
} else {
  console.warn("\u26A0\uFE0F  Redis not configured. Sessions will use memory store (not persistent across restarts)");
}
var sessionSecret = process.env.SESSION_SECRET;
if (isProd && !sessionSecret) {
  throw new Error("\u{1F6A8} SECURITY CRITICAL: SESSION_SECRET must be set in production environment variables.");
}
var isGadizoneDomain = isProd && (process.env.FRONTEND_URL?.includes("gadizone.com") || process.env.BACKEND_URL?.includes("gadizone.com"));
console.log("\u{1F527} Session Cookie Configuration:");
console.log(`   - isProd: ${isProd}`);
console.log(`   - isGadizoneDomain: ${isGadizoneDomain}`);
console.log(`   - FRONTEND_URL: ${process.env.FRONTEND_URL}`);
console.log(`   - BACKEND_URL: ${process.env.BACKEND_URL}`);
var sessionConfig = {
  secret: sessionSecret || "gadizone_secret_key_2024",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProd,
    // true in production (required for HTTPS and sameSite: 'none')
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1e3,
    // 30 days
    // IMPORTANT: For cross-origin fetch requests (www.gadizone.com -> admin.gadizone.com),
    // we MUST use 'none' because 'lax' only sends cookies on same-site or top-level navigations.
    // 'none' + 'secure' allows credentials: 'include' to work across subdomains.
    sameSite: isProd ? "none" : "lax",
    // Dynamic cookie domain:
    // 1. If we are on gadizone.com (admin or www), share cookie across subdomains using .gadizone.com
    // 2. If we are on Render (killer-whale...), do NOT set domain (defaults to current host) to avoid blocking
    domain: isGadizoneDomain ? ".gadizone.com" : void 0,
    path: "/"
    // Explicitly set cookie path
  },
  name: "sid",
  // Custom session ID name
  proxy: true
  // ALWAYS trust proxy in production/cloud environments (Render/Vercel) for secure cookies to work
};
if (redisClient) {
  const redisStore = new RedisStore2({
    client: redisClient,
    prefix: "sess:"
  });
  sessionConfig.store = redisStore;
  console.log("\u2705 Redis session store initialized");
} else {
  console.warn("\u26A0\uFE0F  Using MemoryStore for sessions (fallback - not production-ready)");
}
app.use(session(sessionConfig));
console.log("\u2705 Session middleware configured");
console.log(`   - Environment: ${isProd ? "production" : "development"}`);
console.log(`   - Cookie secure: ${sessionConfig.cookie.secure}`);
console.log(`   - Cookie sameSite: ${sessionConfig.cookie.sameSite}`);
console.log(`   - Store: ${redisClient ? "Redis (persistent)" : "MemoryStore (fallback - sessions lost on restart)"}`);
console.log(`   - Trust proxy: ${sessionConfig.proxy}`);
if (!isProd) {
  app.use((req, res, next) => {
    if (req.path.includes("/auth/")) {
      console.log("\u{1F50D} Session Debug:", {
        sessionID: req.sessionID,
        userId: req.session?.userId,
        cookie: req.session?.cookie,
        path: req.path
      });
    }
    next();
  });
}
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "development") {
  console.log("\u{1F30D} Environment Configuration:");
  console.log("   - FRONTEND_URL:", process.env.FRONTEND_URL || "(Not set - defaulting to localhost)");
  console.log("   - BACKEND_URL:", process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "(Not set)");
  console.log("   - NODE_ENV:", process.env.NODE_ENV);
}
(async () => {
  try {
    if (isProd) {
      app.set("trust proxy", 1);
    }
    const passportConfig = await Promise.resolve().then(() => (init_passport(), passport_exports));
    const passport2 = passportConfig.default;
    app.use(passport2.initialize());
    app.use(passport2.session());
    console.log("\u2705 Passport.js initialized for OAuth");
    const storage2 = new MongoDBStorage();
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";
    try {
      await storage2.connect(mongoUri);
    } catch (error) {
      console.error("\u274C Failed to connect to MongoDB. Please check:");
      console.error("   1. MongoDB is running (brew services start mongodb-community)");
      console.error("   2. MONGODB_URI in .env file is correct");
      console.error("   3. Network connection is available");
      console.error("   3. Network connection is available");
      console.warn("\u26A0\uFE0F  Continuing without MongoDB (AI Chat will use mock data)...");
    }
    await newsStorage.initialize();
    try {
      await warmUpCache(storage2);
    } catch (e) {
      console.warn("Cache warmup skipped:", e instanceof Error ? e.message : e);
    }
    if (isProd) {
      const backupService = createBackupService(storage2);
      backupService.startAutoBackup(30);
    }
    try {
      const { mongoDBBackupSync: mongoDBBackupSync2 } = await Promise.resolve().then(() => (init_mongodb_backup_sync(), mongodb_backup_sync_exports));
      await mongoDBBackupSync2.initialize();
    } catch (error) {
      console.warn("\u26A0\uFE0F  MongoDB backup sync initialization skipped:", error instanceof Error ? error.message : error);
    }
    const backupSyncRoutes = (await Promise.resolve().then(() => (init_backup_sync(), backup_sync_exports))).default;
    app.use("/api/admin/backup", backupSyncRoutes);
    console.log("\u2705 Backup sync routes registered at /api/admin/backup");
    app.use("/api/monitoring", monitoring_default);
    const cacheRoutes = (await Promise.resolve().then(() => (init_cache(), cache_exports))).default;
    app.use("/api/cache", cacheRoutes);
    const userAuthRoutes = (await Promise.resolve().then(() => (init_user_auth(), user_auth_exports))).default;
    app.use("/api/user", userAuthRoutes);
    console.log("\u2705 User authentication routes registered at /api/user");
    const adminUsersRoutes = (await Promise.resolve().then(() => (init_admin_users(), admin_users_exports))).default;
    app.use("/api/admin/users", adminUsersRoutes);
    console.log("\u2705 Admin users routes registered at /api/admin/users");
    const diagnosticsRoutes = (await Promise.resolve().then(() => (init_diagnostics(), diagnostics_exports))).default;
    app.use("/api/diagnostics", diagnosticsRoutes);
    console.log("\u2705 Diagnostics routes registered at /api/diagnostics");
    const recommendationsRoutes = (await Promise.resolve().then(() => (init_recommendations(), recommendations_exports))).default;
    app.use("/api/recommendations", recommendationsRoutes);
    console.log("\u2705 Recommendations routes registered at /api/recommendations");
    registerRoutes(app, storage2);
    const server = createServer(app);
    try {
      const SchedulerIntegration2 = (await Promise.resolve().then(() => (init_schedulerIntegration(), schedulerIntegration_exports))).default;
      const schedulerIntegration = new SchedulerIntegration2(app);
      await schedulerIntegration.init();
      console.log("\u2705 Scheduled API fetcher initialized (1:00 PM & 8:00 PM IST)");
    } catch (error) {
      console.warn("\u26A0\uFE0F  Continuing without scheduler...");
    }
    try {
      const { startYouTubeScheduler: startYouTubeScheduler2 } = await Promise.resolve().then(() => (init_scheduled_youtube_fetch(), scheduled_youtube_fetch_exports));
      startYouTubeScheduler2(storage2);
    } catch (error) {
      console.error("\u274C Failed to initialize YouTube scheduler:", error);
      console.warn("\u26A0\uFE0F  Continuing without YouTube scheduler...");
    }
    if (sentryEnabled) {
      try {
        setupExpressErrorHandler(app);
      } catch (error) {
        console.warn("\u26A0\uFE0F Sentry error handler not available:", error);
      }
    }
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("Global error handler:", err);
      res.status(status).json({ message });
    });
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    const PORT = parseInt(process.env.PORT || "5001", 10);
    server.listen(PORT, "0.0.0.0", () => {
      log(`Server running on port ${PORT}`);
      if (process.env.EMAIL_SCHEDULER_ENABLED === "true") {
        Promise.resolve().then(() => (init_email_scheduler_service(), email_scheduler_service_exports)).then(({ emailScheduler: emailScheduler2 }) => {
          emailScheduler2.start();
        }).catch((error) => {
          console.error("Failed to start email scheduler:", error);
        });
      } else {
        log("Email scheduler disabled (set EMAIL_SCHEDULER_ENABLED=true to enable)");
      }
    });
    const shutdown = async () => {
      log("received shutdown signal, closing server");
      if (process.env.EMAIL_SCHEDULER_ENABLED === "true") {
        const { emailScheduler: emailScheduler2 } = await Promise.resolve().then(() => (init_email_scheduler_service(), email_scheduler_service_exports));
        emailScheduler2.stop();
      }
      const { closeRedisConnection: closeRedisConnection2 } = await Promise.resolve().then(() => (init_redis_config(), redis_config_exports));
      await closeRedisConnection2();
      server.close(() => {
        log("server closed");
        process.exit(0);
      });
      setTimeout(() => process.exit(1), 1e4).unref();
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
