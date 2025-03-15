'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { useLocalStateContext } from '@/app/context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertTitle } from '@/components/ui/alert'
import ConnectWallet from '@/components/connect-wallet'
import PredictionSlipCard from '@/components/prediction-slip-card'
import PredictionCard from '@/components/prediction-card'
import PlacePredictionButton from '@/components/place-prediction-button'
import { cn } from '@/lib/utils'
import { predictionMarketAddress } from '@/config/contract'
import { useContractReads } from 'wagmi'
import { multiPredictionMarketABI } from '@/generated' 
import { transformWindowData } from '@/config/api'
import { PredictionResponse, Direction, Market, Window } from '@/types'

interface PredictionSlipListProps {
  markets: Market[];
}

export default function PredictionSlipList({ markets }: PredictionSlipListProps) {
  const { address, isConnected } = useAccount()
  const {
    predictions,
    error: predictionsError,
    tab,
    setTab,
  } = useLocalStateContext()
  
  // Contract configuration
  const contractConfig = {
    address: predictionMarketAddress,
    abi: multiPredictionMarketABI,
  }
  
  // Step 1: Get all user window IDs for each market
  const windowQueries = markets.map(market => ({
    ...contractConfig,
    functionName: 'getUserWindows',
    args: [BigInt(market.id), address!],
  }))
  
  const { data: userWindowsData, isLoading: userWindowsLoading, refetch: refetchUserWindows } = useContractReads({
    contracts: windowQueries,
    enabled: isConnected && !!address && markets.length > 0,
  })
  
  // Process window IDs from all markets
  const windowsToFetch: {marketId: bigint, windowId: bigint}[] = []
  
  if (userWindowsData) {
    userWindowsData.forEach((data, index) => {
      if (data.result) {
        const marketId = BigInt(markets[index].id)
        const windowIds = data.result as bigint[]
        
        windowIds.forEach(windowId => {
          windowsToFetch.push({
            marketId,
            windowId
          })
        })
      }
    })
  }
  
  // Step 2: Fetch window data
  const windowDataQueries = windowsToFetch.map(({ marketId, windowId }) => ({
    ...contractConfig,
    functionName: 'getWindow',
    args: [marketId, windowId],
  }))
  
  const { data: windowsData, isLoading: windowsLoading, refetch: refetchWindowsData } = useContractReads({
    contracts: windowDataQueries,
    enabled: windowsToFetch.length > 0,
  })
  
  // Step 3: Fetch user predictions for each window
  const predictionQueries = windowsToFetch.map(({ marketId, windowId }) => ({
    ...contractConfig,
    functionName: 'getUserPredictions',
    args: [marketId, address!, windowId],
  }))
  
  const { data: userPredictionsData, isLoading: predictionsLoading, refetch: refetchUserPredictions } = useContractReads({
    contracts: predictionQueries,
    enabled: windowsToFetch.length > 0 && !!address,
  })
  
  // Function to refetch all prediction data
  const refetchAllPredictionData = async () => {
    if (isConnected && !!address) {
      try {
        // First refresh the user windows data
        await refetchUserWindows()
        // Then refresh the other data if needed
        if (windowsToFetch.length > 0) {
          await refetchWindowsData()
          await refetchUserPredictions()
        }
      } catch (error) {
        console.error("Error refreshing prediction data:", error)
      }
    }
  }

  // Set up an effect to refresh data when the tab changes to my-predictions
  useEffect(() => {
    if (tab === 'my-predictions' && isConnected) {
      refetchAllPredictionData()
    }
  }, [tab, isConnected])
  
  const onTabChange = (value: string) => {
    setTab(value)
  }
  
  // Define the type for our processed predictions
  interface ProcessedPrediction {
    prediction: PredictionResponse;
    window: Window;
    market: Market;
  }
  
  // Process all the data
  const processedPredictions = windowsToFetch.map((windowInfo, index) => {
    const windowData = windowsData?.[index]?.result 
      ? transformWindowData(windowsData[index].result as any)
      : null
      
    const market = markets.find(m => BigInt(m.id) === windowInfo.marketId)
    
    const predictions = userPredictionsData?.[index]?.result 
      ? (userPredictionsData[index].result as PredictionResponse[])
      : []
      
    // Skip if there's no window data, market, or predictions
    if (!windowData || !market || !predictions.length) return null
    
    // Return one item per prediction
    return predictions.map(prediction => ({
      prediction,
      window: windowData,
      market
    }))
  })
  .filter(Boolean) // Remove nulls
  .flat() as ProcessedPrediction[] // Flatten array of arrays
  
  const arePredictionsEmpty = processedPredictions.length === 0
  const isLoading = userWindowsLoading || windowsLoading || predictionsLoading
  
  return (
    <>
      <Tabs value={tab} onValueChange={onTabChange} className="flex-1">
        <TabsList className="h-16 w-full space-x-3 rounded-none border-b border-b-border bg-background px-4 py-3">
          <TabsTrigger
            value="predictionslip"
            className="flex-1 py-3 text-[16px] font-black leading-[16px] hover:text-primary-foreground data-[state=active]:rounded-[8px] data-[state=active]:bg-[#375BD2]"
          >
            Predictions Slip
          </TabsTrigger>
          <TabsTrigger
            value="my-predictions"
            className="flex-1 py-3 text-[16px] font-black leading-[16px] hover:text-primary-foreground data-[state=active]:rounded-[8px] data-[state=active]:bg-[#375BD2]"
          >
            My Predictions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="predictionslip" className="flex flex-col items-center">
          {predictionsError && (
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
                <AlertTitle>{`Error: ${predictionsError}`}</AlertTitle>
              </Alert>
            </div>
          )}
          {predictions.length > 0 ? (
            <div className="w-full px-4">
              <ScrollArea
                className={cn(
                  'w-full',
                  predictionsError
                    ? 'h-[calc(100dvh-440px)] md:h-[calc(100vh-372px)]'
                    : 'h-[calc(100dvh-240px)] md:h-[calc(100vh-172px)]',
                )}
              >
                {predictions.map((prediction) => (
                  <PredictionSlipCard
                    key={`${prediction.market.id}-${prediction.window.windowId}`}
                    prediction={prediction}
                  />
                ))}
                {isConnected ? (
                  <PlacePredictionButton 
                    setTab={setTab} 
                    // Pass the refetch function down to PlacePredictionButton
                    onSuccessfulPrediction={refetchAllPredictionData} 
                  />
                ) : null}
              </ScrollArea>
            </div>
          ) : (
            <div
              className={cn(
                "flex w-full	flex-col items-center	justify-center bg-center bg-no-repeat",
                predictionsError
                  ? 'h-[calc(100dvh-440px)] md:h-[calc(100vh-372px)]'
                  : 'h-[calc(100dvh-240px)] md:h-[calc(100vh-172px)]',
              )}
            >
              <Image
                src="/illustrations/pepe-stare.png"
                width={150}
                height={150}
                alt="pepe-stare"
                className="mb-10"
              />
              <p className="font-bold">Prediction Slip is empty</p>
              <p className="mt-6 w-[230px] text-center text-base font-[450] text-secondary-foreground">
                To add a Prediction to your
                <br />
                prediction slip, please select a<br />
                direction from the list.
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="my-predictions" className="flex flex-col items-center">
          {isLoading ? (
            <div className="flex justify-center items-center h-[calc(100vh-172px)]">
              Loading your predictions...
            </div>
          ) : arePredictionsEmpty ? (
            <div className="flex h-[calc(100dvh-240px)] w-full flex-col items-center justify-center bg-center bg-no-repeat md:h-[calc(100vh-172px)]">
              <Image
                src="/illustrations/pepe-stare.png"
                width={150}
                height={150}
                alt="pepe-stare"
                className="mb-10"
              />
              <p className="font-bold">No predictions placed...</p>
              <p className="mt-6 w-[230px] text-center text-base font-[450] text-secondary-foreground">
                Once you add a prediction via the predictions slip tab, it will
                show up here.
              </p>
            </div>
          ) : (
            <div className="w-full px-4">
              <ScrollArea className="h-[calc(100dvh-240px)] w-full md:h-[calc(100vh-172px)]">
                <div className="mb-6 font-[450] leading-4">
                  Predictions in Progress
                </div>
                {processedPredictions
                  .filter(item => {
                    // Keep predictions that are not resolved OR
                    // are resolved with either:
                    // - Correct prediction AND not claimed yet
                    // - Draw AND not claimed yet
                    return item.window.status !== 2 || // Not resolved
                          (item.window.status === 2 && // Is resolved
                           (
                             (Number(item.prediction.direction) === item.window.winner && // User guessed correctly
                             !item.prediction.claimed) || // Not claimed yet
                             (item.window.winner === Direction.Draw && // It's a draw
                             !item.prediction.claimed) // Not claimed yet
                           ))
                  })
                  // Sort by lockTime for in-progress predictions (newer first)
                  // For resolved but unclaimed, sort by closeTime
                  .sort((a, b) => {
                    // If both are resolved, sort by closeTime
                    if (a.window.status === 2 && b.window.status === 2) {
                      return b.window.closeTime - a.window.closeTime;
                    }
                    // If only one is resolved, show resolved ones first
                    if (a.window.status === 2) return -1;
                    if (b.window.status === 2) return 1;
                    // Otherwise sort by lockTime (newer first)
                    return b.window.lockTime - a.window.lockTime;
                  })
                  .map((item, i) => (
                    <PredictionCard
                      key={i}
                      prediction={item.prediction}
                      window={item.window}
                      market={item.market}
                      onClaimSuccess={refetchAllPredictionData}
                    />
                  ))}
                <div className="mb-6 font-[450] leading-4 mt-6">
                  Completed Predictions
                </div>
                {processedPredictions
                  .filter(item => {
                    // Only include fully completed predictions:
                    // - Either resolved with incorrect prediction (can't claim)
                    // - Or resolved, correct prediction, and already claimed
                    // - Or resolved, draw, and already claimed
                    return item.window.status === 2 && // Is resolved
                          ((Number(item.prediction.direction) !== item.window.winner && 
                            item.window.winner !== Direction.Draw) || // Wrong prediction and not a draw
                           item.prediction.claimed) // Or already claimed
                  })
                  // Sort by closeTime in descending order (newest first)
                  .sort((a, b) => b.window.closeTime - a.window.closeTime)
                  .map((item, i) => (
                    <PredictionCard
                      key={i}
                      prediction={item.prediction}
                      window={item.window}
                      market={item.market}
                      onClaimSuccess={refetchAllPredictionData}
                    />
                  ))}
              </ScrollArea>
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
