import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Hakkımızda | Filenes Sports',
  description: 'Filenes Sports hakkında bilgi edinin. Spor tutkunları için kaliteli ürünler sunuyoruz.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1C2840] mb-4">Hakkımızda</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Filenes Sports olarak, spor tutkunlarına en kaliteli ürünleri sunmak için çalışıyoruz.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold text-[#1C2840] mb-4">Biz Kimiz?</h2>
          <p className="text-gray-600 mb-4">
            Filenes Sports, spor tutkunlarının ihtiyaçlarını karşılamak amacıyla kurulmuş bir e-ticaret platformudur.
            Futbol, basketbol, voleybol ve diğer spor dallarında geniş ürün yelpazemizle hizmet veriyoruz.
          </p>
          <p className="text-gray-600 mb-4">
            Müşteri memnuniyetini ön planda tutarak, kaliteli ürünleri uygun fiyatlarla sizlere ulaştırıyoruz.
            Her ürünümüz titizlikle seçilmiş ve kalite kontrolünden geçirilmiştir.
          </p>
          <p className="text-gray-600">
            Spor yaparken veya günlük hayatta kullanabileceğiniz tüm ihtiyaçlarınız için Filenes Sports her zaman yanınızda.
          </p>
        </div>
        <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p className="text-6xl mb-2">⚽</p>
            <p>Filenes Sports</p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#1C2840] text-center mb-8">Değerlerimiz</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <div className="w-16 h-16 bg-[#BB1624] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">✓</span>
            </div>
            <h3 className="font-semibold text-[#1C2840] mb-2">Kalite</h3>
            <p className="text-gray-600 text-sm">
              Sadece en kaliteli ürünleri sunuyoruz. Her ürün kalite kontrolünden geçer.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <div className="w-16 h-16 bg-[#BB1624] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">♥</span>
            </div>
            <h3 className="font-semibold text-[#1C2840] mb-2">Müşteri Memnuniyeti</h3>
            <p className="text-gray-600 text-sm">
              Müşterilerimizin memnuniyeti bizim için her şeyden önemlidir.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <div className="w-16 h-16 bg-[#BB1624] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🚀</span>
            </div>
            <h3 className="font-semibold text-[#1C2840] mb-2">Hızlı Teslimat</h3>
            <p className="text-gray-600 text-sm">
              Siparişlerinizi en kısa sürede kapınıza ulaştırıyoruz.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#1C2840] text-white rounded-lg p-8">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold mb-2">1000+</p>
            <p className="text-gray-300">Mutlu Müşteri</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">500+</p>
            <p className="text-gray-300">Ürün Çeşidi</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">50+</p>
            <p className="text-gray-300">Marka</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">7/24</p>
            <p className="text-gray-300">Destek</p>
          </div>
        </div>
      </div>
    </div>
  )
}
