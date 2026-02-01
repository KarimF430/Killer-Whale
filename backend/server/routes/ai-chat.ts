import { Request, Response } from 'express'
import Groq from 'groq-sdk'
import { Variant as CarVariant, Model } from '../db/schemas'
import { escapeRegExp } from '../utils/security'
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
// Vector search and self-learning imports
import { hybridCarSearch, initializeVectorStore, getVectorStoreStats } from '../ai-engine/vector-store'
import {
    recordInteraction,
    recordFeedback,
    recordCarClick,
    getLearnedContext,
    classifyQuery,
    getLearningMetrics
} from '../ai-engine/self-learning'

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

    const startTime = Date.now()

    try {
        const { message, sessionId = 'web-' + Date.now(), conversationHistory = [] } = req.body

        console.log('🔍 User:', message)

        // Initialize vector store on first request (cached after that)
        await initializeVectorStore().catch(err => {
            console.warn('⚠️ Vector store init failed, using fallback:', err.message)
        })

        // Build conversation for Groq
        const messages: any[] = [
            {
                role: 'system',
                content: `You are "Karan" - India's sharpest car consultant with 15+ years in the automotive industry.

## ⚠️ CRITICAL RULES
1. **NEVER ASSUME** - Don't assume city, family, budget, or use case unless the user mentions it
2. **USE ONLY PROVIDED DATA** - Base your response on the car data provided below, not generic knowledge
3. **DIRECT ANSWERS** - If asked "Creta or Nexon?", compare THOSE cars directly, don't add context
4. **CITE DATA** - Reference actual prices, features, pros/cons from the database data provided

## 🎭 YOUR PERSONALITY
- **Witty & Relatable:** Light Indian humor, but keep it brief
- **Honest:** "I'll be real with you..." - don't sugarcoat
- **Data-Driven:** Always reference the actual specs/prices provided
- **Confident:** Take clear sides in comparisons

## 📊 COMPARISON FORMAT (When comparing cars)

**[Car A] vs [Car B] - Quick Verdict**

| Factor | [Car A] | [Car B] | Winner |
|--------|---------|---------|--------|
| Price | ₹X-YL | ₹X-YL | Tie/A/B |
| Safety | X stars | Y stars | A/B |
| Mileage | X kmpl | Y kmpl | A/B |

**Key Differences:**
1. [Most important difference from database]
2. [Second difference]
3. [Third difference]

**My Pick:** [Clear winner] because [specific reason from data]

## 🚫 DON'T DO THIS
❌ "Creta or Nexon for a city-dwelling family" (user didn't say family or city)
❌ "Assuming you need 5 seats..." (don't assume)
❌ Inventing features not in the provided data

## ✅ DO THIS
✓ "Here's how Creta and Nexon compare based on specs:"
✓ Use actual prices from database (minPrice, maxPrice)
✓ Reference pros/cons from the data provided
✓ If info missing, say "I don't have that data" rather than guessing

## 🎯 KNOWN VERDICTS (Use these for quick answers)
- **Safety King:** Nexon (5★ Global NCAP) > Creta (4★)
- **Resale Value:** Creta > Nexon (Hyundai holds value better)
- **Features:** Creta (panoramic sunroof, ventilated seats) > Nexon
- **Build Quality:** Nexon (Tata's solid build) > Creta
- **Mileage:** Similar (17-18 kmpl real-world)
- **After-Sales:** Hyundai slightly better network than Tata`
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
                    expertContext += `\n\n **🧠 EXPERT COMPARISON KNOWLEDGE:**\n`
                    expertContext += `Insight: ${comparison.insight} \n`
                    expertContext += `Winners: Overall = ${comparison.winner.overall}, Resale = ${comparison.winner.resale}, Features = ${comparison.winner.features} \n`
                    expertContext += `${comparison.cars[0]} is for: ${comparison.forWhom.car1} \n`
                    expertContext += `${comparison.cars[1]} is for: ${comparison.forWhom.car2} \n`
                    expertContext += `Pro Tip: ${comparison.proTip} \n`
                    console.log(`🧠 Expert: Injected comparison knowledge for ${carNames[0]} vs ${carNames[1]} `)
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
                                expertContext += `\n\n **🛡️ OBJECTION HANDLING:**\n`
                                expertContext += `User concern: "${obj.objection}"\n`
                                expertContext += `Expert response: ${obj.response} \n`
                                expertContext += `Data: ${obj.data} \n`
                                if (obj.alternative) expertContext += `Alternative: ${obj.alternative} \n`
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
                        expertContext += `\n\n **📍 REGIONAL INTELLIGENCE(${city.toUpperCase()}):**\n`
                        expertContext += `Traffic: ${advice.traffic || 'N/A'} \n`
                        expertContext += `Fuel recommendation: ${advice.fuel || 'N/A'} \n`
                        expertContext += `Best choice: ${advice.recommendation || 'N/A'} \n`
                        expertContext += `Avoid: ${advice.avoid || 'N/A'} \n`
                        expertContext += `Local tip: ${advice.tip || 'N/A'} \n`
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
                if (tip) expertContext += `\n\n **💡 PRO TIP(Negotiation):** ${tip} \n`
            }
            if (lowerMessage.includes('test drive') || lowerMessage.includes('showroom')) {
                const tip = getRandomProTip('test_drive')
                if (tip) expertContext += `\n\n **💡 PRO TIP(Test Drive):** ${tip} \n`
            }
            if (lowerMessage.includes('insurance')) {
                const tip = getRandomProTip('insurance')
                if (tip) expertContext += `\n\n **💡 PRO TIP(Insurance):** ${tip} \n`
            }
            if (lowerMessage.includes('waiting') || lowerMessage.includes('delivery')) {
                const tip = getRandomProTip('waiting_hacks')
                if (tip) expertContext += `\n\n **💡 PRO TIP(Waiting):** ${tip} \n`
            }
        } catch (e) {
            console.error('Expert pro tips injection error:', e)
        }

        // 5. Fetch competitor data for context
        try {
            if (carNames.length === 1 && carNames[0]) {
                const competitors = getCompetitors(carNames[0])
                if (competitors && competitors.length > 0) {
                    expertContext += `\n\n **🔄 KEY COMPETITORS:** ${competitors.slice(0, 3).join(', ')} \n`
                    console.log(`🔄 Expert: Added competitors for ${carNames[0]}: ${competitors.slice(0, 3).join(', ')} `)
                }
            }
        } catch (e) {
            console.error('Expert competitor injection error:', e)
        }

        // ============================================
        // ENHANCED RAG: Vector + Keyword Hybrid Search
        // ============================================

        // 1. Semantic search using embeddings (finds intent, not just keywords)
        let vectorSearchResults: any[] = []
        try {
            vectorSearchResults = await hybridCarSearch(message, {}, 5)
            if (vectorSearchResults.length > 0) {
                console.log(`🧠 Vector search: Found ${vectorSearchResults.length} semantic matches`)

                ragContext = '\n\n**🔍 Cars Found (AI-Matched to Your Query):**\n'
                for (const car of vectorSearchResults) {
                    const minPrice = car.minPrice ? (car.minPrice / 100000).toFixed(2) : 'N/A'
                    const maxPrice = car.maxPrice ? (car.maxPrice / 100000).toFixed(2) : 'N/A'
                    ragContext += `\n ** ${car.brandName || ''} ${car.name}** (Score: ${car.searchScore?.toFixed(2) || 'N/A'}): \n`
                    ragContext += `- Price: ₹${minPrice} L - ₹${maxPrice} L\n`
                    if (car.bodyType) ragContext += `- Type: ${car.bodyType} \n`
                    if (car.pros) ragContext += `- Pros: ${car.pros} \n`
                    if (car.cons) ragContext += `- Cons: ${car.cons} \n`
                    if (car.summary) ragContext += `- Summary: ${car.summary.slice(0, 150)}...\n`
                }
            }
        } catch (e) {
            console.error('Vector search error:', e)
        }

        // 2. Fallback: Traditional keyword search if vector search failed
        if (vectorSearchResults.length === 0 && carNames.length > 0) {
            console.log(`🔍 RAG Fallback: Using keyword search for: ${carNames.join(', ')} `)

            try {
                const regexQueries = carNames.map(name => ({
                    name: { $regex: name, $options: 'i' }
                }))

                const carData = await CarVariant.find({
                    $or: regexQueries,
                    status: 'active'
                }).limit(10).lean()

                if (carData.length > 0) {
                    console.log(`📊 Keyword RAG: Found ${carData.length} cars`)

                    ragContext = '\n\n**Real-Time Database Data:**\n'
                    carData.forEach((car: any) => {
                        const price = car.price ? (car.price / 100000).toFixed(2) : 'N/A'
                        ragContext += `\n${car.brandId || 'Unknown'} ${car.name}: \n`
                        ragContext += `- Price: ₹${price} L\n`
                        if (car.fuelType) ragContext += `- Fuel: ${car.fuelType} \n`
                        if (car.transmission) ragContext += `- Transmission: ${car.transmission} \n`
                        if (car.seatingCapacity) ragContext += `- Seating: ${car.seatingCapacity} \n`
                        if (car.mileage) ragContext += `- Mileage: ${car.mileage} km / l\n`
                        if (car.globalNCAPRating) ragContext += `- Safety: ${car.globalNCAPRating} stars\n`
                    })
                }
            } catch (e) {
                console.error('RAG fetch error:', e)
            }
        }

        // 3. Get learned context from past successful responses
        let learnedContext = ''
        try {
            learnedContext = await getLearnedContext(message)
            if (learnedContext) {
                console.log(`📚 Using learned context from past successes`)
            }
        } catch (e) {
            console.error('Learned context error:', e)
        }

        // Add current message with RAG context + Expert knowledge + Learned context
        const fullContext = ragContext + expertContext + learnedContext
        messages.push({
            role: 'user',
            content: message + fullContext
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
                        reply: `Great! I found ${cars.length} cars that match your needs: `,
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

        // Record interaction for self-learning
        const responseTimeMs = Date.now() - startTime
        const carsRecommended = vectorSearchResults.slice(0, 3).map((car: any) => ({
            modelId: car.id || car._id?.toString() || '',
            modelName: car.name || '',
            brandName: car.brandName || ''
        }))

        try {
            await recordInteraction(
                sessionId,
                message,
                aiResponse,
                carsRecommended,
                fullContext.slice(0, 500),
                responseTimeMs
            )
            console.log(`📝 Interaction recorded(${responseTimeMs}ms)`)
        } catch (e) {
            console.error('Failed to record interaction:', e)
        }

        res.json({
            reply: aiResponse,
            needsMoreInfo,
            cars: vectorSearchResults.slice(0, 3), // Return top matched cars
            sessionId, // Return for feedback tracking
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
            console.log(`💰 Budget filter: ≤ ₹${maxBudget * 1.2} `)
        }

        // Seating filter
        if (requirements.seating) {
            query.seatingCapacity = { $gte: requirements.seating }
            console.log(`👥 Seating filter: ≥ ${requirements.seating} `)
        }

        // Fuel type filter
        if (requirements.fuelType && requirements.fuelType !== 'any') {
            // SECURITY: Sanitize user input for RegExp
            query.fuelType = { $regex: new RegExp(escapeRegExp(requirements.fuelType), 'i') }
            console.log(`⛽ Fuel filter: ${requirements.fuelType} `)
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
                    console.log(`🏙️ City usage filter: ${variants.length} cars(automatic / good mileage)`)
                } else {
                    console.log(`🏙️ City usage filter too strict(0 results), keeping all ${beforeFilter} cars`)
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
                    console.log(`🛣️ Highway usage filter: ${variants.length} cars(diesel / high mileage)`)
                } else {
                    console.log(`🛣️ Highway usage filter too strict(0 results), keeping all ${beforeFilter} cars`)
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
        console.log(`🎯 Selected top 3 cars: `, top3.map(v => `${v.brandId} ${v.name} `))

        // Enrich with web intelligence
        const enrichedCars = await Promise.all(
            top3.map(async (car) => {
                let intelligence: CarIntelligence = { imageUrl: '', ownerRecommendation: 0, totalReviews: 0, topPros: [], commonIssues: [], model: '', averageSentiment: 0, topCons: [], lastUpdated: new Date() }

                try {
                    intelligence = await getCarIntelligence(`${car.brandId} ${car.name} `)
                    if (!intelligence.imageUrl) intelligence.imageUrl = '';
                } catch (e) {
                    console.error(`Web intelligence failed for ${car.brandId} ${car.name}: `, e)
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
                    reasons.push(`${mileage} km / l mileage`)
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
