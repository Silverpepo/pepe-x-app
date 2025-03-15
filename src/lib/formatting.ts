/**
 * Formats a number with commas as thousands separators and a specified number of decimal places
 * @param value The number to format
 * @param decimals The number of decimal places to include
 * @returns Formatted number string with commas
 */
export function formatNumber(value: number | string | undefined, decimals = 4): string {
  if (value === undefined) return '0.0000';
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes < 60) {
      if (remainingSeconds === 0) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
      } else {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
      }
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    
    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  }



/**
 * Converts contract price values to USD display value
 * @param contractPrice The raw price value from the contract (bigint or number)
 * @returns Converted USD price value as a number
 */
export function convertContractPriceToUSD(contractPrice: bigint | number | undefined): number {
  if (!contractPrice) return 0;
  // Convert from contract format to actual price (divide by 10^8)
  return Number(contractPrice) / 100000000;
}
