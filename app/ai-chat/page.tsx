'use client'

/**
 * AI Car Finder - ChatGPT-Style Interface
 * Modern dark theme with MotorOctane branding
 */

import { useState, useEffect, useRef, Suspense } from 'react'
import { Send, Mic, ThumbsUp, ThumbsDown, Copy, Menu, Plus, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import './chat-gpt-style.css'

interface Message {
    id: string
    role: 'user' | 'ai'
    content: string
    timestamp: Date
    quickReplies?: string[]
    cars?: CarMatch[]
    conversationState?: any
}

interface CarMatch {
    id: string
    name: string
    brand?: string
    brandName?: string  // From vector search
    price?: number
    minPrice?: number   // From vector search
    maxPrice?: number   // From vector search
    matchScore?: number
    searchScore?: number  // From vector search (0-1)
    image?: string
    reasons?: string[]
    pros?: string        // From vector search
    cons?: string        // From vector search
    bodyType?: string    // From vector search
    matchType?: 'semantic' | 'keyword'  // From vector search
    webIntelligence?: {
        totalReviews: number
        ownerRecommendation: number
        averageSentiment: number
    }
}

function AICarFinderContent() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [sessionId] = useState(() => `session-${Date.now()}`)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const searchParams = useSearchParams()
    const hasAutoSent = useRef(false)

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    // Handle auto-send from URL params
    useEffect(() => {
        const message = searchParams.get('message')
        const autoSend = searchParams.get('autoSend')

        if (message && autoSend === 'true' && !hasAutoSent.current) {
            hasAutoSent.current = true
            handleSend(message)
        } else if (message && !hasAutoSent.current) {
            setInput(message)
        }
    }, [searchParams])

    // Handle send message
    const handleSend = async (message?: string) => {
        const textToSend = message || input
        if (!textToSend.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: textToSend,
            timestamp: new Date()
        }

        const updatedMessages = [...messages, userMessage]
        setMessages(updatedMessages)
        setInput('')
        setIsTyping(true)

        try {
            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: textToSend,
                    sessionId,
                    conversationHistory: updatedMessages
                })
            })

            const data = await response.json()

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: data.reply,
                timestamp: new Date(),
                quickReplies: data.quickReplies,
                cars: data.cars,
                conversationState: data.conversationState
            }
            setMessages(prev => [...prev, aiMessage])
        } catch (error) {
            console.error('Error:', error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: "Sorry, I'm having trouble right now. Please try again!",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsTyping(false)
        }
    }

    // Handle quick reply
    const handleQuickReply = (reply: string) => {
        handleSend(reply)
    }

    // Handle Enter key
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    // Copy message
    const copyMessage = (content: string) => {
        navigator.clipboard.writeText(content)
    }

    return (
        <div className="chat-container">
            {/* Messages */}
            <div className="messages-container">
                {messages.map((message) => (
                    <div key={message.id} className={`message ${message.role}`}>
                        <div className="message-content-wrapper">
                            <div className="message-avatar">
                                {message.role === 'user' ? 'Y' : <Sparkles size={16} />}
                            </div>
                            <div className="message-content">
                                <div className="message-text">{message.content}</div>

                                {/* Quick Replies */}
                                {message.quickReplies && message.quickReplies.length > 0 && (
                                    <div className="quick-replies">
                                        {message.quickReplies.map((reply, idx) => (
                                            <button
                                                key={idx}
                                                className="quick-reply-btn"
                                                onClick={() => handleQuickReply(reply)}
                                            >
                                                {reply}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Car Cards */}
                                {message.cars && message.cars.length > 0 && (
                                    <div className="car-cards">
                                        {message.cars.map((car, idx) => (
                                            <div key={car.id || idx} className="car-card">
                                                <div className="car-card-header">
                                                    <div>
                                                        <div className="car-name">{car.brandName || car.brand} {car.name}</div>
                                                        <div className="car-brand">{car.brandName || car.brand}</div>
                                                    </div>
                                                    {car.matchScore ? (
                                                        <div className="match-score">{car.matchScore}% Match</div>
                                                    ) : car.searchScore ? (
                                                        <div className="match-score">{Math.round(car.searchScore * 100)}% Match</div>
                                                    ) : null}
                                                </div>
                                                <div className="car-price">
                                                    {car.minPrice
                                                        ? `₹${(car.minPrice / 100000).toFixed(1)}L - ₹${((car.maxPrice || car.minPrice) / 100000).toFixed(1)}L`
                                                        : car.price
                                                            ? `₹${(car.price / 100000).toFixed(1)}L`
                                                            : 'Price TBA'
                                                    }
                                                </div>
                                                {car.webIntelligence && (
                                                    <div style={{ marginBottom: '12px', fontSize: '13px', color: '#10a37f' }}>
                                                        ⭐ {car.webIntelligence.ownerRecommendation}% owners recommend ({car.webIntelligence.totalReviews} reviews)
                                                    </div>
                                                )}
                                                {/* Show pros from vector search or reasons from legacy */}
                                                {(car.reasons || car.pros) && (
                                                    <ul className="car-reasons">
                                                        {car.reasons
                                                            ? car.reasons.map((reason: string, idx: number) => (
                                                                <li key={idx}>{reason}</li>
                                                            ))
                                                            : car.pros && (
                                                                <li key="pros">✓ {car.pros.slice(0, 100)}{car.pros.length > 100 ? '...' : ''}</li>
                                                            )
                                                        }
                                                    </ul>
                                                )}
                                                {car.bodyType && (
                                                    <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                                                        {car.bodyType} {car.matchType === 'semantic' ? '• AI Matched' : ''}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Message Actions */}
                                {message.role === 'ai' && (
                                    <div className="message-actions">
                                        <button className="action-btn" onClick={() => copyMessage(message.content)} title="Copy response">
                                            <Copy size={16} />
                                        </button>
                                        <button className="action-btn" title="Good response">
                                            <ThumbsUp size={16} />
                                        </button>
                                        <button className="action-btn" title="Bad response">
                                            <ThumbsDown size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="message ai">
                        <div className="message-content-wrapper">
                            <div className="message-avatar">
                                <Sparkles size={16} />
                            </div>
                            <div className="message-content">
                                <div className="typing-indicator">
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="input-container">
                <div className="input-layout">
                    <div className="input-prefix-icon">
                        <Sparkles size={24} strokeWidth={1.5} />
                    </div>
                    <div className="input-box-wrapper">
                        <textarea
                            ref={inputRef}
                            className="input-box"
                            placeholder="Ask anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                        />
                        <div className="input-actions">
                            <button className="mic-btn" title="Voice input">
                                <Mic size={20} strokeWidth={1.5} />
                            </button>
                            <button
                                className="send-btn"
                                onClick={() => handleSend()}
                                disabled={!input.trim()}
                                title="Send message"
                            >
                                <Send size={18} strokeWidth={2} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="helper-text">
                    MotorOctane AI can make mistakes. Check important info.
                </div>
            </div>
        </div>
    )
}

export default function AICarFinderPage() {
    return (
        <Suspense fallback={
            <div className="ai-chat-container">
                <div className="chat-layout">
                    <div className="chat-main">
                        <div className="chat-messages">
                            <div className="loading-spinner">Loading AI Chat...</div>
                        </div>
                    </div>
                </div>
            </div>
        }>
            <AICarFinderContent />
        </Suspense>
    )
}
