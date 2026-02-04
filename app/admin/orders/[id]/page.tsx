'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ArrowLeft, Save, Loader2, Package, MapPin, CreditCard, Truck, Mail } from 'lucide-react'
import Link from 'next/link'
import { Checkbox } from '@/components/ui/checkbox'

interface PageProps {
  params: Promise<{ id: string }>
}

interface OrderItem {
  id: string
  product_id: string
  quantity: number
  price: number
  total: number
  product: {
    name: string
    sku: string | null
  } | null
}

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  payment_method: string | null
  subtotal: number
  shipping_cost: number
  discount: number
  total: number
  notes: string | null
  tracking_number: string | null
  shipping_address: {
    first_name: string
    last_name: string
    address: string
    city: string
    district: string
    postal_code: string
    phone: string
  } | null
  billing_address: {
    first_name: string
    last_name: string
    address: string
    city: string
    district: string
    postal_code: string
    phone: string
  } | null
  created_at: string
  customer: {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string | null
  } | null
  items: OrderItem[]
}

const statusOptions = [
  { value: 'pending', label: 'Beklemede' },
  { value: 'confirmed', label: 'Onaylandı' },
  { value: 'processing', label: 'Hazırlanıyor' },
  { value: 'shipped', label: 'Kargoda' },
  { value: 'delivered', label: 'Teslim Edildi' },
  { value: 'cancelled', label: 'İptal' },
  { value: 'refunded', label: 'İade' },
]

const paymentStatusOptions = [
  { value: 'pending', label: 'Bekleniyor' },
  { value: 'paid', label: 'Ödendi' },
  { value: 'failed', label: 'Başarısız' },
  { value: 'refunded', label: 'İade Edildi' },
]

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
}

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [status, setStatus] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [sendNotification, setSendNotification] = useState(true)
  const [originalStatus, setOriginalStatus] = useState('')

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true)

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(id, first_name, last_name, email, phone),
          items:order_items(
            id,
            product_id,
            quantity,
            price,
            total,
            product:products(name, sku)
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        toast.error('Sipariş bulunamadı')
        router.push('/admin/orders')
        return
      }

      // Normalize customer (handle array from join)
      const normalizedOrder = {
        ...data,
        customer: Array.isArray(data.customer) ? data.customer[0] || null : data.customer,
        items: (data.items || []).map((item: OrderItem & { product: unknown }) => ({
          ...item,
          product: Array.isArray(item.product) ? item.product[0] || null : item.product,
        })),
      }

      setOrder(normalizedOrder)
      setStatus(data.status)
      setOriginalStatus(data.status)
      setPaymentStatus(data.payment_status)
      setTrackingNumber(data.tracking_number || '')
      setLoading(false)
    }

    fetchOrder()
  }, [id, supabase, router])

  const handleSave = async () => {
    setSaving(true)

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status,
          payment_status: paymentStatus,
          tracking_number: trackingNumber || null,
        })
        .eq('id', id)

      if (error) throw error

      // Durum değişikliğinde e-posta bildirimi gönder
      if (sendNotification && status !== originalStatus) {
        let notificationType: string | null = null

        if (status === 'shipped' && trackingNumber) {
          notificationType = 'shipped'
        } else if (status === 'delivered') {
          notificationType = 'delivered'
        } else if (status === 'cancelled') {
          notificationType = 'cancelled'
        }

        if (notificationType) {
          setSendingEmail(true)
          try {
            const response = await fetch('/api/email/send-notification', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: id,
                type: notificationType,
                trackingNumber: trackingNumber || undefined,
              }),
            })

            if (response.ok) {
              toast.success('Müşteriye e-posta bildirimi gönderildi')
            } else {
              toast.error('E-posta gönderilemedi')
            }
          } catch (emailError) {
            console.error('Error sending email:', emailError)
            toast.error('E-posta gönderilirken hata oluştu')
          } finally {
            setSendingEmail(false)
          }
        }
      }

      setOriginalStatus(status)
      toast.success('Sipariş güncellendi')
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Sipariş güncellenirken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!order) return null

  const statusLabel = statusOptions.find((s) => s.value === order.status)?.label || order.status

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Sipariş #{order.order_number}</h1>
            <p className="text-gray-600">
              {new Date(order.created_at).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Package className="w-5 h-5" />
              <CardTitle>Sipariş Ürünleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium text-gray-600">Ürün</th>
                      <th className="pb-3 font-medium text-gray-600 text-center">Adet</th>
                      <th className="pb-3 font-medium text-gray-600 text-right">Fiyat</th>
                      <th className="pb-3 font-medium text-gray-600 text-right">Toplam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="py-3">
                          <div>
                            <p className="font-medium">{item.product?.name || 'Ürün silinmiş'}</p>
                            {item.product?.sku && (
                              <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 text-center">{item.quantity}</td>
                        <td className="py-3 text-right">{item.price.toLocaleString('tr-TR')} TL</td>
                        <td className="py-3 text-right font-medium">{item.total.toLocaleString('tr-TR')} TL</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Summary */}
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span>{order.subtotal.toLocaleString('tr-TR')} TL</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kargo</span>
                  <span>{order.shipping_cost.toLocaleString('tr-TR')} TL</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>İndirim</span>
                    <span>-{order.discount.toLocaleString('tr-TR')} TL</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Toplam</span>
                  <span>{order.total.toLocaleString('tr-TR')} TL</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {order.shipping_address && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <MapPin className="w-5 h-5" />
                <CardTitle>Teslimat Adresi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">
                    {order.shipping_address.first_name} {order.shipping_address.last_name}
                  </p>
                  <p className="text-gray-600">{order.shipping_address.address}</p>
                  <p className="text-gray-600">
                    {order.shipping_address.district}, {order.shipping_address.city} {order.shipping_address.postal_code}
                  </p>
                  <p className="text-gray-600">Tel: {order.shipping_address.phone}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Truck className="w-5 h-5" />
              <CardTitle>Sipariş Durumu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Sipariş Durumu</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Ödeme Durumu</Label>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tracking">Kargo Takip No</Label>
                <Input
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Takip numarası girin"
                />
              </div>

              {/* E-posta bildirimi checkbox */}
              {(status === 'shipped' || status === 'delivered' || status === 'cancelled') && status !== originalStatus && (
                <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <Checkbox
                    id="sendNotification"
                    checked={sendNotification}
                    onCheckedChange={(checked) => setSendNotification(checked === true)}
                  />
                  <label
                    htmlFor="sendNotification"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-blue-600" />
                    Müşteriye e-posta bildirimi gönder
                  </label>
                </div>
              )}

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={handleSave}
                disabled={saving || sendingEmail}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Kaydediliyor...' : sendingEmail ? 'E-posta gönderiliyor...' : 'Güncelle'}
              </Button>
            </CardContent>
          </Card>

          {/* Customer Info */}
          {order.customer && (
            <Card>
              <CardHeader>
                <CardTitle>Müşteri Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">
                  {order.customer.first_name} {order.customer.last_name}
                </p>
                <p className="text-gray-600">{order.customer.email}</p>
                {order.customer.phone && (
                  <p className="text-gray-600">Tel: {order.customer.phone}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Payment Info */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <CreditCard className="w-5 h-5" />
              <CardTitle>Ödeme Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Yöntem</span>
                <span className="font-medium">{order.payment_method || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Durum</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.payment_status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : order.payment_status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {paymentStatusOptions.find((p) => p.value === order.payment_status)?.label || order.payment_status}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Sipariş Notu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
