import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { ProductsTable } from './ProductsTable'

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select(`
        id,
        name,
        sku,
        price,
        compare_price,
        stock,
        low_stock_threshold,
        is_active,
        category:categories(id, name),
        images:product_images(id, url, is_primary)
      `)
      .order('created_at', { ascending: false }),
    supabase
      .from('categories')
      .select('id, name')
      .order('name'),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ürünler</h1>
          <p className="text-gray-600">Ürünleri yönetin ve düzenleyin</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-[#BB1624] hover:bg-[#8F101B]">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Ürün
          </Button>
        </Link>
      </div>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Tüm Ürünler ({products?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <ProductsTable
            products={(products || []) as any}
            categories={categories || []}
          />
        </CardContent>
      </Card>
    </div>
  )
}
