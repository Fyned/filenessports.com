import { Product, BlogPost } from '@/types/database'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://filenes.com'

// Organization schema
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Filenes Sports',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.svg`,
    sameAs: [
      'https://www.facebook.com/filenes',
      'https://www.instagram.com/filenes',
      'https://twitter.com/filenes',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+90-xxx-xxx-xxxx',
      contactType: 'customer service',
      availableLanguage: ['Turkish'],
    },
  }
}

// Website schema
export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Filenes Sports',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/urunler?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// Product schema
export function getProductSchema(product: Product, reviewData?: { averageRating: number; reviewCount: number }) {
  const imageUrl = product.images?.[0]?.url || `${baseUrl}/images/placeholder.jpg`

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description || product.description || '',
    image: imageUrl,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Filenes Sports',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/urunler/${product.slug}`,
      priceCurrency: 'TRY',
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Filenes Sports',
      },
    },
  }

  // Add review data if available
  if (reviewData && reviewData.reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: reviewData.averageRating.toFixed(1),
      reviewCount: reviewData.reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return schema
}

// Breadcrumb schema
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  }
}

// Blog post schema
export function getBlogPostSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    image: post.image_url || `${baseUrl}/images/placeholder.jpg`,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author || 'Filenes Sports',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Filenes Sports',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
  }
}

// FAQ schema
export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// Local business schema (if applicable)
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportingGoodsStore',
    name: 'Filenes Sports',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.svg`,
    image: `${baseUrl}/images/store.jpg`,
    priceRange: '₺₺',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Spor Caddesi No:1',
      addressLocality: 'İstanbul',
      addressRegion: 'İstanbul',
      postalCode: '34000',
      addressCountry: 'TR',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
  }
}

// Helper to render schema as JSON-LD script tag
export function renderJsonLd(schema: object): string {
  return JSON.stringify(schema)
}
