'use client'

import { useState } from 'react'
import { Product } from '@/types/database'
import { useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react'
import { toast } from 'sonner'

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAdded(true)
    toast.success(`${quantity} adet ürün sepete eklendi`, {
      description: product.name,
      action: {
        label: 'Sepete Git',
        onClick: () => window.location.href = '/sepet'
      }
    })
    setTimeout(() => setAdded(false), 2000)
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
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
            Sepete Ekle
          </>
        )}
      </Button>

      {/* Total */}
      {quantity > 1 && (
        <p className="text-sm text-gray-600 text-center">
          Toplam: {(product.price * quantity).toLocaleString('tr-TR')} TL
        </p>
      )}
    </div>
  )
}
