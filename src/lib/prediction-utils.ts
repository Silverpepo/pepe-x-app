import { Direction, Prediction } from '@/types';

/**
 * Estimates the potential reward for a prediction based on current window state
 * @param prediction The prediction object containing market and window data
 * @param betAmount The amount the user wants to bet in PEPO tokens
 * @returns The estimated reward amount in PEPO tokens
 */
export function estimateReward(
  prediction: Prediction, 
  betAmount: number
): number {
  if (!prediction || betAmount <= 0) return 0;
  
  const window = prediction.window;
  const market = prediction.market;
  
  // Get current volumes
  const upVolume = Number(window.upVolume);
  const downVolume = Number(window.downVolume);
  
  // Add the user's hypothetical bet to the appropriate side
  const newUpVolume = prediction.predictedDirection === Direction.Up 
    ? upVolume + betAmount
    : upVolume;
    
  const newDownVolume = prediction.predictedDirection === Direction.Down
    ? downVolume + betAmount
    : downVolume;
    
  const newTotalVolume = newUpVolume + newDownVolume;
  
  // Edge case: No bets on either side or tiny total volume
  if (newTotalVolume < 0.00001) return betAmount;

  // Calculate fee (treasuryFee is in basis points - 10000 = 100%)
  const fee = (newTotalVolume * market.treasuryFee) / 10000;
  const rewardPool = newTotalVolume - fee;
  
  // Determine the pool for the user's prediction direction
  const userDirectionPool = prediction.predictedDirection === Direction.Up 
    ? newUpVolume
    : newDownVolume;
  
  // Edge case: If all bets are on the user's side (including their bet)
  if (userDirectionPool === newTotalVolume) {
    // If the user is the only bettor, they get their bet back minus fees
    return betAmount * (1 - market.treasuryFee / 10000);
  }
  
  // Edge case: If no bets on user's side except their potential bet
  if ((prediction.predictedDirection === Direction.Up && upVolume === 0) ||
      (prediction.predictedDirection === Direction.Down && downVolume === 0)) {
    // If user would be the only one on their side, they'd win all of the other side's stake plus their own, minus fees
    return rewardPool;
  }
  
  // Calculate reward based on contract formula
  // User's bet amount / total volume on their side * reward pool
  return betAmount * rewardPool / userDirectionPool;
}

/**
 * Formats a PEPO token amount to a readable string with appropriate precision
 * @param amount The amount to format
 * @returns Formatted string
 */
export function formatRewardAmount(amount: number): string {
  if (amount >= 0.01) {
    return amount.toFixed(2);
  } else if (amount >= 0.0001) {
    return amount.toFixed(4);
  } else {
    return amount.toFixed(6);
  }
}