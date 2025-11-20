import 'dotenv/config';
import { InsertModel } from '../server/validation/schemas';

const API_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:5001';
const ADMIN_TOKEN = process.env.BACKEND_ADMIN_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLTE3NjE4MTcwODgyMTMiLCJlbWFpbCI6ImFkbWluQG1vdG9yb2N0YW5lLmNvbSIsIm5hbWUiOiJBZG1pbiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTc2MzUzNzAwOSwiZXhwIjoxNzYzNjIzNDA5fQ.3y0dvJPaV1pV2euPtMdGDDMCBLAzHldu3hlunKvh-4U';

const BRAND_ID = 'brand-tata-motors';

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
    name: 'Tiago',
    status: 'active',
    isPopular: true,
    popularRank: 1,
    isNew: false,
    bodyType: 'Hatchback',
    subBodyType: 'Entry-level hatchback',
    launchDate: '2020-01',
    seating: 5,
    fuelTypes: ["petrol"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Tata Motors Tiago combines modern design with practical engineering, offering petrol options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Entry-level hatchback with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 86 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Tiago showcases Tata Motors\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Tiago a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Tiago is a strong contender in the Entry-level hatchback.',
    engineSummaries: [
      {
        title: '1.2L Revotron Petrol MT',
        summary:
          '1.2L Revotron Petrol MT delivering 86 bhp with 113 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '86 bhp',
        torque: '113 Nm',
        speed: '5-speed manual',
      },
      {
        title: '1.2L Revotron Petrol AMT',
        summary:
          '1.2L Revotron Petrol AMT delivering 86 bhp with 113 Nm of torque for daily driving needs.',
        transmission: '5-speed AMT',
        power: '86 bhp',
        torque: '113 Nm',
        speed: '5-speed AMT',
      },
    ],
    mileageData: [
      { engineName: '1.2L Revotron Petrol MT', ...fuelEconomy('20.09 kmpl', '15 kmpl', '18 kmpl') },
      { engineName: '1.2L Revotron Petrol AMT', ...fuelEconomy('20.09 kmpl', '15 kmpl', '18 kmpl') },
    ],
    faqs: defaultFaqs('Tata Motors Tiago', '₹5.0–7.5 lakh', '20.09 kmpl', '5 seats'),
  },
  {
    name: 'Tiago NRG',
    status: 'active',
    isPopular: true,
    popularRank: 2,
    isNew: false,
    bodyType: 'Hatchback',
    subBodyType: 'Crossover hatchback',
    launchDate: '2021-08',
    seating: 5,
    fuelTypes: ["petrol"],
    transmissions: ["manual"],
    headerSeo:
      'The Tata Motors Tiago NRG combines modern design with practical engineering, offering petrol options and manual transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Crossover hatchback with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 86 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Tiago NRG showcases Tata Motors\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Tiago NRG a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Tiago NRG is a strong contender in the Crossover hatchback.',
    engineSummaries: [
      {
        title: '1.2L Revotron Petrol MT',
        summary:
          '1.2L Revotron Petrol MT delivering 86 bhp with 113 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '86 bhp',
        torque: '113 Nm',
        speed: '5-speed manual',
      },
    ],
    mileageData: [
      { engineName: '1.2L Revotron Petrol MT', ...fuelEconomy('19.0 kmpl', '14 kmpl', '17 kmpl') },
    ],
    faqs: defaultFaqs('Tata Motors Tiago NRG', '₹6.6–8.8 lakh', '19.0 kmpl', '5 seats'),
  },
  {
    name: 'Tiago EV',
    status: 'active',
    isPopular: true,
    popularRank: 3,
    isNew: false,
    bodyType: 'Hatchback',
    subBodyType: 'Electric hatchback',
    launchDate: '2023-01',
    seating: 5,
    fuelTypes: ["electric"],
    transmissions: ["automatic"],
    headerSeo:
      'The Tata Motors Tiago EV combines modern design with practical engineering, offering electric options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Electric hatchback with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 75 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Tiago EV showcases Tata Motors\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Tiago EV a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Tiago EV is a strong contender in the Electric hatchback.',
    engineSummaries: [
      {
        title: 'Electric Motor',
        summary:
          'Electric Motor delivering 75 bhp with 170 Nm of torque for daily driving needs.',
        transmission: 'Single-speed',
        power: '75 bhp',
        torque: '170 Nm',
        speed: 'Single-speed',
      },
    ],
    mileageData: [
      { engineName: 'Electric Motor', ...fuelEconomy('315 km range', 'N/A', 'N/A') },
    ],
    faqs: defaultFaqs('Tata Motors Tiago EV', '₹7.9–11.9 lakh', '315 km range', '5 seats'),
  },
  {
    name: 'Tigor',
    status: 'active',
    isPopular: true,
    popularRank: 4,
    isNew: false,
    bodyType: 'Sedan',
    subBodyType: 'Compact sedan',
    launchDate: '2020-10',
    seating: 5,
    fuelTypes: ["petrol"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Tata Motors Tigor combines modern design with practical engineering, offering petrol options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Compact sedan with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 86 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Tigor showcases Tata Motors\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Tigor a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Tigor is a strong contender in the Compact sedan.',
    engineSummaries: [
      {
        title: '1.2L Revotron Petrol MT',
        summary:
          '1.2L Revotron Petrol MT delivering 86 bhp with 113 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '86 bhp',
        torque: '113 Nm',
        speed: '5-speed manual',
      },
      {
        title: '1.2L Revotron Petrol AMT',
        summary:
          '1.2L Revotron Petrol AMT delivering 86 bhp with 113 Nm of torque for daily driving needs.',
        transmission: '5-speed AMT',
        power: '86 bhp',
        torque: '113 Nm',
        speed: '5-speed AMT',
      },
    ],
    mileageData: [
      { engineName: '1.2L Revotron Petrol MT', ...fuelEconomy('19.2 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.2L Revotron Petrol AMT', ...fuelEconomy('19.2 kmpl', '14 kmpl', '17 kmpl') },
    ],
    faqs: defaultFaqs('Tata Motors Tigor', '₹6.0–9.0 lakh', '19.2 kmpl', '5 seats'),
  },
  {
    name: 'Tigor EV',
    status: 'active',
    isPopular: true,
    popularRank: 5,
    isNew: false,
    bodyType: 'Sedan',
    subBodyType: 'Electric sedan',
    launchDate: '2023-01',
    seating: 5,
    fuelTypes: ["electric"],
    transmissions: ["automatic"],
    headerSeo:
      'The Tata Motors Tigor EV combines modern design with practical engineering, offering electric options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Electric sedan with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 75 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Tigor EV showcases Tata Motors\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Tigor EV a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Tigor EV is a strong contender in the Electric sedan.',
    engineSummaries: [
      {
        title: 'Electric Motor',
        summary:
          'Electric Motor delivering 75 bhp with 170 Nm of torque for daily driving needs.',
        transmission: 'Single-speed',
        power: '75 bhp',
        torque: '170 Nm',
        speed: 'Single-speed',
      },
    ],
    mileageData: [
      { engineName: 'Electric Motor', ...fuelEconomy('315 km range', 'N/A', 'N/A') },
    ],
    faqs: defaultFaqs('Tata Motors Tigor EV', '₹8.5–12.5 lakh', '315 km range', '5 seats'),
  },
  {
    name: 'Altroz',
    status: 'active',
    isPopular: true,
    popularRank: 6,
    isNew: false,
    bodyType: 'Hatchback',
    subBodyType: 'Premium hatchback',
    launchDate: '2020-01',
    seating: 5,
    fuelTypes: ["petrol"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Tata Motors Altroz combines modern design with practical engineering, offering petrol options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Premium hatchback with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 86 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Altroz showcases Tata Motors\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Altroz a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Altroz is a strong contender in the Premium hatchback.',
    engineSummaries: [
      {
        title: '1.2L Revotron Petrol MT',
        summary:
          '1.2L Revotron Petrol MT delivering 86 bhp with 113 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '86 bhp',
        torque: '113 Nm',
        speed: '5-speed manual',
      },
      {
        title: '1.2L Turbo Petrol MT',
        summary:
          '1.2L Turbo Petrol MT delivering 110 bhp with 140 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '110 bhp',
        torque: '140 Nm',
        speed: '6-speed manual',
      },
      {
        title: '1.2L Turbo Petrol DCA',
        summary:
          '1.2L Turbo Petrol DCA delivering 110 bhp with 140 Nm of torque for daily driving needs.',
        transmission: '7-speed DCA',
        power: '110 bhp',
        torque: '140 Nm',
        speed: '7-speed DCA',
      },
    ],
    mileageData: [
      { engineName: '1.2L Revotron Petrol MT', ...fuelEconomy('19.05 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.2L Turbo Petrol MT', ...fuelEconomy('19.05 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.2L Turbo Petrol DCA', ...fuelEconomy('19.05 kmpl', '14 kmpl', '17 kmpl') },
    ],
    faqs: defaultFaqs('Tata Motors Altroz', '₹6.5–10.8 lakh', '19.05 kmpl', '5 seats'),
  },
  {
    name: 'Sierra',
    status: 'active',
    isPopular: true,
    popularRank: 7,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: 'Lifestyle SUV',
    launchDate: '2025-08',
    seating: 5,
    fuelTypes: ["petrol", "electric"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Tata Motors Sierra combines modern design with practical engineering, offering petrol, electric options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Lifestyle SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 170 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Sierra showcases Tata Motors\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Sierra a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Sierra is a strong contender in the Lifestyle SUV.',
    engineSummaries: [
      {
        title: '2.0L Turbo Petrol MT',
        summary:
          '2.0L Turbo Petrol MT delivering 170 bhp with 350 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '170 bhp',
        torque: '350 Nm',
        speed: '6-speed manual',
      },
      {
        title: 'Electric Motor',
        summary:
          'Electric Motor delivering 138 bhp with 320 Nm of torque for daily driving needs.',
        transmission: 'Single-speed',
        power: '138 bhp',
        torque: '320 Nm',
        speed: 'Single-speed',
      },
    ],
    mileageData: [
      { engineName: '2.0L Turbo Petrol MT', ...fuelEconomy('16.0 kmpl / 450 km range', '12 kmpl', '15 kmpl') },
      { engineName: 'Electric Motor', ...fuelEconomy('16.0 kmpl / 450 km range', '12 kmpl', '15 kmpl') },
    ],
    faqs: defaultFaqs('Tata Motors Sierra', '₹18.0–28.0 lakh', '16.0 kmpl / 450 km range', '5 seats'),
  },
  {
    name: 'Punch',
    status: 'active',
    isPopular: true,
    popularRank: 8,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Micro SUV',
    launchDate: '2021-10',
    seating: 5,
    fuelTypes: ["petrol"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Tata Motors Punch combines modern design with practical engineering, offering petrol options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Micro SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 86 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Punch showcases Tata Motors\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Punch a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Punch is a strong contender in the Micro SUV.',
    engineSummaries: [
      {
        title: '1.2L Revotron Petrol MT',
        summary:
          '1.2L Revotron Petrol MT delivering 86 bhp with 113 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '86 bhp',
        torque: '113 Nm',
        speed: '5-speed manual',
      },
      {
        title: '1.2L Revotron Petrol AMT',
        summary:
          '1.2L Revotron Petrol AMT delivering 86 bhp with 113 Nm of torque for daily driving needs.',
        transmission: '5-speed AMT',
        power: '86 bhp',
        torque: '113 Nm',
        speed: '5-speed AMT',
      },
    ],
    mileageData: [
      { engineName: '1.2L Revotron Petrol MT', ...fuelEconomy('18.97 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.2L Revotron Petrol AMT', ...fuelEconomy('18.97 kmpl', '14 kmpl', '17 kmpl') },
    ],
    faqs: defaultFaqs('Tata Motors Punch', '₹6.1–10.2 lakh', '18.97 kmpl', '5 seats'),
  },
  {
    name: 'Punch EV',
    status: 'active',
    isPopular: true,
    popularRank: 9,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: 'Electric micro SUV',
    launchDate: '2025-01',
    seating: 5,
    fuelTypes: ["electric"],
    transmissions: ["automatic"],
    headerSeo:
      'The Tata Motors Punch EV combines modern design with practical engineering, offering electric options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Electric micro SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 120 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Punch EV showcases Tata Motors\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Punch EV a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Punch EV is a strong contender in the Electric micro SUV.',
    engineSummaries: [
      {
        title: 'Electric Motor',
        summary:
          'Electric Motor delivering 120 bhp with 190 Nm of torque for daily driving needs.',
        transmission: 'Single-speed',
        power: '120 bhp',
        torque: '190 Nm',
        speed: 'Single-speed',
      },
    ],
    mileageData: [
      { engineName: 'Electric Motor', ...fuelEconomy('365 km range', 'N/A', 'N/A') },
    ],
    faqs: defaultFaqs('Tata Motors Punch EV', '₹10.9–15.5 lakh', '365 km range', '5 seats'),
  },
  {
    name: 'Nexon',
    status: 'active',
    isPopular: true,
    popularRank: 10,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Compact SUV',
    launchDate: '2023-09',
    seating: 5,
    fuelTypes: ["petrol"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Tata Motors Nexon combines modern design with practical engineering, offering petrol options and manual, automatic transmissions for diverse buyer needs.',
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
      'The Nexon showcases Tata Motors\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Nexon a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Nexon is a strong contender in the Compact SUV.',
    engineSummaries: [
      {
        title: '1.2L Turbo Petrol MT',
        summary:
          '1.2L Turbo Petrol MT delivering 120 bhp with 170 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '120 bhp',
        torque: '170 Nm',
        speed: '6-speed manual',
      },
      {
        title: '1.2L Turbo Petrol AMT',
        summary:
          '1.2L Turbo Petrol AMT delivering 120 bhp with 170 Nm of torque for daily driving needs.',
        transmission: '6-speed AMT',
        power: '120 bhp',
        torque: '170 Nm',
        speed: '6-speed AMT',
      },
    ],
    mileageData: [
      { engineName: '1.2L Turbo Petrol MT', ...fuelEconomy('17.4 kmpl', '13 kmpl', '16 kmpl') },
      { engineName: '1.2L Turbo Petrol AMT', ...fuelEconomy('17.4 kmpl', '13 kmpl', '16 kmpl') },
    ],
    faqs: defaultFaqs('Tata Motors Nexon', '₹8.0–15.5 lakh', '17.4 kmpl', '5 seats'),
  },
  {
    name: 'Nexon EV',
    status: 'active',
    isPopular: false,
    popularRank: undefined,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: 'Electric SUV',
    launchDate: '2024-09',
    seating: 5,
    fuelTypes: ["electric"],
    transmissions: ["automatic"],
    headerSeo:
      'The Tata Motors Nexon EV combines modern design with practical engineering, offering electric options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Electric SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 143 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Nexon EV showcases Tata Motors\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Nexon EV a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Nexon EV is a strong contender in the Electric SUV.',
    engineSummaries: [
      {
        title: 'Electric Motor',
        summary:
          'Electric Motor delivering 143 bhp with 250 Nm of torque for daily driving needs.',
        transmission: 'Single-speed',
        power: '143 bhp',
        torque: '250 Nm',
        speed: 'Single-speed',
      },
    ],
    mileageData: [
      { engineName: 'Electric Motor', ...fuelEconomy('465 km range', 'N/A', 'N/A') },
    ],
    faqs: defaultFaqs('Tata Motors Nexon EV', '₹13.9–19.5 lakh', '465 km range', '5 seats'),
  },
  {
    name: 'Curvv',
    status: 'active',
    isPopular: false,
    popularRank: undefined,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: 'Coupe SUV',
    launchDate: '2024-09',
    seating: 5,
    fuelTypes: ["petrol"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Tata Motors Curvv combines modern design with practical engineering, offering petrol options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Coupe SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 125 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Curvv showcases Tata Motors\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Curvv a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Curvv is a strong contender in the Coupe SUV.',
    engineSummaries: [
      {
        title: '1.2L Turbo Petrol MT',
        summary:
          '1.2L Turbo Petrol MT delivering 125 bhp with 225 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '125 bhp',
        torque: '225 Nm',
        speed: '6-speed manual',
      },
      {
        title: '1.2L Turbo Petrol DCA',
        summary:
          '1.2L Turbo Petrol DCA delivering 125 bhp with 225 Nm of torque for daily driving needs.',
        transmission: '7-speed DCA',
        power: '125 bhp',
        torque: '225 Nm',
        speed: '7-speed DCA',
      },
    ],
    mileageData: [
      { engineName: '1.2L Turbo Petrol MT', ...fuelEconomy('17.5 kmpl', '13 kmpl', '16 kmpl') },
      { engineName: '1.2L Turbo Petrol DCA', ...fuelEconomy('17.5 kmpl', '13 kmpl', '16 kmpl') },
    ],
    faqs: defaultFaqs('Tata Motors Curvv', '₹10.0–17.5 lakh', '17.5 kmpl', '5 seats'),
  },
  {
    name: 'Curvv EV',
    status: 'active',
    isPopular: false,
    popularRank: undefined,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: 'Electric coupe SUV',
    launchDate: '2024-08',
    seating: 5,
    fuelTypes: ["electric"],
    transmissions: ["automatic"],
    headerSeo:
      'The Tata Motors Curvv EV combines modern design with practical engineering, offering electric options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Electric coupe SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 167 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Curvv EV showcases Tata Motors\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Curvv EV a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Curvv EV is a strong contender in the Electric coupe SUV.',
    engineSummaries: [
      {
        title: 'Electric Motor',
        summary:
          'Electric Motor delivering 167 bhp with 215 Nm of torque for daily driving needs.',
        transmission: 'Single-speed',
        power: '167 bhp',
        torque: '215 Nm',
        speed: 'Single-speed',
      },
    ],
    mileageData: [
      { engineName: 'Electric Motor', ...fuelEconomy('502 km range', 'N/A', 'N/A') },
    ],
    faqs: defaultFaqs('Tata Motors Curvv EV', '₹17.5–21.9 lakh', '502 km range', '5 seats'),
  },
  {
    name: 'Harrier',
    status: 'active',
    isPopular: false,
    popularRank: undefined,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Mid-size SUV',
    launchDate: '2023-10',
    seating: 5,
    fuelTypes: ["petrol"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Tata Motors Harrier combines modern design with practical engineering, offering petrol options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Mid-size SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 170 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Harrier showcases Tata Motors\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Harrier a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Harrier is a strong contender in the Mid-size SUV.',
    engineSummaries: [
      {
        title: '2.0L Turbo Petrol MT',
        summary:
          '2.0L Turbo Petrol MT delivering 170 bhp with 350 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '170 bhp',
        torque: '350 Nm',
        speed: '6-speed manual',
      },
      {
        title: '2.0L Turbo Petrol AT',
        summary:
          '2.0L Turbo Petrol AT delivering 170 bhp with 350 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '170 bhp',
        torque: '350 Nm',
        speed: '6-speed automatic',
      },
    ],
    mileageData: [
      { engineName: '2.0L Turbo Petrol MT', ...fuelEconomy('15.0 kmpl', '11 kmpl', '14 kmpl') },
      { engineName: '2.0L Turbo Petrol AT', ...fuelEconomy('15.0 kmpl', '11 kmpl', '14 kmpl') },
    ],
    faqs: defaultFaqs('Tata Motors Harrier', '₹15.5–26.5 lakh', '15.0 kmpl', '5 seats'),
  },
  {
    name: 'Harrier EV',
    status: 'active',
    isPopular: false,
    popularRank: undefined,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: 'Electric SUV',
    launchDate: '2025-01',
    seating: 5,
    fuelTypes: ["electric"],
    transmissions: ["automatic"],
    headerSeo:
      'The Tata Motors Harrier EV combines modern design with practical engineering, offering electric options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Electric SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 200 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Harrier EV showcases Tata Motors\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Harrier EV a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Harrier EV is a strong contender in the Electric SUV.',
    engineSummaries: [
      {
        title: 'Electric Motor',
        summary:
          'Electric Motor delivering 200 bhp with 350 Nm of torque for daily driving needs.',
        transmission: 'Single-speed',
        power: '200 bhp',
        torque: '350 Nm',
        speed: 'Single-speed',
      },
    ],
    mileageData: [
      { engineName: 'Electric Motor', ...fuelEconomy('500 km range', 'N/A', 'N/A') },
    ],
    faqs: defaultFaqs('Tata Motors Harrier EV', '₹22.0–32.0 lakh', '500 km range', '5 seats'),
  },
  {
    name: 'Safari',
    status: 'active',
    isPopular: false,
    popularRank: undefined,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: '3-row SUV',
    launchDate: '2023-10',
    seating: 7,
    fuelTypes: ["petrol"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Tata Motors Safari combines modern design with practical engineering, offering petrol options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the 3-row SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 170 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Safari showcases Tata Motors\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Safari a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Safari is a strong contender in the 3-row SUV.',
    engineSummaries: [
      {
        title: '2.0L Turbo Petrol MT',
        summary:
          '2.0L Turbo Petrol MT delivering 170 bhp with 350 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '170 bhp',
        torque: '350 Nm',
        speed: '6-speed manual',
      },
      {
        title: '2.0L Turbo Petrol AT',
        summary:
          '2.0L Turbo Petrol AT delivering 170 bhp with 350 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '170 bhp',
        torque: '350 Nm',
        speed: '6-speed automatic',
      },
    ],
    mileageData: [
      { engineName: '2.0L Turbo Petrol MT', ...fuelEconomy('14.1 kmpl', '10 kmpl', '13 kmpl') },
      { engineName: '2.0L Turbo Petrol AT', ...fuelEconomy('14.1 kmpl', '10 kmpl', '13 kmpl') },
    ],
    faqs: defaultFaqs('Tata Motors Safari', '₹16.2–27.3 lakh', '14.1 kmpl', '7-seater'),
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

const log = (...args: unknown[]) => console.log('[seed-tata-models]', ...args);

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
  log(`🚀 Starting Tata Motors models seeding for ${models.length} entries`);
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
