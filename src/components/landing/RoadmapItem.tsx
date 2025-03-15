'use client'

import React from 'react'

interface RoadmapItemProps {
  date: string
  description: string
  position: 'top' | 'bottom'
}

export default function RoadmapItem({ date, description, position }: RoadmapItemProps) {
  return (
    <div className="roadmap-item relative flex flex-col items-center">
      <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-[#375BD2] shadow-[0_0_10px_rgba(55,91,210,0.5)] md:top-1/2 md:-translate-y-1/2"></div>
      <div className={`mt-8 rounded-xl bg-[#131C45]/50 p-6 text-center backdrop-blur-sm border border-[#375BD2]/20 ${
        position === 'top' ? 'md:mt-0 md:mb-16' : 'md:mt-16'
      }`}>
        <h3 className="mb-2 text-xl font-bold text-white">{date}</h3>
        <p className="text-blue-100/70">{description}</p>
      </div>
    </div>
  )
}
