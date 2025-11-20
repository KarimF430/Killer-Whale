import 'dotenv/config';
import { InsertVariant } from '../server/validation/schemas';

const API_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:5001';
const ADMIN_TOKEN = process.env.BACKEND_ADMIN_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLTE3NjE4MTcwODgyMTMiLCJlbWFpbCI6ImFkbWluQG1vdG9yb2N0YW5lLmNvbSIsIm5hbWUiOiJBZG1pbiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTc2MzUzNzAwOSwiZXhwIjoxNzYzNjIzNDA5fQ.3y0dvJPaV1pV2euPtMdGDDMCBLAzHldu3hlunKvh-4U';

const DRY_RUN = process.env.DRY_RUN === 'true';

const log = (...args: unknown[]) => console.log('[generate-variants]', ...args);

// Trim levels in order of features/price
const TRIM_LEVELS = ['E', 'EX', 'S', 'S(O)', 'SX', 'SX Tech', 'SX(O)'];

// Transmission types with price multipliers
const TRANSMISSION_MULTIPLIERS: Record<string, number> = {
    'manual': 1.0,
    'amt': 1.08,
    'cvt': 1.12,
    'imt': 1.10,
    'automatic': 1.15,
    'dct': 1.18,
    'torque converter': 1.15,
};

// Fuel type price adjustments
const FUEL_PRICE_ADJUSTMENTS: Record<string, number> = {
    'petrol': 0,
    'diesel': 150000,
    'cng': -50000,
    'electric': 400000,
    'hybrid': 300000,
};

interface Model {
    id: string;
    name: string;
    brandId: string;
    fuelTypes: string[];
    transmissions: string[];
    bodyType?: string;
    seating?: number;
}

interface VariantTemplate {
    name: string;
    price: number;
    fuelType: string;
    transmission: string;
    trim: string;
    enginePower?: string;
    engineTorque?: string;
    mileage?: string;
}

// Estimate base price based on body type and brand
function estimateBasePrice(model: Model): number {
    const bodyTypePrices: Record<string, number> = {
        'Hatchback': 600000,
        'Sedan': 900000,
        'SUV': 1200000,
        'Compact SUV': 1000000,
        'Mid-size SUV': 1500000,
        'Premium SUV': 3000000,
        'Luxury SUV': 6000000,
        'MPV': 1100000,
        'Coupe': 4000000,
        'Convertible': 5000000,
    };

    return bodyTypePrices[model.bodyType || 'Hatchback'] || 800000;
}

// Generate variant name
function generateVariantName(trim: string, fuel: string, transmission: string): string {
    const fuelMap: Record<string, string> = {
        'petrol': 'Petrol',
        'diesel': 'Diesel',
        'cng': 'CNG',
        'electric': 'Electric',
        'hybrid': 'Hybrid',
    };

    const transMap: Record<string, string> = {
        'manual': 'MT',
        'amt': 'AMT',
        'cvt': 'CVT',
        'imt': 'iMT',
        'automatic': 'AT',
        'dct': 'DCT',
        'torque converter': 'AT',
    };

    const fuelName = fuelMap[fuel.toLowerCase()] || fuel;
    const transName = transMap[transmission.toLowerCase()] || transmission;

    return `${trim} ${fuelName} ${transName}`;
}

// Calculate variant price
function calculateVariantPrice(
    basePrice: number,
    trimIndex: number,
    fuel: string,
    transmission: string
): number {
    // Base price increases with trim level
    const trimMultiplier = 1 + (trimIndex * 0.12); // Each trim adds ~12%

    // Apply transmission multiplier
    const transMultiplier = TRANSMISSION_MULTIPLIERS[transmission.toLowerCase()] || 1.0;

    // Apply fuel adjustment
    const fuelAdjustment = FUEL_PRICE_ADJUSTMENTS[fuel.toLowerCase()] || 0;

    const price = (basePrice * trimMultiplier * transMultiplier) + fuelAdjustment;

    // Round to nearest 100
    return Math.round(price / 100) * 100;
}

// Generate engine specs based on fuel type and body type
function generateEngineSpecs(fuel: string, bodyType: string = 'Hatchback'): {
    power: string;
    torque: string;
    capacity: string;
    mileage: string;
} {
    const specs: Record<string, Record<string, any>> = {
        'petrol': {
            'Hatchback': { power: '83 Bhp', torque: '113 Nm', capacity: '1197cc', mileage: '22' },
            'Sedan': { power: '105 Bhp', torque: '138 Nm', capacity: '1462cc', mileage: '19' },
            'SUV': { power: '115 Bhp', torque: '144 Nm', capacity: '1497cc', mileage: '17' },
            'Compact SUV': { power: '113 Bhp', torque: '144 Nm', capacity: '1497cc', mileage: '17.4' },
        },
        'diesel': {
            'Hatchback': { power: '75 Bhp', torque: '190 Nm', capacity: '1248cc', mileage: '24' },
            'Sedan': { power: '95 Bhp', torque: '215 Nm', capacity: '1461cc', mileage: '21' },
            'SUV': { power: '116 Bhp', torque: '250 Nm', capacity: '1493cc', mileage: '19' },
            'Compact SUV': { power: '114 Bhp', torque: '250 Nm', capacity: '1493cc', mileage: '19' },
        },
        'electric': {
            'default': { power: '136 Bhp', torque: '245 Nm', capacity: 'Electric', mileage: '300 km range' },
        },
        'cng': {
            'Hatchback': { power: '69 Bhp', torque: '95 Nm', capacity: '1197cc', mileage: '26 km/kg' },
        },
    };

    const fuelSpecs = specs[fuel.toLowerCase()] || specs['petrol'];
    const bodySpecs = fuelSpecs[bodyType] || fuelSpecs['Hatchback'] || fuelSpecs['default'] || fuelSpecs[Object.keys(fuelSpecs)[0]];

    return bodySpecs;
}

