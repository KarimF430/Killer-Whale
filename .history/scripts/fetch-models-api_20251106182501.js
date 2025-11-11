#!/usr/bin/env node

/**
 * Accurate Model Data Fetcher using Public APIs
 * Fetches car model data from publicly available APIs and structured data
 * 
 * Usage:
 *   node scripts/fetch-models-api.js                    # Fetch and save to CSV
 *   BACKEND_TOKEN=xxx node scripts/fetch-models-api.js --upload  # Upload to backend
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';
const BACKEND_TOKEN = process.env.BACKEND_TOKEN || '';

// Delay between requests to avoid rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch brands from backend
 */
async function fetchBrands() {
  console.log('📡 Fetching brands from backend...');
  const response = await axios.get(`${BACKEND_URL}/api/brands`);
  console.log(`✅ Found ${response.data.length} brands\n`);
  return response.data;
}

/**
 * Fetch models from CarDekho (publicly available)
 */
async function fetchCarDekhoModels(brandName) {
  // Convert brand name to CarDekho slug format
  const brandSlug = brandName.toLowerCase()
    .replace('maruti suzuki', 'maruti')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  const url = `https://www.cardekho.com/${brandSlug}-cars`;
  
  console.log(`  📡 Fetching from: ${url}`);
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);
    const models = [];

    // Extract model links from href patterns
    $('a[href]').each((i, elem) => {
      const href = $(elem).attr('href');
      const text = $(elem).text().trim();
      
      // Match pattern: /brand/model-name
      const match = href && href.match(new RegExp(`^/${brandSlug}/([a-z0-9-]+)$`));
      
      if (match && match[1]) {
        const modelSlug = match[1];
        
        // Skip non-model pages
        if (modelSlug === 'gallery' || modelSlug === 'reviews' || 
            modelSlug === 'news' || modelSlug === 'videos') {
          return;
        }
        
        // Convert slug to name
        const modelName = modelSlug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        models.push({
          name: modelName,
          slug: modelSlug,
          url: `https://www.cardekho.com${href}`,
          source: 'cardekho'
        });
      }
    });

    // Deduplicate by slug
    const uniqueModels = Array.from(
      new Map(models.map(m => [m.slug, m])).values()
    );

    console.log(`  ✅ Found ${uniqueModels.length} models`);
    return uniqueModels;

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return [];
  }
}

/**
 * Fetch detailed model specifications
 */
async function fetchModelSpecs(brandName, modelName, modelUrl) {
  console.log(`    🔍 Fetching specs for ${modelName}...`);
  
  const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const modelSlug = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  const urls = [
    modelUrl,
    `https://www.cardekho.com/${brandSlug}/${modelSlug}`,
    `https://www.carwale.com/${brandSlug}-cars/${modelSlug}/`
  ].filter(Boolean);

  for (const url of urls) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // Extract structured data
      const specs = {
        price: '',
        mileage: '',
        engine: '',
        transmission: '',
        fuelType: '',
        seating: '',
        bodyType: '',
        description: '',
        pros: [],
        cons: []
      };

      // Extract from meta tags
      specs.description = $('meta[name="description"]').attr('content') || '';
      
      // Extract price
      const priceText = $('.price, .priceRange, [data-price]').first().text().trim();
      if (priceText) specs.price = priceText;

      // Extract specifications from tables
      $('table tr, .specs li, .specification-item').each((i, elem) => {
        const $elem = $(elem);
        const label = $elem.find('td:first, .label, dt').text().toLowerCase().trim();
        const value = $elem.find('td:last, .value, dd').text().trim();

        if (label.includes('mileage') || label.includes('fuel efficiency')) {
          specs.mileage = value;
        } else if (label.includes('engine') || label.includes('displacement')) {
          specs.engine = value;
        } else if (label.includes('transmission') || label.includes('gearbox')) {
          specs.transmission = value;
        } else if (label.includes('fuel') && !label.includes('tank')) {
          specs.fuelType = value;
        } else if (label.includes('seating') || label.includes('seats')) {
          specs.seating = value;
        } else if (label.includes('body') || label.includes('type')) {
          specs.bodyType = value;
        }
      });

      // Extract pros and cons
      $('.pros li, .advantages li').each((i, elem) => {
        const text = $(elem).text().trim();
        if (text) specs.pros.push(text);
      });

      $('.cons li, .disadvantages li').each((i, elem) => {
        const text = $(elem).text().trim();
        if (text) specs.cons.push(text);
      });

      if (specs.price || specs.mileage || specs.description) {
        console.log(`    ✅ Found specs from ${url.substring(0, 50)}...`);
        return specs;
      }

    } catch (error) {
      console.log(`    ⚠️  Could not fetch from ${url.substring(0, 50)}...`);
    }
  }

  return null;
}

