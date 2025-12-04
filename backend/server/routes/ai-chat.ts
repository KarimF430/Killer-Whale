import { Request, Response } from 'express'
import Groq from 'groq-sdk'
import { Variant as CarVariant } from '../db/schemas'
import { getCarIntelligence, type CarIntelligence } from '../ai-engine/web-scraper'
import { handleQuestionWithRAG } from '../ai-engine/rag-system'
import {
    getHeadToHead,
    getObjectionResponse,
    getCompetitors,
    getRegionalAdvice,
    getRandomProTip,
    HEAD_TO_HEAD,
    OBJECTIONS,
    PRO_TIPS
} from '../ai-engine/expert-knowledge'

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
                content: `You are "Karan" - India's sharpest car consultant with 15+ years in the automotive industry. You're known for witty one-liners, honest opinions, and helping families find their perfect car.

## 🧠 YOUR THINKING STYLE (Chain-of-Thought)
For every question, briefly show your reasoning:
1. **What they asked:** Identify the core need
2. **Key factors:** Budget, family size, usage pattern, city
3. **My take:** Your honest expert opinion with reasoning
4. **Verdict:** Clear recommendation with confidence level

## 🎭 YOUR PERSONALITY
- **Witty & Relatable:** Use Indian analogies ("This car is like Sharma ji ka beta - reliable, sensible, parents approve")
- **Honest:** "I'll be real with you..." - don't sugarcoat
- **Confident:** Have opinions, take sides in comparisons
- **Culturally Aware:** Reference Diwali, traffic jams, joint families, in-laws

## 🚗 YOUR EXPERTISE (2025 Data)

**Quick Verdicts (Memorize These):**
| Segment | Best Value | Best Safety | Best Features | Best Resale |
|---------|------------|-------------|---------------|-------------|
| Compact SUV | Nexon | Nexon ⭐⭐⭐⭐⭐ | Seltos | Creta |
| Sedan | Ciaz | Verna | Verna | City |
| Hatchback | Swift | Altroz ⭐⭐⭐⭐⭐ | i20 | Swift |
| Premium SUV | XUV700 | XUV700 ⭐⭐⭐⭐⭐ | Safari | Fortuner |

**Brand Wisdom:**
- Maruti = "Chai of cars" - everywhere, reliable, everyone has one
- Tata = "Underdog hero" - safety king, proving doubters wrong
- Hyundai = "Sharma ji ka beta" - premium feel, parents approve
- Mahindra = "Desi muscle" - rugged, powerful, road presence
- Kia = "Cool new kid" - features, style, Instagram-worthy

**Decision Framework:**
1. **Resale Value:** Maruti > Hyundai > Honda > Tata > Kia
2. **Safety:** Tata (5★) > Mahindra > Hyundai > Maruti
3. **Mileage:** Maruti > Honda > Hyundai > Tata
4. **Service Network:** Maruti (3000+) > Hyundai > Tata > Honda
5. **Waiting Period:** XUV700 (6mo) > Creta (2mo) > Nexon (1mo)

**Regional Intelligence:**
- Mumbai/Pune: "Traffic se zyada standing time" → Automatic, CNG
- Delhi/NCR: "Pollution check kaun karega?" → Petrol, good AC
- Bangalore: "Potholes like moon craters" → Ground clearance 180mm+
- Tier-2/3: "Kahi bhi mil jaaye service" → Maruti, Tata

## 💬 RESPONSE STYLE

**For Comparisons (Show Thinking):**
"🤔 Let me break this down...

**The Question:** Creta vs Seltos for a Bangalore family

**My Analysis:**
- Both ₹10.87L starting, so price is a tie
- Creta: Better resale (Hyundai's golden child), 1.5L petrol sweet spot
- Seltos: More features (360° camera, Bose audio), sportier looks

**The Verdict (8/10 confidence):** 
If you're keeping 5+ years → Creta (resale is ₹1-2L more)
If you love tech and style → Seltos (those connected features slap!)

*Pro tip: Test drive both on Outer Ring Road in evening traffic. You'll know.* 🚗"

**For Recommendations:**
"Based on your needs, I'm thinking... [your reasoning]
Here's my pick and why: [clear choice with confidence %]"

**Witty One-Liners to Sprinkle:**
- Safety: "Your family's safety > Instagram photos"
- Resale: "Buy smart, sell smarter - Maruti taught us this"
- Waiting: "XUV700 waiting period = 2 monsoons"
- Service: "Maruti service center is closer than your nearest café"
- Budget: "Don't let the salesman pick your EMI"

## 🔍 SPECIAL PROTOCOLS

**FIND_CARS Trigger:** When user gives budget+seating+usage:
FIND_CARS: {"budget": 1500000, "seating": 5, "usage": "city"}

**Confidence Levels:**
- 9-10/10: "I'm very confident about this"
- 7-8/10: "Strong recommendation, but test drive to confirm"
- 5-6/10: "Either could work, depends on your priority"

**When Unsure:** "Honestly, I'd need to check latest prices. Let me focus on what I know for sure..."`
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
        let expertContext = ''
        const carNames = await extractCarNamesFromQuery(message)
        const lowerMessage = message.toLowerCase()

        // ============================================
        // EXPERT KNOWLEDGE INJECTION (Claude-like reasoning)
        // ============================================

        try {
            // 1. Detect comparisons and inject head-to-head knowledge
            if (carNames.length >= 2 && carNames[0] && carNames[1]) {
                const comparison = getHeadToHead(carNames[0], carNames[1])
                if (comparison) {
                    expertContext += `\n\n**🧠 EXPERT COMPARISON KNOWLEDGE:**\n`
                    expertContext += `Insight: ${comparison.insight}\n`
                    expertContext += `Winners: Overall=${comparison.winner.overall}, Resale=${comparison.winner.resale}, Features=${comparison.winner.features}\n`
                    expertContext += `${comparison.cars[0]} is for: ${comparison.forWhom.car1}\n`
                    expertContext += `${comparison.cars[1]} is for: ${comparison.forWhom.car2}\n`
                    expertContext += `Pro Tip: ${comparison.proTip}\n`
                    console.log(`🧠 Expert: Injected comparison knowledge for ${carNames[0]} vs ${carNames[1]}`)
                }
            }
        } catch (e) {
            console.error('Expert comparison injection error:', e)
        }

        // 2. Detect objections and inject expert responses
        try {
            const objectionTopics = ['service', 'resale', 'safety', 'waiting', 'diesel', 'petrol', 'automatic', 'sunroof', 'ev', 'charging']
            for (const topic of objectionTopics) {
                if (lowerMessage.includes(topic)) {
                    const brandTopics = ['tata service', 'tata resale', 'maruti safety', 'kia service', 'xuv700 waiting', 'diesel vs petrol']
                    for (const bt of brandTopics) {
                        const parts = bt.split(' ')
                        if (parts.length >= 2 && lowerMessage.includes(parts[0]) && lowerMessage.includes(parts[1])) {
                            const objectionKey = bt.replace(' ', '_')
                            if (OBJECTIONS && OBJECTIONS[objectionKey]) {
                                const obj = OBJECTIONS[objectionKey]
                                expertContext += `\n\n**🛡️ OBJECTION HANDLING:**\n`
                                expertContext += `User concern: "${obj.objection}"\n`
                                expertContext += `Expert response: ${obj.response}\n`
                                expertContext += `Data: ${obj.data}\n`
                                if (obj.alternative) expertContext += `Alternative: ${obj.alternative}\n`
                                console.log(`🛡️ Expert: Injected objection handling for "${objectionKey}"`)
                                break
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.error('Expert objection injection error:', e)
        }

        // 3. Detect city mentions and inject regional advice
        try {
            const cities = ['mumbai', 'delhi', 'bangalore', 'chennai', 'pune', 'hyderabad']
            for (const city of cities) {
                if (lowerMessage.includes(city)) {
                    const advice = getRegionalAdvice(city)
                    if (advice) {
                        expertContext += `\n\n**📍 REGIONAL INTELLIGENCE (${city.toUpperCase()}):**\n`
                        expertContext += `Traffic: ${advice.traffic || 'N/A'}\n`
                        expertContext += `Fuel recommendation: ${advice.fuel || 'N/A'}\n`
                        expertContext += `Best choice: ${advice.recommendation || 'N/A'}\n`
                        expertContext += `Avoid: ${advice.avoid || 'N/A'}\n`
                        expertContext += `Local tip: ${advice.tip || 'N/A'}\n`
                        console.log(`📍 Expert: Injected regional advice for ${city}`)
                        break
                    }
                }
            }
        } catch (e) {
            console.error('Expert regional injection error:', e)
        }

        // 4. Add relevant pro tips
        try {
            if (lowerMessage.includes('negotiat') || lowerMessage.includes('discount') || lowerMessage.includes('deal')) {
                const tip = getRandomProTip('negotiation')
                if (tip) expertContext += `\n\n**💡 PRO TIP (Negotiation):** ${tip}\n`
            }
            if (lowerMessage.includes('test drive') || lowerMessage.includes('showroom')) {
                const tip = getRandomProTip('test_drive')
                if (tip) expertContext += `\n\n**💡 PRO TIP (Test Drive):** ${tip}\n`
            }
            if (lowerMessage.includes('insurance')) {
                const tip = getRandomProTip('insurance')
                if (tip) expertContext += `\n\n**💡 PRO TIP (Insurance):** ${tip}\n`
            }
            if (lowerMessage.includes('waiting') || lowerMessage.includes('delivery')) {
                const tip = getRandomProTip('waiting_hacks')
                if (tip) expertContext += `\n\n**💡 PRO TIP (Waiting):** ${tip}\n`
            }
        } catch (e) {
            console.error('Expert pro tips injection error:', e)
        }

        // 5. Fetch competitor data for context
        try {
            if (carNames.length === 1 && carNames[0]) {
                const competitors = getCompetitors(carNames[0])
                if (competitors && competitors.length > 0) {
                    expertContext += `\n\n**🔄 KEY COMPETITORS:** ${competitors.slice(0, 3).join(', ')}\n`
                    console.log(`🔄 Expert: Added competitors for ${carNames[0]}: ${competitors.slice(0, 3).join(', ')}`)
                }
            }
        } catch (e) {
            console.error('Expert competitor injection error:', e)
        }

        // ============================================
        // DATABASE RAG (Real-time data)
        // ============================================

        if (carNames.length > 0) {
            console.log(`🔍 RAG: Detected cars: ${carNames.join(', ')}`)

            try {
                // Build simpler query - search each car name in name field
                const regexQueries = carNames.map(name => ({
                    name: { $regex: name, $options: 'i' }
                }))

                const carData = await CarVariant.find({
                    $or: regexQueries,
                    status: 'active'
                }).limit(10).lean()

                if (carData.length > 0) {
                    console.log(`📊 RAG: Found ${carData.length} cars in database`)

                    ragContext = '\n\n**Real-Time Database Data:**\n'
                    carData.forEach((car: any) => {
                        const price = car.price ? (car.price / 100000).toFixed(2) : 'N/A'
                        ragContext += `\n${car.brandId || 'Unknown'} ${car.name}:\n`
                        ragContext += `- Price: ₹${price}L\n`
                        if (car.fuelType) ragContext += `- Fuel: ${car.fuelType}\n`
                        if (car.transmission) ragContext += `- Transmission: ${car.transmission}\n`
                        if (car.seatingCapacity) ragContext += `- Seating: ${car.seatingCapacity}\n`
                        if (car.mileage) ragContext += `- Mileage: ${car.mileage} km/l\n`
                        if (car.globalNCAPRating) ragContext += `- Safety: ${car.globalNCAPRating} stars\n`
                    })
                }
            } catch (e) {
                console.error('RAG fetch error:', e)
            }
        }

        // Add current message with RAG context + Expert knowledge
        messages.push({
            role: 'user',
            content: message + ragContext + expertContext
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
            max_tokens: 500,  // Increased to handle larger contexts with expert knowledge
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
