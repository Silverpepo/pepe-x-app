'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { formatEther, parseEther } from 'viem'
import { useLocalStateContext } from '@/app/context'
import { useAuctionStateContext } from '@/app/auction/auction-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import ConnectWallet from '@/components/connect-wallet'
import PlaceBidButton from '@/components/auction/place-bid-button'
import BidDetailsCard from '@/components/auction/bid-details-card'
import VestingInfoCard from '@/components/auction/vesting-info-card'
import { useDebounce } from '@/hooks/useDebounce'
import AuctionHowTo from '@/components/auction/auction-how-to'

import { dutchAuctionAddress } from '@/config/contract'
import {
  usePepoDutchAuctionGetCurrentPrice,
  usePepoDutchAuctionGetUserInfo,
  usePepoDutchAuctionGetUserDistributionInfo,
  usePepoDutchAuctionGetAuctionInfo
} from '@/generated'

const formSchema = z.object({
  amount: z.coerce.number().gt(0, { message: "Amount must be greater than 0" }),
  tokenAmount: z.coerce.number(),
});

type FormData = z.infer<typeof formSchema>;

export default function AuctionBidSlip() {
  const { address, isConnected } = useAccount()
  const { error: contextError, tab, setTab } = useLocalStateContext()
  const { auctionBid, setAuctionBid, auctionError } = useAuctionStateContext()
  const [estimatedTokens, setEstimatedTokens] = useState<string>('0')

  // Contract data
  const { data: currentPrice, isLoading: priceLoading } = usePepoDutchAuctionGetCurrentPrice({
    address: dutchAuctionAddress
  })
  const { data: auctionInfo, isLoading: auctionInfoLoading } = usePepoDutchAuctionGetAuctionInfo({
    address: dutchAuctionAddress
  })
  const { data: userInfo, isLoading: userInfoLoading, refetch: refetchUserInfo } = usePepoDutchAuctionGetUserInfo({
    address: dutchAuctionAddress,
    args: address ? [address] : undefined,
    enabled: isConnected && !!address
  })
  const { data: userDistributionInfo, isLoading: distributionLoading, refetch: refetchDistributionInfo } = usePepoDutchAuctionGetUserDistributionInfo({
    address: dutchAuctionAddress,
    args: address ? [address] : undefined,
    enabled: isConnected && !!address
  })

  const isAuctionActive = auctionInfo && !auctionInfo.isEnded
  const userHasParticipated = userInfo?.hasParticipated || false

  // Form setup
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0.1,
      tokenAmount: 0,
    },
  })

  const amount = form.watch('amount')
  const debouncedAmount = useDebounce(amount)

  // Estimate token amount based on bid
  useEffect(() => {
    if (currentPrice && debouncedAmount > 0) {
      const priceInEth = Number(formatEther(currentPrice))
      if (priceInEth > 0) {
        const estimatedAmount = debouncedAmount / priceInEth
        setEstimatedTokens(estimatedAmount.toFixed(4))
        form.setValue('tokenAmount', estimatedAmount)
        
        // Update auction bid in context
        setAuctionBid({
          amount: debouncedAmount,
          estimatedTokens: estimatedAmount,
          currentPrice: priceInEth,
          timestamp: Date.now()
        })
      }
    }
  }, [currentPrice, debouncedAmount, form, setAuctionBid])

  return (
    <>
      <Tabs value={tab} onValueChange={setTab} className="flex-1">
        <TabsList className="h-16 w-full space-x-3 rounded-none border-b border-b-border bg-background px-4 py-3">
          <TabsTrigger
            value="predictionslip"
            className="flex-1 py-3 text-[16px] font-black leading-[16px] hover:text-primary-foreground data-[state=active]:rounded-[8px] data-[state=active]:bg-[#375BD2]"
          >
            Place Bid
          </TabsTrigger>
          <TabsTrigger
            value="my-predictions"
            className="flex-1 py-3 text-[16px] font-black leading-[16px] hover:text-primary-foreground data-[state=active]:rounded-[8px] data-[state=active]:bg-[#375BD2]"
          >
            My Tokens
          </TabsTrigger>
        </TabsList>
        
        {/* Place Bid Tab */}
        <TabsContent value="predictionslip" className="flex flex-col items-center">
          {contextError && (
            <div className="w-full px-4">
              <Alert
                variant="destructive"
                className="my-4 flex items-center space-x-4 border-0 bg-[#FCCDCD] text-[#DE2624]"
              >
                <Image
                  src="/alert-diamond.svg"
                  width={24}
                  height={24}
                  alt="alert"
                />
                <AlertTitle>{`Error: ${contextError}`}</AlertTitle>
              </Alert>
            </div>
          )}
          
          {auctionError && (
            <div className="w-full px-4">
              <Alert
                variant="destructive"
                className="my-4 flex items-center space-x-4 border-0 bg-[#FCCDCD] text-[#DE2624]"
              >
                <Image
                  src="/alert-diamond.svg"
                  width={24}
                  height={24}
                  alt="alert"
                />
                <AlertTitle>{`Error: ${auctionError}`}</AlertTitle>
              </Alert>
            </div>
          )}
          
          {isConnected ? (
            <div className="w-full px-4">
              <ScrollArea className="h-[calc(100dvh-240px)] w-full md:h-[calc(100vh-172px)]">
                <div className="mb-4 flex w-full items-start space-x-[24px] rounded-[8px] border-l-[12px] border-l-[#375BD2] bg-card py-6 pl-3 pr-4">
                  <div className="w-full">
                    <div className="mb-2 flex items-center space-x-[4px]">
                      <Image
                        src="/tokens/PEPO.svg"
                        width={16}
                        height={16}
                        className="max-h-[16px] max-w-[16px] object-contain"
                        alt="PEPO"
                      />
                      <p className="flex items-center font-[450] leading-4">
                        PEPO Token Dutch Auction
                      </p>
                    </div>
                    <p className="text-[12px] leading-4 text-secondary-foreground mb-4">
                      Current price: {priceLoading ? "Loading..." : `${formatEther(currentPrice || BigInt(0))} ETH per PEPO`}
                    </p>
                    
                    <Form {...form}>
                      <form className="grid w-full gap-4">
                        <div>
                          <span className="mb-2 text-[14px] leading-4">ETH Amount</span>
                          <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="flex space-x-[8px] rounded-[8px] bg-secondary px-4 py-3">
                                    <Image
                                      src="/tokens/eth.svg"
                                      width={16}
                                      height={16}
                                      alt="ETH"
                                    />
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0.01"
                                      className="h-auto rounded-none border-0 p-0 w-full [appearance:textfield] focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                      {...field}
                                      onChange={(e) => {
                                        if (Number(e.target.value) < 0) {
                                          return
                                        }
                                        field.onChange(e)
                                      }}
                                    />
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div>
                          <span className="mb-2 text-[14px] leading-4">Estimated PEPO</span>
                          <FormField
                            control={form.control}
                            name="tokenAmount"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="flex space-x-[8px] rounded-[8px] bg-secondary px-4 py-3">
                                    <Image
                                      src="/tokens/PEPO.svg"
                                      width={16}
                                      height={16}
                                      alt="PEPO"
                                    />
                                    <Input
                                      disabled
                                      type="text"
                                      value={estimatedTokens}
                                      className="h-auto rounded-none border-0 p-0 w-full [appearance:textfield] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-default disabled:opacity-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    />
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </form>
                    </Form>
                    
                    <div className="mt-4 text-xs text-secondary-foreground">
                      <p>• Final token amount may vary based on the auction's closing price</p>
                      <p>• 50% of tokens are unlocked immediately after auction ends</p>
                      <p>• 50% vest linearly over 6 months</p>
                    </div>
                  </div>
                </div>
                
                {isAuctionActive ? (
                  <PlaceBidButton
                    bidAmount={amount.toString()}
                    estimatedTokens={estimatedTokens}
                    refetchUserInfo={refetchUserInfo}
                    refetchDistributionInfo={refetchDistributionInfo}
                  />
                ) : (
                  <Alert className="mb-4">
                    <AlertTitle>Auction is not active</AlertTitle>
                  </Alert>
                )}

                {/* Show How-to on desktop only in right sidebar */}
                <div className="md:hidden mt-6">
                  <AuctionHowTo />
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="flex h-[calc(100dvh-240px)] w-full flex-col items-center justify-center bg-center bg-no-repeat md:h-[calc(100vh-172px)]">
              <Image
                src="/illustrations/pepe-stare.png"
                width={150}
                height={150}
                alt="pepe-stare"
                className="mb-10"
              />
              <p className="font-bold">Connect wallet to participate</p>
              <p className="mt-6 w-[230px] text-center text-base font-[450] text-secondary-foreground">
                To participate in the auction,<br />
                please connect your wallet<br />
                using the button below.
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* My Tokens Tab */}
        <TabsContent value="my-predictions" className="flex flex-col items-center">
          {isConnected ? (
            <div className="w-full px-4">
              <ScrollArea className="h-[calc(100dvh-240px)] w-full md:h-[calc(100vh-172px)]">
                {userHasParticipated ? (
                  <>
                    <div className="mb-6 font-[450] leading-4">Your Auction Summary</div>
                    <BidDetailsCard userInfo={userInfo} />
                    
                    <div className="mb-6 font-[450] leading-4 mt-6">Token Distribution</div>
                    <VestingInfoCard distributionInfo={userDistributionInfo} />
                  </>
                ) : (
                  <div className="flex h-[calc(100dvh-240px)] w-full flex-col items-center justify-center md:h-[calc(100vh-240px)]">
                    <Image
                      src="/illustrations/pepe-stare.png"
                      width={150}
                      height={150}
                      alt="pepe-stare"
                      className="mb-10"
                    />
                    <p className="font-bold">No participation yet</p>
                    <p className="mt-6 w-[230px] text-center text-base font-[450] text-secondary-foreground">
                      You haven&apos;t participated in the auction yet. Place a bid to get PEPO tokens.
                    </p>
                  </div>
                )}
              </ScrollArea>
            </div>
          ) : (
            <div className="flex h-[calc(100dvh-240px)] w-full flex-col items-center justify-center bg-center bg-no-repeat md:h-[calc(100vh-172px)]">
              <Image
                src="/illustrations/pepe-stare.png"
                width={150}
                height={150}
                alt="pepe-stare"
                className="mb-10"
              />
              <p className="font-bold">Connect wallet to view your tokens</p>
              <p className="mt-6 w-[230px] text-center text-base font-[450] text-secondary-foreground">
                To view your token allocation and<br />
                vesting schedule, please connect<br />
                your wallet.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="absolute inset-x-0 bottom-0 p-6 md:static">
        <ConnectWallet />
      </div>
    </>
  )
}
