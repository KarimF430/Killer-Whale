
import mongoose from 'mongoose';
import { Model, Variant } from '../server/db/schemas';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PROD_URI = 'mongodb+srv://motoroctane_user21:U2kcCNN7h5Y56Je6@cluster0.hok00oq.mongodb.net/motoroctane?retryWrites=true&w=majority&appName=Cluster0';

async function fixCreta() {
    console.log('🔧 Fixing Creta Data...');

    await mongoose.connect(PROD_URI);

    // 1. Find the Creta Model
    const creta = await Model.findOne({ name: 'Creta' });

    if (!creta) {
        console.error('❌ Creta model not found!');
        process.exit(1);
    }

    const oldId = creta.id;
    const newId = 'model-brand-hyundai-creta';

    console.log(`Found Creta:`);
    console.log(`   Current ID: ${oldId}`);
    console.log(`   Target ID:  ${newId}`);

    if (oldId === newId) {
        console.log('✅ Creta ID is already correct.');
    } else {
        // 2. Update Model ID
        console.log('📝 Updating Model ID...');
        creta.id = newId;
        await creta.save();
        console.log('✅ Model ID updated.');

        // 3. Update Variants
        console.log(`📝 Updating Variants linked to ${oldId}...`);
        const result = await Variant.updateMany(
            { modelId: oldId },
            { $set: { modelId: newId } }
        );
        console.log(`✅ Updated ${result.modifiedCount} variants.`);
    }

    process.exit(0);
}

fixCreta().catch(console.error);
