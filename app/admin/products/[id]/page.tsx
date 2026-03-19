'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Category, ProductImage } from '@/types/database'
import { MultiImageUpload } from '@/components/file-upload/multi-image-upload'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditProductPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    price: '',
    compare_price: '',
    sku: '',
    stock: '0',
    category_id: '',
    is_active: true,
    is_featured: false,
    is_new: false,
    free_shipping: false,
    is_m2_pricing: false,
    price_per_m2: '',
    min_width_cm: '10',
    max_width_cm: '2000',
    min_height_cm: '10',
    max_height_cm: '2000',
    meta_title: '',
    meta_description: '',
  })

  const [productImages, setProductImages] = useState<{ id: string; url: string; isPrimary: boolean }[]>([])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      const [productResult, categoriesResult, imagesResult] = await Promise.all([
        supabase.from('products').select('*').eq('id', id).single(),
        supabase.from('categories').select('*').eq('is_active', true).order('name'),
        supabase.from('product_images').select('*').eq('product_id', id).order('sort_order'),
      ])

      if (productResult.error) {
        toast.error('Ürün bulunamadı')
        router.push('/admin/products')
        return
      }

      const product = productResult.data
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        short_description: product.short_description || '',
        price: product.price?.toString() || '',
        compare_price: product.compare_price?.toString() || '',
        sku: product.sku || '',
        stock: product.stock?.toString() || '0',
        category_id: product.category_id || '',
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
        is_new: product.is_new ?? false,
        free_shipping: product.free_shipping ?? false,
        is_m2_pricing: product.is_m2_pricing ?? false,
        price_per_m2: product.price_per_m2?.toString() || '',
        min_width_cm: product.min_width_cm?.toString() || '10',
        max_width_cm: product.max_width_cm?.toString() || '2000',
        min_height_cm: product.min_height_cm?.toString() || '10',
        max_height_cm: product.max_height_cm?.toString() || '2000',
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
      })

      // Convert product images to MultiImageUpload format
      if (imagesResult.data) {
        setProductImages(
          (imagesResult.data as ProductImage[]).map((img) => ({
            id: img.id,
            url: img.url,
            isPrimary: img.is_primary,
          }))
        )
      }

      setCategories((categoriesResult.data as Category[]) || [])
      setLoading(false)
    }

    fetchData()
  }, [id, supabase, router])

  useEffect(() => {
    if (formData.is_m2_pricing && formData.price_per_m2) {
      const minM2 = (parseInt(formData.min_width_cm) || 10) / 100 * (parseInt(formData.min_height_cm) || 10) / 100
      const autoPrice = Math.round(minM2 * parseFloat(formData.price_per_m2) * 100) / 100
      if (!isNaN(autoPrice) && autoPrice > 0) {
        setFormData(prev => ({ ...prev, price: autoPrice.toString() }))
      }
    }
  }, [formData.is_m2_pricing, formData.price_per_m2, formData.min_width_cm, formData.min_height_cm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Auto-calculate price for m² products
      let finalPrice = parseFloat(formData.price)
      if (formData.is_m2_pricing && formData.price_per_m2) {
        const minM2 = (parseInt(formData.min_width_cm) || 10) / 100 * (parseInt(formData.min_height_cm) || 10) / 100
        finalPrice = Math.round(minM2 * parseFloat(formData.price_per_m2) * 100) / 100
      }

      // Update product
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          short_description: formData.short_description || null,
          price: finalPrice,
          compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
          sku: formData.sku || null,
          stock: parseInt(formData.stock),
          category_id: formData.category_id || null,
          is_active: formData.is_active,
          is_featured: formData.is_featured,
          is_new: formData.is_new,
          free_shipping: formData.free_shipping,
          is_m2_pricing: formData.is_m2_pricing,
          price_per_m2: formData.price_per_m2 ? parseFloat(formData.price_per_m2) : null,
          min_width_cm: parseInt(formData.min_width_cm) || 10,
          max_width_cm: parseInt(formData.max_width_cm) || 2000,
          min_height_cm: parseInt(formData.min_height_cm) || 10,
          max_height_cm: parseInt(formData.max_height_cm) || 2000,
          meta_title: formData.meta_title || null,
          meta_description: formData.meta_description || null,
        })
        .eq('id', id)

      if (error) throw error

      // Delete existing images and insert new ones
      await supabase.from('product_images').delete().eq('product_id', id)

      if (productImages.length > 0) {
        const imagesToInsert = productImages.map((img, index) => ({
          product_id: id,
          url: img.url,
          is_primary: img.isPrimary,
          sort_order: index,
        }))

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imagesToInsert)

        if (imagesError) {
          console.error('Error saving images:', imagesError)
          toast.error('Görseller kaydedilirken hata oluştu')
        }
      }

      toast.success('Ürün başarıyla güncellendi')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Ürün güncellenirken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)

    try {
      const { error } = await supabase.from('products').delete().eq('id', id)

      if (error) throw error

      toast.success('Ürün başarıyla silindi')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Ürün silinirken hata oluştu')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Ürün Düzenle</h1>
            <p className="text-gray-600">{formData.name}</p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={deleting}>
              <Trash2 className="w-4 h-4 mr-2" />
              Sil
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ürünü Sil</AlertDialogTitle>
              <AlertDialogDescription>
                &quot;{formData.name}&quot; ürününü silmek istediğinize emin misiniz?
                Bu işlem geri alınamaz.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleting ? 'Siliniyor...' : 'Sil'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Temel Bilgiler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Ürün Adı *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="short_description">Kısa Açıklama</Label>
                  <Textarea
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) =>
                      setFormData({ ...formData, short_description: e.target.value })
                    }
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Detaylı Açıklama</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Fiyatlandırma</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">
                      {formData.is_m2_pricing ? 'Başlangıç Fiyatı (TL) — otomatik' : 'Fiyat (TL) *'}
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      disabled={formData.is_m2_pricing}
                      className={formData.is_m2_pricing ? 'bg-gray-100' : ''}
                    />
                    {formData.is_m2_pricing && (
                      <p className="text-xs text-gray-400 mt-1">Min ölçülerden otomatik hesaplanır</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="compare_price">Karşılaştırma Fiyatı (TL)</Label>
                    <Input
                      id="compare_price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.compare_price}
                      onChange={(e) =>
                        setFormData({ ...formData, compare_price: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* M² Pricing Toggle */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <Label>M² Bazlı Fiyatlandırma</Label>
                      <p className="text-xs text-gray-500">Özel ölçülü ürünler için (file, branda vb.)</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, is_m2_pricing: !formData.is_m2_pricing })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.is_m2_pricing ? 'bg-[#BB1624]' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.is_m2_pricing ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {formData.is_m2_pricing && (
                    <div className="space-y-3 bg-gray-50 rounded-lg p-3">
                      <div>
                        <Label htmlFor="price_per_m2">m² Fiyatı (TL) *</Label>
                        <Input
                          id="price_per_m2"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price_per_m2}
                          onChange={(e) => setFormData({ ...formData, price_per_m2: e.target.value })}
                          placeholder="Örn: 24.00"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="min_width_cm">Min Genişlik (cm)</Label>
                          <Input
                            id="min_width_cm"
                            type="number"
                            min="1"
                            value={formData.min_width_cm}
                            onChange={(e) => setFormData({ ...formData, min_width_cm: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="max_width_cm">Max Genişlik (cm)</Label>
                          <Input
                            id="max_width_cm"
                            type="number"
                            min="1"
                            value={formData.max_width_cm}
                            onChange={(e) => setFormData({ ...formData, max_width_cm: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="min_height_cm">Min Yükseklik (cm)</Label>
                          <Input
                            id="min_height_cm"
                            type="number"
                            min="1"
                            value={formData.min_height_cm}
                            onChange={(e) => setFormData({ ...formData, min_height_cm: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="max_height_cm">Max Yükseklik (cm)</Label>
                          <Input
                            id="max_height_cm"
                            type="number"
                            min="1"
                            value={formData.max_height_cm}
                            onChange={(e) => setFormData({ ...formData, max_height_cm: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Stok</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sku">Ürün Kodu (SKU)</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stok Adedi</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">Meta Başlık</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="meta_description">Meta Açıklama</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) =>
                      setFormData({ ...formData, meta_description: e.target.value })
                    }
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <Card>
              <CardHeader>
                <CardTitle>Yayınla</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_active: checked as boolean })
                    }
                  />
                  <Label htmlFor="is_active">Aktif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_featured: checked as boolean })
                    }
                  />
                  <Label htmlFor="is_featured">Öne Çıkan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_new"
                    checked={formData.is_new}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_new: checked as boolean })
                    }
                  />
                  <Label htmlFor="is_new">Yeni Ürün</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="free_shipping"
                    checked={formData.free_shipping}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, free_shipping: checked as boolean })
                    }
                  />
                  <Label htmlFor="free_shipping">Ücretsiz Kargo</Label>
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Kaydediliyor...' : 'Güncelle'}
                </Button>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle>Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Görseller</CardTitle>
              </CardHeader>
              <CardContent>
                <MultiImageUpload
                  value={productImages}
                  onChange={setProductImages}
                  bucket="products"
                  folder={id}
                  maxImages={10}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
