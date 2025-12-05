/**
 * Vector Store - Semantic Search for Car Consultant
 * 
 * Uses Hugging Face FREE API for embeddings and in-memory HNSW index for fast similarity search.
 * No paid services or separate vector database required!
 * 
 * Features:
 * - Generate embeddings using sentence-transformers (free)
 * - In-memory vector index with cosine similarity
 * - Hybrid search: Vector + Keyword matching
 * - Auto-caching for performance
 */

// NOTE: Mongoose models are imported dynamically to prevent startup crashes
// when MongoDB isn't connected yet

// ============================================
// CONFIGURATION
// ============================================

const HF_API_URL = 'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2'
const EMBEDDING_DIMENSIONS = 384 // MiniLM-L6-v2 output dimensions

// In-memory vector store (for free tier - no MongoDB Atlas vector search)
interface VectorEntry {
    id: string
    name: string
    brandName: string
    embedding: number[]
    data: any // Full car data
}

let vectorStore: VectorEntry[] = []
let isInitialized = false
let lastInitTime = 0
const CACHE_TTL = 3600000 // 1 hour

// ============================================
// EMBEDDING GENERATION
// ============================================

/**
 * Generate embedding using Hugging Face Inference API (FREE)
 * Rate limit: 30,000 requests/month on free tier
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    const HF_API_KEY = process.env.HF_API_KEY

    if (!HF_API_KEY) {
        console.warn('⚠️ HF_API_KEY not set, using fallback keyword matching')
        return generateFallbackEmbedding(text)
    }

    try {
        const response = await fetch(HF_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: text.slice(0, 512), // Limit input size
                options: { wait_for_model: true }
            })
        })

        if (!response.ok) {
            const error = await response.text()
            console.error('HF API error:', error)
            return generateFallbackEmbedding(text)
        }

        const embedding = await response.json()

        // Handle nested array response
        if (Array.isArray(embedding) && Array.isArray(embedding[0])) {
            return embedding[0]
        }

        if (Array.isArray(embedding) && embedding.length === EMBEDDING_DIMENSIONS) {
            return embedding
        }

        console.warn('Unexpected embedding format:', typeof embedding)
        return generateFallbackEmbedding(text)

    } catch (error) {
        console.error('Embedding generation failed:', error)
        return generateFallbackEmbedding(text)
    }
}

/**
 * Fallback: Generate simple TF-IDF-like embedding from text
 * Used when HF API is unavailable
 */
function generateFallbackEmbedding(text: string): number[] {
    const words = text.toLowerCase().split(/\s+/)
    const embedding = new Array(EMBEDDING_DIMENSIONS).fill(0)

    // Simple hash-based embedding
    words.forEach((word, i) => {
        const hash = simpleHash(word)
        const index = Math.abs(hash) % EMBEDDING_DIMENSIONS
        embedding[index] += 1 / (i + 1) // Position-weighted
    })

    // Normalize
    const norm = Math.sqrt(embedding.reduce((s, v) => s + v * v, 0)) || 1
    return embedding.map(v => v / norm)
}

function simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    return hash
}

// ============================================
// VECTOR INDEX BUILDING
// ============================================

/**
 * Build rich text representation for a car model
 * This text will be embedded for semantic search
 */
function buildCarTextForEmbedding(model: any, brandName: string): string {
    const parts = [
        brandName,
        model.name,
        model.bodyType,
        model.summary,
        model.pros,
        model.cons,
        model.description,
        model.fuelTypes?.join(' '),
        model.engineSummaries?.map((e: any) => `${e.title} ${e.summary}`).join(' '),
        model.mileageData?.map((m: any) => `${m.engineName} ${m.companyClaimed}`).join(' '),
        model.faqs?.slice(0, 5).map((f: any) => `${f.question} ${f.answer}`).join(' ')
    ].filter(Boolean)

    return parts.join(' ').slice(0, 512)
}

/**
 * Initialize vector store with all active car models
 * Generates embeddings for each car and stores in memory
 */
