import Link from 'next/link'

interface FooterLink {
  label: string
  href: string
}

interface FooterData {
  companyName: string
  address: string
  phone: string
  email: string
  quickLinks: FooterLink[]
  infoLinks: FooterLink[]
  social?: {
    facebook?: string
    instagram?: string
  }
  copyright: string
}

interface FooterProps {
  data: FooterData
}

export default function Footer({ data }: FooterProps) {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <h3 className="font-serif text-xl font-bold tracking-[0.3em] uppercase mb-4">
              ZEPHYR
            </h3>
            <p className="text-gray-300 text-sm mb-1 leading-relaxed">{data.companyName}</p>
            <p className="text-gray-400 text-sm mb-1">{data.address}</p>
            <p className="text-gray-400 text-sm mb-1">
              <a href={`tel:${data.phone}`} className="hover:text-accent transition-colors">{data.phone}</a>
            </p>
            <p className="text-gray-400 text-sm">
              <a href={`mailto:${data.email}`} className="hover:text-accent transition-colors">{data.email}</a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold tracking-[0.2em] uppercase mb-4 text-gray-100">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {(data.quickLinks ?? []).map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 text-sm hover:text-accent transition-colors tracking-wide">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-sm font-bold tracking-[0.2em] uppercase mb-4 text-gray-100">
              Information
            </h4>
            <ul className="space-y-2">
              {(data.infoLinks ?? []).map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 text-sm hover:text-accent transition-colors tracking-wide">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-bold tracking-[0.2em] uppercase mb-4 text-gray-100">
              Follow Us
            </h4>
            <div className="flex gap-3">
              {data.social?.facebook && (
                <a
                  href={data.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-gray-600 flex items-center justify-center hover:border-accent hover:text-accent transition-colors text-gray-400"
                  aria-label="Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {data.social?.instagram && (
                <a
                  href={data.social?.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-gray-600 flex items-center justify-center hover:border-accent hover:text-accent transition-colors text-gray-400"
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
            </div>

            <div className="mt-6">
              <p className="text-gray-400 text-xs leading-relaxed">
                Head Office: {data.address}<br />
                {data.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center">
          <p className="text-gray-500 text-xs tracking-wide">{data.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
