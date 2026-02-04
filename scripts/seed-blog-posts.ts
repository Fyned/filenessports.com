import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const blogPosts = [
  {
    title: 'Spor Filesi Seçerken Dikkat Edilmesi Gerekenler',
    slug: 'spor-filesi-secerken-dikkat-edilmesi-gerekenler',
    content: `
# Spor Filesi Seçerken Dikkat Edilmesi Gerekenler

Spor fileleri, hem profesyonel spor tesisleri hem de hobi amaçlı kullanım için vazgeçilmez ekipmanlardır. Doğru file seçimi, hem güvenlik hem de performans açısından kritik öneme sahiptir.

## 1. Malzeme Kalitesi

Spor filelerinde en çok kullanılan malzemeler:
- **Polipropilen (PP)**: Ekonomik ve dayanıklı
- **Polyester**: UV dayanımı yüksek, dış mekan için ideal
- **Naylon**: Esneklik ve dayanıklılık

## 2. Göz Aralığı

File göz aralığı, kullanım amacına göre seçilmelidir:
- Futbol kalesi: 10x10 cm veya 12x12 cm
- Voleybol: 10x10 cm
- Badminton: Daha küçük göz aralıkları

## 3. İp Kalınlığı

İp kalınlığı, filenin dayanıklılığını doğrudan etkiler:
- Hobi kullanımı: 2-3 mm
- Profesyonel: 3-4 mm
- Yarışma: 4 mm ve üzeri

## 4. UV Dayanımı

Dış mekanda kullanılacak filelerde UV stabilizatörü olması şarttır. Bu sayede güneş ışınlarından kaynaklanan yıpranma minimize edilir.

## Sonuç

Doğru file seçimi yaparak hem güvenliğinizi sağlayabilir hem de uzun ömürlü bir ürüne sahip olabilirsiniz. Sorularınız için bizimle iletişime geçmekten çekinmeyin.
    `.trim(),
    excerpt: 'Spor filesi alırken malzeme kalitesi, göz aralığı ve ip kalınlığı gibi kritik faktörleri inceliyoruz.',
    author: 'Filenes Sports',
    category: 'Rehber',
    tags: ['spor filesi', 'file seçimi', 'rehber', 'kalite'],
    is_published: true,
    published_at: new Date().toISOString(),
    meta_title: 'Spor Filesi Seçim Rehberi | Filenes Sports',
    meta_description: 'Spor filesi alırken dikkat edilmesi gereken önemli noktalar. Malzeme, göz aralığı ve ip kalınlığı hakkında detaylı bilgi.'
  },
  {
    title: 'Güvenlik Filesi Kullanım Alanları',
    slug: 'guvenlik-filesi-kullanim-alanlari',
    content: `
# Güvenlik Filesi Kullanım Alanları

Güvenlik fileleri, çeşitli sektörlerde can ve mal güvenliğini sağlamak için kullanılan önemli ekipmanlardır.

## İnşaat Sektörü

İnşaat alanlarında güvenlik fileleri:
- Düşmeye karşı koruma
- Moloz ve malzeme düşmesini engelleme
- İşçi güvenliği standartlarını karşılama

## Spor Tesisleri

Spor alanlarında güvenlik amaçlı kullanım:
- Seyirci alanlarını koruma
- Top kaçışını engelleme
- Oyuncu güvenliği

## Çocuk Güvenliği

Ev ve bahçelerde:
- Balkon güvenliği
- Merdiven korkulukları
- Havuz çevresi güvenliği

## Endüstriyel Kullanım

Fabrika ve depolarda:
- Raf sistemleri güvenliği
- Yüksekten düşme önleme
- Malzeme koruma

## Seçim Kriterleri

Güvenlik filesi seçerken:
1. Yük taşıma kapasitesi
2. Göz aralığı
3. UV ve hava koşullarına dayanıklılık
4. Sertifika ve standartlar

Güvenlik filelerimiz EN 1263-1 standardına uygundur.
    `.trim(),
    excerpt: 'İnşaat, spor tesisleri ve ev kullanımı için güvenlik filesi uygulamalarını keşfedin.',
    author: 'Filenes Sports',
    category: 'Bilgi',
    tags: ['güvenlik filesi', 'inşaat', 'spor tesisi', 'çocuk güvenliği'],
    is_published: true,
    published_at: new Date(Date.now() - 86400000).toISOString(), // 1 gün önce
    meta_title: 'Güvenlik Filesi Kullanım Alanları | Filenes Sports',
    meta_description: 'Güvenlik filesi nerelerde kullanılır? İnşaat, spor tesisleri ve ev güvenliği için file çözümleri.'
  },
  {
    title: 'File Bakımı ve Temizliği Nasıl Yapılır?',
    slug: 'file-bakimi-ve-temizligi',
    content: `
# File Bakımı ve Temizliği Nasıl Yapılır?

Filelerinizin ömrünü uzatmak ve performansını korumak için düzenli bakım şarttır.

## Temizlik Önerileri

### Haftalık Bakım
- Toz ve yaprakları temizleyin
- Gevşek düğümleri kontrol edin
- Yırtık veya aşınma olup olmadığını inceleyin

### Aylık Temizlik
1. Fileyi yerinden çıkarın (mümkünse)
2. Ilık su ve yumuşak deterjan kullanın
3. Yumuşak fırça ile nazikçe ovalayın
4. Bol su ile durulayın
5. Gölgede kurumaya bırakın

## Dikkat Edilmesi Gerekenler

**Yapılmaması Gerekenler:**
- Çamaşır suyu veya sert kimyasallar kullanmayın
- Yüksek basınçlı su ile yıkamayın
- Direkt güneş altında kurutmayın
- Islakken katlamayın

**Yapılması Gerekenler:**
- Düzenli kontrol yapın
- Küçük hasarları hemen onarın
- Mevsimlik depolama öncesi temizleyin
- Kuru ve serin yerde saklayın

## Depolama

Uzun süreli depolama için:
1. Temiz ve kuru olduğundan emin olun
2. Gevşek şekilde rulo yapın
3. Nefes alan kumaş torbada saklayın
4. Nem ve direkt güneşten koruyun

Düzenli bakımla fileleriniz yıllarca size hizmet edecektir.
    `.trim(),
    excerpt: 'Spor ve güvenlik filelerinizin ömrünü uzatmak için bakım ve temizlik ipuçları.',
    author: 'Filenes Sports',
    category: 'Bakım',
    tags: ['file bakımı', 'temizlik', 'depolama', 'ipuçları'],
    is_published: true,
    published_at: new Date(Date.now() - 172800000).toISOString(), // 2 gün önce
    meta_title: 'File Bakımı ve Temizliği | Filenes Sports',
    meta_description: 'Spor ve güvenlik filelerinizin bakımı için pratik ipuçları. Temizlik, depolama ve onarım önerileri.'
  }
]

async function seedBlogPosts() {
  console.log('Blog yazıları ekleniyor...')

  for (const post of blogPosts) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(post)
      .select()
      .single()

    if (error) {
      console.error(`Hata (${post.title}):`, error.message)
    } else {
      console.log(`✓ Eklendi: ${post.title}`)
    }
  }

  console.log('\nTamamlandı!')
}

seedBlogPosts()
