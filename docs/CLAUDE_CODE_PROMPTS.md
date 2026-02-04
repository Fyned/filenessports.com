# Claude Code Prompts - File Atölyesi Clone

Bu dosya, projeyi Claude Code ile geliştirmek için kullanılacak hazır promptları içerir.
Promptları sırasıyla kullanın.

---

## 🚀 PHASE 1: Proje Kurulumu

### Prompt 1.1 - Next.js Projesi Oluştur
```
Next.js 14 projesi oluştur (App Router). 
- TypeScript kullan
- Tailwind CSS ekle
- src/ klasörü kullanma, root'ta app/ olsun
- ESLint ve Prettier konfigüre et
Proje adı: file-atolyesi-clone
```

### Prompt 1.2 - Temel Dependencies
```
Şu paketleri kur ve konfigüre et:
- @supabase/supabase-js ve @supabase/ssr
- @puckeditor/core (visual page builder)
- @radix-ui/react-* (shadcn için)
- lucide-react (icons)
- react-hook-form + zod (form validation)
- zustand (state management)
- date-fns (date utils)
- swiper (slider/carousel)
- tailwind-merge ve clsx
```

### Prompt 1.3 - Shadcn/ui Kurulumu
```
shadcn/ui'ı kur ve şu componentleri ekle:
button, card, input, select, dialog, dropdown-menu, 
table, tabs, toast, badge, avatar, separator, 
sheet, accordion, checkbox, label, textarea, 
command, popover, calendar, skeleton
```

---

## 🗄️ PHASE 2: Supabase Setup

### Prompt 2.1 - Supabase Client
```
lib/supabase/ klasöründe Supabase client'larını oluştur:
- client.ts (browser client)
- server.ts (server component client)
- middleware.ts (auth middleware)
- admin.ts (service role client)

Environment variables:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### Prompt 2.2 - Database Migration (SQL)
```
Supabase için migration dosyası oluştur. Tablolar:

1. categories (id, name, slug, description, image_url, parent_id, sort_order, is_active)
2. products (id, name, slug, description, short_description, price, compare_price, sku, stock, category_id, is_active, is_featured, meta_title, meta_description)
3. product_images (id, product_id, url, alt, sort_order)
4. product_variants (id, product_id, name, price, stock, sku)
5. banners (id, title, subtitle, image_url, link, position, sort_order, is_active, starts_at, ends_at)
6. pages (id, title, slug, content, meta_title, meta_description, is_published)
7. page_blocks (id, page_id, puck_data, version)
8. site_settings (id, key, value, type)
9. customers (id, user_id, name, email, phone, address)
10. orders (id, customer_id, status, total, shipping_address, notes)
11. order_items (id, order_id, product_id, variant_id, quantity, price)
12. blog_posts (id, title, slug, content, excerpt, image_url, author, is_published, published_at)

Her tabloya created_at ve updated_at ekle.
RLS policies oluştur.
```

---

## 🎨 PHASE 3: Puck Visual Editor

### Prompt 3.1 - Puck Configuration
```
lib/puck/ klasöründe Puck editor konfigürasyonunu oluştur.

Şu blokları tanımla:
1. HeroBlock - tam genişlik hero section (başlık, alt başlık, buton, arka plan resmi)
2. BannerBlock - promosyon banner'ı
3. ProductGridBlock - ürün grid'i (kategori seçimi, limit)
4. CategoryCardsBlock - kategori kartları
5. FeatureBannersBlock - özellik banner'ları (4'lü grid)
6. TextBlock - zengin metin
7. ImageBlock - tekli görsel
8. VideoBlock - video embed
9. TestimonialsBlock - müşteri yorumları
10. CTABlock - call to action
11. SpacerBlock - boşluk
12. DividerBlock - ayırıcı çizgi

Her blok için:
- TypeScript types
- Puck field definitions
- React render component
- Responsive props (mobile/tablet/desktop)
```

### Prompt 3.2 - Puck Admin Sayfası
```
app/admin/pages/ klasöründe sayfa yönetimi oluştur:

1. Sayfa listesi (table view)
2. Sayfa oluştur/düzenle sayfası (Puck editor ile)
3. Sayfa önizleme
4. Sayfa yayınla/yayından kaldır

Puck editor'ü tam ekran modal olarak aç.
Kaydet butonuna basınca Supabase'e JSON olarak kaydet.
```

### Prompt 3.3 - Puck Blok Componentleri
```
components/puck/ klasöründe her blok için React componenti oluştur.

Örnek HeroBlock:
- Tam genişlik arka plan resmi
- Overlay desteği
- Başlık, alt başlık, buton
- Mobil responsive
- Tailwind ile styling

