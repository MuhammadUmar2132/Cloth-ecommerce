'use client'

import { useState } from 'react'

interface NewsletterData {
  heading: string
  subheading: string
  buttonText: string
  bgColor: string
  textColor: string
}

interface NewsletterProps {
  data: NewsletterData
}

export default function Newsletter({ data }: NewsletterProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section
      className="py-16 md:py-20 px-4"
      style={{ backgroundColor: data.bgColor || '#1a1a2e', color: data.textColor || '#ffffff' }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs tracking-[0.4em] uppercase mb-3 opacity-60">Stay Updated</p>
        <h2 className="font-serif text-2xl md:text-4xl font-bold mb-2">
          {data.heading}
        </h2>
        <p className="text-base md:text-lg opacity-80 mb-8 tracking-wide">
          {data.subheading}
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-2 text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm tracking-wider">Thank you for subscribing!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 text-sm bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-accent focus:bg-white/20 transition-colors"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-accent text-white text-sm tracking-[0.2em] uppercase font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              {data.buttonText}
            </button>
          </form>
        )}

        {error && (
          <p className="mt-2 text-red-300 text-xs">{error}</p>
        )}
      </div>
    </section>
  )
}
