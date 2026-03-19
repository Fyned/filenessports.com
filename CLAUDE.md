# CLAUDE.md — File Atolyesi Clone

## Proje
- **Tip:** e-ticaret
- **Musteri:** File Atolyesi
- **Domain:** -
- **Durum:** Aktif gelistirme

## Teknoloji
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 (@tailwindcss/postcss) + tw-animate-css
- Supabase (auth + veritabani + storage)
- Radix UI (dialog, tabs, select, accordion, switch vb.)
- Zustand (state yonetimi)
- React Hook Form + Zod (form dogrulama)
- @tanstack/react-table (veri tablolari)
- Recharts (grafikler)
- Swiper (slider/carousel)
- jsPDF + jspdf-autotable (PDF olusturma)
- SendGrid (e-posta)
- Puck Editor (gorsel icerik duzenleyici)
- Sonner (bildirimler)
- Lucide React (ikonlar)
- next-themes (tema yonetimi)

## Yapi
```
app/
  (auth)/        # Kimlik dogrulama sayfalari
  (shop)/        # Magaza sayfalari (vitrin)
  admin/         # Yonetim paneli
  api/           # API route'lari
  editor/        # Puck Editor sayfalari
  layout.tsx     # Root layout
  globals.css    # Global stiller
components/
  admin/         # Yonetim paneli bilesenleri
  shop/          # Magaza bilesenleri
  ui/            # Genel UI bilesenleri (shadcn/ui)
  charts/        # Grafik bilesenleri
  data-table/    # Tablo bilesenleri
  file-upload/   # Dosya yukleme bilesenleri
  puck/          # Puck Editor bilesenleri
hooks/           # Ozel React hook'lari
lib/             # Yardimci fonksiyonlar ve Supabase istemcisi
stores/          # Zustand store'lari
types/           # TypeScript tip tanimlari
supabase/
  migrations/    # Veritabani migration dosyalari
scripts/         # Seed ve watermark scriptleri
public/          # Statik dosyalar
```

## Kurallar
- Proje TypeScript kullanir; `.tsx` / `.ts` uzantilari zorunlu.
- State yonetimi icin Zustand kullanilir; Redux veya Context API degil.
- UI bilesenleri shadcn/ui + Radix UI uzerine kuruludur.
- Supabase migration'lari `supabase/migrations/` klasorunde tutulur.
- Seed islemi `npm run seed` ile yapilir; `.env.local` dosyasi gereklidir.
