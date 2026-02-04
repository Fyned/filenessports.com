# Puck Editor Blocks - Visual Page Builder

Bu dosya, Puck visual editor için tanımlanacak blokları içerir.

## 🎯 Puck Nedir?

Puck, React için açık kaynak bir visual editor'dür. Drag & drop ile sayfa oluşturmayı sağlar.
- MIT lisanslı, ücretsiz
- React componentleri ile çalışır
- JSON output, istediğin yerde sakla
- Tamamen özelleştirilebilir

## 📦 Kurulum

```bash
npm install @puckeditor/core
```

## 🧱 Block Tanımları

### 1. HeroBlock
```typescript
// components/puck/blocks/HeroBlock.tsx
import { ComponentConfig } from "@puckeditor/core";

export type HeroBlockProps = {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
  backgroundOverlay: boolean;
  overlayOpacity: number;
  textAlign: "left" | "center" | "right";
  minHeight: string;
};

export const HeroBlock: ComponentConfig<HeroBlockProps> = {
  label: "Hero Section",
  fields: {
    title: {
      type: "text",
      label: "Başlık",
    },
    subtitle: {
      type: "textarea",
      label: "Alt Başlık",
    },
    buttonText: {
      type: "text",
      label: "Buton Metni",
    },
    buttonLink: {
      type: "text",
      label: "Buton Linki",
    },
    backgroundImage: {
      type: "text", // veya custom image picker
      label: "Arka Plan Görseli",
    },
    backgroundOverlay: {
      type: "radio",
      label: "Overlay",
      options: [
        { label: "Açık", value: true },
        { label: "Kapalı", value: false },
      ],
    },
    overlayOpacity: {
      type: "number",
      label: "Overlay Opaklığı",
      min: 0,
      max: 100,
    },
    textAlign: {
      type: "radio",
      label: "Metin Hizalama",
      options: [
        { label: "Sol", value: "left" },
        { label: "Orta", value: "center" },
        { label: "Sağ", value: "right" },
      ],
    },
    minHeight: {
      type: "select",
      label: "Minimum Yükseklik",
      options: [
        { label: "Küçük (300px)", value: "300px" },
        { label: "Orta (500px)", value: "500px" },
        { label: "Büyük (700px)", value: "700px" },
        { label: "Tam Ekran", value: "100vh" },
      ],
    },
  },
  defaultProps: {
    title: "Profesyonel Spor Fileleri",
    subtitle: "Tüm sahaların vazgeçilmezi",
    buttonText: "Ürünlere Git",
    buttonLink: "/urunler",
    backgroundImage: "",
    backgroundOverlay: true,
    overlayOpacity: 50,
    textAlign: "center",
    minHeight: "500px",
  },
  render: ({ title, subtitle, buttonText, buttonLink, backgroundImage, backgroundOverlay, overlayOpacity, textAlign, minHeight }) => (
    <section
      className="relative flex items-center justify-center"
      style={{
        minHeight,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {backgroundOverlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity / 100 }}
        />
      )}
      <div className={`relative z-10 container mx-auto px-4 text-${textAlign}`}>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          {title}
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
        {buttonText && (
          <a
            href={buttonLink}
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            {buttonText}
          </a>
        )}
      </div>
    </section>
  ),
};
```

### 2. ProductGridBlock
```typescript
// components/puck/blocks/ProductGridBlock.tsx
export type ProductGridBlockProps = {
  title: string;
  categorySlug: string;
  limit: number;
  columns: 2 | 3 | 4;
  showPrice: boolean;
  showButton: boolean;
};

export const ProductGridBlock: ComponentConfig<ProductGridBlockProps> = {
  label: "Ürün Grid",
  fields: {
    title: {
      type: "text",
      label: "Başlık",
    },
    categorySlug: {
      type: "text",
      label: "Kategori Slug (boş = tüm ürünler)",
    },
    limit: {
      type: "number",
      label: "Ürün Sayısı",
      min: 1,
      max: 20,
    },
    columns: {
      type: "select",
      label: "Sütun Sayısı",
      options: [
        { label: "2 Sütun", value: 2 },
        { label: "3 Sütun", value: 3 },
        { label: "4 Sütun", value: 4 },
      ],
    },
    showPrice: {
      type: "radio",
      label: "Fiyat Göster",
      options: [
        { label: "Evet", value: true },
        { label: "Hayır", value: false },
      ],
    },
    showButton: {
      type: "radio",
      label: "Detay Butonu",
      options: [
        { label: "Evet", value: true },
        { label: "Hayır", value: false },
      ],
    },
  },
  defaultProps: {
    title: "Ürünlerimiz",
    categorySlug: "",
    limit: 8,
    columns: 4,
    showPrice: true,
    showButton: true,
  },
  render: (props) => <ProductGridRenderer {...props} />,
};

// Ayrı bir component olarak (Server Component ile data fetch)
async function ProductGridRenderer({ title, categorySlug, limit, columns, showPrice, showButton }) {
  // Supabase'den ürünleri çek
  // Bu kısım server component veya client-side fetch olabilir
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">{title}</h2>
        <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-6`}>
          {/* Product cards */}
        </div>
      </div>
    </section>
  );
}
```

### 3. CategoryCardsBlock
```typescript
export type CategoryCardsBlockProps = {
  title: string;
  showDescription: boolean;
  layout: "grid" | "carousel";
  limit: number;
};

