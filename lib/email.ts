import sgMail from '@sendgrid/mail'

// SendGrid API Key'i ayarla
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@filenes.com'
const SITE_NAME = 'Filenes Sports'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://filenes.com'

// XSS Koruması: HTML karakterlerini escape et
function escapeHtml(text: string | undefined | null): string {
  if (!text) return ''
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Types
interface OrderItem {
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  variant_name?: string
}

interface Order {
  id: string
  order_number: string
  total: number
  subtotal: number
  shipping_cost: number
  discount_amount?: number
  shipping_address: {
    address: string
    city: string
    district: string
    zipCode: string
  }
  created_at: string
}

interface Customer {
  email: string
  first_name?: string
  last_name?: string
}

// Email template wrapper
function emailWrapper(content: string, title: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #1C2840;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .email-card {
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: #1C2840;
          padding: 24px;
          text-align: center;
        }
        .header img {
          height: 40px;
          width: auto;
        }
        .header h1 {
          color: #ffffff;
          margin: 16px 0 0;
          font-size: 20px;
        }
        .content {
          padding: 32px 24px;
        }
        .footer {
          background: #f8f9fa;
          padding: 24px;
          text-align: center;
          font-size: 12px;
          color: #6c757d;
        }
        .btn {
          display: inline-block;
          background: #BB1624;
          color: #ffffff !important;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          margin: 16px 0;
        }
        .order-table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
        }
        .order-table th, .order-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }
        .order-table th {
          background: #f8f9fa;
          font-weight: 600;
        }
        .order-summary {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 6px;
          margin: 16px 0;
        }
        .order-summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }
        .order-summary-row.total {
          border-top: 2px solid #1C2840;
          font-weight: 700;
          font-size: 18px;
          margin-top: 8px;
          padding-top: 16px;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .status-confirmed { background: #d4edda; color: #155724; }
        .status-shipped { background: #cce5ff; color: #004085; }
        .status-delivered { background: #d4edda; color: #155724; }
        .address-box {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 6px;
          margin: 16px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="email-card">
          <div class="header">
            <img src="${SITE_URL}/images/logo-white.svg" alt="${SITE_NAME}" />
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${SITE_NAME}. Tüm hakları saklıdır.</p>
            <p>
              <a href="${SITE_URL}" style="color: #BB1624;">Web Sitesi</a> |
              <a href="${SITE_URL}/iletisim" style="color: #BB1624;">İletişim</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(amount)
}

// Format date
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Sipariş onay e-postası
export async function sendOrderConfirmation(
  customer: Customer,
  order: Order,
  items: OrderItem[]
): Promise<void> {
  const customerName = customer.first_name ? escapeHtml(`${customer.first_name} ${customer.last_name || ''}`.trim()) : 'Değerli Müşterimiz'

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td>${escapeHtml(item.product_name)}${item.variant_name ? ` - ${escapeHtml(item.variant_name)}` : ''}</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">${formatCurrency(item.unit_price)}</td>
        <td style="text-align: right;">${formatCurrency(item.total_price)}</td>
      </tr>
    `
    )
    .join('')

  const content = `
    <h2 style="margin-top: 0;">Siparişiniz Alındı! 🎉</h2>
    <p>Merhaba ${customerName},</p>
    <p>Siparişiniz başarıyla alındı ve hazırlanmak üzere işleme konuldu.</p>

    <div style="background: #e8f5e9; padding: 16px; border-radius: 6px; margin: 16px 0;">
      <strong>Sipariş Numarası:</strong> ${escapeHtml(order.order_number)}
    </div>

    <h3>Sipariş Detayları</h3>
    <table class="order-table">
      <thead>
        <tr>
          <th>Ürün</th>
          <th style="text-align: center;">Adet</th>
          <th style="text-align: right;">Birim Fiyat</th>
          <th style="text-align: right;">Toplam</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div class="order-summary">
      <div class="order-summary-row">
        <span>Ara Toplam:</span>
        <span>${formatCurrency(order.subtotal)}</span>
      </div>
      <div class="order-summary-row">
        <span>Kargo:</span>
        <span>${order.shipping_cost > 0 ? formatCurrency(order.shipping_cost) : 'Ücretsiz'}</span>
      </div>
      ${order.discount_amount && order.discount_amount > 0 ? `
      <div class="order-summary-row" style="color: #28a745;">
        <span>İndirim:</span>
        <span>-${formatCurrency(order.discount_amount)}</span>
      </div>
      ` : ''}
      <div class="order-summary-row total">
        <span>Toplam:</span>
        <span>${formatCurrency(order.total)}</span>
      </div>
    </div>

    <h3>Teslimat Adresi</h3>
    <div class="address-box">
      <p style="margin: 0;">
        ${escapeHtml(order.shipping_address.address)}<br>
        ${escapeHtml(order.shipping_address.district)} / ${escapeHtml(order.shipping_address.city)}<br>
        ${escapeHtml(order.shipping_address.zipCode)}
      </p>
    </div>

    <p style="text-align: center;">
      <a href="${SITE_URL}/siparis-takip?siparis=${encodeURIComponent(order.order_number)}" class="btn">
        Siparişimi Takip Et
      </a>
    </p>

    <p style="color: #6c757d; font-size: 14px;">
      Siparişinizle ilgili sorularınız için bizimle iletişime geçebilirsiniz.
    </p>
  `

  const msg = {
    to: customer.email,
    from: FROM_EMAIL,
    subject: `Sipariş Onayı - ${order.order_number} | ${SITE_NAME}`,
    html: emailWrapper(content, 'Sipariş Onayı'),
  }

  try {
    await sgMail.send(msg)
  } catch (error) {
    throw error
  }
}

// Kargo bildirimi e-postası
export async function sendShippingNotification(
  customer: Customer,
  order: Order,
  trackingNumber: string,
  carrierName: string = 'Kargo Firması'
): Promise<void> {
  const customerName = customer.first_name ? escapeHtml(`${customer.first_name} ${customer.last_name || ''}`.trim()) : 'Değerli Müşterimiz'

  const content = `
    <h2 style="margin-top: 0;">Siparişiniz Yola Çıktı! 🚚</h2>
    <p>Merhaba ${customerName},</p>
    <p><strong>${escapeHtml(order.order_number)}</strong> numaralı siparişiniz kargoya verildi ve yola çıktı!</p>

    <div style="background: #cce5ff; padding: 16px; border-radius: 6px; margin: 16px 0;">
      <p style="margin: 0 0 8px;"><strong>Kargo Firması:</strong> ${escapeHtml(carrierName)}</p>
      <p style="margin: 0;"><strong>Takip Numarası:</strong> ${escapeHtml(trackingNumber)}</p>
    </div>

    <h3>Teslimat Adresi</h3>
    <div class="address-box">
      <p style="margin: 0;">
        ${escapeHtml(order.shipping_address.address)}<br>
        ${escapeHtml(order.shipping_address.district)} / ${escapeHtml(order.shipping_address.city)}<br>
        ${escapeHtml(order.shipping_address.zipCode)}
      </p>
    </div>

    <p style="text-align: center;">
      <a href="${SITE_URL}/siparis-takip?siparis=${encodeURIComponent(order.order_number)}" class="btn">
        Siparişimi Takip Et
      </a>
    </p>

    <p style="color: #6c757d; font-size: 14px;">
      Kargo takip numaranız ile kargo firmasının web sitesinden de siparişinizi takip edebilirsiniz.
    </p>
  `

  const msg = {
    to: customer.email,
    from: FROM_EMAIL,
    subject: `Siparişiniz Kargoya Verildi - ${order.order_number} | ${SITE_NAME}`,
    html: emailWrapper(content, 'Kargo Bildirimi'),
  }

  try {
    await sgMail.send(msg)
  } catch (error) {
    throw error
  }
}

// Teslimat bildirimi e-postası
export async function sendDeliveryNotification(
  customer: Customer,
  order: Order
): Promise<void> {
  const customerName = customer.first_name ? escapeHtml(`${customer.first_name} ${customer.last_name || ''}`.trim()) : 'Değerli Müşterimiz'

  const content = `
    <h2 style="margin-top: 0;">Siparişiniz Teslim Edildi! ✅</h2>
    <p>Merhaba ${customerName},</p>
    <p><strong>${escapeHtml(order.order_number)}</strong> numaralı siparişiniz başarıyla teslim edildi.</p>

    <div style="background: #d4edda; padding: 16px; border-radius: 6px; margin: 16px 0; text-align: center;">
      <span class="status-badge status-delivered">Teslim Edildi</span>
      <p style="margin: 8px 0 0;">Sipariş Tarihi: ${formatDate(order.created_at)}</p>
    </div>

    <p>Ürünlerimizi beğeneceğinizi umuyoruz! Deneyiminizi bizimle paylaşır mısınız?</p>

    <p style="text-align: center;">
      <a href="${SITE_URL}/hesabim" class="btn">
        Yorum Yap
      </a>
    </p>

    <p style="color: #6c757d; font-size: 14px;">
      Herhangi bir sorun yaşarsanız lütfen bizimle iletişime geçin.
    </p>
  `

  const msg = {
    to: customer.email,
    from: FROM_EMAIL,
    subject: `Siparişiniz Teslim Edildi - ${order.order_number} | ${SITE_NAME}`,
    html: emailWrapper(content, 'Teslimat Bildirimi'),
  }

  try {
    await sgMail.send(msg)
  } catch (error) {
    throw error
  }
}

// Ödeme makbuzu e-postası
export async function sendPaymentReceipt(
  customer: Customer,
  order: Order,
  items: OrderItem[],
  paymentDetails: {
    cardLastFour: string
    installment: number
    paidAt: string
  }
): Promise<void> {
  const customerName = customer.first_name ? escapeHtml(`${customer.first_name} ${customer.last_name || ''}`.trim()) : 'Değerli Müşterimiz'

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td>${escapeHtml(item.product_name)}${item.variant_name ? ` - ${escapeHtml(item.variant_name)}` : ''}</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">${formatCurrency(item.total_price)}</td>
      </tr>
    `
    )
    .join('')

  const content = `
    <h2 style="margin-top: 0;">Ödeme Makbuzu 💳</h2>
    <p>Merhaba ${customerName},</p>
    <p>Ödemeniz başarıyla alınmıştır. İşte ödeme detaylarınız:</p>

    <div style="background: #f8f9fa; padding: 16px; border-radius: 6px; margin: 16px 0;">
      <table style="width: 100%;">
        <tr>
          <td><strong>Sipariş No:</strong></td>
          <td style="text-align: right;">${escapeHtml(order.order_number)}</td>
        </tr>
        <tr>
          <td><strong>Ödeme Tarihi:</strong></td>
          <td style="text-align: right;">${formatDate(paymentDetails.paidAt)}</td>
        </tr>
        <tr>
          <td><strong>Kart:</strong></td>
          <td style="text-align: right;">**** **** **** ${paymentDetails.cardLastFour}</td>
        </tr>
        <tr>
          <td><strong>Taksit:</strong></td>
          <td style="text-align: right;">${paymentDetails.installment > 1 ? `${paymentDetails.installment} Taksit` : 'Tek Çekim'}</td>
        </tr>
      </table>
    </div>

    <h3>Ürünler</h3>
    <table class="order-table">
      <thead>
        <tr>
          <th>Ürün</th>
          <th style="text-align: center;">Adet</th>
          <th style="text-align: right;">Tutar</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div class="order-summary">
      <div class="order-summary-row">
        <span>Ara Toplam:</span>
        <span>${formatCurrency(order.subtotal)}</span>
      </div>
      <div class="order-summary-row">
        <span>Kargo:</span>
        <span>${order.shipping_cost > 0 ? formatCurrency(order.shipping_cost) : 'Ücretsiz'}</span>
      </div>
      ${order.discount_amount && order.discount_amount > 0 ? `
      <div class="order-summary-row" style="color: #28a745;">
        <span>İndirim:</span>
        <span>-${formatCurrency(order.discount_amount)}</span>
      </div>
      ` : ''}
      <div class="order-summary-row total">
        <span>Ödenen Tutar:</span>
        <span>${formatCurrency(order.total)}</span>
      </div>
    </div>

    <p style="color: #6c757d; font-size: 12px; text-align: center; margin-top: 24px;">
      Bu e-posta ödeme makbuzunuzdur. Lütfen kayıtlarınız için saklayınız.
    </p>
  `

  const msg = {
    to: customer.email,
    from: FROM_EMAIL,
    subject: `Ödeme Makbuzu - ${order.order_number} | ${SITE_NAME}`,
    html: emailWrapper(content, 'Ödeme Makbuzu'),
  }

  try {
    await sgMail.send(msg)
  } catch (error) {
    throw error
  }
}

// Sipariş iptal bildirimi
export async function sendOrderCancellation(
  customer: Customer,
  order: Order,
  reason?: string
): Promise<void> {
  const customerName = customer.first_name ? escapeHtml(`${customer.first_name} ${customer.last_name || ''}`.trim()) : 'Değerli Müşterimiz'

  const content = `
    <h2 style="margin-top: 0;">Siparişiniz İptal Edildi</h2>
    <p>Merhaba ${customerName},</p>
    <p><strong>${escapeHtml(order.order_number)}</strong> numaralı siparişiniz iptal edilmiştir.</p>

    ${reason ? `
    <div style="background: #fff3cd; padding: 16px; border-radius: 6px; margin: 16px 0;">
      <strong>İptal Nedeni:</strong> ${escapeHtml(reason)}
    </div>
    ` : ''}

    <p>Ödemeniz yapıldıysa, iade işlemi bankanıza bağlı olarak 3-7 iş günü içinde hesabınıza yansıyacaktır.</p>

    <p style="text-align: center;">
      <a href="${SITE_URL}/iletisim" class="btn">
        Bizimle İletişime Geçin
      </a>
    </p>
  `

  const msg = {
    to: customer.email,
    from: FROM_EMAIL,
    subject: `Sipariş İptal Edildi - ${order.order_number} | ${SITE_NAME}`,
    html: emailWrapper(content, 'Sipariş İptali'),
  }

  try {
    await sgMail.send(msg)
  } catch (error) {
    throw error
  }
}
