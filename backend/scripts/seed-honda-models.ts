import 'dotenv/config';
import { InsertModel } from '../server/validation/schemas';

const API_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:5001';
const ADMIN_TOKEN = process.env.BACKEND_ADMIN_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLTE3NjE4MTcwODgyMTMiLCJlbWFpbCI6ImFkbWluQG1vdG9yb2N0YW5lLmNvbSIsIm5hbWUiOiJBZG1pbiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTc2MzUzNzAwOSwiZXhwIjoxNzYzNjIzNDA5fQ.3y0dvJPaV1pV2euPtMdGDDMCBLAzHldu3hlunKvh-4U';

const BRAND_ID = 'brand-honda';

type ModelSeed = Omit<InsertModel, 'brandId'> & { skip?: boolean };

const createParagraph = (lines: string[]): string => lines.join('\n');

const fuelEconomy = (claimed: string, city: string, highway: string) => ({
  companyClaimed: claimed,
  cityRealWorld: city,
  highwayRealWorld: highway,
});

const defaultFaqs = (model: string, priceHint: string, mileageHint: string, seating = '5 seats') => [
  {
    question: `What is the ex-showroom price range of the ${model}?`,
    answer: `On-road prices vary by city, but the ${model} typically starts around ${priceHint} for the base variant.`,
  },
  {
    question: `What mileage can I expect from the ${model}?`,
    answer: `In daily use, the ${model} delivers roughly ${mileageHint} depending on driving style and fuel type.`,
  },
  {
    question: `How many people can the ${model} seat comfortably?`,
    answer: `The ${model} offers ${seating} with clever packaging to free up additional cargo room when needed.`,
  },
];

