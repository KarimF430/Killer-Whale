import 'dotenv/config';
import { InsertModel } from '../server/validation/schemas';

const API_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:5001';
const ADMIN_TOKEN = process.env.BACKEND_ADMIN_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLTE3NjE4MTcwODgyMTMiLCJlbWFpbCI6ImFkbWluQG1vdG9yb2N0YW5lLmNvbSIsIm5hbWUiOiJBZG1pbiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTc2MzQ0OTg4OSwiZXhwIjoxNzYzNTM2Mjg5fQ.h_NJEVbUTccmEtLXocfOmw-DW_AzuF-jcFynML9Ra8s';

const BRAND_ID = 'brand-maruti-suzuki';

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
    name: 'Alto K10',
    status: 'active',
    isPopular: true,
    popularRank: 1,
    isNew: false,
    bodyType: 'Hatchback',
    subBodyType: 'Entry-level',
    launchDate: '2022-08',
    seating: 5,
    fuelTypes: ['petrol', 'cng'],
    transmissions: ['manual', 'amt'],
    headerSeo:
      'The Maruti Suzuki Alto K10 is an affordable city hatchback that pairs the lightweight Heartect platform with the frugal K10C petrol motor, making it ideal for first-time buyers and urban commuters.',
    pros: createParagraph([
      '• Excellent fuel efficiency with both petrol and CNG options.',
      '• Compact footprint and light controls make it effortless to drive in traffic.',
      '• Low ownership costs thanks to Maruti’s expansive service network.',
    ]),
    cons: createParagraph([
      '• Cabin insulation is average at highway speeds.',
      '• Rear seat best suited for two adults.',
      '• Misses out on some modern infotainment features.',
    ]),
    description:
      'The Alto K10 focuses on the essentials: light weight, responsive throttle inputs, and city-friendly ergonomics. The upright seating and wide glass area offer great visibility while the updated dashboard adds youthful touches.',
    exteriorDesign:
      'Chunky bumpers, sweptback halogen headlamps, and a bold grille lend the Alto K10 a cheerful look. The raised bonnet and squared wheel arches subtly mimic mini SUV cues.',
    comfortConvenience:
      'Tilt-adjust steering, front power windows, digitised instrument cluster, and SmartPlay infotainment (in higher trims) cover daily needs. The rear seat can be folded to maximise luggage space for weekend runs.',
    summary:
      'Light, efficient, and dependable, the Alto K10 remains a favourite among buyers who prioritise value and easy ownership.',
    engineSummaries: [
      {
        title: '1.0L K10C Petrol MT',
        summary:
          'Three-cylinder dual-jet petrol tuned for linear acceleration with revised throttle mapping for city drivability.',
        transmission: '5-speed manual',
        power: '66 bhp',
        torque: '89 Nm',
        speed: '5-speed',
      },
      {
        title: '1.0L K10C Petrol AMT',
        summary:
          'Same K-Series petrol paired with a smooth-shifting 5-speed automatic manual transmission for clutch-free commutes.',
        transmission: 'AMT',
        power: '66 bhp',
        torque: '89 Nm',
        speed: '5-speed AMT',
      },
      {
        title: '1.0L K10C CNG',
        summary:
          'Calibrated for factory-fitted CNG kit with reinforced valves and separate ECU mapping to extend range.',
        transmission: '5-speed manual',
        power: '56 bhp',
        torque: '82 Nm',
        speed: '5-speed',
      },
    ],
    mileageData: [
      { engineName: '1.0L Petrol MT', ...fuelEconomy('24.39 kmpl', '18 kmpl', '22 kmpl') },
      { engineName: '1.0L Petrol AMT', ...fuelEconomy('24.07 kmpl', '17 kmpl', '21 kmpl') },
      { engineName: '1.0L CNG MT', ...fuelEconomy('33.85 km/kg', '30 km/kg', '32 km/kg') },
    ],
    faqs: defaultFaqs('Maruti Alto K10', '₹4.0 lakh', '18–24 kmpl / 30+ km/kg on CNG'),
  },
  {
    name: 'Ciaz',
    status: 'active',
    isPopular: true,
    popularRank: 2,
    bodyType: 'Sedan',
    subBodyType: 'Mid-size sedan',
    launchDate: '2018-10',
    seating: 5,
    fuelTypes: ['petrol'],
    transmissions: ['manual', 'automatic'],
    headerSeo:
      'The Maruti Suzuki Ciaz is a spacious mid-size sedan aimed at chauffeur-driven families who demand efficiency, premium interiors, and tried-and-tested reliability.',
    pros: createParagraph([
      '• One of the most spacious rear benches in the segment with soft cushioning.',
      '• Mild-hybrid tech delivers excellent fuel economy for a large sedan.',
      '• Smooth ride quality that flattens out rough city roads.',
    ]),
    cons: createParagraph([
      '• Petrol-only line-up might deter high-mileage diesel users.',
      '• Infotainment hardware feels dated next to newer rivals.',
      '• Driving dynamics prioritise comfort over sportiness.',
    ]),
    description:
      'An elongated 2,650 mm wheelbase, dual-tone cabin theme, and soft-touch inserts give the Ciaz an upmarket vibe. Smart Hybrid tech blends an ISG starter-generator with a lithium-ion battery to assist during acceleration.',
    exteriorDesign:
      'The chrome-laden grille, projector headlamps with LED DRLs, and sweptback tail lamps lend understated elegance. 16-inch alloys and balanced proportions complete the executive look.',
    comfortConvenience:
      'Rear sunshade, soft headrests, rear AC vents, automatic climate control, cruise control, and a 7-inch SmartPlay infotainment unit take care of everyday comfort.',
    summary:
      'If you want limousine-like space with Maruti running costs, the Ciaz remains a sensible and dependable pick.',
    engineSummaries: [
      {
        title: '1.5L K15 Smart Hybrid MT',
        summary:
          'Naturally aspirated petrol with smart hybrid assist for smoother launches and improved efficiency.',
        transmission: '5-speed manual',
        power: '103 bhp',
        torque: '138 Nm',
        speed: '5-speed',
      },
      {
        title: '1.5L K15 Smart Hybrid AT',
        summary:
          'Same refined petrol paired with a 4-speed torque converter tuned for relaxed cruising.',
        transmission: '4-speed automatic',
        power: '103 bhp',
        torque: '138 Nm',
        speed: '4-speed',
      },
    ],
    mileageData: [
      { engineName: '1.5L Petrol MT', ...fuelEconomy('20.65 kmpl', '15 kmpl', '18 kmpl') },
      { engineName: '1.5L Petrol AT', ...fuelEconomy('20.04 kmpl', '13 kmpl', '16 kmpl') },
    ],
    faqs: defaultFaqs('Maruti Ciaz', '₹9.5–12.5 lakh', '15–21 kmpl'),
  },
  {
    name: 'S-Presso',
    status: 'active',
    isPopular: true,
    popularRank: 3,
    bodyType: 'Micro SUV',
    subBodyType: 'Tallboy hatchback',
    launchDate: '2019-09',
    seating: 5,
    fuelTypes: ['petrol', 'cng'],
    transmissions: ['manual', 'amt'],
    headerSeo:
      'The S-Presso mixes SUV-inspired stance with hatchback agility, making it a favourite among buyers who want quirky styling, high seating, and low running costs.',
    pros: createParagraph([
      '• 198 mm ground clearance gives confidence on rough roads.',
      '• Peppy K10C engine combined with a kerb weight under 900 kg.',
      '• 7-inch SmartPlay studio with connected car features in higher trims.',
    ]),
    cons: createParagraph([
      '• Narrow cabin width limits shoulder room.',
      '• Safety kit limited to basics in entry trims.',
      '• Rear windows are manually operated.',
    ]),
    description:
      'A tall roofline, upright dashboard, and contrasting colour packs make the S-Presso stand out. The digital central instrument cluster frees up dash space while large door pockets add practicality.',
    exteriorDesign:
      'Squared wheel arches, skid plate style bumpers, and LED-like detailing create the “mini SUV” look Maruti advertises.',
    comfortConvenience:
      'Higher variants get steering-mounted controls, SmartPlay Studio with voice commands, and remote keyless entry. The seat base is taller to aid ingress and egress.',
    summary:
      'Ideal for city dwellers who want a tall driving position and simple ownership experience.',
    engineSummaries: [
      {
        title: '1.0L K10C Petrol MT',
        summary: 'Dual VVT petrol tuned for brisk low-end torque despite the tall gearing.',
        transmission: '5-speed manual',
        power: '66 bhp',
        torque: '89 Nm',
        speed: '5-speed',
      },
      {
        title: '1.0L K10C Petrol AMT',
        summary: 'AMT with creep function for easy stop-go traffic handling.',
        transmission: 'AMT',
        power: '66 bhp',
        torque: '89 Nm',
        speed: '5-speed AMT',
      },
      {
        title: '1.0L K10C CNG',
        summary: 'Factory CNG kit with reinforced valves and real-time fuel readout.',
        transmission: '5-speed manual',
        power: '56 bhp',
        torque: '82 Nm',
        speed: '5-speed',
      },
    ],
    mileageData: [
      { engineName: '1.0L Petrol MT', ...fuelEconomy('25.30 kmpl', '17 kmpl', '20 kmpl') },
      { engineName: '1.0L Petrol AMT', ...fuelEconomy('25.30 kmpl', '16 kmpl', '19 kmpl') },
      { engineName: '1.0L CNG MT', ...fuelEconomy('32.7 km/kg', '30 km/kg', '32 km/kg') },
    ],
    faqs: defaultFaqs('Maruti S-Presso', '₹4.3–6.0 lakh', '16–25 kmpl / 30+ km/kg on CNG'),
  },
  {
    name: 'Wagon R',
    status: 'active',
    isPopular: true,
    popularRank: 4,
    bodyType: 'Hatchback',
    subBodyType: 'Tallboy',
    launchDate: '2019-01',
    seating: 5,
    fuelTypes: ['petrol', 'cng'],
    transmissions: ['manual', 'amt'],
    headerSeo:
      'The Wagon R stays true to its tall-boy genes, now with dual-engine options, stronger structure, and an infotainment suite aimed at urban families.',
    pros: createParagraph([
      '• Unmatched headroom and easy ingress.',
      '• Choice of 1.0L and 1.2L petrol along with CNG.',
      '• Practical dual-tone dashboard with plenty of storage spots.',
    ]),
    cons: createParagraph([
      '• Steering feel is light but vague on highways.',
      '• Rear three-point seatbelt missing for middle passenger.',
      '• Body roll is evident during quick lane changes.',
    ]),
    description:
      'Longer wheelbase than previous gen, 341-litre boot, and 60:40 split rear seats underline practicality. The SmartPlay Studio supports Android Auto and Apple CarPlay.',
    exteriorDesign:
      'Squarish proportions with floating roof effect and vertical tail lamps help recognition.',
    comfortConvenience:
      'Tilt steering, driver seat height adjust, rear defogger, and day-night IRVM cover comfort basics.',
    summary:
      'A city warrior that blends practicality with fuel efficiency, ideal for growing families.',
    engineSummaries: [
      {
        title: '1.0L K10C Petrol',
        summary: 'Focuses on efficiency and light-weighting for city drives.',
        transmission: '5-speed manual/AMT',
        power: '66 bhp',
        torque: '89 Nm',
        speed: '5-speed',
      },
      {
        title: '1.2L K12N Petrol',
        summary: 'More power for highway runs with DualJet, Dual VVT tech.',
        transmission: '5-speed manual/AMT',
        power: '89 bhp',
        torque: '113 Nm',
        speed: '5-speed',
      },
      {
        title: '1.0L CNG',
        summary: 'Factory-fitted S-CNG with dual interdependent ECUs for safety.',
        transmission: '5-speed manual',
        power: '56 bhp',
        torque: '82 Nm',
        speed: '5-speed',
      },
    ],
    mileageData: [
      { engineName: '1.0L Petrol MT', ...fuelEconomy('24.35 kmpl', '17 kmpl', '21 kmpl') },
      { engineName: '1.2L Petrol MT', ...fuelEconomy('23.56 kmpl', '16 kmpl', '20 kmpl') },
      { engineName: '1.0L Petrol AMT', ...fuelEconomy('25.19 kmpl', '17 kmpl', '21 kmpl') },
      { engineName: '1.2L Petrol AMT', ...fuelEconomy('24.43 kmpl', '17 kmpl', '21 kmpl') },
      { engineName: '1.0L CNG MT', ...fuelEconomy('34.05 km/kg', '30 km/kg', '32 km/kg') },
    ],
    faqs: defaultFaqs('Maruti Wagon R', '₹5.5–7.5 lakh', '16–25 kmpl / 30+ km/kg on CNG'),
  },
  {
    name: 'Celerio',
    status: 'active',
    isPopular: true,
    popularRank: 5,
    bodyType: 'Hatchback',
    subBodyType: 'Compact city hatch',
    launchDate: '2021-11',
    seating: 5,
    fuelTypes: ['petrol', 'cng'],
    transmissions: ['manual', 'amt'],
    headerSeo:
      'Maruti Suzuki Celerio is positioned as India’s most fuel-efficient petrol hatchback, featuring the new Heartect platform and DualJet engine tech.',
    pros: createParagraph([
      '• Claimed 26+ kmpl efficiency makes it incredibly frugal.',
      '• Light steering and compact turning radius.',
      '• Practical cabin with multiple storage trays.',
    ]),
    cons: createParagraph([
      '• Rear seat support is average for long journeys.',
      '• Some hard plastics inside.',
      '• Limited safety kit on lower trims.',
    ]),
    description:
      'Rounded design theme, 313-litre boot, and a new dashboard layout distinguish the latest Celerio. Idle start-stop cuts emissions in traffic snarls.',
    exteriorDesign:
      'Smooth surfacing with sculpted door panels, 15-inch black alloys, and droplet-shaped LED tail lamps.',
    comfortConvenience:
      'Push-button start, request sensors, SmartPlay infotainment, and tilt-adjust steering cover commuter needs.',
    summary:
      'If outright efficiency is the priority, the Celerio is hard to beat.',
    engineSummaries: [
      {
        title: '1.0L DualJet Petrol MT/AMT',
        summary: 'Twin injectors per cylinder optimise combustion for better economy.',
        transmission: '5-speed manual/AMT',
        power: '66 bhp',
        torque: '89 Nm',
        speed: '5-speed',
      },
      {
        title: '1.0L DualJet CNG',
        summary: 'Factory S-CNG kit with auto fuel changeover button.',
        transmission: '5-speed manual',
        power: '56 bhp',
        torque: '82 Nm',
        speed: '5-speed',
      },
    ],
    mileageData: [
      { engineName: '1.0L Petrol MT', ...fuelEconomy('25.24 kmpl', '18 kmpl', '22 kmpl') },
      { engineName: '1.0L Petrol AMT', ...fuelEconomy('26.68 kmpl', '18 kmpl', '23 kmpl') },
      { engineName: '1.0L CNG MT', ...fuelEconomy('35.6 km/kg', '31 km/kg', '33 km/kg') },
    ],
    faqs: defaultFaqs('Maruti Celerio', '₹5.2–7.2 lakh', '18–27 kmpl / 30+ km/kg on CNG'),
  },
  {
    name: 'Swift',
    status: 'active',
    isPopular: true,
    popularRank: 6,
    isNew: true,
    newRank: 2,
    bodyType: 'Hatchback',
    subBodyType: 'Sporty hatch',
    launchDate: '2024-05',
    seating: 5,
    fuelTypes: ['petrol', 'cng'],
    transmissions: ['manual', 'automatic'],
    headerSeo:
      'The fourth-generation Swift embraces a fresh design language, new Z-Series engine, and richer cabin tech while retaining the playful dynamics enthusiasts love.',
    pros: createParagraph([
      '• New 1.2L Z-Series three-cylinder is smoother and more efficient.',
      '• Sporty steering and taut suspension make it fun to drive.',
      '• 9-inch touchscreen with wireless smartphone integration.',
    ]),
    cons: createParagraph([
      '• Still misses an outright performance variant in India.',
      '• Rear seat best for two adults.',
      '• Some rivals now offer more ADAS aids.',
    ]),
    description:
      'The cabin adopts a multi-layer dashboard, new switchgear, rear AC vents, and improved NVH insulation. Expanded safety list includes 6 airbags, ESP, and hill-hold as standard.',
    exteriorDesign:
      'Signature floating roof, sculpted bonnet, full LED headlamps, and C-shaped tail-lamps emphasise its sporty intent.',
    comfortConvenience:
      'Keyless entry, cruise control, connected car suite, and a 4.2-inch colour MID elevate daily convenience.',
    summary:
      'A balanced mix of driving fun, features, and efficiency keeps the Swift atop the premium hatch shopping list.',
    engineSummaries: [
      {
        title: '1.2L Z-Series Petrol MT',
        summary: 'New three-cylinder petrol prioritises mid-range punch with higher compression.',
        transmission: '5-speed manual',
        power: '80 bhp',
        torque: '112 Nm',
        speed: '5-speed',
      },
      {
        title: '1.2L Z-Series Petrol AMT',
        summary: 'Same engine paired to a recalibrated AMT for quicker responses.',
        transmission: 'AMT',
        power: '80 bhp',
        torque: '112 Nm',
        speed: '5-speed AMT',
      },
      {
        title: '1.2L Z-Series CNG',
        summary: 'CNG-ready head and valves ensure longevity on alternate fuel.',
        transmission: '5-speed manual',
        power: '71 bhp',
        torque: '98 Nm',
        speed: '5-speed',
      },
    ],
    mileageData: [
      { engineName: '1.2L Petrol MT', ...fuelEconomy('24.8 kmpl', '18 kmpl', '22 kmpl') },
      { engineName: '1.2L Petrol AMT', ...fuelEconomy('25.75 kmpl', '18 kmpl', '23 kmpl') },
      { engineName: '1.2L CNG MT', ...fuelEconomy('32.5 km/kg', '30 km/kg', '32 km/kg') },
    ],
    faqs: defaultFaqs('Maruti Swift', '₹6.5–9.5 lakh', '18–26 kmpl / 30+ km/kg on CNG'),
  },
  {
    name: 'Dzire',
    status: 'active',
    isPopular: true,
    popularRank: 7,
    bodyType: 'Sedan',
    subBodyType: 'Compact sedan',
    launchDate: '2020-03',
    seating: 5,
    fuelTypes: ['petrol', 'cng'],
    transmissions: ['manual', 'automatic'],
    headerSeo:
      'The Dzire brings Swift DNA to the compact sedan space with a larger boot, plush rear bench, and the proven K-Series powertrain lineup.',
    pros: createParagraph([
      '• Light kerb weight and peppy engine deliver effortless performance.',
      '• One of the most efficient petrol sedans on sale.',
      '• Rear AC vents, armrest, and wide-opening doors make it cab-friendly.',
    ]),
    cons: createParagraph([
      '• NVH insulation could be better at highway speeds.',
      '• Still uses a 4-speed automatic.',
      '• Boot lip is high, making it harder to load heavy luggage.',
    ]),
    description:
      'The Dzire’s interior shares cues with the Swift but adds dual-tone beige-black theme, faux wood garnish, and additional storage spaces. Standard safety kit now includes ESP and hill-hold.',
    exteriorDesign:
      'Chrome bar grille, projector headlamps, LED tail lamps, and 15-inch precision-cut alloys lend a premium vibe despite compact sedan proportions.',
    comfortConvenience:
      'Cruise control, rear AC vents, SmartPlay infotainment, and rear armrest with cup holders enhance the chauffeur-driven experience.',
    summary:
      'A feature-loaded, efficient sedan tailor-made for city dwellers and fleet owners alike.',
    engineSummaries: [
      {
        title: '1.2L DualJet Petrol MT',
        summary: 'Low-friction internals and dual injectors focus on responsiveness and efficiency.',
        transmission: '5-speed manual',
        power: '89 bhp',
        torque: '113 Nm',
        speed: '5-speed',
      },
      {
        title: '1.2L DualJet Petrol AMT',
        summary: 'AMT with hill-hold keeps things effortless in traffic and on inclines.',
        transmission: 'AMT',
        power: '89 bhp',
        torque: '113 Nm',
        speed: '5-speed AMT',
      },
      {
        title: '1.2L DualJet CNG',
        summary: 'Dual-tank CNG layout preserves boot usability with reinforced suspension.',
        transmission: '5-speed manual',
        power: '76 bhp',
        torque: '98.5 Nm',
        speed: '5-speed',
      },
    ],
    mileageData: [
      { engineName: '1.2L Petrol MT', ...fuelEconomy('22.41 kmpl', '17 kmpl', '20 kmpl') },
      { engineName: '1.2L Petrol AMT', ...fuelEconomy('22.61 kmpl', '17 kmpl', '20 kmpl') },
      { engineName: '1.2L CNG MT', ...fuelEconomy('31.12 km/kg', '29 km/kg', '31 km/kg') },
    ],
    faqs: defaultFaqs('Maruti Dzire', '₹7.1–9.9 lakh', '17–23 kmpl / 29+ km/kg on CNG'),
  },
  {
    name: 'Eeco',
    status: 'active',
    isPopular: true,
    popularRank: 8,
    bodyType: 'Van',
    subBodyType: 'MPV/Multi-utility',
    launchDate: '2022-11',
    seating: 7,
    fuelTypes: ['petrol', 'cng'],
    transmissions: ['manual'],
    headerSeo:
      'The Eeco continues to dominate the budget MPV space with its rugged ladder-frame underpinnings, massive cargo space, and low running costs.',
    pros: createParagraph([
      '• Flexible seating for 5 or 7 occupants plus a 540-litre boot.',
      '• New 1.2L engine complies with modern emission norms.',
      '• Sliding doors offer unmatched practicality in tight spaces.',
    ]),
    cons: createParagraph([
      '• Basic safety kit; no airbags for rear passengers.',
      '• Cabin insulation and fit-finish are utilitarian.',
      '• Lacks automatic transmission or advanced infotainment.',
    ]),
    description:
      'Updated with a digital instrument cluster, new steering wheel, and a more efficient blower. The floorpan is flat, making it easy to ferry goods or convert the cabin layout.',
    exteriorDesign:
      'Functional styling with new clear-lens headlamps, bold grille insert, and body decals. Steel wheels and black bumpers keep costs in check.',
    comfortConvenience:
      'Manual AC, heater, reclining front seats, and a 12V accessory socket cover the basics expected in fleet duty.',
    summary:
      'The Eeco remains the go-to option for small businesses, school vans, and budget-conscious families needing space.',
    engineSummaries: [
      {
        title: '1.2L G12B Petrol',
        summary: 'Four-cylinder petrol tuned for torque with improved NVH and OBD2 compliance.',
        transmission: '5-speed manual',
        power: '80 bhp',
        torque: '104.4 Nm',
        speed: '5-speed',
      },
      {
        title: '1.2L G12B CNG',
        summary: 'Factory S-CNG kit with micro-switch safety and leak-proof pipeline.',
        transmission: '5-speed manual',
        power: '70 bhp',
        torque: '95 Nm',
        speed: '5-speed',
      },
    ],
    mileageData: [
      { engineName: '1.2L Petrol MT', ...fuelEconomy('19.71 kmpl', '13 kmpl', '16 kmpl') },
      { engineName: '1.2L CNG MT', ...fuelEconomy('26.78 km/kg', '24 km/kg', '26 km/kg') },
    ],
    faqs: defaultFaqs('Maruti Eeco', '₹5.5–7.3 lakh', '13–20 kmpl / 24+ km/kg on CNG', '5 or 7 seats'),
  },
  {
    name: 'Brezza',
    status: 'active',
    isPopular: true,
    popularRank: 9,
    bodyType: 'SUV',
    subBodyType: 'Compact SUV',
    launchDate: '2022-07',
    seating: 5,
    fuelTypes: ['petrol', 'cng'],
    transmissions: ['manual', 'automatic'],
    headerSeo:
      'The second-gen Brezza elevates the compact SUV recipe with a stronger shell, panoramic sunroof, connected car tech, and a mild-hybrid petrol engine.',
    pros: createParagraph([
      '• Robust ride quality that shrugs off broken patches.',
      '• Feature-rich cabin with 360 camera, HUD, and wireless charging.',
      '• Now available with factory CNG for ride-share operators.',
    ]),
    cons: createParagraph([
      '• No diesel option for high-mileage users.',
      '• Power delivery is adequate but not exciting.',
      '• Interior plastics feel durable but not premium.',
    ]),
    description:
      'Built on the Global-C platform with extensive reinforcement for crash safety. The cabin gets layered dashboard, floating 9-inch screen, ambient lighting, and rear AC vents.',
    exteriorDesign:
      'Squared-off proportions, LED projector headlamps, dual-tone roof options, and chunky skid plates push the SUV appeal.',
    comfortConvenience:
      'Ventilated seats, Arkamys-tuned sound, connected car suite with remote operations, six airbags on top trims, and paddle shifters (AT).',
    summary:
      'A well-rounded, efficient crossover tailored for Indian road conditions.',
    engineSummaries: [
      {
        title: '1.5L K15C Smart Hybrid MT/AT',
        summary: 'DualJet petrol with mild-hybrid assist for smoother low-end torque.',
        transmission: '5-speed MT / 6-speed AT',
        power: '102 bhp',
        torque: '137 Nm',
        speed: '5-speed / 6-speed',
      },
      {
        title: '1.5L K15C CNG',
        summary: 'Calibrated for CNG with dual interdependent ECUs and retuned suspension.',
        transmission: '5-speed manual',
        power: '87 bhp',
        torque: '121.5 Nm',
        speed: '5-speed',
      },
    ],
    mileageData: [
      { engineName: '1.5L Petrol MT', ...fuelEconomy('17.4 kmpl', '13 kmpl', '15 kmpl') },
      { engineName: '1.5L Petrol AT', ...fuelEconomy('19.8 kmpl', '12 kmpl', '14 kmpl') },
      { engineName: '1.5L CNG MT', ...fuelEconomy('25.51 km/kg', '23 km/kg', '25 km/kg') },
    ],
    faqs: defaultFaqs('Maruti Brezza', '₹8.5–14.0 lakh', '13–20 kmpl / 23+ km/kg on CNG'),
  },
  {
    name: 'Ertiga',
    status: 'active',
    isPopular: true,
    popularRank: 10,
    bodyType: 'MPV',
    subBodyType: '3-row family MPV',
    launchDate: '2022-04',
    seating: 7,
    fuelTypes: ['petrol', 'cng'],
    transmissions: ['manual', 'automatic'],
    headerSeo:
      'Ertiga spearheaded the affordable MPV category with its monocoque construction, dual airbags, and practical 3-row layout that suits joint families and fleet buyers alike.',
    pros: createParagraph([
      '• Flexible seating with reclining second row and fold-flat third row.',
      '• Smooth K15C engine with mild-hybrid support.',
      '• Factory CNG option available even on mid trims.',
    ]),
    cons: createParagraph([
      '• Third row best for kids on longer journeys.',
      '• No diesel option anymore.',
      '• Infotainment UI feels dated.',
    ]),
    description:
      'Dual-tone tan-black interior, roof-mounted AC vents for second and third row, and cooled cup-holders add to family appeal.',
    exteriorDesign:
      'Sweeping headlamps, chrome studded grille, and L-shaped LED tail lamps highlight a people-mover silhouette without appearing utilitarian.',
    comfortConvenience:
      'Ventilated cup holders, front armrest, 12V sockets for all rows, and cruise control improve highway comfort.',
    summary:
      'Efficient, reliable, and spacious—qualities that keep the Ertiga at the top of MPV sales charts.',
    engineSummaries: [
      {
        title: '1.5L K15C Smart Hybrid MT/AT',
        summary: 'Mild-hybrid petrol tuned for smooth torque delivery with ISG start-stop.',
        transmission: '5-speed MT / 6-speed AT',
        power: '102 bhp',
        torque: '137 Nm',
        speed: '5-speed / 6-speed',
      },
      {
        title: '1.5L K15C CNG',
        summary: 'S-CNG kit retains usable boot thanks to smart tank packaging.',
        transmission: '5-speed manual',
        power: '87 bhp',
        torque: '121.5 Nm',
        speed: '5-speed',
      },
    ],
    mileageData: [
      { engineName: '1.5L Petrol MT', ...fuelEconomy('20.51 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.5L Petrol AT', ...fuelEconomy('20.30 kmpl', '13 kmpl', '16 kmpl') },
      { engineName: '1.5L CNG MT', ...fuelEconomy('26.11 km/kg', '23 km/kg', '25 km/kg') },
    ],
    faqs: defaultFaqs('Maruti Ertiga', '₹8.6–13.1 lakh', '13–21 kmpl / 23+ km/kg on CNG', '7 seats'),
  },
  {
    name: 'Victoris',
    status: 'active',
    isPopular: true,
    popularRank: 11,
    bodyType: 'SUV',
    subBodyType: 'Three-row SUV (codename)',
    launchDate: '2025-01',
    seating: 7,
    fuelTypes: ['petrol', 'strong hybrid'],
    transmissions: ['manual', 'automatic', 'e-CVT'],
    headerSeo:
      'Project Victoris (codename) is Maruti Suzuki’s upcoming three-row SUV derived from the Grand Vitara architecture, focused on premium features and hybrid efficiency.',
    pros: createParagraph([
      '• Stretch-wheelbase derivative promises generous third-row space.',
      '• Strong-hybrid powertrain targets 20+ kmpl efficiency.',
      '• Expected to pack ADAS Level 2 features.',
    ]),
    cons: createParagraph([
      '• Yet to launch officially; final specs may change.',
      '• Petrol-only line-up might limit towing ability.',
      '• Pricing likely to overlap with established rivals.',
    ]),
    description:
      'Victoris is rumoured to get captain seats, panoramic sunroof, ventilated seats, and a 10.25-inch infotainment suite with 360-degree camera.',
    exteriorDesign:
      'Expect an imposing grille, sequential DRLs, multi-layer LED headlamps, and squared arches to differentiate it from the standard Grand Vitara.',
    comfortConvenience:
      'Wireless charging, connected car tech, multi-zone climate control, and premium upholstery are on the cards.',
    summary:
      'Victoris aims to be Maruti’s flagship SUV, combining hybrid efficiency with lounge-like comfort.',
    engineSummaries: [
      {
        title: '1.5L K15C Mild-Hybrid',
        summary: 'Works with ISG and lithium-ion battery to reduce fuel consumption in traffic.',
        transmission: '6-speed automatic / 5-speed manual',
        power: '102 bhp (est.)',
        torque: '137 Nm',
        speed: '5-speed / 6-speed',
      },
      {
        title: '1.5L TNGA Strong Hybrid',
        summary: 'Toyota-sourced Atkinson cycle petrol paired with e-Axle for EV-like smoothness.',
        transmission: 'e-CVT',
        power: '114 bhp (combined)',
        torque: '141 Nm',
        speed: 'e-CVT',
      },
    ],
    mileageData: [
      { engineName: '1.5L Mild-Hybrid', ...fuelEconomy('18.5 kmpl (expected)', '14 kmpl', '17 kmpl') },
      { engineName: '1.5L Strong Hybrid', ...fuelEconomy('23.0 kmpl (expected)', '18 kmpl', '22 kmpl') },
    ],
    faqs: defaultFaqs('Maruti Victoris', '₹16–22 lakh (expected)', '18–23 kmpl (claimed)', '6 or 7 seats'),
  },
  {
    name: 'Ignis',
    status: 'active',
    isPopular: true,
    popularRank: 12,
    bodyType: 'Hatchback',
    subBodyType: 'Urban crossover',
    launchDate: '2020-02',
    seating: 5,
    fuelTypes: ['petrol'],
    transmissions: ['manual', 'amt'],
    headerSeo:
      'Ignis is Nexa’s funky micro crossover that mixes retro cues with modern tech, targeting young urban buyers.',
    pros: createParagraph([
      '• Light and peppy 1.2L petrol with fun driving manners.',
      '• 180 mm ground clearance plus short overhangs.',
      '• Wide customisation palette via Nexa accessories.',
    ]),
    cons: createParagraph([
      '• Hard plastics across cabin.',
      '• Rear seat best for two adults.',
      '• Limited boot depth.',
    ]),
    description:
      'Floating touchscreen, toggle switches, and dual-tone seat fabrics create a youthful vibe. The body shell now meets Bharat NCAP norms.',
    exteriorDesign:
      'Squared wheel arches, clamshell bonnet, and U-shaped LED DRLs reference iconic Suzuki Kei cars.',
    comfortConvenience:
      'SmartPlay Studio, automatic climate control, push-button start, and steering-mounted controls cover lifestyle needs.',
    summary:
      'A quirky hatchback that drives well and stands out among cookie-cutter rivals.',
    engineSummaries: [
      {
        title: '1.2L K12N Petrol MT/AMT',
        summary: 'DualJet engine paired to lightweight body keeps performance lively.',
        transmission: '5-speed manual/AMT',
        power: '83 bhp',
        torque: '113 Nm',
        speed: '5-speed',
      },
    ],
    mileageData: [
      { engineName: '1.2L Petrol MT', ...fuelEconomy('20.89 kmpl', '15 kmpl', '18 kmpl') },
      { engineName: '1.2L Petrol AMT', ...fuelEconomy('20.89 kmpl', '15 kmpl', '18 kmpl') },
    ],
    faqs: defaultFaqs('Maruti Ignis', '₹5.8–8.0 lakh', '15–21 kmpl'),
  },
  {
    name: 'Baleno',
    status: 'active',
    isPopular: true,
    popularRank: 13,
    bodyType: 'Hatchback',
    subBodyType: 'Premium hatchback',
    launchDate: '2022-02',
    seating: 5,
    fuelTypes: ['petrol', 'cng'],
    transmissions: ['manual', 'automatic'],
    headerSeo:
      'Baleno blends premium aesthetics with class-leading cabin width, head-up display, and a frugal DualJet powertrain to remain the best-selling Nexa model.',
    pros: createParagraph([
      '• Wide cabin with supportive seats and generous boot.',
      '• 360 camera, HUD, six airbags, and connected tech.',
      '• Refined engine with impressive mileage figures.',
    ]),
    cons: createParagraph([
      '• No turbo-petrol option anymore.',
      '• Rear headroom could be better for tall passengers.',
      '• AMT gear changes are noticeable.',
    ]),
    description:
      'The dashboard flows into a layered centre console housing a 9-inch screen, toggle-style HVAC controls, and blue ambient lighting.',
    exteriorDesign:
      'Liquid-flow design with new projector headlamps, three-element DRLs, and 16-inch precision-cut alloys.',
    comfortConvenience:
      'Auto climate control, rear AC vents, UV-cut glass, and a premium Arkamys sound mode enhance the long-drive experience.',
    summary:
      'Balances style, tech, and efficiency for buyers stepping up from entry hatchbacks.',
    engineSummaries: [
      {
        title: '1.2L DualJet Petrol MT/AMT',
        summary: '12-hole injectors and integrated ISG for better torque fill.',
        transmission: '5-speed manual/AMT',
        power: '90 bhp',
        torque: '113 Nm',
        speed: '5-speed',
      },
      {
        title: '1.2L DualJet CNG',
        summary: 'S-CNG variant retains 318-litre boot thanks to compact twin-tank layout.',
        transmission: '5-speed manual',
        power: '77 bhp',
        torque: '98 Nm',
        speed: '5-speed',
      },
    ],
    mileageData: [
      { engineName: '1.2L Petrol MT', ...fuelEconomy('22.35 kmpl', '16 kmpl', '20 kmpl') },
      { engineName: '1.2L Petrol AMT', ...fuelEconomy('22.94 kmpl', '16 kmpl', '20 kmpl') },
      { engineName: '1.2L CNG MT', ...fuelEconomy('30.61 km/kg', '28 km/kg', '30 km/kg') },
    ],
    faqs: defaultFaqs('Maruti Baleno', '₹6.6–9.9 lakh', '16–23 kmpl / 28+ km/kg on CNG'),
  },
  {
    name: 'Fronx',
    status: 'active',
    isPopular: true,
    popularRank: 14,
    bodyType: 'SUV',
    subBodyType: 'Coupe crossover',
    launchDate: '2023-04',
    seating: 5,
    fuelTypes: ['petrol', 'cng'],
    transmissions: ['manual', 'automatic', 'amt'],
    headerSeo:
      'The Fronx is Maruti’s coupe-inspired crossover that reintroduces the BoosterJet turbo-petrol engine while retaining family-friendly practicality.',
    pros: createParagraph([
      '• Distinct coupe roofline differentiates it from boxier SUVs.',
      '• BoosterJet engine delivers strong mid-range punch.',
      '• Loaded with features such as HUD, 360 camera, and wireless charging.',
    ]),
    cons: createParagraph([
      '• Rear seat space is adequate but not class-leading.',
      '• Ride quality feels firm on sharp edges.',
      '• AllGrip AWD not offered.',
    ]),
    description:
      'Built on the Heartect platform, Fronx gets dual-tone interiors, high-set centre console, and generous storage cubbies.',
    exteriorDesign:
      'Split headlamp setup, NEXWave grille, and connected LED tail lamps emphasise width.',
    comfortConvenience:
      'Ventilated seats, cruise control, rear AC vents, and connected car suite (Suzuki Connect) add premiumness.',
    summary:
      'A stylish crossover that bridges the gap between Baleno and Brezza.',
    engineSummaries: [
      {
        title: '1.0L BoosterJet Turbo',
        summary: 'Direct-injection turbo petrol revived with 118 bhp and 147.6 Nm output.',
        transmission: '5-speed MT / 6-speed AT',
        power: '118 bhp',
        torque: '147.6 Nm',
        speed: '5-speed / 6-speed',
      },
      {
        title: '1.2L DualJet Petrol',
        summary: 'Naturally aspirated option for buyers prioritising mileage.',
        transmission: '5-speed MT / AMT',
        power: '90 bhp',
        torque: '113 Nm',
        speed: '5-speed',
      },
      {
        title: '1.2L DualJet CNG',
        summary: 'Factory-fitted S-CNG keeping curb weight in check.',
        transmission: '5-speed manual',
        power: '77 bhp',
        torque: '98.5 Nm',
        speed: '5-speed',
      },
    ],
    mileageData: [
      { engineName: '1.0L BoosterJet MT', ...fuelEconomy('21.5 kmpl', '14 kmpl', '18 kmpl') },
      { engineName: '1.0L BoosterJet AT', ...fuelEconomy('20.1 kmpl', '13 kmpl', '17 kmpl') },
      { engineName: '1.2L Petrol MT', ...fuelEconomy('21.79 kmpl', '16 kmpl', '19 kmpl') },
      { engineName: '1.2L Petrol AMT', ...fuelEconomy('22.89 kmpl', '16 kmpl', '19 kmpl') },
      { engineName: '1.2L CNG MT', ...fuelEconomy('28.51 km/kg', '26 km/kg', '28 km/kg') },
    ],
    faqs: defaultFaqs('Maruti Fronx', '₹7.5–13.0 lakh', '14–23 kmpl / 26+ km/kg on CNG'),
  },
  {
    name: 'Grand Vitara',
    status: 'active',
    isPopular: true,
    popularRank: 15,
    bodyType: 'SUV',
    subBodyType: 'Midsize SUV',
    launchDate: '2022-09',
    seating: 5,
    fuelTypes: ['petrol', 'strong hybrid'],
    transmissions: ['manual', 'automatic', 'e-CVT'],
    headerSeo:
      'Grand Vitara is Maruti’s global SUV featuring strong-hybrid tech, AWD capability, and a premium cabin to compete with segment heavyweights.',
    pros: createParagraph([
      '• Only SUV in the segment with an AWD option and strong-hybrid powertrain.',
      '• Solid ride quality and high-speed composure.',
      '• 9-inch infotainment with wireless smartphone pairing plus HUD.',
    ]),
    cons: createParagraph([
      '• Boot space compromised on strong-hybrid variant.',
      '• Mild-hybrid auto is conservative with performance.',
      '• Interior plastics are robust but not luxurious.',
    ]),
    description:
      'Layered dashboard with soft-touch inserts, panoramic sunroof, ventilated seats, and connected car features elevate the experience. Six airbags, ESP, and hill-descent (AWD) are standard on top trims.',
    exteriorDesign:
      'Wide stance with NexWave grille, DRL signature, and dual-tone paint schemes emphasise sophistication.',
    comfortConvenience:
      '360 camera, wireless charger, ambient lighting, and rear AC vents make it road-trip friendly.',
    summary:
      'Combines Toyota’s hybrid expertise with Maruti’s service network, making it a smart pick for efficiency-focused SUV buyers.',
    engineSummaries: [
      {
        title: '1.5L K15C Mild-Hybrid MT/AT',
        summary: 'DualJet petrol with ISG delivering smooth torque and optional AllGrip AWD.',
        transmission: '5-speed MT / 6-speed AT',
        power: '102 bhp',
        torque: '137 Nm',
        speed: '5-speed / 6-speed',
      },
      {
        title: '1.5L TNGA Strong Hybrid e-CVT',
        summary: 'Atkinson-cycle petrol plus electric motor for EV-like drivability and 27+ kmpl claims.',
        transmission: 'e-CVT',
        power: '114 bhp (combined)',
        torque: '141 Nm',
        speed: 'e-CVT',
      },
    ],
    mileageData: [
      { engineName: '1.5L Mild-Hybrid MT', ...fuelEconomy('21.11 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.5L Mild-Hybrid AT', ...fuelEconomy('20.58 kmpl', '13 kmpl', '16 kmpl') },
      { engineName: '1.5L Strong Hybrid', ...fuelEconomy('27.97 kmpl', '20 kmpl', '24 kmpl') },
    ],
    faqs: defaultFaqs('Maruti Grand Vitara', '₹10.7–19.8 lakh', '13–28 kmpl'),
  },
  {
    name: 'XL6',
    status: 'active',
    isPopular: true,
    popularRank: 16,
    bodyType: 'MPV',
    subBodyType: 'Premium 6-seater',
    launchDate: '2022-04',
    seating: 6,
    fuelTypes: ['petrol', 'cng'],
    transmissions: ['manual', 'automatic'],
    headerSeo:
      'The XL6 is the premium cousin of the Ertiga sold via Nexa, featuring captain seats, all-black interiors, and a more SUV-inspired front fascia.',
    pros: createParagraph([
      '• Comfortable captain seats with one-touch recline.',
      '• Plush ride quality and silent cabin.',
      '• Packed with features like ventilated seats and 360 camera.',
    ]),
    cons: createParagraph([
      '• Third row remains suitable mainly for kids.',
      '• Boot space limited with all rows up.',
      '• No diesel or AWD option.',
    ]),
    description:
      'Stone finish dashboard, quilted leatherette upholstery, and roof-mounted AC vents highlight the premium intent.',
    exteriorDesign:
      'Quad-LED headlamps, muscular cladding, dual-tone alloys, and a raised bonnet lend crossover appeal.',
    comfortConvenience:
      'Ventilated front seats, SmartPlay Pro+, paddle shifters (AT), and rear sunshades make long drives relaxing.',
    summary:
      'A value-packed 6-seater for families wanting style and practicality without SUV running costs.',
    engineSummaries: [
      {
        title: '1.5L K15C Smart Hybrid MT/AT',
        summary: 'Mild-hybrid petrol tuned for smoothness with ISG assist.',
        transmission: '5-speed MT / 6-speed AT',
        power: '102 bhp',
        torque: '137 Nm',
        speed: '5-speed / 6-speed',
      },
      {
        title: '1.5L K15C CNG',
        summary: 'S-CNG system added recently for fleet buyers.',
        transmission: '5-speed manual',
        power: '87 bhp',
        torque: '121.5 Nm',
        speed: '5-speed',
      },
    ],
    mileageData: [
      { engineName: '1.5L Petrol MT', ...fuelEconomy('20.97 kmpl', '14 kmpl', '17 kmpl') },
      { engineName: '1.5L Petrol AT', ...fuelEconomy('20.27 kmpl', '13 kmpl', '16 kmpl') },
      { engineName: '1.5L CNG MT', ...fuelEconomy('26.32 km/kg', '23 km/kg', '25 km/kg') },
    ],
    faqs: defaultFaqs('Maruti XL6', '₹11.6–14.7 lakh', '13–21 kmpl / 23+ km/kg on CNG', '6 captain seats'),
  },
  {
    name: 'Jimny',
    status: 'active',
    isPopular: true,
    popularRank: 17,
    bodyType: 'SUV',
    subBodyType: 'Lifestyle 4x4',
    launchDate: '2023-06',
    seating: 4,
    fuelTypes: ['petrol'],
    transmissions: ['manual', 'automatic'],
    headerSeo:
      'The five-door Jimny brings Suzuki’s ladder-frame, low-range capable 4x4 to Indian enthusiasts with everyday practicality.',
    pros: createParagraph([
      '• Proper off-road hardware with AllGrip Pro, low-range transfer case, and brake LSD.',
      '• Compact dimensions and light weight for tight trails.',
      '• Retro-modern styling turns heads everywhere.',
    ]),
    cons: createParagraph([
      '• 1.5L petrol lacks punch on highways.',
      '• Rear bench suited for two adults only.',
      '• Road noise is higher due to block-pattern tyres.',
    ]),
    description:
      'The upright dash gets grab handles, washable floor mats, and a 9-inch SmartPlay Pro+ unit. Safety kit includes 6 airbags, ESP, hill-hold, and hill-descent control.',
    exteriorDesign:
      'Boxy silhouette, circular LED headlamps, slatted grille, and exposed hinges pay homage to classic Gypsy styling.',
    comfortConvenience:
      'Auto climate control, cruise control, push-button start, and 4-speaker Arkamys-tuned audio keep it modern.',
    summary:
      'A lifestyle SUV that prioritises capability and character over outright practicality.',
    engineSummaries: [
      {
        title: '1.5L K15B Petrol MT/AT',
        summary: 'Naturally aspirated petrol tuned for linear torque and reliability in remote areas.',
        transmission: '5-speed manual / 4-speed automatic',
        power: '103 bhp',
        torque: '134 Nm',
        speed: '5-speed / 4-speed',
      },
    ],
    mileageData: [
      { engineName: '1.5L Petrol MT', ...fuelEconomy('16.94 kmpl', '11 kmpl', '14 kmpl') },
      { engineName: '1.5L Petrol AT', ...fuelEconomy('16.39 kmpl', '10 kmpl', '13 kmpl') },
    ],
    faqs: defaultFaqs('Maruti Jimny', '₹12.7–15.0 lakh', '11–17 kmpl', '4 seats'),
  },
  {
    name: 'Invicto',
    status: 'active',
    isPopular: true,
    popularRank: 18,
    bodyType: 'MPV',
    subBodyType: 'Premium hybrid MPV',
    launchDate: '2023-07',
    seating: 7,
    fuelTypes: ['strong hybrid'],
    transmissions: ['e-CVT'],
    headerSeo:
      'Invicto is Maruti’s take on the Toyota Innova Hycross, pairing a strong-hybrid powertrain with a plush three-row cabin targeted at chauffeur-driven families.',
    pros: createParagraph([
      '• Strong-hybrid drivetrain delivers 23+ kmpl despite MPV size.',
      '• Ottoman-style captain seats with extended recline.',
      '• ADAS Level 2 tech including adaptive cruise and lane keep assist.',
    ]),
    cons: createParagraph([
      '• Only offered with hybrid; no pure petrol or diesel choice.',
      '• Long waiting periods in key cities.',
      '• Price overlaps with entry-level luxury SUVs.',
    ]),
    description:
      'Dual 10-inch screens (infotainment + driver display), ambient lighting, panoramic roof, and powered ottoman seats underline the Invicto’s premium intent.',
    exteriorDesign:
      'Unique Nexa grille, signature DRL pattern, and chrome garnish differentiate it from the Innova Hycross donor.',
    comfortConvenience:
      'Powered tailgate, ventilated seats, JBL-tuned audio, ADAS safety net, and connected car tech make highway journeys effortless.',
    summary:
      'If you want the efficiency of a hybrid with lounge-like comfort, the Invicto is Maruti’s flagship answer.',
    engineSummaries: [
      {
        title: '2.0L TNGA Strong Hybrid',
        summary: 'Atkinson-cycle petrol paired with dual electric motors and e-CVT gearbox.',
        transmission: 'e-CVT',
        power: '183 bhp (combined)',
        torque: '206 Nm (engine) + 206 Nm (motor)',
        speed: 'e-CVT',
      },
    ],
    mileageData: [
      { engineName: '2.0L Hybrid e-CVT', ...fuelEconomy('23.24 kmpl', '17 kmpl', '21 kmpl') },
    ],
    faqs: defaultFaqs('Maruti Invicto', '₹24.8–28.4 lakh', '17–23 kmpl', '7 seats'),
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

const log = (...args: unknown[]) => console.log('[seed-maruti-models]', ...args);

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
  log(`🚀 Starting Maruti models seeding for ${models.length} entries`);
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
      // Small pause to avoid overwhelming backend rate limits
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

