import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  createThreedsPayment,
  formatIyzicoPrice,
  generateConversationId,
  type CreatePaymentRequest,
  type IyzicoBasketItem,
} from '@/lib/iyzico'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      cartItems,
      customer,
      shippingAddress,
      billingAddress,
      cardDetails,
      installment = 1,
    } = body

    // Validasyonlar
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Sepet boş' },
        { status: 400 }
      )
    }

    if (!customer || !customer.email) {
      return NextResponse.json(
        { error: 'Müşteri bilgileri eksik' },
        { status: 400 }
      )
    }

    if (!cardDetails) {
      return NextResponse.json(
        { error: 'Kart bilgileri eksik' },
        { status: 400 }
      )
    }

    // Toplam tutarı hesapla
    let totalPrice = 0
    const basketItems: IyzicoBasketItem[] = cartItems.map((item: any) => {
      const itemPrice = item.price * item.quantity
      totalPrice += itemPrice
      return {
        id: item.id,
        name: item.name,
        category1: item.category || 'Spor Ürünleri',
        itemType: 'PHYSICAL' as const,
        price: formatIyzicoPrice(itemPrice),
      }
    })

    // Kargo ücreti (150 TL üzeri ücretsiz)
    const shippingCost = totalPrice >= 150 ? 0 : 29.90
    if (shippingCost > 0) {
      basketItems.push({
        id: 'shipping',
        name: 'Kargo Ücreti',
        category1: 'Kargo',
        itemType: 'VIRTUAL',
        price: formatIyzicoPrice(shippingCost),
      })
      totalPrice += shippingCost
    }

    // Conversation ID oluştur
    const conversationId = generateConversationId()

    // Sipariş numarası oluştur
    const orderNumber = `ORD-${Date.now()}`

    // IP adresi al
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               '127.0.0.1'

    // iyzico ödeme isteği
    const paymentRequest: CreatePaymentRequest = {
      locale: 'tr',
      conversationId: conversationId,
      price: formatIyzicoPrice(totalPrice),
      paidPrice: formatIyzicoPrice(totalPrice),
      currency: 'TRY',
      installment: installment,
      basketId: orderNumber,
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/callback`,
      paymentCard: {
        cardHolderName: cardDetails.cardHolderName,
        cardNumber: cardDetails.cardNumber.replace(/\s/g, ''),
        expireMonth: cardDetails.expireMonth,
        expireYear: cardDetails.expireYear,
        cvc: cardDetails.cvc,
        registerCard: 0,
      },
      buyer: {
        id: customer.id || `buyer_${Date.now()}`,
        name: customer.firstName,
        surname: customer.lastName,
        email: customer.email,
        gsmNumber: customer.phone?.replace(/\s/g, '') || '+905000000000',
        identityNumber: customer.identityNumber || '11111111111', // TC Kimlik
        registrationAddress: shippingAddress.address,
        city: shippingAddress.city,
        country: 'Turkey',
        ip: ip,
      },
      shippingAddress: {
        contactName: `${customer.firstName} ${customer.lastName}`,
        city: shippingAddress.city,
        country: 'Turkey',
        address: shippingAddress.address,
        zipCode: shippingAddress.zipCode || '',
      },
      billingAddress: {
        contactName: `${customer.firstName} ${customer.lastName}`,
        city: billingAddress?.city || shippingAddress.city,
        country: 'Turkey',
        address: billingAddress?.address || shippingAddress.address,
        zipCode: billingAddress?.zipCode || shippingAddress.zipCode || '',
      },
      basketItems: basketItems,
    }

    // Bekleyen sipariş oluştur (ödeme onaylanmadan)
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: customer.userId || null,
        status: 'pending',
        payment_status: 'pending',
        subtotal: totalPrice - shippingCost,
        shipping_cost: shippingCost,
        tax_amount: 0,
        discount_amount: 0,
        total: totalPrice,
        currency: 'TRY',
        shipping_address: shippingAddress,
        billing_address: billingAddress || shippingAddress,
        payment_method: 'iyzico',
        conversation_id: conversationId,
        notes: null,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json(
        { error: 'Sipariş oluşturulamadı' },
        { status: 500 }
      )
    }

    // Sipariş ürünlerini ekle
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId || null,
      product_name: item.name,
      variant_name: item.variantName || null,
      sku: item.sku || null,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }))

    await supabaseAdmin.from('order_items').insert(orderItems)

    // 3D Secure ödeme başlat
    const result = await createThreedsPayment(paymentRequest)

    if (result.status === 'success') {
      // 3D Secure HTML sayfasını döndür
      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: orderNumber,
        threeDSHtmlContent: result.threeDSHtmlContent,
      })
    } else {
      // Ödeme başlatma hatası
      await supabaseAdmin
        .from('orders')
        .update({
          status: 'cancelled',
          payment_status: 'failed',
          admin_notes: result.errorMessage || 'Ödeme başlatılamadı',
        })
        .eq('id', order.id)

      return NextResponse.json(
        {
          success: false,
          error: result.errorMessage || 'Ödeme başlatılamadı',
          errorCode: result.errorCode,
        },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Payment create error:', error)
    return NextResponse.json(
      { error: error.message || 'Beklenmeyen bir hata oluştu' },
      { status: 500 }
    )
  }
}
