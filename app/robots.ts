import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://filenes.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/hesabim/',
          '/odeme/',
          '/sepet/',
          '/giris',
          '/kayit',
          '/sifremi-unuttum',
          '/sifre-sifirla',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
