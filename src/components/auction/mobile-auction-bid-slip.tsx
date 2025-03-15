'use client'
import Image from 'next/image'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import AuctionBidSlip from '@/components/auction/auction-bid-slip'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAuctionStateContext } from '@/app/auction/auction-context'

export default function MobileAuctionBidSlip() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { clearAuctionBid } = useAuctionStateContext()
  
  // Close sheet when navigating away
  useEffect(() => {
    if (!pathname?.includes('/auction') && open) {
      setOpen(false)
      clearAuctionBid()
    }
  }, [pathname, open, clearAuctionBid])
  
  return (
    <Sheet modal={false} open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="relative flex h-6 w-6 items-center justify-center">
          <Image 
            src="/tokens/PEPO.svg" 
            width={24} 
            height={24} 
            alt="auction-slip" 
            className="cursor-pointer"
          />
        </div>
      </SheetTrigger>
      <SheetContent
        size="full"
        position="right"
        className="flex w-screen flex-col border-r border-r-border p-0"
      >
        <div className="flex h-16 items-center justify-center border-b border-b-border p-4">
          <Image
            src="/illustrations/pepecloud.gif"
            width={65}
            height={75}
            alt="pepe cloud"
            className="ml-6"
          />
        </div>
        <AuctionBidSlip />
      </SheetContent>
    </Sheet>
  )
}
