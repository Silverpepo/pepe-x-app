import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { useHistoricalPrices, PricePoint } from '@/hooks/useHistoricalPrices';
import { formatNumber } from '@/lib/formatting';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';

interface PriceChartProps {
  priceFeedAddress?: string;
  height?: number;
  className?: string;
  marketName: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({ 
  priceFeedAddress, 
  height = 150,
  className = "",
  marketName = "BTC/USD"
}) => {
  const { historicalPrices, currentPrice, isLoading, isError } = 
    useHistoricalPrices(priceFeedAddress);

  // Format data for Recharts
  const chartData = useMemo(() => {
    return historicalPrices.map(point => ({
      time: point.timestamp,
      price: point.price,
      formattedTime: format(new Date(point.timestamp), 'HH:mm')
    }));
  }, [historicalPrices]);
  
  // Custom price formatter to prevent overlap
  const formatAxisPrice = (value: number) => {
    // Format with fewer decimal places for Y-axis labels
    return value >= 1000 ? 
      `$${(value/1000).toFixed(1)}K` : 
      `$${value.toFixed(0)}`;
  };

  // Render loading/error states
  if (isLoading && historicalPrices.length === 0) {
    return <div className={`flex items-center justify-center ${className}`} style={{ height }}>Loading price data...</div>;
  }
  if (isError || !priceFeedAddress || historicalPrices.length === 0) {
    return <div className={`flex items-center justify-center ${className}`} style={{ height }}>No price data available</div>;
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-2">
        <span className="text-xl font-bold mr-2">
          ${formatNumber(currentPrice || chartData[chartData.length - 1]?.price || 0)}
        </span>
        <span className="text-lg font-bold text-secondary-foreground">
          {marketName}
        </span>
        <div className="text-xs text-secondary-foreground">
          {format(new Date(), "MMM d, yyyy, h:mm a")}
        </div>
      </div>
      
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 35, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#375BD2" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#375BD2" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2D3748" strokeOpacity={0.3} />
            <XAxis 
              dataKey="time" 
              tickFormatter={(time) => format(new Date(time), 'HH:mm')}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#6B7280' }}
              minTickGap={30}
            />
            <YAxis 
              orientation="right"
              domain={['auto', 'auto']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#6B7280' }}
              tickFormatter={formatAxisPrice}
              width={35}
              tickCount={5}
            />
            <Tooltip 
              formatter={(value: number) => [`$${formatNumber(value)}`, 'Price']}
              labelFormatter={(label) => format(new Date(label), 'MMM d, h:mm:ss a')}
              contentStyle={{ backgroundColor: '#1a1c23', border: '1px solid #2a2d36' }}
              itemStyle={{ color: '#ffffff' }}
              cursor={{ stroke: '#ffffff', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#375BD2" 
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorPrice)" 
              dot={false}
              activeDot={{ 
                r: 4, 
                stroke: '#222222', 
                strokeWidth: 1, 
                fill: '#FFD700' 
              }}
            />
            {currentPrice && (
              <ReferenceLine 
                y={currentPrice} 
                stroke="#375BD2" 
                strokeDasharray="3 3" 
                strokeWidth={1}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-end mt-1">
        <div className="flex items-center space-x-1 text-xs text-secondary-foreground">
          <span>Market data secured with</span>
          <img 
            src="/chainlink-logo.svg" 
            alt="Chainlink Logo"
            className="invert h-3.5"
            width={50}
            height={15}
          />
        </div>
      </div>
    </div>
  );
};