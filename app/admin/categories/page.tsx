import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { Category } from '@/types/database'
import Image from 'next/image'
import { DeleteCategoryButton } from './DeleteCategoryButton'

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')
    .order('name')

  // Organize categories into parent-child structure
  const parentCategories = categories?.filter((c: Category) => !c.parent_id) || []
  const childCategories = (parentId: string) =>
    categories?.filter((c: Category) => c.parent_id === parentId) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kategoriler</h1>
          <p className="text-gray-600">Kategorileri yönetin ve düzenleyin</p>
        </div>
        <Link href="/admin/categories/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Kategori
          </Button>
        </Link>
      </div>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Tüm Kategoriler ({categories?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {parentCategories.length > 0 ? (
            <div className="space-y-4">
              {parentCategories.map((category: Category) => {
                const children = childCategories(category.id)

                return (
                  <div key={category.id} className="border rounded-lg">
                    {/* Parent Category */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {category.image_url ? (
                            <Image
                              src={category.image_url}
                              alt={category.name}
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
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-gray-500">/{category.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            category.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {category.is_active ? 'Aktif' : 'Pasif'}
                        </span>
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/categories/${category.id}`}>
                            <Button variant="ghost" size="icon" title="Düzenle">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <DeleteCategoryButton
                            categoryId={category.id}
                            categoryName={category.name}
                            hasChildren={children.length > 0}
                            imageUrl={category.image_url}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Child Categories */}
                    {children.length > 0 && (
                      <div className="p-4 pl-12 space-y-2">
                        {children.map((child: Category) => (
                          <div
                            key={child.id}
                            className="flex items-center justify-between py-2 border-b last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                {child.image_url ? (
                                  <Image
                                    src={child.image_url}
                                    alt={child.name}
                                    width={32}
                                    height={32}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <ImageIcon className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{child.name}</p>
                                <p className="text-xs text-gray-500">/{child.slug}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  child.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {child.is_active ? 'Aktif' : 'Pasif'}
                              </span>
                              <div className="flex items-center gap-2">
                                <Link href={`/admin/categories/${child.id}`}>
                                  <Button variant="ghost" size="icon" title="Düzenle">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <DeleteCategoryButton
                                  categoryId={child.id}
                                  categoryName={child.name}
                                  hasChildren={false}
                                  imageUrl={child.image_url}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Henüz kategori eklenmemiş</p>
              <Link href="/admin/categories/new">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Kategoriyi Ekle
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