export async function initializeVectorStore(): Promise<void> {
    // Check if already initialized and cache is valid
    if (isInitialized && Date.now() - lastInitTime < CACHE_TTL) {
        console.log('📊 Vector store already initialized, using cache')
        return
    }

    console.log('🔄 Initializing vector store...')
    const startTime = Date.now()

    try {
        // Dynamic import to prevent startup crash when MongoDB isn't connected
        const { Model, Brand } = await import('../db/schemas')

        // Fetch all active models with their brands
        const models = await Model.find({ status: 'active' })
            .select('id name brandId bodyType summary pros cons description fuelTypes engineSummaries mileageData faqs minPrice maxPrice')
            .lean()

        // Fetch all brands for name lookup
        const brands = await Brand.find({}).select('id name').lean()
        const brandMap = new Map(brands.map(b => [b.id, b.name]))

        console.log(`📊 Processing ${models.length} car models...`)

        // Process in batches to avoid rate limiting
        const batchSize = 5
        const newVectorStore: VectorEntry[] = []

        for (let i = 0; i < models.length; i += batchSize) {
            const batch = models.slice(i, i + batchSize)

            const embeddings = await Promise.all(
                batch.map(async (model) => {
                    const brandName = brandMap.get(model.brandId) || ''
                    const text = buildCarTextForEmbedding(model, brandName)
                    const embedding = await generateEmbedding(text)

                    return {
                        id: model.id || model._id?.toString(),
                        name: model.name,
                        brandName,
                        embedding,
                        data: { ...model, brandName }
                    }
                })
            )

            newVectorStore.push(...embeddings)

            // Rate limiting: 100ms between batches
            if (i + batchSize < models.length) {
                await new Promise(r => setTimeout(r, 100))
            }
        }

        vectorStore = newVectorStore
        isInitialized = true
        lastInitTime = Date.now()

        const duration = Date.now() - startTime
        console.log(`✅ Vector store initialized: ${vectorStore.length} cars in ${duration}ms`)

    } catch (error) {
        console.error('❌ Failed to initialize vector store:', error)
        throw error
    }
}

// ============================================
// SIMILARITY SEARCH
// ============================================

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i]
        normA += a[i] * a[i]
        normB += b[i] * b[i]
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB)
    return denominator === 0 ? 0 : dotProduct / denominator
}

/**
 * Semantic search using vector similarity
 * Finds cars matching user intent, not just keywords
 */
export async function semanticCarSearch(
    query: string,
    filters?: {
        budget?: number
        bodyType?: string
        fuelType?: string
        minScore?: number
    },
    limit = 5
): Promise<any[]> {
    // Ensure vector store is initialized
    if (!isInitialized) {
        await initializeVectorStore()
    }

    // Detect if user explicitly wants EV
    const lowerQuery = query.toLowerCase()
    const isEVQuery = lowerQuery.includes('ev') ||
        lowerQuery.includes('electric') ||
        lowerQuery.includes('battery') ||
        lowerQuery.includes('charging')

    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query)

    // Calculate similarity for all cars
    const scored = vectorStore.map(entry => {
        let score = cosineSimilarity(queryEmbedding, entry.embedding)

        // Deprioritize EV versions if user didn't ask for EV
        const isEVModel = entry.name.toLowerCase().includes('ev') ||
            entry.data.fuelTypes?.some((f: string) => f.toLowerCase() === 'electric')

        if (!isEVQuery && isEVModel) {
            // Reduce score for EV models when user didn't ask for EV
            score = score * 0.7
        } else if (isEVQuery && isEVModel) {
            // Boost EV models when user explicitly wants EV
            score = score * 1.1
        } else if (!isEVQuery && !isEVModel) {
            // Slight boost for non-EV models in regular queries
            score = score * 1.05
        }

        return {
            ...entry,
            score,
            isEV: isEVModel
        }
    })

    // Filter by minimum score
    const minScore = filters?.minScore || 0.3
    let filtered = scored.filter(entry => entry.score >= minScore)

    // Apply optional filters
    if (filters?.budget) {
        filtered = filtered.filter(entry =>
            entry.data.minPrice && entry.data.minPrice <= filters.budget!
        )
    }

    if (filters?.bodyType) {
        const bodyTypeLower = filters.bodyType.toLowerCase()
        filtered = filtered.filter(entry =>
            entry.data.bodyType?.toLowerCase().includes(bodyTypeLower)
        )
    }

    if (filters?.fuelType) {
        const fuelTypeLower = filters.fuelType.toLowerCase()
        filtered = filtered.filter(entry =>
            entry.data.fuelTypes?.some((f: string) => f.toLowerCase().includes(fuelTypeLower))
        )
    }

    // Sort by similarity score (descending)
    filtered.sort((a, b) => b.score - a.score)

    // Return top results with enriched data
    const results = filtered.slice(0, limit).map(entry => ({
        ...entry.data,
        searchScore: entry.score,
        matchType: 'semantic',
        isEV: entry.isEV
    }))

    console.log(`🔍 Semantic search: "${query.slice(0, 50)}..." → ${results.length} results (EV query: ${isEVQuery}, top score: ${results[0]?.searchScore?.toFixed(3) || 'N/A'})`)

    return results
}

// ============================================
// HYBRID SEARCH (Vector + Keyword)
// ============================================

/**
 * Hybrid search combining vector + keyword matching
 * Best of both worlds: semantic understanding + exact matches
 */
