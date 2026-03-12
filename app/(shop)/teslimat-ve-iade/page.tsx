import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Teslimat ve İade | Filenes Sports',
  description: 'Filenes Sports teslimat koşulları, kargo bilgileri, iade ve değişim politikası.',
}

export default function DeliveryReturnPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-[#1C2840] mb-8">Teslimat ve İade</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">1. Teslimat Bilgileri</h2>
            <p className="text-gray-600 mb-4">
              Siparişleriniz, anlaşmalı kargo firmalarımız aracılığıyla Türkiye genelinde adresinize
              teslim edilmektedir.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Sipariş hazırlık süresi: 1-3 iş günü</li>
              <li>Kargo teslimat süresi: 1-5 iş günü (bölgeye göre değişiklik gösterebilir)</li>
              <li>Toplam teslimat süresi: Sipariş onayından itibaren ortalama 2-8 iş günü</li>
              <li>Anlaşmalı kargo firmaları: Yurtiçi Kargo, Aras Kargo, MNG Kargo</li>
              <li>Kargo takip numarası, ürününüz kargoya verildiğinde e-posta ile tarafınıza iletilir</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">2. Kargo Ücretleri</h2>
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Belirli Tutar ve Üzeri</p>
                  <p className="text-xl font-bold text-green-600">Ücretsiz Kargo</p>
                  <p className="text-xs text-gray-400 mt-1">Güncel tutar sipariş sayfasında belirtilmektedir</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Belirli Tutar Altı</p>
                  <p className="text-xl font-bold text-[#1C2840]">Standart Kargo Ücreti</p>
                  <p className="text-xs text-gray-400 mt-1">Güncel ücret sipariş sayfasında belirtilmektedir</p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Kargo ücretleri yurtiçi gönderiler için geçerlidir. Büyük ebatlı veya ağır ürünlerde
              ek kargo ücreti uygulanabilir; bu durum sipariş öncesinde tarafınıza bildirilir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">3. Teslimat Koşulları</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Teslimat adresi bilgilerinin doğruluğu ve eksiksizliği alıcının sorumluluğundadır</li>
              <li>Hatalı veya eksik adres bilgisi nedeniyle yaşanan gecikme ve ek masraflardan Filenes Sports sorumlu tutulamaz</li>
              <li>İlk teslimat girişiminin başarısız olması durumunda kargo firması tarafından bilgilendirme yapılır ve ürün kargo şubesinden teslim alınabilir</li>
              <li>Mücbir sebep halleri (doğal afet, pandemi, olağanüstü hava koşulları, grev vb.) nedeniyle teslimat süreleri uzayabilir; bu durumda alıcı bilgilendirilir</li>
              <li>Yurt dışına teslimat yapılmamaktadır</li>
              <li>Teslim sırasında kargo paketini kontrol ediniz; hasar varsa tutanak tutturarak teslim almayınız</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">4. Cayma Hakkı ve İade</h2>
            <p className="text-gray-600 mb-4">
              6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında, ürünü teslim aldığınız
              tarihten itibaren <strong>14 (on dört) gün</strong> içinde herhangi bir gerekçe göstermeksizin
              cayma hakkınızı kullanabilirsiniz.
            </p>
            <p className="text-gray-600 mb-4">İade koşulları:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Ürün kullanılmamış ve orijinal ambalajında olmalıdır</li>
              <li>Ürün etiketi ve koruyucu ambalajı açılmamış veya zarar görmemiş olmalıdır</li>
              <li>Ürünle birlikte teslim edilen tüm aksesuar, hediye ve fatura eksiksiz iade edilmelidir</li>
              <li>14 günlük cayma süresi, ürünün teslim alındığı tarihten itibaren başlar</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">5. İade Prosedürü</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="flex-shrink-0 w-8 h-8 bg-[#1C2840] text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <p className="font-semibold text-[#1C2840] mb-1">İade Talebini Bildirin</p>
                  <p className="text-gray-600 text-sm">info@fileenessports.com adresine e-posta gönderin veya +90 541 885 56 76 numarasını arayın. Sipariş numaranızı ve iade nedeninizi belirtin.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="flex-shrink-0 w-8 h-8 bg-[#1C2840] text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <p className="font-semibold text-[#1C2840] mb-1">Onay ve Kargo Kodu</p>
                  <p className="text-gray-600 text-sm">İade talebiniz onaylandıktan sonra tarafınıza iade kargo kodu ve gönderim bilgileri iletilir.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="flex-shrink-0 w-8 h-8 bg-[#1C2840] text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <p className="font-semibold text-[#1C2840] mb-1">Ürünü Kargoya Verin</p>
                  <p className="text-gray-600 text-sm">Ürünü orijinal ambalajında, fatura ve tüm aksesuarlarıyla birlikte kargo ile gönderin.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="flex-shrink-0 w-8 h-8 bg-[#1C2840] text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <p className="font-semibold text-[#1C2840] mb-1">İade İşlemi Tamamlanır</p>
                  <p className="text-gray-600 text-sm">Ürün tarafımıza ulaştıktan sonra 3-5 iş günü içinde kontrol edilir ve iade işleminiz başlatılır.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">6. İade Kargo Ücreti</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Ayıplı veya yanlış ürün gönderimi:</strong> İade kargo ücreti Filenes Sports tarafından karşılanır</li>
              <li><strong>Cayma hakkı kullanımı (beğenmeme vb.):</strong> İade kargo ücreti alıcıya aittir</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">7. İade Edilemeyecek Ürünler</h2>
            <p className="text-gray-600 mb-4">
              Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesi gereğince aşağıdaki ürünlerde
              iade kabul edilememektedir:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Alıcının istekleri doğrultusunda özel olarak üretilen ürünler (özel ölçü file siparişleri, kişiselleştirilmiş ürünler)</li>
              <li>Tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış ve iadesi sağlık veya hijyen açısından uygun olmayan ürünler</li>
              <li>Tesliminden sonra başka ürünlerle karışan ve doğası gereği ayrıştırılması mümkün olmayan ürünler</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">8. Para İadesi</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>İade onayının ardından para iadesi 3-5 iş günü içinde işleme alınır</li>
              <li>Kredi kartı ile yapılan ödemelerde iade, aynı karta yapılır; bankanıza göre hesabınıza yansıması 3-14 iş günü sürebilir</li>
              <li>Banka kartı (debit) ile yapılan ödemelerde iade, aynı karta yapılır</li>
              <li>Havale/EFT ile yapılan ödemelerde iade, alıcının bildirdiği IBAN numarasına yapılır</li>
              <li>Taksitli ödemelerde iade, taksit planına uygun şekilde bankanız tarafından gerçekleştirilir</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">9. Hasarlı Ürün Prosedürü</h2>
            <p className="text-gray-600 mb-4">
              Kargo teslimatı sırasında veya ürün açıldığında hasar tespit edilmesi durumunda:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Kargo teslim anında paketi kontrol ediniz; dış ambalajda hasar varsa kargo görevlisi ile birlikte <strong>tutanak</strong> düzenleyiniz</li>
              <li>Hasarlı ürünü kabul etmeyiniz veya tutanakla birlikte teslim alınız</li>
              <li>Hasar tespit ettiğinizde en geç <strong>24 saat</strong> içinde info@fileenessports.com adresine hasarlı ürünün fotoğraflarını gönderin</li>
              <li>Kargo hasarı durumunda iade kargo ücreti Filenes Sports tarafından karşılanır</li>
              <li>Hasarlı ürün değişimi veya para iadesi, ürünün tarafımıza ulaşmasının ardından 3-5 iş günü içinde gerçekleştirilir</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">10. Değişim</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Ürün değişimi, stok durumuna bağlı olarak gerçekleştirilebilir</li>
              <li>Değişim talebi, iade prosedürü ile aynı süreçten geçer</li>
              <li>Değişim yapılacak üründe fiyat farkı varsa, fark alıcı tarafından ödenir veya alıcıya iade edilir</li>
              <li>Değişim talebinizi sipariş numaranızla birlikte info@fileenessports.com adresine iletebilirsiniz</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">11. İletişim</h2>
            <p className="text-gray-600 mb-4">
              Teslimat ve iade süreçleri ile ilgili tüm soru ve talepleriniz için bizimle iletişime geçebilirsiniz:
            </p>
            <ul className="text-gray-600 space-y-2">
              <li><strong>E-posta:</strong> info@fileenessports.com</li>
              <li><strong>Telefon:</strong> +90 541 885 56 76</li>
              <li><strong>Çalışma Saatleri:</strong> Pazartesi - Cumartesi, 09:00 - 18:00</li>
              <li><strong>Adres:</strong> Namık Kemal Mah. 10. Sk. No 73/1 Daire 1, İstanbul</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
