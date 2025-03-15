'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import AuctionHowTo from './auction/auction-how-to'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useAuctionStateContext } from '@/app/auction/auction-context'

// This component represents the actual content inside the mobile navigation sheet
export function MobileNavContent() {
  const pathname = usePathname()
  const router = useRouter()
  const { clearAuctionBid } = useAuctionStateContext()
  const isAuctionPage = pathname?.includes('/auction')
  
  // Handle navigation click - this ensures the sheet closes and state is cleared properly
  const handleNavClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    
    // If navigating away from auction page, clear auction state
    if (pathname?.includes('/auction') && !href.includes('/auction')) {
      clearAuctionBid()
    }
    
    // Navigate to the new route
    router.push(href)
  }

  return (
    <div className="mt-4 px-2">
      <nav className="mb-6 pb-6">
        <ul className="space-y-2">
          <li>
            <a
              href="/"
              onClick={handleNavClick('/')}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-secondary/50 transition-colors",
                pathname === '/' ? 'bg-secondary' : 'text-muted-foreground'
              )}
            >
              <svg 
                className="mr-2 h-4 w-4" 
                fill="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2.1L1 12h3v10h7v-6h2v6h7v-10h3L12 2.1zm0 2.691l6 5.4V20h-3v-6H9v6H6v-9.809l6-5.4z"/>
              </svg>
              Home
            </a>
          </li>
          <li>
            <a
              href="/markets"
              onClick={handleNavClick('/markets')}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-secondary/50 transition-colors",
                pathname?.includes('/markets') ? 'bg-secondary' : 'text-muted-foreground'
              )}
            >
              <Image
                src="/markets-icon.svg"
                alt="Markets"
                width={16}
                height={16}
                className="mr-2 invert"
              />
              Markets
            </a>
          </li>
          <li>
            <a
              href="/auction"
              onClick={handleNavClick('/auction')}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-secondary/50 transition-colors",
                pathname?.includes('/auction') ? 'bg-secondary' : 'text-muted-foreground'
              )}
            >
              <Image
                src="/auction-icon.svg"
                alt="Token Auction"
                width={16}
                height={16}
                className="mr-2"
              />
              Token Auction
            </a>
          </li>
          <li>
            <a
              href="/presale"
              onClick={handleNavClick('/presale')}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-secondary/50 transition-colors",
                pathname?.includes('/presale') ? 'bg-secondary' : 'text-muted-foreground'
              )}
            >
              Token Presale
            </a>
          </li>
        </ul>
      </nav>
      
      {/* Show appropriate how-to based on the current page */}
      {isAuctionPage ? (
        <AuctionHowTo />
      ) : (
        <Accordion type="single" collapsible>
          <AccordionItem value="disclaimer">
            <AccordionTrigger>
              <div className="flex items-center space-x-[6px] text-base font-bold leading-4">
                <Image src="/info.svg" width={16} height={16} alt="info" />
                <span>How to</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <p className="font-medium text-foreground">1. Choose your entry</p>
                  <div className="space-y-1.5 pl-4">
                    <p className="flex items-center">
                      <span className="mr-2 text-xs">•</span>
                      Join an active prediction window
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2 text-xs">•</span>
                      Wait for window lock at halfway point
                    </p>
                  </div>
                </div>
                {/* Rest of the how-to content */}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  )
}
