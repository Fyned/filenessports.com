'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable, DataTableColumnHeader } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Image as ImageIcon, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ProductImage {
  id: string
  url: string
  is_primary: boolean
}

interface Category {
  id: string
  name: string
}

interface ProductFromDB {
  id: string
  name: string
  sku: string | null
  price: number
  compare_price: number | null
  stock: number
  low_stock_threshold: number | null
  is_active: boolean
  category: Category[] | Category | null
  images: ProductImage[]
}

interface Product {
  id: string
  name: string
  sku: string | null
  price: number
  compare_price: number | null
  stock: number
  low_stock_threshold: number | null
  is_active: boolean
  category: Category | null
  images: ProductImage[]
}

interface ProductsTableProps {
  products: ProductFromDB[]
  categories: { id: string; name: string }[]
}

export function ProductsTable({ products: rawProducts, categories }: ProductsTableProps) {
  const router = useRouter()
  const supabase = createClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Normalize products - handle both array and single object category
  const products: Product[] = rawProducts.map((product) => ({
    ...product,
    category: Array.isArray(product.category) ? product.category[0] || null : product.category,
  }))

  const handleDelete = async () => {
    if (!productToDelete) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete.id)

      if (error) throw error

      toast.success('Ürün başarıyla silindi')
      router.refresh()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Ürün silinirken hata oluştu')
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ürün" />
      ),
      cell: ({ row }) => {
        const product = row.original
        const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0]

        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-500">{product.sku || '-'}</p>
            </div>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        const name = row.getValue(id) as string
        const sku = row.original.sku || ''
        const searchValue = value.toLowerCase()
        return name.toLowerCase().includes(searchValue) || sku.toLowerCase().includes(searchValue)
      },
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kategori" />
      ),
      cell: ({ row }) => row.original.category?.name || '-',
      filterFn: (row, id, value) => {
        if (!value || value.length === 0) return true
        return value.includes(row.original.category?.id)
      },
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fiyat" />
      ),
      cell: ({ row }) => {
        const product = row.original
        return (
          <div>
            <p className="font-medium">{product.price.toLocaleString('tr-TR')} TL</p>
            {product.compare_price && product.compare_price > product.price && (
              <p className="text-sm text-gray-400 line-through">
                {product.compare_price.toLocaleString('tr-TR')} TL
              </p>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'stock',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stok" />
      ),
      cell: ({ row }) => {
        const product = row.original
        return (
          <span
            className={`font-medium ${
              product.stock === 0
                ? 'text-red-600'
                : product.stock <= (product.low_stock_threshold || 5)
                ? 'text-yellow-600'
                : 'text-green-600'
            }`}
          >
            {product.stock}
          </span>
        )
      },
      filterFn: (row, id, value) => {
        if (!value || value.length === 0) return true
        const stock = row.original.stock
        const threshold = row.original.low_stock_threshold || 5
        if (value.includes('out') && stock === 0) return true
        if (value.includes('low') && stock > 0 && stock <= threshold) return true
        if (value.includes('in') && stock > threshold) return true
        return false
      },
    },
    {
      accessorKey: 'is_active',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Durum" />
      ),
      cell: ({ row }) => {
        const isActive = row.original.is_active
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {isActive ? 'Aktif' : 'Pasif'}
          </span>
        )
      },
      filterFn: (row, id, value) => {
        if (!value || value.length === 0) return true
        const isActive = row.original.is_active
        if (value.includes('active') && isActive) return true
        if (value.includes('inactive') && !isActive) return true
        return false
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const product = row.original

        return (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/products/${product.id}`} className="flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Düzenle
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => {
                    setProductToDelete(product)
                    setDeleteDialogOpen(true)
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Sil
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const filterOptions = [
    {
      column: 'category',
      title: 'Kategori',
      options: categories.map((cat) => ({
        label: cat.name,
        value: cat.id,
      })),
    },
    {
      column: 'stock',
      title: 'Stok Durumu',
      options: [
        { label: 'Stokta', value: 'in' },
        { label: 'Düşük Stok', value: 'low' },
        { label: 'Tükendi', value: 'out' },
      ],
    },
    {
      column: 'is_active',
      title: 'Durum',
      options: [
        { label: 'Aktif', value: 'active' },
        { label: 'Pasif', value: 'inactive' },
      ],
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={products}
        searchKey="name"
        searchPlaceholder="Ürün ara (isim veya SKU)..."
        filterOptions={filterOptions}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ürünü Sil</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{productToDelete?.name}&quot; ürününü silmek istediğinize emin misiniz?
              Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Siliniyor...' : 'Sil'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
