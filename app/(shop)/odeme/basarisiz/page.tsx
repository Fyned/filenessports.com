'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { XCircle, RefreshCw, Phone, ArrowLeft, Loader2 } from 'lucide-react'

function PaymentFailedContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')
  const error = searchParams.get('error')

  const getErrorMessage = (errorCode: string | null) => {
    const errorMessages: Record<string, string> = {
      'order_not_found': 'Sipariş bulunamadı.',
      '3ds_failed': '3D Secure doğrulama başarısız oldu.',
      'payment_failed': 'Ödeme işlemi gerçekleştirilemedi.',
      'card_declined': 'Kartınız reddedildi.',
      'insufficient_funds': 'Yetersiz bakiye.',
      'invalid_card': 'Geçersiz kart bilgileri.',
      'expired_card': 'Kart süresi dolmuş.',
      'invalid_cvc': 'Geçersiz güvenlik kodu.',
    }

    return errorMessages[errorCode || ''] || 'Ödeme işlemi sırasında bir hata oluştu.'
  }

  return (
    <div className="max-w-xl mx-auto text-center">
      {/* Error Icon */}
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle className="w-14 h-14 text-red-600" />
      </div>

      <h1 className="text-3xl font-bold text-[#1C2840] mb-4">
        Ödeme Başarısız
      </h1>

      <p className="text-gray-600 mb-8">
        {getErrorMessage(error)}
      </p>

      {/* Error Details Card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          {orderNumber && (
            <div className="mb-4 pb-4 border-b">
              <p className="text-sm text-gray-500">Sipariş Numarası</p>
              <p className="text-lg font-medium text-[#1C2840]">{orderNumber}</p>
            </div>
          )}

          <div className="text-left space-y-4">
            <h3 className="font-medium text-[#1C2840]">Olası Sebepler:</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                Kart bilgileri hatalı girilmiş olabilir
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                Kart limiti yetersiz olabilir
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                3D Secure doğrulaması başarısız olmuş olabilir
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                Bankanız işlemi reddetmiş olabilir
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Link href="/sepet">
          <Button className="w-full bg-[#BB1624] hover:bg-[#8F101B]">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tekrar Dene
          </Button>
        </Link>

        <Link href="/urunler">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Alışverişe Dön
          </Button>
        </Link>
      </div>

      {/* Support Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center gap-2 text-[#1C2840] mb-2">
          <Phone className="w-5 h-5" />
          <span className="font-medium">Yardıma mı ihtiyacınız var?</span>
        </div>
        <p className="text-sm text-gray-600">
          Müşteri hizmetlerimizi arayabilirsiniz:{' '}
          <a href="tel:+902121234567" className="text-[#BB1624] font-medium">
            +90 (212) 123 45 67
          </a>
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Veya{' '}
          <Link href="/iletisim" className="text-[#BB1624] hover:underline">
            iletişim formu
          </Link>
          {' '}ile bize ulaşın.
        </p>
      </div>
    </div>
  )
}

export default function PaymentFailedPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#BB1624]" />
          </div>
        }
      >
        <PaymentFailedContent />
      </Suspense>
    </div>
  )
}
