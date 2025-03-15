'use client'
import { useState, useEffect } from 'react'
import { useContractWrite, useWaitForTransaction } from 'wagmi'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatEther } from 'viem'
import { predictionMarketAddress } from '@/config/contract'
import { multiPredictionMarketABI } from '@/generated'

const ClaimButton = ({
  marketId,
  windowId,
  reward,
  onClaim,
  onSuccess,
}: {
  marketId: number
  windowId: number
  reward: bigint
  onClaim: (bool: boolean) => void
  onSuccess?: () => void
}) => {
  const [isLoading, setIsLoading] = useState(false)
  
  // Contract write for claim function
  const { write: claim, data: claimData } = useContractWrite({
    address: predictionMarketAddress,
    abi: multiPredictionMarketABI,
    functionName: 'claim',
    args: [BigInt(marketId), BigInt(windowId)],
  })
  
  const { isLoading: isLoadingClaim, isSuccess } = useWaitForTransaction({
    hash: claimData?.hash,
  })
  
  useEffect(() => {
    if (claimData?.hash) {
      localStorage.setItem(`claim-${marketId}-${windowId}`, claimData?.hash)
    }
  }, [claimData?.hash, marketId, windowId])
  
  // Call onSuccess callback when transaction completes successfully
  useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess();
      setIsLoading(false);
      onClaim(false);
    }
  }, [isSuccess, onSuccess, onClaim]);
  
  return (
    <Button
      disabled={!claim || isLoadingClaim || isLoading}
      onClick={() => {
        setIsLoading(true)
        onClaim(true)
        claim?.()
      }}
      className="mb-2 w-full bg-[#375BD2] text-base font-black leading-4 text-foreground hover:bg-[#375BD2]/90"
    >
      {isLoadingClaim || isLoading ? (
        <Loader2 className="animate-spin mr-2" />
      ) : null}
      <span>Claim {formatEther(reward || BigInt(0))} PEPO</span>
    </Button>
  )
}

export default ClaimButton
