'use client'

import { useEffect } from 'react'
import { initializeStarryBackground, cleanupStarryBackground } from '@/lib/generate-stars'

export default function StarryBackground() {
  useEffect(() => {
    initializeStarryBackground();
    
    // Add a scroll listener to create a subtle parallax effect for the stars
    const handleScroll = () => {
      const stars1 = document.getElementById('stars');
      const stars2 = document.getElementById('stars2');
      const stars3 = document.getElementById('stars3');
      
      if (stars1 && stars2 && stars3) {
        const scrollY = window.scrollY;
        const speed1 = scrollY * 0.0005;
        const speed2 = scrollY * 0.001;
        const speed3 = scrollY * 0.002;
        
        stars1.style.transform = `translateY(-${speed1}px)`;
        stars2.style.transform = `translateY(-${speed2}px)`;
        stars3.style.transform = `translateY(-${speed3}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      cleanupStarryBackground();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="stars-container">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
    </div>
  );
}