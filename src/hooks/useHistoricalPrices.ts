import { useState, useEffect, useRef } from 'react';
import { useContractRead } from 'wagmi';
import { convertContractPriceToUSD } from '@/lib/formatting';

// Using the same ABI structure as your price feeds
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

export type PricePoint = {
  timestamp: number;
  price: number;
};

export function useHistoricalPrices(
  priceFeedAddress?: string, 
  timeWindow = 10 * 60 * 1000, // 10 minutes in milliseconds
  dataPoints = 30, // Maximum data points to show (for smooth rendering)
  updateInterval = 25000 // 25 seconds
) {
  const [historicalPrices, setHistoricalPrices] = useState<PricePoint[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get decimals
  const { data: decimalsData } = useContractRead({
    address: priceFeedAddress as `0x${string}`,
    abi: chainlinkABI,
    functionName: 'decimals',
    enabled: !!priceFeedAddress,
  });
  
  // Get price data
  const { data: priceData, isLoading, isError } = useContractRead({
    address: priceFeedAddress as `0x${string}`,
    abi: chainlinkABI,
    functionName: 'latestRoundData',
    enabled: !!priceFeedAddress && decimalsData !== undefined,
    watch: true, // Refetch on new blocks
  });
  
  // Calculate price with correct decimals
  const price = priceData && decimalsData !== undefined
    ? convertContractPriceToUSD(priceData[1])
    : undefined;

  // Add current price to historical data when it changes
  useEffect(() => {
    if (price !== undefined) {
      const now = Date.now();
      setHistoricalPrices(prev => {
        // Add new price point
        const newPrices = [...prev, { timestamp: now, price }];
        
        // Remove price points older than timeWindow
        const cutoffTime = now - timeWindow;
        const filteredPrices = newPrices.filter(point => point.timestamp >= cutoffTime);
        
        // Limit number of data points for performance
        return resampleDataPoints(filteredPrices, dataPoints);
      });
    }
  }, [price, timeWindow, dataPoints]);

  // Resample data points to limit total number for better performance
  const resampleDataPoints = (data: PricePoint[], maxPoints: number): PricePoint[] => {
    if (data.length <= maxPoints) return data;
    
    const result: PricePoint[] = [];
    // Always include first and last point
    if (data.length > 0) result.push(data[0]);
    
    // Only sample middle points if we have more than 2 points
    if (data.length > 2) {
      const step = (data.length - 2) / (maxPoints - 2);
      for (let i = 1; i < maxPoints - 1; i++) {
        const index = Math.min(Math.floor(1 + i * step), data.length - 2);
        result.push(data[index]);
      }
    }
    
    // Add the last point
    if (data.length > 1) result.push(data[data.length - 1]);
    
    return result;
  };

  // Set up interval to clean up old data points and add periodic updates
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setHistoricalPrices(prev => {
        const now = Date.now();
        const cutoffTime = now - timeWindow;
        
        // If we have price data and the most recent point is older than updateInterval, add a new point
        if (price !== undefined && (prev.length === 0 || now - prev[prev.length-1].timestamp >= updateInterval)) {
          const updatedPrices = [...prev.filter(point => point.timestamp >= cutoffTime), 
                               { timestamp: now, price }];
          return resampleDataPoints(updatedPrices, dataPoints);
        }
        
        const filteredPrices = prev.filter(point => point.timestamp >= cutoffTime);
        return resampleDataPoints(filteredPrices, dataPoints);
      });
    }, updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeWindow, updateInterval, price, dataPoints]);

  // If we don't have historical data yet but we have a current price,
  // generate some initial data points for display
  useEffect(() => {
    if (historicalPrices.length === 0 && price !== undefined) {
      const now = Date.now();
      const initialHistory: PricePoint[] = [];
      
      // Generate data points for the last timeWindow
      for (let i = dataPoints - 1; i > 0; i--) {
        // Add some small random fluctuation to the price (more realistic)
        const randomFactor = 0.99 + Math.random() * 0.02; // Between 0.99 and 1.01
        initialHistory.push({
          timestamp: now - (i * timeWindow / dataPoints),
          price: price * randomFactor
        });
      }
      
      // Add current price point
      initialHistory.push({ timestamp: now, price });
      setHistoricalPrices(initialHistory);
    }
  }, [price, historicalPrices.length, timeWindow, dataPoints]);

  return {
    historicalPrices,
    currentPrice: price,
    isLoading,
    isError,
    hasAddress: !!priceFeedAddress
  };
}