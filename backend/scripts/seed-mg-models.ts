import 'dotenv/config';
import { InsertModel } from '../server/validation/schemas';

const API_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:5001';
const ADMIN_TOKEN = process.env.BACKEND_ADMIN_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLTE3NjE4MTcwODgyMTMiLCJlbWFpbCI6ImFkbWluQG1vdG9yb2N0YW5lLmNvbSIsIm5hbWUiOiJBZG1pbiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTc2MzUzNzAwOSwiZXhwIjoxNzYzNjIzNDA5fQ.3y0dvJPaV1pV2euPtMdGDDMCBLAzHldu3hlunKvh-4U';

const BRAND_ID = 'brand-mg-motor';

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
    name: 'Comet EV',
    status: 'active',
    isPopular: true,
    popularRank: 1,
    isNew: false,
    bodyType: 'Hatchback',
    subBodyType: 'Electric micro car',
    launchDate: '2023-04',
    seating: 4,
    fuelTypes: ["electric"],
    transmissions: ["automatic"],
    headerSeo:
      'The MG Motor Comet EV combines modern design with practical engineering, offering electric options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Electric micro car with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 42 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Comet EV showcases MG Motor\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Comet EV a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Comet EV is a strong contender in the Electric micro car.',
    engineSummaries: [
      {
        title: 'Electric Motor',
        summary:
          'Electric Motor delivering 42 bhp with 110 Nm of torque for daily driving needs.',
        transmission: 'Single-speed',
        power: '42 bhp',
        torque: '110 Nm',
        speed: 'Single-speed',
      },
    ],
    mileageData: [
      { engineName: 'Electric Motor', ...fuelEconomy('230 km range', 'N/A', 'N/A') },
    ],
    faqs: defaultFaqs('MG Motor Comet EV', '₹6.9–9.4 lakh', '230 km range', '4 seats'),
  },
  {
    name: 'Windsor EV',
    status: 'active',
    isPopular: true,
    popularRank: 2,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: 'Electric crossover',
    launchDate: '2024-09',
    seating: 5,
    fuelTypes: ["electric"],
    transmissions: ["automatic"],
    headerSeo:
      'The MG Motor Windsor EV combines modern design with practical engineering, offering electric options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Electric crossover with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 136 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Windsor EV showcases MG Motor\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Windsor EV a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Windsor EV is a strong contender in the Electric crossover.',
    engineSummaries: [
      {
        title: 'Electric Motor',
        summary:
          'Electric Motor delivering 136 bhp with 200 Nm of torque for daily driving needs.',
        transmission: 'Single-speed',
        power: '136 bhp',
        torque: '200 Nm',
        speed: 'Single-speed',
      },
    ],
    mileageData: [
      { engineName: 'Electric Motor', ...fuelEconomy('331 km range', 'N/A', 'N/A') },
    ],
    faqs: defaultFaqs('MG Motor Windsor EV', '₹9.9–14.5 lakh', '331 km range', '5 seats'),
  },
  {
    name: 'ZS EV',
    status: 'active',
    isPopular: true,
    popularRank: 3,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: 'Electric SUV',
    launchDate: '2024-03',
    seating: 5,
    fuelTypes: ["electric"],
    transmissions: ["automatic"],
    headerSeo:
      'The MG Motor ZS EV combines modern design with practical engineering, offering electric options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Electric SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 177 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The ZS EV showcases MG Motor\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the ZS EV a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the ZS EV is a strong contender in the Electric SUV.',
    engineSummaries: [
      {
        title: 'Electric Motor',
        summary:
          'Electric Motor delivering 177 bhp with 280 Nm of torque for daily driving needs.',
        transmission: 'Single-speed',
        power: '177 bhp',
        torque: '280 Nm',
        speed: 'Single-speed',
      },
    ],
    mileageData: [
      { engineName: 'Electric Motor', ...fuelEconomy('461 km range', 'N/A', 'N/A') },
    ],
    faqs: defaultFaqs('MG Motor ZS EV', '₹18.9–25.7 lakh', '461 km range', '5 seats'),
  },
  {
    name: 'Astor',
    status: 'active',
    isPopular: true,
    popularRank: 4,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Compact SUV',
    launchDate: '2023-12',
    seating: 5,
    fuelTypes: ["petrol"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The MG Motor Astor combines modern design with practical engineering, offering petrol options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Compact SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 140 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Astor showcases MG Motor\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Astor a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Astor is a strong contender in the Compact SUV.',
    engineSummaries: [
      {
        title: '1.5L Turbo Petrol MT',
        summary:
          '1.5L Turbo Petrol MT delivering 140 bhp with 220 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '140 bhp',
        torque: '220 Nm',
        speed: '6-speed manual',
      },
      {
        title: '1.5L Turbo Petrol CVT',
        summary:
          '1.5L Turbo Petrol CVT delivering 140 bhp with 220 Nm of torque for daily driving needs.',
        transmission: 'CVT',
        power: '140 bhp',
        torque: '220 Nm',
        speed: 'CVT',
      },
    ],
    mileageData: [
      { engineName: '1.5L Turbo Petrol MT', ...fuelEconomy('17.5 kmpl', '13 kmpl', '16 kmpl') },
      { engineName: '1.5L Turbo Petrol CVT', ...fuelEconomy('17.5 kmpl', '13 kmpl', '16 kmpl') },
    ],
    faqs: defaultFaqs('MG Motor Astor', '₹9.9–18.8 lakh', '17.5 kmpl', '5 seats'),
  },
  {
    name: 'Hector',
    status: 'active',
    isPopular: true,
    popularRank: 5,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Mid-size SUV',
    launchDate: '2023-01',
    seating: 5,
    fuelTypes: ["petrol", "diesel"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The MG Motor Hector combines modern design with practical engineering, offering petrol, diesel options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Mid-size SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 143 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Hector showcases MG Motor\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Hector a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Hector is a strong contender in the Mid-size SUV.',
    engineSummaries: [
      {
        title: '1.5L Turbo Petrol MT',
        summary:
          '1.5L Turbo Petrol MT delivering 143 bhp with 250 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '143 bhp',
        torque: '250 Nm',
        speed: '6-speed manual',
      },
      {
        title: '1.5L Turbo Petrol CVT',
        summary:
          '1.5L Turbo Petrol CVT delivering 143 bhp with 250 Nm of torque for daily driving needs.',
        transmission: 'CVT',
        power: '143 bhp',
        torque: '250 Nm',
        speed: 'CVT',
      },
      {
        title: '2.0L Diesel MT',
        summary:
          '2.0L Diesel MT delivering 170 bhp with 350 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '170 bhp',
        torque: '350 Nm',
        speed: '6-speed manual',
      },
    ],
    mileageData: [
      { engineName: '1.5L Turbo Petrol MT', ...fuelEconomy('17.0 kmpl', '12 kmpl', '15 kmpl') },
      { engineName: '1.5L Turbo Petrol CVT', ...fuelEconomy('17.0 kmpl', '12 kmpl', '15 kmpl') },
      { engineName: '2.0L Diesel MT', ...fuelEconomy('17.0 kmpl', '12 kmpl', '15 kmpl') },
    ],
    faqs: defaultFaqs('MG Motor Hector', '₹14.7–22.0 lakh', '17.0 kmpl', '5 seats'),
  },
  {
    name: 'Hector Plus',
    status: 'active',
    isPopular: true,
    popularRank: 6,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: '3-row SUV',
    launchDate: '2023-01',
    seating: 7,
    fuelTypes: ["petrol", "diesel"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The MG Motor Hector Plus combines modern design with practical engineering, offering petrol, diesel options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the 3-row SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 143 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Hector Plus showcases MG Motor\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Hector Plus a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Hector Plus is a strong contender in the 3-row SUV.',
    engineSummaries: [
      {
        title: '1.5L Turbo Petrol MT',
        summary:
          '1.5L Turbo Petrol MT delivering 143 bhp with 250 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '143 bhp',
        torque: '250 Nm',
        speed: '6-speed manual',
      },
      {
        title: '2.0L Diesel MT',
        summary:
          '2.0L Diesel MT delivering 170 bhp with 350 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '170 bhp',
        torque: '350 Nm',
        speed: '6-speed manual',
      },
    ],
    mileageData: [
      { engineName: '1.5L Turbo Petrol MT', ...fuelEconomy('16.6 kmpl', '12 kmpl', '15 kmpl') },
      { engineName: '2.0L Diesel MT', ...fuelEconomy('16.6 kmpl', '12 kmpl', '15 kmpl') },
    ],
    faqs: defaultFaqs('MG Motor Hector Plus', '₹17.3–23.8 lakh', '16.6 kmpl', '7-seater'),
  },
  {
    name: 'Gloster',
    status: 'active',
    isPopular: true,
    popularRank: 7,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Full-size SUV',
    launchDate: '2023-10',
    seating: 7,
    fuelTypes: ["diesel"],
    transmissions: ["automatic"],
    headerSeo:
      'The MG Motor Gloster combines modern design with practical engineering, offering diesel options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Full-size SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 218 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Gloster showcases MG Motor\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Gloster a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Gloster is a strong contender in the Full-size SUV.',
    engineSummaries: [
      {
        title: '2.0L Twin-Turbo Diesel AT',
        summary:
          '2.0L Twin-Turbo Diesel AT delivering 218 bhp with 480 Nm of torque for daily driving needs.',
        transmission: '8-speed automatic',
        power: '218 bhp',
        torque: '480 Nm',
        speed: '8-speed automatic',
      },
    ],
    mileageData: [
      { engineName: '2.0L Twin-Turbo Diesel AT', ...fuelEconomy('13.9 kmpl', '10 kmpl', '13 kmpl') },
    ],
    faqs: defaultFaqs('MG Motor Gloster', '₹38.8–43.9 lakh', '13.9 kmpl', '7-seater'),
  },
  {
    name: 'Cyberster',
    status: 'active',
    isPopular: true,
    popularRank: 8,
    isNew: true,
    bodyType: 'Sports Car',
    subBodyType: 'Electric roadster',
    launchDate: '2025-03',
    seating: 2,
    fuelTypes: ["electric"],
    transmissions: ["automatic"],
    headerSeo:
      'The MG Motor Cyberster combines modern design with practical engineering, offering electric options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Electric roadster with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 536 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Cyberster showcases MG Motor\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Cyberster a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Cyberster is a strong contender in the Electric roadster.',
    engineSummaries: [
      {
        title: 'Dual Electric Motor',
        summary:
          'Dual Electric Motor delivering 536 bhp with 725 Nm of torque for daily driving needs.',
        transmission: 'Single-speed',
        power: '536 bhp',
        torque: '725 Nm',
        speed: 'Single-speed',
      },
    ],
    mileageData: [
      { engineName: 'Dual Electric Motor', ...fuelEconomy('580 km range', 'N/A', 'N/A') },
    ],
    faqs: defaultFaqs('MG Motor Cyberster', '₹65.0 lakh (expected)', '580 km range', '2 seats'),
  },
  {
    name: 'M9 EV',
    status: 'active',
    isPopular: true,
    popularRank: 9,
    isNew: true,
    bodyType: 'MPV',
    subBodyType: 'Electric luxury MPV',
    launchDate: '2025-05',
    seating: 7,
    fuelTypes: ["electric"],
    transmissions: ["automatic"],
    headerSeo:
      'The MG Motor M9 EV combines modern design with practical engineering, offering electric options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Electric luxury MPV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 245 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The M9 EV showcases MG Motor\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the M9 EV a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the M9 EV is a strong contender in the Electric luxury MPV.',
    engineSummaries: [
      {
        title: 'Electric Motor',
        summary:
          'Electric Motor delivering 245 bhp with 350 Nm of torque for daily driving needs.',
        transmission: 'Single-speed',
        power: '245 bhp',
        torque: '350 Nm',
        speed: 'Single-speed',
      },
    ],
    mileageData: [
      { engineName: 'Electric Motor', ...fuelEconomy('520 km range', 'N/A', 'N/A') },
    ],
    faqs: defaultFaqs('MG Motor M9 EV', '₹60.0–70.0 lakh (expected)', '520 km range', '7-seater'),
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

const log = (...args: unknown[]) => console.log('[seed-mg-models]', ...args);

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
  log(`🚀 Starting MG Motor models seeding for ${models.length} entries`);
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
