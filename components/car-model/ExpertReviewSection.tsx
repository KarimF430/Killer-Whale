
import React, { useMemo, useState } from 'react'
import { Star, User } from 'lucide-react'
import { generateExpertReview } from '@/lib/expert-review-logic'

interface ExpertReviewSectionProps {
    model: any
}

export default function ExpertReviewSection({ model }: ExpertReviewSectionProps) {
    const review = useMemo(() => generateExpertReview(model, model.variants), [model])
    const [isExpanded, setIsExpanded] = useState(false)

    // Helper to render text with bold formatting safely
    const renderFormattedText = (text: string) => {
        if (!text) return null
        const parts = text.split(/(\*\*[\s\S]*?\*\*)/g)
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                const content = part.slice(2, -2)
                return <span key={index} className="font-bold text-gray-900">{content}</span>
            }
            return <span key={index}>{part}</span>
        })
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {model?.brand} {model?.name} Expert Review
            </h2>

            {/* Content Container - Removed "Box" styling (border, bg, shadow, padding) */}
            <div className=""> {/* Plain div for structure, no visual box */}

                {/* Header Row: Verdict Badge (Left) + Rating Pill (Right) */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            GADIZONE VERDICT
                        </span>
                        <span className="text-sm text-gray-400 font-medium hidden sm:inline-block">
                            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                    </div>

                    {/* Small Rating Pill on Right */}
                    <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-2.5 py-1 rounded-md">
                        <Star className="w-3.5 h-3.5 text-green-600 fill-green-600" />
                        <span className="text-sm font-bold text-green-700 leading-none pt-0.5">
                            {review.rating} <span className="text-green-600 font-normal text-xs">/ 10</span>
                        </span>
                    </div>
                </div>

                {/* Content Body */}
                <div className="space-y-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                        {review.verdictTitle}
                    </h3>

                    <div className="text-gray-600 text-base leading-relaxed">
                        <p className={`${!isExpanded ? 'line-clamp-4' : ''} whitespace-pre-line`}>
                            {renderFormattedText(review.verdictSummary)}
                        </p>
                    </div>

                    {/* Read More Link */}
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-red-500 hover:text-red-600 font-normal text-base transition-colors flex items-center gap-1"
                        >
                            {isExpanded ? 'Read Less' : 'Read More'}
                        </button>
                    </div>
                </div>

                {/* Author Footer */}
                <div className="flex items-center gap-3 pt-6 mt-4 border-t border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                        <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900">{review.author.name}</span>
                        <span className="text-[10px] text-gray-500">{review.author.role}</span>
                    </div>
                </div>

            </div>
        </div>
    )
}
// v5 no-box layout