export const CategoryCardsBlock: ComponentConfig<CategoryCardsBlockProps> = {
  label: "Kategori Kartları",
  fields: {
    title: { type: "text", label: "Başlık" },
    showDescription: {
      type: "radio",
      label: "Açıklama Göster",
      options: [
        { label: "Evet", value: true },
        { label: "Hayır", value: false },
      ],
    },
    layout: {
      type: "select",
      label: "Layout",
      options: [
        { label: "Grid", value: "grid" },
        { label: "Carousel", value: "carousel" },
      ],
    },
    limit: { type: "number", label: "Kategori Sayısı", min: 1, max: 10 },
  },
  defaultProps: {
    title: "Kategoriler",
    showDescription: false,
    layout: "grid",
    limit: 6,
  },
  render: (props) => <CategoryCardsRenderer {...props} />,
};
```

### 4. BannerBlock
```typescript
export type BannerBlockProps = {
  imageUrl: string;
  mobileImageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  alignment: "left" | "center" | "right";
  backgroundColor: string;
  textColor: string;
  fullWidth: boolean;
};

export const BannerBlock: ComponentConfig<BannerBlockProps> = {
  label: "Banner",
  fields: {
    imageUrl: { type: "text", label: "Görsel URL" },
    mobileImageUrl: { type: "text", label: "Mobil Görsel URL" },
    title: { type: "text", label: "Başlık" },
    subtitle: { type: "text", label: "Alt Başlık" },
    buttonText: { type: "text", label: "Buton Metni" },
    buttonLink: { type: "text", label: "Buton Linki" },
    alignment: {
      type: "radio",
      label: "İçerik Hizalama",
      options: [
        { label: "Sol", value: "left" },
        { label: "Orta", value: "center" },
        { label: "Sağ", value: "right" },
      ],
    },
    backgroundColor: { type: "text", label: "Arka Plan Rengi" },
    textColor: { type: "text", label: "Metin Rengi" },
    fullWidth: {
      type: "radio",
      label: "Tam Genişlik",
      options: [
        { label: "Evet", value: true },
        { label: "Hayır", value: false },
      ],
    },
  },
  defaultProps: {
    imageUrl: "",
    mobileImageUrl: "",
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
    alignment: "center",
    backgroundColor: "#065f46",
    textColor: "#ffffff",
    fullWidth: true,
  },
  render: (props) => <BannerRenderer {...props} />,
};
```

### 5. FeatureBannersBlock (4'lü Özellik Kutuları)
```typescript
export type FeatureBannersBlockProps = {
  features: Array<{
    icon: string;
    title: string;
    description: string;
    link: string;
  }>;
};

