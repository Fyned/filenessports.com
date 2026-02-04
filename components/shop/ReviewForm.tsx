'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StarRating } from './StarRating'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface ReviewFormProps {
  productId: string
  productName: string
  onSubmit: () => void
  onCancel: () => void
}

export function ReviewForm({ productId, productName, onSubmit, onCancel }: ReviewFormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    pros: '',
    cons: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.rating === 0) {
      toast.error('Lütfen bir puan verin')
      return
    }

    if (!formData.comment.trim()) {
      toast.error('Lütfen bir yorum yazın')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Oturum süreniz dolmuş, lütfen tekrar giriş yapın')
        return
      }

      // Check if user has purchased this product
      const { data: purchaseData } = await supabase
        .from('order_items')
        .select('order_id, orders!inner(id, user_id, status)')
        .eq('product_id', productId)
        .eq('orders.user_id', user.id)
        .eq('orders.status', 'delivered')
        .limit(1)

      const isVerifiedPurchase = purchaseData && purchaseData.length > 0
      const orderId = purchaseData?.[0]?.order_id || null

      const { error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          order_id: orderId,
          rating: formData.rating,
          title: formData.title || null,
          comment: formData.comment,
          pros: formData.pros || null,
          cons: formData.cons || null,
          is_verified_purchase: isVerifiedPurchase,
          is_approved: false, // Admin onayı gerekli
        })

      if (error) throw error

      onSubmit()
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Yorum gönderilirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Product Name */}
      <div className="text-sm text-gray-600">
        <span className="font-medium">{productName}</span> için değerlendirme yapıyorsunuz
      </div>

      {/* Rating */}
      <div>
        <Label className="mb-2 block">Puanınız *</Label>
        <StarRating
          rating={formData.rating}
          size="lg"
          interactive
          onChange={(rating) => setFormData({ ...formData, rating })}
        />
      </div>

      {/* Title */}
      <div>
        <Label htmlFor="review-title">Başlık</Label>
        <Input
          id="review-title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Örn: Harika bir ürün!"
          maxLength={255}
        />
      </div>

      {/* Comment */}
      <div>
        <Label htmlFor="review-comment">Yorumunuz *</Label>
        <Textarea
          id="review-comment"
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
          rows={4}
          required
        />
      </div>

      {/* Pros and Cons */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="review-pros" className="text-green-600">+ Artılar</Label>
          <Textarea
            id="review-pros"
            value={formData.pros}
            onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
            placeholder="Beğendiğiniz özellikler..."
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor="review-cons" className="text-red-600">- Eksiler</Label>
          <Textarea
            id="review-cons"
            value={formData.cons}
            onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
            placeholder="Geliştirilmesi gereken yönler..."
            rows={2}
          />
        </div>
      </div>

      {/* Info */}
      <p className="text-xs text-gray-500">
        Yorumunuz moderasyon sürecinden geçtikten sonra yayınlanacaktır.
      </p>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          İptal
        </Button>
        <Button
          type="submit"
          className="bg-[#BB1624] hover:bg-[#8F101B]"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Gönderiliyor...
            </>
          ) : (
            'Yorumu Gönder'
          )}
        </Button>
      </div>
    </form>
  )
}
