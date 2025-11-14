/** @type {import('next').NextConfig} */
const isProdEnv = process.env.NODE_ENV === 'production'
const extraImageHosts = (process.env.NEXT_PUBLIC_IMAGE_HOSTS || '')
  .split(',')
  .map(h => h.trim())
  .filter(Boolean)
const r2Host = process.env.R2_PUBLIC_BASE_HOST
const baseImageHosts = [
  'images.unsplash.com',
  'motoroctane.com',
  'www.motoroctane.com',
  r2Host,
  ...extraImageHosts,
].filter(Boolean)
const devImageHosts = ['localhost', '127.0.0.1']
const imageHosts = isProdEnv ? baseImageHosts : [...baseImageHosts, ...devImageHosts]
const remotePatterns = imageHosts.flatMap((hostname) => {
  const patterns = [{ protocol: 'https', hostname }]
  if (!isProdEnv && (hostname === 'localhost' || hostname === '127.0.0.1')) {
    patterns.push({ protocol: 'http', hostname })
  }
  return patterns
})

const nextConfig = {
  // Enable static export for Vercel deployment
  output: 'export',
  trailingSlash: true,
  
  // External packages configuration
  serverExternalPackages: ['sharp'],
  
  images: {
    unoptimized: true,
    remotePatterns,
    formats: ['image/webp', 'image/avif'],
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
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
