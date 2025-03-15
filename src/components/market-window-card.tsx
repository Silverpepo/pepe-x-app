'use client'
import Image from 'next/image'
import { format } from 'date-fns'
import PredictButton from '@/components/predict-button'
import { Direction, Window, WindowStatus, Market } from '@/types'
import { ArrowUp, ArrowDown, BarChart2, ChevronDown, ChevronUp } from 'lucide-react'
import { formatDuration, formatNumber, convertContractPriceToUSD } from '@/lib/formatting'
import { useEffect, useState, useCallback } from 'react'
import { useContractRead, useContractReads } from 'wagmi'
import { multiPredictionMarketABI } from '@/generated'
import { predictionMarketAddress } from '@/config/contract'
import { useChainlinkPrice } from '@/hooks/useChainlinkPrice'
import { PriceChart } from '@/components/price-chart'
import ChainlinkInfoModal from '@/components/chainlink-info-modal'

const processContractData = (contractData: any, fallbackWindow: Window): Window => {
  if (!contractData) return fallbackWindow;
  try {
    return {
      ...fallbackWindow,
      startTime: contractData.startTime ? Number(contractData.startTime) : fallbackWindow.startTime,
      lockTime: contractData.lockTime ? Number(contractData.lockTime) : fallbackWindow.lockTime,
      startPrice: contractData.startPrice ? convertContractPriceToUSD(contractData.startPrice) : fallbackWindow.startPrice,
      lockPrice: contractData.lockPrice ? convertContractPriceToUSD(contractData.lockPrice) : fallbackWindow.lockPrice,
      closePrice: contractData.closePrice ? convertContractPriceToUSD(contractData.closePrice) : fallbackWindow.closePrice,
      closeTime: contractData.closeTime ? Number(contractData.closeTime) : fallbackWindow.closeTime,
      status: contractData.status !== undefined ? Number(contractData.status) as WindowStatus : fallbackWindow.status,
      winner: contractData.winner !== undefined ? Number(contractData.winner) as Direction : fallbackWindow.winner
    };
  } catch (error) {
    console.error("Error processing contract data:", error, contractData);
    return fallbackWindow;
  }
};

