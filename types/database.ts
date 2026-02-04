export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  sort_order: number
  is_active: boolean
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  price: number
  compare_price: number | null
  cost_price: number | null
  sku: string | null
  barcode: string | null
  stock: number
  low_stock_threshold: number
  category_id: string | null
  brand: string | null
  weight: number | null
  dimensions: {
    width?: number
    height?: number
    depth?: number
  } | null
  is_active: boolean
  is_featured: boolean
  is_new: boolean
  free_shipping: boolean
  meta_title: string | null
  meta_description: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
  category?: Category
  images?: ProductImage[]
  variants?: ProductVariant[]
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt: string | null
  sort_order: number
  is_primary: boolean
  created_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  sku: string | null
  price: number | null
  stock: number
  attributes: Record<string, string> | null
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Banner {
  id: string
  title: string | null
  subtitle: string | null
  image_url: string
  mobile_image_url: string | null
  link: string | null
  button_text: string | null
  position: 'hero' | 'sidebar' | 'footer' | 'popup'
  sort_order: number
  is_active: boolean
  starts_at: string | null
  ends_at: string | null
  background_color: string | null
  text_color: string | null
  created_at: string
  updated_at: string
}

export interface Page {
  id: string
  title: string
  slug: string
  template: string
  meta_title: string | null
  meta_description: string | null
  is_published: boolean
  is_homepage: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  page_blocks?: PageBlock[]
}

export interface PageBlock {
  id: string
  page_id: string
  puck_data: Record<string, unknown>
  version: number
  is_draft: boolean
  created_at: string
  updated_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: unknown
  type: 'text' | 'number' | 'boolean' | 'json' | 'image'
  group_name: string
  label: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  user_id: string | null
  first_name: string | null
  last_name: string | null
  email: string
  phone: string | null
  company_name: string | null
  tax_number: string | null
  default_address_id: string | null
  notes: string | null
  is_wholesale: boolean
  created_at: string
  updated_at: string
}

export interface CustomerAddress {
  id: string
  customer_id: string
  title: string | null
  first_name: string | null
  last_name: string | null
  phone: string | null
  address_line1: string
  address_line2: string | null
  city: string
  district: string | null
  postal_code: string | null
  country: string
  is_default: boolean
  created_at: string
}

export interface Order {
  id: string
  order_number: string
  customer_id: string | null
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  subtotal: number
  shipping_cost: number
  tax_amount: number
  discount_amount: number
  total: number
  currency: string
  shipping_address: CustomerAddress | null
  billing_address: CustomerAddress | null
  shipping_method: string | null
  tracking_number: string | null
  payment_method: string | null
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  notes: string | null
  admin_notes: string | null
  created_at: string
  updated_at: string
  customer?: Customer
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  variant_id: string | null
  product_name: string
  variant_name: string | null
  sku: string | null
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  image_url: string | null
  author: string | null
  category: string | null
  tags: string[] | null
  is_published: boolean
  published_at: string | null
  view_count: number
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}
