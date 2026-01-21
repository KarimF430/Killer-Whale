'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PageContainer, { PageSection } from '@/components/layout/PageContainer'

export default function ContactUsPage() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => { window.scrollTo(0, 0) }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsSubmitting(false)
        setSubmitted(true)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <PageContainer maxWidth="lg">
                <PageSection spacing="normal">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-10">
                        <Link href="/" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>

                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
                        <p className="text-gray-600 mb-8">Have questions or feedback? We&apos;re here to help.</p>

                        {submitted ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                                <p className="text-gray-600 mb-6">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                                <button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }) }} className="text-orange-600 hover:text-orange-700 font-medium">
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Contact Info */}
                                <div className="lg:col-span-1 space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                        <a href="mailto:support@gadizone.com" className="text-orange-600 text-sm hover:underline">support@gadizone.com</a>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-1">Response Time</h3>
                                        <p className="text-gray-600 text-sm">We typically respond within 24 hours on business days.</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                                        <p className="text-gray-600 text-sm">Mumbai, Maharashtra, India</p>
                                    </div>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">YOUR NAME *</label>
                                            <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm" placeholder="Full name" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">EMAIL *</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} required
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm" placeholder="you@example.com" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">PHONE</label>
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm" placeholder="+91 98765 43210" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">SUBJECT *</label>
                                            <select name="subject" value={formData.subject} onChange={handleChange} required
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm">
                                                <option value="">Select subject</option>
                                                <option value="general">General Inquiry</option>
                                                <option value="support">Technical Support</option>
                                                <option value="feedback">Feedback</option>
                                                <option value="partnership">Business Partnership</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">MESSAGE *</label>
                                        <textarea name="message" value={formData.message} onChange={handleChange} required rows={5}
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm resize-none" placeholder="How can we help?" />
                                    </div>

                                    <button type="submit" disabled={isSubmitting}
                                        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded transition-colors">
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* SEO Content */}
                    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-3">Reach Out to gadizone</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            We welcome your questions, feedback, and suggestions. Whether you need help finding the right car,
                            have a technical issue with our website, or want to explore partnership opportunities, our team is ready to assist.
                        </p>
                        <p className="text-sm text-gray-600">
                            For the fastest response, please use the contact form above with a clear subject line.
                            We aim to respond to all inquiries within 24 business hours.
                        </p>
                    </div>
                </PageSection>
            </PageContainer>
        </div>
    )
}
