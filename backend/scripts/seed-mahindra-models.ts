import 'dotenv/config';
import { InsertModel } from '../server/validation/schemas';

const API_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:5001';
const ADMIN_TOKEN = process.env.BACKEND_ADMIN_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLTE3NjE4MTcwODgyMTMiLCJlbWFpbCI6ImFkbWluQG1vdG9yb2N0YW5lLmNvbSIsIm5hbWUiOiJBZG1pbiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTc2MzUzNzAwOSwiZXhwIjoxNzYzNjIzNDA5fQ.3y0dvJPaV1pV2euPtMdGDDMCBLAzHldu3hlunKvh-4U';

const BRAND_ID = 'brand-mahindra';

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
    name: 'Bolero',
    status: 'active',
    isPopular: true,
    popularRank: 1,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Rugged utility vehicle',
    launchDate: '2021-11',
    seating: 7,
    fuelTypes: ["diesel"],
    transmissions: ["manual"],
    headerSeo:
      'The Mahindra Bolero combines modern design with practical engineering, offering diesel options and manual transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Rugged utility vehicle with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 76 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Bolero showcases Mahindra\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Bolero a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Bolero is a strong contender in the Rugged utility vehicle.',
    engineSummaries: [
      {
        title: '1.5L mHawk Diesel MT',
        summary:
          '1.5L mHawk Diesel MT delivering 76 bhp with 210 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '76 bhp',
        torque: '210 Nm',
        speed: '5-speed manual',
      },
    ],
    mileageData: [
      { engineName: '1.5L mHawk Diesel MT', ...fuelEconomy('17.0 kmpl', '13 kmpl', '16 kmpl') },
    ],
    faqs: defaultFaqs('Mahindra Bolero', '₹9.9–10.9 lakh', '17.0 kmpl', '7-seater'),
  },
  {
    name: 'Bolero Neo',
    status: 'active',
    isPopular: true,
    popularRank: 2,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Compact SUV',
    launchDate: '2021-07',
    seating: 7,
    fuelTypes: ["diesel"],
    transmissions: ["manual"],
    headerSeo:
      'The Mahindra Bolero Neo combines modern design with practical engineering, offering diesel options and manual transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Compact SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 100 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Bolero Neo showcases Mahindra\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Bolero Neo a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Bolero Neo is a strong contender in the Compact SUV.',
    engineSummaries: [
      {
        title: '1.5L mHawk Diesel MT',
        summary:
          '1.5L mHawk Diesel MT delivering 100 bhp with 260 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '100 bhp',
        torque: '260 Nm',
        speed: '5-speed manual',
      },
    ],
    mileageData: [
      { engineName: '1.5L mHawk Diesel MT', ...fuelEconomy('17.3 kmpl', '13 kmpl', '16 kmpl') },
    ],
    faqs: defaultFaqs('Mahindra Bolero Neo', '₹9.9–12.5 lakh', '17.3 kmpl', '7-seater'),
  },
  {
    name: 'Bolero Neo Plus',
    status: 'active',
    isPopular: true,
    popularRank: 3,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: '9-seater SUV',
    launchDate: '2023-05',
    seating: 9,
    fuelTypes: ["diesel"],
    transmissions: ["manual"],
    headerSeo:
      'The Mahindra Bolero Neo Plus combines modern design with practical engineering, offering diesel options and manual transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the 9-seater SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 120 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Bolero Neo Plus showcases Mahindra\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Bolero Neo Plus a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Bolero Neo Plus is a strong contender in the 9-seater SUV.',
    engineSummaries: [
      {
        title: '2.2L mHawk Diesel MT',
        summary:
          '2.2L mHawk Diesel MT delivering 120 bhp with 280 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '120 bhp',
        torque: '280 Nm',
        speed: '6-speed manual',
      },
    ],
    mileageData: [
      { engineName: '2.2L mHawk Diesel MT', ...fuelEconomy('15.5 kmpl', '12 kmpl', '15 kmpl') },
    ],
    faqs: defaultFaqs('Mahindra Bolero Neo Plus', '₹11.4–12.2 lakh', '15.5 kmpl', '9-seater'),
  },
  {
    name: 'Thar',
    status: 'active',
    isPopular: true,
    popularRank: 4,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Lifestyle 4x4',
    launchDate: '2020-10',
    seating: 4,
    fuelTypes: ["petrol", "diesel"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Mahindra Thar combines modern design with practical engineering, offering petrol, diesel options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Lifestyle 4x4 with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 150 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Thar showcases Mahindra\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Thar a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Thar is a strong contender in the Lifestyle 4x4.',
    engineSummaries: [
      {
        title: '2.0L mStallion Petrol MT',
        summary:
          '2.0L mStallion Petrol MT delivering 150 bhp with 300 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '150 bhp',
        torque: '300 Nm',
        speed: '6-speed manual',
      },
      {
        title: '2.0L mStallion Petrol AT',
        summary:
          '2.0L mStallion Petrol AT delivering 150 bhp with 300 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '150 bhp',
        torque: '300 Nm',
        speed: '6-speed automatic',
      },
      {
        title: '2.2L mHawk Diesel MT',
        summary:
          '2.2L mHawk Diesel MT delivering 130 bhp with 300 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '130 bhp',
        torque: '300 Nm',
        speed: '6-speed manual',
      },
      {
        title: '2.2L mHawk Diesel AT',
        summary:
          '2.2L mHawk Diesel AT delivering 130 bhp with 300 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '130 bhp',
        torque: '300 Nm',
        speed: '6-speed automatic',
      },
    ],
    mileageData: [
      { engineName: '2.0L mStallion Petrol MT', ...fuelEconomy('15.2 kmpl', '10 kmpl', '13 kmpl') },
      { engineName: '2.0L mStallion Petrol AT', ...fuelEconomy('15.2 kmpl', '10 kmpl', '13 kmpl') },
      { engineName: '2.2L mHawk Diesel MT', ...fuelEconomy('15.2 kmpl', '10 kmpl', '13 kmpl') },
      { engineName: '2.2L mHawk Diesel AT', ...fuelEconomy('15.2 kmpl', '10 kmpl', '13 kmpl') },
    ],
    faqs: defaultFaqs('Mahindra Thar', '₹11.3–17.6 lakh', '15.2 kmpl', '4 seats'),
  },
  {
    name: 'Thar Roxx',
    status: 'active',
    isPopular: true,
    popularRank: 5,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: '5-door 4x4',
    launchDate: '2024-08',
    seating: 5,
    fuelTypes: ["petrol", "diesel"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Mahindra Thar Roxx combines modern design with practical engineering, offering petrol, diesel options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the 5-door 4x4 with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 162 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Thar Roxx showcases Mahindra\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Thar Roxx a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Thar Roxx is a strong contender in the 5-door 4x4.',
    engineSummaries: [
      {
        title: '2.0L mStallion Turbo Petrol MT',
        summary:
          '2.0L mStallion Turbo Petrol MT delivering 162 bhp with 330 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '162 bhp',
        torque: '330 Nm',
        speed: '6-speed manual',
      },
      {
        title: '2.0L mStallion Turbo Petrol AT',
        summary:
          '2.0L mStallion Turbo Petrol AT delivering 177 bhp with 380 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '177 bhp',
        torque: '380 Nm',
        speed: '6-speed automatic',
      },
      {
        title: '2.2L mHawk Diesel MT',
        summary:
          '2.2L mHawk Diesel MT delivering 152 bhp with 330 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '152 bhp',
        torque: '330 Nm',
        speed: '6-speed manual',
      },
      {
        title: '2.2L mHawk Diesel AT',
        summary:
          '2.2L mHawk Diesel AT delivering 175 bhp with 370 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '175 bhp',
        torque: '370 Nm',
        speed: '6-speed automatic',
      },
    ],
    mileageData: [
      { engineName: '2.0L mStallion Turbo Petrol MT', ...fuelEconomy('14.8 kmpl', '10 kmpl', '13 kmpl') },
      { engineName: '2.0L mStallion Turbo Petrol AT', ...fuelEconomy('14.8 kmpl', '10 kmpl', '13 kmpl') },
      { engineName: '2.2L mHawk Diesel MT', ...fuelEconomy('14.8 kmpl', '10 kmpl', '13 kmpl') },
      { engineName: '2.2L mHawk Diesel AT', ...fuelEconomy('14.8 kmpl', '10 kmpl', '13 kmpl') },
    ],
    faqs: defaultFaqs('Mahindra Thar Roxx', '₹12.9–22.5 lakh', '14.8 kmpl', '5 seats'),
  },
  {
    name: 'Scorpio Classic',
    status: 'active',
    isPopular: true,
    popularRank: 6,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Rugged SUV',
    launchDate: '2022-06',
    seating: 7,
    fuelTypes: ["diesel"],
    transmissions: ["manual"],
    headerSeo:
      'The Mahindra Scorpio Classic combines modern design with practical engineering, offering diesel options and manual transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Rugged SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 130 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Scorpio Classic showcases Mahindra\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Scorpio Classic a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Scorpio Classic is a strong contender in the Rugged SUV.',
    engineSummaries: [
      {
        title: '2.2L mHawk Diesel MT',
        summary:
          '2.2L mHawk Diesel MT delivering 130 bhp with 300 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '130 bhp',
        torque: '300 Nm',
        speed: '5-speed manual',
      },
    ],
    mileageData: [
      { engineName: '2.2L mHawk Diesel MT', ...fuelEconomy('15.4 kmpl', '11 kmpl', '14 kmpl') },
    ],
    faqs: defaultFaqs('Mahindra Scorpio Classic', '₹13.6–17.6 lakh', '15.4 kmpl', '7-seater'),
  },
  {
    name: 'Scorpio-N',
    status: 'active',
    isPopular: true,
    popularRank: 7,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Mid-size SUV',
    launchDate: '2022-06',
    seating: 7,
    fuelTypes: ["petrol", "diesel"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Mahindra Scorpio-N combines modern design with practical engineering, offering petrol, diesel options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Mid-size SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 203 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Scorpio-N showcases Mahindra\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Scorpio-N a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Scorpio-N is a strong contender in the Mid-size SUV.',
    engineSummaries: [
      {
        title: '2.0L mStallion Turbo Petrol MT',
        summary:
          '2.0L mStallion Turbo Petrol MT delivering 203 bhp with 370 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '203 bhp',
        torque: '370 Nm',
        speed: '6-speed manual',
      },
      {
        title: '2.0L mStallion Turbo Petrol AT',
        summary:
          '2.0L mStallion Turbo Petrol AT delivering 203 bhp with 380 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '203 bhp',
        torque: '380 Nm',
        speed: '6-speed automatic',
      },
      {
        title: '2.2L mHawk Diesel MT',
        summary:
          '2.2L mHawk Diesel MT delivering 175 bhp with 400 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '175 bhp',
        torque: '400 Nm',
        speed: '6-speed manual',
      },
      {
        title: '2.2L mHawk Diesel AT',
        summary:
          '2.2L mHawk Diesel AT delivering 175 bhp with 400 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '175 bhp',
        torque: '400 Nm',
        speed: '6-speed automatic',
      },
    ],
    mileageData: [
      { engineName: '2.0L mStallion Turbo Petrol MT', ...fuelEconomy('15.2 kmpl', '11 kmpl', '14 kmpl') },
      { engineName: '2.0L mStallion Turbo Petrol AT', ...fuelEconomy('15.2 kmpl', '11 kmpl', '14 kmpl') },
      { engineName: '2.2L mHawk Diesel MT', ...fuelEconomy('15.2 kmpl', '11 kmpl', '14 kmpl') },
      { engineName: '2.2L mHawk Diesel AT', ...fuelEconomy('15.2 kmpl', '11 kmpl', '14 kmpl') },
    ],
    faqs: defaultFaqs('Mahindra Scorpio-N', '₹13.6–24.5 lakh', '15.2 kmpl', '7-seater'),
  },
  {
    name: 'XUV 3XO',
    status: 'active',
    isPopular: true,
    popularRank: 8,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: 'Compact SUV',
    launchDate: '2024-04',
    seating: 5,
    fuelTypes: ["petrol", "diesel"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Mahindra XUV 3XO combines modern design with practical engineering, offering petrol, diesel options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Compact SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 130 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The XUV 3XO showcases Mahindra\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the XUV 3XO a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the XUV 3XO is a strong contender in the Compact SUV.',
    engineSummaries: [
      {
        title: '1.2L Turbo Petrol MT',
        summary:
          '1.2L Turbo Petrol MT delivering 130 bhp with 230 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '130 bhp',
        torque: '230 Nm',
        speed: '6-speed manual',
      },
      {
        title: '1.2L Turbo Petrol AT',
        summary:
          '1.2L Turbo Petrol AT delivering 130 bhp with 230 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '130 bhp',
        torque: '230 Nm',
        speed: '6-speed automatic',
      },
      {
        title: '1.5L Diesel MT',
        summary:
          '1.5L Diesel MT delivering 117 bhp with 300 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '117 bhp',
        torque: '300 Nm',
        speed: '6-speed manual',
      },
    ],
    mileageData: [
      { engineName: '1.2L Turbo Petrol MT', ...fuelEconomy('20.1 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.2L Turbo Petrol AT', ...fuelEconomy('20.1 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.5L Diesel MT', ...fuelEconomy('20.1 kmpl', '14 kmpl', '17 kmpl') },
    ],
    faqs: defaultFaqs('Mahindra XUV 3XO', '₹7.8–15.5 lakh', '20.1 kmpl', '5 seats'),
  },
  {
    name: 'XUV400 EV',
    status: 'active',
    isPopular: true,
    popularRank: 9,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Electric SUV',
    launchDate: '2023-01',
    seating: 5,
    fuelTypes: ["electric"],
    transmissions: ["automatic"],
    headerSeo:
      'The Mahindra XUV400 EV combines modern design with practical engineering, offering electric options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Electric SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 150 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The XUV400 EV showcases Mahindra\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the XUV400 EV a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the XUV400 EV is a strong contender in the Electric SUV.',
    engineSummaries: [
      {
        title: 'Electric Motor',
        summary:
          'Electric Motor delivering 150 bhp with 310 Nm of torque for daily driving needs.',
        transmission: 'Single-speed',
        power: '150 bhp',
        torque: '310 Nm',
        speed: 'Single-speed',
      },
    ],
    mileageData: [
      { engineName: 'Electric Motor', ...fuelEconomy('456 km range', 'N/A', 'N/A') },
    ],
    faqs: defaultFaqs('Mahindra XUV400 EV', '₹15.5–17.7 lakh', '456 km range', '5 seats'),
  },
  {
    name: 'XUV700',
    status: 'active',
    isPopular: true,
    popularRank: 10,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Premium SUV',
    launchDate: '2021-08',
    seating: 7,
    fuelTypes: ["petrol", "diesel"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Mahindra XUV700 combines modern design with practical engineering, offering petrol, diesel options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Premium SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 200 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The XUV700 showcases Mahindra\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the XUV700 a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the XUV700 is a strong contender in the Premium SUV.',
    engineSummaries: [
      {
        title: '2.0L mStallion Turbo Petrol MT',
        summary:
          '2.0L mStallion Turbo Petrol MT delivering 200 bhp with 380 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '200 bhp',
        torque: '380 Nm',
        speed: '6-speed manual',
      },
      {
        title: '2.0L mStallion Turbo Petrol AT',
        summary:
          '2.0L mStallion Turbo Petrol AT delivering 200 bhp with 380 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '200 bhp',
        torque: '380 Nm',
        speed: '6-speed automatic',
      },
      {
        title: '2.2L mHawk Diesel MT',
        summary:
          '2.2L mHawk Diesel MT delivering 185 bhp with 450 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '185 bhp',
        torque: '450 Nm',
        speed: '6-speed manual',
      },
      {
        title: '2.2L mHawk Diesel AT',
        summary:
          '2.2L mHawk Diesel AT delivering 185 bhp with 450 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '185 bhp',
        torque: '450 Nm',
        speed: '6-speed automatic',
      },
    ],
    mileageData: [
      { engineName: '2.0L mStallion Turbo Petrol MT', ...fuelEconomy('16.0 kmpl', '11 kmpl', '14 kmpl') },
      { engineName: '2.0L mStallion Turbo Petrol AT', ...fuelEconomy('16.0 kmpl', '11 kmpl', '14 kmpl') },
      { engineName: '2.2L mHawk Diesel MT', ...fuelEconomy('16.0 kmpl', '11 kmpl', '14 kmpl') },
      { engineName: '2.2L mHawk Diesel AT', ...fuelEconomy('16.0 kmpl', '11 kmpl', '14 kmpl') },
    ],
    faqs: defaultFaqs('Mahindra XUV700', '₹13.8–25.1 lakh', '16.0 kmpl', '7-seater'),
  },
  {
    name: 'Marazzo',
    status: 'active',
    isPopular: false,
    popularRank: undefined,
    isNew: false,
    bodyType: 'MPV',
    subBodyType: 'Premium MPV',
    launchDate: '2018-09',
    seating: 8,
    fuelTypes: ["diesel"],
    transmissions: ["manual"],
    headerSeo:
      'The Mahindra Marazzo combines modern design with practical engineering, offering diesel options and manual transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Premium MPV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 122 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Marazzo showcases Mahindra\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Marazzo a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Marazzo is a strong contender in the Premium MPV.',
    engineSummaries: [
      {
        title: '1.5L D15 Diesel MT',
        summary:
          '1.5L D15 Diesel MT delivering 122 bhp with 300 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '122 bhp',
        torque: '300 Nm',
        speed: '6-speed manual',
      },
    ],
    mileageData: [
      { engineName: '1.5L D15 Diesel MT', ...fuelEconomy('17.3 kmpl', '13 kmpl', '16 kmpl') },
    ],
    faqs: defaultFaqs('Mahindra Marazzo', '₹13.2–16.0 lakh', '17.3 kmpl', '8-seater'),
  },
  {
    name: 'BE 6',
    status: 'active',
    isPopular: false,
    popularRank: undefined,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: 'Electric coupe SUV',
    launchDate: '2025-02',
    seating: 5,
    fuelTypes: ["electric"],
    transmissions: ["automatic"],
    headerSeo:
      'The Mahindra BE 6 combines modern design with practical engineering, offering electric options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Electric coupe SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 286 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The BE 6 showcases Mahindra\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the BE 6 a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the BE 6 is a strong contender in the Electric coupe SUV.',
    engineSummaries: [
      {
        title: 'Electric Motor',
        summary:
          'Electric Motor delivering 286 bhp with 380 Nm of torque for daily driving needs.',
        transmission: 'Single-speed',
        power: '286 bhp',
        torque: '380 Nm',
        speed: 'Single-speed',
      },
    ],
    mileageData: [
      { engineName: 'Electric Motor', ...fuelEconomy('556 km range', 'N/A', 'N/A') },
    ],
    faqs: defaultFaqs('Mahindra BE 6', '₹18.9–26.9 lakh', '556 km range', '5 seats'),
  },
  {
    name: 'XEV 9e',
    status: 'active',
    isPopular: false,
    popularRank: undefined,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: 'Electric premium SUV',
    launchDate: '2025-02',
    seating: 5,
    fuelTypes: ["electric"],
    transmissions: ["automatic"],
    headerSeo:
      'The Mahindra XEV 9e combines modern design with practical engineering, offering electric options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Electric premium SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 286 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The XEV 9e showcases Mahindra\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the XEV 9e a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the XEV 9e is a strong contender in the Electric premium SUV.',
    engineSummaries: [
      {
        title: 'Electric Motor',
        summary:
          'Electric Motor delivering 286 bhp with 380 Nm of torque for daily driving needs.',
        transmission: 'Single-speed',
        power: '286 bhp',
        torque: '380 Nm',
        speed: 'Single-speed',
      },
    ],
    mileageData: [
      { engineName: 'Electric Motor', ...fuelEconomy('542 km range', 'N/A', 'N/A') },
    ],
    faqs: defaultFaqs('Mahindra XEV 9e', '₹21.9–30.5 lakh', '542 km range', '5 seats'),
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

const log = (...args: unknown[]) => console.log('[seed-mahindra-models]', ...args);

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
  log(`🚀 Starting Mahindra models seeding for ${models.length} entries`);
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
