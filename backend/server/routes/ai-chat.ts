import { Request, Response } from 'express'
import Groq from 'groq-sdk'
import { Variant as CarVariant } from '../db/schemas'
import { getCarIntelligence, type CarIntelligence } from '../ai-engine/web-scraper'
import { handleQuestionWithRAG } from '../ai-engine/rag-system'

// Initialize Groq client only if API key is available (prevents test failures)
const groqApiKey = process.env.GROQ_API_KEY || process.env.HF_API_KEY || ''
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null


// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all active car names from database for RAG matching
 * This replaces the hardcoded list for better accuracy
 */
let cachedCarNames: string[] | null = null
let cacheTimestamp = 0
const CAR_NAMES_CACHE_TTL = 300000 // 5 minutes

async function getActiveCarNames(): Promise<string[]> {
    // Return cached names if still valid
    if (cachedCarNames && Date.now() - cacheTimestamp < CAR_NAMES_CACHE_TTL) {
        return cachedCarNames
    }

    try {
        // Fetch unique car names from variants
        const variants = await CarVariant.find({ status: 'active' })
            .select('name brandId')
            .lean()

        const names = new Set<string>()
        variants.forEach((v: any) => {
            // Add variant name words (e.g., "Creta SX" -> "creta", "sx")
            const nameWords = v.name.toLowerCase().split(/\s+/)
            nameWords.forEach((word: string) => {
                if (word.length > 2) names.add(word)
            })
            // Add brand if available
            if (v.brandId) {
                names.add(v.brandId.toLowerCase())
            }
        })

        cachedCarNames = Array.from(names)
        cacheTimestamp = Date.now()
        console.log(`📊 Cached ${cachedCarNames.length} car names from database`)
        return cachedCarNames
    } catch (error) {
        console.error('Failed to fetch car names:', error)
        // Fallback to common car names if DB fails
        return [
            'creta', 'seltos', 'nexon', 'punch', 'brezza', 'venue', 'sonet',
            'swift', 'baleno', 'i20', 'altroz', 'tiago', 'kwid',
            'city', 'verna', 'ciaz', 'amaze', 'dzire',
            'xuv700', 'hector', 'harrier', 'safari', 'compass', 'fortuner',
            'innova', 'ertiga', 'xl6', 'carens', 'alcazar',
            'scorpio', 'thar', 'jimny', 'grand vitara', 'hyryder'
        ]
    }
}

/**
 * Extract car names from user query for RAG (now dynamic!)
 */
async function extractCarNamesFromQuery(query: string): Promise<string[]> {
    const lowerQuery = query.toLowerCase()
    const carKeywords = await getActiveCarNames()

    const found: string[] = []
    carKeywords.forEach(car => {
        if (lowerQuery.includes(car)) {
            found.push(car)
        }
    })

    return found
}

// ============================================
// SIMPLIFIED AI-FIRST CHAT HANDLER
// ============================================

/**
 * Main AI Chat Handler - Completely AI-driven, minimal rules
 */
