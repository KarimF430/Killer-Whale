import 'dotenv/config';
import mongoose from 'mongoose';
import { User, Model, Variant, Brand } from '../db/schemas';
import { sendEmail, emailTemplates } from '../services/email.service';
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

async function sendAllEmailsToUsers() {
    try {
        console.log('🚀 Starting manual email send to all users...\n');

        // Get all users with valid emails
        const users = await User.find({
            email: { $exists: true, $ne: null }
        });

        console.log(`📧 Found ${users.length} users with email addresses\n`);

        if (users.length === 0) {
            console.log('⚠️  No users found in database');
            return;
        }

        // Get sample data for emails
        const sampleModel = await Model.findOne();
        let brandName = 'Unknown';

        if (sampleModel) {
            if (sampleModel.brandId) {
                const brand = await Brand.findById(sampleModel.brandId);
                if (brand) {
                    brandName = brand.name;
                }
            }
        }

        const sampleVariant = sampleModel ? await Variant.findOne({ modelId: sampleModel.id }) : null;

        let sentCount = 0;
        let errorCount = 0;

        for (const user of users) {
            const userEmail = (user as any).email;
            const userName = (user as any).firstName || (user as any).name || 'Car Enthusiast';
            console.log(`\n📨 Sending emails to: ${userEmail}`);

            // 1. Send Weekly Digest
            try {
                const userId = (user as any).id || (user as any)._id;
                const recommendations = await getPersonalizedRecommendations(userId);

                const formattedRecs = Array.from(recommendations || []).map((rec: any) => ({
                    name: rec.name,
                    brand: rec.brandName,
                    price: `₹${(rec.price / 100000).toFixed(2)} Lakh`,
                    image: rec.heroImage || '',
                    url: `${process.env.FRONTEND_URL}/${rec.brandName?.toLowerCase().replace(/\s+/g, '-')}-cars/${rec.name?.toLowerCase().replace(/\s+/g, '-')}`,
                    matchReason: rec.matchReasons?.[0] || 'Recommended for you'
                }));

                if (formattedRecs.length > 0) {
                    await sendEmail(
                        userEmail,
                        'weeklyDigest',
                        {
                            userName: userName,
                            recommendations: formattedRecs
                        }
                    );
                    console.log('  ✅ Weekly Digest sent');
                    sentCount++;
                }
            } catch (error: any) {
                console.log(`  ❌ Weekly Digest failed: ${error.message}`);
                errorCount++;
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            // 2. Send New Launch Alert
            if (sampleModel && sampleVariant) {
                try {
                    const price = sampleVariant.price || 0;
                    await sendEmail(
                        userEmail,
                        'newLaunchAlert',
                        {
                            userName: userName,
                            name: sampleModel.name,
                            brand: brandName,
                            price: `₹${(price / 100000).toFixed(2)} Lakh`,
                            image: sampleModel.heroImage || '',
                            url: `${process.env.FRONTEND_URL}/${brandName.toLowerCase().replace(/\s+/g, '-')}-cars/${sampleModel.name.toLowerCase().replace(/\s+/g, '-')}`
                        }
                    );
                    console.log('  ✅ New Launch Alert sent');
                    sentCount++;
                } catch (error: any) {
                    console.log(`  ❌ New Launch Alert failed: ${error.message}`);
                    errorCount++;
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // 3. Send Price Drop Alert
            if (sampleVariant && sampleModel) {
                try {
                    const currentPrice = sampleVariant.price || 0;
                    const oldPriceVal = currentPrice * 1.1;
                    const savingsVal = oldPriceVal - currentPrice;

                    await sendEmail(
                        userEmail,
                        'priceDropAlert',
                        {
                            userName: userName,
                            name: sampleVariant.name,
                            brand: brandName,
                            oldPrice: `₹${(oldPriceVal / 100000).toFixed(2)} Lakh`,
                            newPrice: `₹${(currentPrice / 100000).toFixed(2)} Lakh`,
                            savings: `₹${(savingsVal / 100000).toFixed(2)} Lakh`,
                            url: `${process.env.FRONTEND_URL}/${brandName.toLowerCase().replace(/\s+/g, '-')}-cars/${sampleModel.name.toLowerCase().replace(/\s+/g, '-')}`
                        }
                    );
                    console.log('  ✅ Price Drop Alert sent');
                    sentCount++;
                } catch (error: any) {
                    console.log(`  ❌ Price Drop Alert failed: ${error.message}`);
                    errorCount++;
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        console.log('\n\n📊 Email Send Summary:');
        console.log(`   Total Users: ${users.length}`);
        console.log(`   Emails Sent: ${sentCount}`);
        console.log(`   Errors: ${errorCount}`);
        console.log('\n✅ Manual email send complete!\n');

    } catch (error) {
        console.error('❌ Fatal error:', error);
        throw error;
    }
}

// Run the script
connectDB()
    .then(() => sendAllEmailsToUsers())
    .then(() => {
        console.log('Script completed successfully');
        mongoose.disconnect();
        process.exit(0);
    })
    .catch((error) => {
        console.error('Script failed:', error);
        mongoose.disconnect();
        process.exit(1);
    });
