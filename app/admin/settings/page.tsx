'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

// Sayıyı Türk formatına çevir (5000 → 5.000)
function formatNumber(value: string | number): string {
  if (!value && value !== 0) return ''
  const num = typeof value === 'string' ? value.replace(/\./g, '').replace(',', '.') : value
  const parsed = parseFloat(String(num))
  if (isNaN(parsed)) return ''
  return parsed.toLocaleString('tr-TR')
}

// Formatlanmış sayıyı ham sayıya çevir (5.000 → 5000)
function parseFormattedNumber(value: string): string {
  if (!value) return ''
  // Türk formatından çıkar: noktaları kaldır, virgülü noktaya çevir
  return value.replace(/\./g, '').replace(',', '.')
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/admin/settings')
        if (!response.ok) throw new Error('Failed to fetch settings')

        const data = await response.json()

        if (data && Array.isArray(data)) {
          const settingsMap: Record<string, string> = {}
          data.forEach((item: { key: string; value: string }) => {
            try {
              settingsMap[item.key] = JSON.parse(item.value)
            } catch {
              settingsMap[item.key] = item.value
            }
          })
          setSettings(settingsMap)
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
        toast.error('Ayarlar yüklenirken hata oluştu')
      }
    }

    fetchSettings()
  }, [])

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  // Para birimi input'ları için özel handler
  const handleCurrencyChange = (key: string, value: string) => {
    // Sadece rakam, nokta ve virgüle izin ver
    const cleaned = value.replace(/[^\d.,]/g, '')
    const rawValue = parseFormattedNumber(cleaned)
    setSettings((prev) => ({ ...prev, [key]: rawValue }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ayarlar kaydedilemedi')
      }

      toast.success('Ayarlar kaydedildi')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error(error instanceof Error ? error.message : 'Ayarlar kaydedilirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ayarlar</h1>
          <p className="text-gray-600">Site ayarlarını yönetin</p>
        </div>
        <Button
          onClick={handleSave}
          className="bg-[#BB1624] hover:bg-[#8F101B]"
          disabled={loading}
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Genel</TabsTrigger>
          <TabsTrigger value="contact">İletişim</TabsTrigger>
          <TabsTrigger value="social">Sosyal Medya</TabsTrigger>
          <TabsTrigger value="shipping">Kargo</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Genel Ayarlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site_name">Site Adı</Label>
                <Input
                  id="site_name"
                  value={settings.site_name || ''}
                  onChange={(e) => handleChange('site_name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="site_description">Site Açıklaması</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description || ''}
                  onChange={(e) => handleChange('site_description', e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  value={settings.logo_url || ''}
                  onChange={(e) => handleChange('logo_url', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="favicon_url">Favicon URL</Label>
                <Input
                  id="favicon_url"
                  value={settings.favicon_url || ''}
                  onChange={(e) => handleChange('favicon_url', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={settings.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp Numarası</Label>
                <Input
                  id="whatsapp"
                  value={settings.whatsapp || ''}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  placeholder="905XXXXXXXXX"
                />
              </div>
              <div>
                <Label htmlFor="address">Adres</Label>
                <Textarea
                  id="address"
                  value={settings.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sosyal Medya Linkleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={settings.facebook || ''}
                  onChange={(e) => handleChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={settings.instagram || ''}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={settings.twitter || ''}
                  onChange={(e) => handleChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div>
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  value={settings.youtube || ''}
                  onChange={(e) => handleChange('youtube', e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Kargo Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="free_shipping_threshold">Ücretsiz Kargo Limiti (TL)</Label>
                <Input
                  id="free_shipping_threshold"
                  type="text"
                  inputMode="decimal"
                  value={formatNumber(settings.free_shipping_threshold || '')}
                  onChange={(e) => handleCurrencyChange('free_shipping_threshold', e.target.value)}
                  placeholder="750"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Bu tutarın üzerindeki siparişlerde kargo ücretsiz olacaktır.
                </p>
              </div>
              <div>
                <Label htmlFor="default_shipping_cost">Varsayılan Kargo Ücreti (TL)</Label>
                <Input
                  id="default_shipping_cost"
                  type="text"
                  inputMode="decimal"
                  value={formatNumber(settings.default_shipping_cost || '')}
                  onChange={(e) => handleCurrencyChange('default_shipping_cost', e.target.value)}
                  placeholder="29,90"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
