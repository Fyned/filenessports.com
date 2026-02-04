'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore, AppliedCoupon } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ArrowLeft, CreditCard, Lock, Loader2, Tag, X, Check } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface InstallmentOption {
  installment: number
  totalPrice: number
  installmentPrice: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, getSubtotal, clearCart, coupon, applyCoupon, removeCoupon } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [installments, setInstallments] = useState<InstallmentOption[]>([])
  const [selectedInstallment, setSelectedInstallment] = useState(1)
  const [cardInfo, setCardInfo] = useState({ cardType: '', bankName: '' })
  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    // Müşteri bilgileri
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    identityNumber: '',
    // Adres bilgileri
    address: '',
    city: '',
    district: '',
    zipCode: '',
    // Kart bilgileri
    cardHolderName: '',
    cardNumber: '',
    expireMonth: '',
    expireYear: '',
    cvc: '',
    // Sözleşmeler
    termsAccepted: false,
    privacyAccepted: false,
  })

  useEffect(() => {
    setMounted(true)
    // Load coupon code from store if exists
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

  // Kart numarası değiştiğinde veya kupon değiştiğinde taksit bilgisi al
  useEffect(() => {
    const cardNumber = formData.cardNumber.replace(/\s/g, '')
    if (cardNumber.length >= 6 && mounted) {
      fetchInstallments(cardNumber)
    }
  }, [formData.cardNumber, mounted, coupon])

  const fetchInstallments = async (cardNumber: string) => {
    try {
      const subtotalForCalc = getSubtotal()
      const discountForCalc = coupon?.discountAmount || 0
      const afterDiscountForCalc = subtotalForCalc - discountForCalc
      const shippingForCalc = afterDiscountForCalc >= 150 ? 0 : 29.90
      const totalForCalc = afterDiscountForCalc + shippingForCalc

      const response = await fetch('/api/payment/installments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          binNumber: cardNumber,
          price: totalForCalc,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setInstallments(data.installments || [])
        setCardInfo({
          cardType: data.cardType || '',
          bankName: data.bankName || '',
        })
      }
    } catch (error) {
      console.error('Installment fetch error:', error)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    return parts.length ? parts.join(' ') : value
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.termsAccepted || !formData.privacyAccepted) {
      toast.error('Lütfen sözleşmeleri kabul edin')
      return
    }

    setLoading(true)

    try {
      const cartItems = items.map((item) => ({
        id: item.id,
        productId: item.product.id,
        variantId: item.variant?.id,
        name: item.product.name,
        variantName: item.variant?.name,
        sku: item.product.sku,
        price: item.variant?.price || item.product.price,
        quantity: item.quantity,
        category: item.product.category?.name,
      }))

      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            identityNumber: formData.identityNumber,
          },
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            district: formData.district,
            zipCode: formData.zipCode,
          },
          cardDetails: {
            cardHolderName: formData.cardHolderName,
            cardNumber: formData.cardNumber,
            expireMonth: formData.expireMonth,
            expireYear: formData.expireYear,
            cvc: formData.cvc,
          },
          installment: selectedInstallment,
          coupon: coupon ? {
            id: coupon.id,
            code: coupon.code,
            discountAmount: coupon.discountAmount,
          } : null,
        }),
      })

      const data = await response.json()

      if (data.success && data.threeDSHtmlContent) {
        // 3D Secure sayfasına yönlendir
        clearCart()

        // 3D Secure HTML'ini yeni pencerede aç
        const newWindow = window.open('', '_self')
        if (newWindow) {
          newWindow.document.write(data.threeDSHtmlContent)
          newWindow.document.close()
        }
      } else {
        toast.error(data.error || 'Ödeme başlatılamadı')
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error('Ödeme işlemi sırasında bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#BB1624]" />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-[#1C2840] mb-4">Sepetiniz Boş</h1>
          <p className="text-gray-600 mb-8">Ödeme yapabilmek için sepetinize ürün ekleyin.</p>
          <Link href="/urunler">
            <Button className="bg-[#BB1624] hover:bg-[#8F101B]">Alışverişe Başla</Button>
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = getSubtotal()
  const discountAmount = coupon?.discountAmount || 0
  const afterDiscount = subtotal - discountAmount
  const shippingCost = afterDiscount >= 150 ? 0 : 29.90
  const total = afterDiscount + shippingCost

  const cities = [
    'Adana', 'Ankara', 'Antalya', 'Bursa', 'Denizli', 'Diyarbakır', 'Eskişehir',
    'Gaziantep', 'İstanbul', 'İzmir', 'Kayseri', 'Kocaeli', 'Konya', 'Manisa',
    'Mersin', 'Muğla', 'Sakarya', 'Samsun', 'Tekirdağ', 'Trabzon',
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/sepet" className="inline-flex items-center text-gray-600 hover:text-[#BB1624] mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Sepete Dön
      </Link>

      <h1 className="text-3xl font-bold text-[#1C2840] mb-8">Ödeme</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Müşteri Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Ad *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Soyad *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">E-posta *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="05XX XXX XX XX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="identityNumber">TC Kimlik No *</Label>
                  <Input
                    id="identityNumber"
                    maxLength={11}
                    value={formData.identityNumber}
                    onChange={(e) => setFormData({ ...formData, identityNumber: e.target.value.replace(/\D/g, '') })}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Teslimat Adresi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Adres *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Mahalle, sokak, bina no, daire no"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">İl *</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) => setFormData({ ...formData, city: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="district">İlçe *</Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Posta Kodu</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Kart Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cardHolderName">Kart Üzerindeki İsim *</Label>
                  <Input
                    id="cardHolderName"
                    value={formData.cardHolderName}
                    onChange={(e) => setFormData({ ...formData, cardHolderName: e.target.value.toUpperCase() })}
                    placeholder="AD SOYAD"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cardNumber">Kart Numarası *</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      required
                    />
                    {cardInfo.bankName && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                        {cardInfo.bankName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="expireMonth">Ay *</Label>
                    <Select
                      value={formData.expireMonth}
                      onValueChange={(value) => setFormData({ ...formData, expireMonth: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="AA" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => {
                          const month = String(i + 1).padStart(2, '0')
                          return (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="expireYear">Yıl *</Label>
                    <Select
                      value={formData.expireYear}
                      onValueChange={(value) => setFormData({ ...formData, expireYear: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="YY" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = String(new Date().getFullYear() + i).slice(-2)
                          return (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC *</Label>
                    <Input
                      id="cvc"
                      value={formData.cvc}
                      onChange={(e) => setFormData({ ...formData, cvc: e.target.value.replace(/\D/g, '') })}
                      placeholder="000"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                {/* Installment Options */}
                {installments.length > 1 && (
                  <div>
                    <Label>Taksit Seçenekleri</Label>
                    <RadioGroup
                      value={String(selectedInstallment)}
                      onValueChange={(value) => setSelectedInstallment(Number(value))}
                      className="mt-2"
                    >
                      {installments.map((inst) => (
                        <div key={inst.installment} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value={String(inst.installment)} id={`inst-${inst.installment}`} />
                          <Label htmlFor={`inst-${inst.installment}`} className="flex-1 cursor-pointer">
                            <div className="flex justify-between">
                              <span>
                                {inst.installment === 1 ? 'Tek Çekim' : `${inst.installment} Taksit`}
                              </span>
                              <span className="font-medium">
                                {inst.installment === 1
                                  ? formatPrice(inst.totalPrice)
                                  : `${inst.installment} x ${formatPrice(inst.installmentPrice)}`}
                              </span>
                            </div>
                            {inst.installment > 1 && (
                              <span className="text-xs text-gray-500">
                                Toplam: {formatPrice(inst.totalPrice)}
                              </span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Terms & Conditions */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, termsAccepted: checked as boolean })
                    }
                  />
                  <Label htmlFor="terms" className="text-sm cursor-pointer">
                    <Link href="/kullanim-sartlari" target="_blank" className="text-[#BB1624] hover:underline">
                      Mesafeli Satış Sözleşmesi
                    </Link>
                    'ni okudum ve kabul ediyorum. *
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={formData.privacyAccepted}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, privacyAccepted: checked as boolean })
                    }
                  />
                  <Label htmlFor="privacy" className="text-sm cursor-pointer">
                    <Link href="/gizlilik-politikasi" target="_blank" className="text-[#BB1624] hover:underline">
                      Gizlilik Politikası
                    </Link>
                    'nı okudum ve kabul ediyorum. *
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => {
                    const price = item.variant?.price || item.product.price
                    const imageUrl = item.product.images?.[0]?.url || '/images/placeholder-product.jpg'

                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded"
                          />
                          <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#BB1624] text-white text-xs rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1C2840] line-clamp-2">
                            {item.product.name}
                          </p>
                          {item.variant && (
                            <p className="text-xs text-gray-500">{item.variant.name}</p>
                          )}
                          <p className="text-sm font-medium">{formatPrice(price * item.quantity)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Coupon Section */}
                <div className="border-t pt-4 mb-4">
                  <Label className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4" />
                    İndirim Kuponu
                  </Label>
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
                        type="button"
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
                        type="button"
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

                {/* Totals */}
                <div className="space-y-3 border-t pt-4">
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
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Ücretsiz</span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg text-[#1C2840]">
                      <span>Toplam</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full mt-6 bg-[#BB1624] hover:bg-[#8F101B] py-6 text-lg"
                  disabled={loading || !formData.termsAccepted || !formData.privacyAccepted}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      İşleniyor...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Güvenli Ödeme Yap
                    </>
                  )}
                </Button>

                {/* Security Badge */}
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Lock className="w-4 h-4" />
                    <span>256-bit SSL ile korunmaktadır</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Ödeme işlemi iyzico güvencesiyle gerçekleştirilmektedir.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
