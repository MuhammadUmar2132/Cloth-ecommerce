'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cartContext'
import { useAuth } from '@/lib/authContext'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

function getImageSrc(image?: string | null) {
  if (!image) return null
  if (image.startsWith('http://') || image.startsWith('https://')) return image
  if (image.startsWith('/')) return image
  return `${API.replace(/\/$/, '')}/uploads/${image}`
}

export default function CartPageClient() {
  const { cartItems, wishlist, removeFromCart, updateQuantity, addToCart, removeFromWishlist, cartTotal } = useCart()
  const { user } = useAuth()

  if (cartItems.length === 0 && wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p className="text-gray-400 text-sm tracking-wider uppercase mb-6">Your cart is empty</p>
        <Link href="/" className="bg-primary text-white px-8 py-3 text-sm tracking-[0.2em] uppercase font-bold hover:bg-primary/90 transition-colors">
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary uppercase tracking-wide mb-8">
        Your Cart
      </h1>

      {cartItems.length > 0 && (
        <>
          {/* Cart Items */}
          <div className="space-y-4 mb-8">
            {cartItems.map(item => {
              const imgSrc    = getImageSrc(item.image)
              const linePrice = (item.salePrice ?? item.price) * item.quantity
              return (
                <div key={item.id} className="flex gap-4 border border-gray-100 p-4">
                  <Link href={`/products/${item.id}`} className="shrink-0 w-20 h-24 relative bg-gray-100 overflow-hidden">
                    {imgSrc
                      ? <Image src={imgSrc} alt={item.name} fill className="object-cover" sizes="80px" />
                      : <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900" />}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.id}`}>
                      <h3 className="font-serif text-primary font-semibold text-sm uppercase tracking-wide hover:underline">{item.name}</h3>
                    </Link>
                    <p className="text-xs text-gray-400 capitalize mt-0.5">{item.collection}</p>

                    <div className="flex items-center gap-2 mt-2">
                      {item.salePrice
                        ? <><span className="text-accent font-bold text-sm">Rs. {item.salePrice.toLocaleString()}</span><span className="text-gray-400 line-through text-xs">Rs. {item.price.toLocaleString()}</span></>
                        : <span className="font-semibold text-sm">Rs. {item.price.toLocaleString()}</span>}
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-gray-200">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg leading-none">−</button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg leading-none">+</button>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">= Rs. {linePrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <button onClick={() => removeFromCart(item.id)} className="shrink-0 text-gray-300 hover:text-red-400 transition-colors self-start" aria-label="Remove">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>

          {/* Total + Proceed */}
          <div className="border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs tracking-wider uppercase text-gray-400">Order Total</p>
              <p className="font-serif text-2xl font-bold text-primary mt-1">Rs. {cartTotal.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-0.5">{cartItems.reduce((s, i) => s + i.quantity, 0)} item(s)</p>
            </div>

            {user ? (
              <Link
                href="/checkout"
                className="w-full sm:w-auto px-10 py-4 bg-primary text-white text-sm font-bold tracking-[0.2em] uppercase hover:bg-primary/90 active:scale-[0.98] transition-all text-center"
              >
                Proceed to Purchase →
              </Link>
            ) : (
              <Link
                href="/signin?redirect=%2Fcheckout"
                className="w-full sm:w-auto px-10 py-4 bg-primary text-white text-sm font-bold tracking-[0.2em] uppercase hover:bg-primary/90 transition-all text-center"
              >
                Sign In to Purchase →
              </Link>
            )}
          </div>
        </>
      )}

      {/* Wishlist */}
      {wishlist.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-serif text-xl font-bold text-primary uppercase tracking-wide">Wishlist</h2>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {wishlist.map(item => {
              const imgSrc = getImageSrc(item.image)
              return (
                <div key={item.id} className="group">
                  <Link href={`/products/${item.id}`} className="block">
                    <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-2">
                      {imgSrc
                        ? <Image src={imgSrc} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="200px" />
                        : <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900" />}
                    </div>
                    <p className="font-serif text-xs font-semibold text-primary uppercase tracking-wide">{item.name}</p>
                    <p className="text-xs text-gray-600 mt-0.5">Rs. {(item.salePrice ?? item.price).toLocaleString()}</p>
                  </Link>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => { addToCart(item); removeFromWishlist(item.id) }}
                      className="flex-1 text-xs py-1.5 bg-primary text-white tracking-wider uppercase hover:bg-primary/90 transition-colors">
                      Move to Cart
                    </button>
                    <button onClick={() => removeFromWishlist(item.id)}
                      className="px-2 border border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-300 transition-colors" aria-label="Remove">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
