import 'dotenv/config';
import { InsertModel } from '../server/validation/schemas';

const API_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:5001';
const ADMIN_TOKEN = process.env.BACKEND_ADMIN_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLTE3NjE4MTcwODgyMTMiLCJlbWFpbCI6ImFkbWluQG1vdG9yb2N0YW5lLmNvbSIsIm5hbWUiOiJBZG1pbiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTc2MzUzNzAwOSwiZXhwIjoxNzYzNjIzNDA5fQ.3y0dvJPaV1pV2euPtMdGDDMCBLAzHldu3hlunKvh-4U';

const BRAND_ID = 'brand-toyota';

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
    name: 'Glanza',
    status: 'active',
    isPopular: true,
    popularRank: 1,
    isNew: false,
    bodyType: 'Hatchback',
    subBodyType: 'Premium hatchback',
    launchDate: '2022-03',
    seating: 5,
    fuelTypes: ["petrol", "cng"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Toyota Glanza combines modern design with practical engineering, offering petrol, cng options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Premium hatchback with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 90 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Glanza showcases Toyota\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Glanza a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Glanza is a strong contender in the Premium hatchback.',
    engineSummaries: [
      {
        title: '1.2L Petrol MT',
        summary:
          '1.2L Petrol MT delivering 90 bhp with 113 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '90 bhp',
        torque: '113 Nm',
        speed: '5-speed manual',
      },
      {
        title: '1.2L Petrol AMT',
        summary:
          '1.2L Petrol AMT delivering 90 bhp with 113 Nm of torque for daily driving needs.',
        transmission: '5-speed AMT',
        power: '90 bhp',
        torque: '113 Nm',
        speed: '5-speed AMT',
      },
      {
        title: '1.2L CNG',
        summary:
          '1.2L CNG delivering 77 bhp with 98 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '77 bhp',
        torque: '98 Nm',
        speed: '5-speed manual',
      },
    ],
    mileageData: [
      { engineName: '1.2L Petrol MT', ...fuelEconomy('22.35 kmpl', '17 kmpl', '20 kmpl') },
      { engineName: '1.2L Petrol AMT', ...fuelEconomy('22.35 kmpl', '17 kmpl', '20 kmpl') },
      { engineName: '1.2L CNG', ...fuelEconomy('22.35 kmpl', '17 kmpl', '20 kmpl') },
    ],
    faqs: defaultFaqs('Toyota Glanza', '₹6.9–10.0 lakh', '22.35 kmpl', '5 seats'),
  },
  {
    name: 'Urban Cruiser Taisor',
    status: 'active',
    isPopular: true,
    popularRank: 2,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: 'Compact SUV',
    launchDate: '2024-04',
    seating: 5,
    fuelTypes: ["petrol", "cng"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Toyota Urban Cruiser Taisor combines modern design with practical engineering, offering petrol, cng options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Compact SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 90 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Urban Cruiser Taisor showcases Toyota\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Urban Cruiser Taisor a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Urban Cruiser Taisor is a strong contender in the Compact SUV.',
    engineSummaries: [
      {
        title: '1.2L Petrol MT',
        summary:
          '1.2L Petrol MT delivering 90 bhp with 113 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '90 bhp',
        torque: '113 Nm',
        speed: '5-speed manual',
      },
      {
        title: '1.0L Turbo Petrol MT',
        summary:
          '1.0L Turbo Petrol MT delivering 100 bhp with 147.6 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '100 bhp',
        torque: '147.6 Nm',
        speed: '6-speed manual',
      },
      {
        title: '1.0L Turbo Petrol AT',
        summary:
          '1.0L Turbo Petrol AT delivering 100 bhp with 147.6 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '100 bhp',
        torque: '147.6 Nm',
        speed: '6-speed automatic',
      },
      {
        title: '1.2L CNG',
        summary:
          '1.2L CNG delivering 77 bhp with 98 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '77 bhp',
        torque: '98 Nm',
        speed: '5-speed manual',
      },
    ],
    mileageData: [
      { engineName: '1.2L Petrol MT', ...fuelEconomy('19.8 kmpl', '15 kmpl', '18 kmpl') },
      { engineName: '1.0L Turbo Petrol MT', ...fuelEconomy('19.8 kmpl', '15 kmpl', '18 kmpl') },
      { engineName: '1.0L Turbo Petrol AT', ...fuelEconomy('19.8 kmpl', '15 kmpl', '18 kmpl') },
      { engineName: '1.2L CNG', ...fuelEconomy('19.8 kmpl', '15 kmpl', '18 kmpl') },
    ],
    faqs: defaultFaqs('Toyota Urban Cruiser Taisor', '₹7.7–13.7 lakh', '19.8 kmpl', '5 seats'),
  },
  {
    name: 'Urban Cruiser Hyryder',
    status: 'active',
    isPopular: true,
    popularRank: 3,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Mid-size SUV',
    launchDate: '2022-09',
    seating: 5,
    fuelTypes: ["petrol", "strong hybrid"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Toyota Urban Cruiser Hyryder combines modern design with practical engineering, offering petrol, strong hybrid options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Mid-size SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 103 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Urban Cruiser Hyryder showcases Toyota\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Urban Cruiser Hyryder a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Urban Cruiser Hyryder is a strong contender in the Mid-size SUV.',
    engineSummaries: [
      {
        title: '1.5L Petrol MT',
        summary:
          '1.5L Petrol MT delivering 103 bhp with 137 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '103 bhp',
        torque: '137 Nm',
        speed: '5-speed manual',
      },
      {
        title: '1.5L Petrol AT',
        summary:
          '1.5L Petrol AT delivering 103 bhp with 137 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '103 bhp',
        torque: '137 Nm',
        speed: '6-speed automatic',
      },
      {
        title: '1.5L Strong Hybrid e-CVT',
        summary:
          '1.5L Strong Hybrid e-CVT delivering 116 bhp with 141 Nm of torque for daily driving needs.',
        transmission: 'e-CVT',
        power: '116 bhp',
        torque: '141 Nm',
        speed: 'e-CVT',
      },
    ],
    mileageData: [
      { engineName: '1.5L Petrol MT', ...fuelEconomy('27.97 kmpl', '18 kmpl', '22 kmpl') },
      { engineName: '1.5L Petrol AT', ...fuelEconomy('27.97 kmpl', '18 kmpl', '22 kmpl') },
      { engineName: '1.5L Strong Hybrid e-CVT', ...fuelEconomy('27.97 kmpl', '18 kmpl', '22 kmpl') },
    ],
    faqs: defaultFaqs('Toyota Urban Cruiser Hyryder', '₹11.1–20.5 lakh', '27.97 kmpl', '5 seats'),
  },
  {
    name: 'Rumion',
    status: 'active',
    isPopular: true,
    popularRank: 4,
    isNew: false,
    bodyType: 'MPV',
    subBodyType: 'Compact MPV',
    launchDate: '2023-09',
    seating: 7,
    fuelTypes: ["petrol", "cng"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Toyota Rumion combines modern design with practical engineering, offering petrol, cng options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Compact MPV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 105 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Rumion showcases Toyota\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Rumion a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Rumion is a strong contender in the Compact MPV.',
    engineSummaries: [
      {
        title: '1.5L Petrol MT',
        summary:
          '1.5L Petrol MT delivering 105 bhp with 138 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '105 bhp',
        torque: '138 Nm',
        speed: '5-speed manual',
      },
      {
        title: '1.5L Petrol AT',
        summary:
          '1.5L Petrol AT delivering 105 bhp with 138 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '105 bhp',
        torque: '138 Nm',
        speed: '6-speed automatic',
      },
      {
        title: '1.5L CNG',
        summary:
          '1.5L CNG delivering 88 bhp with 121 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '88 bhp',
        torque: '121 Nm',
        speed: '5-speed manual',
      },
    ],
    mileageData: [
      { engineName: '1.5L Petrol MT', ...fuelEconomy('20.5 kmpl', '15 kmpl', '18 kmpl') },
      { engineName: '1.5L Petrol AT', ...fuelEconomy('20.5 kmpl', '15 kmpl', '18 kmpl') },
      { engineName: '1.5L CNG', ...fuelEconomy('20.5 kmpl', '15 kmpl', '18 kmpl') },
    ],
    faqs: defaultFaqs('Toyota Rumion', '₹10.4–13.7 lakh', '20.5 kmpl', '7-seater'),
  },
  {
    name: 'Innova Crysta',
    status: 'active',
    isPopular: true,
    popularRank: 5,
    isNew: false,
    bodyType: 'MPV',
    subBodyType: 'Premium MPV',
    launchDate: '2020-11',
    seating: 8,
    fuelTypes: ["petrol", "diesel"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Toyota Innova Crysta combines modern design with practical engineering, offering petrol, diesel options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Premium MPV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 166 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Innova Crysta showcases Toyota\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Innova Crysta a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Innova Crysta is a strong contender in the Premium MPV.',
    engineSummaries: [
      {
        title: '2.7L Petrol MT',
        summary:
          '2.7L Petrol MT delivering 166 bhp with 245 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '166 bhp',
        torque: '245 Nm',
        speed: '5-speed manual',
      },
      {
        title: '2.7L Petrol AT',
        summary:
          '2.7L Petrol AT delivering 166 bhp with 245 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '166 bhp',
        torque: '245 Nm',
        speed: '6-speed automatic',
      },
      {
        title: '2.4L Diesel MT',
        summary:
          '2.4L Diesel MT delivering 150 bhp with 360 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '150 bhp',
        torque: '360 Nm',
        speed: '5-speed manual',
      },
      {
        title: '2.4L Diesel AT',
        summary:
          '2.4L Diesel AT delivering 150 bhp with 360 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '150 bhp',
        torque: '360 Nm',
        speed: '6-speed automatic',
      },
    ],
    mileageData: [
      { engineName: '2.7L Petrol MT', ...fuelEconomy('15.8 kmpl', '11 kmpl', '14 kmpl') },
      { engineName: '2.7L Petrol AT', ...fuelEconomy('15.8 kmpl', '11 kmpl', '14 kmpl') },
      { engineName: '2.4L Diesel MT', ...fuelEconomy('15.8 kmpl', '11 kmpl', '14 kmpl') },
      { engineName: '2.4L Diesel AT', ...fuelEconomy('15.8 kmpl', '11 kmpl', '14 kmpl') },
    ],
    faqs: defaultFaqs('Toyota Innova Crysta', '₹19.1–26.5 lakh', '15.8 kmpl', '8-seater'),
  },
  {
    name: 'Innova Hycross',
    status: 'active',
    isPopular: true,
    popularRank: 6,
    isNew: false,
    bodyType: 'MPV',
    subBodyType: 'Hybrid MPV',
    launchDate: '2023-01',
    seating: 8,
    fuelTypes: ["petrol", "strong hybrid"],
    transmissions: ["automatic", "e-CVT"],
    headerSeo:
      'The Toyota Innova Hycross combines modern design with practical engineering, offering petrol, strong hybrid options and automatic, e-CVT transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Hybrid MPV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 174 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Innova Hycross showcases Toyota\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Innova Hycross a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Innova Hycross is a strong contender in the Hybrid MPV.',
    engineSummaries: [
      {
        title: '2.0L Petrol CVT',
        summary:
          '2.0L Petrol CVT delivering 174 bhp with 197 Nm of torque for daily driving needs.',
        transmission: 'CVT',
        power: '174 bhp',
        torque: '197 Nm',
        speed: 'CVT',
      },
      {
        title: '2.0L Strong Hybrid e-CVT',
        summary:
          '2.0L Strong Hybrid e-CVT delivering 186 bhp with 206 Nm of torque for daily driving needs.',
        transmission: 'e-CVT',
        power: '186 bhp',
        torque: '206 Nm',
        speed: 'e-CVT',
      },
    ],
    mileageData: [
      { engineName: '2.0L Petrol CVT', ...fuelEconomy('23.24 kmpl', '17 kmpl', '21 kmpl') },
      { engineName: '2.0L Strong Hybrid e-CVT', ...fuelEconomy('23.24 kmpl', '17 kmpl', '21 kmpl') },
    ],
    faqs: defaultFaqs('Toyota Innova Hycross', '₹19.8–30.9 lakh', '23.24 kmpl', '8-seater'),
  },
  {
    name: 'Hilux',
    status: 'active',
    isPopular: true,
    popularRank: 7,
    isNew: false,
    bodyType: 'Pickup Truck',
    subBodyType: 'Lifestyle pickup',
    launchDate: '2022-01',
    seating: 5,
    fuelTypes: ["diesel"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Toyota Hilux combines modern design with practical engineering, offering diesel options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Lifestyle pickup with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 204 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Hilux showcases Toyota\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Hilux a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Hilux is a strong contender in the Lifestyle pickup.',
    engineSummaries: [
      {
        title: '2.8L Diesel MT',
        summary:
          '2.8L Diesel MT delivering 204 bhp with 500 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '204 bhp',
        torque: '500 Nm',
        speed: '6-speed manual',
      },
      {
        title: '2.8L Diesel AT',
        summary:
          '2.8L Diesel AT delivering 204 bhp with 500 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '204 bhp',
        torque: '500 Nm',
        speed: '6-speed automatic',
      },
    ],
    mileageData: [
      { engineName: '2.8L Diesel MT', ...fuelEconomy('13.9 kmpl', '10 kmpl', '13 kmpl') },
      { engineName: '2.8L Diesel AT', ...fuelEconomy('13.9 kmpl', '10 kmpl', '13 kmpl') },
    ],
    faqs: defaultFaqs('Toyota Hilux', '₹33.9–37.0 lakh', '13.9 kmpl', '5 seats'),
  },
  {
    name: 'Fortuner',
    status: 'active',
    isPopular: true,
    popularRank: 8,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Premium SUV',
    launchDate: '2021-01',
    seating: 7,
    fuelTypes: ["petrol", "diesel"],
    transmissions: ["manual", "automatic"],
    headerSeo:
      'The Toyota Fortuner combines modern design with practical engineering, offering petrol, diesel options and manual, automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Premium SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 166 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Fortuner showcases Toyota\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Fortuner a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Fortuner is a strong contender in the Premium SUV.',
    engineSummaries: [
      {
        title: '2.7L Petrol MT',
        summary:
          '2.7L Petrol MT delivering 166 bhp with 245 Nm of torque for daily driving needs.',
        transmission: '5-speed manual',
        power: '166 bhp',
        torque: '245 Nm',
        speed: '5-speed manual',
      },
      {
        title: '2.7L Petrol AT',
        summary:
          '2.7L Petrol AT delivering 166 bhp with 245 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '166 bhp',
        torque: '245 Nm',
        speed: '6-speed automatic',
      },
      {
        title: '2.8L Diesel MT',
        summary:
          '2.8L Diesel MT delivering 204 bhp with 500 Nm of torque for daily driving needs.',
        transmission: '6-speed manual',
        power: '204 bhp',
        torque: '500 Nm',
        speed: '6-speed manual',
      },
      {
        title: '2.8L Diesel AT',
        summary:
          '2.8L Diesel AT delivering 204 bhp with 500 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '204 bhp',
        torque: '500 Nm',
        speed: '6-speed automatic',
      },
    ],
    mileageData: [
      { engineName: '2.7L Petrol MT', ...fuelEconomy('14.2 kmpl', '10 kmpl', '13 kmpl') },
      { engineName: '2.7L Petrol AT', ...fuelEconomy('14.2 kmpl', '10 kmpl', '13 kmpl') },
      { engineName: '2.8L Diesel MT', ...fuelEconomy('14.2 kmpl', '10 kmpl', '13 kmpl') },
      { engineName: '2.8L Diesel AT', ...fuelEconomy('14.2 kmpl', '10 kmpl', '13 kmpl') },
    ],
    faqs: defaultFaqs('Toyota Fortuner', '₹33.4–51.4 lakh', '14.2 kmpl', '7-seater'),
  },
  {
    name: 'Fortuner Legender',
    status: 'active',
    isPopular: true,
    popularRank: 9,
    isNew: false,
    bodyType: 'SUV',
    subBodyType: 'Premium SUV',
    launchDate: '2021-01',
    seating: 7,
    fuelTypes: ["diesel"],
    transmissions: ["automatic"],
    headerSeo:
      'The Toyota Fortuner Legender combines modern design with practical engineering, offering diesel options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Premium SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 204 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Fortuner Legender showcases Toyota\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Fortuner Legender a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Fortuner Legender is a strong contender in the Premium SUV.',
    engineSummaries: [
      {
        title: '2.8L Diesel AT',
        summary:
          '2.8L Diesel AT delivering 204 bhp with 500 Nm of torque for daily driving needs.',
        transmission: '6-speed automatic',
        power: '204 bhp',
        torque: '500 Nm',
        speed: '6-speed automatic',
      },
    ],
    mileageData: [
      { engineName: '2.8L Diesel AT', ...fuelEconomy('14.2 kmpl', '10 kmpl', '13 kmpl') },
    ],
    faqs: defaultFaqs('Toyota Fortuner Legender', '₹43.7–47.6 lakh', '14.2 kmpl', '7-seater'),
  },
  {
    name: 'Camry',
    status: 'active',
    isPopular: true,
    popularRank: 10,
    isNew: true,
    bodyType: 'Sedan',
    subBodyType: 'Hybrid sedan',
    launchDate: '2024-03',
    seating: 5,
    fuelTypes: ["strong hybrid"],
    transmissions: ["e-CVT"],
    headerSeo:
      'The Toyota Camry combines modern design with practical engineering, offering strong hybrid options and e-CVT transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Hybrid sedan with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 218 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Camry showcases Toyota\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Camry a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Camry is a strong contender in the Hybrid sedan.',
    engineSummaries: [
      {
        title: '2.5L Strong Hybrid e-CVT',
        summary:
          '2.5L Strong Hybrid e-CVT delivering 218 bhp with 221 Nm of torque for daily driving needs.',
        transmission: 'e-CVT',
        power: '218 bhp',
        torque: '221 Nm',
        speed: 'e-CVT',
      },
    ],
    mileageData: [
      { engineName: '2.5L Strong Hybrid e-CVT', ...fuelEconomy('23.0 kmpl', '18 kmpl', '21 kmpl') },
    ],
    faqs: defaultFaqs('Toyota Camry', '₹48.0–48.9 lakh', '23.0 kmpl', '5 seats'),
  },
  {
    name: 'Land Cruiser LC300',
    status: 'active',
    isPopular: false,
    popularRank: undefined,
    isNew: true,
    bodyType: 'SUV',
    subBodyType: 'Full-size SUV',
    launchDate: '2024-08',
    seating: 7,
    fuelTypes: ["diesel"],
    transmissions: ["automatic"],
    headerSeo:
      'The Toyota Land Cruiser LC300 combines modern design with practical engineering, offering diesel options and automatic transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Full-size SUV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 309 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Land Cruiser LC300 showcases Toyota\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Land Cruiser LC300 a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Land Cruiser LC300 is a strong contender in the Full-size SUV.',
    engineSummaries: [
      {
        title: '3.3L Twin-Turbo Diesel AT',
        summary:
          '3.3L Twin-Turbo Diesel AT delivering 309 bhp with 700 Nm of torque for daily driving needs.',
        transmission: '10-speed automatic',
        power: '309 bhp',
        torque: '700 Nm',
        speed: '10-speed automatic',
      },
    ],
    mileageData: [
      { engineName: '3.3L Twin-Turbo Diesel AT', ...fuelEconomy('11.0 kmpl', '8 kmpl', '10 kmpl') },
    ],
    faqs: defaultFaqs('Toyota Land Cruiser LC300', '₹2.10 crore (approx)', '11.0 kmpl', '7-seater'),
  },
  {
    name: 'Vellfire',
    status: 'active',
    isPopular: false,
    popularRank: undefined,
    isNew: false,
    bodyType: 'MPV',
    subBodyType: 'Luxury MPV',
    launchDate: '2020-02',
    seating: 7,
    fuelTypes: ["strong hybrid"],
    transmissions: ["e-CVT"],
    headerSeo:
      'The Toyota Vellfire combines modern design with practical engineering, offering strong hybrid options and e-CVT transmissions for diverse buyer needs.',
    pros: createParagraph([
      '• Competitive pricing in the Luxury MPV with strong value proposition.',
      '• Well-equipped cabin with modern infotainment and connectivity features.',
      '• 152 bhp power output delivers confident performance.',
    ]),
    cons: createParagraph([
      '• Some rivals offer more advanced driver assistance systems.',
      '• Boot space could be larger for extended family trips.',
      '• Rear seat comfort is adequate but not class-leading.',
    ]),
    description:
      'The Vellfire showcases Toyota\'s focus on delivering quality, comfort, and technology. With a spacious cabin, thoughtful features, and efficient powertrains, it caters to modern buyers seeking reliability.',
    exteriorDesign:
      'Bold grille, sleek LED headlamps, and sculpted body panels give the Vellfire a contemporary road presence. Alloy wheels and chrome accents add premium appeal.',
    comfortConvenience:
      'Features include touchscreen infotainment, climate control, cruise control, and multiple airbags. Premium variants add ventilated seats, sunroof, and connected car technology.',
    summary:
      'A well-rounded package that balances style, space, and substance, the Vellfire is a strong contender in the Luxury MPV.',
    engineSummaries: [
      {
        title: '2.5L Strong Hybrid e-CVT',
        summary:
          '2.5L Strong Hybrid e-CVT delivering 152 bhp with 206 Nm of torque for daily driving needs.',
        transmission: 'e-CVT',
        power: '152 bhp',
        torque: '206 Nm',
        speed: 'e-CVT',
      },
    ],
    mileageData: [
      { engineName: '2.5L Strong Hybrid e-CVT', ...fuelEconomy('16.35 kmpl', '13 kmpl', '15 kmpl') },
    ],
    faqs: defaultFaqs('Toyota Vellfire', '₹1.32 crore (approx)', '16.35 kmpl', '7-seater'),
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

const log = (...args: unknown[]) => console.log('[seed-toyota-models]', ...args);

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
  log(`🚀 Starting Toyota models seeding for ${models.length} entries`);
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
