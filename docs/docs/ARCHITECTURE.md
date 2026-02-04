# 🏛️ Proje Mimarisi

## Genel Bakış

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js 15 App                         │
├─────────────────────────┬───────────────────────────────────┤
│     Müşteri Sitesi      │         Admin Panel               │
│    (Public Routes)      │     (Protected Routes)            │
│                         │                                   │
│  - Ana Sayfa            │  - Dashboard                      │
│  - Ürünler              │  - Ürün Yönetimi                  │
│  - Sepet                │  - Sipariş Yönetimi               │
│  - Hesabım              │  - Sayfa Builder (GrapesJS)       │
│  - Blog                 │  - Medya Yönetimi                 │
└─────────────┬───────────┴───────────────┬───────────────────┘
              │                           │
              └───────────┬───────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Routes                              │
│               (Next.js Route Handlers)                      │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                       Supabase                              │
├─────────────┬───────────┬───────────┬───────────────────────┤
│  Database   │   Auth    │  Storage  │     Realtime          │
│ (PostgreSQL)│           │           │                       │
└─────────────┴───────────┴───────────┴───────────────────────┘
```

## Klasör Yapısı

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Müşteri sitesi
│   │   ├── page.tsx              # Ana sayfa
│   │   ├── urunler/              # Ürün listeleme
│   │   │   ├── page.tsx
│   │   │   └── [slug]/           # Ürün detay
│   │   ├── kategori/             # Kategori sayfaları
│   │   │   └── [slug]/
│   │   ├── sepet/                # Sepet
│   │   ├── hesabim/              # Kullanıcı hesabı
│   │   │   ├── siparislerim/
│   │   │   ├── adreslerim/
│   │   │   └── profilim/
│   │   ├── blog/                 # Blog
│   │   │   └── [slug]/
│   │   └── [slug]/               # Dinamik sayfalar (CMS)
│   │
│   ├── (auth)/                   # Auth sayfaları
│   │   ├── giris/
│   │   ├── kayit/
│   │   └── sifremi-unuttum/
│   │
│   ├── admin/                    # Admin panel
│   │   ├── layout.tsx            # Admin layout
│   │   ├── page.tsx              # Dashboard
│   │   ├── urunler/              # Ürün yönetimi
│   │   │   ├── page.tsx          # Liste
│   │   │   ├── yeni/             # Yeni ürün
│   │   │   └── [id]/             # Düzenle
│   │   ├── kategoriler/
│   │   ├── siparisler/
│   │   ├── sayfalar/             # Sayfa yönetimi
│   │   │   ├── page.tsx
│   │   │   └── builder/          # GrapesJS editor
│   │   │       └── [id]/
│   │   ├── bannerlar/
│   │   ├── blog/
│   │   ├── medya/
│   │   ├── kullanicilar/
│   │   └── ayarlar/
│   │
│   ├── api/                      # API Routes
│   │   ├── products/
│   │   ├── categories/
│   │   ├── orders/
│   │   ├── cart/
│   │   ├── pages/
│   │   ├── upload/
│   │   └── settings/
│   │
│   ├── layout.tsx                # Root layout
│   └── globals.css
│
├── components/                   # Paylaşılan componentler
│   ├── ui/                       # Shadcn UI componentleri
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   │
│   ├── layout/                   # Layout componentleri
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── navbar.tsx
│   │   ├── mobile-menu.tsx
│   │   └── admin-sidebar.tsx
│   │
│   ├── product/                  # Ürün componentleri
│   │   ├── product-card.tsx
│   │   ├── product-grid.tsx
│   │   ├── product-gallery.tsx
│   │   ├── product-info.tsx
│   │   └── product-variants.tsx
│   │
│   ├── cart/                     # Sepet componentleri
│   │   ├── cart-item.tsx
│   │   ├── cart-sidebar.tsx
│   │   └── cart-summary.tsx
│   │
│   ├── home/                     # Ana sayfa componentleri
│   │   ├── hero-slider.tsx
│   │   ├── category-banners.tsx
│   │   ├── featured-products.tsx
│   │   ├── promo-cards.tsx
│   │   └── blog-section.tsx
│   │
│   ├── admin/                    # Admin componentleri
│   │   ├── data-table.tsx
│   │   ├── stats-card.tsx
│   │   ├── recent-orders.tsx
│   │   └── page-builder/         # GrapesJS wrapper
│   │       ├── editor.tsx
│   │       ├── blocks.tsx
│   │       └── plugins.tsx
│   │
│   └── shared/                   # Ortak componentler
│       ├── loading.tsx
│       ├── error.tsx
│       ├── pagination.tsx
│       ├── search.tsx
│       └── whatsapp-button.tsx
│
├── lib/                          # Utility ve konfigürasyonlar
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── admin.ts              # Admin client
│   ├── utils.ts                  # Genel utility fonksiyonları
│   ├── constants.ts              # Sabit değerler
│   └── validations/              # Zod şemaları
│       ├── product.ts
│       ├── order.ts
│       └── user.ts
│
├── hooks/                        # Custom hooks
│   ├── use-cart.ts
│   ├── use-auth.ts
│   ├── use-products.ts
│   └── use-media-query.ts
│
├── stores/                       # Zustand stores
│   ├── cart-store.ts
│   ├── ui-store.ts
│   └── admin-store.ts
│
├── types/                        # TypeScript tipleri
│   ├── product.ts
│   ├── order.ts
│   ├── user.ts
│   └── database.ts               # Supabase generated types
│
└── styles/                       # Ek stiller
    ├── grapesjs-custom.css       # GrapesJS özel stilleri
    └── print.css                 # Print stilleri
```

