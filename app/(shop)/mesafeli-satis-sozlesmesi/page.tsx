import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mesafeli Satış Sözleşmesi | Filenes Sports',
  description: '6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında mesafeli satış sözleşmesi.',
}

export default function DistanceSalesAgreementPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-[#1C2840] mb-8">Mesafeli Satış Sözleşmesi</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">1. Taraflar</h2>

            <h3 className="text-lg font-semibold text-[#1C2840] mb-3">1.1 Satıcı Bilgileri</h3>
            <ul className="text-gray-600 space-y-2 mb-4">
              <li><strong>Unvan:</strong> Enes Sucu</li>
              <li><strong>Adres:</strong> Namık Kemal Mah. 10. Sk. Çınar Apt. No: 73/1 İç Kapı No: 1, Esenyurt/İstanbul</li>
              <li><strong>Telefon:</strong> +90 541 885 56 76</li>
              <li><strong>E-posta:</strong> info@fileenessports.com</li>
              <li><strong>Vergi Dairesi:</strong> Avcılar Vergi Dairesi</li>
              <li><strong>VKN:</strong> 7821336103</li>
              <li><strong>Ödeme Altyapısı:</strong> iyzico Ödeme Hizmetleri A.Ş.</li>
            </ul>

            <h3 className="text-lg font-semibold text-[#1C2840] mb-3">1.2 Alıcı Bilgileri</h3>
            <p className="text-gray-600">
              Alıcı bilgileri, sipariş sırasında alıcı tarafından beyan edilen ad-soyad, adres, telefon ve
              e-posta bilgilerinden oluşmaktadır. Bu bilgiler sipariş formunda yer almakta olup sözleşmenin
              ayrılmaz bir parçasıdır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">2. Sözleşmenin Konusu</h2>
            <p className="text-gray-600 mb-4">
              İşbu Mesafeli Satış Sözleşmesi, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve
              Mesafeli Sözleşmeler Yönetmeliği hükümleri uyarınca tarafların hak ve yükümlülüklerini
              düzenlemektedir.
            </p>
            <p className="text-gray-600">
              Alıcının, Satıcıya ait fileenessports.com internet sitesinden elektronik ortamda sipariş
              vererek satın almak istediği aşağıda nitelikleri ve satış fiyatı belirtilen ürün/ürünlerin
              satışı ve teslimi ile ilgili olarak tarafların hak ve yükümlülüklerini kapsar.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">3. Ürün/Hizmet Bilgileri</h2>
            <p className="text-gray-600 mb-4">
              Sözleşmeye konu ürün/ürünlerin cinsi, miktarı, marka/modeli, rengi, adedi, satış bedeli
              ve ödeme şekli aşağıdaki gibidir:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Ürün türleri: Spor fileleri, kale fileleri, koruma fileleri, tavan fileleri, güvenlik fileleri ve ilgili aksesuarlar</li>
              <li>Tüm fiyatlar KDV dahil olup Türk Lirası (TRY) cinsinden belirtilmektedir</li>
              <li>Ürünlerin temel nitelikleri, satış fiyatı ve ödeme bilgileri sipariş sayfasında yer almaktadır</li>
              <li>Ürün görselleri temsili niteliktedir; renk, boyut ve görünümde küçük farklılıklar olabilir</li>
              <li>Stok durumuna göre ürün bilgileri ve fiyatlar önceden haber verilmeksizin güncellenebilir</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">4. Sipariş ve Ödeme</h2>
            <p className="text-gray-600 mb-4">Sipariş ve ödeme koşulları aşağıdaki gibidir:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Ödeme işlemleri, iyzico Ödeme Hizmetleri A.Ş. altyapısı üzerinden güvenli bir şekilde gerçekleştirilmektedir</li>
              <li>Kredi kartı ve banka kartı ile ödeme kabul edilmektedir (VISA, Mastercard, TROY)</li>
              <li>Tüm kart işlemleri 3D Secure güvenlik protokolü ile korunmaktadır</li>
              <li>Taksitli ödeme seçenekleri, bankanızın sunduğu imkanlara göre sipariş sırasında gösterilmektedir</li>
              <li>Sipariş onayı, ödemenin başarıyla tamamlanmasının ardından alıcının e-posta adresine gönderilir</li>
              <li>Sipariş tutarı, sipariş anındaki güncel fiyat üzerinden tahsil edilir</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">5. Teslimat Koşulları</h2>
            <p className="text-gray-600 mb-4">Ürünlerin teslimatına ilişkin koşullar:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Teslimat süresi, sipariş onayından itibaren 1-5 iş günüdür (ürün ve bölgeye göre değişiklik gösterebilir)</li>
              <li>Web sitesinde belirtilen tutarın üzerindeki siparişlerde kargo ücretsizdir</li>
              <li>Belirtilen tutarın altındaki siparişlerde kargo ücreti sipariş sayfasında gösterilmektedir</li>
              <li>Teslimat, anlaşmalı kargo firmaları aracılığıyla alıcının sipariş sırasında belirttiği adrese yapılmaktadır</li>
              <li>Teslimat adresi bilgilerinin doğruluğundan alıcı sorumludur</li>
              <li>Mücbir sebep halleri (doğal afet, pandemi, hava koşulları vb.) nedeniyle teslimat süreleri uzayabilir; bu durumda alıcı bilgilendirilir</li>
              <li>Sözleşme konusu ürün, yasal 30 günlük süreyi aşmamak koşuluyla her bir ürün için alıcının siparişinden sonra teslim edilir</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">6. Alıcının Beyan ve Taahhütleri</h2>
            <p className="text-gray-600 mb-4">Alıcı, aşağıdaki hususları kabul ve beyan eder:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Sözleşme konusu ürün/ürünlerin temel nitelikleri, satış fiyatı, ödeme şekli ve teslimat koşulları hakkında bilgi sahibi olduğunu</li>
              <li>Bu ön bilgilendirmeyi elektronik ortamda onayladığını</li>
              <li>Mesafeli Sözleşmeler Yönetmeliği uyarınca gerekli ön bilgilendirmeyi aldığını</li>
              <li>Sipariş formunda beyan ettiği bilgilerin doğru ve güncel olduğunu</li>
              <li>18 yaşından büyük olduğunu ve alışveriş yapmaya ehil olduğunu</li>
              <li>İşbu sözleşmeyi okuduğunu, anladığını ve tüm koşulları kabul ettiğini</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">7. Cayma Hakkı</h2>
            <p className="text-gray-600 mb-4">
              Alıcı, 6502 sayılı Tüketicinin Korunması Hakkında Kanun'un 48. maddesi ve Mesafeli
              Sözleşmeler Yönetmeliği uyarınca, sözleşme konusu ürünün kendisine veya gösterdiği
              adresteki kişi/kuruluşa tesliminden itibaren <strong>14 (on dört) gün</strong> içinde
              herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkını kullanabilir.
            </p>

            <h3 className="text-lg font-semibold text-[#1C2840] mb-3">7.1 Cayma Hakkının Kullanılması</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Cayma hakkı bildirimi, yazılı olarak veya kalıcı veri saklayıcısı (e-posta, faks vb.) ile yapılabilir</li>
              <li>Cayma bildirimi info@fileenessports.com e-posta adresine veya +90 541 885 56 76 telefon numarasına iletilmelidir</li>
              <li>Cayma hakkı süresinin belirlenmesinde ürünün alıcıya teslim edildiği tarih esas alınır</li>
            </ul>

            <h3 className="text-lg font-semibold text-[#1C2840] mb-3">7.2 Cayma Sonrası Satıcının Yükümlülükleri</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Satıcı, cayma bildiriminin kendisine ulaştığı tarihten itibaren en geç <strong>14 gün</strong> içinde toplam bedeli ve alıcıyı borç altına sokan tüm belgeleri iade eder</li>
              <li>İade ödemesi, alıcının satın alırken kullandığı ödeme aracına uygun şekilde ve alıcıya herhangi bir masraf veya yükümlülük getirmeksizin tek seferde yapılır</li>
            </ul>

            <h3 className="text-lg font-semibold text-[#1C2840] mb-3">7.3 Cayma Sonrası Alıcının Yükümlülükleri</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Alıcı, cayma bildirimini yönelttiği tarihten itibaren en geç <strong>10 gün</strong> içinde ürünü satıcıya veya satıcının yetkilendirdiği kişiye geri göndermelidir</li>
              <li>İade edilecek ürün, kullanılmamış, hasar görmemiş ve orijinal ambalajında olmalıdır</li>
              <li>Ürünle birlikte teslim edilen tüm aksesuar, hediye ve fatura da eksiksiz iade edilmelidir</li>
              <li>Cayma hakkı kullanımında standart iade kargo ücreti alıcıya aittir</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">8. Cayma Hakkının Kullanılamayacağı Haller</h2>
            <p className="text-gray-600 mb-4">
              Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesi gereğince, aşağıdaki durumlarda
              alıcı cayma hakkını kullanamaz:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Alıcının istekleri veya açıkça kişisel ihtiyaçları doğrultusunda hazırlanan, özel olarak üretilen ürünler (özel ölçü file siparişleri vb.)</li>
              <li>Çabuk bozulabilen veya son kullanma tarihi geçebilecek ürünler</li>
              <li>Tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olan ve iadesi sağlık ve hijyen açısından uygun olmayan ürünler</li>
              <li>Tesliminden sonra başka ürünlerle karışan ve doğası gereği ayrıştırılması mümkün olmayan ürünler</li>
              <li>Abonelik sözleşmesi kapsamında sağlanan ve satıcı tarafından belirlenen süre boyunca temin edilen gazete, dergi gibi süreli yayınlar</li>
              <li>Elektronik ortamda anında ifa edilen hizmetler ve tüketiciye anında teslim edilen gayri maddi mallara ilişkin sözleşmeler</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">9. Temerrüt Hali ve Hukuki Sonuçları</h2>
            <p className="text-gray-600">
              Alıcı, kredi kartı ile yapılan işlemlerde temerrüde düşmesi halinde kart sahibi
              bankayla arasındaki kredi kartı sözleşmesi çerçevesinde faiz ödeyeceğini ve bankaya
              karşı sorumlu olacağını kabul eder. Bu durumda ilgili banka hukuki yollara başvurabilir;
              doğacak masrafları ve vekalet ücretini alıcıdan talep edebilir ve her koşulda alıcının
              borcundan dolayı temerrüde düşmesi halinde, alıcının borcu gecikmeli ifasından dolayı
              satıcının uğradığı zarar ve ziyanı ödeyeceğini kabul eder.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">10. Uyuşmazlık Çözümü</h2>
            <p className="text-gray-600 mb-4">
              İşbu sözleşmeden doğan uyuşmazlıklarda, Gümrük ve Ticaret Bakanlığınca ilan edilen
              değere kadar Tüketici Hakem Heyetleri, bu değerin üzerindeki uyuşmazlıklarda ise
              Tüketici Mahkemeleri yetkilidir.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Başvuru mercii: İstanbul Tüketici Hakem Heyeti / İstanbul Tüketici Mahkemeleri</li>
              <li>Yasal dayanak: 6502 sayılı Tüketicinin Korunması Hakkında Kanun</li>
              <li>Alıcı, şikayetlerini Tüketici Bilgi Sistemi (TÜBİS) üzerinden de iletebilir</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">11. Yürürlük</h2>
            <p className="text-gray-600 mb-4">
              İşbu Mesafeli Satış Sözleşmesi, alıcının siparişi onaylaması ve ödemeyi
              gerçekleştirmesi ile birlikte yürürlüğe girer. Sözleşmenin bir nüshası alıcının
              e-posta adresine sipariş onayı ile birlikte gönderilir.
            </p>
            <p className="text-gray-600">
              Alıcı, işbu sözleşmenin tüm maddelerini okuduğunu, anladığını ve kabul ettiğini
              beyan ve taahhüt eder.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C2840] mb-4">12. İletişim</h2>
            <p className="text-gray-600 mb-4">
              Sözleşme ile ilgili her türlü soru ve talepleriniz için bizimle iletişime geçebilirsiniz:
            </p>
            <ul className="text-gray-600 space-y-2">
              <li><strong>E-posta:</strong> info@fileenessports.com</li>
              <li><strong>Telefon:</strong> +90 541 885 56 76</li>
              <li><strong>Adres:</strong> Namık Kemal Mah. 10. Sk. Çınar Apt. No: 73/1 İç Kapı No: 1, Esenyurt/İstanbul</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
