"use client"
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter, useSelectedLayoutSegment } from 'next/navigation'
import { SocialIcon } from 'react-social-icons'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import UserBalance from '@/components/user-balance'
import { ScrollArea } from './ui/scroll-area'
import AuctionHowTo from './auction/auction-how-to'
import { useAuctionStateContext } from '@/app/auction/auction-context'
import { useCallback } from 'react'

export default function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const segment = useSelectedLayoutSegment()
  const isAuctionPage = pathname?.includes('/auction')
  const { clearAuctionBid } = useAuctionStateContext()
  
  // Handle navigation links when coming from auction page
  const handleNavigation = useCallback((e: React.MouseEvent, href: string) => {
    // Only need special handling when navigating away from auction page
    if (isAuctionPage && !href.includes('/auction')) {
      e.preventDefault()
      clearAuctionBid()
      router.push(href)
    }
    // For other cases, let the Link component handle navigation normally
  }, [isAuctionPage, clearAuctionBid, router])
  
  return (
    <ScrollArea className="h-[100dvh]">
      <div className="flex h-[calc(100dvh-104px)] flex-1 flex-col justify-between px-4 pb-4 md:h-[calc(100vh-32px)] md:px-0 md:pb-0">
        <div className="border-b border-b-border pb-6">
          <Link
            href="/"
            prefetch={true}
            onClick={(e) => handleNavigation(e, "/")}
          >
            <Image
              src="/illustrations/pepe-astronaut.png"
              width={155}
              height={48}
              alt="pepe-astronaut"
              className="mx-auto mt-1 block w-32 md:w-[155px]"
            />
          </Link>
          <div className="flex justify-center border-b border-b-border py-6">
            <UserBalance />
          </div>
          
          <nav className="mt-6 mb-6 border-b border-b-border pb-6">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  prefetch={true}
                  onClick={(e) => handleNavigation(e, "/")}
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
                </Link>
              </li>
              <li>
                <Link
                  href="/markets"
                  prefetch={true}
                  onClick={(e) => handleNavigation(e, "/markets")}
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
                    className="mr-2"
                  />
                  Markets
                </Link>
              </li>
              <li>
                <Link
                  href="/auction"
                  prefetch={true}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-secondary/50 transition-colors",
                    pathname?.includes('/auction') ? 'bg-secondary' : 'text-muted-foreground'
                  )}
                >
                  <Image
                    src="/auction-icon.svg"
                    alt="Token Auction"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Token Auction
                </Link>
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
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">2. Make your prediction</p>
                      <div className="space-y-1.5 pl-4">
                        <p className="flex items-center">
                          <span className="mr-2 text-xs">•</span>
                          Predict UP or DOWN price movement
                        </p>
                        <p className="flex items-center">
                          <span className="mr-2 text-xs">•</span>
                          Place your bet using PEPO tokens
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">3. Window Resolution</p>
                      <div className="space-y-1.5 pl-4">
                        <p className="flex items-center">
                          <span className="mr-2 text-xs">•</span>
                          Window locks at halfway point
                        </p>
                        <p className="flex items-center">
                          <span className="mr-2 text-xs">•</span>
                          Final price checked at window close
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">4. Claim Rewards</p>
                      <div className="space-y-1.5 pl-4">
                        <p className="flex items-center">
                          <span className="mr-2 text-xs">•</span>
                          Winners can claim after window closes
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          
          <div className="mt-4 flex flex-row justify-center gap-4">
            <SocialIcon
              url="https://twitter.com/pepe_xtrad"
              bgColor="transparent"
              fgColor="white"
              className="hover:scale-110 transition-transform"
              style={{ width: 40, height: 40 }}
            />
            <SocialIcon
              url="https://discord.gg/9zVFrWTDbX"
              bgColor="transparent"
              fgColor="white"
              className="hover:scale-110 transition-transform"
              style={{ width: 40, height: 40 }}
            />
            <SocialIcon
              url="https://telegram.com/"
              bgColor="transparent"
              fgColor="white"
              className="hover:scale-110 transition-transform"
              style={{ width: 40, height: 40 }}
            />
            <SocialIcon
              url="https://github.com/"
              bgColor="transparent"
              fgColor="white"
              className="hover:scale-110 transition-transform"
              style={{ width: 40, height: 40 }}
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
