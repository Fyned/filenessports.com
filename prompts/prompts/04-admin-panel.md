# 🎛️ Prompt 04: Admin Panel

## Claude Code'a Verilecek Prompt

```
Admin paneli oluşturacağız. Dashboard, ürün yönetimi, kategori yönetimi, sipariş yönetimi içerecek.

1. Admin layout oluştur (src/app/admin/layout.tsx):

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/giris?redirect=/admin')
  }
  
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (profile?.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader user={profile} />
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
```

2. Admin Sidebar (src/components/admin/admin-sidebar.tsx):

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  FileText,
  Image,
  Users,
  Settings,
  BookOpen,
  Megaphone,
  Layers,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAdminStore } from '@/stores/admin-store'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Ürünler', href: '/admin/urunler', icon: Package },
  { name: 'Kategoriler', href: '/admin/kategoriler', icon: FolderTree },
  { name: 'Siparişler', href: '/admin/siparisler', icon: ShoppingCart },
  { name: 'Sayfalar', href: '/admin/sayfalar', icon: FileText },
  { name: 'Sayfa Builder', href: '/admin/sayfa-builder', icon: Layers },
  { name: 'Bannerlar', href: '/admin/bannerlar', icon: Megaphone },
  { name: 'Blog', href: '/admin/blog', icon: BookOpen },
  { name: 'Medya', href: '/admin/medya', icon: Image },
  { name: 'Kullanıcılar', href: '/admin/kullanicilar', icon: Users },
  { name: 'Ayarlar', href: '/admin/ayarlar', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useAdminStore()

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
          <Link href="/admin" className="text-xl font-bold">
            Admin Panel
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="mt-4 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-sm text-white/70 hover:bg-white/20 hover:text-white transition-colors"
          >
            Siteye Git
          </Link>
        </div>
      </aside>
    </>
  )
}
```

3. Admin Header (src/components/admin/admin-header.tsx):

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { Menu, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAdminStore } from '@/stores/admin-store'
import { useAuth } from '@/hooks/use-auth'

interface AdminHeaderProps {
  user: {
    first_name?: string
    last_name?: string
    email: string
    avatar_url?: string
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter()
  const { setSidebarOpen } = useAdminStore()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.push('/giris')
    router.refresh()
  }

  const initials = user.first_name && user.last_name
    ? `${user.first_name[0]}${user.last_name[0]}`
    : user.email[0].toUpperCase()

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/admin/profil')}>
            <User className="mr-2 h-4 w-4" />
            Profil
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Çıkış Yap
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
```

4. Admin store (src/stores/admin-store.ts):

```typescript
import { create } from 'zustand'

interface AdminStore {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useAdminStore = create<AdminStore>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
```

5. Dashboard sayfası (src/app/admin/page.tsx):

```typescript
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, FolderTree, ShoppingCart, Users, TrendingUp, DollarSign } from 'lucide-react'
import { RecentOrders } from '@/components/admin/recent-orders'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // İstatistikleri çek
  const [
    { count: productCount },
    { count: categoryCount },
    { count: orderCount },
    { count: userCount },
    { data: recentOrders },
    { data: todayOrders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('orders').select('total').gte('created_at', new Date().toISOString().split('T')[0]),
  ])

  const todayRevenue = todayOrders?.reduce((sum, order) => sum + Number(order.total), 0) || 0

  const stats = [
    {
      title: 'Toplam Ürün',
      value: productCount || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Kategoriler',
      value: categoryCount || 0,
      icon: FolderTree,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Siparişler',
      value: orderCount || 0,
      icon: ShoppingCart,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Kullanıcılar',
      value: userCount || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Hoş geldiniz, işte genel bakış</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Bugünkü Gelir
          </CardTitle>
          <div className="p-2 rounded-lg bg-emerald-100">
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(todayRevenue)}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Son Siparişler</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentOrders orders={recentOrders || []} />
        </CardContent>
      </Card>
    </div>
  )
}
```

6. Recent Orders component (src/components/admin/recent-orders.tsx):

```typescript
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

interface Order {
  id: string
  order_number: string
  total: number
  status: string
  created_at: string
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  pending: 'Beklemede',
  processing: 'İşleniyor',
  shipped: 'Kargoda',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal',
}

export function RecentOrders({ orders }: { orders: Order[] }) {
  if (!orders.length) {
    return <p className="text-muted-foreground text-center py-4">Henüz sipariş yok</p>
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/admin/siparisler/${order.id}`}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div>
            <p className="font-medium">{order.order_number}</p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: tr })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={statusColors[order.status]}>
              {statusLabels[order.status]}
            </Badge>
            <span className="font-medium">
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.total)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
```

7. Ürün listesi sayfası (src/app/admin/urunler/page.tsx):

```typescript
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ProductsTable } from '@/components/admin/products-table'

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name),
      images:product_images(id, image_url, is_primary)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ürünler</h1>
          <p className="text-muted-foreground">Ürünlerinizi yönetin</p>
        </div>
        <Link href="/admin/urunler/yeni">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ürün
          </Button>
        </Link>
      </div>

      <ProductsTable products={products || []} />
    </div>
  )
}
```

8. Products Table component (src/components/admin/products-table.tsx):

```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { MoreHorizontal, Pencil, Trash2, Eye, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock_quantity: number
  is_active: boolean
  category?: { id: string; name: string }
  images?: { id: string; image_url: string; is_primary: boolean }[]
}

export function ProductsTable({ products }: { products: Product[] }) {
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return

    setDeleting(id)
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      toast.success('Ürün silindi')
      router.refresh()
    } catch (error) {
      toast.error('Ürün silinirken hata oluştu')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Ürün ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Görsel</TableHead>
              <TableHead>Ürün Adı</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Fiyat</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Ürün bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0]
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      {primaryImage ? (
                        <Image
                          src={primaryImage.image_url}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                          ?
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category?.name || '-'}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price)}
                    </TableCell>
                    <TableCell>{product.stock_quantity}</TableCell>
                    <TableCell>
                      <Badge variant={product.is_active ? 'default' : 'secondary'}>
                        {product.is_active ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/urunler/${product.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              Görüntüle
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/urunler/${product.id}`}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Düzenle
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600"
                            disabled={deleting === product.id}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
```

9. Yeni ürün formu sayfası (src/app/admin/urunler/yeni/page.tsx) ve ürün düzenleme sayfası (src/app/admin/urunler/[id]/page.tsx) oluştur. Bu formlar:
- Ürün adı, slug, açıklama
- Fiyat, karşılaştırma fiyatı
- Kategori seçimi
- Stok miktarı
- Durum (aktif/pasif)
- Öne çıkan ürün
- Görsel yükleme (Supabase Storage)
- SEO alanları
içermeli.

Aynı yapıyı kategoriler için de oluştur.

Tüm dosyaları oluştur ve çalıştığını test et.
```

## Beklenen Çıktı

- Çalışan admin dashboard
- Ürün CRUD işlemleri
- Kategori CRUD işlemleri
- Responsive sidebar
- İstatistik kartları

## Sonraki Adım

`05-page-builder.md` promptuna geç.