// Generate variants for a model
function generateVariantsForModel(model: Model): VariantTemplate[] {
    const variants: VariantTemplate[] = [];
    const basePrice = estimateBasePrice(model);

    // Determine which trim levels to use (fewer trims for budget cars)
    const trimsToUse = basePrice < 800000
        ? TRIM_LEVELS.slice(0, 4)  // E, EX, S, S(O)
        : TRIM_LEVELS;

    for (const fuel of model.fuelTypes) {
        for (const transmission of model.transmissions) {
            const engineSpecs = generateEngineSpecs(fuel, model.bodyType);

            for (let i = 0; i < trimsToUse.length; i++) {
                const trim = trimsToUse[i];
                const price = calculateVariantPrice(basePrice, i, fuel, transmission);

                variants.push({
                    name: generateVariantName(trim, fuel, transmission),
                    price,
                    fuelType: fuel,
                    transmission,
                    trim,
                    enginePower: engineSpecs.power,
                    engineTorque: engineSpecs.torque,
                    mileage: engineSpecs.mileage,
                });
            }
        }
    }

    return variants;
}

// Create full variant object
function createVariantObject(
    model: Model,
    template: VariantTemplate
): Omit<InsertVariant, 'brandId' | 'modelId'> {
    const engineSpecs = generateEngineSpecs(template.fuelType, model.bodyType);

    return {
        name: template.name,
        price: template.price,
        status: 'active',
        fuelType: template.fuelType,
        fuel: template.fuelType.charAt(0).toUpperCase() + template.fuelType.slice(1),
        transmission: template.transmission.charAt(0).toUpperCase() + template.transmission.slice(1),

        // Engine specs
        engineName: `${engineSpecs.capacity} ${template.fuelType.charAt(0).toUpperCase() + template.fuelType.slice(1)}`,
        enginePower: template.enginePower,
        engineTorque: template.engineTorque,
        engineCapacity: engineSpecs.capacity,
        engineTransmission: template.transmission.charAt(0).toUpperCase() + template.transmission.slice(1),

        // Mileage
        mileageCompanyClaimed: template.mileage,
        mileageCityRealWorld: String(Math.round(parseFloat(template.mileage || '15') * 0.7)),
        mileageHighwayRealWorld: String(Math.round(parseFloat(template.mileage || '15') * 0.85)),

        // Dimensions (generic, can be refined)
        seatingCapacity: String(model.seating || 5),
        groundClearance: model.bodyType?.includes('SUV') ? '190mm' : '165mm',

        // Safety
        airbags: template.trim.includes('SX') ? '6-Airbags' : '2-Airbags',
        abs: 'Yes',
        ebd: 'Yes',

        // Features
        keyFeatures: `${template.trim} variant with ${template.fuelType} engine and ${template.transmission} transmission`,
        description: `${model.name} ${template.name} variant priced at ₹${(template.price / 100000).toFixed(2)} Lakh`,
    };
}

// Fetch all models
async function fetchAllModels(): Promise<Model[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/models`);
        if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        log('❌ Error fetching models:', error);
        return [];
    }
}

// Check if model already has variants
async function hasVariants(modelId: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/variants?modelId=${modelId}`);
        if (!response.ok) return false;
        const variants = await response.json();
        return Array.isArray(variants) && variants.length > 0;
    } catch (error) {
        return false;
    }
}

// Create variant via API
async function createVariant(variant: InsertVariant): Promise<void> {
    if (DRY_RUN) {
        log(`📝 DRY RUN - would create variant: ${variant.name} @ ₹${(variant.price / 100000).toFixed(2)}L`);
        return;
    }

    const response = await fetch(`${API_BASE_URL}/api/variants`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify(variant),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const created = await response.json();
    log(`✅ Created variant: ${created.name || variant.name}`);
}

// Main execution
async function run() {
    log(`🚀 Starting variant generation`);
    log(`📡 Backend: ${API_BASE_URL}`);
    log(`🔧 Dry run: ${DRY_RUN}`);

    const models = await fetchAllModels();
    log(`📊 Found ${models.length} models`);

    let processedCount = 0;
    let skippedCount = 0;
    let createdCount = 0;

    for (const model of models) {
        // Skip Creta (already has variants)
        if (model.name === 'Creta' || await hasVariants(model.id)) {
            log(`↩️  Skipping ${model.name} (already has variants)`);
            skippedCount++;
            continue;
        }

        log(`\n🚗 Processing ${model.name}...`);

        const variantTemplates = generateVariantsForModel(model);
        log(`   Generated ${variantTemplates.length} variant templates`);

        for (const template of variantTemplates) {
            try {
                const variantData = createVariantObject(model, template);
                const fullVariant: InsertVariant = {
                    ...variantData,
                    brandId: model.brandId,
                    modelId: model.id,
                };

                await createVariant(fullVariant);
                createdCount++;

                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                log(`   ❌ Failed to create variant ${template.name}:`, error);
            }
        }

        processedCount++;
    }

    log(`\n🏁 Completed!`);
    log(`   Processed: ${processedCount} models`);
    log(`   Skipped: ${skippedCount} models`);
    log(`   Created: ${createdCount} variants`);
}

run().catch((error) => {
    log('❌ Script aborted:', error);
    process.exit(1);
});
