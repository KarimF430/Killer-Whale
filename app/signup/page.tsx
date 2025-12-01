'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'

export default function SignUpPage() {
    const router = useRouter()
    const { register } = useAuth()

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        phone: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await register(formData)
            router.push('/') // Redirect to home on success
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-600 to-orange-500 flex flex-col">
            {/* Header */}
            <div className="pt-8 sm:pt-12 pb-6 sm:pb-8 px-4 sm:px-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">Sign Up</h1>
            </div>

            {/* Form Container */}
            <div className="flex-1 bg-white rounded-t-3xl p-4 sm:p-6 shadow-2xl">
                <div className="max-w-md mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="mb-3 sm:mb-4 flex items-center space-x-2 text-gray-600 hover:text-gray-800 active:scale-95 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    {/* Already Have Account */}
                    <p className="text-center text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="text-red-600 hover:text-red-700 font-medium">
                            Login
                        </Link>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm">
                                {error}
                            </div>
                        )}

                        {/* First Name & Last Name */}
                        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                            <div>
                                <label className="text-xs sm:text-sm text-gray-600 mb-1 block font-medium">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Lois"
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs sm:text-sm text-gray-600 mb-1 block font-medium">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Becket"
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-xs sm:text-sm text-gray-600 mb-1 block font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Loisbecket@gmail.com"
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        {/* Birth of Date */}
                        <div>
                            <label className="text-xs sm:text-sm text-gray-600 mb-1 block font-medium">Birth of date</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="text-xs sm:text-sm text-gray-600 mb-1 block font-medium">Phone Number</label>
                            <div className="flex space-x-2">
                                <select className="px-2.5 sm:px-3 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all">
                                    <option value="+91">🇮🇳 +91</option>
                                    <option value="+1">🇺🇸 +1</option>
                                    <option value="+44">🇬🇧 +44</option>
                                </select>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="(454) 726-0592"
                                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-xs sm:text-sm text-gray-600 mb-1 block font-medium">Set Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="********"
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-11 sm:pr-12 transition-all"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98] mt-5 sm:mt-6 text-sm sm:text-base"
                        >
                            {isLoading ? 'Creating Account...' : 'Register'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
