import { Address } from 'viem'

export const predictionMarketAddress = process.env
  .NEXT_PUBLIC_MULTI_PREDICTION_MARKET_ADDRESS as Address

export const tokenAddress = process.env
  .NEXT_PUBLIC_TOKEN_ADDRESS as Address

export const dutchAuctionAddress = process.env
  .NEXT_PUBLIC_DUTCH_AUCTION_ADDRESS as Address

// Chainlink Price Feed Addresses
export const priceFeedAddresses = {
  'BTC-USD': process.env.NEXT_PUBLIC_BTC_USD_PRICE_FEED_ADDRESS as Address,
  'ETH-USD': process.env.NEXT_PUBLIC_ETH_USD_PRICE_FEED_ADDRESS as Address,
  'LINK-USD': process.env.NEXT_PUBLIC_LINK_USD_PRICE_FEED_ADDRESS as Address,
  'CBETH-USD': process.env.NEXT_PUBLIC_CBETH_USD_PRICE_FEED_ADDRESS as Address,
}



export const defaultChainId = 84532 // Base Sepolia
