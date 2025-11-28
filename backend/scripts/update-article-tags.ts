import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/motoroctane';

async function updateArticleTags() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const NewsArticle = mongoose.model('NewsArticle', new mongoose.Schema({}, { strict: false }));
        const NewsTag = mongoose.model('NewsTag', new mongoose.Schema({}, { strict: false }));
        const Model = mongoose.model('Model', new mongoose.Schema({}, { strict: false }));
        const Brand = mongoose.model('Brand', new mongoose.Schema({}, { strict: false }));

        // Get all brand tags
        const brandTags = await NewsTag.find({ type: 'brand' }).lean();
        console.log(`\n📋 Found ${brandTags.length} brand tags`);

        // Create a map of brand name to tag ID (UUID)
        const brandTagMap = new Map();
        brandTags.forEach((tag: any) => {
            brandTagMap.set(tag.name.toLowerCase(), tag.id); // Use UUID (id) not ObjectId (_id)
        });

        // Get all articles
        const articles = await NewsArticle.find().lean();
        console.log(`\n📰 Found ${articles.length} articles to update`);

        let updated = 0;

        for (const article of articles) {
            // Get the linked car models
            if (article.linkedCars && article.linkedCars.length > 0) {
                const modelId = article.linkedCars[0];
                const model = await Model.findOne({ id: modelId }).lean();

                if (model) {
                    const brand = await Brand.findOne({ id: model.brandId }).lean();

                    if (brand) {
                        const brandTagId = brandTagMap.get(brand.name.toLowerCase());

                        if (brandTagId) {
                            // Update article to include brand tag (keep existing tags and add brand tag)
                            const existingTags = article.tags || [];
                            const newTags = [...new Set([...existingTags, brandTagId])]; // Remove duplicates

                            await NewsArticle.updateOne(
                                { _id: article._id },
                                { $set: { tags: newTags } }
                            );

                            updated++;
                            console.log(`✅ Updated: ${article.title} - Added ${brand.name} tag`);
                        }
                    }
                }
            }
        }

        console.log(`\n✅ Updated ${updated} articles with brand tags`);

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updateArticleTags();
