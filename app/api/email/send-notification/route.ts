import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  sendShippingNotification,
  sendDeliveryNotification,
  sendOrderCancellation
} from '@/lib/email'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { orderId, type, trackingNumber, carrierName, reason } = await request.json()

    if (!orderId || !type) {
      return NextResponse.json(
        { error: 'orderId and type are required' },
        { status: 400 }
      )
    }

    // Siparişi ve müşteri bilgilerini al
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        items:order_items(
          product_name,
          variant_name,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Müşteri e-posta adresini al
    const customerEmail =
      order.billing_address?.email ||
      order.shipping_address?.email

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Customer email not found' },
        { status: 400 }
      )
    }

    const customer = {
      email: customerEmail,
      first_name: order.shipping_address?.firstName || order.billing_address?.firstName,
      last_name: order.shipping_address?.lastName || order.billing_address?.lastName,
    }

    // E-posta tipine göre gönder
    switch (type) {
      case 'shipped':
        if (!trackingNumber) {
          return NextResponse.json(
            { error: 'trackingNumber is required for shipping notification' },
            { status: 400 }
          )
        }
        await sendShippingNotification(customer, order, trackingNumber, carrierName || 'Kargo')
        break

      case 'delivered':
        await sendDeliveryNotification(customer, order)
        break

      case 'cancelled':
        await sendOrderCancellation(customer, order, reason)
        break

      default:
        return NextResponse.json(
          { error: 'Invalid notification type' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true, message: 'Email sent successfully' })
  } catch (error) {
    console.error('Error sending notification email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
