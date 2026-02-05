import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
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
    icon: '/favicon-white.svg',
    shortcut: '/favicon-white.svg',
    apple: '/favicon-white.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
