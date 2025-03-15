'use client'
import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import AuctionInfoCard from '@/components/auction/auction-info-card'
import AuctionHowTo from '@/components/auction/auction-how-to'

export default function AuctionPage() {
  const [activeTab, setActiveTab] = useState('auction')

  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <div className="p-4 md:p-6 max-w-[100vw]">
        <div className="mb-4 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold mb-2">PEPO Token Dutch Auction</h1>
          <p className="text-sm md:text-base text-secondary-foreground">
            Participate in our token auction to acquire PEPO tokens at a fair price.
            The price decreases over time until all tokens are sold or the auction ends.
          </p>
        </div>

        {/* Mobile-only How To section */}
        <div className="md:hidden mb-4">
          <AuctionHowTo />
        </div>

        {/* Main Auction Card */}
        <AuctionInfoCard className="mb-4 md:mb-6" />

        {/* How it works section */}
        <Card>
          <CardHeader className="px-4 py-3 md:p-6">
            <CardTitle className="text-lg md:text-xl">How It Works</CardTitle>
            <CardDescription>
              Learn about Dutch auctions and the PEPO token vesting process
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 md:p-6">
            <Tabs defaultValue="auction" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full mb-4 grid grid-cols-3 bg-secondary">
                <TabsTrigger className="text-muted-foreground data-[state=active]:w-full data-[state=active]:bg-[#375BD2] data-[state=active]:hover:bg-[#375BD2]/90 data-[state=active]:text-sm data-[state=active]:md:text-base data-[state=active]:text-foreground" value="auction">Dutch Auction</TabsTrigger>
                <TabsTrigger className="text-muted-foreground data-[state=active]:w-full data-[state=active]:bg-[#375BD2] data-[state=active]:hover:bg-[#375BD2]/90 data-[state=active]:text-sm data-[state=active]:md:text-base data-[state=active]:text-foreground" value="vesting">Token Vesting</TabsTrigger>
                <TabsTrigger className="text-muted-foreground data-[state=active]:w-full data-[state=active]:bg-[#375BD2] data-[state=active]:hover:bg-[#375BD2]/90 data-[state=active]:text-sm data-[state=active]:md:text-base data-[state=active]:text-foreground" value="tokenomics">Tokenomics</TabsTrigger>
              </TabsList>
              <TabsContent value="auction" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">What is a Dutch Auction?</h3>
                  <p className="text-secondary-foreground text-sm md:text-base">
                    In a Dutch auction, the price starts high and gradually decreases over time. Participants can place bids at any time, securing tokens at the current price. The auction ends when all tokens are sold or the time limit is reached.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">How to Participate</h3>
                  <ol className="list-decimal pl-5 text-secondary-foreground space-y-2 text-sm md:text-base">
                    <li>Connect your wallet using the button at the bottom of the page</li>
                    <li>Click on "Place Bid" when you're comfortable with the current price</li>
                    <li>Enter the amount of ETH you want to contribute</li>
                    <li>Confirm the transaction in your wallet</li>
                    <li>Once your transaction is confirmed, your tokens will be allocated based on the final price</li>
                  </ol>
                </div>
              </TabsContent>
              <TabsContent value="vesting" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Token Vesting Schedule</h3>
                  <p className="text-secondary-foreground text-sm md:text-base">
                    When you participate in the auction, your tokens are subject to a vesting schedule:
                  </p>
                  <ul className="list-disc pl-5 text-secondary-foreground space-y-2 text-sm md:text-base">
                    <li><span className="font-medium">50%</span> of your tokens are unlocked and claimable immediately after the auction ends</li>
                    <li><span className="font-medium">50%</span> vest linearly over 6 months, claimable incrementally as they unlock</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Claiming Tokens</h3>
                  <p className="text-secondary-foreground text-sm md:text-base">
                    You can claim your tokens from the "My Tokens" tab after the auction ends. Both unlocked and vested tokens can be claimed as they become available.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="tokenomics" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">PEPO Token Distribution</h3>
                  <p className="text-secondary-foreground text-sm md:text-base">
                    The PEPO token has a total supply of 100,000,000 tokens distributed as follows:
                  </p>
                  <ul className="list-disc pl-5 text-secondary-foreground space-y-2 text-sm md:text-base">
                    <li><span className="font-medium">15%</span> for the public sale via Dutch auction</li>
                    <li><span className="font-medium">20%</span> for the team (2-year vesting)</li>
                    <li><span className="font-medium">25%</span> for marketing and partnerships</li>
                    <li><span className="font-medium">40%</span> for liquidity and rewards</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Token Utility</h3>
                  <p className="text-secondary-foreground text-sm md:text-base">
                    PEPO tokens are used for predictions on the platform, staking for rewards, and governance of the protocol.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
