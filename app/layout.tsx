import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import { FavouritesProvider } from '@/lib/favourites-context'
import { AuthProvider } from '@/lib/auth-context'
import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider'
import { WebVitalsReporter } from '@/components/WebVitalsReporter'

const inter = Inter({ subsets: ['latin'] })

export const runtime = 'nodejs'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  // Removed maximumScale to allow user zooming (accessibility)
}

export const metadata: Metadata = {
  metadataBase: new URL('https://gadizone.com'),
  title: 'gadizone - New Cars in India | Latest Prices, Reviews & Comparisons',
  description: 'Discover new cars in India with AI-powered search. Compare latest prices, detailed specifications, expert reviews, and get the best deals from authorized dealers across India.',
  keywords: 'new cars India, car prices 2024, car specifications, car reviews, car comparison, EMI calculator, car deals, Maruti Suzuki, Hyundai, Tata, Mahindra',
  authors: [{ name: 'gadizone' }],
  creator: 'gadizone',
  publisher: 'gadizone',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://gadizone.com',
    siteName: 'gadizone',
    title: 'gadizone - New Cars in India | Latest Prices & Reviews',
    description: 'Discover new cars in India with AI-powered search. Compare latest prices, detailed specifications, and expert reviews from authorized dealers.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'gadizone - New Cars in India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'gadizone - New Cars in India | Latest Prices & Reviews',
    description: 'Discover new cars in India with AI-powered search. Compare latest prices, detailed specifications, and expert reviews.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://gadizone.com',
  },
  verification: {
    google: 'LFtjPhYM1moenJzbsp_pbaHepFH24i14Qwf6h5Z5-as',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID
  const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#dc2626" />

        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.clarity.ms" />
        {process.env.NEXT_PUBLIC_API_URL && (
          <link rel="preconnect" href={new URL(process.env.NEXT_PUBLIC_API_URL).origin} />
        )}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* Preconnect for Lottie animations */}
        <link rel="preconnect" href="https://unpkg.com" />
        <link rel="preconnect" href="https://lottie.host" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        <link rel="dns-prefetch" href="https://lottie.host" />

        {/* Lottie Files Web Component for Killer Whale Loading Animation */}
        <script
          src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.5/dist/dotlottie-wc.js"
          type="module"
          crossOrigin="anonymous"
          defer
        />

        {/* Google Analytics */}
        {GA_ID && (
          <>
            <link rel="preload" as="script" href={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}

        {/* Microsoft Clarity */}
        {CLARITY_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${CLARITY_ID}");
              `,
            }}
          />
        )}

        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "gadizone",
              "url": "https://gadizone.com",
              "description": "New cars in India - Latest prices, reviews & comparisons",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://gadizone.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <AnalyticsProvider>
          <AuthProvider>
            <FavouritesProvider>
              <WebVitalsReporter />
              <Header />
              {children}
            </FavouritesProvider>
          </AuthProvider>
        </AnalyticsProvider>
      </body>
    </html>
  )
}
