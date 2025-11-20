import 'dotenv/config';
import { InsertModel } from '../server/validation/schemas';

const API_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:5001';
const ADMIN_TOKEN = process.env.BACKEND_ADMIN_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLTE3NjE4MTcwODgyMTMiLCJlbWFpbCI6ImFkbWluQG1vdG9yb2N0YW5lLmNvbSIsIm5hbWUiOiJBZG1pbiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTc2MzUzNzAwOSwiZXhwIjoxNzYzNjIzNDA5fQ.3y0dvJPaV1pV2euPtMdGDDMCBLAzHldu3hlunKvh-4U';

const BRAND_ID = 'brand-hyundai';

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
    name: 'Grand i10 Nios',
    status: 'active',
    isPopular: true,
    popularRank: 1,
    isNew: false,
    bodyType: 'Hatchback',
    subBodyType: 'Entry-level hatchback',
    launchDate: '2019-08',
    seating: 5,
    fuelTypes: ["petrol", "cng"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Hyundai Grand i10 Nios combines modern design with practical engineering, offering petrol, cng options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Entry-level hatchback with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 83 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Grand i10 Nios showcases Hyundai\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Grand i10 Nios a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Grand i10 Nios is a strong contender in the Entry-level hatchback.',
    engineSummaries: [
      {
        title: '1.2L Petrol MT',
        summary:
          '1.2L Petrol MT delivering 83 bhp with 114 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '83 bhp',
        torque: '114 Nm',
        speed: '5-speed manual',
      },
      {
        title: '1.2L Petrol AMT',
        summary:
          '1.2L Petrol AMT delivering 83 bhp with 114 Nm of torque for daily driving needs.',
        transmission: '5-speed AMT',
        power: '83 bhp',
        torque: '114 Nm',
        speed: '5-speed AMT',
      },
      {
        title: '1.2L CNG',
        summary:
          '1.2L CNG delivering 69 bhp with 95 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '69 bhp',
        torque: '95 Nm',
        speed: '5-speed manual',
      },
    ],
    mileageData: [
      { engineName: '1.2L Petrol MT', ...fuelEconomy('20.7 kmpl', '15 kmpl', '18 kmpl') },
      { engineName: '1.2L Petrol AMT', ...fuelEconomy('20.7 kmpl', '15 kmpl', '18 kmpl') },
      { engineName: '1.2L CNG', ...fuelEconomy('20.7 kmpl', '15 kmpl', '18 kmpl') },
    ],
    faqs: defaultFaqs('Hyundai Grand i10 Nios', '₹5.9–8.5 lakh', '20.7 kmpl', '5 seats'),
  },
  {
    name: 'i20',
    status: 'active',
    isPopular: true,
    popularRank: 2,
    isNew: false,
    bodyType: 'Hatchback',
    subBodyType: 'Premium hatchback',
    launchDate: '2020-11',
    seating: 5,
    fuelTypes: ["petrol"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Hyundai i20 combines modern design with practical engineering, offering petrol options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Premium hatchback with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 88 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The i20 showcases Hyundai\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the i20 a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the i20 is a strong contender in the Premium hatchback.',
    engineSummaries: [
      {
        title: '1.2L Petrol MT',
        summary:
          '1.2L Petrol MT delivering 88 bhp with 115 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '88 bhp',
        torque: '115 Nm',
        speed: '5-speed manual',
      },
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
    ],
    mileageData: [
      { engineName: '1.2L Petrol MT', ...fuelEconomy('20.35 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.0L Turbo Petrol iMT', ...fuelEconomy('20.35 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.0L Turbo Petrol DCT', ...fuelEconomy('20.35 kmpl', '14 kmpl', '17 kmpl') },
    ],
    faqs: defaultFaqs('Hyundai i20', '₹7.0–11.5 lakh', '20.35 kmpl', '5 seats'),
  },
  {
    name: 'i20 N Line',
    status: 'active',
    isPopular: true,
    popularRank: 3,
    isNew: false,
    bodyType: 'Hatchback',
    subBodyType: 'Performance hatchback',
    launchDate: '2021-09',
    seating: 5,
    fuelTypes: ["petrol"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Hyundai i20 N Line combines modern design with practical engineering, offering petrol options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Performance hatchback with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 120 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The i20 N Line showcases Hyundai\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the i20 N Line a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the i20 N Line is a strong contender in the Performance hatchback.',
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
    ],
    mileageData: [
      { engineName: '1.0L Turbo Petrol iMT', ...fuelEconomy('20.0 kmpl', '13 kmpl', '16 kmpl') },
      { engineName: '1.0L Turbo Petrol DCT', ...fuelEconomy('20.0 kmpl', '13 kmpl', '16 kmpl') },
    ],
    faqs: defaultFaqs('Hyundai i20 N Line', '₹9.9–12.5 lakh', '20.0 kmpl', '5 seats'),
  },
  {
    name: 'Aura',
    status: 'active',
    isPopular: true,
    popularRank: 4,
    isNew: false,
    bodyType: 'Sedan',
    subBodyType: 'Compact sedan',
    launchDate: '2020-01',
    seating: 5,
    fuelTypes: ["petrol", "cng"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Hyundai Aura combines modern design with practical engineering, offering petrol, cng options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Compact sedan with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 83 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Aura showcases Hyundai\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Aura a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Aura is a strong contender in the Compact sedan.',
    engineSummaries: [
      {
        title: '1.2L Petrol MT',
        summary:
          '1.2L Petrol MT delivering 83 bhp with 114 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '83 bhp',
        torque: '114 Nm',
        speed: '5-speed manual',
      },
      {
        title: '1.2L Petrol AMT',
        summary:
          '1.2L Petrol AMT delivering 83 bhp with 114 Nm of torque for daily driving needs.',
        transmission: '5-speed AMT',
        power: '83 bhp',
        torque: '114 Nm',
        speed: '5-speed AMT',
      },
      {
        title: '1.2L CNG',
        summary:
          '1.2L CNG delivering 69 bhp with 95 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '69 bhp',
        torque: '95 Nm',
        speed: '5-speed manual',
      },
    ],
    mileageData: [
      { engineName: '1.2L Petrol MT', ...fuelEconomy('20.5 kmpl', '15 kmpl', '18 kmpl') },
      { engineName: '1.2L Petrol AMT', ...fuelEconomy('20.5 kmpl', '15 kmpl', '18 kmpl') },
      { engineName: '1.2L CNG', ...fuelEconomy('20.5 kmpl', '15 kmpl', '18 kmpl') },
    ],
    faqs: defaultFaqs('Hyundai Aura', '₹6.5–9.2 lakh', '20.5 kmpl', '5 seats'),
  },
  {
    name: 'Verna',
    status: 'active',
    isPopular: true,
    popularRank: 5,
    isNew: false,
    bodyType: 'Sedan',
    subBodyType: 'Mid-size sedan',
    launchDate: '2023-03',
    seating: 5,
    fuelTypes: ["petrol"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Hyundai Verna combines modern design with practical engineering, offering petrol options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Mid-size sedan with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 115 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Verna showcases Hyundai\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Verna a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Verna is a strong contender in the Mid-size sedan.',
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
    ],
    mileageData: [
      { engineName: '1.5L Petrol MT', ...fuelEconomy('18.5 kmpl', '13 kmpl', '16 kmpl') },
      { engineName: '1.5L Petrol CVT', ...fuelEconomy('18.5 kmpl', '13 kmpl', '16 kmpl') },
      { engineName: '1.5L Turbo Petrol DCT', ...fuelEconomy('18.5 kmpl', '13 kmpl', '16 kmpl') },
    ],
    faqs: defaultFaqs('Hyundai Verna', '₹11.0–17.5 lakh', '18.5 kmpl', '5 seats'),
  },
  {
    name: 'Exter',
    status: 'active',
    isPopular: true,
    popularRank: 6,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Micro SUV',
    launchDate: '2023-07',
    seating: 5,
    fuelTypes: ["petrol", "cng"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Hyundai Exter combines modern design with practical engineering, offering petrol, cng options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Micro SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 83 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Exter showcases Hyundai\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Exter a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Exter is a strong contender in the Micro SUV.',
    engineSummaries: [
      {
        title: '1.2L Petrol MT',
        summary:
          '1.2L Petrol MT delivering 83 bhp with 114 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '83 bhp',
        torque: '114 Nm',
        speed: '5-speed manual',
      },
      {
        title: '1.2L Petrol AMT',
        summary:
          '1.2L Petrol AMT delivering 83 bhp with 114 Nm of torque for daily driving needs.',
        transmission: '5-speed AMT',
        power: '83 bhp',
        torque: '114 Nm',
        speed: '5-speed AMT',
      },
      {
        title: '1.2L CNG',
        summary:
          '1.2L CNG delivering 69 bhp with 95 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '69 bhp',
        torque: '95 Nm',
        speed: '5-speed manual',
      },
    ],
    mileageData: [
      { engineName: '1.2L Petrol MT', ...fuelEconomy('19.2 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.2L Petrol AMT', ...fuelEconomy('19.2 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.2L CNG', ...fuelEconomy('19.2 kmpl', '14 kmpl', '17 kmpl') },
    ],
    faqs: defaultFaqs('Hyundai Exter', '₹6.1–10.2 lakh', '19.2 kmpl', '5 seats'),
  },
  {
    name: 'Creta EV',
    status: 'active',
    isPopular: true,
    popularRank: 7,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: 'Electric SUV',
    launchDate: '2025-01',
    seating: 5,
    fuelTypes: ["electric"],
    transmissions: ["automatic"],
    headerSeo:
      'The Hyundai Creta EV combines modern design with practical engineering, offering electric options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Electric SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 138 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Creta EV showcases Hyundai\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Creta EV a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Creta EV is a strong contender in the Electric SUV.',
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
      { engineName: 'Electric Motor', ...fuelEconomy('450 km range', 'N/A', 'N/A') },
    ],
    faqs: defaultFaqs('Hyundai Creta EV', '₹18.0–25.0 lakh', '450 km range', '5 seats'),
  },
  {
    name: 'Creta N Line',
    status: 'active',
    isPopular: true,
    popularRank: 8,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: 'Compact SUV',
    launchDate: '2024-03',
    seating: 5,
    fuelTypes: ["petrol"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Hyundai Creta N Line combines modern design with practical engineering, offering petrol options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Compact SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 160 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Creta N Line showcases Hyundai\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Creta N Line a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Creta N Line is a strong contender in the Compact SUV.',
    engineSummaries: [
      {
        title: '1.5L Turbo Petrol DCT',
        summary:
          '1.5L Turbo Petrol DCT delivering 160 bhp with 253 Nm of torque for daily driving needs.',
        transmission: '7-speed DCT',
        power: '160 bhp',
        torque: '253 Nm',
        speed: '7-speed DCT',
      },
    ],
    mileageData: [
      { engineName: '1.5L Turbo Petrol DCT', ...fuelEconomy('17.7 kmpl', '12 kmpl', '15 kmpl') },
    ],
    faqs: defaultFaqs('Hyundai Creta N Line', '₹16.8–20.3 lakh', '17.7 kmpl', '5 seats'),
  },
  {
    name: 'Alcazar',
    status: 'active',
    isPopular: true,
    popularRank: 9,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: '3-row SUV',
    launchDate: '2021-06',
    seating: 7,
    fuelTypes: ["petrol"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Hyundai Alcazar combines modern design with practical engineering, offering petrol options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the 3-row SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 160 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Alcazar showcases Hyundai\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Alcazar a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Alcazar is a strong contender in the 3-row SUV.',
    engineSummaries: [
      {
        title: '1.5L Turbo Petrol MT',
        summary:
          '1.5L Turbo Petrol MT delivering 160 bhp with 253 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '160 bhp',
        torque: '253 Nm',
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
    ],
    mileageData: [
      { engineName: '1.5L Turbo Petrol MT', ...fuelEconomy('18.1 kmpl', '12 kmpl', '15 kmpl') },
      { engineName: '1.5L Turbo Petrol DCT', ...fuelEconomy('18.1 kmpl', '12 kmpl', '15 kmpl') },
    ],
    faqs: defaultFaqs('Hyundai Alcazar', '₹16.8–21.3 lakh', '18.1 kmpl', '7-seater'),
  },
  {
    name: 'Tucson',
    status: 'active',
    isPopular: true,
    popularRank: 10,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Premium SUV',
    launchDate: '2022-08',
    seating: 5,
    fuelTypes: ["petrol"],
    transmissions: ["automatic"],
    headerSeo:
      'The Hyundai Tucson combines modern design with practical engineering, offering petrol options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Premium SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 156 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Tucson showcases Hyundai\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Tucson a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Tucson is a strong contender in the Premium SUV.',
    engineSummaries: [
      {
        title: '2.0L Petrol AT',
        summary:
          '2.0L Petrol AT delivering 156 bhp with 192 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '156 bhp',
        torque: '192 Nm',
        speed: '6-speed automatic',
      },
    ],
    mileageData: [
      { engineName: '2.0L Petrol AT', ...fuelEconomy('14.1 kmpl', '10 kmpl', '13 kmpl') },
    ],
    faqs: defaultFaqs('Hyundai Tucson', '₹29.0–36.0 lakh', '14.1 kmpl', '5 seats'),
  },
  {
    name: 'Ioniq 5',
    status: 'active',
    isPopular: false,
    popularRank: undefined,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Electric SUV',
    launchDate: '2022-12',
    seating: 5,
    fuelTypes: ["electric"],
    transmissions: ["automatic"],
    headerSeo:
      'The Hyundai Ioniq 5 combines modern design with practical engineering, offering electric options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Electric SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 217 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Ioniq 5 showcases Hyundai\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Ioniq 5 a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Ioniq 5 is a strong contender in the Electric SUV.',
    engineSummaries: [
      {
        title: 'Electric Motor',
        summary:
          'Electric Motor delivering 217 bhp with 350 Nm of torque for daily driving needs.',
        transmission: 'Single-speed',
        power: '217 bhp',
        torque: '350 Nm',
        speed: 'Single-speed',
      },
    ],
    mileageData: [
      { engineName: 'Electric Motor', ...fuelEconomy('631 km range', 'N/A', 'N/A') },
    ],
    faqs: defaultFaqs('Hyundai Ioniq 5', '₹44.9–53.5 lakh', '631 km range', '5 seats'),
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

const log = (...args: unknown[]) => console.log('[seed-hyundai-models]', ...args);

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
  log(`🚀 Starting Hyundai models seeding for ${models.length} entries`);
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
