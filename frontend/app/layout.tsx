import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

async function getSeoData() {
  try {
    const res = await fetch(`${API}/api/site`, { cache: 'no-store' })
    if (!res.ok) return null
    const json = await res.json()
    return json.data?.seo ?? null
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData()

  const title       = seo?.siteTitle       || 'ZEPHYR | Premium Pakistani Menswear Fabrics'
  const description = seo?.description     || 'Discover premium quality menswear fabrics from ZEPHYR Textiles, Lahore.'
  const keywords    = seo?.keywords        || 'menswear fabric, Pakistani fabric, Zephyr Textiles'
  const ogImage     = seo?.ogImage         || ''
  const canonical   = seo?.canonical       || 'https://yourdomain.com'
  const robots      = seo?.robots          || 'index, follow'
  const googleVerif = seo?.googleVerification || ''

  return {
    title: {
      default: title,
      template: seo?.titleTemplate || '%s | ZEPHYR',
    },
    description,
    keywords,
    robots,
    metadataBase: new URL(canonical),
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: 'en_PK',
      url: canonical,
      siteName: 'ZEPHYR',
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: (seo?.twitterCard as any) || 'summary_large_image',
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    ...(googleVerif ? { verification: { google: googleVerif } } : {}),
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white"><Providers>{children}</Providers></body>
    </html>
  )
}
