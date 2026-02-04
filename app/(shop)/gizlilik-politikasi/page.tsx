import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | Filenes Sports',
  description: 'Filenes Sports gizlilik politikası ve kişisel verilerin korunması hakkında bilgi.',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-[#1C2840] mb-8">Gizlilik Politikası</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">1. Giriş</h2>
            <p className="text-gray-600 mb-4">
              Filenes Sports olarak, müşterilerimizin gizliliğine büyük önem veriyoruz. Bu gizlilik politikası,
              web sitemizi kullanırken toplanan kişisel verilerin nasıl işlendiğini açıklamaktadır.
            </p>
            <p className="text-gray-600">
              6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında, veri sorumlusu sıfatıyla
              hareket etmekteyiz.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">2. Toplanan Veriler</h2>
            <p className="text-gray-600 mb-4">Aşağıdaki kişisel verileri toplayabiliriz:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Kimlik bilgileri (ad, soyad)</li>
              <li>İletişim bilgileri (e-posta, telefon, adres)</li>
              <li>Sipariş ve işlem bilgileri</li>
              <li>Ödeme bilgileri (kart bilgileri güvenli ödeme altyapısında işlenir)</li>
              <li>Çerez verileri ve kullanım bilgileri</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">3. Verilerin Kullanım Amacı</h2>
            <p className="text-gray-600 mb-4">Kişisel verileriniz aşağıdaki amaçlarla kullanılmaktadır:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Siparişlerinizin işlenmesi ve teslimatı</li>
              <li>Müşteri hizmetleri desteği sağlanması</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>Hizmet kalitesinin artırılması</li>
              <li>İzniniz dahilinde pazarlama iletişimleri</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">4. Verilerin Paylaşımı</h2>
            <p className="text-gray-600 mb-4">
              Kişisel verileriniz, yalnızca hizmet sağlamak için gerekli olan durumlarda ve aşağıdaki
              taraflarla paylaşılabilir:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Kargo ve lojistik firmaları (teslimat için)</li>
              <li>Ödeme hizmet sağlayıcıları</li>
              <li>Yasal zorunluluklar kapsamında yetkili kurumlar</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">5. Veri Güvenliği</h2>
            <p className="text-gray-600">
              Kişisel verilerinizin güvenliğini sağlamak için endüstri standardı güvenlik önlemleri
              uygulamaktayız. Web sitemiz SSL sertifikası ile korunmakta olup, ödeme işlemleri
              güvenli ödeme altyapıları üzerinden gerçekleştirilmektedir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">6. Çerezler</h2>
            <p className="text-gray-600 mb-4">
              Web sitemizde çerezler kullanmaktayız. Çerezler, deneyiminizi iyileştirmek ve
              sitemizin düzgün çalışmasını sağlamak için kullanılır.
            </p>
            <p className="text-gray-600">
              Çerez tercihlerinizi tarayıcı ayarlarınızdan yönetebilirsiniz. Ancak çerezleri
              devre dışı bırakmanız, sitemizin bazı özelliklerinin düzgün çalışmamasına neden olabilir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">7. Haklarınız</h2>
            <p className="text-gray-600 mb-4">KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme</li>
              <li>Verilerin silinmesini veya yok edilmesini isteme</li>
              <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">8. İletişim</h2>
            <p className="text-gray-600 mb-4">
              Gizlilik politikamız veya kişisel verileriniz hakkında sorularınız için bizimle iletişime geçebilirsiniz:
            </p>
            <ul className="text-gray-600 space-y-2">
              <li><strong>E-posta:</strong> kvkk@fileenessports.com</li>
              <li><strong>Telefon:</strong> +90 (212) 123 45 67</li>
              <li><strong>Adres:</strong> Örnek Mahallesi, Spor Caddesi No: 123, Kadıköy, İstanbul</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">9. Değişiklikler</h2>
            <p className="text-gray-600">
              Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler olması durumunda
              sizi bilgilendireceğiz. Politikayı düzenli olarak kontrol etmenizi öneririz.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