export default async function aiChatHandler(req: Request, res: Response) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const { message, sessionId, conversationHistory = [] } = req.body

        console.log('🔍 User:', message)

        // Build conversation for Groq
        const messages: any[] = [
            {
                role: 'system',
                content: `You are an expert Indian car consultant with 15+ years of experience in the Indian automotive market.

Your Expertise:
- Deep knowledge of **2025 Indian car models**, prices, and features.
- Understanding of Indian buyer preferences (mileage, resale value, service network).
- Regional considerations (Mumbai traffic, Delhi pollution, Bangalore highways).
- Budget-conscious recommendations for Indian families.

**CRITICAL RULE:**
- **ALWAYS provide the latest 2025 data** (prices, features, launches).
- **Do NOT mention older models or 2023/2024 data** unless the user **explicitly** asks for historical data or used cars.
- If 2025 data is not available, explicitly state that you are sharing the latest available data.
- Assume the user is looking for a **new car** unless specified otherwise.

Key Market Insights (Use latest 2025 prices):
**Compact SUVs (Most Popular):**
- Hyundai Creta | Best: Resale value, brand trust, premium feel
- Kia Seltos | Best: Features, sporty design, tech
- Tata Nexon | Best: Safety (5-star NCAP), value for money
- Maruti Brezza | Best: Mileage, service network, low maintenance

**Sedans:**
- Honda City | Best: Refinement, space, reliability
- Hyundai Verna | Best: Features, comfort, looks
- Maruti Ciaz | Best: Mileage, space, affordability

**Hatchbacks:**
- Maruti Swift | Best: Mileage, fun to drive, resale
- Tata Altroz | Best: Safety, build quality, premium
- Hyundai i20 | Best: Features, looks, comfort

**Decision Factors:**
1. **Resale Value:** Maruti > Hyundai > Honda > Tata > Kia
2. **Safety:** Tata (5-star) > Mahindra > Hyundai > Maruti
3. **Mileage:** Maruti > Honda > Hyundai > Tata > Mahindra
4. **Service Network:** Maruti (best) > Hyundai > Tata > Honda
5. **Features:** Kia > Hyundai > Tata > Maruti
6. **Waiting Period:** XUV700 (6+ months), Creta (2-3 months), Nexon (1 month)

**Regional Recommendations:**
- Mumbai/Pune: Automatic transmission (traffic), compact size
- Delhi/NCR: CNG/Petrol (pollution norms), good AC
- Bangalore/Chennai: Diesel (highway usage), good ground clearance
- Tier-2/3 Cities: Maruti (service network), affordable parts

**Budget Recommendations (Check latest on-road prices):**
- Entry Level: Alto K10, S-Presso, Kwid
- Mid-Range Hatchbacks: Swift, Baleno, i10 Nios, Tiago
- Compact SUVs: Brezza, Nexon, Venue, Sonet, 3XO
- Mid-Size SUVs: Creta, Seltos, Grand Vitara, Hyryder
- Premium SUVs: XUV700, Hector, Harrier, Safari
- Luxury/Full-Size: Fortuner, Gloster, Kodiaq

Your Response Style:
- Be concise (2-3 sentences for comparisons)
- Always mention prices in lakhs (₹10.5L format)
- Highlight key differentiators (resale, safety, mileage, features)
- Consider buyer's usage (city/highway), family size, budget
- Mention waiting periods if significant (>2 months)
- Be honest about pros and cons

For Recommendations:
- Ask about budget, seating, usage ONE at a time
- When you have all three, respond with:
  FIND_CARS: {"budget": 1000000, "seating": 5, "usage": "city"}

Example Comparison:
User: "creta vs seltos"
You: "Both are excellent compact SUVs at ₹10.87L. Creta wins on resale value and brand trust (Hyundai network), while Seltos offers more features and sportier design. Choose Creta for long-term value, Seltos for tech and style."`
            }
        ]

        // Add conversation history
        conversationHistory.forEach((msg: any) => {
            messages.push({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            })
        })

        // RAG: Extract car names and fetch real data from database
        let ragContext = ''
        const carNames = await extractCarNamesFromQuery(message)

        if (carNames.length > 0) {
            console.log(`🔍 RAG: Detected cars: ${carNames.join(', ')}`)

            try {
                const carData = await CarVariant.find({
                    $or: carNames.map(name => ({
                        $or: [
                            { name: { $regex: name, $options: 'i' } },
                            { brand: { $regex: name, $options: 'i' } }
                        ]
                    })),
                    status: 'active'
                }).limit(5).lean()

                if (carData.length > 0) {
                    console.log(`📊 RAG: Found ${carData.length} cars in database`)

                    ragContext = '\n\n**Real-Time Database Data:**\n'
                    carData.forEach((car: any) => {
                        ragContext += `\n${car.brandId || 'Unknown'} ${car.name}:\n`
                        ragContext += `- Price: ₹${(car.price / 100000).toFixed(2)}L\n`
                        if (car.fuelType) ragContext += `- Fuel: ${car.fuelType}\n`
                        if (car.transmission) ragContext += `- Transmission: ${car.transmission}\n`
                        if (car.seatingCapacity) ragContext += `- Seating: ${car.seatingCapacity}\n`
                        if ((car as any).mileage) ragContext += `- Mileage: ${(car as any).mileage} km/l\n`
                        if ((car as any).globalNCAPRating) ragContext += `- Safety: ${(car as any).globalNCAPRating} stars\n`
                    })
                }
            } catch (e) {
                console.error('RAG fetch error:', e)
            }
        }

        // Add current message with RAG context
        messages.push({
            role: 'user',
            content: message + ragContext
        })

        // Let AI decide what to do
        if (!groq) {
            return res.status(503).json({
                error: 'AI service unavailable',
                reply: "Sorry, the AI service is currently unavailable. Please try again later!"
            })
        }

        const completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages,
            max_tokens: 200,
            temperature: 0.7
        })

        let aiResponse = completion.choices[0]?.message?.content || 'How can I help you?'
        console.log('🤖 AI Raw Response:', aiResponse)

        // Check if AI wants to find cars
        if (aiResponse.includes('FIND_CARS:')) {
            const match = aiResponse.match(/FIND_CARS:\s*({.*?})/)
            if (match) {
                try {
                    const requirements = JSON.parse(match[1])
                    console.log('🚗 AI wants to find cars:', requirements)

                    const cars = await findMatchingCars(requirements)

                    return res.json({
                        reply: `Great! I found ${cars.length} cars that match your needs:`,
                        cars,
                        needsMoreInfo: false,
                        conversationState: {
                            stage: 'showing_results',
                            collectedInfo: requirements,
                            confidence: 1
                        }
                    })
                } catch (e) {
                    console.error('Failed to parse requirements:', e)
                }
            }
        }

        // Clean up response
        aiResponse = aiResponse
            .replace(/SEARCH:.*$/im, '')
            .replace(/FIND_CARS:.*$/im, '')
            .trim()

        // Determine if AI is asking for more info
        const needsMoreInfo = aiResponse.includes('?') ||
            aiResponse.toLowerCase().includes('budget') ||
            aiResponse.toLowerCase().includes('seating') ||
            aiResponse.toLowerCase().includes('how many')

        res.json({
            reply: aiResponse,
            needsMoreInfo,
            conversationState: {
                stage: needsMoreInfo ? 'gathering_requirements' : 'greeting',
                collectedInfo: {},
                confidence: 0
            }
        })

    } catch (error) {
        console.error('AI Chat Error:', error)
        res.status(500).json({
            error: 'Failed to process request',
            reply: "Sorry, I'm having trouble right now. Please try again!"
        })
    }
}

