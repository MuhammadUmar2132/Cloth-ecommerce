'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cartContext'

interface Product {
  id: string
  name: string
  price: number
  salePrice: number | null
  soldOut: boolean
  collection: string
  image: string
  description: string
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

function getImageSrc(image?: string | null) {
  if (!image) return null
  if (image.startsWith('http://') || image.startsWith('https://')) return image
  if (image.startsWith('/')) return image
  return `${API.replace(/\/$/, '')}/uploads/${image}`
}

export default function ProductDetailClient({
  product,
  whatsapp,
}: {
  product: Product
  whatsapp: string
}) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, cartItems } = useCart()
  const [added, setAdded] = useState(false)

  const inWishlist = isInWishlist(product.id)
  const inCart = cartItems.some(i => i.id === product.id)
  const displayPrice = product.salePrice ?? product.price
  const imageSrc = getImageSrc(product.image)

  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    salePrice: product.salePrice,
    image: product.image,
    collection: product.collection,
  }

  const handleAddToCart = () => {
    if (product.soldOut) return
    addToCart(cartItem)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleWishlist = () => {
    if (inWishlist) removeFromWishlist(product.id)
    else addToWishlist(cartItem)
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Assalam o Alaikum! I'm interested in ordering:\n\n*${product.name}*\nPrice: Rs. ${displayPrice.toLocaleString()}\n\nPlease confirm availability.`
    )
    window.open(`https://wa.me/${whatsapp}?text=${text}`, '_blank')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Breadcrumb */}
      <nav className="text-xs tracking-wider uppercase text-gray-400 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/collections/${product.collection}`} className="hover:text-primary transition-colors capitalize">
          {product.collection}
        </Link>
        <span>/</span>
        <span className="text-gray-600">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {product.soldOut && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-primary text-sm font-bold tracking-[0.2em] uppercase px-6 py-3">Sold Out</span>
            </div>
          )}
          {!product.soldOut && product.salePrice && (
            <div className="absolute top-3 left-3">
              <span className="bg-accent text-white text-xs font-bold tracking-wider uppercase px-3 py-1.5">Sale</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary uppercase tracking-wide mb-3">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-5">
            {product.salePrice ? (
              <>
                <span className="text-2xl font-bold text-accent">Rs. {product.salePrice.toLocaleString()}</span>
                <span className="text-lg text-gray-400 line-through">Rs. {product.price.toLocaleString()}</span>
                <span className="bg-accent/10 text-accent text-xs font-semibold px-2 py-0.5 rounded">
                  {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-800">Rs. {product.price.toLocaleString()}</span>
            )}
          </div>

          <div className="w-12 h-0.5 bg-accent mb-5" />

          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>
          )}

          <div className="text-xs tracking-wider uppercase text-gray-400 mb-6">
            Collection: <span className="text-gray-600 capitalize">{product.collection}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-auto">
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.soldOut}
              className={`w-full py-4 text-sm font-bold tracking-[0.2em] uppercase transition-all duration-200 ${
                product.soldOut
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : added
                  ? 'bg-green-600 text-white'
                  : 'bg-primary text-white hover:bg-primary/90 active:scale-[0.98]'
              }`}
            >
              {product.soldOut ? 'Sold Out' : added ? '✓ Added to Cart' : inCart ? 'Add More to Cart' : 'Add to Cart'}
            </button>

            {/* Wishlist + WhatsApp row */}
            <div className="flex gap-3">
              <button
                onClick={handleWishlist}
                className={`flex-1 py-3.5 text-sm font-semibold tracking-wider uppercase border transition-all duration-200 flex items-center justify-center gap-2 ${
                  inWishlist
                    ? 'border-accent text-accent bg-accent/5'
                    : 'border-gray-300 text-gray-700 hover:border-accent hover:text-accent'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={inWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {inWishlist ? 'Wishlisted' : 'Wishlist'}
              </button>

              <button
                onClick={handleWhatsApp}
                className="flex-1 py-3.5 text-sm font-semibold tracking-wider uppercase border border-green-500 text-green-600 bg-green-50 hover:bg-green-100 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.535 5.858L.057 23.986l6.304-1.649A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.058-1.4l-.363-.215-3.742.979 1.003-3.638-.237-.374A9.817 9.817 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                </svg>
                Order on WhatsApp
              </button>
            </div>

            {/* View Cart link */}
            {inCart && (
              <Link
                href="/cart"
                className="text-center text-sm text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
              >
                View Cart →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
