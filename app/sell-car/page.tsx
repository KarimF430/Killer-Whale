import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sell Your Car - Best Price Guarantee | gadizone',
    description: 'Sell your used car at the best price. Get instant valuation and free inspection.',
}

export default function SellCarPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Sell Your Car</h1>
                <p className="text-xl text-gray-600 mb-8">Get the best price for your old car. Selling platform coming soon.</p>
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
                    <p className="text-gray-500">We are building a hassle-free car selling experience for you.</p>
                </div>
            </div>
        </div>
    )
}
