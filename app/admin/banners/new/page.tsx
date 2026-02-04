'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { toast } from 'sonner'
import { ArrowLeft, Save, Loader2, Monitor, Smartphone, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ImageUpload } from '@/components/file-upload/image-upload'

const positions = [
  { value: 'hero', label: 'Hero Slider', description: 'Ana sayfa üst kısım, tam genişlik slider', width: 1920, height: 600 },
  { value: 'sidebar', label: 'Sidebar', description: 'Yan menü alanı, dikey banner', width: 300, height: 600 },
  { value: 'footer', label: 'Footer', description: 'Sayfa altı, geniş yatay banner', width: 1920, height: 200 },
  { value: 'popup', label: 'Popup', description: 'Açılır pencere, merkezi banner', width: 600, height: 400 },
]

// Banner Konum Önizleme Bileşeni
function BannerPositionPreview({
  position,
  imageUrl,
  title,
  subtitle,
  buttonText,
  backgroundColor,
  textColor
}: {
  position: string
  imageUrl?: string
  title?: string
  subtitle?: string
  buttonText?: string
  backgroundColor?: string
  textColor?: string
}) {
  const positionConfig = positions.find(p => p.value === position)

  const renderHeroPreview = () => (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
      {/* Mini Site Layout */}
      <div className="bg-white border-b p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-16 h-4 bg-[#1C2840] rounded text-[6px] text-white flex items-center justify-center font-bold">FILENES</div>
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-2 bg-gray-200 rounded"></div>
          <div className="w-8 h-2 bg-gray-200 rounded"></div>
          <div className="w-8 h-2 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Hero Banner Area */}
      <div
        className="relative h-32 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: backgroundColor || '#f3f4f6' }}
      >
        {imageUrl ? (
          <>
            <Image src={imageUrl} alt="Banner" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 text-center px-4">
              {title && <h3 className="text-xs font-bold text-white drop-shadow-lg">{title}</h3>}
              {subtitle && <p className="text-[8px] text-white/90 mt-0.5">{subtitle}</p>}
              {buttonText && (
                <button className="mt-1 px-2 py-0.5 bg-[#BB1624] text-white text-[6px] rounded">
                  {buttonText}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <ImageIcon className="w-8 h-8" />
            <span className="text-[8px] mt-1">Banner görseli buraya gelecek</span>
          </div>
        )}

        {/* Slider dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
        </div>
      </div>

      {/* Content placeholder */}
      <div className="p-3 space-y-2">
        <div className="flex gap-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex-1 bg-gray-100 rounded p-2">
              <div className="w-full h-8 bg-gray-200 rounded mb-1"></div>
              <div className="w-3/4 h-1.5 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSidebarPreview = () => (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
      {/* Mini Site Layout */}
      <div className="bg-white border-b p-2 flex items-center justify-between">
        <div className="w-16 h-4 bg-[#1C2840] rounded text-[6px] text-white flex items-center justify-center font-bold">FILENES</div>
        <div className="flex gap-2">
          <div className="w-8 h-2 bg-gray-200 rounded"></div>
          <div className="w-8 h-2 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div className="flex p-2 gap-2">
        {/* Sidebar with banner */}
        <div
          className="w-16 rounded overflow-hidden flex-shrink-0"
          style={{ backgroundColor: backgroundColor || '#f3f4f6' }}
        >
          {imageUrl ? (
            <div className="relative h-32">
              <Image src={imageUrl} alt="Banner" fill className="object-cover" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-1 bg-black/20">
                {title && <span className="text-[6px] font-bold text-white text-center">{title}</span>}
                {buttonText && (
                  <button className="mt-1 px-1 py-0.5 bg-[#BB1624] text-white text-[5px] rounded">
                    {buttonText}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-32 flex flex-col items-center justify-center text-gray-400 bg-gray-200">
              <ImageIcon className="w-4 h-4" />
              <span className="text-[5px] mt-0.5">Sidebar</span>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-2">
          <div className="grid grid-cols-3 gap-1">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-gray-200 rounded p-1">
                <div className="w-full h-6 bg-gray-300 rounded mb-0.5"></div>
                <div className="w-3/4 h-1 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderFooterPreview = () => (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
      {/* Mini header */}
      <div className="bg-white border-b p-2 flex items-center justify-between">
        <div className="w-16 h-4 bg-[#1C2840] rounded text-[6px] text-white flex items-center justify-center font-bold">FILENES</div>
        <div className="flex gap-2">
          <div className="w-8 h-2 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Content placeholder */}
      <div className="p-2 space-y-2">
        <div className="flex gap-1">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex-1 bg-gray-200 rounded p-1.5">
              <div className="w-full h-6 bg-gray-300 rounded mb-0.5"></div>
              <div className="w-3/4 h-1 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Banner Area */}
      <div
        className="relative h-12 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: backgroundColor || '#1C2840' }}
      >
        {imageUrl ? (
          <>
            <Image src={imageUrl} alt="Banner" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative z-10 text-center">
              {title && <span className="text-[8px] font-bold text-white">{title}</span>}
              {buttonText && (
                <button className="ml-2 px-2 py-0.5 bg-[#BB1624] text-white text-[6px] rounded">
                  {buttonText}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-gray-400">
            <ImageIcon className="w-4 h-4" />
            <span className="text-[8px]">Footer banner buraya gelecek</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-[#1C2840] p-2">
        <div className="flex justify-center gap-2">
          <div className="w-8 h-1.5 bg-gray-600 rounded"></div>
          <div className="w-8 h-1.5 bg-gray-600 rounded"></div>
          <div className="w-8 h-1.5 bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>
  )

  const renderPopupPreview = () => (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
      {/* Dimmed background site */}
      <div className="opacity-30">
        <div className="bg-white border-b p-2">
          <div className="w-16 h-4 bg-[#1C2840] rounded"></div>
        </div>
        <div className="p-2 space-y-2">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="flex gap-1">
            {[1,2,3].map(i => (
              <div key={i} className="flex-1 h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Popup overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
        <div
          className="relative w-32 h-24 rounded-lg overflow-hidden shadow-2xl"
          style={{ backgroundColor: backgroundColor || '#ffffff' }}
        >
          {imageUrl ? (
            <>
              <Image src={imageUrl} alt="Banner" fill className="object-cover" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-black/20">
                {title && <span className="text-[8px] font-bold text-white text-center">{title}</span>}
                {subtitle && <span className="text-[6px] text-white/80 text-center">{subtitle}</span>}
                {buttonText && (
                  <button className="mt-1 px-2 py-0.5 bg-[#BB1624] text-white text-[6px] rounded">
                    {buttonText}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <ImageIcon className="w-6 h-6" />
              <span className="text-[6px] mt-0.5">Popup banner</span>
            </div>
          )}
          {/* Close button */}
          <div className="absolute top-1 right-1 w-3 h-3 bg-white/80 rounded-full flex items-center justify-center text-[6px]">✕</div>
        </div>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Monitor className="w-4 h-4" />
          Konum Önizleme
        </CardTitle>
        <p className="text-xs text-gray-500">{positionConfig?.description}</p>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-2 bg-gray-50">
          {position === 'hero' && renderHeroPreview()}
          {position === 'sidebar' && renderSidebarPreview()}
          {position === 'footer' && renderFooterPreview()}
          {position === 'popup' && renderPopupPreview()}
        </div>
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-4">
          <span>Önerilen boyut: <strong>{positionConfig?.width} x {positionConfig?.height}px</strong></span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function NewBannerPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.image_url) {
      toast.error('Lütfen bir görsel yükleyin')
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Banner oluşturulamadı')
      }

      toast.success('Banner başarıyla oluşturuldu')
      router.push('/admin/banners')
    } catch (error) {
      console.error('Error creating banner:', error)
      toast.error(error instanceof Error ? error.message : 'Banner oluşturulurken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/banners">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Yeni Banner</h1>
          <p className="text-gray-600">Yeni bir banner ekleyin</p>
        </div>
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
                    recommendedWidth={positions.find(p => p.value === formData.position)?.width}
                    recommendedHeight={positions.find(p => p.value === formData.position)?.height}
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
                      Kaydet
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

            {/* Position Preview - Konum bloğunun hemen altında */}
            <BannerPositionPreview
              position={formData.position}
              imageUrl={formData.image_url}
              title={formData.title}
              subtitle={formData.subtitle}
              buttonText={formData.button_text}
              backgroundColor={formData.background_color}
              textColor={formData.text_color}
            />

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
