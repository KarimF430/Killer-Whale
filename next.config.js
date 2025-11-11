/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Use remotePatterns (recommended) and keep formats
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.23',
      },
      {
        protocol: 'https',
        hostname: 'your-domain.com',
      },
    ],
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
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http: blob:; font-src 'self' data:; connect-src 'self' http://localhost:* https://localhost:* https://www.google-analytics.com https://*.sentry.io https://images.unsplash.com; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;",
          },
        ],
      },
    ];
  },
  // Configure for Replit proxy environment
  // Disable host checking for Replit iframe
  webpack: (config, { isServer }) => {
    // Simple fix for lucide-react module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      'lucide-react': require.resolve('lucide-react')
    }
    
    // Exclude backend client from build
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /backend\/client/,
    })
    
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
