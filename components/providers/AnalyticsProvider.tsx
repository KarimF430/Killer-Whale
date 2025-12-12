'use client';

/**
 * Analytics Provider
 * Initializes analytics and tracks route changes
 */

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import analytics from '@/lib/analytics';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize analytics on mount
    useEffect(() => {
        analytics.init();
    }, []);

    // Track page views on route change
    useEffect(() => {
        if (pathname) {
            const url = searchParams?.toString()
                ? `${pathname}?${searchParams.toString()}`
                : pathname;

            analytics.trackPageView(url, document.title);
        }
    }, [pathname, searchParams]);

    return <>{children}</>;
}
