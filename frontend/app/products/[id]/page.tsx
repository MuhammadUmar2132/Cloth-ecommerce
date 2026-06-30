import { getProduct, getSiteData } from '@/lib/api'
import AnnouncementBar from '@/components/AnnouncementBar'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductDetailClient from '@/components/ProductDetailClient'
import Link from 'next/link'

export const revalidate = 0

export default async function ProductPage({ params }: { params: { id: string } }) {
  let product: any = null
  let siteData: any = null

  try {
    ;[product, siteData] = await Promise.all([getProduct(params.id), getSiteData()])
  } catch {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Product not found.</p>
        <Link href="/" className="text-primary underline">Go home</Link>
      </div>
    )
  }

  const whatsapp = siteData?.footer?.phone?.replace(/\D/g, '') || '923001234567'

  return (
    <main>
      <AnnouncementBar message={siteData.announcement} visible={siteData.announcementVisible} />
      <Navbar navbar={siteData.navbar} />
      <ProductDetailClient product={product} whatsapp={whatsapp} />
      <Footer data={siteData.footer} />
    </main>
  )
}
