import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistItem {
  productId: string
  addedAt: string
}

interface WishlistState {
  items: WishlistItem[]
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleItem: (productId: string) => void
  clearWishlist: () => void
  syncWithServer: (serverItems: string[]) => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId: string) => {
        const items = get().items
        if (!items.find((item) => item.productId === productId)) {
          set({
            items: [
              ...items,
              {
                productId,
                addedAt: new Date().toISOString(),
              },
            ],
          })
        }
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        })
      },

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.productId === productId)
      },

      toggleItem: (productId: string) => {
        const isIn = get().isInWishlist(productId)
        if (isIn) {
          get().removeItem(productId)
        } else {
          get().addItem(productId)
        }
      },

      clearWishlist: () => {
        set({ items: [] })
      },

      // Server'dan gelen verileri senkronize et
      syncWithServer: (serverItems: string[]) => {
        set({
          items: serverItems.map((productId) => ({
            productId,
            addedAt: new Date().toISOString(),
          })),
        })
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
)
