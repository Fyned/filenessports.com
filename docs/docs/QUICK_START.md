# Claude Code Quick Start

Bu dosyayı Claude Code'a yapıştırarak projeyi başlatabilirsin.

---

## 🚀 İLK PROMPT - Proje Kurulumu

Aşağıdaki promptu Claude Code'a yapıştır:

```
Bir e-ticaret sitesi klonu yapıyoruz. fileatolyesi.com benzeri spor/güvenlik filesi satışı yapan bir site.

Tech stack:
- Next.js 14 (App Router)
- Supabase (Database, Auth, Storage)
- Puck Editor (Visual page builder - drag & drop)
- Tailwind CSS + Shadcn/ui
- TypeScript
- Zustand (state)

Proje yapısı:
- app/(shop)/ → Public shop pages
- app/admin/ → Admin panel
- components/puck/blocks/ → Visual editor blocks
- lib/supabase/ → Supabase clients
- lib/puck/ → Puck config

Admin panelden:
1. Sayfaları drag & drop ile düzenleyebilmeli (Puck)
2. Bannerları yönetebilmeli
3. Ürünleri/kategorileri CRUD yapabilmeli
4. Siparişleri görüntüleyebilmeli

Shop:
1. Homepage (Puck ile düzenlenebilir)
2. Ürün listesi/detay
3. Kategori sayfaları
4. Arama

1. Adım: Next.js 14 projesi oluştur (App Router, TypeScript, Tailwind)
2. Adım: Gerekli paketleri kur
3. Adım: Proje yapısını oluştur

Başla.
```

---

## 📦 PAKET KURULUMU PROMPT

```
Şu paketleri kur:

npm install @supabase/supabase-js @supabase/ssr @puckeditor/core zustand date-fns swiper lucide-react react-hook-form @hookform/resolvers zod tailwind-merge clsx

Sonra shadcn/ui kur:
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input select dialog dropdown-menu table tabs toast badge avatar separator sheet accordion checkbox label textarea command popover calendar skeleton form
```

---

## 🗄️ SUPABASE PROMPT

```
lib/supabase/ klasöründe şunları oluştur:

1. client.ts - Browser client (createBrowserClient)
2. server.ts - Server component client (createServerClient)  
3. admin.ts - Service role client
4. middleware.ts - Auth middleware

Environment variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

Ayrıca middleware.ts'de auth kontrolü yap.
```

---

## 🎨 PUCK EDITOR PROMPT

```
Puck visual editor kurulumu:

1. lib/puck/config.ts oluştur

2. Şu blokları tanımla (components/puck/blocks/):
- HeroBlock: Tam genişlik hero section (başlık, alt başlık, buton, arka plan)
- ProductGridBlock: Ürün grid'i (kategori seçimi, limit, sütun sayısı)
- CategoryCardsBlock: Kategori kartları
- BannerBlock: Promosyon banner
- FeatureBannersBlock: 4'lü özellik kutuları (kargo, taksit vs.)
- TextBlock: Zengin metin
- SpacerBlock: Boşluk/ayırıcı

Her block için:
- TypeScript props interface
- Puck field definitions
- React render component
- Responsive tasarım

3. Admin'de sayfa düzenleme sayfası:
app/admin/pages/[id]/edit/page.tsx
- Puck editor'ü render et
- Kaydet butonuna basınca Supabase'e kaydet
```

---

## 🛍️ SHOP FRONTEND PROMPT

```
Shop frontend oluştur:

1. app/(shop)/layout.tsx
- Header (logo, mega menu, arama, hesap/sepet)
- Footer (iletişim, linkler, sosyal medya)
- WhatsApp floating button

2. app/(shop)/page.tsx - Homepage
- Supabase'den page_blocks çek
- Puck Render ile göster

3. app/(shop)/urunler/page.tsx - Ürün listesi
- Grid layout
- Filtreleme (kategori, fiyat)
- Pagination

4. app/(shop)/urunler/[slug]/page.tsx - Ürün detay
- Görsel galeri
- Fiyat, stok
- Sepete ekle
- İlgili ürünler

5. app/(shop)/kategori/[slug]/page.tsx
- Kategori ürünleri
- Alt kategoriler

Tüm sayfalar için SEO metadata ekle.
```

---

## 🔐 ADMIN PANEL PROMPT

```
Admin panel oluştur:

1. app/admin/layout.tsx
- Sidebar navigation
- Header (breadcrumb, user dropdown)
- Auth kontrolü

2. app/admin/page.tsx - Dashboard
- İstatistik kartları
- Son siparişler
- Grafikler (opsiyonel)

3. app/admin/pages/ - Sayfa yönetimi
- Liste (DataTable)
- Yeni sayfa
- Düzenle (Puck editor)
- Sil

4. app/admin/products/ - Ürün yönetimi
- CRUD
- Görsel yükleme
- Varyant yönetimi

5. app/admin/categories/ - Kategori yönetimi
- Hiyerarşik yapı
- Sürükle bırak sıralama

6. app/admin/banners/ - Banner yönetimi
- CRUD
- Tarih aralığı
- Pozisyon seçimi

7. app/admin/settings/ - Site ayarları
- Genel bilgiler
- İletişim
- Sosyal medya
```

---

## 📝 NOTLAR

1. Her prompt'tan sonra "devam et" de
2. Hata alırsan göster, düzeltsin
3. Test et, çalıştığından emin ol
4. Git commit'leri düzenli at

Detaylı dokümantasyon için docs/ klasörüne bak:
- CLAUDE_CODE_PROMPTS.md
- SUPABASE_SCHEMA.md
- PUCK_BLOCKS.md
- IMPLEMENTATION_GUIDE.md
