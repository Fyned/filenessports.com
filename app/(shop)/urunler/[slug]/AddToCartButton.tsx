'use client'

import { useState, useMemo } from 'react'
import { Product } from '@/types/database'
import { useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShoppingCart, Plus, Minus, Check, Ruler } from 'lucide-react'
import { toast } from 'sonner'

interface AddToCartButtonProps {
  product: Product
}

type Unit = 'cm' | 'm'

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [unit, setUnit] = useState<Unit>('m')
  const addItem = useCartStore((state) => state.addItem)

  const isM2 = product.is_m2_pricing && product.price_per_m2

  const toCm = (val: number) => unit === 'm' ? val * 100 : val
  const fromCm = (val: number) => unit === 'm' ? val / 100 : val

  const widthCm = toCm(parseFloat(width) || 0)
  const heightCm = toCm(parseFloat(height) || 0)

  const m2Calc = useMemo(() => {
    if (!isM2) return null
    if (!widthCm || !heightCm || widthCm <= 0 || heightCm <= 0) return null
    const m2 = (widthCm / 100) * (heightCm / 100)
    const total = Math.round(m2 * product.price_per_m2! * 100) / 100
    return { m2, total }
  }, [widthCm, heightCm, isM2, product.price_per_m2])

  const widthValid = !isM2 || (widthCm >= product.min_width_cm && widthCm <= product.max_width_cm)
  const heightValid = !isM2 || (heightCm >= product.min_height_cm && heightCm <= product.max_height_cm)
  const m2Valid = !isM2 || (m2Calc && widthValid && heightValid)

  const minW = fromCm(product.min_width_cm)
  const maxW = fromCm(product.max_width_cm)
  const minH = fromCm(product.min_height_cm)
  const maxH = fromCm(product.max_height_cm)
  const unitLabel = unit === 'm' ? 'm' : 'cm'
  const step = unit === 'm' ? '0.01' : '1'

  const handleAddToCart = () => {
    if (isM2 && !m2Valid) {
      toast.error('Lutfen gecerli olculer girin')
      return
    }

    const m2Options = isM2 ? { width: widthCm, height: heightCm } : undefined
    addItem(product, quantity, undefined, m2Options)
    setAdded(true)

    const desc = isM2 && m2Calc
      ? `${parseFloat(width)}×${parseFloat(height)} ${unitLabel} = ${m2Calc.m2.toFixed(2)} m² — ${m2Calc.total.toLocaleString('tr-TR')} TL`
      : product.name

    toast.success(`${quantity} adet urun sepete eklendi`, {
      description: desc,
      action: {
        label: 'Sepete Git',
        onClick: () => window.location.href = '/sepet'
      }
    })
    setTimeout(() => setAdded(false), 2000)
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  if (product.stock === 0) {
    return (
      <div className="space-y-4">
        <Button disabled className="w-full" size="lg">
          Stokta Yok
        </Button>
        <p className="text-sm text-gray-500 text-center">
          Urun tekrar stoga girdiginde haber vermemizi ister misiniz?
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* M² Dimensions Input */}
      {isM2 && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Ruler className="w-4 h-4" />
              <span>Özel Ölçü Girin</span>
            </div>
            <div className="flex items-center bg-white border rounded-lg overflow-hidden text-sm">
              <button
                type="button"
                onClick={() => { setUnit('cm'); setWidth(''); setHeight('') }}
                className={`px-3 py-1.5 font-medium transition-colors ${unit === 'cm' ? 'bg-[#BB1624] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                cm
              </button>
              <button
                type="button"
                onClick={() => { setUnit('m'); setWidth(''); setHeight('') }}
                className={`px-3 py-1.5 font-medium transition-colors ${unit === 'm' ? 'bg-[#BB1624] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                metre
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Genişlik ({unitLabel})</label>
              <Input
                type="number"
                step={step}
                min={minW}
                max={maxW}
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder={`${minW}–${maxW}`}
                className={!widthValid && width ? 'border-red-400' : ''}
              />
              {!widthValid && width && (
                <p className="text-xs text-red-500 mt-1">
                  {minW}–{maxW} {unitLabel} arası
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Yükseklik ({unitLabel})</label>
              <Input
                type="number"
                step={step}
                min={minH}
                max={maxH}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder={`${minH}–${maxH}`}
                className={!heightValid && height ? 'border-red-400' : ''}
              />
              {!heightValid && height && (
                <p className="text-xs text-red-500 mt-1">
                  {minH}–{maxH} {unitLabel} arası
                </p>
              )}
            </div>
          </div>

          {m2Calc && widthValid && heightValid && (
            <div className="bg-white rounded-lg p-3 border">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Alan:</span>
                <span className="font-medium">{m2Calc.m2.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>m² Fiyatı:</span>
                <span>{product.price_per_m2!.toLocaleString('tr-TR')} TL</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-[#BB1624]">
                <span>Birim Fiyat:</span>
                <span>{m2Calc.total.toLocaleString('tr-TR')} TL</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Adet:</span>
        <div className="flex items-center border rounded-lg">
          <button
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 font-medium min-w-[50px] text-center">{quantity}</span>
          <button
            onClick={increaseQuantity}
            disabled={quantity >= product.stock}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={!!(isM2 && !m2Valid)}
        className={`w-full ${added ? 'bg-green-600 hover:bg-green-700' : 'bg-[#BB1624] hover:bg-[#8F101B]'}`}
        size="lg"
      >
        {added ? (
          <>
            <Check className="w-5 h-5 mr-2" />
            Sepete Eklendi
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5 mr-2" />
            {isM2 && m2Calc ? `Sepete Ekle — ${(m2Calc.total * quantity).toLocaleString('tr-TR')} TL` : 'Sepete Ekle'}
          </>
        )}
      </Button>

      {/* Total for multiple quantity */}
      {!isM2 && quantity > 1 && (
        <p className="text-sm text-gray-600 text-center">
          Toplam: {(product.price * quantity).toLocaleString('tr-TR')} TL
        </p>
      )}
      {isM2 && m2Calc && quantity > 1 && (
        <p className="text-sm text-gray-600 text-center">
          {quantity} adet × {m2Calc.total.toLocaleString('tr-TR')} TL = {(m2Calc.total * quantity).toLocaleString('tr-TR')} TL
        </p>
      )}
    </div>
  )
}
