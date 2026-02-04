'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWishlistStore } from '@/stores/wishlist-store'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  productId: string
  variant?: 'icon' | 'button'
  className?: string
}

export function WishlistButton({
  productId,
  variant = 'icon',
  className,
}: WishlistButtonProps) {
  const supabase = createClient()
  const { isInWishlist, addItem, removeItem } = useWishlistStore()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Local store'dan kontrol et
    setIsWishlisted(isInWishlist(productId))

    // Auth durumunu kontrol et
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)

      if (user) {
        // Server'dan kontrol et
        const { data } = await supabase
          .from('wishlist')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .single()

        if (data) {
          setIsWishlisted(true)
          addItem(productId)
        }
      }
    }

    checkAuth()
  }, [productId, supabase, isInWishlist, addItem])

  const handleToggle = async () => {
    if (loading) return

    // Giriş yapmamışsa uyar
    if (!isLoggedIn) {
      toast.error('Favorilere eklemek için giriş yapmalısınız', {
        action: {
          label: 'Giriş Yap',
          onClick: () => window.location.href = '/giris?redirect=' + window.location.pathname,
        },
      })
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Oturum süresi dolmuş, lütfen tekrar giriş yapın')
        return
      }

      if (isWishlisted) {
        // Favorilerden kaldır
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)

        if (error) throw error

        removeItem(productId)
        setIsWishlisted(false)
        toast.success('Favorilerden kaldırıldı')
      } else {
        // Favorilere ekle
        const { error } = await supabase
          .from('wishlist')
          .insert({
            user_id: user.id,
            product_id: productId,
          })

        if (error) throw error

        addItem(productId)
        setIsWishlisted(true)
        toast.success('Favorilere eklendi')
      }
    } catch (error) {
      console.error('Wishlist error:', error)
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        onClick={handleToggle}
        disabled={loading}
        className={cn('gap-2', className)}
      >
        <Heart
          className={cn(
            'w-5 h-5 transition-colors',
            isWishlisted ? 'fill-red-500 text-red-500' : ''
          )}
        />
        {isWishlisted ? 'Favorilerden Kaldır' : 'Favorilere Ekle'}
      </Button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        'p-2 rounded-full transition-all hover:scale-110',
        isWishlisted
          ? 'bg-red-50 hover:bg-red-100'
          : 'bg-white/80 hover:bg-white',
        loading && 'opacity-50 cursor-not-allowed',
        className
      )}
      title={isWishlisted ? 'Favorilerden kaldır' : 'Favorilere ekle'}
    >
      <Heart
        className={cn(
          'w-5 h-5 transition-colors',
          isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
        )}
      />
    </button>
  )
}
