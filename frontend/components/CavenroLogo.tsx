'use client'

interface CavenroLogoProps {
  className?: string
  iconSize?: number
  variant?: 'dark' | 'light' | 'gold'
  showTagline?: boolean
  iconOnly?: boolean
  customText?: string
}

export default function CavenroLogo({
  className = '',
  iconSize = 38,
  variant = 'dark',
  showTagline = true,
  iconOnly = false,
  customText,
}: CavenroLogoProps) {
  const brandName = customText && customText.toUpperCase() !== 'ZEPHYR' ? customText : 'CAVENRO'

  // Text color based on variant
  const textColor =
    variant === 'light'
      ? 'text-white'
      : variant === 'gold'
      ? 'text-accent'
      : 'text-primary'

  const taglineColor =
    variant === 'light'
      ? 'text-gray-300'
      : variant === 'gold'
      ? 'text-accent/80'
      : 'text-accent'

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Luxury Crest Monogram Emblem */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="cavenroGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e5c875" />
            <stop offset="45%" stopColor="#c9a84c" />
            <stop offset="100%" stopColor="#8d6f22" />
          </linearGradient>
          <linearGradient id="cavenroNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#16213e" />
          </linearGradient>
        </defs>

        {/* Outer Diamond Crest */}
        <path
          d="M50 4 L94 48 L50 92 L6 48 Z"
          fill="url(#cavenroNavyGrad)"
          stroke="url(#cavenroGoldGrad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Inner Concentric Diamond Accent */}
        <path
          d="M50 12 L86 48 L50 84 L14 48 Z"
          fill="none"
          stroke="url(#cavenroGoldGrad)"
          strokeWidth="0.8"
          strokeDasharray="2 3"
          opacity="0.65"
        />

        {/* Architectural Sculpted 'C' Monogram */}
        <path
          d="M66 31
             C 59 23, 41 23, 33 33
             C 24 43, 24 55, 33 65
             C 41 75, 59 75, 66 67
             L 60 61
             C 55 67, 44 67, 39 61
             C 32 54, 32 44, 39 37
             C 44 31, 55 31, 60 37
             Z"
          fill="url(#cavenroGoldGrad)"
        />

        {/* Center Diamond Jewel Accent */}
        <polygon
          points="50,45 53,48 50,51 47,48"
          fill="#fbf5db"
        />

        {/* Top & Bottom Fine Corner Accents */}
        <circle cx="50" cy="18" r="1.5" fill="url(#cavenroGoldGrad)" />
        <circle cx="50" cy="78" r="1.5" fill="url(#cavenroGoldGrad)" />
      </svg>

      {/* Brand Typography Wordmark */}
      {!iconOnly && (
        <div className="flex flex-col justify-center leading-none">
          <span
            className={`font-serif font-extrabold text-xl sm:text-2xl md:text-[1.65rem] tracking-[0.28em] uppercase ${textColor} transition-colors`}
          >
            {brandName}
          </span>
          {showTagline && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-[0.5px] w-2 bg-accent opacity-60 hidden sm:inline-block"></span>
              <span
                className={`text-[0.55rem] sm:text-[0.6rem] tracking-[0.35em] uppercase font-medium ${taglineColor}`}
              >
                Haute Textiles
              </span>
              <span className="h-[0.5px] w-2 bg-accent opacity-60 hidden sm:inline-block"></span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