export async function hybridCarSearch(
    query: string,
    filters?: any,
    limit = 5
): Promise<any[]> {
    const lowerQuery = query.toLowerCase()

    // Detect if user explicitly wants EV
    const isEVQuery = lowerQuery.includes('ev') ||
        lowerQuery.includes('electric') ||
        lowerQuery.includes('battery') ||
        lowerQuery.includes('charging')

    // 1. Vector/Semantic search (already handles EV filtering)
    const vectorResults = await semanticCarSearch(query, filters, limit)

    // 2. Keyword search for exact matches (fallback)
    // Dynamic import to prevent startup crash when MongoDB isn't connected
    const { Model, Brand } = await import('../db/schemas')

    const keywords = lowerQuery.split(/\s+/).filter(w => w.length > 2)

    // Build keyword query - exclude EV models if not an EV query
    const baseQuery: any = {
        status: 'active',
        $or: keywords.flatMap(kw => [
            { name: { $regex: kw, $options: 'i' } },
            { summary: { $regex: kw, $options: 'i' } },
            { pros: { $regex: kw, $options: 'i' } }
        ])
    }

    // Exclude EV models if user didn't ask for EV
    if (!isEVQuery) {
        baseQuery.name = { $not: { $regex: '\\bEV\\b', $options: 'i' } }
        baseQuery.fuelTypes = { $not: { $elemMatch: { $regex: '^electric$', $options: 'i' } } }
    }

    const keywordResults = await Model.find(baseQuery)
        .select('id name brandId bodyType summary pros cons minPrice maxPrice fuelTypes')
        .limit(5)
        .lean()

    // Enrich keyword results with brand name and isEV flag
    const brands = await Brand.find({}).select('id name').lean()
    const brandMap = new Map(brands.map(b => [b.id, b.name]))

    const enrichedKeyword = keywordResults.map(car => {
        const isEVModel = car.name.toLowerCase().includes('ev') ||
            car.fuelTypes?.some((f: string) => f.toLowerCase() === 'electric')
        return {
            ...car,
            brandName: brandMap.get(car.brandId) || '',
            matchType: 'keyword',
            searchScore: isEVModel && !isEVQuery ? 0.3 : 0.5,  // Lower score for EV if not requested
            isEV: isEVModel
        }
    })

    // 3. Merge results, prioritizing non-EV matches when not an EV query
    const seen = new Set<string>()
    const merged: any[] = []

    // First add non-EV semantic results
    for (const car of vectorResults) {
        const id = car.id || car._id?.toString()
        if (id && !seen.has(id) && (!car.isEV || isEVQuery)) {
            seen.add(id)
            merged.push(car)
        }
    }

    // Then add EV semantic results if we still need more
    if (merged.length < limit) {
        for (const car of vectorResults) {
            const id = car.id || car._id?.toString()
            if (id && !seen.has(id)) {
                seen.add(id)
                merged.push(car)
            }
        }
    }

    // Add keyword results (non-EV first)
    for (const car of enrichedKeyword.filter(c => !c.isEV || isEVQuery)) {
        const id = car.id || car._id?.toString()
        if (id && !seen.has(id) && merged.length < limit + 2) {
            seen.add(id)
            merged.push(car)
        }
    }

    // Sort final results: prioritize non-EV when not an EV query
    merged.sort((a, b) => {
        // First by EV status (non-EV first if not EV query)
        if (!isEVQuery) {
            if (a.isEV && !b.isEV) return 1
            if (!a.isEV && b.isEV) return -1
        }
        // Then by score
        return (b.searchScore || 0) - (a.searchScore || 0)
    })

    console.log(`🔀 Hybrid search: ${vectorResults.length} semantic + ${enrichedKeyword.length} keyword → ${merged.length} merged (EV query: ${isEVQuery})`)

    return merged.slice(0, limit)
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get vector store stats
 */
export function getVectorStoreStats() {
    return {
        initialized: isInitialized,
        totalVectors: vectorStore.length,
        lastInitTime: lastInitTime ? new Date(lastInitTime).toISOString() : null,
        cacheAge: lastInitTime ? Math.round((Date.now() - lastInitTime) / 1000) : null
    }
}

/**
 * Force refresh of vector store
 */
export async function refreshVectorStore(): Promise<void> {
    isInitialized = false
    lastInitTime = 0
    vectorStore = []
    await initializeVectorStore()
}

/**
 * Add new car to vector store (for real-time updates)
 */
export async function addCarToVectorStore(model: any, brandName: string): Promise<void> {
    const text = buildCarTextForEmbedding(model, brandName)
    const embedding = await generateEmbedding(text)

    vectorStore.push({
        id: model.id || model._id?.toString(),
        name: model.name,
        brandName,
        embedding,
        data: { ...model, brandName }
    })

    console.log(`➕ Added ${brandName} ${model.name} to vector store`)
}
