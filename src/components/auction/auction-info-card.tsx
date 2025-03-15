'use client'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Info, Timer, AlertCircle, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import { formatNumber } from '@/lib/formatting'
import { useLocalStateContext } from '@/app/context'
import { dutchAuctionAddress } from '@/config/contract'

import {
  usePepoDutchAuctionGetAuctionInfo,
  usePepoDutchAuctionGetTimeRemaining,
  usePepoDutchAuctionGetCurrentPrice,
  usePepoDutchAuctionTokensForSale,
  usePepoDutchAuctionTokensSold,
  usePepoDutchAuctionAuctionEnded,
  usePepoDutchAuctionGetUserInfo,
  usePepoDutchAuctionGetVestingProgress,
  usePepoDutchAuctionGetParticipantCount
} from '@/generated'
import PlaceBidButton from '@/components/auction/place-bid-button'

interface AuctionInfoCardProps {
  className?: string;
}

export default function AuctionInfoCard({ className = '' }: AuctionInfoCardProps) {
  const { address, isConnected } = useAccount()
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { setTab } = useLocalStateContext()

  // Get auction information
  const { data: auctionInfo, isLoading: auctionInfoLoading, refetch: refetchAuctionInfo } = 
    usePepoDutchAuctionGetAuctionInfo({
      address: dutchAuctionAddress
    })
  const { data: timeRemainingData } = usePepoDutchAuctionGetTimeRemaining({
    address: dutchAuctionAddress
  })
  const { data: currentPrice, isLoading: priceLoading } = usePepoDutchAuctionGetCurrentPrice({
    address: dutchAuctionAddress
  })
  const { data: tokensForSale } = usePepoDutchAuctionTokensForSale({
    address: dutchAuctionAddress
  })
  const { data: tokensSold } = usePepoDutchAuctionTokensSold({
    address: dutchAuctionAddress
  })
  const { data: isAuctionEnded } = usePepoDutchAuctionAuctionEnded({
    address: dutchAuctionAddress
  })
  const { data: userInfo } = usePepoDutchAuctionGetUserInfo({
    address: dutchAuctionAddress,
    args: address ? [address] : undefined,
    enabled: isConnected && !!address
  })
  const { data: vestingProgress } = usePepoDutchAuctionGetVestingProgress({
    address: dutchAuctionAddress
  })
  const { data: participantCount } = usePepoDutchAuctionGetParticipantCount({
    address: dutchAuctionAddress
  })

  // Format auction data
  const isActive = auctionInfo?.isEnded === false
  const progress = tokensSold && tokensForSale 
    ? Math.floor((Number(tokensSold) / Number(tokensForSale)) * 100) 
    : 0
  const formattedTokensForSale = tokensForSale ? parseInt(formatEther(tokensForSale)).toString() : '0'
  const formattedTokensSold = tokensSold ? formatEther(tokensSold) : '0'
  const formattedCurrentPrice = currentPrice ? formatEther(currentPrice) : '0'
  const tokensRemaining = tokensForSale && tokensSold
    ? Number(tokensForSale) - Number(tokensSold)
    : 0
  const formattedTokensRemaining = formatEther(BigInt(tokensRemaining))
  const userHasParticipated = userInfo?.hasParticipated || false
  const userTotalAllocation = userInfo?.totalAllocation ? formatEther(userInfo.totalAllocation) : '0'
  const userContribution = userInfo?.contribution ? formatEther(userInfo.contribution) : '0'
  // When using tuple return values from the contract, we need to access by index
  // percentComplete is at index 0, isActive is at index 2
  const vestingPercentComplete = vestingProgress ? Number(vestingProgress[0]) : 0
  const isVestingActive = vestingProgress ? Boolean(vestingProgress[2]) : false

  // Timer for auction countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Format remaining time
  useEffect(() => {
    if (timeRemainingData) {
      const seconds = Number(timeRemainingData)
      if (seconds <= 0) {
        setTimeRemaining('Ended')
        return
      }
      
      const days = Math.floor(seconds / 86400)
      const hours = Math.floor((seconds % 86400) / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const remainingSeconds = seconds % 60
      
      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m ${remainingSeconds}s`)
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${remainingSeconds}s`)
      } else {
        setTimeRemaining(`${minutes}m ${remainingSeconds}s`)
      }
    }
  }, [timeRemainingData, refreshTrigger])

  // Refresh auction data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refetchAuctionInfo()
    }, 15000)
    return () => clearInterval(interval)
  }, [refetchAuctionInfo])

  if (auctionInfoLoading) {
    return <div className="flex justify-center items-center h-40">Loading auction data...</div>
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <CardTitle className="text-xl mb-2 md:mb-0">
            <div className="flex items-center space-x-2">
              <Image src="/tokens/PEPO.svg" width={24} height={24} alt="PEPO" />
              <span>PEPO Token Auction</span>
            </div>
          </CardTitle>
          <div className="flex items-center px-3 py-1 bg-secondary rounded-full">
            <Timer className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">{timeRemaining}</span>
          </div>
        </div>
        <CardDescription>
          Dutch auction: price decreases over time until all tokens are sold
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          <div className="flex flex-col h-full justify-between">
            <div className="text-sm text-secondary-foreground">Current Price</div>
            <div className="text-xl md:text-2xl font-bold">
              {priceLoading ? (
                "Loading..."
              ) : (
                `${formatNumber(parseFloat(formattedCurrentPrice))} ETH`
              )}
            </div>
            <div className="text-xs text-secondary-foreground">
              per PEPO token
            </div>
          </div>
          <div className="flex flex-col h-full justify-between">
            <div className="text-sm text-secondary-foreground">Tokens Sold</div>
            <div className="flex items-baseline">
              <div className="text-xl md:text-2xl font-bold">{formatNumber(parseFloat(formattedTokensSold))}</div>
              <div className="text-secondary-foreground mx-1">/</div>
              <div className="text-secondary-foreground">{formatNumber(parseFloat(formattedTokensForSale), 0)}</div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="flex flex-col h-full justify-between sm:col-span-2 md:col-span-1">
            <div className="text-sm text-secondary-foreground">Participants</div>
            <div className="text-xl md:text-2xl font-bold">{participantCount?.toString() || '0'}</div>
            <div className="text-xs text-secondary-foreground">
              Total bidders in the auction
            </div>
          </div>
        </div>

        {/* Auction details */}
        <div className="bg-secondary/30 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 mt-0.5 text-secondary-foreground" />
            <div className="w-full">
              <h4 className="font-semibold mb-2">Auction Details</h4>
              <ul className="space-y-2 text-sm text-secondary-foreground">
                <li className="flex justify-between">
                  <span>Starting Price:</span>
                  <span className="font-medium">{auctionInfo?.maxPrice ? formatNumber(parseFloat(formatEther(auctionInfo.maxPrice))) : '0.0000'} ETH</span>
                </li>
                <li className="flex justify-between">
                  <span>Minimum Price:</span>
                  <span className="font-medium">{auctionInfo?.minPrice ? formatNumber(parseFloat(formatEther(auctionInfo.minPrice))) : '0.0000'} ETH</span>
                </li>
                <li className="flex justify-between">
                  <span>Tokens Remaining:</span>
                  <span className="font-medium">{formatNumber(parseFloat(formattedTokensRemaining))} PEPO</span>
                </li>
                <li className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-medium ${isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {isActive ? 'Active' : 'Ended'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Vesting information if user has participated */}
        {userHasParticipated && (
          <div className="bg-secondary/30 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 mt-0.5 text-green-400" />
              <div className="w-full">
                <h4 className="font-semibold mb-2">Your Participation</h4>
                <ul className="space-y-2 text-sm text-secondary-foreground mb-3">
                  <li className="flex justify-between">
                    <span>Total Contribution:</span>
                    <span className="font-medium">{formatNumber(parseFloat(userContribution))} ETH</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Token Allocation:</span>
                    <span className="font-medium">{formatNumber(parseFloat(userTotalAllocation))} PEPO</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Vesting Status:</span>
                    <span className={`font-medium ${isVestingActive ? 'text-green-400' : 'text-secondary-foreground'}`}>
                      {isVestingActive ? 'Active' : 'Not Started'}
                    </span>
                  </li>
                </ul>
                {isVestingActive && (
                  <>
                    <div className="flex justify-between text-xs text-secondary-foreground mb-1">
                      <span>Vesting Progress</span>
                      <span>{vestingPercentComplete}%</span>
                    </div>
                    <Progress value={vestingPercentComplete} className="h-2 mb-3" />
                  </>
                )}
                <Button 
                  className="w-full bg-[#375BD2] hover:bg-[#375BD2]/90 text-sm md:text-base"
                  onClick={() => setTab('my-predictions')}
                >
                  View All Details
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Warning for non-connected users */}
        {!isConnected && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connect Wallet</AlertTitle>
            <AlertDescription>
              Please connect your wallet to participate in the auction
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}