import { Direction, Market, CompleteWindowData, Window } from '@/types'

// Mapping for contract interaction
export const directionToContractValue = {
  [Direction.Up]: 0,
  [Direction.Down]: 1,
  [Direction.Draw]: 2,
}

// Market logos for UI
export const marketLogos: {
  [pair: string]: string
} = {
  'BTC-USD': '/tokens/btc.svg',
  'ETH-USD': '/tokens/eth.svg',
  'LINK-USD': '/tokens/link.svg',
  'USDC-USD': '/tokens/usdc.svg',
  'USDT-USD': '/tokens/usdt.svg',
  'PEPO-USD': '/tokens/PEPO.svg',
  'SOL-USD': '/tokens/solana.svg',
  'AVAX-USD': '/tokens/avax.svg',
  'DOGE-USD': '/tokens/dogecoin.svg',
  'DAI-USD': '/tokens/dai.svg',
  'WETH-USD': '/tokens/weth.svg',
  'CAKE-USD': '/tokens/cake.svg',
  'OP-USD': '/tokens/optimism.svg',
  'BASE-USD': '/tokens/base.svg',
  'CBETH-ETH': '/tokens/cbeth.svg'
}

// Helper function to transform contract data
export const transformMarketData = (marketData: any): Market => {
  return {
    id: Number(marketData.marketId),
    pair: marketData.pair,
    priceFeed: marketData.priceFeed,
    windowDuration: Number(marketData.windowDuration),
    treasuryFee: Number(marketData.treasuryFee),
    enabled: marketData.enabled,
    logo: marketLogos[marketData.pair] || '/na.webp'
  }
}

export const transformWindowData = (windowData: any): Window => {
  return {
    marketId: Number(windowData.marketId),
    windowId: Number(windowData.windowId),
    startTime: Number(windowData.startTime),
    startPrice: Number(windowData.startPrice) / 1e18, // Convert from Wei
    lockTime: Number(windowData.lockTime),
    lockPrice: Number(windowData.lockPrice) / 1e18,
    closeTime: Number(windowData.closeTime),
    closePrice: Number(windowData.closePrice) / 1e18,
    status: Number(windowData.status),
    winner: Number(windowData.winner),
    upVolume: Number(windowData.upVolume) / 1e18,
    downVolume: Number(windowData.downVolume) / 1e18,
    rewardBaseAmount: Number(windowData.rewardBaseAmount) / 1e18,
    rewardAmount: Number(windowData.rewardAmount) / 1e18,
    date: new Date(Number(windowData.startTime) * 1000), // for UI compatibility
  }
}

export const transformCompleteWindowData = (windowData: any): CompleteWindowData => {
  return {
    ...transformWindowData(windowData),
    totalParticipants: Number(windowData.totalParticipants),
    upParticipants: Number(windowData.upParticipants),
    downParticipants: Number(windowData.downParticipants),
    avgBetSize: Number(windowData.avgBetSize) / 1e18,
    largestBet: Number(windowData.largestBet) / 1e18,
    priceVolatility: Number(windowData.priceVolatility),
    totalVolume: Number(windowData.totalVolume) / 1e18,
    isActive: windowData.isActive,
  }
}
