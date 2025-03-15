import { useContractRead } from 'wagmi';
import { formatNumber } from '@/lib/formatting';
import { priceFeedAddresses } from '@/config/contract';

// Standard ABI for Chainlink Price Feed
const chainlinkABI = [
  {
    inputs: [],
    name: 'latestRoundData',
    outputs: [
      { name: 'roundId', type: 'uint80' },
      { name: 'answer', type: 'int256' },
      { name: 'startedAt', type: 'uint256' },
      { name: 'updatedAt', type: 'uint256' },
      { name: 'answeredInRound', type: 'uint80' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// Get price feed address from centralized config
const getPriceFeedAddress = (pair: string): `0x${string}` | undefined => {
  const address = priceFeedAddresses[pair as keyof typeof priceFeedAddresses];
  return address ? address : undefined;
};

export function useChainlinkPrice(pair: string) {
  const priceFeedAddress = getPriceFeedAddress(pair);
  
  // Get decimals
  const { data: decimalsData } = useContractRead({
    address: priceFeedAddress,
    abi: chainlinkABI,
    functionName: 'decimals',
    enabled: !!priceFeedAddress,
  });
  
  // Get price data
  const { data: priceData, isLoading, isError } = useContractRead({
    address: priceFeedAddress,
    abi: chainlinkABI,
    functionName: 'latestRoundData',
    enabled: !!priceFeedAddress && decimalsData !== undefined,
    watch: true, // Refetch on new blocks
  });
  
  // Calculate price with correct decimals
  const price = priceData && decimalsData !== undefined
    ? Number(priceData[1]) / (10 ** Number(decimalsData))
    : undefined;
  
  // Format price for display
  const formattedPrice = price !== undefined
    ? formatNumber(price, 2)
    : undefined;
  
  return {
    price,
    formattedPrice,
    isLoading,
    isError,
    hasAddress: !!priceFeedAddress
  };
}
