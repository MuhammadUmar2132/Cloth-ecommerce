import { getSiteData, getProducts, getCollections } from '@/lib/api'
import { OrganizationJsonLd } from '@/components/JsonLd'
import AnnouncementBar from '@/components/AnnouncementBar'
import Navbar from '@/components/Navbar'
import HeroSlider from '@/components/HeroSlider'
import ProductGrid from '@/components/ProductGrid'
import CollectionSection from '@/components/CollectionSection'
import Newsletter from '@/components/Newsletter'
import Footer from '@/components/Footer'

export const revalidate = 0

export default async function HomePage() {
  let siteData: any = null
  let products: any[] = []
  let collections: any[] = []

  try {
    [siteData, products, collections] = await Promise.all([
      getSiteData(),
      getProducts(),
      getCollections(),
    ])
  } catch {
    // If API is down, show fallback
    siteData = {
      announcement: 'ORDERS PLACED AFTER 21ST MAY WILL BE DELIVERED AFTER EID',
      announcementVisible: true,
      navbar: {
        logo: 'ZEPHYR',
        links: [
          { id: '1', label: 'Home', href: '/' },
          { id: '2', label: 'Collections', href: '/collections', dropdown: [
            { label: 'Blended', href: '/collections/blended' },
            { label: 'Cotton', href: '/collections/cotton' },
          ]},
          { id: '3', label: 'Summer Collection', href: '/collections/summer' },
          { id: '4', label: 'Eid Collection', href: '/collections/eid' },
          { id: '5', label: 'About', href: '/about' },
          { id: '6', label: 'Contact', href: '/contact' },
        ]
      },
      hero: {
        slides: [
          { id: '1', title: 'Summer Collection', subtitle: 'Lightweight fabrics for the season', buttonText: 'Shop Now', buttonLink: '/collections/summer', bgColor: '#1a1a2e', textColor: '#ffffff' },
          { id: '2', title: 'Eid Collection', subtitle: 'Celebrate in style', buttonText: 'Explore', buttonLink: '/collections/eid', bgColor: '#16213e', textColor: '#ffffff' },
        ],
        autoplay: true,
        interval: 4000
      },
      newsletter: {
        heading: 'Join our mailing list',
        subheading: 'for the latest product info & more',
        buttonText: 'Subscribe',
        bgColor: '#1a1a2e',
        textColor: '#ffffff'
      },
      footer: {
        companyName: 'ZEPHYR Textiles Ltd.',
        address: 'Lahore, Pakistan',
        phone: '+92-300-0000000',
        email: 'info@zephyr.com.pk',
        quickLinks: [{ label: 'Home', href: '/' }],
        infoLinks: [{ label: 'Privacy Policy', href: '/privacy' }],
        social: { facebook: '', instagram: '' },
        copyright: '© 2024 ZEPHYR Textiles Ltd. All rights reserved.'
      }
    }
  }

  const featuredProducts = products.slice(0, 8)
  const visibleCollections = collections.filter((c: any) => c.visible)

  return (
    <main>
      <OrganizationJsonLd seo={siteData.seo} footer={siteData.footer} />
      <AnnouncementBar
        message={siteData.announcement}
        visible={siteData.announcementVisible}
      />
      <Navbar navbar={siteData.navbar} />
      <HeroSlider
        slides={siteData.hero.slides}
        autoplay={siteData.hero.autoplay}
        interval={siteData.hero.interval}
      />

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">Handpicked For You</p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary uppercase tracking-wide">
              Featured Products
            </h2>
            <div className="mt-3 w-16 h-0.5 bg-accent mx-auto"></div>
          </div>
          <ProductGrid products={featuredProducts} />
        </section>
      )}

      {/* Divider */}
      <div className="border-t border-gray-100 mx-8" />

      {/* Collection Sections */}
      {visibleCollections.map((collection: any) => {
        const colProducts = products.filter((p: any) => p.collection === collection.slug)
        if (colProducts.length === 0) return null
        return (
          <div key={collection.id}>
            <CollectionSection
              collection={collection}
              products={colProducts}
            />
            <div className="border-t border-gray-100 mx-8" />
          </div>
        )
      })}

      <Newsletter data={siteData.newsletter} />
      <Footer data={siteData.footer} />
    </main>
  )
}