## Component Mimarisi

### Server vs Client Components

```typescript
// Server Component (varsayılan) - data fetching için
// app/urunler/page.tsx
export default async function ProductsPage() {
  const products = await getProducts() // Server-side data fetching
  return <ProductGrid products={products} />
}

// Client Component - interactivity için
// components/product/product-card.tsx
'use client'
export function ProductCard({ product }) {
  const { addToCart } = useCart()
  return (
    <div onClick={() => addToCart(product)}>
      {/* ... */}
    </div>
  )
}
```

### Data Fetching Pattern

```typescript
// lib/supabase/queries/products.ts
export async function getProducts(options?: ProductQueryOptions) {
  const supabase = createServerClient()
  
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      images:product_images(id, image_url, is_primary)
    `)
    .eq('is_active', true)
  
  if (options?.category) {
    query = query.eq('category_id', options.category)
  }
  
  if (options?.featured) {
    query = query.eq('is_featured', true)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}
```

## State Management

### Cart State (Zustand)

```typescript
// stores/cart-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity?: number, variant?: Variant) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  total: number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, variant) => {
        // Implementation
      },
      // ... diğer metodlar
    }),
    { name: 'cart-storage' }
  )
)
```

## API Route Patterns

```typescript
// app/api/products/route.ts
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  
  const supabase = createServerClient()
  
  let query = supabase.from('products').select('*').eq('is_active', true)
  
  if (category) {
    query = query.eq('category_id', category)
  }
  
  const { data, error } = await query
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createServerClient()
  const body = await request.json()
  
  // Admin kontrolü
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  // Ürün oluştur
  const { data, error } = await supabase
    .from('products')
    .insert(body)
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data, { status: 201 })
}
```

## GrapesJS Entegrasyonu

```typescript
// components/admin/page-builder/editor.tsx
'use client'

import grapesjs, { Editor } from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import gjsPresetWebpage from 'grapesjs-preset-webpage'
import gjsBlocksBasic from 'grapesjs-blocks-basic'

// Custom blocks for e-commerce
const customBlocks = {
  'product-grid': {
    label: 'Ürün Grid',
    content: `<div class="product-grid" data-gjs-type="product-grid">
      <!-- Dinamik ürün listesi -->
    </div>`,
    category: 'E-Ticaret'
  },
  'category-banner': {
    label: 'Kategori Banner',
    content: `<div class="category-banner" data-gjs-type="category-banner">
      <!-- Dinamik kategori bannerı -->
    </div>`,
    category: 'E-Ticaret'
  },
  // ... diğer custom blocklar
}

export function PageBuilder({ pageId, initialData }) {
  const editorRef = useRef<Editor | null>(null)
  
  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = grapesjs.init({
        container: '#gjs',
        plugins: [gjsPresetWebpage, gjsBlocksBasic],
        // ... konfigürasyon
      })
      
      // Custom blokları ekle
      Object.entries(customBlocks).forEach(([id, block]) => {
        editorRef.current?.BlockManager.add(id, block)
      })
    }
  }, [])
  
  // ... save logic
}
```

## Authentication Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Kullanıcı  │────▶│   Supabase   │────▶│   Database   │
│              │     │     Auth     │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                     │
       │    Login/Register  │                     │
       ├───────────────────▶│                     │
       │                    │  Create Profile     │
       │                    ├────────────────────▶│
       │                    │                     │
       │◀───────────────────┤  Return JWT Token   │
       │   Set Cookie       │                     │
       │                    │                     │
```

## Deployment Mimarisi

```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel                               │
│                   (Next.js Hosting)                         │
├─────────────────────────────────────────────────────────────┤
│  Edge Functions  │  Serverless Functions  │  Static Assets  │
└─────────┬────────┴───────────┬────────────┴────────┬────────┘
          │                    │                     │
          └────────────────────┼─────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       Supabase                              │
│              (Database, Auth, Storage)                      │
└─────────────────────────────────────────────────────────────┘
```
