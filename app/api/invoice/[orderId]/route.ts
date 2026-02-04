import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

// Extend jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
    lastAutoTable: { finalY: number }
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params

    // Fetch order with items
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('id', orderId)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
    }

    // Create PDF
    const doc = new jsPDF()

    // Header
    doc.setFontSize(24)
    doc.setTextColor(28, 40, 64) // #1C2840
    doc.text('FATURA', 105, 25, { align: 'center' })

    // Company info (left side)
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text('Filenes Sports', 20, 45)
    doc.setFontSize(10)
    doc.text('Spor Giyim ve Aksesuarları', 20, 52)
    doc.text('www.filenes.com', 20, 59)

    // Invoice details (right side)
    doc.setFontSize(10)
    doc.text(`Fatura No: ${order.order_number}`, 190, 45, { align: 'right' })
    doc.text(`Tarih: ${new Date(order.created_at).toLocaleDateString('tr-TR')}`, 190, 52, { align: 'right' })

    // Status badge
    const statusText = getStatusText(order.status)
    doc.setFillColor(187, 22, 36) // #BB1624
    doc.roundedRect(145, 56, 45, 8, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.text(statusText, 167.5, 62, { align: 'center' })

    // Divider
    doc.setDrawColor(200, 200, 200)
    doc.line(20, 70, 190, 70)

    // Billing Address
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Fatura Adresi', 20, 82)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)

    const billingAddress = order.billing_address || order.shipping_address
    if (billingAddress) {
      let y = 89
      doc.text(`${billingAddress.first_name || ''} ${billingAddress.last_name || ''}`, 20, y)
      y += 6
      if (billingAddress.phone) {
        doc.text(billingAddress.phone, 20, y)
        y += 6
      }
      doc.text(billingAddress.address_line1 || billingAddress.address || '', 20, y)
      y += 6
      doc.text(`${billingAddress.district || ''} / ${billingAddress.city || ''}`, 20, y)
      if (billingAddress.postal_code) {
        y += 6
        doc.text(billingAddress.postal_code, 20, y)
      }
    }

    // Shipping Address
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Teslimat Adresi', 110, 82)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)

    const shippingAddress = order.shipping_address
    if (shippingAddress) {
      let y = 89
      doc.text(`${shippingAddress.first_name || ''} ${shippingAddress.last_name || ''}`, 110, y)
      y += 6
      if (shippingAddress.phone) {
        doc.text(shippingAddress.phone, 110, y)
        y += 6
      }
      doc.text(shippingAddress.address_line1 || shippingAddress.address || '', 110, y)
      y += 6
      doc.text(`${shippingAddress.district || ''} / ${shippingAddress.city || ''}`, 110, y)
      if (shippingAddress.postal_code) {
        y += 6
        doc.text(shippingAddress.postal_code, 110, y)
      }
    }

    // Products table
    const tableData = order.items.map((item: any) => [
      item.product_name + (item.variant_name ? ` (${item.variant_name})` : ''),
      item.quantity.toString(),
      formatPrice(item.unit_price),
      formatPrice(item.total_price),
    ])

    doc.autoTable({
      startY: 125,
      head: [['Ürün', 'Adet', 'Birim Fiyat', 'Toplam']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [28, 40, 64], // #1C2840
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' },
      },
      margin: { left: 20, right: 20 },
    })

    // Totals
    const finalY = doc.lastAutoTable.finalY + 10

    doc.setFontSize(10)
    doc.text('Ara Toplam:', 140, finalY)
    doc.text(formatPrice(order.subtotal), 190, finalY, { align: 'right' })

    if (order.discount_amount > 0) {
      doc.setTextColor(187, 22, 36) // #BB1624
      doc.text('İndirim:', 140, finalY + 7)
      doc.text(`-${formatPrice(order.discount_amount)}`, 190, finalY + 7, { align: 'right' })
      doc.setTextColor(0, 0, 0)
    }

    const offsetY = order.discount_amount > 0 ? 7 : 0
    doc.text('Kargo:', 140, finalY + 7 + offsetY)
    doc.text(order.shipping_cost > 0 ? formatPrice(order.shipping_cost) : 'Ücretsiz', 190, finalY + 7 + offsetY, { align: 'right' })

    if (order.tax_amount > 0) {
      doc.text('KDV:', 140, finalY + 14 + offsetY)
      doc.text(formatPrice(order.tax_amount), 190, finalY + 14 + offsetY, { align: 'right' })
    }

    // Total
    doc.setDrawColor(200, 200, 200)
    doc.line(140, finalY + 18 + offsetY, 190, finalY + 18 + offsetY)

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('GENEL TOPLAM:', 140, finalY + 26 + offsetY)
    doc.setTextColor(187, 22, 36) // #BB1624
    doc.text(formatPrice(order.total), 190, finalY + 26 + offsetY, { align: 'right' })

    // Payment info
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const paymentY = finalY + 40 + offsetY
    doc.text(`Ödeme Yöntemi: ${getPaymentMethodText(order.payment_method)}`, 20, paymentY)
    doc.text(`Ödeme Durumu: ${getPaymentStatusText(order.payment_status)}`, 20, paymentY + 6)

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text('Bu fatura elektronik olarak oluşturulmuştur.', 105, 280, { align: 'center' })
    doc.text(`Oluşturulma Tarihi: ${new Date().toLocaleString('tr-TR')}`, 105, 285, { align: 'center' })

    // Generate PDF buffer
    const pdfBuffer = doc.output('arraybuffer')

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="fatura-${order.order_number}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Invoice generation error:', error)
    return NextResponse.json({ error: 'Fatura oluşturulamadı' }, { status: 500 })
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(price)
}

function getStatusText(status: string): string {
  const statuses: Record<string, string> = {
    pending: 'Beklemede',
    confirmed: 'Onaylandı',
    processing: 'Hazırlanıyor',
    shipped: 'Kargoda',
    delivered: 'Teslim Edildi',
    cancelled: 'İptal Edildi',
    refunded: 'İade Edildi',
  }
  return statuses[status] || status
}

function getPaymentMethodText(method: string | null): string {
  if (!method) return 'Belirtilmemiş'
  const methods: Record<string, string> = {
    credit_card: 'Kredi Kartı',
    bank_transfer: 'Havale/EFT',
    cash_on_delivery: 'Kapıda Ödeme',
  }
  return methods[method] || method
}

function getPaymentStatusText(status: string | null): string {
  if (!status) return 'Belirtilmemiş'
  const statuses: Record<string, string> = {
    pending: 'Beklemede',
    paid: 'Ödendi',
    failed: 'Başarısız',
    refunded: 'İade Edildi',
  }
  return statuses[status] || status
}
