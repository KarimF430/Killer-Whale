import { Router, Request, Response } from 'express'
import Groq from 'groq-sdk'
import { Brand, Model, Variant } from '../db/schemas'
import axios from 'axios'
import * as cheerio from 'cheerio'

const router = Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || process.env.HF_API_KEY })

// Cache for quirky bits (1 hour TTL)
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 3600000 // 1 hour

// Helper to fetch real-time news
async function fetchRealTimeNews(query: string) {
    try {
        // Search for specific car news in India
        const searchUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' car india news')}&hl=en-IN&gl=IN&ceid=IN:en`
        const { data } = await axios.get(searchUrl, { timeout: 3000 })
        const $ = cheerio.load(data, { xmlMode: true })

        const newsItems: string[] = []
        $('item').slice(0, 2).each((_, elem) => {
            const title = $(elem).find('title').text()
            const pubDate = $(elem).find('pubDate').text()
            // Remove source name from title (usually at the end after ' - ')
            const cleanTitle = title.split(' - ').slice(0, -1).join(' - ') || title
            newsItems.push(`- ${cleanTitle} (${new Date(pubDate).toLocaleDateString()})`)
        })

        return newsItems.join('\n')
    } catch (error) {
        console.error('⚠️ News fetch failed:', error instanceof Error ? error.message : error)
        return ''
    }
}

/**
 * GET /api/quirky-bit/:type/:id
 * Generate contextual quirky bits for Brand/Model/Variant pages
 */
router.get('/:type/:id', async (req: Request, res: Response) => {
    const { type, id } = req.params

    // Validate type
    if (!['brand', 'model', 'variant', 'price', 'comparison'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type. Must be brand, model, variant, price, or comparison' })
    }

    // Check cache
    const cacheKey = `${type}-${id}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`✅ Cache hit for ${cacheKey}`)
        return res.json(cached.data)
    }

    try {
        let context = ''
        let entityName = ''
        let dataSummary = ''

        // Fetch entity data based on type
        if (type === 'brand') {
            let brand;
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                brand = await Brand.findById(id)
            } else {
                const searchName = id.replace(/^brand-/, '').replace(/-/g, ' ')
                brand = await Brand.findOne({
                    name: { $regex: new RegExp(searchName, 'i') }
                })
            }

            if (!brand) {
                console.warn(`⚠️ Brand not found for ID: ${id}, using fallback`)
                context = `Brand: ${id.replace(/^brand-/, '').replace(/-/g, ' ')}`
                entityName = id.replace(/^brand-/, '').replace(/-/g, ' ')
            } else {
                context = `Brand: ${brand.name}`
                entityName = brand.name
                dataSummary = `
                Name: ${brand.name}
                Market Ranking: ${brand.ranking || 'N/A'}
                Summary: ${brand.summary || 'N/A'}
                `
            }
        } else if (type === 'model') {
            let model;
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                model = await Model.findById(id)
            }

            // Fallback search if not found by ID
            if (!model) {
                const searchName = id.replace(/-/g, ' ')
                model = await Model.findOne({ name: { $regex: new RegExp(searchName, 'i') } })
            }

            if (!model) {
                console.warn(`⚠️ Model not found for ID: ${id}, using fallback`)
                context = `${id.replace(/-/g, ' ')}`
                entityName = id.replace(/-/g, ' ')
            } else {
                // Fetch Brand for context
                const brand = await Brand.findOne({ id: model.brandId })
                const brandName = brand ? brand.name : 'Unknown Brand'

                context = `${brandName} ${model.name}`
                entityName = model.name

                // Construct rich data summary
                const mileage = model.mileageData?.[0]
                const engine = model.engineSummaries?.[0]

                dataSummary = `
                Car: ${brandName} ${model.name}
                Body Type: ${model.bodyType || 'N/A'}
                Launch Date: ${model.launchDate || 'N/A'}
                Pros: ${model.pros || 'N/A'}
                Cons: ${model.cons || 'N/A'}
                Mileage: ${mileage ? `Claimed: ${mileage.companyClaimed}, City: ${mileage.cityRealWorld}` : 'N/A'}
                Engine: ${engine ? `${engine.power} Power, ${engine.torque} Torque` : 'N/A'}
                Seating: ${model.seating}
                Fuel Types: ${model.fuelTypes?.join(', ') || 'N/A'}
                `
            }
        } else if (type === 'variant') {
            let variant;
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                variant = await Variant.findById(id)
            }

            if (!variant) {
                // Fallback search
                const searchName = id.replace(/-/g, ' ')
                variant = await Variant.findOne({ name: { $regex: new RegExp(searchName, 'i') } })
            }

            if (!variant) {
                console.warn(`⚠️ Variant not found for ID: ${id}, using fallback`)
                context = `${id.replace(/-/g, ' ')}`
                entityName = id.replace(/-/g, ' ')
            } else {
                // Fetch Model and Brand
                const model = await Model.findOne({ id: variant.modelId })
                const brand = await Brand.findOne({ id: variant.brandId })

                const brandName = brand ? brand.name : ''
                const modelName = model ? model.name : ''

                context = `${brandName} ${modelName} ${variant.name}`
                entityName = variant.name

                dataSummary = `
                Variant: ${brandName} ${modelName} ${variant.name}
                Price: ₹${variant.price ? (variant.price / 100000).toFixed(2) + ' Lakh' : 'N/A'}
                Key Features: ${variant.keyFeatures || 'N/A'}
                Value for Money: ${variant.isValueForMoney ? 'Yes' : 'No'}
                Engine: ${variant.engineName || 'N/A'} - ${variant.power || 'N/A'} Power
                Mileage: ${variant.mileageCompanyClaimed || variant.mileageCityRealWorld || 'N/A'}
                `
            }
        } else if (type === 'price') {
            // ID can be Variant ID or Model ID/Slug
            let variant;
            let model;

            // Try to find Variant first
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                variant = await Variant.findById(id)
            }

            if (!variant) {
                const searchName = id.replace(/-/g, ' ')
                variant = await Variant.findOne({ name: { $regex: new RegExp(searchName, 'i') } })
            }

            if (variant) {
                // It's a Variant
                const model = await Model.findOne({ id: variant.modelId })
                const brand = await Brand.findOne({ id: variant.brandId })

                context = `On-Road Price of ${brand?.name} ${model?.name} ${variant.name}`
                entityName = variant.name

                const exShowroom = variant.price || 0
                const rto = Math.round(exShowroom * 0.15)
                const insurance = Math.round(exShowroom * 0.04)
                const onRoad = exShowroom + rto + insurance

                dataSummary = `
                Variant: ${variant.name}
                Ex-Showroom Price: ₹${(exShowroom / 100000).toFixed(2)} Lakh
                Estimated RTO: ₹${(rto / 100000).toFixed(2)} Lakh
                Estimated Insurance: ₹${(insurance / 100000).toFixed(2)} Lakh
                Approx On-Road: ₹${(onRoad / 100000).toFixed(2)} Lakh
                `
            } else {
                // Try to find Model
                if (id.match(/^[0-9a-fA-F]{24}$/)) {
                    model = await Model.findById(id)
                }
                if (!model) {
                    const searchName = id.replace(/-/g, ' ')
                    model = await Model.findOne({ name: { $regex: new RegExp(searchName, 'i') } })
                }

                if (model) {
                    // It's a Model
                    const brand = await Brand.findOne({ id: model.brandId })
                    context = `Price range of ${brand?.name} ${model.name}`
                    entityName = model.name

                    // Fetch lowest and highest price variants
                    const variants = await Variant.find({ modelId: model.id }).sort({ price: 1 })
                    const minPrice = variants[0]?.price || 0
                    const maxPrice = variants[variants.length - 1]?.price || 0

                    dataSummary = `
                    Model: ${brand?.name} ${model.name}
                    Price Range: ₹${(minPrice / 100000).toFixed(2)} Lakh - ₹${(maxPrice / 100000).toFixed(2)} Lakh
                    Variants: ${variants.length} variants available
                    Top Model: ${variants[variants.length - 1]?.name || 'N/A'}
                    Base Model: ${variants[0]?.name || 'N/A'}
                    `
                } else {
                    console.warn(`⚠️ Entity not found for Price ID: ${id}, using fallback`)
                    context = `Price of ${id.replace(/-/g, ' ')}`
                    entityName = id.replace(/-/g, ' ')
                }
            }
        } else if (type === 'comparison') {
            if (id === 'general') {
                context = 'Car Comparison'
                entityName = 'Comparison Tool'
                dataSummary = 'Compare any two cars to find the best one for you. I can analyze specs, price, and value.'
            } else {
                // ID is "id1,id2" (Variant IDs or Model IDs)
                const [id1, id2] = id.split(',')

                // Try to fetch as models first
                let item1 = await Model.findById(id1) || await Model.findOne({ id: id1 })
                let item2 = await Model.findById(id2) || await Model.findOne({ id: id2 })
                let isModel = true

                // If not models, try variants
                if (!item1 || !item2) {
                    item1 = await Variant.findById(id1) || await Variant.findOne({ id: id1 })
                    item2 = await Variant.findById(id2) || await Variant.findOne({ id: id2 })
                    isModel = false
                }

                if (!item1 || !item2) {
                    context = `Comparison`
                    entityName = "Comparison"
                    dataSummary = "Comparing two cars."
                } else {
                    context = `Comparison between ${item1.name} vs ${item2.name}`
                    entityName = `${item1.name} vs ${item2.name}`

                    // Fetch brands
                    const brand1 = await Brand.findOne({ id: item1.brandId })
                    const brand2 = await Brand.findOne({ id: item2.brandId })

                    dataSummary = `
                    Car 1: ${brand1?.name} ${item1.name}
                    ${isModel ? `Mileage: ${(item1 as any).mileageData?.[0]?.companyClaimed || 'N/A'}` : `Price: ₹${(item1 as any).price}`}
                    
                    Car 2: ${brand2?.name} ${item2.name}
                    ${isModel ? `Mileage: ${(item2 as any).mileageData?.[0]?.companyClaimed || 'N/A'}` : `Price: ₹${(item2 as any).price}`}
                    `
                }
            }
        }
        console.log(`📰 Fetching news for: ${entityName}`)
        const news = await fetchRealTimeNews(entityName)
        if (news) {
            dataSummary += `\nLATEST NEWS (Real-time):\n${news}`
        }

        console.log(`🤖 Generating quirky bit for: ${context}`)

        // Generate quirky bit using Groq with STRICT data adherence
        const prompt = `
        Based ONLY on the provided car data below, write ONE quirky, interesting fact for Indian car buyers.
        
        DATA:
        ${dataSummary || context}

        INSTRUCTIONS:
        1. PRIORITIZE LATEST NEWS *only* if it explicitly mentions ${entityName}.
        2. If the news is about a different car (e.g. news about Creta when viewing i20), IGNORE IT and use the DB data.
        3. If no relevant news, use the DB data (Mileage, Price, Features).
        4. If data mentions "Real World Mileage", highlight it.
        5. Keep it under 150 characters.
        6. Tone: Helpful, expert, slightly witty.
        7. Format: Just the text, no quotes.

        Example Output:
        "Breaking: The new facelift was just spotted testing with ADAS Level 2!"
        "The i20 Asta(O) gives you 20 kmpl on highways, perfect for weekend getaways!"
        `

        const response = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert car analyst. You write short, punchy facts based strictly on provided data.'
                },
                { role: 'user', content: prompt }
            ],
            max_tokens: 100,
            temperature: 0.7
        })

        const text = response.choices[0]?.message?.content?.trim() ||
            `${entityName} is a great choice. Ask me for more details!`

        // Determine CTA text based on type
        const ctaText = type === 'brand' ? 'Tell me more' :
            type === 'model' ? `Ask about ${entityName}` :
                'Compare variants'

        // Create chat context for AI
        const chatContext = `Tell me more about ${context}. specifically: ${text}`

        const result = {
            text,
            ctaText,
            chatContext,
            type,
            entityName
        }

        // Cache the result
        cache.set(cacheKey, { data: result, timestamp: Date.now() })
        console.log(`✅ Generated and cached quirky bit for ${cacheKey}`)

        res.json(result)

    } catch (error: any) {
        console.error('❌ Quirky bit generation error:', error.message || error)
        res.status(500).json({
            error: 'Failed to generate quirky bit',
            text: 'Discover interesting facts about this car. Click to chat with AI!',
            ctaText: 'Chat with AI',
            chatContext: 'Tell me about this car'
        })
    }
})

export default router
