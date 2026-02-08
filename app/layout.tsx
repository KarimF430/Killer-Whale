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
  metadataBase: new URL('https://www.gadizone.com'),
  title: {
    default: 'gadizone - New Cars in India | Check Prices, Specs & Reviews',
    template: '%s | gadizone'
  },
  description: 'Find your perfect car with gadizone. Compare latest car prices in India, read expert reviews, check detailed specifications, and get the best on-road price deals.',
  keywords: ['new cars India', 'car prices', 'car reviews', 'compare cars', 'on road price', 'car dealers', 'gadizone', 'automotive news'],
  authors: [{ name: 'gadizone Team' }],
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
    url: 'https://www.gadizone.com',
    siteName: 'gadizone',
    title: 'gadizone - The Best Way to Buy a New Car in India',
    description: 'Detailed specs, real owner reviews, and instant on-road price quotes for all cars in India.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'gadizone - Find Your Dream Car',
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
    // canonical: 'https://www.gadizone.com', // REMOVED: This was causing all pages to canonicalize to home
  },
  verification: {
    google: 'LFtjPhYM1moenJzbsp_pbaHepFH24i14Qwf6h5Z5-as',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
        <meta name="theme-color" content="#dc2626" />

        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.clarity.ms" />
        {process.env.NEXT_PUBLIC_API_URL && (
          <link rel="preconnect" href={new URL(process.env.NEXT_PUBLIC_API_URL).origin} />
        )}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W45SDT8L');`,
          }}
        />
        {/* End Google Tag Manager */}

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
              "url": "https://www.gadizone.com",
              "description": "New cars in India - Latest prices, reviews & comparisons",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.gadizone.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W45SDT8L"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

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
