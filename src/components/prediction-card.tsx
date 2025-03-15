'use client'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import Image from 'next/image'
import { formatEther } from 'viem'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import ClaimButton from '@/components/claim-button'
import { predictionMarketAddress } from '@/config/contract'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { useContractRead } from 'wagmi'
import { multiPredictionMarketABI } from '@/generated'
import { Direction, PredictionResponse, Market, Window, WindowStatus } from '@/types'
import { convertContractPriceToUSD, formatNumber } from '@/lib/formatting'

export default function PredictionCard({
  prediction,
  window,
  market,
  onClaimSuccess
}: {
  prediction: PredictionResponse
  window: Window
  market: Market
  onClaimSuccess?: () => void
}) {
  const { address } = useAccount()
  const [claimInProgress, setClaimInProgress] = useState(false)

  // Normalize IDs to ensure blockchain calls work correctly
  const normalizedWindowId = window.windowId
  const normalizedMarketId = prediction.marketId

  // Contract call configuration
  const contractCalls = {
    address: predictionMarketAddress,
    abi: multiPredictionMarketABI,
  }

  // Fetch window data from the contract
  const { data: windowData, isLoading: windowLoading, isError } = useContractRead({
    ...contractCalls,
    functionName: 'getWindow',
    args: [BigInt(normalizedMarketId), BigInt(normalizedWindowId)],
    enabled: normalizedMarketId !== undefined && normalizedWindowId !== undefined,
  })

  // Process and merge blockchain data with existing window data
  const mergedWindow = windowData ? {
    ...window,
    startTime: windowData.startTime ? Number(windowData.startTime) : window.startTime,
    lockTime: windowData.lockTime ? Number(windowData.lockTime) : window.lockTime,
    startPrice: windowData.startPrice ? convertContractPriceToUSD(windowData.startPrice) : window.startPrice,
    lockPrice: windowData.lockPrice ? convertContractPriceToUSD(windowData.lockPrice) : window.lockPrice,
    closePrice: windowData.closePrice ? convertContractPriceToUSD(windowData.closePrice) : window.closePrice,
    closeTime: windowData.closeTime ? Number(windowData.closeTime) : window.closeTime,
    status: windowData.status !== undefined ? Number(windowData.status) : window.status,
    winner: windowData.winner !== undefined ? Number(windowData.winner) : window.winner
  } : window

  // Check prediction status
  const isResolved = mergedWindow.status === WindowStatus.Resolved
  const isDraw = mergedWindow.winner === Direction.Draw
  const isPredictionCorrect = isResolved && Number(prediction.direction) === mergedWindow.winner
  const shouldShowClaim = isResolved && (isPredictionCorrect || isDraw) && !prediction.claimed

  // Calculate potential reward
  const { data: reward } = useContractRead({
    ...contractCalls,
    functionName: 'calculateReward',
    args: normalizedMarketId !== undefined && normalizedWindowId !== undefined && address
      ? [
        BigInt(normalizedMarketId),
        BigInt(normalizedWindowId),
        address
      ]
      : undefined,
    enabled: shouldShowClaim && normalizedMarketId !== undefined && normalizedWindowId !== undefined && !!address
  })

  // Get transaction hash for claimed predictions
  const txHash = prediction.claimed
    ? localStorage.getItem(`claim-${normalizedMarketId}-${normalizedWindowId}`)
    : null

  // Calculate price movement percentage  
  const priceChange = isResolved
    ? mergedWindow.lockPrice > 0
      ? ((mergedWindow.closePrice - mergedWindow.lockPrice) / mergedWindow.lockPrice) * 100
      : 0
    : mergedWindow.startPrice > 0
      ? ((mergedWindow.lockPrice - mergedWindow.startPrice) / mergedWindow.startPrice) * 100
      : 0

  const isPositive = priceChange >= 0

  return (
    <div className="mb-8">
      <div className="mb-2 w-full rounded-[8px] bg-card p-6">
        <div className="flex w-full items-center space-x-[12px]">
          {isResolved ? (
            isDraw ? (
              // Show better-luck-next-time.png for draws
              <Image
                src="/better-luck-next-time.png"
                width={40}
                height={40}
                alt="better-luck-next-time"
                className="object-contain"
              />
            ) : isPredictionCorrect ? (
              <Image
                src="/winner-cup.svg"
                width={35}
                height={40}
                alt="winner-cup"
              />
            ) : (
              <Image
                src="/loser-cup.png"
                width={40}
                height={40}
                alt="loser-cup"
                className="object-contain"
              />
            )
          ) : null}
          <div className="w-full">
            <div className="mb-4 flex flex-col space-y-2">
              <div className="flex items-center justify-between font-[450] leading-4">
                <div className="flex items-center space-x-[4px]">
                  <Image
                    src={market.logo || '/na.webp'}
                    width={16}
                    height={16}
                    className="max-h-[16px] max-w-[16px] object-contain"
                    alt={market.pair}
                  />
                  <p className="flex items-center">
                    {prediction.direction === Direction.Up ? (
                      <><ArrowUp className="mr-1 h-4 w-4 text-green-400" /> {market.pair} Up</>
                    ) : (
                      <><ArrowDown className="mr-1 h-4 w-4 text-red-400" /> {market.pair} Down</>
                    )}
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-2">
                  <div className="flex items-center">
                    <p>{prediction.amount ? `${formatEther(prediction.amount)} PEPO` : "0 PEPO"}</p>
                  </div>
                  
                  {isResolved && (
                    <div className={`flex min-w-[60px] items-center justify-end ${isPositive ? "text-green-400" : "text-red-400"}`}>
                      {isPositive ? "+" : ""}{formatNumber(priceChange)}%
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-2 grid grid-cols-3 gap-2">
              <div>
                <p className="text-xs text-secondary-foreground">Start Price</p>
                <p className="font-medium">
                  {windowLoading ? 'Loading...' :
                    isError ? 'Error loading data' :
                      `$${mergedWindow.startPrice > 0 ? formatNumber(mergedWindow.startPrice) : '0.00'}`}
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary-foreground">Lock Price</p>
                <p className="font-medium">
                  {windowLoading ? 'Loading...' :
                    isError ? 'Error loading data' :
                      `$${mergedWindow.lockPrice > 0 ? formatNumber(mergedWindow.lockPrice) : '0.00'}`}
                </p>
              </div>
              {isResolved && (
                <div>
                  <p className="text-xs text-secondary-foreground">Close Price</p>
                  <p className="font-medium">
                    {windowLoading ? 'Loading...' :
                      isError ? 'Error loading data' :
                        `$${mergedWindow.closePrice > 0 ? formatNumber(mergedWindow.closePrice) : '0.00'}`}
                  </p>
                </div>
              )}
            </div>

            <p className="text-[12px] leading-4 text-secondary-foreground">
              {windowLoading ? 'Loading...' : (
                isResolved
                  ? mergedWindow.closeTime > 0
                    ? `Resolved: ${format(new Date(mergedWindow.closeTime * 1000), 'MMM d @ h:mm aaa')}`
                    : "Resolved: Pending"
                  : mergedWindow.lockTime > 0
                    ? `Locks: ${format(new Date(mergedWindow.lockTime * 1000), 'MMM d @ h:mm aaa')}`
                    : "Locks: Pending"
              )}
            </p>
          </div>
        </div>
      </div>

      {shouldShowClaim || claimInProgress ? (
        <ClaimButton
          reward={reward as bigint}
          marketId={normalizedMarketId}
          windowId={normalizedWindowId}
          onClaim={setClaimInProgress}
          onSuccess={onClaimSuccess}
        />
      ) : null}

      {txHash && (
        <a
          href={`https://sepolia.basescan.org/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
        >
          <Button className="w-full border-2 border-border bg-background text-base font-medium leading-4 text-foreground hover:bg-background/90 hover:text-muted-foreground">
            View Basescan
          </Button>
        </a>
      )}
    </div>
  )
}
