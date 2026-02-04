'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StarRating } from './StarRating'
import { ReviewForm } from './ReviewForm'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  ThumbsUp,
  User,
  CheckCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Review {
  id: string
  rating: number
  title: string | null
  comment: string | null
  pros: string | null
  cons: string | null
  is_verified_purchase: boolean
  helpful_count: number
  created_at: string
  user_profiles: {
    first_name: string | null
    last_name: string | null
  } | null
}

interface ProductReviewsProps {
  productId: string
  productName: string
}

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const supabase = createClient()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [hasUserReviewed, setHasUserReviewed] = useState(false)
  const [canReview, setCanReview] = useState(false)
  const [helpfulMarked, setHelpfulMarked] = useState<Set<string>>(new Set())
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  })

  useEffect(() => {
    loadReviews()
    checkUserStatus()
  }, [productId])

  const loadReviews = async () => {
    setLoading(true)
    try {
      // Fetch approved reviews
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          id,
          rating,
          title,
          comment,
          pros,
          cons,
          is_verified_purchase,
          helpful_count,
          created_at,
          user_profiles(first_name, last_name)
        `)
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Normalize user_profiles from array to single object
      const normalizedData = (data || []).map((review: any) => ({
        ...review,
        user_profiles: Array.isArray(review.user_profiles)
          ? review.user_profiles[0] || null
          : review.user_profiles,
      }))

      setReviews(normalizedData)

      // Calculate stats
      if (data && data.length > 0) {
        const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        let totalRating = 0

        data.forEach((review) => {
          totalRating += review.rating
          ratingCounts[review.rating as keyof typeof ratingCounts]++
        })

        setStats({
          averageRating: totalRating / data.length,
          totalReviews: data.length,
          ratingCounts,
        })
      }
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkUserStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      setCurrentUser(user.id)

      // Check if user already reviewed
      const { data: existingReview } = await supabase
        .from('product_reviews')
        .select('id')
        .eq('product_id', productId)
        .eq('user_id', user.id)
        .single()

      setHasUserReviewed(!!existingReview)

      // Check if user has purchased this product
      const { data: purchaseData } = await supabase
        .from('order_items')
        .select('id, orders!inner(user_id, status)')
        .eq('product_id', productId)
        .eq('orders.user_id', user.id)
        .eq('orders.status', 'delivered')
        .limit(1)

      setCanReview(!!purchaseData && purchaseData.length > 0)

      // Load user's helpful marks
      const { data: helpfulData } = await supabase
        .from('review_helpful')
        .select('review_id')
        .eq('user_id', user.id)

      if (helpfulData) {
        setHelpfulMarked(new Set(helpfulData.map((h) => h.review_id)))
      }
    }
  }

  const handleReviewSubmit = async () => {
    setShowForm(false)
    setHasUserReviewed(true)
    toast.success('Yorumunuz gönderildi. Onaylandıktan sonra yayınlanacaktır.')
    loadReviews()
  }

  const toggleHelpful = async (reviewId: string) => {
    if (!currentUser) {
      toast.error('Faydalı bulmak için giriş yapmalısınız')
      return
    }

    try {
      if (helpfulMarked.has(reviewId)) {
        // Remove helpful mark
        await supabase
          .from('review_helpful')
          .delete()
          .eq('review_id', reviewId)
          .eq('user_id', currentUser)

        setHelpfulMarked((prev) => {
          const next = new Set(prev)
          next.delete(reviewId)
          return next
        })

        // Update local count
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, helpful_count: r.helpful_count - 1 } : r
          )
        )
      } else {
        // Add helpful mark
        await supabase
          .from('review_helpful')
          .insert({ review_id: reviewId, user_id: currentUser })

        setHelpfulMarked((prev) => new Set([...prev, reviewId]))

        // Update local count
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, helpful_count: r.helpful_count + 1 } : r
          )
        )
      }
    } catch (error) {
      console.error('Error toggling helpful:', error)
      toast.error('Bir hata oluştu')
    }
  }

  const getUserDisplayName = (review: Review) => {
    if (review.user_profiles?.first_name) {
      const firstName = review.user_profiles.first_name
      const lastName = review.user_profiles.last_name?.[0] || ''
      return `${firstName} ${lastName}.`
    }
    return 'Anonim Kullanıcı'
  }

  if (loading) {
    return (
      <div className="py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-[#1C2840] mb-6">
        Müşteri Yorumları
      </h2>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Average Rating */}
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-[#1C2840] mb-2">
            {stats.averageRating.toFixed(1)}
          </div>
          <StarRating rating={stats.averageRating} size="lg" className="justify-center mb-2" />
          <p className="text-gray-600">{stats.totalReviews} değerlendirme</p>
        </div>

        {/* Rating Distribution */}
        <div className="md:col-span-2 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingCounts[rating as keyof typeof stats.ratingCounts]
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0

            return (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm w-12">{rating} yıldız</span>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-10">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Write Review Button */}
      {!showForm && (
        <div className="mb-8">
          {!currentUser ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
              <p>Yorum yazmak için <a href="/giris" className="underline font-medium">giriş yapın</a>.</p>
            </div>
          ) : hasUserReviewed ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
              <CheckCircle className="inline-block w-5 h-5 mr-2" />
              Bu ürün için zaten yorum yazdınız.
            </div>
          ) : !canReview ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
              <p>Yorum yapabilmek için bu ürünü satın almış ve teslim almış olmanız gerekir.</p>
            </div>
          ) : (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-[#BB1624] hover:bg-[#8F101B]"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Yorum Yaz
            </Button>
          )}
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Değerlendirmenizi Yazın</h3>
          <ReviewForm
            productId={productId}
            productName={productName}
            onSubmit={handleReviewSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Henüz yorum yapılmamış. İlk yorumu siz yazın!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{getUserDisplayName(review)}</span>
                    {review.is_verified_purchase && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Doğrulanmış Alışveriş
                      </span>
                    )}
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {review.title && (
                <h4 className="font-semibold text-[#1C2840] mt-3">{review.title}</h4>
              )}

              {review.comment && (
                <p className="text-gray-600 mt-2">{review.comment}</p>
              )}

              {(review.pros || review.cons) && (
                <div className="mt-3 grid md:grid-cols-2 gap-4">
                  {review.pros && (
                    <div className="text-sm">
                      <span className="font-medium text-green-600">+ Artılar:</span>
                      <p className="text-gray-600">{review.pros}</p>
                    </div>
                  )}
                  {review.cons && (
                    <div className="text-sm">
                      <span className="font-medium text-red-600">- Eksiler:</span>
                      <p className="text-gray-600">{review.cons}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4">
                <button
                  onClick={() => toggleHelpful(review.id)}
                  className={cn(
                    'inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full border transition',
                    helpfulMarked.has(review.id)
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <ThumbsUp className="w-4 h-4" />
                  Faydalı ({review.helpful_count})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
