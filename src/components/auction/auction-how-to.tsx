'use client'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function AuctionHowTo() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="auction-howto">
        <AccordionTrigger>
          <div className="flex items-center space-x-[6px] text-base font-bold leading-4">
            <Image src="/info.svg" width={16} height={16} alt="info" />
            <span>How to Participate</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <p className="font-medium text-foreground">1. Dutch Auction Basics</p>
              <div className="space-y-1.5 pl-4">
                <p className="flex items-center">
                  <span className="mr-2 text-xs">•</span>
                  Price starts high and decreases over time
                </p>
                <p className="flex items-center">
                  <span className="mr-2 text-xs">•</span>
                  Buy tokens at a price you're comfortable with
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">2. Place Your Bid</p>
              <div className="space-y-1.5 pl-4">
                <p className="flex items-center">
                  <span className="mr-2 text-xs">•</span>
                  Enter ETH amount you want to contribute
                </p>
                <p className="flex items-center">
                  <span className="mr-2 text-xs">•</span>
                  Click "Place Bid" to confirm your participation
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">3. Token Distribution</p>
              <div className="space-y-1.5 pl-4">
                <p className="flex items-center">
                  <span className="mr-2 text-xs">•</span>
                  50% of tokens unlocked immediately after auction
                </p>
                <p className="flex items-center">
                  <span className="mr-2 text-xs">•</span>
                  50% vest linearly over 6 months
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">4. Claim Tokens</p>
              <div className="space-y-1.5 pl-4">
                <p className="flex items-center">
                  <span className="mr-2 text-xs">•</span>
                  Track token vesting in "My Tokens" tab
                </p>
                <p className="flex items-center">
                  <span className="mr-2 text-xs">•</span>
                  Claim unlocked and vested tokens as they become available
                </p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
