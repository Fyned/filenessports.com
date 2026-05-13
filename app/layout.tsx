import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://filenessports.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Filenes Sports - Profesyonel Spor ve Güvenlik Fileleri',
    template: '%s | Filenes Sports',
  },
  description:
    'Türkiye\'nin önde gelen spor ve güvenlik filesi üreticisi. Futbol, basketbol, voleybol fileleri ve daha fazlası.',
  keywords: [
    'spor filesi',
    'güvenlik filesi',
    'futbol filesi',
    'basketbol filesi',
    'voleybol filesi',
    'kale filesi',
    'filenes sports',
  ],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Filenes Sports',
    url: SITE_URL,
    title: 'Filenes Sports - Profesyonel Spor ve Güvenlik Fileleri',
    description: 'Türkiye\'nin önde gelen spor ve güvenlik filesi üreticisi.',
    images: [
      {
        url: '/images/logo.svg',
        width: 240,
        height: 80,
        alt: 'Filenes Sports',
      },
    ],
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Filenes Sports',
  legalName: 'Filenes Sports',
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.svg`,
  image: `${SITE_URL}/images/logo.svg`,
  description: 'Türkiye\'nin önde gelen spor ve güvenlik filesi üreticisi. Kale fileleri, kapama fileleri, tavan fileleri ve daha fazlası.',
  telephone: '+90 541 885 56 76',
  email: 'info@fileenessports.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Namık Kemal Mah. 10. Sk. Çınar Apt. No: 73/1 İç Kapı No: 1',
    addressLocality: 'Esenyurt',
    addressRegion: 'İstanbul',
    addressCountry: 'TR',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+90 541 885 56 76',
      contactType: 'customer service',
      areaServed: 'TR',
      availableLanguage: ['Turkish'],
    },
  ],
  sameAs: [] as string[],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Filenes Sports',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/urunler?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
