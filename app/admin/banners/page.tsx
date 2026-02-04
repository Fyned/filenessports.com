import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Edit, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { Banner } from '@/types/database'
import Image from 'next/image'
import { DeleteBannerButton } from './DeleteBannerButton'

export default async function AdminBannersPage() {
  const supabase = await createClient()

  const { data: banners } = await supabase
    .from('banners')
    .select('*')
    .order('position')
    .order('sort_order')

  const positionLabels: Record<string, string> = {
    hero: 'Hero Slider',
    sidebar: 'Sidebar',
    footer: 'Footer',
    popup: 'Popup',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bannerlar</h1>
          <p className="text-gray-600">Banner ve reklam alanlarını yönetin</p>
        </div>
        <Link href="/admin/banners/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Banner
          </Button>
        </Link>
      </div>

      {/* Banners Grid */}
      {banners && banners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner: Banner) => (
            <Card key={banner.id} className="overflow-hidden">
              <div className="relative aspect-[2/1] bg-gray-100">
                {banner.image_url ? (
                  <Image
                    src={banner.image_url}
                    alt={banner.title || 'Banner'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                {!banner.is_active && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white text-gray-900 px-3 py-1 rounded font-medium">
                      Pasif
                    </span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{banner.title || 'Başlıksız'}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {positionLabels[banner.position] || banner.position}
                    </p>
                    {banner.starts_at && banner.ends_at && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(banner.starts_at).toLocaleDateString('tr-TR')} -{' '}
                        {new Date(banner.ends_at).toLocaleDateString('tr-TR')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={`/admin/banners/${banner.id}`}>
                      <Button variant="ghost" size="icon" title="Düzenle">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <DeleteBannerButton
                      bannerId={banner.id}
                      bannerTitle={banner.title || 'Başlıksız'}
                      imageUrl={banner.image_url}
                      mobileImageUrl={banner.mobile_image_url}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">Henüz banner eklenmemiş</p>
            <Link href="/admin/banners/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                İlk Banner&apos;ı Ekle
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
