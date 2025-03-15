import { useEffect } from 'react';

export function generateMultipleBoxShadow(n: number): string {
  const boxShadows: string[] = [];
  for (let i = 0; i < n; i++) {
    // Use vw/vh units which scale with viewport size
    // Range from -100% to +100% of viewport dimensions
    const x = Math.floor(Math.random() * 400 - 200) + 'vw';
    const y = Math.floor(Math.random() * 400 - 200) + 'vh';
    const size = Math.random() * 0.6 + 0.1; // Random size between 0.1px and 0.7px
    const opacity = Math.random() * 0.8 + 0.2; // Random opacity between 0.2 and 1
    boxShadows.push(`${x} ${y} ${size}px rgba(255, 255, 255, ${opacity})`);
  }
  return boxShadows.join(', ');
}

export function initializeStarryBackground() {
  if (typeof document === 'undefined') return;
  
  // Check if stars are already initialized to prevent duplicate initialization
  const root = document.documentElement;
  if (root.style.getPropertyValue('--stars-small')) return;
  
  // Generate stars with different densities
  root.style.setProperty('--stars-small', generateMultipleBoxShadow(1500));
  root.style.setProperty('--stars-medium', generateMultipleBoxShadow(400));
  root.style.setProperty('--stars-big', generateMultipleBoxShadow(200));
}

export function cleanupStarryBackground() {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  root.style.removeProperty('--stars-small');
  root.style.removeProperty('--stars-medium');
  root.style.removeProperty('--stars-big');
}

export function useStarryBackground(enabled: boolean = true) {
  useEffect(() => {
    // Track component mount state
    let isMounted = true;
    
    if (enabled && isMounted) {
      initializeStarryBackground();
    }
    
    return () => {
      isMounted = false;
      // Only clean up if this was the component that initialized
      if (enabled) {
        cleanupStarryBackground();
      }
    };
  }, [enabled]);
}