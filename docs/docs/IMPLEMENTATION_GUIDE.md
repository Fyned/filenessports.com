# Implementation Guide - Adım Adım Uygulama Rehberi

Bu rehber, File Atölyesi Clone projesini baştan sona nasıl geliştireceğinizi adım adım anlatır.

## 📋 Ön Gereksinimler

- Node.js 18+
- npm veya pnpm
- Supabase hesabı
- Git
- VS Code (önerilen)

---

## 🚀 ADIM 1: Proje Oluşturma

### 1.1 Next.js Projesi
```bash
npx create-next-app@latest file-atolyesi-clone --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
cd file-atolyesi-clone
```

### 1.2 Temel Paketler
```bash
npm install @supabase/supabase-js @supabase/ssr @puckeditor/core zustand date-fns swiper lucide-react react-hook-form @hookform/resolvers zod tailwind-merge clsx
```

### 1.3 Shadcn/ui
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input select dialog dropdown-menu table tabs toast badge avatar separator sheet accordion checkbox label textarea command popover calendar skeleton form
```

---

## 🗄️ ADIM 2: Supabase Kurulumu

### 2.1 Supabase Projesi Oluştur
1. https://supabase.com adresine git
2. Yeni proje oluştur
3. Proje ayarlarından API keys'leri al

### 2.2 Environment Variables
`.env.local` dosyası oluştur:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2.3 Supabase Client'lar

**lib/supabase/client.ts**
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**lib/supabase/server.ts**
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
```

### 2.4 Database Migration
Supabase Dashboard > SQL Editor'de SUPABASE_SCHEMA.md dosyasındaki SQL'leri çalıştır.

---

## 🎨 ADIM 3: Puck Editor Kurulumu

### 3.1 Puck Config Dosyası
`lib/puck/config.ts` oluştur ve PUCK_BLOCKS.md dosyasındaki config'i ekle.

### 3.2 Block Components
`components/puck/blocks/` klasöründe her block için component oluştur.

### 3.3 Custom Field: Image Picker
```typescript
// lib/puck/fields/ImagePicker.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ImagePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);

  // Supabase Storage'dan görselleri listele
  // Upload modal göster
  // Seçilen görseli onChange ile geri gönder

  return (
    <div>
      {value && <img src={value} alt="" className="w-32 h-32 object-cover" />}
      <Button onClick={() => setOpen(true)}>
        {value ? "Değiştir" : "Görsel Seç"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* Modal content */}
      </Dialog>
    </div>
  );
}
```

---

## 🛍️ ADIM 4: Shop Frontend

### 4.1 Route Groups
```
app/
├── (shop)/              # Public shop pages
│   ├── layout.tsx       # Shop layout (header, footer)
│   ├── page.tsx         # Homepage
│   ├── urunler/
│   │   ├── page.tsx     # All products
│   │   └── [slug]/
│   │       └── page.tsx # Product detail
│   └── kategori/
│       └── [slug]/
│           └── page.tsx # Category page
└── admin/               # Admin panel
    └── ...
```

### 4.2 Shop Layout
```typescript
// app/(shop)/layout.tsx
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { WhatsAppButton } from "@/components/shop/WhatsAppButton";

export default function ShopLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
```

### 4.3 Header Component
```typescript
// components/shop/Header.tsx
- Top bar (kampanya banner)
- Logo
- Mega menu (kategoriler)
- Arama
- Hesap/Sepet ikonları
- Mobil menu
```

### 4.4 Homepage
```typescript
// app/(shop)/page.tsx
import { Render } from "@puckeditor/core";
import { puckConfig } from "@/lib/puck/config";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createClient();

  // Homepage page_blocks'u çek
  const { data } = await supabase
    .from('pages')
    .select('*, page_blocks(puck_data)')
    .eq('is_homepage', true)
    .single();

  if (data?.page_blocks?.[0]?.puck_data) {
    return <Render config={puckConfig} data={data.page_blocks[0].puck_data} />;
  }

  // Fallback: Default homepage
  return <DefaultHomepage />;
}
```

---

## 🔐 ADIM 5: Admin Panel

