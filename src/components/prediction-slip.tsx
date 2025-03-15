'use client'

import { useContractRead } from 'wagmi'
import PredictionSlipList from '@/components/prediction-slip-list'
import { predictionMarketAddress } from '@/config/contract'
import { multiPredictionMarketABI } from '@/generated'
import { transformMarketData } from '@/config/api'

const PredictionSlip = () => {
  // Fetch all markets for reference in the prediction slip
  const { data: marketsData, isLoading } = useContractRead({
    address: predictionMarketAddress,
    abi: multiPredictionMarketABI,
    functionName: 'getMarkets',
  })
  
  const markets = marketsData 
    ? (marketsData as any[]).map(transformMarketData)
    : []
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>
  }
  
  return <PredictionSlipList markets={markets} />
}

export default PredictionSlip
