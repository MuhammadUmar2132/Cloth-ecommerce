import Link from 'next/link'
import Image from 'next/image'

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

interface ProductCardProps {
  product: Product
}

const gradients = [
  'from-slate-700 to-slate-900',
  'from-stone-600 to-stone-800',
  'from-zinc-600 to-zinc-800',
  'from-neutral-600 to-neutral-800',
  'from-gray-600 to-gray-800',
  'from-primary to-secondary',
]

function getGradient(id?: string | number): string {
  const str = id == null ? '' : String(id)
  const num = parseInt(str.replace(/\D/g, ''), 10) || 0
  return gradients[num % gradients.length]
}

function getImageSrc(image?: string | null) {
  if (!image) return null
  if (image.startsWith('http://') || image.startsWith('https://')) return image
  if (image.startsWith('/')) return image
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  return `${API.replace(/\/$/, '')}/uploads/${image}`
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageSrc = getImageSrc(product.image)
  return (
    <div className="group cursor-pointer">
      <Link href={`/products/${product.id}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${getGradient(product.id)} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
              <div className="text-center text-white/60 px-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs font-serif tracking-wider uppercase opacity-70">{product.name}</p>
              </div>
            </div>
          )}

          {/* Sold Out Overlay */}
          {product.soldOut && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-primary text-xs font-bold tracking-[0.2em] uppercase px-4 py-2">
                Sold Out
              </span>
            </div>
          )}

          {/* Sale Badge */}
          {!product.soldOut && product.salePrice && (
            <div className="absolute top-2 left-2">
              <span className="bg-accent text-white text-xs font-bold tracking-wider uppercase px-2 py-1">
                Sale
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pt-3 pb-2">
          <h3 className="font-serif text-primary text-sm md:text-base font-semibold tracking-wide uppercase mb-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-accent font-semibold text-sm">
                  Rs. {product.salePrice.toLocaleString()}
                </span>
                <span className="text-gray-400 line-through text-xs">
                  Rs. {product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-gray-800 font-medium text-sm">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
