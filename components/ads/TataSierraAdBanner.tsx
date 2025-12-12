'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

const CAR_COLORS = [
    '/images/ads/sierra-white.png',
    '/images/ads/sierra-silver.png',
    '/images/ads/sierra-red.png',
    '/images/ads/sierra-beige.png',
    '/images/ads/sierra-olive.png',
]

export default function TataSierraAdBanner() {
    const [currentColorIndex, setCurrentColorIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true)
            setTimeout(() => {
                setCurrentColorIndex((prev) => (prev + 1) % CAR_COLORS.length)
                setIsTransitioning(false)
            }, 200)
        }, 1500) // Change color every 1.5 seconds

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="w-full relative rounded-2xl overflow-hidden shadow-md my-3 bg-[#FFF4E0]">
            <div className="p-3 pb-3">

                {/* Top Section with ANIMATED Hero Car */}
                <div className="relative mb-0 min-h-[120px] sm:min-h-[140px]">
                    {/* Title - Moved Down */}
                    <div className="relative z-10 w-[40%] pt-4">
                        <h1 className="text-3xl sm:text-4xl font-black text-[#FF9800] leading-[0.75] tracking-tight mb-1.5">
                            Tata<br />Sierra
                        </h1>
                        <div className="flex items-baseline gap-1 text-xs sm:text-sm">
                            <span className="text-[#FF9800] font-bold">Powered by</span>
                            <span className="text-[#1976D2] font-black italic text-sm sm:text-base">TATA</span>
                        </div>
                    </div>

                    {/* Animated Hero Car - Aligned with Title */}
                    <div className="absolute -right-20 -top-8 w-[400px] sm:w-[500px] h-[190px] sm:h-[230px] z-20">
                        <div className={`relative w-full h-full transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                            <Image
                                src={CAR_COLORS[currentColorIndex]}
                                alt="Tata Sierra"
                                fill
                                className="object-contain drop-shadow-2xl"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-4 gap-3 sm:gap-4">
                    <PillCard title="Premium Cockpit" image="/images/ads/tata-sierra-dash.png" />
                    <PillCard title="Luxury Seating" image="/images/ads/tata-sierra-seat.png" />
                    <PillCard title="Spacious Boot" image="/images/ads/tata-sierra-trunk.png" />
                    <PillCard title="Book Now" image="/images/ads/tata-sierra-ext.png" />
                </div>

            </div>
        </div>
    )
}

function PillCard({ title, image }: { title: string; image: string }) {
    return (
        <div className="bg-transparent flex flex-col items-center">
            {/* Title */}
            <div className="text-center mb-2">
                <h3 className="text-[#6D4C41] font-bold text-xs sm:text-sm leading-tight">
                    {title.split(' ').map((word, idx) => (
                        <span key={idx} className="block">{word}</span>
                    ))}
                </h3>
            </div>

            {/* Circular Image */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-lg flex-shrink-0">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="80px"
                />
            </div>
        </div>
    )
}
