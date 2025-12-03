/**
 * Optimized Image Component
 * 
 * A wrapper around Next.js Image component that provides:
 * - Automatic lazy loading
 * - Blur placeholder support
 * - Proper sizing and optimization
 * - Fallback handling
 * - R2 CDN optimization
 */

'use client'

import Image, { ImageProps } from 'next/image'
import { useState, forwardRef } from 'react'

interface OptimizedImageProps extends Omit<ImageProps, 'placeholder' | 'blurDataURL'> {
    fallbackSrc?: string
    enableBlur?: boolean
    wrapperClassName?: string
}

// Simple blur placeholder data URL
const BLUR_DATA_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxOAPwCwAB//2Q=='

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(({
    src,
    alt,
    fallbackSrc = '/placeholder-car.jpg',
    enableBlur = true,
    priority = false,
    quality = 85,
    wrapperClassName = '',
    fill,
    className,
    ...props
}, ref) => {
    const [imgSrc, setImgSrc] = useState(src)
    const [isLoading, setIsLoading] = useState(true)

    const handleError = () => {
        if (fallbackSrc && imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc)
        }
    }

    const handleLoad = () => {
        setIsLoading(false)
    }

    return (
        <div className={`relative ${fill ? 'w-full h-full' : ''} ${wrapperClassName}`}>
            <Image
                ref={ref}
                src={imgSrc}
                alt={alt}
                quality={quality}
                loading={priority ? 'eager' : 'lazy'}
                placeholder={enableBlur ? 'blur' : 'empty'}
                blurDataURL={enableBlur ? BLUR_DATA_URL : undefined}
                onError={handleError}
                onLoad={handleLoad}
                fill={fill}
                className={className}
                {...props}
            />
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
        </div>
    )
})

OptimizedImage.displayName = 'OptimizedImage'
