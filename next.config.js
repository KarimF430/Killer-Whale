/** @type {import('next').NextConfig} */
const isProdEnv = process.env.NODE_ENV === 'production'
const extraImageHosts = (process.env.NEXT_PUBLIC_IMAGE_HOSTS || '')
  .split(',')
  .map(h => h.trim())
  .filter(Boolean)
// Support either a hostname or a full URL in env and extract just the hostname
const rawR2 = process.env.R2_PUBLIC_BASE_HOST || process.env.R2_PUBLIC_BASE_URL || ''
let r2Host = ''
try {
  if (rawR2) {
    r2Host = rawR2.includes('://')
      ? new URL(rawR2).hostname
      : rawR2.replace(/^https?:\/\//, '').replace(/\/.*/, '')
  }
} catch { }
// Extract backend host (Render) so brand logos served from backend pass Next/Image allow-list
const rawBackend = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || ''
let backendHost = ''
try {
  if (rawBackend) {
    backendHost = rawBackend.includes('://')
      ? new URL(rawBackend).hostname
      : rawBackend.replace(/^https?:\/\//, '').replace(/\/.*/, '')
  }
} catch { }
const baseImageHosts = [
  'images.unsplash.com',
  'gadizone.com',
  'www.gadizone.com',
  r2Host,
  backendHost,
  ...extraImageHosts,
].filter(Boolean)
const devImageHosts = ['localhost', '127.0.0.1']
const imageHosts = isProdEnv ? baseImageHosts : [...baseImageHosts, ...devImageHosts]
const remotePatterns = imageHosts.flatMap((hostname) => {
  const patterns = [{ protocol: 'https', hostname, pathname: '/**' }]
  if (!isProdEnv && (hostname === 'localhost' || hostname === '127.0.0.1')) {
    patterns.push({ protocol: 'http', hostname, pathname: '/**' })
  }
  return patterns
})

const nextConfig = {
  // Server-rendered build suitable for Vercel/Node runtime
  // Server-rendered build suitable for Vercel/Node runtime
  // output: 'standalone',

  // External packages configuration
  serverExternalPackages: ['sharp'],

  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  images: {
    unoptimized: false, // Enable image optimization
    remotePatterns,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },
  // Security headers and cache control for production
  async headers() {
    const isProd = process.env.NODE_ENV === 'production'
    const connectSrcDev = "http://localhost:* https://localhost:*"
    // Derive backend origin for CSP connect-src (Vercel/production)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || ''
    let backendOrigin = ''
    try {
      if (apiUrl) backendOrigin = new URL(apiUrl).origin
    } catch { }
    const connectSrc = isProd ? backendOrigin : `${connectSrcDev} ${backendOrigin}`.trim()
    const unsafeEval = isProd ? "" : " 'unsafe-eval'"
    const csp = [
      "default-src 'self'",
      // Allow unsafe-eval only in development for Next/Webpack dev tooling
      // Added unpkg.com and lottie hosts for Killer Whale loading animation
      `script-src 'self' 'unsafe-inline'${unsafeEval} 'wasm-unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://unpkg.com https://cdn.jsdelivr.net`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: http: blob:",
      "font-src 'self' data:",
      // Added lottie.host, unpkg.com, cdn.jsdelivr.net for Killer Whale animation
      `connect-src 'self' ${connectSrc} https://www.google-analytics.com https://*.sentry.io https://images.unsplash.com https://www.googleapis.com https://lottie.host https://unpkg.com https://cdn.jsdelivr.net`,
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
      // Added wasm-unsafe-eval for Lottie WASM player
      "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://unpkg.com https://cdn.jsdelivr.net",
    ].join('; ')

    return [
      {
        source: '/((?!_next|static|favicon.ico).*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
      // Cache headers for static assets
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.webp',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.jpg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  // Configure for Replit proxy environment
  // Disable host checking for Replit iframe
  webpack: (config, { isServer }) => {
    // Simple fix for lucide-react module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      'lucide-react': require.resolve('lucide-react')
    }

    return config
  },

  // Exclude backend directory from TypeScript checking
  typescript: {
    ignoreBuildErrors: true,
  },

  // Exclude backend from build
  outputFileTracingExcludes: {
    '*': ['./backend/**/*'],
  },
};

module.exports = nextConfig;