// ============================================
// CAR MATCHING (Existing Logic)
// ============================================

async function findMatchingCars(requirements: any): Promise<any[]> {
    console.log('🧠 AI Brain: Finding matching cars for requirements:', requirements)

    try {
        // Build MongoDB query
        const query: any = { status: 'active' }

        // Budget filter (allow 20% buffer for better options)
        if (requirements.budget) {
            const maxBudget = typeof requirements.budget === 'object' ? requirements.budget.max : requirements.budget
            query.price = { $lte: maxBudget * 1.2 }
            console.log(`💰 Budget filter: ≤ ₹${maxBudget * 1.2}`)
        }

        // Seating filter
        if (requirements.seating) {
            query.seatingCapacity = { $gte: requirements.seating }
            console.log(`👥 Seating filter: ≥ ${requirements.seating}`)
        }

        // Fuel type filter
        if (requirements.fuelType && requirements.fuelType !== 'any') {
            query.fuelType = { $regex: new RegExp(requirements.fuelType, 'i') }
            console.log(`⛽ Fuel filter: ${requirements.fuelType}`)
        }

        console.log('🔍 MongoDB Query:', JSON.stringify(query))

        // Find matching variants
        let variants = await CarVariant.find(query).limit(20).lean()
        console.log(`📊 Found ${variants.length} variants from database`)

        if (variants.length === 0) {
            console.log('⚠️ No cars found in database matching criteria')
            return []
        }

        // Smart filtering based on usage (with fallback if too strict)
        if (requirements.usage) {
            const beforeFilter = variants.length

            if (requirements.usage === 'city') {
                const filtered = variants.filter(v => {
                    const isAutomatic = v.transmission && v.transmission.toLowerCase().includes('automatic')
                    const mileage = parseFloat(v.mileageCompanyClaimed || v.mileageCityRealWorld || '0')
                    const goodMileage = mileage > 15
                    return isAutomatic || goodMileage
                })

                if (filtered.length > 0) {
                    variants = filtered
                    console.log(`🏙️ City usage filter: ${variants.length} cars (automatic/good mileage)`)
                } else {
                    console.log(`🏙️ City usage filter too strict (0 results), keeping all ${beforeFilter} cars`)
                }
            } else if (requirements.usage === 'highway') {
                const filtered = variants.filter(v => {
                    const isDiesel = v.fuelType && v.fuelType.toLowerCase().includes('diesel')
                    const mileage = parseFloat(v.mileageCompanyClaimed || v.mileageHighwayRealWorld || '0')
                    const goodMileage = mileage > 18
                    return isDiesel || goodMileage
                })

                if (filtered.length > 0) {
                    variants = filtered
                    console.log(`🛣️ Highway usage filter: ${variants.length} cars (diesel/high mileage)`)
                } else {
                    console.log(`🛣️ Highway usage filter too strict (0 results), keeping all ${beforeFilter} cars`)
                }
            }
        }

        // Sort by price (closest to budget)
        if (requirements.budget) {
            const targetBudget = typeof requirements.budget === 'object' ? requirements.budget.max : requirements.budget
            variants.sort((a, b) => {
                const diffA = Math.abs(a.price - targetBudget)
                const diffB = Math.abs(b.price - targetBudget)
                return diffA - diffB
            })
        }

        // Take top 3
        const top3 = variants.slice(0, 3)
        console.log(`🎯 Selected top 3 cars:`, top3.map(v => `${v.brandId} ${v.name}`))

        // Enrich with web intelligence
        const enrichedCars = await Promise.all(
            top3.map(async (car) => {
                let intelligence: CarIntelligence = { imageUrl: '', ownerRecommendation: 0, totalReviews: 0, topPros: [], commonIssues: [], model: '', averageSentiment: 0, topCons: [], lastUpdated: new Date() }

                try {
                    intelligence = await getCarIntelligence(`${car.brandId} ${car.name}`)
                    if (!intelligence.imageUrl) intelligence.imageUrl = '';
                } catch (e) {
                    console.error(`Web intelligence failed for ${car.brandId} ${car.name}:`, e)
                }

                // Build reasons
                const reasons: string[] = []


                if (requirements.budget) {
                    const budgetLakhs = (typeof requirements.budget === 'object' ? requirements.budget.max : requirements.budget) / 100000
                    const priceLakhs = car.price / 100000
                    reasons.push(`₹${priceLakhs.toFixed(1)}L fits your ₹${budgetLakhs}L budget`)
                }

                // Use mileageCompanyClaimed from variant schema
                const mileage = car.mileageCompanyClaimed || car.mileageCityRealWorld
                if (mileage) {
                    reasons.push(`${mileage} km/l mileage`)
                }

                if (requirements.usage === 'city' && car.transmission) {
                    reasons.push(`${car.transmission} for city driving`)
                }

                if (intelligence.ownerRecommendation > 0) {
                    reasons.push(`${intelligence.ownerRecommendation}% owner recommendation`)
                }

                return {
                    id: car._id.toString(),
                    brand: car.brandId,  // Use brandId from schema
                    name: car.name,
                    variant: car.name,  // Variant name is in name field
                    price: car.price,
                    mileage: mileage || null,
                    fuelType: car.fuelType || car.fuel || null,
                    transmission: car.transmission || null,
                    seatingCapacity: null,  // Not in variant schema
                    image: intelligence.imageUrl || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
                    matchScore: 85 + Math.floor(Math.random() * 15), // 85-100
                    reasons: reasons.slice(0, 3), // Top 3 reasons
                    webIntelligence: intelligence
                }
            })
        )

        return enrichedCars

    } catch (error) {
        console.error('❌ AI Car Selection Error:', error)
        return []
    }
}
