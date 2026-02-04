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
import { ImageUpload } from '@/components/file-upload/image-upload'

const positions = [
  { value: 'hero', label: 'Hero Slider' },
  { value: 'sidebar', label: 'Sidebar' },
  { value: 'footer', label: 'Footer' },
  { value: 'popup', label: 'Popup' },
]

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditBannerPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    mobile_image_url: '',
    link: '',
    button_text: '',
    position: 'hero',
    sort_order: 0,
    is_active: true,
    starts_at: '',
    ends_at: '',
    background_color: '',
    text_color: '',
  })

  useEffect(() => {
    async function fetchBanner() {
      setLoading(true)

      const { data: banner, error } = await supabase
        .from('banners')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !banner) {
        toast.error('Banner bulunamadı')
        router.push('/admin/banners')
        return
      }

      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        image_url: banner.image_url || '',
        mobile_image_url: banner.mobile_image_url || '',
        link: banner.link || '',
        button_text: banner.button_text || '',
        position: banner.position || 'hero',
        sort_order: banner.sort_order || 0,
        is_active: banner.is_active ?? true,
        starts_at: banner.starts_at ? new Date(banner.starts_at).toISOString().slice(0, 16) : '',
        ends_at: banner.ends_at ? new Date(banner.ends_at).toISOString().slice(0, 16) : '',
        background_color: banner.background_color || '',
        text_color: banner.text_color || '',
      })

      setLoading(false)
    }

    fetchBanner()
  }, [id, supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.image_url) {
      toast.error('Lütfen bir görsel yükleyin')
      return
    }

    setSaving(true)

    try {
      const { error } = await supabase
        .from('banners')
        .update({
          title: formData.title || null,
          subtitle: formData.subtitle || null,
          image_url: formData.image_url,
          mobile_image_url: formData.mobile_image_url || null,
          link: formData.link || null,
          button_text: formData.button_text || null,
          position: formData.position,
          sort_order: formData.sort_order,
          is_active: formData.is_active,
          starts_at: formData.starts_at || null,
          ends_at: formData.ends_at || null,
          background_color: formData.background_color || null,
          text_color: formData.text_color || null,
        })
        .eq('id', id)

      if (error) throw error

      toast.success('Banner başarıyla güncellendi')
      router.push('/admin/banners')
    } catch (error) {
      console.error('Error updating banner:', error)
      toast.error('Banner güncellenirken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)

    try {
      // Delete from storage if image exists
      if (formData.image_url) {
        const path = formData.image_url.split('/banners/')[1]
        if (path) {
          await supabase.storage.from('banners').remove([path])
        }
      }
      if (formData.mobile_image_url) {
        const path = formData.mobile_image_url.split('/banners/')[1]
        if (path) {
          await supabase.storage.from('banners').remove([path])
        }
      }

      const { error } = await supabase.from('banners').delete().eq('id', id)

      if (error) throw error

      toast.success('Banner başarıyla silindi')
      router.push('/admin/banners')
    } catch (error) {
      console.error('Error deleting banner:', error)
      toast.error('Banner silinirken hata oluştu')
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
          <Link href="/admin/banners">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Banner Düzenle</h1>
            <p className="text-gray-600">{formData.title || 'Başlıksız Banner'}</p>
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
              <AlertDialogTitle>Banner&apos;ı Sil</AlertDialogTitle>
              <AlertDialogDescription>
                Bu banner&apos;ı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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
                  <Label htmlFor="title">Başlık</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Banner başlığı"
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Alt Başlık</Label>
                  <Textarea
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Banner alt başlığı veya açıklaması"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="link">Link URL</Label>
                    <Input
                      id="link"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="button_text">Buton Metni</Label>
                    <Input
                      id="button_text"
                      value={formData.button_text}
                      onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                      placeholder="Daha Fazla"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Görseller</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Ana Görsel *</Label>
                  <ImageUpload
                    bucket="banners"
                    value={formData.image_url}
                    onChange={(url) => setFormData({ ...formData, image_url: url || '' })}
                  />
                </div>
                <div>
                  <Label>Mobil Görsel (Opsiyonel)</Label>
                  <ImageUpload
                    bucket="banners"
                    value={formData.mobile_image_url}
                    onChange={(url) => setFormData({ ...formData, mobile_image_url: url || '' })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mobil cihazlarda farklı bir görsel göstermek için yükleyin
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Styling */}
            <Card>
              <CardHeader>
                <CardTitle>Stil Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="background_color">Arka Plan Rengi</Label>
                    <div className="flex gap-2">
                      <Input
                        id="background_color"
                        value={formData.background_color}
                        onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                        placeholder="#000000"
                      />
                      <input
                        type="color"
                        value={formData.background_color || '#000000'}
                        onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                        className="w-10 h-10 rounded border cursor-pointer"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="text_color">Metin Rengi</Label>
                    <div className="flex gap-2">
                      <Input
                        id="text_color"
                        value={formData.text_color}
                        onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                        placeholder="#FFFFFF"
                      />
                      <input
                        type="color"
                        value={formData.text_color || '#FFFFFF'}
                        onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                        className="w-10 h-10 rounded border cursor-pointer"
                      />
                    </div>
                  </div>
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
                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Güncelle
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Position */}
            <Card>
              <CardHeader>
                <CardTitle>Konum</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="position">Banner Konumu</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => setFormData({ ...formData, position: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((pos) => (
                        <SelectItem key={pos.value} value={pos.value}>
                          {pos.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sort_order">Sıralama</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    min="0"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Düşük sayılar önce görünür
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Zamanlama</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="starts_at">Başlangıç Tarihi</Label>
                  <Input
                    id="starts_at"
                    type="datetime-local"
                    value={formData.starts_at}
                    onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="ends_at">Bitiş Tarihi</Label>
                  <Input
                    id="ends_at"
                    type="datetime-local"
                    value={formData.ends_at}
                    onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Boş bırakılırsa banner süresiz olarak gösterilir
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