/**
 * Generate complete model data
 */
function generateCompleteModelData(brand, modelInfo, specs) {
  const model = {
    brandId: brand.id,
    name: modelInfo.name,
    isPopular: false,
    isNew: false,
    popularRank: null,
    newRank: null,
    bodyType: specs?.bodyType || '',
    subBodyType: '',
    launchDate: 'Launched',
    fuelTypes: [],
    transmissions: [],
    status: 'active',
    headerSeo: '',
    pros: '',
    cons: '',
    description: '',
    exteriorDesign: '',
    comfortConvenience: '',
    engineSummaries: [],
    mileageData: [],
    faqs: []
  };

  // Parse fuel types
  if (specs?.fuelType) {
    const fuels = specs.fuelType.split(/[,/&]/).map(f => f.trim()).filter(Boolean);
    model.fuelTypes = fuels;
  }

  // Parse transmissions
  if (specs?.transmission) {
    const trans = specs.transmission.split(/[,/&]/).map(t => {
      const lower = t.toLowerCase();
      if (lower.includes('manual')) return 'Manual';
      if (lower.includes('automatic') || lower.includes('amt') || lower.includes('dct') || lower.includes('cvt')) return 'Automatic';
      return t.trim();
    }).filter(Boolean);
    model.transmissions = [...new Set(trans)];
  }

  // Generate SEO header
  model.headerSeo = `The ${brand.name} ${modelInfo.name} is ${specs?.bodyType || 'a car'} available in India${specs?.price ? ` starting at ${specs.price}` : ''}. ${specs?.fuelType ? `Available in ${specs.fuelType}.` : ''}`;

  // Description
  model.description = specs?.description || `The ${brand.name} ${modelInfo.name} is a popular model in India known for its quality and performance.`;

  // Pros and cons
  if (specs?.pros && specs.pros.length > 0) {
    model.pros = specs.pros.map(p => `• ${p}`).join('\n');
  }
  if (specs?.cons && specs.cons.length > 0) {
    model.cons = specs.cons.map(c => `• ${c}`).join('\n');
  }

  // Mileage data
  if (specs?.mileage) {
    model.mileageData.push({
      engineName: specs.engine || 'Standard',
      companyClaimed: specs.mileage,
      cityRealWorld: '',
      highwayRealWorld: ''
    });
  }

  // Basic FAQ
  model.faqs = [
    {
      question: `What is the price of ${brand.name} ${modelInfo.name}?`,
      answer: specs?.price ? `The ${brand.name} ${modelInfo.name} is priced at ${specs.price} in India.` : `Please check with your nearest ${brand.name} dealer for current pricing.`
    },
    {
      question: `What is the mileage of ${brand.name} ${modelInfo.name}?`,
      answer: specs?.mileage ? `The ${brand.name} ${modelInfo.name} delivers ${specs.mileage} mileage.` : `Mileage varies based on driving conditions and variant.`
    },
    {
      question: `What fuel type is available in ${brand.name} ${modelInfo.name}?`,
      answer: model.fuelTypes.length > 0 ? `The ${brand.name} ${modelInfo.name} is available in ${model.fuelTypes.join(', ')} fuel options.` : `Please check with dealer for available fuel options.`
    }
  ];

  return model;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Accurate Model Data Fetch\n');
  console.log('=' .repeat(60));
  
  try {
    // Fetch brands
    const brands = await fetchBrands();
    
    const allModels = [];
    let totalProcessed = 0;

    // Process each brand
    for (const brand of brands) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🏢 ${brand.name}`);
      console.log(`${'='.repeat(60)}`);

      // Fetch models list
      const models = await fetchCarDekhoModels(brand.name);
      
      if (models.length === 0) {
        console.log(`  ⚠️  No models found, skipping...`);
        continue;
      }

      // Fetch specs for each model (limit to 5 per brand for now)
      const modelsToProcess = models.slice(0, 5);
      console.log(`  📊 Processing ${modelsToProcess.length} models...\n`);

      for (const modelInfo of modelsToProcess) {
        const specs = await fetchModelSpecs(brand.name, modelInfo.name, modelInfo.url);
        const completeModel = generateCompleteModelData(brand, modelInfo, specs);
        allModels.push(completeModel);
        totalProcessed++;

        // Rate limiting
        await delay(2000);
      }

      // Delay between brands
      await delay(3000);
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 FETCH COMPLETE`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Total models fetched: ${allModels.length}`);
    console.log(`Total brands processed: ${brands.length}\n`);

    // Save to JSON for review
    const jsonPath = path.join(process.cwd(), 'fetched_models_data.json');
    fs.writeFileSync(jsonPath, JSON.stringify(allModels, null, 2));
    console.log(`✅ Saved to: ${jsonPath}`);

    // Save to CSV
    const csvPath = path.join(process.cwd(), 'fetched_models_data.csv');
    const csvContent = generateCSV(allModels);
    fs.writeFileSync(csvPath, csvContent);
    console.log(`✅ Saved to: ${csvPath}`);

    // Upload if requested
    if (process.argv.includes('--upload')) {
      if (!BACKEND_TOKEN) {
        console.log(`\n⚠️  BACKEND_TOKEN not set. Skipping upload.`);
        console.log(`   Set token: BACKEND_TOKEN=your_token node scripts/fetch-models-api.js --upload`);
      } else {
        await uploadModels(allModels);
      }
    } else {
      console.log(`\n💡 To upload to backend, run:`);
      console.log(`   BACKEND_TOKEN=your_token node scripts/fetch-models-api.js --upload`);
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

/**
 * Generate CSV from models
 */
function generateCSV(models) {
  const headers = [
    'brandId', 'name', 'bodyType', 'fuelTypes', 'transmissions',
    'headerSeo', 'description', 'pros', 'cons', 'status'
  ];

  const rows = models.map(m => [
    m.brandId,
    `"${m.name.replace(/"/g, '""')}"`,
    `"${m.bodyType}"`,
    `"${m.fuelTypes.join(', ')}"`,
    `"${m.transmissions.join(', ')}"`,
    `"${m.headerSeo.replace(/"/g, '""')}"`,
    `"${m.description.replace(/"/g, '""')}"`,
    `"${m.pros.replace(/"/g, '""')}"`,
    `"${m.cons.replace(/"/g, '""')}"`,
    m.status
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

/**
 * Upload models to backend
 */
async function uploadModels(models) {
  console.log(`\n📤 Uploading ${models.length} models to backend...`);
  
  let success = 0;
  let failed = 0;

  for (const model of models) {
    try {
      await axios.post(`${BACKEND_URL}/api/models`, model, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BACKEND_TOKEN}`
        }
      });
      console.log(`  ✅ ${model.name}`);
      success++;
      await delay(500);
    } catch (error) {
      console.error(`  ❌ ${model.name}: ${error.response?.data?.message || error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Upload Summary:`);
  console.log(`   ✅ Success: ${success}`);
  console.log(`   ❌ Failed: ${failed}`);
}

// Run
main();
