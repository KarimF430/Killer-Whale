'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await login(email, password, rememberMe)
            router.push('/') // Redirect to home on success
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = () => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
        window.location.href = `${backendUrl}/api/user/auth/google`
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-600 to-orange-500 flex flex-col">
            {/* Header */}
            <div className="pt-8 sm:pt-12 pb-6 sm:pb-8 px-4 sm:px-6 text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1.5 sm:mb-2">Sign in to your Account</h1>
                <p className="text-sm sm:text-base text-red-50">Enter your email and password to log in</p>
            </div>

            {/* Form Container */}
            <div className="flex-1 bg-white rounded-t-3xl p-4 sm:p-6 shadow-2xl">
                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3.5 sm:space-y-4">
                    {/* Google Sign In */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full py-3 sm:py-3.5 px-4 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center space-x-3 hover:border-gray-300 hover:shadow-sm transition-all active:scale-[0.98]"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="font-medium text-sm sm:text-base text-gray-700">Continue with Google</span>
                    </button>

                    {/* Divider */}
                    <div className="relative my-4 sm:my-5">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-xs sm:text-sm">
                            <span className="px-3 sm:px-4 bg-white text-gray-500">Or</span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm">
                            {error}
                        </div>
                    )}

                    {/* Email Input */}
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Loisbecket@gmail.com"
                            className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12 transition-all"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />
                            <span className="text-gray-600">Remember me</span>
                        </label>
                        <Link href="/forgot-password" className="text-red-600 hover:text-red-700 font-medium">
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98] text-sm sm:text-base"
                    >
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </button>

                    {/* Sign Up Link */}
                    <p className="text-center text-gray-600 text-xs sm:text-sm pt-2">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-red-600 hover:text-red-700 font-medium">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
