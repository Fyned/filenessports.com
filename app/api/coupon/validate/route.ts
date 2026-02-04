import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface ValidateCouponRequest {
  code: string
  orderTotal: number
  productIds?: string[]
  categoryIds?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: ValidateCouponRequest = await request.json()
    const { code, orderTotal, productIds = [], categoryIds = [] } = body

    if (!code) {
      return NextResponse.json({ error: 'Kupon kodu gerekli' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get current user (optional - for usage limit check)
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch coupon
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .single()

    if (error || !coupon) {
      return NextResponse.json({
        valid: false,
        error: 'Geçersiz kupon kodu'
      }, { status: 400 })
    }

    // Check if coupon is active
    if (!coupon.is_active) {
      return NextResponse.json({
        valid: false,
        error: 'Bu kupon artık aktif değil'
      }, { status: 400 })
    }

    // Check validity dates
    const now = new Date()
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return NextResponse.json({
        valid: false,
        error: 'Bu kupon henüz geçerli değil'
      }, { status: 400 })
    }

    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      return NextResponse.json({
        valid: false,
        error: 'Bu kuponun süresi dolmuş'
      }, { status: 400 })
    }

    // Check total usage limit
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json({
        valid: false,
        error: 'Bu kuponun kullanım limiti dolmuş'
      }, { status: 400 })
    }

    // Check user usage limit
    if (user && coupon.max_uses_per_user) {
      const { count } = await supabase
        .from('coupon_usages')
        .select('*', { count: 'exact', head: true })
        .eq('coupon_id', coupon.id)
        .eq('user_id', user.id)

      if (count && count >= coupon.max_uses_per_user) {
        return NextResponse.json({
          valid: false,
          error: 'Bu kuponu daha önce kullandınız'
        }, { status: 400 })
      }
    }

    // Check minimum order amount
    if (coupon.min_order_amount && orderTotal < coupon.min_order_amount) {
      return NextResponse.json({
        valid: false,
        error: `Minimum sipariş tutarı ${formatPrice(coupon.min_order_amount)} olmalıdır`
      }, { status: 400 })
    }

    // Check product/category applicability
    if (coupon.applies_to === 'products' && coupon.applicable_ids?.length > 0) {
      const hasApplicableProduct = productIds.some(id => coupon.applicable_ids.includes(id))
      if (!hasApplicableProduct) {
        return NextResponse.json({
          valid: false,
          error: 'Bu kupon sepetinizdeki ürünler için geçerli değil'
        }, { status: 400 })
      }
    }

    if (coupon.applies_to === 'categories' && coupon.applicable_ids?.length > 0) {
      const hasApplicableCategory = categoryIds.some(id => coupon.applicable_ids.includes(id))
      if (!hasApplicableCategory) {
        return NextResponse.json({
          valid: false,
          error: 'Bu kupon sepetinizdeki kategoriler için geçerli değil'
        }, { status: 400 })
      }
    }

    // Calculate discount
    let discountAmount: number

    if (coupon.discount_type === 'percentage') {
      discountAmount = (orderTotal * coupon.discount_value) / 100

      // Apply max discount limit for percentage coupons
      if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
        discountAmount = coupon.max_discount_amount
      }
    } else {
      // Fixed discount
      discountAmount = Math.min(coupon.discount_value, orderTotal)
    }

    // Round to 2 decimal places
    discountAmount = Math.round(discountAmount * 100) / 100

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
      },
      discountAmount,
      newTotal: Math.max(0, orderTotal - discountAmount),
    })

  } catch (error) {
    console.error('Coupon validation error:', error)
    return NextResponse.json({
      valid: false,
      error: 'Kupon doğrulanırken bir hata oluştu'
    }, { status: 500 })
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(price)
}
