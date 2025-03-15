'use client'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { Loader2 } from 'lucide-react'
import { useLocalStateContext } from '@/app/context'
import { useAuctionStateContext } from '@/app/auction/auction-context'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle } from '@/components/ui/alert'
import Image from 'next/image'
import { useWaitForTransaction } from 'wagmi'
import { dutchAuctionAddress } from '@/config/contract'

import {
  usePepoDutchAuctionContribute,
  usePepoDutchAuctionAuctionEnded
} from '@/generated'

type PlaceBidButtonProps = {
  bidAmount?: string;
  estimatedTokens?: string;
  className?: string;
  refetchUserInfo?: () => void;
  refetchDistributionInfo?: () => void;
}

export default function PlaceBidButton({
  bidAmount,
  estimatedTokens,
  className = '',
  refetchUserInfo,
  refetchDistributionInfo
}: PlaceBidButtonProps) {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined)
  const [currentStep, setCurrentStep] = useState<string>("idle")
  const { setTab } = useLocalStateContext()
  const { auctionBid, clearAuctionBid } = useAuctionStateContext()
  
  const { data: isAuctionEnded } = usePepoDutchAuctionAuctionEnded({
    address: dutchAuctionAddress
  })
  
  // Reset errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Contribute to the auction
  const { writeAsync: contribute, error: contributeError } = usePepoDutchAuctionContribute({
    address: dutchAuctionAddress
  })
  
  // Wait for transaction
  const { isLoading: txLoading, isSuccess } = useWaitForTransaction({
    hash: txHash,
    onSuccess: () => {
      setIsLoading(false)
      setCurrentStep("idle")
      clearAuctionBid()
      
      // Refresh contract data before switching to the My Tokens tab
      if (refetchUserInfo) refetchUserInfo()
      if (refetchDistributionInfo) refetchDistributionInfo()
      
      // Switch to My Tokens tab
      setTab('my-predictions')
    }
  })

  // Handle errors
  useEffect(() => {
    if (contributeError) {
      setError(`Failed to participate: ${contributeError.message}`)
      setIsLoading(false)
      setCurrentStep("idle")
    }
  }, [contributeError])

  // Handle bid placement
  const placeBid = async () => {
    // Use bid amount from props or context
    const effectiveBidAmount = bidAmount || (auctionBid?.amount.toString() || '0.1')
    
    setError(null)
    setTxHash(undefined)
    setCurrentStep("starting")
    
    if (!effectiveBidAmount || parseFloat(effectiveBidAmount) <= 0) {
      setError('Please enter a valid bid amount')
      setCurrentStep("idle")
      return
    }
    
    if (isAuctionEnded) {
      setError('Auction has ended')
      setCurrentStep("idle")
      return
    }
    
    setIsLoading(true)
    try {
      setCurrentStep("bidding")
      console.log(`Placing bid with ${effectiveBidAmount} ETH`)
      
      const bidTx = await contribute({
        value: parseEther(effectiveBidAmount),
      })
      
      setTxHash(bidTx.hash)
      console.log("Bid transaction submitted:", bidTx.hash)
      setCurrentStep("waiting_for_confirmation")
      
    } catch (error: any) {
      console.error("Bid error:", error)
      setError(`Bid failed: ${error.message || 'Unknown error'}`)
      setIsLoading(false)
      setCurrentStep("idle")
    }
  }

  // Get button text based on current state
  const getButtonText = () => {
    if (!isLoading) {
      return auctionBid
        ? `Place Bid at ${auctionBid.currentPrice.toFixed(4)} ETH`
        : 'Place Bid'
    }
    switch (currentStep) {
      case "starting":
        return "Starting..."
      case "bidding":
        return "Placing Bid..."
      case "waiting_for_confirmation":
        return "Waiting for Confirmation..."
      default:
        return "Processing..."
    }
  }

  // Display text below the button
  const getButtonSubText = () => {
    const tokens = estimatedTokens || auctionBid?.estimatedTokens.toFixed(4)
    if (tokens && !error) {
      return `You'll receive approximately ${tokens} PEPO tokens`
    }
    return null
  }

  return (
    <>
      <Button
        disabled={isLoading || txLoading}
        onClick={async () => await placeBid()}
        className={`w-full bg-[#375BD2] text-sm md:text-base font-black leading-4 text-foreground hover:bg-[#375BD2]/90 ${className}`}
      >
        {isLoading || txLoading ? (
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
        ) : null}
        {getButtonText()}
      </Button>
      
      {getButtonSubText() && (
        <p className="text-xs text-center text-secondary-foreground mt-2">
          {getButtonSubText()}
        </p>
      )}
      
      {error ? (
        <Alert
          variant="destructive"
          className="mt-4 mb-4 flex items-center space-x-4 border-0 bg-[#FCCDCD] text-[#DE2624]"
        >
          <Image src="/alert-diamond.svg" width={24} height={24} alt="alert" />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      ) : null}
      
      {txHash && !error ? (
        <Alert className="mt-4 mb-4 flex items-center space-x-4 border-0 bg-green-100 text-green-800">
          <AlertTitle>Transaction submitted! <a
            href={`https://sepolia.basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            View on BaseScan
          </a></AlertTitle>
        </Alert>
      ) : null}
    </>
  )
}
