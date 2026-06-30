'use client'

import { useState } from 'react'

interface AnnouncementBarProps {
  message: string
  visible: boolean
}

export default function AnnouncementBar({ message, visible }: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false)

  if (!visible || dismissed) return null

  return (
    <div className="bg-primary text-white text-xs md:text-sm py-2 px-4 flex items-center justify-center relative">
      <p className="tracking-widest uppercase font-medium text-center pr-8">
        {message}
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
        aria-label="Close announcement"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
