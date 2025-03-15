// src/components/auction/bid-details-card.tsx
'use client'
import { formatEther } from 'viem'
import { Card, CardContent } from '@/components/ui/card'
import { formatNumber } from '@/lib/formatting'

export default function BidDetailsCard({ userInfo }: { userInfo: any }) {
  if (!userInfo || !userInfo.hasParticipated) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4 md:p-6">
          <p className="text-secondary-foreground">No participation data available.</p>
        </CardContent>
      </Card>
    )
  }

  const contribution = userInfo.contribution ? formatEther(userInfo.contribution) : '0'
  const totalAllocation = userInfo.totalAllocation ? formatEther(userInfo.totalAllocation) : '0'
  const unlockedClaimed = userInfo.unlockedClaimed ? formatEther(userInfo.unlockedClaimed) : '0'
  const vestedClaimed = userInfo.vestedClaimed ? formatEther(userInfo.vestedClaimed) : '0'
  const totalClaimed = parseFloat(unlockedClaimed) + parseFloat(vestedClaimed)
  const remainingToClaimTotal = parseFloat(totalAllocation) - totalClaimed

  return (
    <Card className="mb-6">
      <CardContent className="p-4 md:p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-secondary-foreground mb-1">Total Contribution</p>
              <p className="text-lg font-semibold">{formatNumber(parseFloat(contribution))} ETH</p>
            </div>
            <div>
              <p className="text-sm text-secondary-foreground mb-1">Token Allocation</p>
              <p className="text-lg font-semibold">{formatNumber(parseFloat(totalAllocation))} PEPO</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-secondary-foreground mb-1">Tokens Claimed</p>
              <p className="text-lg font-semibold">{formatNumber(totalClaimed)} PEPO</p>
            </div>
            <div>
              <p className="text-sm text-secondary-foreground mb-1">Tokens Remaining</p>
              <p className="text-lg font-semibold">{formatNumber(remainingToClaimTotal)} PEPO</p>
            </div>
          </div>
          
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-secondary-foreground">
              Your auction participation details are shown above. As tokens become vested over time, 
              you'll be able to claim them from the Token Distribution section below.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}