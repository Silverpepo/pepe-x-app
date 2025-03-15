export enum Direction {
  Up = 0,
  Down = 1,
  Draw = 2,
}

export enum WindowStatus {
  Active = 0,
  Locked = 1,
  Resolved = 2,
}

export type Market = {
  id: number
  pair: string
  priceFeed: string
  windowDuration: number
  treasuryFee: number
  enabled: boolean
  logo?: string // For UI compatibility
}

export type Window = {
  marketId: number
  windowId: number
  startTime: number
  startPrice: number
  lockTime: number
  lockPrice: number
  closeTime: number
  closePrice: number
  status: WindowStatus
  winner: Direction
  upVolume: number
  downVolume: number
  rewardBaseAmount: number
  rewardAmount: number
  date: Date // For UI compatibility with existing components
  __isPlaceholder?: boolean // Flag for placeholder windows that shouldn't be sent to contract
}

export type WindowStats = {
  totalParticipants: number
  upParticipants: number
  downParticipants: number
  avgBetSize: number
  largestBet: number
  priceVolatility: number
}

export type CompleteWindowData = Window & WindowStats & {
  totalVolume: number
  isActive: boolean
}



export type UserStats = {
  totalPredictions: number
  correctPredictions: number
  totalVolume: number
  totalWinnings: number
  currentStreak: number
  bestStreak: number
  lastPredictionTime: number
}

export type Prediction = {
  market: Market
  window: Window
  predictedDirection: Direction
  amount?: number
  toWin?: number
}

export type PredictionResponse = {
  marketId: number
  windowId: number
  direction: Direction
  amount: bigint
  claimed: boolean
  index?: number
}

// auction bids

export type AuctionBid = {
  amount: number
  estimatedTokens: number
  currentPrice: number
  timestamp: number
}