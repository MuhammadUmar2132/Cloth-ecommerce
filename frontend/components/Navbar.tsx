'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cartContext'
import { useAuth } from '@/lib/authContext'

interface DropdownItem {
  label: string
  href: string
}

interface NavLink {
  id: string
  label: string
  href: string
  dropdown?: DropdownItem[]
}

interface NavbarData {
  logo: string
  links: NavLink[]
}

interface NavbarProps {
  navbar: NavbarData
}

export default function Navbar({ navbar }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const { cartCount } = useCart()
  const { user } = useAuth()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'border-b border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile: Hamburger */}
          <button
            className="md:hidden p-2 text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="font-serif font-bold text-2xl md:text-3xl text-primary tracking-[0.3em] uppercase">
            {navbar.logo}
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8" ref={dropdownRef}>
            {navbar.links.map((link) => (
              <div key={link.id} className="relative">
                {link.dropdown ? (
                  <div
                    onMouseEnter={() => setActiveDropdown(link.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="text-sm tracking-wider uppercase text-gray-700 hover:text-primary transition-colors py-1 flex items-center gap-1">
                      {link.label}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeDropdown === link.id && (
                      <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 shadow-lg min-w-[180px] z-50">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors tracking-wide"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className="text-sm tracking-wider uppercase text-gray-700 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {user ? (
              <Link href="/profile" className="hidden md:flex items-center gap-2 text-sm text-gray-700 hover:text-primary transition-colors">
                <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="tracking-wide uppercase text-xs max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link href="/signin" className="hidden md:flex items-center gap-1 text-sm text-gray-700 hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="tracking-wide uppercase text-xs">Sign In</span>
              </Link>
            )}
            <Link href="/cart" className="relative p-1 text-gray-700 hover:text-primary transition-colors" aria-label="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pb-4">
          {navbar.links.map((link) => (
            <div key={link.id}>
              <Link
                href={link.href}
                className="block py-3 text-sm tracking-wider uppercase text-gray-700 hover:text-primary border-b border-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
              {link.dropdown && (
                <div className="pl-4 bg-gray-50">
                  {link.dropdown.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block py-2.5 text-sm text-gray-600 hover:text-primary border-b border-gray-100"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {user ? (
            <Link
              href="/profile"
              className="block py-3 text-sm tracking-wider uppercase text-gray-700 hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              My Profile
            </Link>
          ) : (
            <Link
              href="/signin"
              className="block py-3 text-sm tracking-wider uppercase text-gray-700 hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
