import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

interface SiteSettings {
  site_name?: string
  site_description?: string
  phone?: string
  email?: string
  address?: string
  facebook?: string
  instagram?: string
  twitter?: string
  youtube?: string
}

// Static settings - Filenes Sports branding
function getSettings(): SiteSettings {
  return {
    site_name: 'Filenes Sports',
    site_description: "Türkiye'nin lider spor ve güvenlik filesi üreticisi. Futbol sahası fileleri, basketbol potası fileleri, voleybol ağları ve endüstriyel güvenlik fileleri konusunda 20 yıllık tecrübemizle hizmetinizdeyiz.",
    phone: '0850 302 32 62',
    email: 'info@fileenessports.com',
    address: 'Filenes Sports\nOrganize Sanayi Bölgesi\n12. Cadde No: 34\nKocaeli, Türkiye',
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: ''
  }
}

export function Footer() {
  const settings = getSettings()

  // Default values - Filenes Sports branding
  const siteName = settings.site_name || 'Filenes Sports'
  const siteDescription = settings.site_description || "Türkiye'nin lider spor ve güvenlik filesi üreticisi. Futbol sahası fileleri, basketbol potası fileleri, voleybol ağları ve endüstriyel güvenlik fileleri konusunda 20 yıllık tecrübemizle hizmetinizdeyiz."
  const phone = settings.phone || '0850 302 32 62'
  const email = settings.email || 'info@fileenessports.com'
  const address = settings.address || 'Filenes Sports\nOrganize Sanayi Bölgesi\n12. Cadde No: 34\nKocaeli, Türkiye'
  const facebook = settings.facebook || ''
  const instagram = settings.instagram || ''
  const twitter = settings.twitter || ''
  const youtube = settings.youtube || ''

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <Link href="/" className="block mb-4">
              <Image
                src="/images/logo-white.svg"
                alt={siteName}
                width={160}
                height={53}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              {siteDescription}
            </p>
            <div className="flex items-center gap-4">
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {twitter && (
                <a
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {youtube && (
                <a
                  href={youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {/* Show default icons if no social links */}
              {!facebook && !instagram && !twitter && !youtube && (
                <>
                  <span className="text-gray-600" aria-label="Facebook">
                    <Facebook className="w-5 h-5" />
                  </span>
                  <span className="text-gray-600" aria-label="Instagram">
                    <Instagram className="w-5 h-5" />
                  </span>
                  <span className="text-gray-600" aria-label="Twitter">
                    <Twitter className="w-5 h-5" />
                  </span>
                  <span className="text-gray-600" aria-label="YouTube">
                    <Youtube className="w-5 h-5" />
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/urunler" className="text-sm hover:text-white transition">
                  Tüm Ürünler
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="text-sm hover:text-white transition">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-sm hover:text-white transition">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:text-white transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Müşteri Hizmetleri</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/hesabim" className="text-sm hover:text-white transition">
                  Hesabım
                </Link>
              </li>
              <li>
                <Link href="/siparis-takip" className="text-sm hover:text-white transition">
                  Sipariş Takip
                </Link>
              </li>
              <li>
                <Link href="/sss" className="text-sm hover:text-white transition">
                  Sıkça Sorulan Sorular
                </Link>
              </li>
              <li>
                <Link href="/gizlilik-politikasi" className="text-sm hover:text-white transition">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/kullanim-sartlari" className="text-sm hover:text-white transition">
                  Kullanım Şartları
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 text-[#BB1624] flex-shrink-0" />
                <div>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-sm hover:text-white transition block">
                    {phone}
                  </a>
                  <span className="text-xs text-gray-500">Pzt-Cmt 09:00-18:00</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 text-[#BB1624] flex-shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="text-sm hover:text-white transition"
                >
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-[#BB1624] flex-shrink-0" />
                <span className="text-sm whitespace-pre-line">
                  {address}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} {siteName}. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-4">
              <Image src="/images/payment/visa.svg" alt="Visa" width={48} height={32} className="h-6 w-auto" />
              <Image src="/images/payment/mastercard.svg" alt="Mastercard" width={48} height={32} className="h-6 w-auto" />
              <Image src="/images/payment/troy.svg" alt="Troy" width={48} height={32} className="h-6 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
