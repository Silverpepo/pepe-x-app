'use client'
import { createContext, useContext, useState } from 'react'
import { WindowStatus } from '@/types'
import { Prediction } from '@/types'

export const LocalStateContext = createContext<{
  predictions: Prediction[]
  error: string
  setPredictions: (predictions: Prediction[]) => void
  tab: string
  setTab: (tab: string) => void
}>({
  predictions: [],
  error: '',
  setPredictions: () => null,
  tab: 'predictionslip',
  setTab: () => null,
})
export const LocalStateContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [predictions, setPredictionsState] = useState<Prediction[]>([])
  const [error, setError] = useState('')
  const [tab, setTab] = useState('predictionslip')
  const setPredictions = (predictions: Prediction[]) => {
    if (predictions.some((p) => p.window.status !== WindowStatus.Active)) {
      setError('You can only make predictions for active windows')
      setTimeout(() => setError(''), 5000)
      return
    }
    setPredictionsState(predictions)
  }
  return (
    <LocalStateContext.Provider
      value={{ predictions, error, setPredictions, tab, setTab }}
    >
      {children}
    </LocalStateContext.Provider>
  )
}
export const useLocalStateContext = () => useContext(LocalStateContext)