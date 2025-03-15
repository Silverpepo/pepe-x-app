'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useContractReads } from 'wagmi'
import { ScrollArea } from '@/components/ui/scroll-area'
import MarketWindowCard from '@/components/market-window-card'
import { WindowStatus, Direction, Window, Market } from '@/types'
import { predictionMarketAddress } from '@/config/contract'
import { multiPredictionMarketABI } from '@/generated'
import { transformMarketData, transformWindowData } from '@/config/api'

// Define type for the combined window with placeholder flag
type WindowWithPlaceholder = Window & { __isPlaceholder?: boolean };

// Maximum number of previous windows to show
const MAX_PREVIOUS_WINDOWS = 3;

export default function Home() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search') as string || ''
  
  // Track previous windows for each market - up to 3 per market
  const [marketPreviousWindows, setMarketPreviousWindows] = useState<Record<number, Window[]>>({})
  
  // Create contract config for both markets and windows
  const contractConfig = {
    address: predictionMarketAddress,
    abi: multiPredictionMarketABI,
  }
  
  // Fetch enabled markets
  const { data: marketsData, isLoading: marketsLoading } = useContractReads({
    contracts: [
      {
        ...contractConfig,
        functionName: 'getEnabledMarkets',
      }
    ],
  })
  
  const markets = marketsData?.[0]?.result 
    ? (marketsData[0].result as any[]).map(transformMarketData)
    : []
  
  // Filter markets by search if provided
  const filteredMarkets = searchQuery
    ? markets.filter(market => 
        market.pair.toLowerCase().includes(searchQuery.toLowerCase()))
    : markets
  
  // For each market, fetch latest windows
  const windowsContracts = filteredMarkets.map(market => ({
    ...contractConfig,
    functionName: 'getLatestWindows',
    args: [market.id, 10], // Fetch 10 latest windows per market
  }))
  
  const { data: windowsData, isLoading: windowsLoading, refetch: refetchWindows } = useContractReads({
    contracts: windowsContracts,
    enabled: filteredMarkets.length > 0,
  })
  
  // When windows data changes, update our previous windows state
  useEffect(() => {
    if (windowsData && filteredMarkets.length > 0) {
      const updatedPreviousWindows = { ...marketPreviousWindows };
      let hasChanges = false;
      
      filteredMarkets.forEach((market, index) => {
        if (!windowsData[index]?.result) return;
        
        const allWindows = (windowsData[index].result as any[]).map(transformWindowData);
        
        // Find all resolved windows for this market
        const resolvedWindows = allWindows
          .filter(w => w.status === WindowStatus.Resolved)
          .sort((a, b) => b.windowId - a.windowId); // Most recent first
          
        // Get the active or locked window (current window)
        const currentWindow = allWindows.find(w => 
          w.status === WindowStatus.Active || w.status === WindowStatus.Locked
        );
        
        // Only include resolved windows that are not the current window
        const filteredResolvedWindows = resolvedWindows
          .filter(w => !currentWindow || w.windowId !== currentWindow.windowId)
          .slice(0, MAX_PREVIOUS_WINDOWS);
          
        if (filteredResolvedWindows.length > 0) {
          // Only update if the windows have changed
          const currentResolvedIds = (marketPreviousWindows[market.id] || [])
            .map(w => w.windowId).sort().join(',');
          const newResolvedIds = filteredResolvedWindows
            .map(w => w.windowId).sort().join(',');
            
          if (currentResolvedIds !== newResolvedIds) {
            updatedPreviousWindows[market.id] = filteredResolvedWindows;
            hasChanges = true;
          }
        }
      });
      
      if (hasChanges) {
        setMarketPreviousWindows(updatedPreviousWindows);
      }
    }
  }, [windowsData, filteredMarkets, marketPreviousWindows]);
  
  // Handler for window transitions
  const handleWindowChange = (marketId: number, currentWindowId: number) => {
    refetchWindows();
  };
  
  // Helper function to create a placeholder window
  const createPlaceholderWindow = (market: Market, lastWindowId: number = 0): WindowWithPlaceholder => {
    return {
      marketId: market.id,
      windowId: lastWindowId + 1,  // Increment from the last window ID
      startTime: Math.floor(Date.now() / 1000),
      startPrice: 0,
      lockTime: Math.floor(Date.now() / 1000) + (market.windowDuration / 2),
      lockPrice: 0,
      closeTime: Math.floor(Date.now() / 1000) + market.windowDuration,
      closePrice: 0,
      status: WindowStatus.Active,
      winner: Direction.Up,
      upVolume: 0,
      downVolume: 0,
      rewardBaseAmount: 0,
      rewardAmount: 0,
      date: new Date(),
      __isPlaceholder: true
    };
  };
  
  // Process window data for each market
  const marketWindowsData = filteredMarkets.map((market, index) => {
    const windows = windowsData?.[index]?.result 
      ? (windowsData[index].result as any[]).map(transformWindowData)
      : [];
    
    // Sort windows by status and ID
    const sortedWindows = windows.sort((a, b) => {
      // Sort by status: Active first, then Locked, then Resolved
      if (a.status === WindowStatus.Active && b.status !== WindowStatus.Active) return -1;
      if (a.status === WindowStatus.Locked && b.status === WindowStatus.Resolved) return -1;
      if (a.status === b.status) return b.windowId - a.windowId; // Higher window ID first
      return 1;
    });
    
    // Find active or locked windows
    const activeOrLockedWindow = sortedWindows.find(w => 
      w.status === WindowStatus.Active || w.status === WindowStatus.Locked
    );
    
    // Find the most recent window (for determining next ID)
    const mostRecentWindow = sortedWindows.length > 0 ? sortedWindows[0] : null;
    const lastWindowId = mostRecentWindow ? mostRecentWindow.windowId : 0;
    
    // The display window will be either:
    // 1. An active/locked window if one exists
    // 2. A new placeholder window if all windows are resolved
    let displayWindow: WindowWithPlaceholder;
    
    if (activeOrLockedWindow) {
      // If we have an active or locked window, display that
      displayWindow = activeOrLockedWindow;
    } else {
      // If all windows are resolved or there are no windows, create a placeholder
      displayWindow = createPlaceholderWindow(market, lastWindowId);
    }
    
    // Get previous windows, excluding the current displayWindow
    const previousWindows = marketPreviousWindows[market.id] || [];
      
    return { 
      market, 
      currentWindow: displayWindow,
      previousWindows
    };
  });
  
  if (marketsLoading || windowsLoading) {
    return <div className="flex justify-center items-center h-[calc(100vh-64px)]">Loading...</div>
  }
  
  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      {marketWindowsData.map(({ market, currentWindow, previousWindows }) => (
        <div key={market.id} className="max-w-[100vw] mt-6 mb-8">
          <MarketWindowCard 
            key={`${market.id}-${currentWindow.windowId}`} 
            market={market}
            window={currentWindow}
            previousWindows={previousWindows}
            onWindowChange={(windowId) => handleWindowChange(market.id, windowId)}
          />
        </div>
      ))}
      
      {filteredMarkets.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">
            {searchQuery ? `No markets found matching "${searchQuery}"` : "No markets available"}
          </p>
        </div>
      )}
    </ScrollArea>
  );
}
