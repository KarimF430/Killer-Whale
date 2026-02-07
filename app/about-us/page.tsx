import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PageContainer, { PageSection } from '@/components/layout/PageContainer'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
    title: 'About gadizone - Your Car Research Partner in India',
    description: 'gadizone is India\'s trusted car research platform. Get detailed car specifications, prices, comparisons, and expert reviews to make the right car buying decision.',
    keywords: 'about gadizone, car research india, car buying guide, new car prices, car comparison, car reviews india',
    openGraph: {
        title: 'About gadizone - Your Car Research Partner',
        description: 'India\'s trusted car research platform for new car buyers.',
        type: 'website',
    },
}

export default function AboutUsPage() {
    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <PageContainer maxWidth="lg">
                    <PageSection spacing="normal">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-10">
                            <Link href="/" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Home
                            </Link>

                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">About gadizone</h1>

                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    gadizone is India's comprehensive car research platform designed to help car buyers make informed decisions.
                                    Whether you're buying your first car or upgrading to a new one, we provide all the information you need in one place.
                                </p>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">What We Offer</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2">Complete Car Database</h3>
                                        <p className="text-sm text-gray-600">Detailed specifications, features, and variants for all cars available in India - from budget hatchbacks to luxury SUVs.</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2">Accurate Pricing</h3>
                                        <p className="text-sm text-gray-600">Ex-showroom prices, on-road prices with taxes, and EMI calculations for every car and variant.</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2">Easy Comparisons</h3>
                                        <p className="text-sm text-gray-600">Compare multiple cars side by side on specs, features, and prices to find your perfect match.</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2">Helpful Tools</h3>
                                        <p className="text-sm text-gray-600">EMI calculator, fuel cost calculator, and on-road price estimator to plan your purchase.</p>
                                    </div>
                                </div>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    We believe buying a car should be exciting, not confusing. Our mission is to simplify car research by providing
                                    accurate, unbiased information that helps you choose the right car for your needs and budget. We don't push sales -
                                    we help you research.
                                </p>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Why Trust gadizone?</h2>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                                    <li><strong>No Hidden Agendas:</strong> We don't sell cars. Our focus is purely on helping you research.</li>
                                    <li><strong>Updated Information:</strong> We regularly update prices, specs, and launch information.</li>
                                    <li><strong>All Brands Covered:</strong> From Maruti to Mercedes, we cover every brand in India.</li>
                                    <li><strong>Free to Use:</strong> All our tools and information are completely free.</li>
                                </ul>

                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Popular Features</h2>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    <Link href="/compare" className="inline-block bg-orange-50 text-orange-600 px-4 py-2 rounded-lg text-sm hover:bg-orange-100">Compare Cars</Link>
                                    <Link href="/emi-calculator" className="inline-block bg-orange-50 text-orange-600 px-4 py-2 rounded-lg text-sm hover:bg-orange-100">EMI Calculator</Link>
                                    <Link href="/electric-cars" className="inline-block bg-orange-50 text-orange-600 px-4 py-2 rounded-lg text-sm hover:bg-orange-100">Electric Cars</Link>
                                    <Link href="/top-selling-cars-in-india" className="inline-block bg-orange-50 text-orange-600 px-4 py-2 rounded-lg text-sm hover:bg-orange-100">Top Selling Cars</Link>
                                </div>

                                <div className="mt-10 pt-6 border-t border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
                                    <p className="text-gray-700 mb-4">
                                        Have questions or suggestions? We'd love to hear from you.
                                    </p>
                                    <Link href="/contact-us" className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                                        Contact Us
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </PageSection>
                </PageContainer>
            </div>
            <Footer />
        </>
    )
}
