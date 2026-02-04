# 🚀 Prompt 01: Proje Kurulumu

## Claude Code'a Verilecek Prompt

```
E-ticaret projesi kurulumu yapacağız. Aşağıdaki teknolojileri kullanacağız:
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/UI
- Supabase
- GrapesJS (sayfa builder için)

Şimdi projeyi başlatalım:

1. Next.js projesi oluştur:
npx create-next-app@latest file-atolyesi --typescript --tailwind --eslint --app --src-dir

2. Projeye gir ve gerekli paketleri yükle:
cd file-atolyesi

npm install @supabase/supabase-js @supabase/ssr
npm install @tanstack/react-query
npm install zustand
npm install zod react-hook-form @hookform/resolvers
npm install lucide-react
npm install grapesjs grapesjs-preset-webpage grapesjs-blocks-basic @grapesjs/react
npm install swiper
npm install date-fns
npm install slugify
npm install -D @types/node

3. Shadcn/UI kur:
npx shadcn@latest init

Ayarları şöyle seç:
- Style: Default
- Base color: Slate
- CSS variables: Yes

4. Temel Shadcn componentlerini ekle:
npx shadcn@latest add button card input label textarea select checkbox dialog dropdown-menu table tabs toast avatar badge separator sheet skeleton alert form

5. Klasör yapısını oluştur:
mkdir -p src/components/{ui,layout,product,cart,home,admin,shared}
mkdir -p src/lib/supabase
mkdir -p src/hooks
mkdir -p src/stores
mkdir -p src/types
mkdir -p src/styles

6. Aşağıdaki .env.local dosyasını oluştur:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=File Atölyesi
```

7. Supabase client dosyalarını oluştur:

src/lib/supabase/client.ts:
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

src/lib/supabase/server.ts:
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Handle error
          }
        },
      },
    }
  )
}
```

8. Temel types dosyasını oluştur:

src/types/index.ts:
```typescript
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  parent_id?: string
  sort_order: number
  is_active: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  sku?: string
  description?: string
  short_description?: string
  price: number
  compare_price?: number
  category_id?: string
  category?: Category
  stock_quantity: number
  stock_status: 'in_stock' | 'out_of_stock' | 'low_stock'
  is_active: boolean
  is_featured: boolean
  images?: ProductImage[]
  variants?: ProductVariant[]
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  alt_text?: string
  sort_order: number
  is_primary: boolean
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  sku?: string
  price?: number
  stock_quantity: number
  attributes: Record<string, string>
  image_url?: string
}

export interface CartItem {
  id: string
  product: Product
  variant?: ProductVariant
  quantity: number
}

export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  role: 'customer' | 'admin'
  avatar_url?: string
}

export interface Order {
  id: string
  order_number: string
  user_id?: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  subtotal: number
  shipping_cost: number
  discount_amount: number
  total: number
  items: OrderItem[]
  shipping_address: Address
  created_at: string
}

export interface OrderItem {
  id: string
  product_id: string
  name: string
  price: number
  quantity: number
  total: number
}

export interface Address {
  first_name: string
  last_name: string
  phone?: string
  address_line1: string
  address_line2?: string
  city: string
  district?: string
  postal_code?: string
  country: string
}

export interface Banner {
  id: string
  title: string
  subtitle?: string
  image_url: string
  mobile_image_url?: string
  link_url?: string
  button_text?: string
  position: string
  sort_order: number
  is_active: boolean
}

export interface PageSection {
  id: string
  page_type: string
  section_key: string
  content: Record<string, any>
  grapesjs_data?: Record<string, any>
  sort_order: number
  is_active: boolean
}
```

9. Tailwind config güncelle (tailwind.config.ts):
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0d4744",
          50: "#f0fdf9",
          100: "#ccfbee",
          200: "#9af5dd",
          300: "#5fe9c9",
          400: "#2dd4b1",
          500: "#14b899",
          600: "#0d947c",
          700: "#0d4744",
          800: "#0f5b58",
          900: "#114b49",
        },
        secondary: {
          DEFAULT: "#c5f82a",
          50: "#f7fee7",
          100: "#ecfccb",
          200: "#d9f99d",
          300: "#c5f82a",
          400: "#a3e635",
          500: "#84cc16",
          600: "#65a30d",
          700: "#4d7c0f",
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1400px",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

10. Globals.css güncelle:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 174 72% 16%;
    --primary-foreground: 210 40% 98%;
    --secondary: 75 94% 56%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 174 72% 16%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

Bu adımları tamamla ve herhangi bir hata olursa bana bildir.
```

## Beklenen Çıktı

- Çalışan bir Next.js 15 projesi
- Yüklenmiş tüm bağımlılıklar
- Kurulu Shadcn/UI
- Oluşturulmuş klasör yapısı
- Supabase client dosyaları
- TypeScript type tanımları

## Sonraki Adım

Bu prompt tamamlandıktan sonra `02-database.md` promptuna geç.
