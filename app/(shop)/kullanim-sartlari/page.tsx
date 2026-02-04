import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kullanım Şartları | Filenes Sports',
  description: 'Filenes Sports web sitesi kullanım şartları ve koşulları.',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-[#1C2840] mb-8">Kullanım Şartları</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">1. Genel Hükümler</h2>
            <p className="text-gray-600 mb-4">
              Bu web sitesini (fileenessports.com) kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.
              Bu şartları kabul etmiyorsanız, lütfen siteyi kullanmayınız.
            </p>
            <p className="text-gray-600">
              Filenes Sports, bu şartları herhangi bir zamanda değiştirme hakkını saklı tutar.
              Değişiklikler sitede yayınlandığı anda yürürlüğe girer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">2. Hesap Oluşturma</h2>
            <p className="text-gray-600 mb-4">
              Sipariş verebilmek için bir hesap oluşturmanız gerekmektedir. Hesap oluştururken:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Doğru ve güncel bilgiler vermekle yükümlüsünüz</li>
              <li>Hesap bilgilerinizin gizliliğinden siz sorumlusunuz</li>
              <li>Hesabınızla yapılan tüm işlemlerden siz sorumlusunuz</li>
              <li>18 yaşından büyük olmanız gerekmektedir</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">3. Sipariş ve Satın Alma</h2>
            <p className="text-gray-600 mb-4">
              Web sitemiz üzerinden sipariş verdiğinizde:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Sipariş onayı alana kadar satış sözleşmesi kurulmaz</li>
              <li>Fiyatlar KDV dahildir ve Türk Lirası cinsindendir</li>
              <li>Stok durumuna göre siparişler iptal edilebilir</li>
              <li>Fiyat hataları durumunda siparişler iptal edilebilir</li>
              <li>Ödeme işlemi tamamlandıktan sonra sipariş onaylanır</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">4. Ürünler ve Fiyatlar</h2>
            <p className="text-gray-600 mb-4">
              Web sitemizdeki ürünler hakkında:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Ürün görselleri temsilidir, küçük farklılıklar olabilir</li>
              <li>Ürün özellikleri üretici tarafından değiştirilebilir</li>
              <li>Fiyatlar önceden haber verilmeksizin değiştirilebilir</li>
              <li>Stok durumu anlık olarak değişebilir</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">5. Teslimat</h2>
            <p className="text-gray-600 mb-4">
              Teslimat koşulları:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Teslimat süresi ortalama 1-5 iş günüdür</li>
              <li>Teslimat adresi doğru ve eksiksiz olmalıdır</li>
              <li>Hatalı adres nedeniyle yaşanan gecikmelerden sorumlu değiliz</li>
              <li>150 TL üzeri alışverişlerde kargo ücretsizdir</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">6. İade ve Değişim</h2>
            <p className="text-gray-600 mb-4">
              6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Ürünü teslim aldığınız tarihten itibaren 14 gün içinde cayma hakkınız vardır</li>
              <li>Ürün kullanılmamış ve orijinal ambalajında olmalıdır</li>
              <li>İç giyim, mayo, bikini gibi hijyenik ürünlerde iade kabul edilmez</li>
              <li>Kişiselleştirilmiş ürünlerde iade kabul edilmez</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">7. Fikri Mülkiyet</h2>
            <p className="text-gray-600">
              Web sitemizdeki tüm içerik, görseller, logolar, grafikler ve yazılımlar Filenes Sports'un
              fikri mülkiyetidir. İzinsiz kopyalama, çoğaltma veya kullanım yasaktır ve yasal işlem
              başlatılabilir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">8. Sorumluluk Sınırlaması</h2>
            <p className="text-gray-600 mb-4">
              Filenes Sports:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Web sitesinin kesintisiz çalışacağını garanti etmez</li>
              <li>Teknik arızalardan kaynaklanan zararlardan sorumlu değildir</li>
              <li>Üçüncü taraf web sitelerinin içeriklerinden sorumlu değildir</li>
              <li>Ürünlerin amacına uygun kullanılmamasından doğan zararlardan sorumlu değildir</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">9. Yasak Kullanımlar</h2>
            <p className="text-gray-600 mb-4">
              Web sitemizi aşağıdaki amaçlarla kullanmak yasaktır:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Yasa dışı faaliyetler</li>
              <li>Başkalarının haklarını ihlal etmek</li>
              <li>Zararlı yazılım yaymak</li>
              <li>Siteyi bozmaya çalışmak</li>
              <li>Sahte hesap oluşturmak</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">10. Uygulanacak Hukuk</h2>
            <p className="text-gray-600">
              Bu kullanım şartları Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlık durumunda
              İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">11. İletişim</h2>
            <p className="text-gray-600 mb-4">
              Kullanım şartlarıyla ilgili sorularınız için bizimle iletişime geçebilirsiniz:
            </p>
            <ul className="text-gray-600 space-y-2">
              <li><strong>E-posta:</strong> hukuk@fileenessports.com</li>
              <li><strong>Telefon:</strong> +90 (212) 123 45 67</li>
              <li><strong>Adres:</strong> Örnek Mahallesi, Spor Caddesi No: 123, Kadıköy, İstanbul</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
