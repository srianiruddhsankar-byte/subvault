'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Sparkles, Bell, PieChart, Search, ShieldCheck } from 'lucide-react'

const slides = [
  {
    icon: Sparkles,
    title: 'Autofill from 100+ known services',
    body: 'Start typing Netflix, Spotify, or any of 100+ recognized services — SubVault fills in the price and category for you.',
  },
  {
    icon: Bell,
    title: 'Never get caught off guard',
    body: 'A dashboard banner flags anything renewing soon, so you always know what\u2019s coming before it\u2019s charged.',
  },
  {
    icon: PieChart,
    title: 'See where your money actually goes',
    body: 'A live breakdown of monthly and yearly spend, by service and by category — no spreadsheet formulas required.',
  },
  {
    icon: Search,
    title: 'Find what you forgot about',
    body: 'Old free trials and half-used subscriptions add up quietly. SubVault surfaces them so you can decide what\u2019s worth keeping.',
  },
  {
    icon: ShieldCheck,
    title: 'Built with your data staying yours',
    body: 'No ads, no selling your data. SubVault exists to help you track spending — nothing else.',
  },
]

export default function LandingSlideshow() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (i: number) => setIndex(i)
  const goPrev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length)
  const goNext = () => setIndex((prev) => (prev + 1) % slides.length)

  const Slide = slides[index]
  const Icon = Slide.icon

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="relative rounded-2xl border border-navy/10 bg-card p-8 shadow-sm sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-navy">
            <Icon className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-navy">{Slide.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{Slide.body}</p>
        </div>

        <button
          onClick={goPrev}
          aria-label="Previous"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-navy/40 hover:bg-navy/5 hover:text-navy"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={goNext}
          aria-label="Next"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-navy/40 hover:bg-navy/5 hover:text-navy"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-6 bg-navy' : 'w-2 bg-navy/20'
            }`}
          />
        ))}
      </div>
    </div>
  )
}