Her blok Supabase'den dinamik veri çekebilmeli.
```

---

## 🛍️ PHASE 4: Shop Frontend

### Prompt 4.1 - Layout ve Navigation
```
app/(shop)/ için layout oluştur:

Header:
- Logo
- Mega menu (kategoriler)
- Arama çubuğu
- Hesap / Sepet ikonları
- Mobil hamburger menu

Footer:
- İletişim bilgileri
- Linkler (Kurumsal, Hesabım)
- Sosyal medya
- Alt bilgi

WhatsApp floating button ekle.
```

### Prompt 4.2 - Homepage
```
app/(shop)/page.tsx için homepage oluştur.

Supabase'den çek:
- page_blocks tablosundan homepage puck data
- Puck Render componenti ile render et

Eğer puck data yoksa default layout göster:
- Hero slider
- Kategori kartları
- Öne çıkan ürünler
- Promosyon banner'ları
```

### Prompt 4.3 - Ürün Sayfaları
```
Şu sayfaları oluştur:

1. app/(shop)/urunler/page.tsx
   - Tüm ürünler listesi
   - Filtreleme (kategori, fiyat)
   - Sıralama
   - Pagination

2. app/(shop)/urunler/[slug]/page.tsx
   - Ürün detay
   - Görsel galeri
   - Fiyat, stok bilgisi
   - Varyant seçimi
   - Sepete ekle
   - İlgili ürünler

3. app/(shop)/kategori/[slug]/page.tsx
   - Kategori ürünleri
   - Alt kategoriler
   - Filtreleme
```

---

## 🔐 PHASE 5: Admin Panel

### Prompt 5.1 - Admin Layout
```
app/admin/ için admin layout oluştur:

Sidebar:
- Dashboard
- Sayfalar (Puck)
- Ürünler
- Kategoriler
- Bannerlar
- Siparişler
- Müşteriler
- Blog
- Ayarlar

Header:
- Breadcrumb
- User dropdown

Auth middleware ile koru.
Sadece admin rolüne izin ver.
```

### Prompt 5.2 - Dashboard
```
app/admin/page.tsx için dashboard:

Kartlar:
- Toplam sipariş
- Bugünkü sipariş
- Toplam gelir
- Aktif ürün sayısı

Grafikler:
- Haftalık satış grafiği
- Kategori dağılımı

Son siparişler tablosu
Stok uyarıları
```

### Prompt 5.3 - Ürün Yönetimi
```
app/admin/products/ klasörü:

1. page.tsx - Ürün listesi
   - DataTable
   - Arama, filtreleme
   - Toplu işlemler

2. new/page.tsx - Yeni ürün
   - Form (react-hook-form + zod)
   - Görsel yükleme (Supabase Storage)
   - Varyant ekleme
   - SEO alanları

3. [id]/page.tsx - Ürün düzenle
   - Mevcut verilerle form doldur
   - Güncelle/Sil işlemleri
```

### Prompt 5.4 - Banner Yönetimi
```
app/admin/banners/ klasörü:

Banner CRUD:
- Başlık, alt başlık
- Görsel yükleme
- Link
- Pozisyon (hero, sidebar, footer)
- Tarih aralığı (başlangıç/bitiş)
- Sıralama (drag & drop)
- Aktif/Pasif
```

---

## 🎯 PHASE 6: Önemli Özellikler

### Prompt 6.1 - Görsel Yükleme
```
Supabase Storage ile görsel yükleme sistemi:

1. components/ui/image-upload.tsx
   - Drag & drop
   - Preview
   - Multiple upload
   - Progress bar
   - Resize/optimize

2. lib/supabase/storage.ts
   - Upload function
   - Delete function
   - Get public URL
   - Bucket: 'images'
```

### Prompt 6.2 - SEO Optimization
```
SEO için:

1. Her sayfa için metadata
2. generateMetadata fonksiyonları
3. JSON-LD structured data
4. Sitemap.xml
5. Robots.txt
6. Open Graph images
7. Canonical URLs
```

### Prompt 6.3 - Performance
```
Performance optimizasyonları:

1. Image optimization (next/image)
2. Lazy loading
3. ISR (Incremental Static Regeneration)
4. React Server Components
5. Skeleton loaders
6. Caching strategies
```

---

## 📝 Kullanım Notları

1. Her prompt'u sırasıyla uygula
2. Bir prompt tamamlanmadan diğerine geçme
3. Hata alırsan Claude'a göster ve düzeltmesini iste
4. Test et, çalıştığından emin ol
5. Git commit'leri düzenli at
