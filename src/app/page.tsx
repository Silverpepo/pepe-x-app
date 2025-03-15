'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { fontMono } from '@/lib/fonts'
import { SocialIcon } from 'react-social-icons'
import { ScrollTrigger } from '@/lib/gsap'
import { initMouseMoveEffect, initStaggerReveal } from '@/utils/animation'
import SpaceBackground from '@/components/landing/SpaceBackground'
import FeatureCard from '@/components/landing/FeatureCard'
import StepItem from '@/components/landing/StepItem'
import RoadmapItem from '@/components/landing/RoadmapItem'
import CtaSection from '@/components/landing/CtaSection'

export default function LandingPage() {
  // Create refs for animation elements
  const scrollElementRef = useRef<HTMLDivElement>(null)
  const floatingOrbsRef = useRef<HTMLDivElement[]>([])

  /**
   * Initialize all animations for the landing page
   */
  useEffect(() => {
    const initAnimations = () => {
      // Reset any previous ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())

      // Apply mouse movement to floating orbs
      const orbElements = floatingOrbsRef.current.filter(el => el !== null) as HTMLElement[]
      const cleanupMouseEffect = initMouseMoveEffect(orbElements)

      // Initialize staggered reveal animations for all content sections
      initRevealAnimations()

      // Reset scrollbar position after refresh
      window.onbeforeunload = () => window.scrollTo(0, 0)

      // Return cleanup function
      return () => {
        if (cleanupMouseEffect) cleanupMouseEffect()
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        window.onbeforeunload = null
      }
    }

    // Initialize all animations
    return initAnimations()
  }, [])

  /**
   * Initialize staggered reveal animations for all content sections
   */
  const initRevealAnimations = () => {
    // Feature cards reveal
    initStaggerReveal('.feature-card', {
      trigger: '.features-section',
      start: 'top 70%',
      end: 'center center',
      stagger: 0.2
    })

    // How it works steps reveal
    initStaggerReveal('.step-item', {
      trigger: '.how-it-works-section',
      start: 'top 70%',
      end: 'center center',
      stagger: 0.2,
      y: 80
    })

    // Tokenomics cards reveal
    initStaggerReveal('.tokenomics-card', {
      trigger: '.tokenomics-section',
      start: 'top 70%',
      stagger: 0.2
    })

    // Roadmap items reveal
    initStaggerReveal('.roadmap-item', {
      trigger: '.roadmap-section',
      start: 'top 70%',
      stagger: 0.2,
      y: 30
    })
  }

  return (
    <>
      <div className="relative w-full overflow-hidden bg-[#070B24]">
        {/* Space background component */}
        <SpaceBackground scrollElementRef={scrollElementRef} />

        {/* Floating Orbs */}
        <div
          ref={el => {
            if (el) floatingOrbsRef.current[0] = el
          }}
          className="floating-orb absolute pointer-events-none z-[5] w-32 h-32 rounded-full bg-[#375BD2]/10 blur-xl"
          style={{ top: '20%', left: '10%' }}
        />
        <div
          ref={el => {
            if (el) floatingOrbsRef.current[1] = el
          }}
          className="floating-orb absolute pointer-events-none z-[5] w-48 h-48 rounded-full bg-[#8A63D2]/10 blur-xl"
          style={{ top: '60%', right: '15%' }}
        />
        <div
          ref={el => {
            if (el) floatingOrbsRef.current[2] = el
          }}
          className="floating-orb absolute pointer-events-none z-[5] w-40 h-40 rounded-full bg-[#5A43B5]/10 blur-xl"
          style={{ top: '40%', left: '60%' }}
        />

        {/* Content Sections */}
        <div className="relative z-10">
          {/* Hero Section */}
          <section className="min-h-screen flex items-center justify-center px-4">
            <div className="hero-content animate-float container mx-auto text-center">
              <div className="image-container relative inline-block mb-8">
                <div className="astro-pulse overflow-hidden">
                  <Image
                    src="/illustrations/pepe-astronaut.png"
                    width={200}
                    height={200}
                    alt={siteConfig.name}
                    className="mx-auto max-w-[180px]"
                    priority
                  />
                </div>
              </div>

              <h1 className={cn(
                "text-5xl font-black tracking-tighter font-mono mb-4 text-white glow-no-blur",
                fontMono.variable
              )}>
                PEPE-X
              </h1>

              <div className="max-w-xs mx-auto">
                <Link
                  href="/markets"
                  className="w-full block py-4 bg-[#375BD2] rounded-md text-center font-bold text-white hover:bg-[#375BD2]/90 transition-all hover:scale-105 shadow-[0_0_15px_rgba(55,91,210,0.5)]"
                >
                  Launch App
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center gap-1 text-xs text-blue-100/60">
                <span>Automation and price feed powered by</span>
                <Image
                  src="/powered-by-chainlink.svg"
                  width={80}
                  height={20}
                  alt="Powered by Chainlink"
                  className="ml-1"
                />
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="features-section min-h-screen flex items-center justify-center px-4">
            <div className="container mx-auto py-20">
              <h2 className={cn(
                "text-4xl font-bold tracking-tighter font-mono text-center mb-16 text-white",
                fontMono.variable
              )}>
                Our Features
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" style={{ opacity: 1 }}>
                {/* Feature Cards */}
                <FeatureCard
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="m2 15 6-6 9 9 3-3"></path>
                    </svg>
                  }
                  title="Market Plays"
                  description="Act on market trends and earn rewards when you make the right moves."
                />

                <FeatureCard
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M12 2v20"></path>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  }
                  title="Real-time Data"
                  description="Access real-time Chainlink oracle price feeds for accurate predictions."
                />

                <FeatureCard
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="10"></rect>
                      <rect x="3" y="7" width="18" height="4"></rect>
                      <line x1="12" y1="7" x2="12" y2="21"></line>
                      <path d="M12 7C12 4.5 9 3.5 7 5.5C5 7.5 8 9 12 7"></path>
                      <path d="M12 7C12 4.5 15 3.5 17 5.5C19 7.5 16 9 12 7"></path>
                      <circle cx="12" cy="6" r="1"></circle>
                      <path d="M10 6.5C9 7.5 8.5 8 8 9"></path>
                      <path d="M14 6.5C15 7.5 15.5 8 16 9"></path>
                    </svg>
                  }
                  title="Secure Rewards"
                  description="Instantly claim your rewards when you win"
                />

                <FeatureCard
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                    </svg>
                  }
                  title="100% On-chain"
                  description="All data is derived from Chainlink feeds and rewards are processed on-chain for full transparency."
                />
              </div>

              {/* about PEPO */}
              <div className="how-it-works-section mt-32">
                <h2 className={cn(
                  "text-4xl font-bold tracking-tighter font-mono text-center mb-16 text-white",
                  fontMono.variable
                )}>
                  About PEPO
                </h2>

                <div className="flex flex-col md:flex-row items-center justify-center space-y-16 md:space-y-0 md:space-x-12">
                  <StepItem
                    number={1}
                    title="Get PEPO Tokens"
                    description="Participate in our Dutch auction to secure your PEPO tokens at a fair price."
                  />

                  <StepItem
                    number={2}
                    title="Join The Community"
                    description="Connect with other PEPO holders and get early access to platform features."
                  />

                  <StepItem
                    number={3}
                    title="Use The Platform"
                    description="Explore our innovative features when we launch and put your PEPO tokens to work."
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Tokenomics & Roadmap Section */}
          <section className="min-h-screen flex items-center justify-center px-4">
            <div className="container mx-auto py-20">
              {/* Tokenomics */}
              <div className="tokenomics-section mb-32">
                <h2 className={cn(
                  "text-4xl font-bold tracking-tighter font-mono text-center mb-16 text-white",
                  fontMono.variable
                )}>
                  Tokenomics
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ opacity: 1 }}>
                  {/* Metric 1 */}
                  <div className="tokenomics-card flex flex-col items-center rounded-xl bg-[#131C45]/50 p-8 backdrop-blur-sm border border-[#375BD2]/20 hover:shadow-[0_0_15px_rgba(55,91,210,0.3)] transition-all">
                    <div className="mb-4 text-4xl font-bold text-[#375BD2]">70%</div>
                    <h3 className="text-xl font-medium text-white">Rewards Pool</h3>
                    <p className="mt-2 text-center text-sm text-blue-100/70">Allocated to prediction winners</p>
                  </div>

                  {/* Metric 2 */}
                  <div className="tokenomics-card flex flex-col items-center rounded-xl bg-[#131C45]/50 p-8 backdrop-blur-sm border border-[#375BD2]/20 hover:shadow-[0_0_15px_rgba(55,91,210,0.3)] transition-all">
                    <div className="mb-4 text-4xl font-bold text-[#375BD2]">25%</div>
                    <h3 className="text-xl font-medium text-white">Community Treasury</h3>
                    <p className="mt-2 text-center text-sm text-blue-100/70">Community-controlled development fund</p>
                  </div>

                  {/* Metric 3 */}
                  <div className="tokenomics-card flex flex-col items-center rounded-xl bg-[#131C45]/50 p-8 backdrop-blur-sm border border-[#375BD2]/20 hover:shadow-[0_0_15px_rgba(55,91,210,0.3)] transition-all">
                    <div className="mb-4 text-4xl font-bold text-[#375BD2]">5%</div>
                    <h3 className="text-xl font-medium text-white">Platform Fee</h3>
                    <p className="mt-2 text-center text-sm text-blue-100/70">For ongoing development and maintenance</p>
                  </div>
                </div>
              </div>

              {/* Roadmap */}
              <div className="roadmap-section">
                <h2 className={cn(
                  "text-4xl font-bold tracking-tighter font-mono text-center mb-16 text-white",
                  fontMono.variable
                )}>
                  Roadmap
                </h2>

                <div className="relative">
                  {/* Line connecting roadmap items */}
                  <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-[#375BD2]/50 md:w-full md:h-1 md:top-1/2 md:-translate-y-1/2"></div>

                  <div className="grid grid-cols-1 gap-16 md:grid-cols-4" style={{ opacity: 1 }}>
                    <RoadmapItem
                      date="Q2 2025"
                      description="Dutch Auction (30 days) followed by Platform Launch"
                      position="top"
                    />

                    <RoadmapItem
                      date="Q3 2025"
                      description="Initial liquidity provision program and community growth initiatives"
                      position="bottom"
                    />

                    <RoadmapItem
                      date="Q4 2025"
                      description="Gradual addition of Advanced Markets (sports betting, real world events, P2P, and Real-world events)"
                      position="top"
                    />

                    <RoadmapItem
                      date="Q1 2026"
                      description="Multi-Chain Support, Launch of DAO governance that includes P2P bet arbitration capabilities "
                      position="bottom"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section component */}
          <CtaSection
            title="Much Mystery, Very Auction"
            description="The rare PEPO token approaches. Ready your wallets for the upcoming Dutch auction and join our secret Pepe club."
            buttonText="Get in Early, Anon"
            buttonLink="/auction"
          />
        </div>

        {/* Social icons - responsive positioning */}
        <div className="fixed bottom-4 sm:bottom-8 right-0 sm:right-8 flex justify-center sm:justify-end gap-3 sm:gap-4 z-50 w-full sm:w-auto px-4 sm:px-0">
          <SocialIcon
            url="https://twitter.com/pepe_xtrad"
            bgColor="transparent"
            fgColor="white"
            className="hover:scale-110 transition-transform"
            style={{ width: 36, height: 36 }}
          />
          <SocialIcon
            url="https://discord.gg/9zVFrWTDbX"
            bgColor="transparent"
            fgColor="white"
            className="hover:scale-110 transition-transform"
            style={{ width: 36, height: 36 }}
          />
          <SocialIcon
            url="https://telegram.com/"
            bgColor="transparent"
            fgColor="white"
            className="hover:scale-110 transition-transform"
            style={{ width: 36, height: 36 }}
          />
          <SocialIcon
            url="https://github.com/"
            bgColor="transparent"
            fgColor="white"
            className="hover:scale-110 transition-transform"
            style={{ width: 36, height: 36 }}
          />
        </div>

        {/* Scroll Down Indicator */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce opacity-80 pointer-events-none hidden md:block">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>
    </>
  )
}
