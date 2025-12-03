/**
 * Image Optimization Utilities
 * 
 * Helper functions for image optimization including:
 * - R2 CDN URL optimization
 * - Responsive image sizing
 * - Blur placeholder generation
 */

/**
 * Optimizes image URL for Cloudflare R2 with automatic format and sizing
 */
export function getOptimizedImageUrl(
    url: string,
    options: {
        width?: number
        quality?: number
        format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png'
    } = {}
): string {
    if (!url) return ''

    const { width, quality = 85, format = 'auto' } = options

    // Check if it's an R2 URL
    const r2Host = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_HOST ||
        process.env.R2_PUBLIC_BASE_HOST || ''

    if (r2Host && url.includes(r2Host)) {
        const params = new URLSearchParams()
        if (width) params.append('width', width.toString())
        params.append('quality', quality.toString())
        params.append('format', format)

        return `${url}?${params.toString()}`
    }

    return url
}

/**
 * Get responsive image sizes for srcSet
 */
export function getResponsiveSizes(baseWidth: number): string {
    const sizes = [640, 750, 828, 1080, 1200, 1920]
    return sizes
        .filter(size => size >= baseWidth)
        .map(size => `${size}w`)
        .join(', ')
}

/**
 * Generate blur data URL for placeholder
 * This is a simple implementation - for production, consider using plaiceholder or similar
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
    // Simple gray blur placeholder
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6' filter='url(%23b)'/%3E%3C/svg%3E`
}

/**
 * Get image dimensions from URL (if available in filename)
 */
export function extractDimensionsFromUrl(url: string): { width?: number; height?: number } {
    // Try to extract dimensions from filename like "image-800x600.jpg"
    const match = url.match(/(\d+)x(\d+)/)
    if (match) {
        return {
            width: parseInt(match[1], 10),
            height: parseInt(match[2], 10),
        }
    }
    return {}
}

/**
 * Check if image should be prioritized (above the fold)
 */
export function shouldPrioritizeImage(index: number, isMobile: boolean = false): boolean {
    // Prioritize first 2 images on desktop, first 1 on mobile
    return isMobile ? index === 0 : index < 2
}

/**
 * Get optimal image quality based on image type
 */
export function getOptimalQuality(imageType: 'hero' | 'thumbnail' | 'gallery' | 'icon'): number {
    switch (imageType) {
        case 'hero':
            return 90 // High quality for hero images
        case 'gallery':
            return 85 // Good quality for gallery
        case 'thumbnail':
            return 75 // Lower quality for thumbnails
        case 'icon':
            return 90 // High quality for small icons
        default:
            return 85
    }
}
