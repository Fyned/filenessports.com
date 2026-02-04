'use client'

import { Suspense, useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Package, Mail, ArrowRight, Loader2 } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useCartStore } from '@/stores/cart-store'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')
  const [showConfetti, setShowConfetti] = useState(false)
  const clearCart = useCartStore((state) => state.clearCart)
  const cartCleared = useRef(false)

  useEffect(() => {
    // Ödeme başarılı - sepeti temizle (sadece bir kez)
    if (!cartCleared.current) {
      cartCleared.current = true
      clearCart()
    }

    // Konfeti efekti
    if (!showConfetti) {
      setShowConfetti(true)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#BB1624', '#1C2840', '#FFD700'],
      })
    }
  }, [showConfetti, clearCart])

  return (
    <div className="max-w-xl mx-auto text-center">
      {/* Success Icon */}
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-14 h-14 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold text-[#1C2840] mb-4">
        Ödemeniz Başarıyla Alındı!
      </h1>

      <p className="text-gray-600 mb-8">
        Siparişiniz için teşekkür ederiz. Siparişiniz hazırlanmaya başlandı.
      </p>

      {/* Order Info Card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          {orderNumber && (
            <div className="mb-4 pb-4 border-b">
              <p className="text-sm text-gray-500">Sipariş Numarası</p>
              <p className="text-xl font-bold text-[#1C2840]">{orderNumber}</p>
            </div>
          )}

          <div className="space-y-4 text-left">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-[#1C2840]">E-posta Onayı</h3>
                <p className="text-sm text-gray-600">
                  Sipariş detayları e-posta adresinize gönderildi.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-[#1C2840]">Kargo Bilgisi</h3>
                <p className="text-sm text-gray-600">
                  Siparişiniz kargoya verildiğinde SMS ile bilgilendirileceksiniz.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        {orderNumber && (
          <Link href={`/siparis-takip?order=${orderNumber}`}>
            <Button className="w-full bg-[#BB1624] hover:bg-[#8F101B]">
              Siparişimi Takip Et
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        )}

        <Link href="/urunler">
          <Button variant="outline" className="w-full">
            Alışverişe Devam Et
          </Button>
        </Link>
      </div>

      {/* Support Info */}
      <p className="text-sm text-gray-500 mt-8">
        Siparişinizle ilgili sorularınız için{' '}
        <Link href="/iletisim" className="text-[#BB1624] hover:underline">
          müşteri hizmetlerimize
        </Link>{' '}
        ulaşabilirsiniz.
      </p>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#BB1624]" />
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </div>
  )
}
