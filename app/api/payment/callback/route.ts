import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { completeThreedsPayment, retrievePayment } from '@/lib/iyzico'
import { sendOrderConfirmation, sendPaymentReceipt } from '@/lib/email'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // iyzico callback verilerini al (form-urlencoded)
    const formData = await request.formData()
    const status = formData.get('status') as string
    const paymentId = formData.get('paymentId') as string
    const conversationId = formData.get('conversationId') as string
    const mdStatus = formData.get('mdStatus') as string

    // GÜVENLİK: conversationId zorunlu ve geçerli olmalı
    if (!conversationId || !conversationId.startsWith('conv_')) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/odeme/basarisiz?error=invalid_callback`
      )
    }

    // Siparişi bul
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('conversation_id', conversationId)
      .single()

    if (orderError || !order) {
      console.error('Order not found:', conversationId)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/odeme/basarisiz?error=order_not_found`
      )
    }

    // 3D Secure doğrulama durumunu kontrol et
    // mdStatus: 1 = başarılı, diğer değerler = başarısız
    if (status !== 'success' || mdStatus !== '1') {
      await supabaseAdmin
        .from('orders')
        .update({
          status: 'cancelled',
          payment_status: 'failed',
          admin_notes: `3D Secure doğrulama başarısız. mdStatus: ${mdStatus}`,
        })
        .eq('id', order.id)

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/odeme/basarisiz?order=${order.order_number}&error=3ds_failed`
      )
    }

    // 3D Secure ödemeyi tamamla
    const result = await completeThreedsPayment(paymentId, conversationId)

    // GÜVENLİK: Ödeme sonucunu iyzico API'den doğrula
    if (result.status === 'success' && result.paymentId) {
      const verifyResult = await retrievePayment(result.paymentId, conversationId)

      // Ödeme durumu ve tutarı doğrula
      if (verifyResult.status !== 'success' ||
          verifyResult.paymentStatus !== 'SUCCESS' ||
          parseFloat(verifyResult.paidPrice || '0') !== order.total) {
        console.error('Payment verification failed:', {
          expected: order.total,
          received: verifyResult.paidPrice,
          status: verifyResult.paymentStatus
        })

        await supabaseAdmin
          .from('orders')
          .update({
            status: 'cancelled',
            payment_status: 'failed',
            admin_notes: 'Ödeme doğrulama başarısız - tutarlar eşleşmiyor',
          })
          .eq('id', order.id)

        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_SITE_URL}/odeme/basarisiz?order=${order.order_number}&error=verification_failed`
        )
      }
    }

    if (result.status === 'success') {
      // Ödeme başarılı
      await supabaseAdmin
        .from('orders')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          payment_id: result.paymentId,
          payment_transaction_id: result.itemTransactions?.[0]?.paymentTransactionId,
          installment: result.installment || 1,
          paid_at: new Date().toISOString(),
        })
        .eq('id', order.id)

      // Stok güncelle ve sipariş ürünlerini al
      const { data: orderItems } = await supabaseAdmin
        .from('order_items')
        .select('product_id, product_name, variant_name, quantity, unit_price, total_price')
        .eq('order_id', order.id)

      if (orderItems) {
        for (const item of orderItems) {
          if (item.product_id) {
            await supabaseAdmin.rpc('decrement_stock', {
              p_product_id: item.product_id,
              p_quantity: item.quantity,
            })
          }
        }
      }

      // E-posta bildirimleri gönder (background'da çalışsın, hata olsa bile devam et)
      try {
        const customerEmail = order.billing_address?.email || order.shipping_address?.email
        const customerName = order.billing_address?.firstName || order.shipping_address?.firstName
        const customerLastName = order.billing_address?.lastName || order.shipping_address?.lastName

        if (customerEmail && orderItems) {
          const customer = {
            email: customerEmail,
            first_name: customerName,
            last_name: customerLastName,
          }

          // Sipariş onay e-postası
          await sendOrderConfirmation(customer, order, orderItems)

          // Ödeme makbuzu e-postası
          await sendPaymentReceipt(customer, order, orderItems, {
            cardLastFour: result.cardAssociation ? '****' : '****',
            installment: result.installment || 1,
            paidAt: new Date().toISOString(),
          })
        }
      } catch (emailError) {
        console.error('Error sending confirmation emails:', emailError)
        // E-posta hatası siparişi etkilemesin
      }

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/odeme/basarili?order=${order.order_number}`
      )
    } else {
      // Ödeme başarısız
      await supabaseAdmin
        .from('orders')
        .update({
          status: 'cancelled',
          payment_status: 'failed',
          admin_notes: result.errorMessage || 'Ödeme tamamlanamadı',
        })
        .eq('id', order.id)

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/odeme/basarisiz?order=${order.order_number}&error=${encodeURIComponent(result.errorMessage || 'payment_failed')}`
      )
    }
  } catch (error: any) {
    console.error('Payment callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/odeme/basarisiz?error=${encodeURIComponent(error.message || 'unknown_error')}`
    )
  }
}

// GET isteği için de aynı işlemi yap (bazı bankalar GET kullanabilir)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const paymentId = searchParams.get('paymentId')
  const conversationId = searchParams.get('conversationId')

  if (!conversationId) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/odeme/basarisiz?error=invalid_callback`
    )
  }

  // POST ile aynı mantık
  const formData = new FormData()
  formData.set('status', status || '')
  formData.set('paymentId', paymentId || '')
  formData.set('conversationId', conversationId)
  formData.set('mdStatus', searchParams.get('mdStatus') || '')

  // POST handler'ı çağır
  const newRequest = new NextRequest(request.url, {
    method: 'POST',
    body: formData,
  })

  return POST(newRequest)
}
