import { getSiteSettings } from '@/lib/settings'
import { ContactForm } from './ContactForm'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1C2840] mb-4">İletişim</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Sorularınız veya önerileriniz için bize ulaşın. Size en kısa sürede dönüş yapacağız.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <ContactForm />

        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-6">İletişim Bilgileri</h2>
            <div className="space-y-6">
              {settings.address && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#BB1624]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#BB1624]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1C2840] mb-1">Adres</h3>
                    <p className="text-gray-600 whitespace-pre-line">{settings.address}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#BB1624]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#BB1624]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1C2840] mb-1">Telefon</h3>
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="text-gray-600 hover:text-[#BB1624] transition-colors">
                    {settings.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#BB1624]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#BB1624]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1C2840] mb-1">E-posta</h3>
                  <a href={`mailto:${settings.email}`} className="text-gray-600 hover:text-[#BB1624] transition-colors">
                    {settings.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#BB1624]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#BB1624]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1C2840] mb-1">Çalışma Saatleri</h3>
                  <p className="text-gray-600">Pazartesi - Cuma: 09:00 - 18:00</p>
                  <p className="text-gray-600">Cumartesi: 10:00 - 15:00</p>
                  <p className="text-gray-600">Pazar: Kapalı</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <MapPin className="w-12 h-12 mx-auto mb-2" />
              <p>Harita</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
