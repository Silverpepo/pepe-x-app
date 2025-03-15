'use client'

import { useEffect, useRef, useMemo } from 'react'
import { initStarTwinkling, initParallaxScroll } from '@/utils/animation'
import { gsap, ScrollTrigger } from '@/lib/gsap'

interface SpaceBackgroundProps {
  scrollElementRef: React.RefObject<HTMLDivElement>
}

export default function SpaceBackground({ scrollElementRef }: SpaceBackgroundProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const starsRef = useRef<SVGCircleElement[]>([])

  // Memoize star generation to avoid recreating on every render
  const distantStars = useMemo(() => generateStars(150, 0.5, 1.0, 0.4), [])
  const midStars = useMemo(() => generateStars(80, 1.0, 2.5, 0.5, "glow"), [])
  const foregroundStars = useMemo(() => generateStars(40, 1.5, 3.5, 0.6, "star-glow"), [])

  // Helper function for star generation
  function generateStars(
    count: number,
    minRadius: number,
    maxRadius: number,
    minOpacity: number,
    filter?: string
  ) {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      cx: Math.random() * 1920,
      cy: Math.random() * 1080,
      r: Math.random() * (maxRadius - minRadius) + minRadius,
      opacity: minOpacity + Math.random() * 0.4,
      filter
    }))
  }

  /**
   * Initialize parallax scrolling for space background elements
   */
  const initSpaceParallax = () => {
    initParallaxScroll({
      layers: [
        { element: '#space-bg', speed: 0.2 },
        { element: '#nebula-1', speed: 0.4 },
        { element: '#nebula-2', speed: 0.3 },
        { element: '#nebula-3', speed: 0.5 },
        { element: '#stars-distant', speed: 0.1 },
        { element: '#stars-mid', speed: 0.2 },
        { element: '#stars-foreground', speed: 0.3 },
        { element: '#planet-1', speed: 0.6 },
        { element: '#planet-2', speed: 0.5 }
      ],
      trigger: '.scrollElement'
    })
  }


  interface Position {
    x: number;
    y: number;
  }

  /**
   * Initialize shooting stars animations
   */
  const initShootingStars = () => {
    // Create more subtle shooting stars with natural trajectories
    const animateShootingStar = (element: string, initialDelay: number) => {
      const star = document.querySelector(element) as SVGElement;
      if (!star) return;

      // Function to create random starting positions across the sky
      const getRandomPosition = () => {
        // Stars can start from top-left and top-right areas of the screen
        const topQuarter = Math.random() > 0.5;
        return {
          x: topQuarter ? Math.random() * 800 : 800 + Math.random() * 800,
          y: Math.random() * 400  // Start in upper portion of the screen
        };
      };

      // Function to animate a single shooting star
      const animateStar = () => {
        const startPos = getRandomPosition();

        // More natural path distance with variation
        const distance = 500 + Math.random() * 700;

        // More varied angle - create more natural diagonal trajectories
        // Values between 0.1π and 0.3π for natural downward paths
        const angleDirection = Math.random() > 0.5 ? 1 : -1; // Randomly choose direction
        const angle = Math.PI * (0.1 + Math.random() * 0.2) * angleDirection;

        // Calculate end position with better diagonal paths
        const endX = startPos.x + Math.sin(angle) * distance;
        const endY = startPos.y + Math.cos(angle) * distance;

        // Initial setup - transparent and ready for animation
        gsap.set(star, {
          x: startPos.x,
          y: startPos.y,
          opacity: 0,
          strokeWidth: 0.8 + Math.random() * 1.2, // Vary the stroke width
          filter: `drop-shadow(0 0 ${3 + Math.random() * 5}px rgba(255,255,255,0.5))` // Subtle glow
        });

        // Create the animation timeline with improved easing and timing
        gsap.timeline()
          // Gentle fade in
          .to(star, {
            opacity: 0.4 + Math.random() * 0.3, // Subtle max opacity
            duration: 0.2 + Math.random() * 0.2,
            ease: "power1.in"
          })
          // Movement with natural speed
          .to(star, {
            x: endX,
            y: endY,
            duration: 0.8 + Math.random() * 0.5, // More varied duration (0.8-1.3 seconds)
            ease: "power1.in", // More natural acceleration
            strokeWidth: "-=0.3" // Subtle thinning effect as it moves
          }, "-=0.1") // Slight overlap
          // Gradual fade out before reaching final position
          .to(star, {
            opacity: 0,
            duration: 0.4, // Longer fade out for more natural disappearance
            ease: "power2.out",
            onComplete: () => {
              // Extremely varied delay between appearances (5-25 seconds)
              setTimeout(animateStar, 5000 + Math.random() * 20000);
            }
          }, "-=0.5"); // Larger overlap to start fading before reaching destination
      };

      // Start the animation with initial staggered delay
      setTimeout(animateStar, initialDelay * 1000);
    };

    // Start several shooting stars with staggered delays for natural effect
    animateShootingStar("#shooting-star-1", 2 + Math.random() * 5);
    animateShootingStar("#shooting-star-2", 8 + Math.random() * 5);
  }

  useEffect(() => {
    // Initialize star twinkling
    const stars = Array.from(document.querySelectorAll('.twinkling-star')) as SVGElement[]
    initStarTwinkling(stars)

    // Setup parallax scrolling for space background elements
    initSpaceParallax()

    // Initialize shooting stars
    initShootingStars()

    return () => {
      const { ScrollTrigger } = require('@/lib/gsap')
      ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
    }
  }, [])

  // Create a reference callback for stars
  const addStarRef = (el: SVGCircleElement | null) => {
    if (el && !starsRef.current.includes(el)) {
      starsRef.current.push(el)
    }
  }

  return (
    <>
      {/* Scroll Element for triggering animations */}
      <div ref={scrollElementRef} className="scrollElement absolute top-0 left-0 w-full h-[600vh] z-0"></div>

      {/* Space-themed SVG Background Animation */}
      <svg
        ref={svgRef}
        className="fixed top-0 left-0 w-full h-screen z-0"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Definitions for gradients and filters */}
        <defs>
          {/* Space background gradient */}
          <linearGradient id="space-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#070B24" />
            <stop offset="50%" stopColor="#0F1631" />
            <stop offset="100%" stopColor="#131C45" />
          </linearGradient>

          {/* Nebula gradients */}
          <radialGradient id="nebula-grad-1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#375BD2" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#375BD2" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="nebula-grad-2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#8A63D2" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8A63D2" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="nebula-grad-3" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#5A43B5" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#5A43B5" stopOpacity="0" />
          </radialGradient>

          {/* Glow filter for stars */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Star filter */}
          <filter id="star-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
            <feColorMatrix type="matrix" values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 0.7 0" />
          </filter>
        </defs>

        {/* Main space background */}
        <rect id="space-bg" width="100%" height="100%" fill="url(#space-gradient)" />

        {/* Distant Stars Layer */}
        <g id="stars-distant">
          {distantStars.map(star => (
            <circle
              key={`distant-star-${star.id}`}
              ref={addStarRef}
              className="twinkling-star"
              cx={star.cx}
              cy={star.cy}
              r={star.r}
              fill="white"
              opacity={star.opacity}
            />
          ))}
        </g>

        {/* Nebulae / Cosmic Clouds */}
        <g id="nebulae">
          <circle id="nebula-1" cx="300" cy="300" r="250" fill="url(#nebula-grad-1)" opacity="0.6" />
          <circle id="nebula-2" cx="1600" cy="400" r="300" fill="url(#nebula-grad-2)" opacity="0.5" />
          <circle id="nebula-3" cx="900" cy="800" r="400" fill="url(#nebula-grad-3)" opacity="0.4" />
        </g>

        {/* Mid-distance Stars */}
        <g id="stars-mid">
          {midStars.map(star => (
            <circle
              key={`mid-star-${star.id}`}
              ref={addStarRef}
              className="twinkling-star"
              cx={star.cx}
              cy={star.cy}
              r={star.r}
              fill="white"
              opacity={star.opacity}
              filter={star.filter ? `url(#${star.filter})` : undefined}
            />
          ))}
        </g>

        {/* Foreground Stars */}
        <g id="stars-foreground">
          {foregroundStars.map(star => (
            <circle
              key={`fg-star-${star.id}`}
              ref={addStarRef}
              className="twinkling-star"
              cx={star.cx}
              cy={star.cy}
              r={star.r}
              fill="white"
              opacity={star.opacity}
              filter={star.filter ? `url(#${star.filter})` : undefined}
            />
          ))}
        </g>

        {/* Planets */}
        <g id="planets">
          <circle id="planet-1" cx="250" cy="650" r="40" fill="#5D4A8C" opacity="0.8" />
          <circle id="planet-2" cx="1700" cy="350" r="60" fill="#7F5DA2" opacity="0.8" />
        </g>

        {/* Shooting Stars */}
        <g id="shooting-stars">
          <line
            id="shooting-star-1"
            x1="0" y1="0"
            x2="30" y2="0"
            stroke="white"
            strokeWidth="1"
            opacity="0"
            strokeLinecap="round"
            filter="url(#star-glow)"
          />
          <line
            id="shooting-star-2"
            x1="0" y1="0"
            x2="25" y2="0"
            stroke="white"
            strokeWidth="1"
            opacity="0"
            strokeLinecap="round"
            filter="url(#star-glow)"
          />
        </g>
      </svg>
    </>
  )
}
