import 'dotenv/config';
import mongoose from 'mongoose';
import { User, Model, Variant, Brand } from '../db/schemas';
import { sendEmail } from '../services/email.service';
import { getPersonalizedRecommendations } from '../services/recommendation.service';

/**
 * Manual Email Test Script
 * Sends all email types to current users
 */

// Connect to MongoDB
async function connectDB() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gadizone';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');
}

interface UserDoc {
    id: string;
    email: string;
    firstName?: string;
    name?: string;
}

async function sendWeeklyDigest(user: UserDoc): Promise<boolean> {
    try {
        const recommendations = await getPersonalizedRecommendations(user.id);
        const formattedRecs = Array.from(recommendations || []).map((rec: any) => ({
            name: rec.name,
            brand: rec.brandName,
            price: `₹${(rec.price / 100000).toFixed(2)} Lakh`,
            image: rec.heroImage || '',
            url: `${process.env.FRONTEND_URL}/${rec.brandName?.toLowerCase().replace(/\s+/g, '-')}-cars/${rec.name?.toLowerCase().replace(/\s+/g, '-')}`,
            matchReason: rec.matchReasons?.[0] || 'Recommended for you'
        }));

        if (formattedRecs.length > 0) {
            await sendEmail(user.email, 'weeklyDigest', {
                userName: user.firstName || user.name || 'Car Enthusiast',
                recommendations: formattedRecs
            });
            return true;
        }
        return false;
    } catch (error: any) {
        console.log(`  ❌ Weekly Digest failed for ${user.email}: ${error.message}`);
        return false;
    }
}

async function sendNewLaunchAlert(user: UserDoc, model: any, variant: any, brandName: string): Promise<boolean> {
    try {
        const price = variant.price || 0;
        await sendEmail(user.email, 'newLaunchAlert', {
            userName: user.firstName || user.name || 'Car Enthusiast',
            name: model.name,
            brand: brandName,
            price: `₹${(price / 100000).toFixed(2)} Lakh`,
            image: model.heroImage || '',
            url: `${process.env.FRONTEND_URL}/${brandName.toLowerCase().replace(/\s+/g, '-')}-cars/${model.name.toLowerCase().replace(/\s+/g, '-')}`
        });
        return true;
    } catch (error: any) {
        console.log(`  ❌ New Launch Alert failed for ${user.email}: ${error.message}`);
        return false;
    }
}

async function sendPriceDropAlert(user: UserDoc, model: any, variant: any, brandName: string): Promise<boolean> {
    try {
        const currentPrice = variant.price || 0;
        const oldPriceVal = currentPrice * 1.1;
        const savingsVal = oldPriceVal - currentPrice;

        await sendEmail(user.email, 'priceDropAlert', {
            userName: user.firstName || user.name || 'Car Enthusiast',
            name: variant.name,
            brand: brandName,
            oldPrice: `₹${(oldPriceVal / 100000).toFixed(2)} Lakh`,
            newPrice: `₹${(currentPrice / 100000).toFixed(2)} Lakh`,
            savings: `₹${(savingsVal / 100000).toFixed(2)} Lakh`,
            url: `${process.env.FRONTEND_URL}/${brandName.toLowerCase().replace(/\s+/g, '-')}-cars/${model.name.toLowerCase().replace(/\s+/g, '-')}`
        });
        return true;
    } catch (error: any) {
        console.log(`  ❌ Price Drop Alert failed for ${user.email}: ${error.message}`);
        return false;
    }
}

async function getEmailSampleData() {
    const sampleModel = await Model.findOne();
    let brandName = 'Unknown';
    if (sampleModel?.brandId) {
        const brand = await Brand.findById(sampleModel.brandId);
        if (brand) brandName = brand.name;
    }
    const sampleVariant = sampleModel ? await Variant.findOne({ modelId: sampleModel.id }) : null;
    return { sampleModel, sampleVariant, brandName };
}

async function sendAllEmailsToUsers() {
    try {
        console.log('🚀 Starting manual email send to all users...\n');
        const users = await User.find({ email: { $exists: true, $ne: null } });
        console.log(`📧 Found ${users.length} users with email addresses\n`);

        if (users.length === 0) return;

        const { sampleModel, sampleVariant, brandName } = await getEmailSampleData();
        let sentCount = 0;

        for (const user of users) {
            const userDoc: UserDoc = {
                id: (user as any).id || (user as any)._id,
                email: (user as any).email,
                firstName: (user as any).firstName,
                name: (user as any).name
            };

            console.log(`\n📨 Sending emails to: ${userDoc.email}`);

            if (await sendWeeklyDigest(userDoc)) sentCount++;
            await new Promise(resolve => setTimeout(resolve, 500));

            if (sampleModel && sampleVariant) {
                if (await sendNewLaunchAlert(userDoc, sampleModel, sampleVariant, brandName)) sentCount++;
                await new Promise(resolve => setTimeout(resolve, 500));

                if (await sendPriceDropAlert(userDoc, sampleModel, sampleVariant, brandName)) sentCount++;
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        console.log(`\n\n📊 Total Emails Processed: ${sentCount}\n✅ Done!\n`);
    } catch (error) {
        console.error('❌ Fatal error:', error);
        throw error;
    }
}

connectDB()
    .then(() => sendAllEmailsToUsers())
    .then(() => {
        console.log('Script completed successfully');
        mongoose.disconnect();
        process.exit(0);
    })
    .catch((error) => {
        console.error('Script failed:', error);
        if (mongoose.connection.readyState !== 0) mongoose.disconnect();
        process.exit(1);
    });
