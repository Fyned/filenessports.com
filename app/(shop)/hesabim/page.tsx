'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  Loader2,
  ShoppingBag,
  Plus,
  Pencil,
  Trash2,
  Eye,
  ShoppingCart,
  X,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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

interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  role: string
}

interface Order {
  id: string
  order_number: string
  status: string
  total: number
  created_at: string
}

interface WishlistProduct {
  id: string
  name: string
  slug: string
  price: number
  compare_price: number | null
  stock: number
  is_active: boolean
  images: { url: string }[]
}

interface WishlistItem {
  id: string
  product_id: string
  product: WishlistProduct | null
}

interface Address {
  id: string
  title: string
  first_name: string
  last_name: string
  phone: string
  address: string
  city: string
  district: string
  postal_code?: string
  is_default: boolean
}

export default function AccountPage() {
  const router = useRouter()
  const supabase = createClient()
  const { addItem } = useCartStore()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [activeTab, setActiveTab] = useState('orders')

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  })

  // Address form
  const [addressDialogOpen, setAddressDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [addressForm, setAddressForm] = useState({
    title: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postal_code: '',
    is_default: false,
  })

  useEffect(() => {
    async function loadData() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.push('/giris?redirect=/hesabim')
        return
      }

      // Load profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profile) {
        setUser(profile)
        setFormData({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          phone: profile.phone || '',
        })
      } else {
        // Create a basic user object from auth data
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          first_name: '',
          last_name: '',
          role: 'customer',
        })
      }

      // Load orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, order_number, status, total, created_at')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(10)

      setOrders(ordersData || [])

      // Load wishlist
      const { data: wishlistData } = await supabase
        .from('wishlist')
        .select(`
          id,
          product_id,
          product:products(
            id,
            name,
            slug,
            price,
            compare_price,
            stock,
            is_active,
            images:product_images(url)
          )
        `)
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })

      if (wishlistData) {
        const normalizedWishlist = wishlistData.map((item: any) => ({
          ...item,
          product: Array.isArray(item.product) ? item.product[0] : item.product,
        }))
        setWishlist(normalizedWishlist as WishlistItem[])
      }

      // Load addresses
      const { data: addressesData } = await supabase
        .from('customer_addresses')
        .select('*')
        .eq('user_id', authUser.id)
        .order('is_default', { ascending: false })

      setAddresses(addressesData || [])
      setLoading(false)
    }

    loadData().catch(() => {
      setLoading(false)
    })
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Profiliniz güncellendi')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Profil güncellenirken bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveFromWishlist = async (wishlistId: string) => {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', wishlistId)

      if (error) throw error

      setWishlist(wishlist.filter((item) => item.id !== wishlistId))
      toast.success('Ürün favorilerden kaldırıldı')
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Bir hata oluştu')
    }
  }

  const handleAddToCart = (item: WishlistItem) => {
    if (!item.product) return

    // Convert WishlistProduct to Product type for cart store
    const productForCart = {
      id: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      description: null,
      short_description: null,
      price: item.product.price,
      compare_price: item.product.compare_price,
      cost_price: null,
      sku: null,
      barcode: null,
      stock: item.product.stock,
      low_stock_threshold: 5,
      category_id: null,
      brand: null,
      weight: null,
      dimensions: null,
      is_active: item.product.is_active,
      is_featured: false,
      is_new: false,
      free_shipping: false,
      meta_title: null,
      meta_description: null,
      tags: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: item.product.images?.map((img, idx) => ({
        id: `${item.product!.id}-img-${idx}`,
        product_id: item.product!.id,
        url: img.url,
        alt: item.product!.name,
        sort_order: idx,
        is_primary: idx === 0,
        created_at: new Date().toISOString(),
      })),
    }

    addItem(productForCart, 1)
    toast.success('Ürün sepete eklendi')
  }

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      if (editingAddress) {
        // Update
        const { error } = await supabase
          .from('customer_addresses')
          .update(addressForm)
          .eq('id', editingAddress.id)

        if (error) throw error

        setAddresses(
          addresses.map((addr) =>
            addr.id === editingAddress.id ? { ...addr, ...addressForm } : addr
          )
        )
        toast.success('Adres güncellendi')
      } else {
        // Insert
        const { data, error } = await supabase
          .from('customer_addresses')
          .insert({
            ...addressForm,
            user_id: user.id,
          })
          .select()
          .single()

        if (error) throw error

        setAddresses([...addresses, data])
        toast.success('Adres eklendi')
      }

      setAddressDialogOpen(false)
      resetAddressForm()
    } catch (error) {
      console.error('Error saving address:', error)
      toast.error('Adres kaydedilirken bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const { error } = await supabase
        .from('customer_addresses')
        .delete()
        .eq('id', addressId)

      if (error) throw error

      setAddresses(addresses.filter((addr) => addr.id !== addressId))
      toast.success('Adres silindi')
    } catch (error) {
      console.error('Error deleting address:', error)
      toast.error('Adres silinirken bir hata oluştu')
    }
  }

  const openEditAddress = (address: Address) => {
    setEditingAddress(address)
    setAddressForm({
      title: address.title,
      first_name: address.first_name,
      last_name: address.last_name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      district: address.district,
      postal_code: address.postal_code || '',
      is_default: address.is_default,
    })
    setAddressDialogOpen(true)
  }

  const resetAddressForm = () => {
    setEditingAddress(null)
    setAddressForm({
      title: '',
      first_name: '',
      last_name: '',
      phone: '',
      address: '',
      city: '',
      district: '',
      postal_code: '',
      is_default: false,
    })
  }

  const getStatusText = (status: string) => {
    const statuses: Record<string, string> = {
      pending: 'Beklemede',
      confirmed: 'Onaylandı',
      processing: 'Hazırlanıyor',
      shipped: 'Kargoda',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi',
    }
    return statuses[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-indigo-100 text-indigo-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#BB1624]" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Hesap bilgilerinize erişilemiyor.</p>
          <Link href="/giris">
            <Button className="bg-[#BB1624] hover:bg-[#8F101B]">Giriş Yap</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1C2840] mb-8">Hesabım</h1>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-[#1C2840] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white font-bold">
                    {user.first_name?.[0] || user.email[0].toUpperCase()}
                  </span>
                </div>
                <h2 className="font-semibold text-[#1C2840]">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition ${activeTab === 'orders' ? 'bg-[#BB1624] text-white' : 'hover:bg-gray-100'}`}
                >
                  <Package className={`w-5 h-5 ${activeTab === 'orders' ? 'text-white' : 'text-gray-500'}`} />
                  <span>Siparişlerim</span>
                  {orders.length > 0 && (
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${activeTab === 'orders' ? 'bg-white text-[#BB1624]' : 'bg-[#BB1624] text-white'}`}>
                      {orders.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition ${activeTab === 'favorites' ? 'bg-[#BB1624] text-white' : 'hover:bg-gray-100'}`}
                >
                  <Heart className={`w-5 h-5 ${activeTab === 'favorites' ? 'text-white' : 'text-gray-500'}`} />
                  <span>Favorilerim</span>
                  {wishlist.length > 0 && (
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${activeTab === 'favorites' ? 'bg-white text-[#BB1624]' : 'bg-red-500 text-white'}`}>
                      {wishlist.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition ${activeTab === 'addresses' ? 'bg-[#BB1624] text-white' : 'hover:bg-gray-100'}`}
                >
                  <MapPin className={`w-5 h-5 ${activeTab === 'addresses' ? 'text-white' : 'text-gray-500'}`} />
                  <span>Adreslerim</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition ${activeTab === 'profile' ? 'bg-[#BB1624] text-white' : 'hover:bg-gray-100'}`}
                >
                  <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-white' : 'text-gray-500'}`} />
                  <span>Hesap Bilgileri</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg text-red-500 hover:bg-red-50 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Çıkış Yap</span>
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* TabsList hidden on desktop, visible on mobile */}
            <TabsList className="mb-6 lg:hidden">
              <TabsTrigger value="orders">Siparişlerim</TabsTrigger>
              <TabsTrigger value="favorites">Favorilerim</TabsTrigger>
              <TabsTrigger value="addresses">Adreslerim</TabsTrigger>
              <TabsTrigger value="profile">Hesap Bilgileri</TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Son Siparişlerim</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Henüz siparişiniz bulunmuyor</p>
                      <Link href="/urunler">
                        <Button className="bg-[#BB1624] hover:bg-[#8F101B]">
                          Alışverişe Başla
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                        >
                          <div>
                            <p className="font-medium text-[#1C2840]">
                              Sipariş #{order.order_number}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.created_at).toLocaleDateString('tr-TR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusText(order.status)}
                            </span>
                            <p className="font-bold text-[#1C2840]">
                              {formatPrice(order.total)}
                            </p>
                            <Link href={`/siparis-takip?siparis=${order.order_number}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                Detay
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>Favorilerim</CardTitle>
                </CardHeader>
                <CardContent>
                  {wishlist.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Favori ürününüz bulunmuyor</p>
                      <Link href="/urunler">
                        <Button className="bg-[#BB1624] hover:bg-[#8F101B]">
                          Ürünleri Keşfet
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlist.map((item) => (
                        <div
                          key={item.id}
                          className="border rounded-lg overflow-hidden group"
                        >
                          {item.product && (
                            <>
                              <div className="relative aspect-square bg-gray-100">
                                <Link href={`/urunler/${item.product.slug}`}>
                                  <Image
                                    src={item.product.images?.[0]?.url || '/images/placeholder.jpg'}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                  />
                                </Link>
                                <button
                                  onClick={() => handleRemoveFromWishlist(item.id)}
                                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-50 transition"
                                >
                                  <X className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                              <div className="p-4">
                                <Link href={`/urunler/${item.product.slug}`}>
                                  <h3 className="font-medium text-[#1C2840] hover:text-[#BB1624] transition line-clamp-2">
                                    {item.product.name}
                                  </h3>
                                </Link>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="font-bold text-[#BB1624]">
                                    {formatPrice(item.product.price)}
                                  </span>
                                  {item.product.compare_price && (
                                    <span className="text-sm text-gray-400 line-through">
                                      {formatPrice(item.product.compare_price)}
                                    </span>
                                  )}
                                </div>
                                <Button
                                  onClick={() => handleAddToCart(item)}
                                  className="w-full mt-3 bg-[#1C2840] hover:bg-[#2a3a5c]"
                                  size="sm"
                                >
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  Sepete Ekle
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Kayıtlı Adreslerim</CardTitle>
                  <Button
                    onClick={() => {
                      resetAddressForm()
                      setAddressDialogOpen(true)
                    }}
                    className="bg-[#BB1624] hover:bg-[#8F101B]"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Adres
                  </Button>
                </CardHeader>
                <CardContent>
                  {addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Henüz kayıtlı adresiniz bulunmuyor</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`border rounded-lg p-4 ${
                            address.is_default ? 'border-[#BB1624] bg-red-50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-[#1C2840]">{address.title}</h3>
                              {address.is_default && (
                                <span className="text-xs bg-[#BB1624] text-white px-2 py-0.5 rounded">
                                  Varsayılan
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openEditAddress(address)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <Pencil className="w-4 h-4 text-gray-500" />
                              </button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button className="p-1 hover:bg-red-50 rounded">
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Adresi Sil</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Bu adresi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>İptal</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteAddress(address.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Sil
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.first_name} {address.last_name}
                          </p>
                          <p className="text-sm text-gray-600">{address.phone}</p>
                          <p className="text-sm text-gray-600 mt-2">
                            {address.address}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.district} / {address.city}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Hesap Bilgileri</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name">Ad</Label>
                        <Input
                          id="first_name"
                          value={formData.first_name}
                          onChange={(e) =>
                            setFormData({ ...formData, first_name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">Soyad</Label>
                        <Input
                          id="last_name"
                          value={formData.last_name}
                          onChange={(e) =>
                            setFormData({ ...formData, last_name: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">E-posta</Label>
                      <Input id="email" value={user.email} disabled />
                      <p className="text-xs text-gray-500 mt-1">
                        E-posta adresinizi değiştirmek için destek ile iletişime geçin.
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="05XX XXX XX XX"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="bg-[#BB1624] hover:bg-[#8F101B]"
                      disabled={saving}
                    >
                      {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Address Dialog */}
      <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveAddress} className="space-y-4">
            <div>
              <Label htmlFor="addr_title">Adres Başlığı</Label>
              <Input
                id="addr_title"
                value={addressForm.title}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, title: e.target.value })
                }
                placeholder="Örn: Ev, İş"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="addr_first_name">Ad</Label>
                <Input
                  id="addr_first_name"
                  value={addressForm.first_name}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, first_name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="addr_last_name">Soyad</Label>
                <Input
                  id="addr_last_name"
                  value={addressForm.last_name}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, last_name: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="addr_phone">Telefon</Label>
              <Input
                id="addr_phone"
                type="tel"
                value={addressForm.phone}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, phone: e.target.value })
                }
                placeholder="05XX XXX XX XX"
                required
              />
            </div>
            <div>
              <Label htmlFor="addr_address">Adres</Label>
              <Textarea
                id="addr_address"
                value={addressForm.address}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, address: e.target.value })
                }
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="addr_city">İl</Label>
                <Input
                  id="addr_city"
                  value={addressForm.city}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, city: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="addr_district">İlçe</Label>
                <Input
                  id="addr_district"
                  value={addressForm.district}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, district: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="addr_postal_code">Posta Kodu</Label>
              <Input
                id="addr_postal_code"
                value={addressForm.postal_code}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, postal_code: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="addr_is_default"
                checked={addressForm.is_default}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, is_default: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="addr_is_default" className="cursor-pointer">
                Varsayılan adres olarak kaydet
              </Label>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddressDialogOpen(false)}
                className="flex-1"
              >
                İptal
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#BB1624] hover:bg-[#8F101B]"
                disabled={saving}
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
