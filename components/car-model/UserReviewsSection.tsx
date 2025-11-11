'use client'

import { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown, User, ChevronDown } from 'lucide-react'

interface Review {
  id: string
  userName: string
  userAvatar: string
  rating: number
  date: string
  title: string
  content: string
  helpful: number
  notHelpful: number
  verified: boolean
}

interface UserReviewsSectionProps {
  carName: string
  overallRating: number
  totalReviews: number
  ratingBreakdown: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  reviews: Review[]
}

export default function UserReviewsSection({ 
  carName, 
  overallRating, 
  totalReviews, 
  ratingBreakdown, 
  reviews 
}: UserReviewsSectionProps) {
  const [filterRating, setFilterRating] = useState('All Ratings')
  const [sortBy, setSortBy] = useState('Most Recent')

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const getRatingPercentage = (count: number) => {
    return (count / totalReviews) * 100
  }

  return (
    <section className="py-8 bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-700 mb-6">
          {carName} User Reviews
        </h2>

        {/* Rating Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            {renderStars(Math.floor(overallRating), 'md')}
            <span className="ml-2 text-lg font-bold text-gray-900">{overallRating}</span>
            <span className="ml-2 text-sm text-gray-600">({totalReviews.toLocaleString()} reviews)</span>
          </div>

          {/* Rating Breakdown */}
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-900 mb-3">Rating Breakdown</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center text-sm">
                  <span className="w-4 text-gray-700">{rating}★</span>
                  <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-400 h-2 rounded-full"
                      style={{ width: `${getRatingPercentage(ratingBreakdown[rating as keyof typeof ratingBreakdown])}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-gray-600 text-right">
                    {ratingBreakdown[rating as keyof typeof ratingBreakdown]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by rating:</label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>All Ratings</option>
                <option>5 Stars</option>
                <option>4 Stars</option>
                <option>3 Stars</option>
                <option>2 Stars</option>
                <option>1 Star</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Most Recent</option>
                <option>Highest Rating</option>
                <option>Lowest Rating</option>
                <option>Most Helpful</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 text-sm mr-2">{review.userName}</span>
                      {review.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">✓</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>

              {/* Review Content */}
              <h4 className="font-medium text-gray-900 text-sm mb-2">{review.title}</h4>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">{review.content}</p>

              {/* Review Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center text-xs text-gray-500 hover:text-gray-700">
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    {review.helpful}
                  </button>
                  <button className="flex items-center text-xs text-gray-500 hover:text-gray-700">
                    <ThumbsDown className="w-3 h-3 mr-1" />
                    {review.notHelpful}
                  </button>
                  <span className="text-xs text-gray-500">Helpful</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Read More Button */}
        <div className="text-center mt-6">
          <button className="text-red-500 hover:text-red-600 font-medium text-sm">
            Read More
          </button>
        </div>
      </div>
    </section>
  )
}
