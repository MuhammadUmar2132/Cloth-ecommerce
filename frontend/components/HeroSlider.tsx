'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Slide {
  id: string
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  bgColor: string
  textColor: string
  image?: string
}

interface HeroSliderProps {
  slides: Slide[]
  autoplay: boolean
  interval: number
}

export default function HeroSlider({ slides, autoplay, interval }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (!autoplay || slides.length <= 1) return
    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [autoplay, interval, next, slides.length])

  if (!slides || slides.length === 0) return null

  const slide = slides[current]

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: '500px' }}>
      {/* Slide */}
      <div
        className="w-full flex flex-col items-center justify-center text-center px-8 py-24 md:py-32 transition-all duration-700"
        style={{
          minHeight: '500px',
          backgroundColor: slide.bgColor || '#1a1a2e',
          color: slide.textColor || '#ffffff',
          backgroundImage: slide.image ? `url(${slide.image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for images */}
        {slide.image && (
          <div className="absolute inset-0 bg-black/50" />
        )}
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-xs md:text-sm tracking-[0.4em] uppercase mb-4 opacity-80">
            Zephyr Textiles
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
            {slide.title}
          </h1>
          <p className="text-base md:text-xl mb-8 opacity-90 tracking-wide">
            {slide.subtitle}
          </p>
          <Link
            href={slide.buttonLink || '#'}
            className="inline-block border-2 border-current px-10 py-3 text-sm tracking-[0.3em] uppercase font-medium hover:bg-white hover:text-primary transition-colors duration-200"
            style={{ color: slide.textColor || '#ffffff' }}
          >
            {slide.buttonText}
          </Link>
        </div>
      </div>

      {/* Prev Arrow */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 transition-colors duration-200 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Arrow */}
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 transition-colors duration-200 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === current ? 'bg-white w-6' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
