'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface ChainlinkInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onDontShowAgain: () => void // New prop for handling the preference
}

export default function ChainlinkInfoModal({ isOpen, onClose, onDontShowAgain }: ChainlinkInfoModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={() => onClose()}
      />
      
      {/* Modal content */}
      <div className="relative w-full sm:w-[350px] md:w-[400px] max-w-md bg-popover rounded-xl p-4 sm:p-6 z-10 border border-border shadow-xl">
        {/* Close button */}
        <button 
          onClick={() => onClose()}
          className="absolute top-3 right-3 text-secondary-foreground hover:text-primary-foreground"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center">
          {/* Chart icon */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-secondary rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <Image 
              src="/tokens/Chainlink.svg"
              width={44}
              height={44}
              alt="Chainlink"
              className="object-contain w-10 h-10 sm:w-11 sm:h-11"
            />
          </div>

          {/* Title */}
          <h3 className="text-center font-semibold text-base sm:text-lg mb-1">
            Currently showing charts from
          </h3>
          <h2 className="text-center font-bold text-lg sm:text-xl mb-3 sm:mb-4">
            Chainlink oracle
          </h2>

          {/* Description */}
          <p className="text-center text-secondary-foreground text-sm sm:text-base mb-3 sm:mb-4">
            The price you see come directly from the Chainlink oracle, which powers the Prediction game.
          </p>

          {/* Bullet points */}
          <ul className="space-y-2 text-secondary-foreground text-sm sm:text-base w-full mb-4 sm:mb-6">
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              Oracle price refreshes every ~25 seconds.
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              This chart refreshes slower and with fewer features, than a traditional TradingView chart.
            </li>
          </ul>

          {/* Understand button */}
          <button 
            onClick={() => {
              if (dontShowAgain) {
                onDontShowAgain()
              }
              onClose()
            }}
            className="w-full bg-[#375BD2] text-white font-medium py-2.5 sm:py-3 rounded-md hover:opacity-90 transition-colors text-sm sm:text-base"
          >
            I understand
          </button>

          {/* Don't show again checkbox */}
          <div className="flex items-center mt-3 sm:mt-4">
            <input 
              type="checkbox" 
              id="dontShowAgain" 
              className="mr-2 h-4 w-4 accent-[#375BD2]"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            <label htmlFor="dontShowAgain" className="text-xs sm:text-sm text-secondary-foreground">
              Don't show this again
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}