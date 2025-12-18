import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Model } from '../db/schemas';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const backendEnv = path.resolve(__dirname, '../../.env');
dotenv.config({ path: backendEnv });

async function updateCreta() {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";

    if (!process.env.MONGODB_URI) {
        console.warn('MONGODB_URI not found in env, using default localhost');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    try {
        // Find the Creta model
        // We search by name case-insensitive
        const models = await Model.find({ name: { $regex: /creta/i } });

        if (models.length === 0) {
            console.error('Hyundai Creta model not found in database.');
            return;
        }

        // Identify the correct one if multiples (unlikely but possible)
        const creta = models.find(m => m.name.toLowerCase().includes('creta') && !m.name.toLowerCase().includes('n line'));

        if (!creta) {
            console.error('Specific Hyundai Creta model not found (maybe only N Line exists?).');
            console.log('Found models:', models.map(m => m.name));
            return;
        }

        console.log(`Found Creta model: ${creta.name} (${creta.id})`);

        // Update Data
        creta.headerSeo = 'Hyundai Creta 2024 - Price, Specs, Mileage, Interior & Features';
        creta.summary = 'The new Hyundai Creta is the ultimate SUV that commands attention with its parametric design and premium interiors. It features advanced technology like Level 2 ADAS, a voice-enabled panoramic sunroof, and a 10.25-inch infotainment system. Available in Petrol, Diesel, and Turbo Petrol engines with multiple transmission options, it offers a powerful and comfortable driving experience.';
        creta.description = "The Hyundai Creta has established itself as the benchmark for mid-size SUVs in India. The latest facelift enhances its appeal with a bolder 'Sensuous Sportiness' design language, a futuristic cabin, and segment-leading features. With a focus on safety, it now comes with 6 airbags as standard and complete ADAS suite (Level 2). Whether it's the refined 1.5L MPi petrol, the frugal 1.5L U2 CRDi diesel, or the enthusiastic 1.5L Turbo GDi, the Creta offers a powertrain for every buyer.";

        creta.pros = `* **Advanced Safety**: Standard 6 Airbags, ESC, VSM, and Level 2 ADAS with 19 safety features.
* **Premium Features**: Voice-enabled Panoramic Sunroof, Ventilated Front Seats, and 8-way Power Driver Seat.
* **Tech-Loaded**: Dual 10.25-inch screens (Infotainment & Cluster), Bose Premium Sound System (8 Speakers), and Bluelink connectivity.
* **Powertrain Choice**: Offers three distinct engine options (Petrol, Diesel, Turbo Petrol) and four transmission choices.`;

        creta.cons = `* **Price Premium**: Higher variants with ADAS and Turbo Multi-Clutch are priced significantly higher than base models.
* **Rear Seat Width**: While comfortable for two, squeezing three adults in the rear can be tight compared to some wider rivals.
* **No Safety Rating (Facelift)**: The latest facelift has not yet been crash-tested by Global NCAP (Pre-facelift was 3-star).`;

        creta.exteriorDesign = "The Creta's exterior is defined by its 'Sensuous Sportiness' philosophy. It features a commanding front look with a black chrome parametric radiator grille and upright hood design. The Quad Beam LED headlamps and new LED horizon positioning lamps create a distinct signature. The profile is highlighted by R17 diamond-cut alloy wheels, while the rear features connecting LED tail lamps and a sporty aerodynamic spoiler, giving it a robust and muscular stance.";

        creta.comfortConvenience = "Step inside to a dual-tone grey and black interior with premium leatherette upholstery. The driver cockpit is modernized with a seamless integrated curvilinear display. Comfort is maximized with an 8-way power-adjustable driver seat, front ventilated seats for hot climates, and a cooled glovebox. Rear passengers enjoy dedicated AC vents with charging ports, center armrest with cupholders, and 2-step reclining seats for long-distance comfort. The cabin is airy thanks to the large panoramic sunroof.";

        // Update Engine Summaries
        creta.engineSummaries = [
            {
                title: '1.5L MPi Petrol',
                summary: 'Refined and linear naturally aspirated engine, perfect for city commutes and relaxed highway cruising.',
                transmission: '6-MT / IVT (CVT)',
                power: '115 PS @ 6300 rpm',
                torque: '143.8 Nm @ 4500 rpm',
                speed: '~170 kmph'
            },
            {
                title: '1.5L U2 CRDi Diesel',
                summary: 'A torquey and highly fuel-efficient diesel workhorse, ideal for high-mileage users and highway runs.',
                transmission: '6-MT / 6-AT',
                power: '116 PS @ 4000 rpm',
                torque: '250 Nm @ 1500-2750 rpm',
                speed: '~175 kmph'
            },
            {
                title: '1.5L Turbo GDi Petrol',
                summary: 'High-performance engine delivering punchy acceleration and sporty dynamics for the enthusiast.',
                transmission: '7-Speed DCT',
                power: '160 PS @ 5500 rpm',
                torque: '253 Nm @ 1500-3500 rpm',
                speed: '~190 kmph'
            }
        ];

        // Update Mileage Data
        creta.mileageData = [
            {
                engineName: '1.5L Petrol MT',
                companyClaimed: '17.4 kmpl',
                cityRealWorld: '13-14 kmpl',
                highwayRealWorld: '16-17 kmpl'
            },
            {
                engineName: '1.5L Petrol IVT',
                companyClaimed: '17.7 kmpl',
                cityRealWorld: '12-13 kmpl',
                highwayRealWorld: '16-17 kmpl'
            },
            {
                engineName: '1.5L Diesel MT',
                companyClaimed: '21.8 kmpl',
                cityRealWorld: '17-18 kmpl',
                highwayRealWorld: '21-23 kmpl'
            },
            {
                engineName: '1.5L Diesel AT',
                companyClaimed: '19.1 kmpl',
                cityRealWorld: '15-16 kmpl',
                highwayRealWorld: '19-20 kmpl'
            },
            {
                engineName: '1.5L Turbo DCT',
                companyClaimed: '18.4 kmpl',
                cityRealWorld: '11-13 kmpl',
                highwayRealWorld: '17-18 kmpl'
            }
        ];

        // Update FAQs
        creta.faqs = [
            {
                question: 'What is the mileage of the Hyundai Creta?',
                answer: 'The Hyundai Creta offers excellent mileage ranging from 17.4 kmpl for the petrol manual to 21.8 kmpl for the diesel manual variant.'
            },
            {
                question: 'Does the Hyundai Creta come with a sunroof?',
                answer: 'Yes, the higher variants of the Hyundai Creta (SX and above) feature a smart voice-enabled panoramic sunroof.'
            },
            {
                question: 'Is the Hyundai Creta safe?',
                answer: 'The new Creta is equipped with over 70 advanced safety features, including 6 airbags as standard, Electronic Stability Control (ESC), and Level 2 ADAS with 19 features like Forward Collision Warning and Lane Keep Assist.'
            },
            {
                question: 'What are the engine options available in Creta?',
                answer: 'The Creta is available with three engine options: a 1.5L MPi Petrol, a 1.5L U2 CRDi Diesel, and a powerful 1.5L Turbo GDi Petrol.'
            }
        ];

        // Mark specific flags
        creta.isPopular = true;
        creta.isNew = true; // Still relatively new

        await creta.save();
        console.log('Successfully updated Hyundai Creta model data.');

    } catch (error) {
        console.error('Error updating Creta:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

updateCreta();
