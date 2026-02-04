'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
  MapPin,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  shipping_address: string
  tracking_number?: string
  created_at: string
  updated_at: string
  items: OrderItem[]
}

export default function OrderTrackingPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [notFound, setNotFound] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setNotFound(false)
    setOrder(null)

    try {
      // Search for order by order number
      const { data: orderData, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          total_amount,
          shipping_address,
          tracking_number,
          created_at,
          updated_at
        `)
        .eq('order_number', orderNumber.toUpperCase())
        .single()

      if (error || !orderData) {
        setNotFound(true)
        return
      }

      // Get order items
      const { data: itemsData } = await supabase
        .from('order_items')
        .select('id, product_name, quantity, price')
        .eq('order_id', orderData.id)

      setOrder({
        ...orderData,
        items: itemsData || [],
      })
    } catch (error) {
      console.error('Error searching order:', error)
      toast.error('Sipariş aranırken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const getStatusSteps = (status: string) => {
    const steps = [
      { key: 'pending', label: 'Sipariş Alındı', icon: Clock },
      { key: 'processing', label: 'Hazırlanıyor', icon: Package },
      { key: 'shipped', label: 'Kargoya Verildi', icon: Truck },
      { key: 'delivered', label: 'Teslim Edildi', icon: CheckCircle },
    ]

    const statusOrder = ['pending', 'processing', 'shipped', 'delivered']
    const currentIndex = statusOrder.indexOf(status)

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }))
  }

  const getStatusText = (status: string) => {
    const statuses: Record<string, string> = {
      pending: 'Sipariş Alındı',
      processing: 'Hazırlanıyor',
      shipped: 'Kargoda',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi',
    }
    return statuses[status] || status
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1C2840] mb-4">Sipariş Takip</h1>
          <p className="text-gray-600">
            Sipariş numaranızı girerek siparişinizin durumunu takip edebilirsiniz.
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="orderNumber">Sipariş Numarası *</Label>
                  <Input
                    id="orderNumber"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="Örn: ORD-123456"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-posta (Opsiyonel)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="siparis@email.com"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#BB1624] hover:bg-[#8F101B]"
                disabled={loading}
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? 'Aranıyor...' : 'Sipariş Ara'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Not Found Message */}
        {notFound && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <p className="text-red-600">
                Girdiğiniz sipariş numarasına ait sipariş bulunamadı.
                Lütfen sipariş numaranızı kontrol edin.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Sipariş #{order.order_number}</span>
                  <span className="text-sm font-normal text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.status === 'cancelled' ? (
                  <div className="text-center py-4">
                    <p className="text-red-600 font-medium">Bu sipariş iptal edilmiştir.</p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                      <div
                        className="h-full bg-[#BB1624] transition-all duration-500"
                        style={{
                          width: `${
                            (getStatusSteps(order.status).filter((s) => s.completed).length - 1) *
                            33.33
                          }%`,
                        }}
                      />
                    </div>

                    {/* Steps */}
                    <div className="relative flex justify-between">
                      {getStatusSteps(order.status).map((step) => {
                        const Icon = step.icon
                        return (
                          <div key={step.key} className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                                step.completed
                                  ? 'bg-[#BB1624] text-white'
                                  : 'bg-gray-200 text-gray-400'
                              } ${step.current ? 'ring-4 ring-[#BB1624]/20' : ''}`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <p
                              className={`text-xs mt-2 text-center ${
                                step.completed ? 'text-[#1C2840] font-medium' : 'text-gray-400'
                              }`}
                            >
                              {step.label}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Tracking Number */}
                {order.tracking_number && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Kargo Takip No:</strong> {order.tracking_number}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Sipariş Detayları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium text-[#1C2840]">{item.product_name}</p>
                        <p className="text-sm text-gray-500">Adet: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="font-bold text-[#1C2840]">Toplam</p>
                    <p className="font-bold text-lg text-[#BB1624]">
                      {formatPrice(order.total_amount)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.shipping_address && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Teslimat Adresi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{order.shipping_address}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Siparişinizle ilgili bir sorun mu var?</p>
          <a
            href="/iletisim"
            className="text-[#BB1624] hover:underline font-medium"
          >
            Müşteri hizmetlerimize ulaşın
          </a>
        </div>
      </div>
    </div>
  )
}
