'use client'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { formatNumber } from '@/lib/formatting'
import { dutchAuctionAddress } from '@/config/contract'

import {
  usePepoDutchAuctionClaimTokens,
} from '@/generated'
import { useWaitForTransaction } from 'wagmi'

export default function VestingInfoCard({ distributionInfo }: { distributionInfo: any }) {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined)
  const [claimingUnlocked, setClaimingUnlocked] = useState(false)
  const [claimingVested, setClaimingVested] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!distributionInfo) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <p className="text-secondary-foreground">No distribution data available.</p>
        </CardContent>
      </Card>
    )
  }

  // Extract data from distribution info
  const totalAllocation = distributionInfo.totalAllocation ? formatEther(distributionInfo.totalAllocation) : '0'
  const unlockedAmount = distributionInfo.unlockedAmount ? formatEther(distributionInfo.unlockedAmount) : '0'
  const vestedAmount = distributionInfo.vestedAmount ? formatEther(distributionInfo.vestedAmount) : '0'
  const unlockedClaimed = distributionInfo.unlockedClaimed ? formatEther(distributionInfo.unlockedClaimed) : '0'
  const vestedClaimed = distributionInfo.vestedClaimed ? formatEther(distributionInfo.vestedClaimed) : '0'
  const claimableUnlocked = distributionInfo.claimableUnlocked ? formatEther(distributionInfo.claimableUnlocked) : '0'
  const claimableVested = distributionInfo.claimableVested ? formatEther(distributionInfo.claimableVested) : '0'
  
  // Vesting status
  const vestingStatus = distributionInfo.vestingStatus || {}
  const vestingPercentage = vestingStatus.nextUnlockTime && vestingStatus.totalVested 
    ? Math.min(100, Math.floor((Date.now() / 1000 - Number(vestingStatus.lastClaimTime)) / 
        (Number(vestingStatus.nextUnlockTime) - Number(vestingStatus.lastClaimTime)) * 100))
    : 0

  // Calculate percentages for display
  const unlockedPercentage = (parseFloat(unlockedAmount) / parseFloat(totalAllocation)) * 100
  const vestedPercentage = (parseFloat(vestedAmount) / parseFloat(totalAllocation)) * 100
  const claimableUnlockedNum = parseFloat(claimableUnlocked)
  const claimableVestedNum = parseFloat(claimableVested)
  
  // Contract interactions
  const { writeAsync: claimTokens, error: claimError } = usePepoDutchAuctionClaimTokens({
    address: dutchAuctionAddress
  })
  const { isLoading: txLoading, isSuccess } = useWaitForTransaction({
    hash: txHash,
    onSuccess: () => {
      setSuccess(true)
      setIsLoading(false)
      setClaimingUnlocked(false)
      setClaimingVested(false)
      setTimeout(() => setSuccess(false), 5000)
    }
  })

  // Handle claiming tokens
  const handleClaim = async (claimUnlocked: boolean, claimVested: boolean) => {
    setError(null)
    setTxHash(undefined)
    setSuccess(false)
    
    if (claimUnlocked) setClaimingUnlocked(true)
    if (claimVested) setClaimingVested(true)
    
    setIsLoading(true)
    
    try {
      console.log(`Claiming tokens: unlocked=${claimUnlocked}, vested=${claimVested}`)
      
      const claimTx = await claimTokens({
        args: [claimUnlocked, claimVested],
      })
      
      setTxHash(claimTx.hash)
      console.log("Claim transaction submitted:", claimTx.hash)
      
    } catch (error: any) {
      console.error("Claim error:", error)
      setError(`Claim failed: ${error.message || 'Unknown error'}`)
      setIsLoading(false)
      setClaimingUnlocked(false)
      setClaimingVested(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4 md:p-6">
        <div className="space-y-4">
          <h3 className="text-base font-semibold mb-2">Token Distribution</h3>
          
          {/* Unlocked tokens section */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <h4 className="text-sm font-medium mb-1 sm:mb-0">Unlocked Tokens (50%)</h4>
              <span className="text-xs text-secondary-foreground">
                {formatNumber(parseFloat(unlockedClaimed))} / {formatNumber(parseFloat(unlockedAmount))} PEPO
              </span>
            </div>
            <Progress value={unlockedPercentage} className="h-2" />
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1 space-y-2 sm:space-y-0">
              <span className="text-xs text-secondary-foreground">
                {claimableUnlockedNum > 0 ? `${formatNumber(claimableUnlockedNum)} PEPO available to claim` : 'No tokens to claim'}
              </span>
              <Button
                size="sm"
                variant={claimableUnlockedNum > 0 ? "default" : "outline"}
                disabled={claimableUnlockedNum <= 0 || isLoading || txLoading}
                onClick={() => handleClaim(true, false)}
                className={claimableUnlockedNum > 0 ? "bg-[#375BD2] hover:bg-[#375BD2]/90 w-full sm:w-auto mt-1 sm:mt-0" : "w-full sm:w-auto mt-1 sm:mt-0"}
              >
                {isLoading && claimingUnlocked ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading && claimingUnlocked ? "Claiming..." : "Claim"}
              </Button>
            </div>
          </div>
          
          {/* Vested tokens section */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <h4 className="text-sm font-medium mb-1 sm:mb-0">Vested Tokens (50%)</h4>
              <span className="text-xs text-secondary-foreground">
                {formatNumber(parseFloat(vestedClaimed))} / {formatNumber(parseFloat(vestedAmount))} PEPO
              </span>
            </div>
            <Progress value={vestedPercentage} className="h-2" />
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1 space-y-2 sm:space-y-0">
              <span className="text-xs text-secondary-foreground">
                {claimableVestedNum > 0 ? `${formatNumber(claimableVestedNum)} PEPO available to claim` : 'Vesting in progress'}
              </span>
              <Button
                size="sm"
                variant={claimableVestedNum > 0 ? "default" : "outline"}
                disabled={claimableVestedNum <= 0 || isLoading || txLoading}
                onClick={() => handleClaim(false, true)}
                className={claimableVestedNum > 0 ? "bg-[#375BD2] hover:bg-[#375BD2]/90 w-full sm:w-auto mt-1 sm:mt-0" : "w-full sm:w-auto mt-1 sm:mt-0"}
              >
                {isLoading && claimingVested ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading && claimingVested ? "Claiming..." : "Claim"}
              </Button>
            </div>
          </div>
          
          {/* Vesting progress */}
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between text-xs text-secondary-foreground mb-1">
              <span>Next Vesting Unlock</span>
              <span>{vestingPercentage}%</span>
            </div>
            <Progress value={vestingPercentage} className="h-2 mb-2" />
            <p className="text-xs text-secondary-foreground">
              Tokens are vesting linearly over 6 months. You can claim your vested tokens as they become available.
            </p>
          </div>
          
          {/* Buttons for claiming all */}
          {(claimableUnlockedNum > 0 || claimableVestedNum > 0) && (
            <div className="pt-2">
              <Button
                className="w-full bg-[#375BD2] hover:bg-[#375BD2]/90 text-sm md:text-base"
                disabled={isLoading || txLoading}
                onClick={() => handleClaim(claimableUnlockedNum > 0, claimableVestedNum > 0)}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? "Claiming..." : "Claim All Available Tokens"}
              </Button>
            </div>
          )}
          
          {/* Success message */}
          {success && (
            <Alert className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Tokens claimed successfully!</AlertTitle>
            </Alert>
          )}
          
          {/* Error message */}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
          
          {/* Transaction hash */}
          {txHash && (
            <div className="text-xs text-center">
              <a
                href={`https://sepolia.basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#375BD2] hover:underline"
              >
                View transaction on BaseScan
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}