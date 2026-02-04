import Link from 'next/link'
import { ShieldX, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Yetkisiz Erişim | Filenes Sports',
  description: 'Bu sayfaya erişim yetkiniz bulunmamaktadır.',
}

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ShieldX className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Yetkisiz Erişim
        </h1>

        <p className="text-gray-600 mb-8">
          Bu sayfaya erişim yetkiniz bulunmamaktadır.
          Eğer admin yetkilerine sahip olduğunuzu düşünüyorsanız,
          lütfen site yöneticisiyle iletişime geçin.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Ana Sayfa
            </Button>
          </Link>
          <Link href="/giris">
            <Button className="w-full sm:w-auto bg-[#BB1624] hover:bg-[#8F101B]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Farklı Hesapla Giriş Yap
            </Button>
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          Hata Kodu: 403 - Forbidden
        </p>
      </div>
    </div>
  )
}
