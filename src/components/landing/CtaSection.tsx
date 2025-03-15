'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { fontMono } from '@/lib/fonts'

interface CtaSectionProps {
  title: string
  description: string
  buttonText: string
  buttonLink: string
}

export default function CtaSection({ 
  title, 
  description, 
  buttonText, 
  buttonLink 
}: CtaSectionProps) {
  return (
    <section className="cta-section min-h-screen flex items-center justify-center px-4">
      <div className="container mx-auto py-20">
        <div className="cta-container animate-pulse rounded-3xl bg-gradient-to-r from-[#1C2A5E]/70 to-[#375BD2]/20 p-12 text-center backdrop-blur-sm border border-[#375BD2]/30">
          <h2 className={cn(
            "mb-6 text-4xl font-bold tracking-tighter font-mono text-white",
            fontMono.variable
          )}>
            {title}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100/80">
            {description}
          </p>
          <Link 
            href={buttonLink}
            className="inline-block py-3 px-8 bg-[#375BD2] rounded-md text-center font-bold text-white hover:bg-[#375BD2]/90 transition-all hover:scale-105 shadow-[0_0_15px_rgba(55,91,210,0.5)]"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  )
}
