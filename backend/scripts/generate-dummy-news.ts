
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    Brand,
    Model,
    NewsArticle,
    NewsCategory,
    NewsTag,
    NewsAuthor
} from '../server/db/schemas';

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/motoroctane';

async function generateDummyNews() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Get or Create Default Author
        let author = await NewsAuthor.findOne({ email: 'ai-generator@motoroctane.com' });
        if (!author) {
            console.log('👤 Creating default AI Author...');
            author = await NewsAuthor.create({
                id: uuidv4(),
                name: 'AI Generator',
                email: 'ai-generator@motoroctane.com',
                password: 'hashed_dummy_password', // In real app this should be hashed
                role: 'editor',
                bio: 'Automated news generator',
                isActive: true
            });
        }
        console.log(`✅ Author ready: ${author.name}`);

        // 2. Get Default Category
        let category = await NewsCategory.findOne({ slug: 'news' });
        if (!category) {
            console.log('📂 Creating default News Category...');
            category = await NewsCategory.create({
                id: uuidv4(),
                name: 'News',
                slug: 'news',
                description: 'Latest automotive news',
                isFeatured: true
            });
        }
        console.log(`✅ Category ready: ${category.name}`);

        // 3. Fetch Brands and Models
        const brands = await Brand.find();
        const models = await Model.find({ status: 'active' });
        console.log(`📊 Found ${brands.length} brands and ${models.length} active models`);

        // 4. Ensure Tags Exist
        console.log('🏷️  Verifying/Creating Tags...');
        const brandTagsMap = new Map<string, string>(); // brandId -> tagId
        const modelTagsMap = new Map<string, string>(); // modelId -> tagId

        // Process Brand Tags
        for (const brand of brands) {
            const slug = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            let tag = await NewsTag.findOne({ slug, type: 'brand' });

            if (!tag) {
                tag = await NewsTag.create({
                    id: uuidv4(),
                    name: brand.name,
                    slug,
                    type: 'brand'
                });
                console.log(`   + Created brand tag: ${brand.name}`);
            }
            brandTagsMap.set(brand.id, tag.id);
        }

        // Process Model Tags
        for (const model of models) {
            const slug = model.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            let tag = await NewsTag.findOne({ slug, type: 'general' }); // Using 'general' for models

            if (!tag) {
                tag = await NewsTag.create({
                    id: uuidv4(),
                    name: model.name,
                    slug,
                    type: 'general'
                });
                // console.log(`   + Created model tag: ${model.name}`);
            }
            modelTagsMap.set(model.id, tag.id);
        }
        console.log('✅ Tags verified');

        // 5. Generate Articles
        console.log('📝 Generating articles...');
        const articlesToInsert = [];
        const articleTitles = [
            "New {Model} Facelift: What We Know So Far",
            "Why the {Model} is a Great Choice for Families",
            "{Model} vs Competitors: Detailed Comparison",
            "{Model} Price Hike Expected Next Month"
        ];

        const articleImages = [
            "/uploads/news/placeholder-1.jpg",
            "/uploads/news/placeholder-2.jpg",
            "/uploads/news/placeholder-3.jpg",
            "/uploads/news/placeholder-4.jpg"
        ];

        let count = 0;
        for (const model of models) {
            const brand = brands.find(b => b.id === model.brandId);
            const brandName = brand ? brand.name : 'Unknown Brand';
            const brandTagId = brand ? brandTagsMap.get(brand.id) : null;
            const modelTagId = modelTagsMap.get(model.id);

            const tags = [];
            if (brandTagId) tags.push(brandTagId);
            if (modelTagId) tags.push(modelTagId);

            // Use model hero image if available, else placeholder
            const modelImage = model.heroImage || articleImages[0];

            for (let i = 0; i < 4; i++) {
                const title = articleTitles[i].replace('{Model}', `${brandName} ${model.name}`);
                const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + uuidv4().substring(0, 8);

                articlesToInsert.push({
                    id: uuidv4(),
                    title: title,
                    slug: slug,
                    excerpt: `Read everything about the ${brandName} ${model.name}. ${articleTitles[i]} - full details inside.`,
                    contentBlocks: [
                        {
                            id: uuidv4(),
                            type: 'paragraph',
                            content: `The ${brandName} ${model.name} has been making waves in the market. Here is everything you need to know about it.`
                        },
                        {
                            id: uuidv4(),
                            type: 'heading2',
                            content: 'Key Highlights'
                        },
                        {
                            id: uuidv4(),
                            type: 'paragraph',
                            content: `The ${model.name} comes with impressive features and specifications. It competes strongly in its segment.`
                        }
                    ],
                    categoryId: category.id,
                    tags: tags,
                    authorId: author.id,
                    linkedCars: [model.id],
                    featuredImage: modelImage,
                    seoTitle: title,
                    seoDescription: `Latest news about ${brandName} ${model.name}: ${title}`,
                    seoKeywords: [brandName, model.name, 'news', 'automotive'],
                    status: 'published',
                    publishDate: new Date(),
                    views: Math.floor(Math.random() * 1000),
                    likes: Math.floor(Math.random() * 100),
                    comments: Math.floor(Math.random() * 10),
                    isFeatured: Math.random() > 0.8, // 20% chance
                    isBreaking: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                count++;
            }
        }

        // Batch insert
        if (articlesToInsert.length > 0) {
            await NewsArticle.insertMany(articlesToInsert);
            console.log(`✅ Successfully inserted ${count} articles for ${models.length} models.`);
        } else {
            console.log('⚠️  No articles generated.');
        }

        await mongoose.disconnect();
        console.log('👋 Disconnected');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

generateDummyNews();
