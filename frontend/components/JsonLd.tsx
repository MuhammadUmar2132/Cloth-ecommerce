interface OrganizationLdProps {
  seo: any
  footer: any
}

export function OrganizationJsonLd({ seo, footer }: OrganizationLdProps) {
  const canonical = seo?.canonical || 'https://yourdomain.com'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: footer?.companyName || 'ZEPHYR Textiles Ltd.',
    url: canonical,
    logo: seo?.ogImage ? `${canonical}${seo.ogImage}` : canonical,
    description: seo?.description || '',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lahore',
      addressCountry: 'PK',
      streetAddress: footer?.address || '',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: footer?.phone || '',
      contactType: 'customer service',
    },
    sameAs: [
      footer?.social?.facebook,
      footer?.social?.instagram,
    ].filter(Boolean),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ProductLdProps {
  product: any
  canonical: string
}

export function ProductJsonLd({ product, canonical }: ProductLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || '',
    image: product.image ? `${canonical}${product.image}` : '',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      price: product.salePrice || product.price,
      availability: product.soldOut
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'ZEPHYR Textiles Ltd.' },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbLdProps {
  items: { name: string; href: string }[]
  canonical: string
}

export function BreadcrumbJsonLd({ items, canonical }: BreadcrumbLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${canonical}${item.href}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
