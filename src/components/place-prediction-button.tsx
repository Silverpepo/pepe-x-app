'use client'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { Loader2 } from 'lucide-react'
import { useLocalStateContext } from '@/app/context'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { predictionMarketAddress, tokenAddress } from '@/config/contract'
import { 
  useContractWrite, 
  useBalance
} from 'wagmi'
import { 
  readContract,
  waitForTransaction 
} from 'wagmi/actions'
import { multiPredictionMarketABI, pepoABI } from '@/generated'
import Image from 'next/image'

// Define the correct type for transaction hashes
type TransactionHash = `0x${string}` | undefined;

export default function PlacePredictionButton({
  setTab,
  onSuccessfulPrediction,
}: {
  setTab: (tab: string) => void;
  onSuccessfulPrediction?: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<TransactionHash>(undefined)
  const [currentStep, setCurrentStep] = useState<string>("idle")
  const { address } = useAccount()
  const { predictions, setPredictions } = useLocalStateContext()
  
  // Get PEPO token balance
  const { data: tokenBalance } = useBalance({
    address,
    token: tokenAddress
  })
  
  // Token approval transaction
  const { 
    writeAsync: approve,
    error: approveError 
  } = useContractWrite({
    address: tokenAddress,
    abi: pepoABI,
    functionName: 'approve',
  })
  
  // Prediction transaction
  const {
    writeAsync: predict,
    error: predictError
  } = useContractWrite({
    address: predictionMarketAddress,
    abi: multiPredictionMarketABI,
    functionName: 'predict',
  })
  
  // Update error state from contract errors
  useEffect(() => {
    if (approveError) {
      setError(`Approval failed: ${approveError.message}`)
      setIsLoading(false)
      setCurrentStep("idle")
    }
    if (predictError) {
      setError(`Prediction failed: ${predictError.message}`)
      setIsLoading(false)
      setCurrentStep("idle")
    }
  }, [approveError, predictError])
  
  const placePredictions = async () => {
    setError(null)
    setTxHash(undefined)
    setCurrentStep("starting")
    
    // Validation
    if (predictions.some((p) => p.amount === undefined || p.amount <= 0)) {
      setError('You must enter an amount to continue')
      setTimeout(() => setError(null), 3000)
      setCurrentStep("idle")
      return
    }
    
    if (
      predictions.reduce((prev, cur) => prev + (cur.amount || 0), 0) >
      Number(tokenBalance?.formatted || 0)
    ) {
      setError(`Insufficient PEPO Balance`)
      setTimeout(() => setError(null), 3000)
      setCurrentStep("idle")
      return
    }
    
    setIsLoading(true)
    
    try {
      // Process predictions one by one
      for (const prediction of predictions) {
        const amount = parseEther(`${prediction.amount ?? 0}`)
        
        // IMPORTANT: Get the correct window ID to use
        setCurrentStep("getting_window_id")
        let windowId: bigint = BigInt(prediction.window.windowId)
        
        // For placeholder windows, we need special handling
        if (prediction.window.__isPlaceholder) {
          try {
            // First check if an active window exists
            const activeWindowId = await readContract({
              address: predictionMarketAddress,
              abi: multiPredictionMarketABI,
              functionName: 'activeWindowId',
              args: [BigInt(prediction.market.id)],
            }) as bigint
            
            // If active window exists, use that
            if (activeWindowId > BigInt(0)) {
              windowId = activeWindowId
              console.log(`Using active window ID: ${windowId} for market ${prediction.market.id}`)
            } else {
              // Otherwise get the next window ID to create a new window
              const nextWindowId = await readContract({
                address: predictionMarketAddress,
                abi: multiPredictionMarketABI,
                functionName: 'nextWindowId',
                args: [BigInt(prediction.market.id)],
              }) as bigint
              
              windowId = nextWindowId
              console.log(`Using next window ID: ${windowId} for market ${prediction.market.id}`)
            }
          } catch (error: any) {
            console.error("Error fetching window ID:", error)
            setError(`Failed to get window ID: ${error.message}`)
            setIsLoading(false)
            setCurrentStep("idle")
            return
          }
        }
        
        // Step 1: Approve PEPO tokens
        try {
          setCurrentStep("approving")
          console.log(`Approving ${amount} tokens for market ${prediction.market.id}, window ${windowId}`)
          const approvalTx = await approve({
            args: [predictionMarketAddress, amount],
          })
          
          console.log("Approval transaction submitted:", approvalTx.hash)
          
          setCurrentStep("waiting_for_approval")
          console.log("Waiting for approval transaction to complete...")
          const approvalReceipt = await waitForTransaction({
            hash: approvalTx.hash,
          })
          
          console.log("Approval transaction confirmed:", approvalReceipt)
        } catch (error: any) {
          console.error("Approval error:", error)
          setError(`Approval failed: ${error.message}`)
          setIsLoading(false)
          setCurrentStep("idle")
          return
        }
        
        // Step 2: Call predict with the correct window ID
        try {
          setCurrentStep("predicting")
          console.log(`Predicting on market ${prediction.market.id}, window ${windowId}, direction ${prediction.predictedDirection}`)
          const predictTx = await predict({
            args: [
              BigInt(prediction.market.id),
              windowId,
              Number(prediction.predictedDirection),
              amount
            ],
          })
          
          setTxHash(predictTx.hash)
          console.log("Prediction transaction submitted:", predictTx.hash)
          
          setCurrentStep("waiting_for_prediction")
          console.log("Waiting for prediction transaction to complete...")
          const predictReceipt = await waitForTransaction({
            hash: predictTx.hash,
          })
          
          console.log("Prediction transaction confirmed:", predictReceipt)
          
          // Successfully completed everything
          setPredictions([])
          setTab('my-predictions')
          
          // Trigger the callback to refresh prediction data
          if (onSuccessfulPrediction) {
            await onSuccessfulPrediction()
          }
          
        } catch (error: any) {
          console.error("Prediction error:", error)
          setError(`Prediction failed: ${error.message}`)
          setIsLoading(false)
          setCurrentStep("idle")
          return
        }
      }
      
      // All done!
      setIsLoading(false)
      setCurrentStep("idle")
      
    } catch (error: any) {
      console.error("Transaction error:", error)
      setError(`Transaction failed: ${error.message || 'Unknown error'}`)
      setIsLoading(false)
      setCurrentStep("idle")
    }
  }
  
  const getButtonText = () => {
    if (!isLoading) {
      return predictions.length === 1 ? 'Place Prediction' : 'Place Predictions'
    }
    
    switch (currentStep) {
      case "starting":
        return "Starting..."
      case "getting_window_id":
        return "Getting Window ID..."
      case "approving":
        return "Approving PEPO..."
      case "waiting_for_approval":
        return "Waiting for Approval..."
      case "predicting":
        return "Placing Prediction..."
      case "waiting_for_prediction":
        return "Waiting for Confirmation..."
      default:
        return "Processing..."
    }
  }
  
  return (
    <>
      <Button
        disabled={isLoading}
        onClick={async () => await placePredictions()}
        className="w-full bg-[#375BD2] text-base font-black leading-4 text-foreground hover:bg-[#375BD2]/90"
      >
        {isLoading ? (
          <Loader2 className="animate-spin mr-2" />
        ) : null}
        {getButtonText()}
      </Button>
      
      {error ? (
        <Alert
          variant="destructive"
          className="mt-4 flex items-center space-x-4 border-0 bg-[#FCCDCD] text-[#DE2624]"
        >
          <Image src="/alert-diamond.svg" width={24} height={24} alt="alert" />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      ) : null}
      
      {txHash && !error ? (
        <Alert className="mt-4 flex items-center space-x-4 border-0 bg-green-100 text-green-800">
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
