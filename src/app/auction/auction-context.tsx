'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// Define the auction bid type locally to avoid modifying types.ts
type AuctionBid = {
  amount: number
  estimatedTokens: number
  currentPrice: number
  timestamp: number
}

export const AuctionStateContext = createContext<{
  auctionBid: AuctionBid | null
  auctionError: string
  setAuctionBid: (bid: AuctionBid | null) => void
  clearAuctionBid: () => void
}>({
  auctionBid: null,
  auctionError: '',
  setAuctionBid: () => null,
  clearAuctionBid: () => null,
})

export const AuctionStateProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  // Auction state
  const [auctionBid, setAuctionBidState] = useState<AuctionBid | null>(null)
  const [auctionError, setAuctionError] = useState('')
  const pathname = usePathname()
  const router = useRouter()

  // Reset auction state when navigating away
  useEffect(() => {
    const handleRouteChange = () => {
      if (!pathname?.includes('/auction')) {
        setAuctionBidState(null)
        setAuctionError('')
      }
    }
    
    handleRouteChange()
    
    // This runs when the component unmounts or pathname changes
    return () => {
      if (auctionBid !== null) {
        setAuctionBidState(null)
      }
    }
  }, [pathname, auctionBid])

  // Auction handlers
  const setAuctionBid = useCallback((bid: AuctionBid | null) => {
    setAuctionBidState(bid)
  }, [])

  const clearAuctionBid = useCallback(() => {
    setAuctionBidState(null)
  }, [])

  return (
    <AuctionStateContext.Provider
      value={{ 
        auctionBid,
        auctionError, 
        setAuctionBid,
        clearAuctionBid
      }}
    >
      {children}
    </AuctionStateContext.Provider>
  )
}

export const useAuctionStateContext = () => useContext(AuctionStateContext)