export const FeatureBannersBlock: ComponentConfig<FeatureBannersBlockProps> = {
  label: "Özellik Bannerları",
  fields: {
    features: {
      type: "array",
      label: "Özellikler",
      arrayFields: {
        icon: { type: "text", label: "İkon (Lucide icon adı)" },
        title: { type: "text", label: "Başlık" },
        description: { type: "text", label: "Açıklama" },
        link: { type: "text", label: "Link" },
      },
    },
  },
  defaultProps: {
    features: [
      { icon: "truck", title: "Ücretsiz Kargo", description: "500₺ üzeri siparişlerde", link: "" },
      { icon: "message-circle", title: "WhatsApp İletişim", description: "Bize hemen ulaşın", link: "" },
      { icon: "percent", title: "3 Al 2 Öde", description: "Basketbol filelerinde", link: "" },
      { icon: "credit-card", title: "Taksit İmkanı", description: "Peşin fiyatına 3 taksit", link: "" },
    ],
  },
  render: ({ features }) => (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm text-center">
              {/* Icon render */}
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
};
```

### 6. TextBlock
```typescript
export type TextBlockProps = {
  content: string;
  alignment: "left" | "center" | "right" | "justify";
  maxWidth: "sm" | "md" | "lg" | "full";
};

export const TextBlock: ComponentConfig<TextBlockProps> = {
  label: "Metin Bloğu",
  fields: {
    content: { type: "textarea", label: "İçerik" },
    alignment: {
      type: "select",
      label: "Hizalama",
      options: [
        { label: "Sol", value: "left" },
        { label: "Orta", value: "center" },
        { label: "Sağ", value: "right" },
        { label: "İki Yana", value: "justify" },
      ],
    },
    maxWidth: {
      type: "select",
      label: "Maksimum Genişlik",
      options: [
        { label: "Dar", value: "sm" },
        { label: "Orta", value: "md" },
        { label: "Geniş", value: "lg" },
        { label: "Tam", value: "full" },
      ],
    },
  },
  defaultProps: {
    content: "",
    alignment: "left",
    maxWidth: "lg",
  },
  render: ({ content, alignment, maxWidth }) => {
    const widthClasses = {
      sm: "max-w-xl",
      md: "max-w-3xl",
      lg: "max-w-5xl",
      full: "max-w-full",
    };
    return (
      <section className="py-8">
        <div className={`container mx-auto px-4 ${widthClasses[maxWidth]}`}>
          <div 
            className={`prose prose-lg text-${alignment}`}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </section>
    );
  },
};
```

### 7. SpacerBlock
```typescript
export type SpacerBlockProps = {
  height: string;
  showDivider: boolean;
};

export const SpacerBlock: ComponentConfig<SpacerBlockProps> = {
  label: "Boşluk",
  fields: {
    height: {
      type: "select",
      label: "Yükseklik",
      options: [
        { label: "Küçük (20px)", value: "20px" },
        { label: "Orta (40px)", value: "40px" },
        { label: "Büyük (60px)", value: "60px" },
        { label: "Çok Büyük (100px)", value: "100px" },
      ],
    },
    showDivider: {
      type: "radio",
      label: "Ayırıcı Çizgi",
      options: [
        { label: "Evet", value: true },
        { label: "Hayır", value: false },
      ],
    },
  },
  defaultProps: {
    height: "40px",
    showDivider: false,
  },
  render: ({ height, showDivider }) => (
    <div style={{ height }} className="flex items-center">
      {showDivider && <hr className="w-full border-gray-200" />}
    </div>
  ),
};
```

## ⚙️ Puck Config

```typescript
// lib/puck/config.ts
import type { Config } from "@puckeditor/core";
import { HeroBlock } from "@/components/puck/blocks/HeroBlock";
import { ProductGridBlock } from "@/components/puck/blocks/ProductGridBlock";
import { CategoryCardsBlock } from "@/components/puck/blocks/CategoryCardsBlock";
import { BannerBlock } from "@/components/puck/blocks/BannerBlock";
import { FeatureBannersBlock } from "@/components/puck/blocks/FeatureBannersBlock";
import { TextBlock } from "@/components/puck/blocks/TextBlock";
import { SpacerBlock } from "@/components/puck/blocks/SpacerBlock";

export const puckConfig: Config = {
  components: {
    HeroBlock,
    ProductGridBlock,
    CategoryCardsBlock,
    BannerBlock,
    FeatureBannersBlock,
    TextBlock,
    SpacerBlock,
  },
  // Root component wrapping all blocks
  root: {
    fields: {
      title: { type: "text", label: "Sayfa Başlığı" },
    },
    render: ({ children }) => (
      <main className="min-h-screen">{children}</main>
    ),
  },
};
```

## 🖥️ Admin Editor Page

```typescript
// app/admin/pages/[id]/edit/page.tsx
"use client";

import { Puck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { puckConfig } from "@/lib/puck/config";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PageEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();

  // Load existing data
  const [initialData, setInitialData] = useState(null);
  
  useEffect(() => {
    loadPageData();
  }, []);

  async function loadPageData() {
    const { data } = await supabase
      .from('page_blocks')
      .select('puck_data')
      .eq('page_id', params.id)
      .single();
    
    if (data) {
      setInitialData(data.puck_data);
    }
  }

  async function handlePublish(data: any) {
    await supabase
      .from('page_blocks')
      .upsert({
        page_id: params.id,
        puck_data: data,
        is_draft: false,
        updated_at: new Date().toISOString(),
      });
    
    router.push('/admin/pages');
  }

  if (!initialData) return <div>Yükleniyor...</div>;

  return (
    <Puck
      config={puckConfig}
      data={initialData}
      onPublish={handlePublish}
    />
  );
}
```

## 🌐 Frontend Render

```typescript
// app/(shop)/[slug]/page.tsx
import { Render } from "@puckeditor/core";
import { puckConfig } from "@/lib/puck/config";
import { createClient } from "@/lib/supabase/server";

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: page } = await supabase
    .from('pages')
    .select(`
      *,
      page_blocks(puck_data)
    `)
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();

  if (!page || !page.page_blocks?.[0]) {
    return notFound();
  }

  return (
    <Render
      config={puckConfig}
      data={page.page_blocks[0].puck_data}
    />
  );
}
```
