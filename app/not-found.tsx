import Link from 'next/link'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <div className="relative mb-8">
          <div className="text-[180px] font-bold text-gray-100 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-[#BB1624] rounded-full flex items-center justify-center">
              <Search className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Sayfa Bulunamadı
        </h1>
        <p className="text-gray-600 mb-8">
          Aradığınız sayfa taşınmış, kaldırılmış veya hiç var olmamış olabilir.
          Endişelenmeyin, sizi ana sayfaya yönlendirebiliriz.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#BB1624] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#8F101B] transition-colors"
          >
            <Home className="w-5 h-5" />
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/urunler"
            className="inline-flex items-center justify-center gap-2 bg-[#1C2840] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2A3A5A] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Ürünlere Git
          </Link>
        </div>

        {/* Popular Links */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-gray-500 mb-4">Popüler Sayfalar</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/urunler" className="text-sm text-[#BB1624] hover:underline">
              Tüm Ürünler
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/hakkimizda" className="text-sm text-[#BB1624] hover:underline">
              Hakkımızda
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/iletisim" className="text-sm text-[#BB1624] hover:underline">
              İletişim
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/sss" className="text-sm text-[#BB1624] hover:underline">
              SSS
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
