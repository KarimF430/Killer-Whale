'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { renderTextWithCarLinks, useCarModelsData } from '@/lib/faq-hyperlinks'

interface FAQ {
    question: string
    answer: string
}

interface ModelFAQProps {
    brandName?: string
    modelName?: string
    faqs?: FAQ[]
}

export default function ModelFAQ({ brandName = 'Car', modelName = 'Model', faqs = [] }: ModelFAQProps) {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null)

    // Load car models for hyperlink generation
    useCarModelsData()

    const toggleFAQ = (index: number) => {
        setOpenFAQ(openFAQ === index ? null : index)
    }

    return (
        <section className="py-6 sm:py-8 bg-white">
            <div className="">
                <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                        {brandName} {modelName} FAQ
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                        {faqs.length > 0 ? `${faqs.length} questions about ${brandName} ${modelName}` : 'No FAQs available'}
                    </p>
                </div>

                {faqs.length === 0 ? (
                    <div className="text-center py-6 sm:py-8">
                        <p className="text-sm sm:text-base text-gray-600">
                            No FAQs available for {brandName} {modelName} yet. Check back soon for answers to common questions!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-4 py-3 sm:px-6 sm:py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors min-h-[56px]"
                                >
                                    <span className="font-medium text-gray-900 pr-3 sm:pr-4 text-sm sm:text-base">{faq.question}</span>
                                    {openFAQ === index ? (
                                        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
                                    )}
                                </button>

                                {openFAQ === index && (
                                    <div className="px-4 pb-3 sm:px-6 sm:pb-4">
                                        <div className="border-t border-gray-100 pt-3 sm:pt-4">
                                            <div className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                                {renderTextWithCarLinks(faq.answer, brandName)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
