import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

/**
 * SIMPLIFIED AI CHAT - Let AI handle everything
 * No hardcoded rules, no complex conditions
 */
export async function handleAIChat(
    userMessage: string,
    conversationHistory: any[]
): Promise<{
    reply: string
    cars?: any[]
    needsMoreInfo?: boolean
}> {

    // Build conversation context
    const messages = [
        {
            role: 'system',
            content: `You are a helpful Indian car expert assistant. 

Your capabilities:
1. Answer questions about cars (mileage, safety, features, comparisons, news, launches)
2. Help users find the perfect car based on their needs
3. Have natural conversations

Guidelines:
- For greetings (hi, hello): Respond warmly and ask how you can help
- For specific car questions (honda amaze, creta mileage): Answer directly with facts
- For car recommendations (suggest me a car, best car for family): Ask about budget, seating, usage
- For comparisons (creta vs seltos): Compare the cars
- Be conversational and natural
- Keep responses concise (2-3 sentences)

When helping with recommendations:
- Ask ONE question at a time (budget, then seating, then usage)
- Once you have budget + seating + usage, say "SHOW_CARS" and I'll fetch matching cars
- Format: "SHOW_CARS: {budget: 1000000, seating: 5, usage: 'city'}"`
        }
    ]

    // Add conversation history
    conversationHistory.forEach(msg => {
        messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        })
    })

    // Add current message
    messages.push({
        role: 'user',
        content: userMessage
    })

    // Let AI decide what to do
    const completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: messages as any,
        max_tokens: 300,
        temperature: 0.7
    })

    const aiResponse = completion.choices[0]?.message?.content || ''

    // Check if AI wants to show cars
    if (aiResponse.includes('SHOW_CARS:')) {
        const match = aiResponse.match(/SHOW_CARS:\s*({.*?})/s)
        if (match) {
            try {
                const requirements = JSON.parse(match[1])
                // Fetch cars from database
                const cars = await findMatchingCars(requirements)

                return {
                    reply: `Great! I found ${cars.length} cars that match your needs:`,
                    cars: cars,
                    needsMoreInfo: false
                }
            } catch (e) {
                console.error('Failed to parse requirements:', e)
            }
        }
    }

    // Check if AI is asking for more info
    const needsMoreInfo = aiResponse.includes('?') ||
        aiResponse.toLowerCase().includes('budget') ||
        aiResponse.toLowerCase().includes('seating') ||
        aiResponse.toLowerCase().includes('how many')

    return {
        reply: aiResponse.replace(/SHOW_CARS:.*$/s, '').trim(),
        needsMoreInfo
    }
}

async function findMatchingCars(requirements: any): Promise<any[]> {
    // Your existing car matching logic
    return []
}
