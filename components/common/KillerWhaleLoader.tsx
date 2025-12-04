'use client';

import { useEffect, useState } from 'react';

interface KillerWhaleLoaderProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showText?: boolean;
    text?: string;
    fullScreen?: boolean;
    className?: string;
}

const KILLER_WHALE_LOTTIE_URL = 'https://lottie.host/230e4f3a-3c8d-408a-a03e-fee2426dd498/utPo4hVEXs.lottie';

export default function KillerWhaleLoader({
    size = 'md',
    showText = true,
    text = 'Loading...',
    fullScreen = false,
    className = '',
}: KillerWhaleLoaderProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const sizeConfig = {
        sm: { width: 80, height: 80, textSize: 'text-xs' },
        md: { width: 150, height: 150, textSize: 'text-sm' },
        lg: { width: 250, height: 250, textSize: 'text-base' },
        xl: { width: 350, height: 350, textSize: 'text-lg' },
    };

    const { width, height, textSize } = sizeConfig[size];

    const loaderContent = (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            {/* Lottie Animation Container with Orange Glow */}
            <div
                className="relative"
                style={{
                    filter: 'drop-shadow(0 0 20px rgba(249, 115, 22, 0.4))',
                }}
            >
                {mounted && (
                    <dotlottie-wc
                        src={KILLER_WHALE_LOTTIE_URL}
                        style={{ width: `${width}px`, height: `${height}px` }}
                        autoplay
                        loop
                    />
                )}

                {/* Orange gradient overlay for brand consistency */}
                <div
                    className="absolute inset-0 pointer-events-none rounded-full opacity-10"
                    style={{
                        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, transparent 70%)',
                    }}
                />
            </div>

            {/* Loading Text with Gradient */}
            {showText && (
                <div className={`${textSize} font-medium`}>
                    <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent animate-pulse">
                        {text}
                    </span>
                </div>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm">
                {/* Animated background gradient */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        background: 'radial-gradient(ellipse at center, rgba(249, 115, 22, 0.3) 0%, rgba(220, 38, 38, 0.1) 50%, transparent 80%)',
                    }}
                />
                <div className="relative z-10">
                    {loaderContent}
                </div>
            </div>
        );
    }

    return loaderContent;
}

// Small inline spinner using the whale animation for buttons, etc.
export function KillerWhaleSpinner({ size = 60 }: { size?: number }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div
                className="animate-spin rounded-full border-2 border-gray-300 border-t-orange-500 mx-auto"
                style={{ width: size / 2, height: size / 2 }}
            />
        );
    }

    return (
        <div className="flex justify-center">
            <dotlottie-wc
                src={KILLER_WHALE_LOTTIE_URL}
                style={{ width: `${size}px`, height: `${size}px` }}
                autoplay
                loop
            />
        </div>
    );
}