### 5.1 Admin Layout
```typescript
// app/admin/layout.tsx
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/admin/login');
  }

  // Admin rol kontrolü
  // ...

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader user={user} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### 5.2 Sidebar Navigation
```typescript
const adminNavItems = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Sayfalar", href: "/admin/pages", icon: "FileText" },
  { label: "Ürünler", href: "/admin/products", icon: "Package" },
  { label: "Kategoriler", href: "/admin/categories", icon: "FolderTree" },
  { label: "Bannerlar", href: "/admin/banners", icon: "Image" },
  { label: "Siparişler", href: "/admin/orders", icon: "ShoppingCart" },
  { label: "Müşteriler", href: "/admin/customers", icon: "Users" },
  { label: "Blog", href: "/admin/blog", icon: "Newspaper" },
  { label: "Ayarlar", href: "/admin/settings", icon: "Settings" },
];
```

### 5.3 Page Builder
```typescript
// app/admin/pages/[id]/edit/page.tsx
"use client";

import { Puck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { puckConfig } from "@/lib/puck/config";

export default function PageEditor({ params }) {
  // ...
  return (
    <div className="h-screen">
      <Puck
        config={puckConfig}
        data={pageData}
        onPublish={handleSave}
        // Custom header with back button
        headerPath={`/admin/pages`}
      />
    </div>
  );
}
```

### 5.4 Product CRUD
```typescript
// app/admin/products/page.tsx - Liste
// app/admin/products/new/page.tsx - Yeni
// app/admin/products/[id]/page.tsx - Düzenle

// Product form schema
const productSchema = z.object({
  name: z.string().min(1, "Ürün adı zorunlu"),
  slug: z.string().min(1, "Slug zorunlu"),
  description: z.string().optional(),
  price: z.number().min(0),
  compare_price: z.number().optional(),
  sku: z.string().optional(),
  stock: z.number().default(0),
  category_id: z.string().optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});
```

---

## 📸 ADIM 6: Görsel Yönetimi

### 6.1 Storage Bucket Oluştur
Supabase Dashboard > Storage > New bucket: "images" (public)

### 6.2 Upload Component
```typescript
// components/ui/image-upload.tsx
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { createClient } from "@/lib/supabase/client";
import { Loader2, X, Upload } from "lucide-react";

export function ImageUpload({ value, onChange, bucket = "images" }) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const onDrop = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    
    setUploading(true);
    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    onChange(publicUrl);
    setUploading(false);
  }, [supabase, bucket, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative w-40 h-40">
          <img src={value} alt="" className="w-full h-full object-cover rounded-lg" />
          <button
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
            ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <Loader2 className="w-8 h-8 mx-auto animate-spin" />
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Görsel yüklemek için tıklayın veya sürükleyin
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 🔍 ADIM 7: SEO

### 7.1 Metadata
```typescript
// app/(shop)/urunler/[slug]/page.tsx
import { Metadata } from "next";

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  
  return {
    title: product.meta_title || product.name,
    description: product.meta_description || product.short_description,
    openGraph: {
      title: product.name,
      description: product.short_description,
      images: [product.images[0]?.url],
    },
  };
}
```

### 7.2 Sitemap
```typescript
// app/sitemap.ts
import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  // Products
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_active', true);

  // Categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, updated_at')
    .eq('is_active', true);

  return [
    { url: baseUrl, lastModified: new Date() },
    ...products.map((p) => ({
      url: `${baseUrl}/urunler/${p.slug}`,
      lastModified: p.updated_at,
    })),
    ...categories.map((c) => ({
      url: `${baseUrl}/kategori/${c.slug}`,
      lastModified: c.updated_at,
    })),
  ];
}
```

---

## 🚢 ADIM 8: Deployment

### 8.1 Vercel Deploy
1. GitHub'a push et
2. Vercel'e bağla
3. Environment variables ekle
4. Deploy

### 8.2 Domain Ayarları
1. Custom domain ekle
2. SSL otomatik aktif

### 8.3 Post-Deploy
1. Supabase > Project Settings > API'den production URL'i güncelle
2. RLS policies'i kontrol et
3. Storage bucket policies'i kontrol et

---

## ✅ Checklist

- [ ] Next.js projesi oluşturuldu
- [ ] Supabase client'ları kuruldu
- [ ] Database tabloları oluşturuldu
- [ ] RLS policies eklendi
- [ ] Puck editor konfigüre edildi
- [ ] Puck blokları oluşturuldu
- [ ] Shop layout hazırlandı
- [ ] Admin panel hazırlandı
- [ ] Ürün CRUD tamamlandı
- [ ] Görsel yükleme çalışıyor
- [ ] SEO metadata eklendi
- [ ] Production deploy yapıldı
