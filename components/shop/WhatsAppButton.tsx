'use client'

import { MessageCircle } from 'lucide-react'

export function WhatsAppButton() {
  const phoneNumber = '905551234567' // WhatsApp numarasi
  const message = 'Merhaba, urunleriniz hakkinda bilgi almak istiyorum.'

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition hover:scale-110"
      aria-label="WhatsApp ile iletisime gecin"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  )
}
