import Image from 'next/image'
import { fontMono } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import MainNav from '@/components/main-nav'
import MobileNav from '@/components/mobile-nav'
import MobileConnectWallet from '@/components/mobile-connect-wallet'
import MobileWalletAlert from '@/components/mobile-wallet-alert'
import AuctionBidSlip from '@/components/auction/auction-bid-slip'
import MobileAuctionBidSlip from '@/components/auction/mobile-auction-bid-slip'

export const metadata = {
  title: 'Token Auction - Pepe-X',
  description: 'Participate in the PEPO token Dutch auction',
}

export default function AuctionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container flex min-h-[100dvh] flex-row px-0">
        <div className="hidden h-[100dvh] justify-between border-r border-r-border p-4 md:flex md:w-[260px] md:shrink-0 md:flex-col">
          <div className="flex flex-col justify-between h-full">
            <MainNav />
          </div>
        </div>
        <main className="max-w-[100vw] flex-1">
          <div className="flex h-16 items-center justify-between border-b border-b-border p-4 md:hidden">
            <MobileNav />
            <Image src="/illustrations/pepecloud.gif" width={65} height={75} alt="pepe cloud" className='ml-12' />
            <div className="flex space-x-6">
              <MobileConnectWallet />
              <MobileAuctionBidSlip />
            </div>
          </div>
          <MobileWalletAlert />
          <div className="flex h-16 items-center justify-between border-b border-b-border pl-4">
            <h1
              className={cn(
                'flex-1 font-mono text-xl font-black leading-5',
                fontMono.variable,
              )}
            >
              PEPO Token Auction
            </h1>
          </div>
          {children}
        </main>
        <div className="hidden border-l border-l-border md:flex md:w-[440px] md:flex-col">
          <AuctionBidSlip />
        </div>
      </div>
  )
}
