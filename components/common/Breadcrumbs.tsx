'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Generate Schema.org BreadcrumbList structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.gadizone.com"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        ...(item.href && { "item": `https://www.gadizone.com${item.href}` })
      }))
    ]
  }

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Visual breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center space-x-2 text-sm ${className}`}
      >
        {/* Home link */}
        <Link
          href="/"
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
          aria-label="Home"
        >
          <Home className="h-4 w-4" />
        </Link>

        <ChevronRight className="h-4 w-4 text-gray-400" />

        {/* Breadcrumb items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <div key={index} className="flex items-center space-x-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-gray-900 transition-colors truncate max-w-[200px]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`truncate max-w-[200px] ${isLast ? 'text-gray-900 font-medium' : 'text-gray-500'
                    }`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && <ChevronRight className="h-4 w-4 text-gray-400" />}
            </div>
          )
        })}
      </nav>
    </>
  )
}

/**
 * Usage Examples:
 * 
 * // Brand page
 * <Breadcrumbs items={[
 *   { label: 'Brands', href: '/brands' },
 *   { label: 'Maruti Suzuki' }
 * ]} />
 * 
 * // Model page
 * <Breadcrumbs items={[
 *   { label: 'Brands', href: '/brands' },
 *   { label: 'Maruti Suzuki', href: '/maruti-suzuki-cars' },
 *   { label: 'Swift' }
 * ]} />
 * 
 * // Variant page
 * <Breadcrumbs items={[
 *   { label: 'Brands', href: '/brands' },
 *   { label: 'Maruti Suzuki', href: '/maruti-suzuki-cars' },
 *   { label: 'Swift', href: '/maruti-suzuki-cars/swift' },
 *   { label: 'VXI AMT' }
 * ]} />
 */
