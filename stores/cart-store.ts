import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, ProductVariant } from '@/types/database'

export interface CartItem {
  id: string
  product: Product
  variant?: ProductVariant
  quantity: number
}

export interface AppliedCoupon {
  id: string
  code: string
  description?: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  discountAmount: number
}

interface CartStore {
  items: CartItem[]
  coupon: AppliedCoupon | null
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getSubtotal: () => number
  getItemCount: () => number
  applyCoupon: (coupon: AppliedCoupon) => void
  removeCoupon: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (product, quantity = 1, variant) => {
        const items = get().items
        const existingItemIndex = items.findIndex(
          (item) =>
            item.product.id === product.id &&
            (variant ? item.variant?.id === variant.id : !item.variant)
        )

        if (existingItemIndex > -1) {
          const newItems = [...items]
          newItems[existingItemIndex].quantity += quantity
          set({ items: newItems })
        } else {
          const newItem: CartItem = {
            id: `${product.id}-${variant?.id || 'default'}-${Date.now()}`,
            product,
            variant,
            quantity,
          }
          set({ items: [...items, newItem] })
        }
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((item) => item.id !== itemId) })
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }

        const newItems = get().items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
        set({ items: newItems })
      },

      clearCart: () => {
        set({ items: [], coupon: null })
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.variant?.price || item.product.price
          return total + price * item.quantity
        }, 0)
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const coupon = get().coupon
        if (coupon) {
          return Math.max(0, subtotal - coupon.discountAmount)
        }
        return subtotal
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },

      applyCoupon: (coupon) => {
        set({ coupon })
      },

      removeCoupon: () => {
        set({ coupon: null })
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
