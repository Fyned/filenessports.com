import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Eye, Trash2, Home } from 'lucide-react'
import Link from 'next/link'
import { Page } from '@/types/database'

export default async function AdminPagesPage() {
  const supabase = await createClient()

  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sayfalar</h1>
          <p className="text-gray-600">Sayfalari yonetin ve duzenleyin</p>
        </div>
        <Link href="/admin/pages/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Sayfa
          </Button>
        </Link>
      </div>

      {/* Pages List */}
      <Card>
        <CardHeader>
          <CardTitle>Tum Sayfalar</CardTitle>
        </CardHeader>
        <CardContent>
          {pages && pages.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-gray-600">Baslik</th>
                    <th className="pb-3 font-medium text-gray-600">Slug</th>
                    <th className="pb-3 font-medium text-gray-600">Durum</th>
                    <th className="pb-3 font-medium text-gray-600">Olusturulma</th>
                    <th className="pb-3 font-medium text-gray-600 text-right">Islemler</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page: Page) => (
                    <tr key={page.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {page.is_homepage && (
                            <Home className="w-4 h-4 text-emerald-600" />
                          )}
                          <span className="font-medium">{page.title}</span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-600">/{page.slug}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            page.is_published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {page.is_published ? 'Yayinda' : 'Taslak'}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600">
                        {new Date(page.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/${page.slug}`} target="_blank">
                            <Button variant="ghost" size="icon" title="Onizle">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/editor/pages/${page.id}`}>
                            <Button variant="ghost" size="icon" title="Duzenle">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Henuz sayfa olusturulmamis</p>
              <Link href="/admin/pages/new">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Ilk Sayfani Olustur
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
