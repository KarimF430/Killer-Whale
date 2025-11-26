'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import './ai-chat.css'

interface Message {
    role: 'user' | 'ai'
    content: string
}

interface Car {
    brand: string
    name: string
    price: number
    imageUrl?: string
}

export default function AIChat Page() {
    const searchParams = useSearchParams()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [cars, setCars] = useState<Car[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)
    
    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    
    useEffect(() => {
        scrollToBottom()
    }, [messages])
    
    // Handle pre-filled message from quirky bot
    useEffect(() => {
        const message = searchParams.get('message')
        const autoSend = searchParams.get('autoSend')
        
        if (message) {
            setInput(message)
            
            if (autoSend === 'true') {
                // Auto-send after a brief delay
                setTimeout(() => {
                    sendMessage(message)
                }, 500)
            }
        }
    }, [searchParams])
    
    const sendMessage = async (messageText?: string) => {
        const text = messageText || input.trim()
        if (!text) return
        
        // Add user message
        const userMessage: Message = { role: 'user', content: text }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)
        
        try {
            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    sessionId: 'web-session',
                    conversationHistory: messages
                })
            })
            
            const data = await response.json()
            
            // Add AI response
            const aiMessage: Message = { role: 'ai', content: data.reply }
            setMessages(prev => [...prev, aiMessage])
            
            // Update cars if provided
            if (data.cars && data.cars.length > 0) {
                setCars(data.cars)
            }
            
        } catch (error) {
            console.error('Chat error:', error)
            const errorMessage: Message = {
                role: 'ai',
                content: 'Sorry, I encountered an error. Please try again.'
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setLoading(false)
        }
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        sendMessage()
    }
    
    return (
        <div className="ai-chat-page">
            <div className="chat-container">
                {/* Header */}
                <div className="chat-header">
                    <div className="header-content">
                        <span className="bot-icon">🤖</span>
                        <div>
                            <h1>AI Car Assistant</h1>
                            <p>Ask me anything about cars!</p>
                        </div>
                    </div>
                </div>
                
                {/* Messages */}
                <div className="messages-container">
                    {messages.length === 0 && (
                        <div className="welcome-message">
                            <span className="welcome-icon">👋</span>
                            <h2>Hi! I'm your AI car assistant</h2>
                            <p>Ask me about car comparisons, recommendations, or any car-related questions!</p>
                            
                            <div className="quick-questions">
                                <button onClick={() => sendMessage('Which is better Creta or Seltos?')}>
                                    Creta vs Seltos?
                                </button>
                                <button onClick={() => sendMessage('Best car under 10 lakhs')}>
                                    Best under ₹10L
                                </button>
                                <button onClick={() => sendMessage('Safest cars in India')}>
                                    Safest cars
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.role}`}>
                            <div className="message-avatar">
                                {msg.role === 'user' ? '👤' : '🤖'}
                            </div>
                            <div className="message-content">
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    
                    {loading && (
                        <div className="message ai">
                            <div className="message-avatar">🤖</div>
                            <div className="message-content">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>
                
                {/* Cars Display */}
                {cars.length > 0 && (
                    <div className="cars-display">
                        <h3>Recommended Cars:</h3>
                        <div className="cars-grid">
                            {cars.map((car, idx) => (
                                <div key={idx} className="car-card">
                                    {car.imageUrl && (
                                        <img src={car.imageUrl} alt={`${car.brand} ${car.name}`} />
                                    )}
                                    <h4>{car.brand} {car.name}</h4>
                                    <p className="price">₹{(car.price / 100000).toFixed(2)}L</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Input */}
                <form className="chat-input-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything about cars..."
                        disabled={loading}
                        className="chat-input"
                    />
                    <button 
                        type="submit" 
                        disabled={loading || !input.trim()}
                        className="send-button"
                    >
                        {loading ? '⏳' : '➤'}
                    </button>
                </form>
            </div>
        </div>
    )
}
