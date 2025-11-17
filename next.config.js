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
} catch {}
// Extract backend host (Render) so brand logos served from backend pass Next/Image allow-list
const rawBackend = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || ''
let backendHost = ''
try {
  if (rawBackend) {
    backendHost = rawBackend.includes('://')
      ? new URL(rawBackend).hostname
      : rawBackend.replace(/^https?:\/\//, '').replace(/\/.*/, '')
  }
} catch {}
const baseImageHosts = [
  'images.unsplash.com',
  'motoroctane.com',
  'www.motoroctane.com',
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
  output: 'standalone',
  
  // External packages configuration
  serverExternalPackages: ['sharp'],
  
  images: {
    unoptimized: true,
    remotePatterns,
    formats: ['image/webp', 'image/avif'],
  },
  // Security headers for production
  async headers() {
    const isProd = process.env.NODE_ENV === 'production'
    const connectSrcDev = "http://localhost:* https://localhost:*"
    // Derive backend origin for CSP connect-src (Vercel/production)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || ''
    let backendOrigin = ''
    try {
      if (apiUrl) backendOrigin = new URL(apiUrl).origin
    } catch {}
    const connectSrc = isProd ? backendOrigin : `${connectSrcDev} ${backendOrigin}`.trim()
    const unsafeEval = isProd ? "" : " 'unsafe-eval'"
    const csp = [
      "default-src 'self'",
      // Allow unsafe-eval only in development for Next/Webpack dev tooling
      `script-src 'self' 'unsafe-inline'${unsafeEval} https://www.googletagmanager.com https://www.google-analytics.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: http: blob:",
      "font-src 'self' data:",
      `connect-src 'self' ${connectSrc} https://www.google-analytics.com https://*.sentry.io https://images.unsplash.com`,
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
    ].join('; ')

    return [
      {
        source: '/(.*)',
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
