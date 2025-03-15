'use client'

import React from 'react'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="feature-card group rounded-xl bg-[#131C45]/50 p-6 backdrop-blur-sm transition-all hover:bg-[#1C2A5E]/50 hover:shadow-[0_0_15px_rgba(55,91,210,0.3)] border border-[#375BD2]/20">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#375BD2]">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
      <p className="text-blue-100/70">{description}</p>
    </div>
  )
}
