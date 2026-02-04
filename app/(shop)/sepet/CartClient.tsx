'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore, AppliedCoupon } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, Tag, X, Check, Loader2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

interface CartClientProps {
  freeShippingThreshold: number
  defaultShippingCost: number
}

export function CartClient({ freeShippingThreshold, defaultShippingCost }: CartClientProps) {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart, coupon, applyCoupon, removeCoupon } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  // Hydration fix for zustand persist
  useEffect(() => {
    setMounted(true)
    if (coupon?.code) {
      setCouponCode(coupon.code)
    }
  }, [coupon])

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Lütfen bir kupon kodu girin')
      return
    }

    setCouponLoading(true)
    try {
      const subtotal = getSubtotal()
      const productIds = items.map(item => item.product.id)
      const categoryIds = items
        .map(item => item.product.category_id)
        .filter((id): id is string => id !== null)

      const response = await fetch('/api/coupon/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.toUpperCase(),
          orderTotal: subtotal,
          productIds,
          categoryIds,
        }),
      })

      const data = await response.json()

      if (data.valid) {
        const appliedCoupon: AppliedCoupon = {
          id: data.coupon.id,
          code: data.coupon.code,
          description: data.coupon.description,
          discount_type: data.coupon.discount_type,
          discount_value: data.coupon.discount_value,
          discountAmount: data.discountAmount,
        }
        applyCoupon(appliedCoupon)
        toast.success(`Kupon uygulandı! ${formatPrice(data.discountAmount)} indirim kazandınız.`)
      } else {
        toast.error(data.error || 'Kupon geçersiz')
      }
    } catch (error) {
      console.error('Coupon validation error:', error)
      toast.error('Kupon doğrulanırken bir hata oluştu')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    setCouponCode('')
    toast.success('Kupon kaldırıldı')
  }

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#BB1624] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-[#1C2840] mb-4">Sepetiniz Boş</h1>
          <p className="text-gray-600 mb-8">
            Henüz sepetinize ürün eklemediniz. Alışverişe başlamak için ürünlerimizi inceleyin.
          </p>
          <Link href="/urunler">
            <Button className="bg-[#BB1624] hover:bg-[#8F101B]">
              Alışverişe Başla
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = getSubtotal()
  const discountAmount = coupon?.discountAmount || 0
  const afterDiscount = subtotal - discountAmount
  const shippingCost = afterDiscount >= freeShippingThreshold ? 0 : defaultShippingCost
  const total = afterDiscount + shippingCost
  const remainingForFreeShipping = freeShippingThreshold - afterDiscount

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1C2840] mb-8">Sepetim</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const price = item.variant?.price || item.product.price
            const comparePrice = item.product.compare_price
            const imageUrl = item.product.images?.[0]?.url || '/images/placeholder-product.svg'

            return (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/urunler/${item.product.slug}`}
                    className="font-medium text-[#1C2840] hover:text-[#BB1624] transition-colors line-clamp-2"
                  >
                    {item.product.name}
                  </Link>

                  {item.variant && (
                    <p className="text-sm text-gray-500 mt-1">{item.variant.name}</p>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-[#BB1624]">{formatPrice(price)}</span>
                    {comparePrice && comparePrice > price && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(comparePrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    aria-label="Ürünü kaldır"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium min-w-[40px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="font-bold text-[#1C2840]">
                    {formatPrice(price * item.quantity)}
                  </span>
                </div>
              </div>
            )
          })}

          <button
            onClick={clearCart}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Sepeti Temizle
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
            <h2 className="text-xl font-bold text-[#1C2840] mb-6">Sipariş Özeti</h2>

            {/* Coupon Section */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Tag className="w-4 h-4" />
                İndirim Kuponu
              </label>
              {coupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">{coupon.code}</p>
                      <p className="text-xs text-green-600">
                        {coupon.discount_type === 'percentage'
                          ? `%${coupon.discount_value} indirim`
                          : `${formatPrice(coupon.discount_value)} indirim`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-1 hover:bg-green-100 rounded"
                  >
                    <X className="w-4 h-4 text-green-600" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Kupon kodu"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                  >
                    {couponLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Uygula'
                    )}
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Ara Toplam</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-green-600">
                  <span>İndirim ({coupon.code})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Kargo</span>
                <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                  {shippingCost === 0 ? 'Ücretsiz' : formatPrice(shippingCost)}
                </span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold text-[#1C2840]">
                <span>Toplam</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {remainingForFreeShipping > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-blue-700 text-sm">
                  <Truck className="w-5 h-5" />
                  <span>
                    <strong>{formatPrice(remainingForFreeShipping)}</strong> daha alışveriş yapın,
                    kargo <strong>ücretsiz</strong> olsun!
                  </span>
                </div>
              </div>
            )}

            <Link href="/odeme">
              <Button className="w-full bg-[#BB1624] hover:bg-[#8F101B] h-12 text-lg">
                Ödemeye Geç
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <p className="text-xs text-gray-500 text-center mt-4">
              Güvenli ödeme ile alışverişinizi tamamlayın
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
