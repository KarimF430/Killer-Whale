import 'dotenv/config';
import { InsertModel } from '../server/validation/schemas';

const API_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:5001';
const ADMIN_TOKEN = process.env.BACKEND_ADMIN_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLTE3NjE4MTcwODgyMTMiLCJlbWFpbCI6ImFkbWluQG1vdG9yb2N0YW5lLmNvbSIsIm5hbWUiOiJBZG1pbiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTc2MzUzNzAwOSwiZXhwIjoxNzYzNjIzNDA5fQ.3y0dvJPaV1pV2euPtMdGDDMCBLAzHldu3hlunKvh-4U';

const BRAND_ID = 'brand-kia';

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
    name: 'Sonet',
    status: 'active',
    isPopular: true,
    popularRank: 1,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: 'Compact SUV',
    launchDate: '2024-12',
    seating: 5,
    fuelTypes: ["petrol", "diesel"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Kia Sonet combines modern design with practical engineering, offering petrol, diesel options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Compact SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 120 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Sonet showcases Kia\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Sonet a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Sonet is a strong contender in the Compact SUV.',
    engineSummaries: [
      {
        title: '1.0L Turbo Petrol iMT',
        summary:
          '1.0L Turbo Petrol iMT delivering 120 bhp with 172 Nm of torque for daily driving needs.',
        transmission: '6-speed iMT',
        power: '120 bhp',
        torque: '172 Nm',
        speed: '6-speed iMT',
      },
      {
        title: '1.0L Turbo Petrol DCT',
        summary:
          '1.0L Turbo Petrol DCT delivering 120 bhp with 172 Nm of torque for daily driving needs.',
        transmission: '7-speed DCT',
        power: '120 bhp',
        torque: '172 Nm',
        speed: '7-speed DCT',
      },
      {
        title: '1.5L Diesel MT',
        summary:
          '1.5L Diesel MT delivering 116 bhp with 250 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '116 bhp',
        torque: '250 Nm',
        speed: '6-speed manual',
      },
      {
        title: '1.5L Diesel AT',
        summary:
          '1.5L Diesel AT delivering 116 bhp with 250 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '116 bhp',
        torque: '250 Nm',
        speed: '6-speed automatic',
      },
    ],
    mileageData: [
      { engineName: '1.0L Turbo Petrol iMT', ...fuelEconomy('24.1 kmpl', '16 kmpl', '19 kmpl') },
      { engineName: '1.0L Turbo Petrol DCT', ...fuelEconomy('24.1 kmpl', '16 kmpl', '19 kmpl') },
      { engineName: '1.5L Diesel MT', ...fuelEconomy('24.1 kmpl', '16 kmpl', '19 kmpl') },
      { engineName: '1.5L Diesel AT', ...fuelEconomy('24.1 kmpl', '16 kmpl', '19 kmpl') },
    ],
    faqs: defaultFaqs('Kia Sonet', '₹7.9–15.7 lakh', '24.1 kmpl', '5 seats'),
  },
  {
    name: 'Syros',
    status: 'active',
    isPopular: true,
    popularRank: 2,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: 'Compact SUV',
    launchDate: '2025-02',
    seating: 5,
    fuelTypes: ["petrol", "diesel"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Kia Syros combines modern design with practical engineering, offering petrol, diesel options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Compact SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 120 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Syros showcases Kia\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Syros a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Syros is a strong contender in the Compact SUV.',
    engineSummaries: [
      {
        title: '1.0L Turbo Petrol MT',
        summary:
          '1.0L Turbo Petrol MT delivering 120 bhp with 172 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '120 bhp',
        torque: '172 Nm',
        speed: '6-speed manual',
      },
      {
        title: '1.0L Turbo Petrol DCT',
        summary:
          '1.0L Turbo Petrol DCT delivering 120 bhp with 172 Nm of torque for daily driving needs.',
        transmission: '7-speed DCT',
        power: '120 bhp',
        torque: '172 Nm',
        speed: '7-speed DCT',
      },
      {
        title: '1.5L Diesel MT',
        summary:
          '1.5L Diesel MT delivering 116 bhp with 250 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '116 bhp',
        torque: '250 Nm',
        speed: '6-speed manual',
      },
    ],
    mileageData: [
      { engineName: '1.0L Turbo Petrol MT', ...fuelEconomy('20.0 kmpl', '15 kmpl', '18 kmpl') },
      { engineName: '1.0L Turbo Petrol DCT', ...fuelEconomy('20.0 kmpl', '15 kmpl', '18 kmpl') },
      { engineName: '1.5L Diesel MT', ...fuelEconomy('20.0 kmpl', '15 kmpl', '18 kmpl') },
    ],
    faqs: defaultFaqs('Kia Syros', '₹9.7–17.7 lakh', '20.0 kmpl', '5 seats'),
  },
  {
    name: 'Seltos',
    status: 'active',
    isPopular: true,
    popularRank: 3,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Mid-size SUV',
    launchDate: '2023-07',
    seating: 5,
    fuelTypes: ["petrol", "diesel"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Kia Seltos combines modern design with practical engineering, offering petrol, diesel options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Mid-size SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 115 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Seltos showcases Kia\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Seltos a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Seltos is a strong contender in the Mid-size SUV.',
    engineSummaries: [
      {
        title: '1.5L Petrol MT',
        summary:
          '1.5L Petrol MT delivering 115 bhp with 144 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '115 bhp',
        torque: '144 Nm',
        speed: '6-speed manual',
      },
      {
        title: '1.5L Petrol CVT',
        summary:
          '1.5L Petrol CVT delivering 115 bhp with 144 Nm of torque for daily driving needs.',
        transmission: 'CVT',
        power: '115 bhp',
        torque: '144 Nm',
        speed: 'CVT',
      },
      {
        title: '1.5L Turbo Petrol DCT',
        summary:
          '1.5L Turbo Petrol DCT delivering 160 bhp with 253 Nm of torque for daily driving needs.',
        transmission: '7-speed DCT',
        power: '160 bhp',
        torque: '253 Nm',
        speed: '7-speed DCT',
      },
      {
        title: '1.5L Diesel MT',
        summary:
          '1.5L Diesel MT delivering 116 bhp with 250 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '116 bhp',
        torque: '250 Nm',
        speed: '6-speed manual',
      },
      {
        title: '1.5L Diesel AT',
        summary:
          '1.5L Diesel AT delivering 116 bhp with 250 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '116 bhp',
        torque: '250 Nm',
        speed: '6-speed automatic',
      },
    ],
    mileageData: [
      { engineName: '1.5L Petrol MT', ...fuelEconomy('20.7 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.5L Petrol CVT', ...fuelEconomy('20.7 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.5L Turbo Petrol DCT', ...fuelEconomy('20.7 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.5L Diesel MT', ...fuelEconomy('20.7 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.5L Diesel AT', ...fuelEconomy('20.7 kmpl', '14 kmpl', '17 kmpl') },
    ],
    faqs: defaultFaqs('Kia Seltos', '₹10.9–20.4 lakh', '20.7 kmpl', '5 seats'),
  },
  {
    name: 'Carens',
    status: 'active',
    isPopular: true,
    popularRank: 4,
    isNew: false,
    bodyType: 'MPV',
    subBodyType: '3-row MPV',
    launchDate: '2022-02',
    seating: 7,
    fuelTypes: ["petrol", "diesel"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Kia Carens combines modern design with practical engineering, offering petrol, diesel options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the 3-row MPV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 115 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Carens showcases Kia\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Carens a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Carens is a strong contender in the 3-row MPV.',
    engineSummaries: [
      {
        title: '1.5L Petrol MT',
        summary:
          '1.5L Petrol MT delivering 115 bhp with 144 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '115 bhp',
        torque: '144 Nm',
        speed: '6-speed manual',
      },
      {
        title: '1.5L Turbo Petrol DCT',
        summary:
          '1.5L Turbo Petrol DCT delivering 160 bhp with 253 Nm of torque for daily driving needs.',
        transmission: '7-speed DCT',
        power: '160 bhp',
        torque: '253 Nm',
        speed: '7-speed DCT',
      },
      {
        title: '1.5L Diesel MT',
        summary:
          '1.5L Diesel MT delivering 116 bhp with 250 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '116 bhp',
        torque: '250 Nm',
        speed: '6-speed manual',
      },
      {
        title: '1.5L Diesel AT',
        summary:
          '1.5L Diesel AT delivering 116 bhp with 250 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '116 bhp',
        torque: '250 Nm',
        speed: '6-speed automatic',
      },
    ],
    mileageData: [
      { engineName: '1.5L Petrol MT', ...fuelEconomy('21.3 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.5L Turbo Petrol DCT', ...fuelEconomy('21.3 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.5L Diesel MT', ...fuelEconomy('21.3 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.5L Diesel AT', ...fuelEconomy('21.3 kmpl', '14 kmpl', '17 kmpl') },
    ],
    faqs: defaultFaqs('Kia Carens', '₹10.5–19.5 lakh', '21.3 kmpl', '7-seater'),
  },
  {
    name: 'Carnival',
    status: 'active',
    isPopular: true,
    popularRank: 5,
    isNew: true,
    bodyType: 'MPV',
    subBodyType: 'Luxury MPV',
    launchDate: '2024-10',
    seating: 7,
    fuelTypes: ["diesel"],
    transmissions: ["automatic"],
    headerSeo:
      'The Kia Carnival combines modern design with practical engineering, offering diesel options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Luxury MPV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 193 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Carnival showcases Kia\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Carnival a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Carnival is a strong contender in the Luxury MPV.',
    engineSummaries: [
      {
        title: '2.2L Diesel AT',
        summary:
          '2.2L Diesel AT delivering 193 bhp with 440 Nm of torque for daily driving needs.',
        transmission: '8-speed automatic',
        power: '193 bhp',
        torque: '440 Nm',
        speed: '8-speed automatic',
      },
    ],
    mileageData: [
      { engineName: '2.2L Diesel AT', ...fuelEconomy('16.0 kmpl', '12 kmpl', '15 kmpl') },
    ],
    faqs: defaultFaqs('Kia Carnival', '₹63.9–75.9 lakh', '16.0 kmpl', '7-seater'),
  },
  {
    name: 'EV6',
    status: 'active',
    isPopular: true,
    popularRank: 6,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Electric crossover',
    launchDate: '2022-06',
    seating: 5,
    fuelTypes: ["electric"],
    transmissions: ["automatic"],
    headerSeo:
      'The Kia EV6 combines modern design with practical engineering, offering electric options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Electric crossover with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 229 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The EV6 showcases Kia\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the EV6 a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the EV6 is a strong contender in the Electric crossover.',
    engineSummaries: [
      {
        title: 'Electric Motor',
        summary:
          'Electric Motor delivering 229 bhp with 350 Nm of torque for daily driving needs.',
        transmission: 'Single-speed',
        power: '229 bhp',
        torque: '350 Nm',
        speed: 'Single-speed',
      },
    ],
    mileageData: [
      { engineName: 'Electric Motor', ...fuelEconomy('708 km range', 'N/A', 'N/A') },
    ],
    faqs: defaultFaqs('Kia EV6', '₹60.9–65.9 lakh', '708 km range', '5 seats'),
  },
  {
    name: 'EV9',
    status: 'active',
    isPopular: true,
    popularRank: 7,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: 'Electric 3-row SUV',
    launchDate: '2024-10',
    seating: 7,
    fuelTypes: ["electric"],
    transmissions: ["automatic"],
    headerSeo:
      'The Kia EV9 combines modern design with practical engineering, offering electric options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Electric 3-row SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 384 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The EV9 showcases Kia\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the EV9 a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the EV9 is a strong contender in the Electric 3-row SUV.',
    engineSummaries: [
      {
        title: 'Electric Motor',
        summary:
          'Electric Motor delivering 384 bhp with 700 Nm of torque for daily driving needs.',
        transmission: 'Single-speed',
        power: '384 bhp',
        torque: '700 Nm',
        speed: 'Single-speed',
      },
    ],
    mileageData: [
      { engineName: 'Electric Motor', ...fuelEconomy('561 km range', 'N/A', 'N/A') },
    ],
    faqs: defaultFaqs('Kia EV9', '₹1.30 crore (approx)', '561 km range', '7-seater'),
  },
  {
    name: 'Clavis',
    status: 'active',
    isPopular: true,
    popularRank: 8,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: 'Compact SUV',
    launchDate: '2025-06',
    seating: 5,
    fuelTypes: ["petrol"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Kia Clavis combines modern design with practical engineering, offering petrol options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Compact SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 120 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Clavis showcases Kia\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Clavis a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Clavis is a strong contender in the Compact SUV.',
    engineSummaries: [
      {
        title: '1.0L Turbo Petrol MT',
        summary:
          '1.0L Turbo Petrol MT delivering 120 bhp with 172 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '120 bhp',
        torque: '172 Nm',
        speed: '6-speed manual',
      },
      {
        title: '1.0L Turbo Petrol DCT',
        summary:
          '1.0L Turbo Petrol DCT delivering 120 bhp with 172 Nm of torque for daily driving needs.',
        transmission: '7-speed DCT',
        power: '120 bhp',
        torque: '172 Nm',
        speed: '7-speed DCT',
      },
    ],
    mileageData: [
      { engineName: '1.0L Turbo Petrol MT', ...fuelEconomy('20.0 kmpl', '15 kmpl', '18 kmpl') },
      { engineName: '1.0L Turbo Petrol DCT', ...fuelEconomy('20.0 kmpl', '15 kmpl', '18 kmpl') },
    ],
    faqs: defaultFaqs('Kia Clavis', '₹7.0–12.0 lakh (expected)', '20.0 kmpl', '5 seats'),
  },
  {
    name: 'Clavis EV',
    status: 'active',
    isPopular: true,
    popularRank: 9,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: 'Electric compact SUV',
    launchDate: '2025-08',
    seating: 5,
    fuelTypes: ["electric"],
    transmissions: ["automatic"],
    headerSeo:
      'The Kia Clavis EV combines modern design with practical engineering, offering electric options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Electric compact SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 138 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Clavis EV showcases Kia\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Clavis EV a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Clavis EV is a strong contender in the Electric compact SUV.',
    engineSummaries: [
      {
        title: 'Electric Motor',
        summary:
          'Electric Motor delivering 138 bhp with 255 Nm of torque for daily driving needs.',
        transmission: 'Single-speed',
        power: '138 bhp',
        torque: '255 Nm',
        speed: 'Single-speed',
      },
    ],
    mileageData: [
      { engineName: 'Electric Motor', ...fuelEconomy('400 km range', 'N/A', 'N/A') },
    ],
    faqs: defaultFaqs('Kia Clavis EV', '₹12.0–18.0 lakh (expected)', '400 km range', '5 seats'),
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

const log = (...args: unknown[]) => console.log('[seed-kia-models]', ...args);

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
  log(`🚀 Starting Kia models seeding for ${models.length} entries`);
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
