'use client'

import React from 'react'

interface StepItemProps {
  number: number
  title: string
  description: string
}

export default function StepItem({ number, title, description }: StepItemProps) {
  return (
    <div className="step-item flex flex-col items-center text-center max-w-xs">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#375BD2] text-2xl font-bold shadow-[0_0_15px_rgba(55,91,210,0.3)]">
        {number}
      </div>
      <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
      <p className="text-blue-100/70">{description}</p>
    </div>
  )
}
