'use client'
import { useLocalStateContext } from '@/app/context'
import { Button } from '@/components/ui/button'
import { Direction, Market, Window, WindowStatus } from '@/types'
import { ArrowUp, ArrowDown } from 'lucide-react'

type PredictButtonProps = {
  market: Market
  window: Window
  predictedDirection: Direction
  isNewWindow?: boolean
}

export default function PredictButton({
  market,
  window,
  predictedDirection,
  isNewWindow = false,
}: PredictButtonProps) {
  const { predictions, setPredictions, setTab } = useLocalStateContext()
  
  // For new windows, we don't need to check for existing predictions
  // For regular windows, find existing predictions
  const existingPrediction = !isNewWindow 
    ? predictions.find(
        (p) => p.window.windowId === window.windowId && p.market.id === market.id
      )
    : undefined
  
  // New windows should always be enabled, regular windows only when active
  const isDisabled = !isNewWindow && window.status !== WindowStatus.Active
  
  const handlePrediction = () => {
    // window already has __isPlaceholder property in its type now
    setPredictions([...predictions, { market, window, predictedDirection }])
    setTab('predictionslip')
  }
  
  // No existing prediction or new window - show active button
  if (!existingPrediction) {
    return (
      <Button
        onClick={handlePrediction}
        disabled={isDisabled}
        className={`w-[110px] shrink-0 text-[12px] font-bold 
          ${predictedDirection === Direction.Up 
            ? 'hover:bg-green-800 hover:text-green-100' 
            : 'hover:bg-red-800 hover:text-red-100'}`}
      >
        {predictedDirection === Direction.Up ? (
          <><ArrowUp className="mr-1 h-4 w-4" /> Price Up</>
        ) : (
          <><ArrowDown className="mr-1 h-4 w-4" /> Price Down</>
        )}
      </Button>
    )
  }
  
  // Already selected this direction
  if (predictedDirection === existingPrediction.predictedDirection) {
    return (
      <Button
        disabled
        className={`w-[110px] shrink-0 text-[12px] font-bold text-foreground 
          ${predictedDirection === Direction.Up 
            ? 'disabled:bg-green-800 disabled:opacity-100'
            : 'disabled:bg-red-800 disabled:opacity-100'}`}
      >
        {predictedDirection === Direction.Up ? (
          <><ArrowUp className="mr-1 h-4 w-4" /> Selected</>
        ) : (
          <><ArrowDown className="mr-1 h-4 w-4" /> Selected</>
        )}
      </Button>
    )
  }
  
  // Selected the opposite direction
  return (
    <Button
      disabled
      className="w-[110px] shrink-0 text-[12px] font-bold text-foreground disabled:bg-gray-700 disabled:opacity-70"
    >
      {predictedDirection === Direction.Up ? (
        <><ArrowUp className="mr-1 h-4 w-4" /> Price Up</>
      ) : (
        <><ArrowDown className="mr-1 h-4 w-4" /> Price Down</>
      )}
    </Button>
  )
}
