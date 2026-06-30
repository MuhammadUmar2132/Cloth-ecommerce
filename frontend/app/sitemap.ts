import type { MetadataRoute } from 'next'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let canonical = 'https://yourdomain.com'
  let products: any[] = []
  let collections: any[] = []

  try {
    const [siteRes, productsRes, collectionsRes] = await Promise.all([
      fetch(`${API}/api/site`,        { cache: 'no-store' }),
      fetch(`${API}/api/products`,    { cache: 'no-store' }),
      fetch(`${API}/api/collections`, { cache: 'no-store' }),
    ])
    if (siteRes.ok) {
      const s = await siteRes.json()
      canonical = s.data?.seo?.canonical || canonical
    }
    if (productsRes.ok)    { const p = await productsRes.json();    products    = p.data || [] }
    if (collectionsRes.ok) { const c = await collectionsRes.json(); collections = c.data || [] }
  } catch {}

  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${canonical}`,         lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${canonical}/about`,   lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${canonical}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((col: any) => ({
    url:             `${canonical}/collections/${col.slug}`,
    lastModified:    new Date(col.updatedAt || now),
    changeFrequency: 'weekly',
    priority:        0.8,
  }))

  const productRoutes: MetadataRoute.Sitemap = products.map((p: any) => ({
    url:             `${canonical}/products/${p._id}`,
    lastModified:    new Date(p.updatedAt || now),
    changeFrequency: 'weekly',
    priority:        0.7,
  }))

  return [...staticRoutes, ...collectionRoutes, ...productRoutes]
}