export default function MarketWindowCard({
  market,
  window,
  previousWindows = [],
  onWindowChange
}: {
  market: Market
  window: Window & { __isPlaceholder?: boolean }
  previousWindows?: Window[]
  onWindowChange?: (windowId: number) => void
}) {
  const isPlaceholder = (window as any).__isPlaceholder;
  const isActive = window.status === WindowStatus.Active;
  const logo = market.logo || '/na.webp';
  const [processedWindow, setProcessedWindow] = useState(window);
  const [processedPreviousWindows, setProcessedPreviousWindows] = useState<Window[]>(previousWindows);

  // Track active tab, modal visibility and whether it's expanded
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isChainlinkModalOpen, setIsChainlinkModalOpen] = useState(false);

  // Check localStorage on component mount
  useEffect(() => {
    // This useEffect ensures localStorage is only accessed on the client side
    // No need to set additional state since we check localStorage directly when needed
  }, []);

  // Chainlink price feed integration
  const { formattedPrice: livePrice, isLoading: priceLoading, hasAddress: hasPriceFeed } = useChainlinkPrice(market.pair);

  const { data: windowData, isLoading: windowLoading } = useContractRead({
    address: predictionMarketAddress,
    abi: multiPredictionMarketABI,
    functionName: 'getWindow',
    args: [BigInt(window.marketId), BigInt(window.windowId)],
    enabled: !isPlaceholder && window.marketId !== undefined && window.windowId !== undefined,
  });

  const previousWindowContracts = previousWindows.map(prevWindow => ({
    address: predictionMarketAddress,
    abi: multiPredictionMarketABI,
    functionName: 'getWindow',
    args: [BigInt(prevWindow.marketId), BigInt(prevWindow.windowId)],
  }));

  const { data: previousWindowsData, isLoading: previousWindowsLoading, isSuccess: previousWindowsSuccess } = useContractReads({
    contracts: previousWindowContracts,
    enabled: previousWindows.length > 0,
  });

  useEffect(() => {
    if (windowData && !isPlaceholder) {
      console.log("Current window contract data:", windowData);
      const updatedWindow = processContractData(windowData, window);
      setProcessedWindow(updatedWindow);
      if (updatedWindow.status === WindowStatus.Resolved && onWindowChange) {
        onWindowChange(window.windowId);
      }
    }
  }, [windowData, window, isPlaceholder, onWindowChange]);

  useEffect(() => {
    if (previousWindowsSuccess && previousWindowsData && previousWindows.length > 0) {
      console.log("Previous windows contract data:", previousWindowsData);
      const updatedWindows = previousWindows.map((prevWindow, index) => {
        const contractResult = previousWindowsData[index];
        return processContractData(contractResult?.result, prevWindow);
      });
      setProcessedPreviousWindows(updatedWindows);
    } else {
      setProcessedPreviousWindows(previousWindows);
    }
  }, [previousWindowsData, previousWindows, previousWindowsSuccess]);

  const priceChange = !isPlaceholder && processedWindow.lockPrice
    ? ((processedWindow.closePrice - processedWindow.lockPrice) / processedWindow.lockPrice) * 100
    : processedWindow.startPrice
      ? ((processedWindow.lockPrice - processedWindow.startPrice) / processedWindow.startPrice) * 100
      : 0;
  const isPositive = priceChange >= 0;

  const calculatePriceChange = (window: Window) => {
    if (!window || !window.lockPrice) return 0;
    return ((window.closePrice - window.lockPrice) / window.lockPrice) * 100;
  };

  // Handle tab click
  const handleTabClick = (tab: string) => {
    if (tab === activeTab) {
      // If clicking the active tab, collapse it
      setActiveTab(null);
    } else {
      // Otherwise, switch to the new tab
      setActiveTab(tab);
    }

    // If clicking on the chainlink chart tab and modal hasn't been dismissed, show it
    if (tab === 'chainlinkChart' && localStorage.getItem('hideChainlinkModal') !== 'true') {
      setIsChainlinkModalOpen(true);
    }
  };

  // Close modal handler
  const handleCloseModal = useCallback(() => {
    setIsChainlinkModalOpen(false);
  }, []);

  // Handler for "Don't show again" preference
  const handleDontShowAgain = useCallback(() => {
    localStorage.setItem('hideChainlinkModal', 'true');
  }, []);

  return (
    <div className="mx-4 mb-4">
      <div className="rounded-t-[8px] bg-card p-4">
        {isPlaceholder ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <Image
                src={logo}
                width={24}
                height={24}
                className="max-h-[24px] max-w-[24px] object-contain"
                alt={market.pair}
              />
              <p className="ml-2 truncate font-[450] md:flex-1">
                {market.pair}
                {hasPriceFeed && (
                  priceLoading ? (
                    <span className="text-xs text-secondary-foreground ml-1">(Loading...)</span>
                  ) : livePrice ? (
                    <span className="text-xs font-semibold ml-1 text-green-400">
                      (${livePrice})
                    </span>
                  ) : null
                )}
                <span className="text-xs text-secondary-foreground ml-1">Window #{window.windowId}</span>
              </p>
              <span className="px-2 py-1 rounded text-xs bg-primary/20 text-primary">
                New Window
              </span>
            </div>
            <div className="mb-3 text-center">
              <p className="text-sm text-secondary-foreground">
                Be the first to place a prediction in this market
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <PredictButton market={market} window={window} predictedDirection={Direction.Up} isNewWindow={true} />
              </div>
              <div className="mx-2 text-center">
                <p className="text-xs text-secondary-foreground">vs</p>
              </div>
              <div>
                <PredictButton market={market} window={window} predictedDirection={Direction.Down} isNewWindow={true} />
              </div>
            </div>
            <p className="mt-3 text-[12px] font-[450] leading-4 text-secondary-foreground">
              Window duration: {formatDuration(market.windowDuration)}
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <Image
                src={logo}
                width={24}
                height={24}
                className="max-h-[24px] max-w-[24px] object-contain"
                alt={market.pair}
              />
              <p className="ml-2 truncate font-[450] md:flex-1">
                {market.pair}
                {hasPriceFeed && (
                  priceLoading ? (
                    <span className="text-xs text-secondary-foreground ml-1">(Loading...)</span>
                  ) : livePrice ? (
                    <span className="text-xs font-semibold ml-1 text-green-400">
                      (${livePrice})
                    </span>
                  ) : null
                )}
                <span className="text-xs text-secondary-foreground ml-1">Window #{window.windowId}</span>
              </p>
              {isActive ? (
                <span className="px-2 py-1 rounded text-xs bg-green-900 text-green-200">
                  Active
                </span>
              ) : processedWindow.status === WindowStatus.Locked ? (
                <span className="px-2 py-1 rounded text-xs bg-yellow-900 text-yellow-200">
                  Locked
                </span>
              ) : (
                <span className="px-2 py-1 rounded text-xs bg-blue-900 text-blue-200">
                  Resolved
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-secondary-foreground">Start Price</p>
                <p className="font-medium">
                  {windowLoading ? 'Loading...' :
                    `$${processedWindow.startPrice > 0 ? formatNumber(processedWindow.startPrice) : '0.00'}`}
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary-foreground">Current/Lock Price</p>
                <p className="font-medium">
                  {windowLoading ? 'Loading...' :
                    processedWindow.lockPrice > 0 ? `$${formatNumber(processedWindow.lockPrice)}` : "Pending"}
                </p>
              </div>
            </div>
            {processedWindow.status === WindowStatus.Resolved && (
              <div className="mb-3">
                <p className="text-xs text-secondary-foreground">Close Price</p>
                <div className="flex items-center">
                  <p className="font-medium">
                    {windowLoading ? 'Loading...' :
                      `$${processedWindow.closePrice > 0 ? formatNumber(processedWindow.closePrice) : '0.00'}`}
                  </p>
                  <span className={`ml-2 px-1 text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}{formatNumber(priceChange)}%
                  </span>
                </div>
              </div>
            )}
            {processedWindow.status !== WindowStatus.Resolved && (
              <div className="flex items-center justify-between mb-3">
                <div>
                  <PredictButton market={market} window={processedWindow} predictedDirection={Direction.Up} />
                </div>
                <div className="mx-2 text-center">
                  <p className="text-xs text-secondary-foreground">vs</p>
                </div>
                <div>
                  <PredictButton market={market} window={processedWindow} predictedDirection={Direction.Down} />
                </div>
              </div>
            )}
            <p className="text-[12px] font-[450] leading-4 text-secondary-foreground">
              {isActive ? (
                `Locks: ${format(new Date(processedWindow.lockTime * 1000), 'MMM d @ h:mm aaa')}`
              ) : processedWindow.status === WindowStatus.Locked ? (
                `Resolves: ${format(new Date(processedWindow.closeTime * 1000), 'MMM d @ h:mm aaa')}`
              ) : (
                `Resolved: ${format(new Date(processedWindow.closeTime * 1000), 'MMM d @ h:mm aaa')}`
              )}
            </p>
          </>
        )}
      </div>

      {/* Custom Tabs for Previous Windows and Chainlink Chart */}
      <div className="rounded-b-[8px] bg-card border-t border-border">
        {/* Tab Headers */}
        <div className="flex flex-col sm:flex-row w-full bg-transparent border-b border-border">
          <button
            onClick={() => handleTabClick('previousWindows')}
            className={`flex items-center justify-between rounded-none py-3 px-4 border-b-2 w-full sm:w-1/2 text-sm font-medium transition-colors ${activeTab === 'previousWindows'
              ? 'border-[#375BD2] bg-transparent'
              : 'border-transparent hover:bg-secondary/10'
              }`}
          >
            <span className="flex items-center space-x-2">
              <Image
                src="/past-prediction.svg"
                width={20}
                height={20}
                alt="Past Predictions"
                className="invert"
              />
              <span>Previous Windows</span>
              {processedPreviousWindows.length > 0 && (
                <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-xs">{processedPreviousWindows.length}</span>
              )}
            </span>
            {activeTab === 'previousWindows' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button
            onClick={() => handleTabClick('chainlinkChart')}
            className={`flex items-center justify-between rounded-none py-3 px-4 border-b-2 w-full sm:w-1/2 text-sm font-medium transition-colors ${activeTab === 'chainlinkChart'
              ? 'border-[#375BD2] bg-transparent'
              : 'border-transparent hover:bg-secondary/10'
              }`}
          >
            <span className="flex items-center space-x-2">
              <BarChart2 className="h-4 w-4" />
              <span>Chainlink Chart</span>
            </span>
            {activeTab === 'chainlinkChart' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Previous Windows Content */}
        {activeTab === 'previousWindows' && (
          <div className="px-4 space-y-2 mt-1 pb-3">
            {previousWindowsLoading ? (
              <div className="text-center py-2 text-secondary-foreground">Loading previous windows...</div>
            ) : processedPreviousWindows.length === 0 ? (
              <div className="text-center py-8 text-secondary-foreground">
                <p>No previous windows available</p>
                <p className="text-xs mt-2">Windows will appear here once they are resolved</p>
              </div>
            ) : (
              processedPreviousWindows.map((prevWindow, index) => {
                const prevPriceChange = calculatePriceChange(prevWindow);
                const isPrevPositive = prevPriceChange >= 0;
                return (
                  <div key={prevWindow.windowId} className="rounded-md bg-card/70 p-3 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">
                        Window #{prevWindow.windowId}
                      </p>
                      <span className="flex items-center">
                        <Image
                          src="/winner-cup.svg"
                          width={20}
                          height={20}
                          alt="winner-cup"
                        />
                        <span className={prevWindow.winner === Direction.Up ? 'text-green-400 text-xs ml-1' : 'text-red-400 text-xs ml-1'}>
                          {prevWindow.winner === Direction.Up ? 'Up' : 'Down'}
                        </span>
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                      <div>
                        <p className="text-xs text-secondary-foreground">Start Price</p>
                        <p className="text-sm font-medium">
                          ${formatNumber(prevWindow.startPrice)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-secondary-foreground">Lock Price</p>
                        <p className="text-sm font-medium">
                          ${formatNumber(prevWindow.lockPrice)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-secondary-foreground">Close Price</p>
                        <div className="flex items-center">
                          <p className="text-sm font-medium">
                            ${formatNumber(prevWindow.closePrice)}
                          </p>
                          <span className={`ml-1 text-xs ${isPrevPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPrevPositive ? '+' : ''}{formatNumber(prevPriceChange)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-secondary-foreground">
                      Resolved: {format(new Date(prevWindow.closeTime * 1000), 'MMM d @ h:mm aaa')}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Chainlink Chart Content */}
        {activeTab === 'chainlinkChart' && (
          <div className="px-4 pt-3 pb-3">
            <PriceChart
              priceFeedAddress={market.priceFeed}
              marketName={market.pair} // Pass the market pair as the market name
              height={140}
              className="mb-2"
            />
          </div>
        )}
      </div>

      {/* Chainlink Info Modal */}
      <ChainlinkInfoModal
        isOpen={isChainlinkModalOpen}
        onClose={handleCloseModal}
        onDontShowAgain={handleDontShowAgain}
      />
    </div>
  );
}