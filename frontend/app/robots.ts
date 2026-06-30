import type { MetadataRoute } from 'next'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default async function robots(): Promise<MetadataRoute.Robots> {
  let canonical = 'https://yourdomain.com'
  let robotsRule = 'index, follow'

  try {
    const res = await fetch(`${API}/api/site`, { cache: 'no-store' })
    if (res.ok) {
      const json = await res.json()
      canonical  = json.data?.seo?.canonical  || canonical
      robotsRule = json.data?.seo?.robots     || robotsRule
    }
  } catch {}

  const noIndex = robotsRule.includes('noindex')

  return {
    rules: {
      userAgent: '*',
      allow: noIndex ? [] : '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${canonical}/sitemap.xml`,
  }
}
