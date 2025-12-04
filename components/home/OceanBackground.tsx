'use client'

import { useEffect, useRef, useState } from 'react'

interface Fish {
  id: number
  x: number
  y: number
  speedX: number
  speedY: number
  size: number
  direction: 'left' | 'right'
  type: 'small' | 'medium' | 'large'
}

export default function OceanBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const fishesRef = useRef<Fish[]>([])
  const animationFrameRef = useRef<number>()
  const [mounted, setMounted] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [bubbles, setBubbles] = useState<Array<{ size: number, left: number, top: number, duration: number, delay: number }>>([])

  useEffect(() => {
    setMounted(true)

    // Wait for page to fully load before starting animations
    const handleLoad = () => {
      setPageLoaded(true)
    }

    if (document.readyState === 'complete') {
      // Page already loaded
      setPageLoaded(true)
    } else {
      // Wait for load event
      window.addEventListener('load', handleLoad)
    }

    return () => {
      window.removeEventListener('load', handleLoad)
    }
  }, [])

  useEffect(() => {
    if (!pageLoaded || !containerRef.current) return

    // Initialize bubbles on client side only after page load
    setBubbles(Array.from({ length: 15 }, () => ({
      size: Math.random() * 10 + 5,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    })))

    // Initialize fishes with different types
    const numFishes = 12
    fishesRef.current = Array.from({ length: numFishes }, (_, i) => {
      const type = i < 4 ? 'small' : i < 8 ? 'medium' : 'large'
      const sizeMap = { small: 30, medium: 50, large: 80 }

      return {
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        speedX: (Math.random() - 0.5) * (type === 'small' ? 3 : type === 'medium' ? 2 : 1.5),
        speedY: (Math.random() - 0.5) * 0.8,
        size: sizeMap[type] + Math.random() * 20,
        direction: Math.random() > 0.5 ? 'left' : 'right',
        type
      }
    })

    // Animation loop with smooth movement
    const animate = () => {
      fishesRef.current.forEach((fish) => {
        // Update position
        fish.x += fish.speedX
        fish.y += fish.speedY

        // Bounce off edges with direction change
        if (fish.x <= 0 || fish.x >= window.innerWidth - fish.size) {
          fish.speedX *= -1
          fish.direction = fish.speedX > 0 ? 'right' : 'left'
        }
        if (fish.y <= 0 || fish.y >= window.innerHeight - fish.size) {
          fish.speedY *= -1
        }

        // Update DOM element
        const fishElement = document.getElementById(`fish-${fish.id}`)
        if (fishElement) {
          fishElement.style.transform = `translate(${fish.x}px, ${fish.y}px) scaleX(${fish.direction === 'left' ? -1 : 1})`
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [pageLoaded])

  if (!mounted) return null

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-[1]"
      style={{ background: 'transparent', minHeight: '100%' }}
    >
      {/* Small decorative bubbles */}
      <div className="absolute inset-0">
        {bubbles.map((bubble, i) => (
          <div
            key={`bubble-${i}`}
            className="absolute rounded-full bg-blue-200/10"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              top: `${bubble.top}%`,
              animation: `float ${bubble.duration}s ease-in-out infinite`,
              animationDelay: `${bubble.delay}s`
            }}
          />
        ))}
      </div>

      {/* Animated Fishes using Lottie */}
      {fishesRef.current.map((fish) => (
        <div
          key={fish.id}
          id={`fish-${fish.id}`}
          className="absolute transition-transform duration-100 ease-linear"
          style={{
            width: `${fish.size}px`,
            height: `${fish.size}px`,
            filter: `hue-rotate(${fish.id * 30}deg) saturate(0.7)`
          }}
        >
          <dotlottie-wc
            src="https://lottie.host/1e656fe0-9ae8-40db-aed1-817b16849fcc/dyUiCYgei0.lottie"
            autoplay
            loop
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ))}

      {/* Killer Whale - hunting animation */}
      <div
        id="killer-whale"
        className="absolute"
        style={{
          width: '180px',
          height: '180px',
          animation: 'whale-hunt 40s ease-in-out infinite',
          filter: 'hue-rotate(200deg) saturate(0.6) brightness(0.9)'
        }}
      >
        <dotlottie-wc
          src="https://lottie.host/1e656fe0-9ae8-40db-aed1-817b16849fcc/dyUiCYgei0.lottie"
          autoplay
          loop
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <style jsx>{`
        @keyframes whale-hunt {
          0% {
            transform: translate(-200px, 15vh) rotate(0deg);
          }
          15% {
            transform: translate(30vw, 25vh) rotate(-5deg);
          }
          30% {
            transform: translate(60vw, 45vh) rotate(5deg);
          }
          45% {
            transform: translate(85vw, 35vh) rotate(-3deg);
          }
          50% {
            transform: translate(calc(100vw + 200px), 50vh) scaleX(-1) rotate(0deg);
          }
          65% {
            transform: translate(70vw, 60vh) scaleX(-1) rotate(5deg);
          }
          80% {
            transform: translate(40vw, 40vh) scaleX(-1) rotate(-5deg);
          }
          95% {
            transform: translate(10vw, 20vh) scaleX(-1) rotate(3deg);
          }
          100% {
            transform: translate(-200px, 15vh) rotate(0deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-30px) translateX(20px);
          }
        }
      `}</style>
    </div>
  )
}
