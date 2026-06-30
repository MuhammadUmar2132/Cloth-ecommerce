import Link from 'next/link'
import ProductGrid from './ProductGrid'

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

interface Collection {
  id: string
  name: string
  description: string
}

interface CollectionSectionProps {
  collection: Collection
  products: Product[]
}

export default function CollectionSection({ collection, products }: CollectionSectionProps) {
  if (!products || products.length === 0) return null

  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-accent mb-2">Collection</p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary uppercase tracking-wide">
            {collection.name}
          </h2>
          {collection.description && (
            <p className="text-gray-500 text-sm mt-1">{collection.description}</p>
          )}
        </div>
        <Link
          href={`/collections/${collection.id}`}
          className="hidden md:flex items-center gap-2 text-sm tracking-wider uppercase text-primary hover:text-accent transition-colors border-b border-primary pb-0.5"
        >
          View All
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      <ProductGrid products={products} />

      {/* Mobile View All */}
      <div className="mt-6 text-center md:hidden">
        <Link
          href={`/collections/${collection.id}`}
          className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-primary hover:text-accent transition-colors border-b border-primary pb-0.5"
        >
          View All {collection.name}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