const rawModels = [
  {
    name: 'Amaze',
    status: 'active',
    isPopular: true,
    popularRank: 1,
    isNew: true,
    bodyType: 'Sedan',
    subBodyType: 'Compact sedan',
    launchDate: '2024-12',
    seating: 5,
    fuelTypes: ["petrol"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Honda Amaze combines modern design with practical engineering, offering petrol options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Compact sedan with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 90 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Amaze showcases Honda\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Amaze a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Amaze is a strong contender in the Compact sedan.',
    engineSummaries: [
      {
        title: '1.2L i-VTEC Petrol MT',
        summary:
          '1.2L i-VTEC Petrol MT delivering 90 bhp with 110 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '90 bhp',
        torque: '110 Nm',
        speed: '5-speed manual',
      },
      {
        title: '1.2L i-VTEC Petrol CVT',
        summary:
          '1.2L i-VTEC Petrol CVT delivering 90 bhp with 110 Nm of torque for daily driving needs.',
        transmission: 'CVT',
        power: '90 bhp',
        torque: '110 Nm',
        speed: 'CVT',
      },
    ],
    mileageData: [
      { engineName: '1.2L i-VTEC Petrol MT', ...fuelEconomy('18.65 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.2L i-VTEC Petrol CVT', ...fuelEconomy('18.65 kmpl', '14 kmpl', '17 kmpl') },
    ],
    faqs: defaultFaqs('Honda Amaze', '₹8.0–10.9 lakh', '18.65 kmpl', '5 seats'),
  },
  {
    name: 'City',
    status: 'active',
    isPopular: true,
    popularRank: 2,
    isNew: false,
    bodyType: 'Sedan',
    subBodyType: 'Mid-size sedan',
    launchDate: '2023-05',
    seating: 5,
    fuelTypes: ["petrol"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Honda City combines modern design with practical engineering, offering petrol options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Mid-size sedan with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 121 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The City showcases Honda\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the City a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the City is a strong contender in the Mid-size sedan.',
    engineSummaries: [
      {
        title: '1.5L i-VTEC Petrol MT',
        summary:
          '1.5L i-VTEC Petrol MT delivering 121 bhp with 145 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '121 bhp',
        torque: '145 Nm',
        speed: '6-speed manual',
      },
      {
        title: '1.5L i-VTEC Petrol CVT',
        summary:
          '1.5L i-VTEC Petrol CVT delivering 121 bhp with 145 Nm of torque for daily driving needs.',
        transmission: 'CVT',
        power: '121 bhp',
        torque: '145 Nm',
        speed: 'CVT',
      },
    ],
    mileageData: [
      { engineName: '1.5L i-VTEC Petrol MT', ...fuelEconomy('18.4 kmpl', '13 kmpl', '16 kmpl') },
      { engineName: '1.5L i-VTEC Petrol CVT', ...fuelEconomy('18.4 kmpl', '13 kmpl', '16 kmpl') },
    ],
    faqs: defaultFaqs('Honda City', '₹11.8–16.4 lakh', '18.4 kmpl', '5 seats'),
  },
  {
    name: 'City Hybrid',
    status: 'active',
    isPopular: true,
    popularRank: 3,
    isNew: false,
    bodyType: 'Sedan',
    subBodyType: 'Hybrid sedan',
    launchDate: '2023-05',
    seating: 5,
    fuelTypes: ["strong hybrid"],
    transmissions: ["e-CVT"],
    headerSeo:
      'The Honda City Hybrid combines modern design with practical engineering, offering strong hybrid options and e-CVT transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Hybrid sedan with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 126 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The City Hybrid showcases Honda\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the City Hybrid a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the City Hybrid is a strong contender in the Hybrid sedan.',
    engineSummaries: [
      {
        title: '1.5L i-MMD Hybrid e-CVT',
        summary:
          '1.5L i-MMD Hybrid e-CVT delivering 126 bhp with 253 Nm of torque for daily driving needs.',
        transmission: 'e-CVT',
        power: '126 bhp',
        torque: '253 Nm',
        speed: 'e-CVT',
      },
    ],
    mileageData: [
      { engineName: '1.5L i-MMD Hybrid e-CVT', ...fuelEconomy('26.5 kmpl', '21 kmpl', '24 kmpl') },
    ],
    faqs: defaultFaqs('Honda City Hybrid', '₹19.5–20.6 lakh', '26.5 kmpl', '5 seats'),
  },
  {
    name: 'Elevate',
    status: 'active',
    isPopular: true,
    popularRank: 4,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Compact SUV',
    launchDate: '2023-09',
    seating: 5,
    fuelTypes: ["petrol"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Honda Elevate combines modern design with practical engineering, offering petrol options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Compact SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 121 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Elevate showcases Honda\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Elevate a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Elevate is a strong contender in the Compact SUV.',
    engineSummaries: [
      {
        title: '1.5L i-VTEC Petrol MT',
        summary:
          '1.5L i-VTEC Petrol MT delivering 121 bhp with 145 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '121 bhp',
        torque: '145 Nm',
        speed: '6-speed manual',
      },
      {
        title: '1.5L i-VTEC Petrol CVT',
        summary:
          '1.5L i-VTEC Petrol CVT delivering 121 bhp with 145 Nm of torque for daily driving needs.',
        transmission: 'CVT',
        power: '121 bhp',
        torque: '145 Nm',
        speed: 'CVT',
      },
    ],
    mileageData: [
      { engineName: '1.5L i-VTEC Petrol MT', ...fuelEconomy('16.92 kmpl', '12 kmpl', '15 kmpl') },
      { engineName: '1.5L i-VTEC Petrol CVT', ...fuelEconomy('16.92 kmpl', '12 kmpl', '15 kmpl') },
    ],
    faqs: defaultFaqs('Honda Elevate', '₹11.9–16.9 lakh', '16.92 kmpl', '5 seats'),
  },
];

const normalizeModel = (entry: Partial<ModelSeed> & { name: string }): ModelSeed =>
  ({
    status: entry.status ?? 'active',
    isPopular: entry.isPopular ?? false,
    isNew: entry.isNew ?? false,
    seating: entry.seating ?? 5,
    fuelTypes: entry.fuelTypes ?? [],
    transmissions: entry.transmissions ?? [],
    engineSummaries: entry.engineSummaries ?? [],
    mileageData: entry.mileageData ?? [],
    faqs: entry.faqs ?? [],
    heroImage: entry.heroImage ?? null,
    galleryImages: entry.galleryImages ?? [],
    keyFeatureImages: entry.keyFeatureImages ?? [],
    spaceComfortImages: entry.spaceComfortImages ?? [],
    storageConvenienceImages: entry.storageConvenienceImages ?? [],
    colorImages: entry.colorImages ?? [],
    ...entry,
  }) as ModelSeed;

const models: ModelSeed[] = rawModels.map(normalizeModel);

const DRY_RUN = process.env.DRY_RUN === 'true';

const log = (...args: unknown[]) => console.log('[seed-honda-models]', ...args);

async function fetchExistingModelNames(): Promise<Set<string>> {
  try {
    const url = `${API_BASE_URL}/api/models?brandId=${encodeURIComponent(BRAND_ID)}`;
    const response = await fetch(url);
    if (!response.ok) {
      log('⚠️  Unable to fetch existing models:', response.status, response.statusText);
      return new Set();
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      return new Set();
    }
    return new Set(
      data
        .filter((item) => typeof item?.name === 'string')
        .map((item) => item.name.toLowerCase()),
    );
  } catch (error) {
    log('⚠️  Failed to fetch existing models:', error);
    return new Set();
  }
}

async function createModel(seed: ModelSeed): Promise<void> {
  const { skip, ...modelData } = seed;
  if (skip) {
    log(`⏭️  Skipping ${seed.name} (marked skip)`);
    return;
  }

  const payload: InsertModel = {
    brandId: BRAND_ID,
    ...(modelData as Omit<InsertModel, 'brandId'>),
  };

  if (DRY_RUN) {
    log(`📝 DRY RUN - would create model: ${payload.name}`);
    return;
  }

  const response = await fetch(`${API_BASE_URL}/api/models`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  const created = await response.json();
  log(`✅ Created model ${created.name || payload.name} (${created.id})`);
}

async function run() {
  log(`🚀 Starting Honda models seeding for ${models.length} entries`);
  log(`📡 Backend: ${API_BASE_URL}`);

  const existing = await fetchExistingModelNames();
  log(`ℹ️  Found ${existing.size} existing models for brand ${BRAND_ID}`);

  let createdCount = 0;
  for (const seed of models) {
    if (existing.has(seed.name.toLowerCase())) {
      log(`↩️  Model already exists, skipping: ${seed.name}`);
      continue;
    }

    try {
      await createModel(seed);
      createdCount += 1;
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      log(`❌ Failed to create ${seed.name}:`, error);
    }
  }

  log(`🏁 Completed seeding. Created ${createdCount} models, skipped ${models.length - createdCount}.`);
}

run().catch((error) => {
  log('❌ Script aborted:', error);
  process.exit(1);
});
