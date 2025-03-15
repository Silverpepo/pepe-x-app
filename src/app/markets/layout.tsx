import Image from 'next/image'
import { fontMono } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import MainNav from '@/components/main-nav'
import MobileNav from '@/components/mobile-nav'
import MobileBetSlip from '@/components/mobile-bet-slip'
import MobileConnectWallet from '@/components/mobile-connect-wallet'
import MobileWalletAlert from '@/components/mobile-wallet-alert'
import SearchBar from '@/components/search-bar'
import PredictionSlip from '@/components/prediction-slip'

export const metadata = {
  title: 'Markets - Pepe-X',
}

export default function MarketsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container flex min-h-[100dvh] flex-row px-0">
      <div className="hidden h-[100dvh] justify-between border-r border-r-border p-4 md:flex md:w-[260px] md:shrink-0 md:flex-col">
        <MainNav />
      </div>
      <main className="max-w-[100vw] flex-1">
        <div className="flex h-16 items-center justify-between border-b border-b-border p-4 md:hidden">
          <MobileNav />
          <Image src="/illustrations/pepecloud.gif" width={65} height={75} alt="pepe cloud" className='ml-12' />
          <div className="flex space-x-6">
            <MobileConnectWallet />
            <MobileBetSlip />
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
            Matches
          </h1>
          <div className="flex h-full items-center">
            <SearchBar />
          </div>
        </div>
        {children}
      </main>
      <div className="hidden border-l border-l-border md:flex md:w-[440px] md:flex-col">
        <PredictionSlip />
      </div>
    </div>
  )
}