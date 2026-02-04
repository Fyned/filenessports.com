import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, Users, TrendingUp, AlertTriangle, Clock, CheckCircle, Truck, XCircle, ArrowUpRight, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { AreaChart, BarChart, PieChart } from '@/components/charts'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch stats
  const [
    { count: productsCount },
    { count: ordersCount },
    { count: customersCount },
    { data: recentOrders },
    { data: categoryStats },
    { data: monthlyOrders },
    { data: lowStockProducts },
    { data: pendingOrders },
    { data: todayStats },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase
      .from('orders')
      .select('id, order_number, total, status, created_at, customer:customers(first_name, last_name)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('categories')
      .select('id, name, products:products(count)')
      .limit(6),
    supabase
      .from('orders')
      .select('created_at, total')
      .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString())
      .order('created_at', { ascending: true }),
    // Low stock products (stock <= 5)
    supabase
      .from('products')
      .select('id, name, stock, sku')
      .lte('stock', 5)
      .eq('is_active', true)
      .order('stock', { ascending: true })
      .limit(5),
    // Pending orders
    supabase
      .from('orders')
      .select('id, order_number, total, created_at, customer:customers(first_name, last_name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(5),
    // Today's stats
    supabase
      .from('orders')
      .select('total, status')
      .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
  ])

  // Calculate today's stats
  const todayOrdersCount = todayStats?.length || 0
  const todayRevenue = todayStats?.reduce((sum, order) => sum + (order.total || 0), 0) || 0
  const pendingCount = pendingOrders?.length || 0

  // Calculate order status distribution
  const { data: statusData } = await supabase
    .from('orders')
    .select('status')

  const statusCounts: Record<string, number> = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  }

  statusData?.forEach(order => {
    if (statusCounts.hasOwnProperty(order.status)) {
      statusCounts[order.status]++
    }
  })

  const stats = [
    {
      title: 'Toplam Ürün',
      value: productsCount || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/admin/products',
    },
    {
      title: 'Toplam Sipariş',
      value: ordersCount || 0,
      icon: ShoppingCart,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      href: '/admin/orders',
    },
    {
      title: 'Bugünün Cirosu',
      value: `${todayRevenue.toLocaleString('tr-TR')} ₺`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/admin/orders',
      isText: true,
    },
    {
      title: 'Toplam Müşteri',
      value: customersCount || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/admin/customers',
    },
  ]

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  }

  const statusLabels: Record<string, string> = {
    pending: 'Beklemede',
    confirmed: 'Onaylandı',
    processing: 'Hazırlanıyor',
    shipped: 'Kargoda',
    delivered: 'Teslim Edildi',
    cancelled: 'İptal',
    refunded: 'İade',
  }

  // Prepare chart data
  const categoryChartData = (categoryStats || []).map((cat) => ({
    name: cat.name,
    value: Array.isArray(cat.products) ? cat.products.length : (cat.products as { count: number })?.count || 0,
  })).filter(item => item.value > 0)

  // Group orders by month for area chart
  const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
  const salesByMonth: Record<string, number> = {}
  const ordersByMonth: Record<string, number> = {}

  ;(monthlyOrders || []).forEach((order) => {
    const date = new Date(order.created_at)
    const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
    salesByMonth[key] = (salesByMonth[key] || 0) + (order.total || 0)
    ordersByMonth[key] = (ordersByMonth[key] || 0) + 1
  })

  const salesChartData = Object.entries(salesByMonth).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }))

  const ordersChartData = Object.entries(ordersByMonth).map(([name, value]) => ({
    name,
    value,
  }))

  return (
    <div className="space-y-6">
      {/* Trendyol Style Order Status Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Link href="/admin/orders?status=pending" className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-yellow-700">{statusCounts.pending}</p>
              <p className="text-xs text-yellow-600">Bekleyen</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/orders?status=confirmed" className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-700">{statusCounts.confirmed}</p>
              <p className="text-xs text-blue-600">Onaylanan</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/orders?status=processing" className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-indigo-600" />
            <div>
              <p className="text-2xl font-bold text-indigo-700">{statusCounts.processing}</p>
              <p className="text-xs text-indigo-600">Hazırlanan</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/orders?status=shipped" className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-purple-700">{statusCounts.shipped}</p>
              <p className="text-xs text-purple-600">Kargoda</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/orders?status=delivered" className="bg-green-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-700">{statusCounts.delivered}</p>
              <p className="text-xs text-green-600">Teslim Edilen</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/orders?status=cancelled" className="bg-red-50 border border-red-200 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-700">{statusCounts.cancelled}</p>
              <p className="text-xs text-red-600">İptal</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition border-l-4 border-l-[#BB1624]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Stok Uyarısı
            </CardTitle>
            <Link href="/admin/products?filter=low-stock" className="text-sm text-[#BB1624] hover:underline flex items-center gap-1">
              Tümünü Gör <ArrowUpRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {lowStockProducts && lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/products/${product.id}`}
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-sm text-gray-500">SKU: {product.sku || '-'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {product.stock === 0 ? 'Tükendi' : `${product.stock} adet`}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p>Tüm ürünlerin stoğu yeterli</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              Bekleyen Siparişler
            </CardTitle>
            <Link href="/admin/orders?status=pending" className="text-sm text-[#BB1624] hover:underline flex items-center gap-1">
              Tümünü Gör <ArrowUpRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {pendingOrders && pendingOrders.length > 0 ? (
              <div className="space-y-3">
                {pendingOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-900">#{order.order_number}</p>
                      <p className="text-sm text-gray-500">
                        {order.customer && Array.isArray(order.customer) && order.customer[0] ? `${order.customer[0].first_name} ${order.customer[0].last_name}` : 'Misafir'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#BB1624]">{order.total.toLocaleString('tr-TR')} ₺</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p>Bekleyen sipariş yok</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Satış Grafiği (Son 6 Ay)</CardTitle>
          </CardHeader>
          <CardContent>
            {salesChartData.length > 0 ? (
              <AreaChart
                data={salesChartData}
                height={300}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Henüz satış verisi yok
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Kategori Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryChartData.length > 0 ? (
              <PieChart
                data={categoryChartData}
                height={300}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Henüz kategori verisi yok
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Son Siparişler</CardTitle>
            <Link href="/admin/orders" className="text-sm text-[#BB1624] hover:underline flex items-center gap-1">
              Tümü <ArrowUpRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders && recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium text-gray-600">Sipariş No</th>
                      <th className="pb-3 font-medium text-gray-600">Müşteri</th>
                      <th className="pb-3 font-medium text-gray-600">Tutar</th>
                      <th className="pb-3 font-medium text-gray-600">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-[#BB1624] hover:underline font-medium"
                          >
                            #{order.order_number}
                          </Link>
                        </td>
                        <td className="py-3 text-gray-600">
                          {order.customer && Array.isArray(order.customer) && order.customer[0] ? `${order.customer[0].first_name} ${order.customer[0].last_name}` : 'Misafir'}
                        </td>
                        <td className="py-3 font-medium">
                          {order.total.toLocaleString('tr-TR')} ₺
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}
                          >
                            {statusLabels[order.status] || order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Henüz sipariş yok</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/admin/products/new"
                className="flex items-center justify-center gap-2 w-full bg-[#BB1624] text-white py-3 rounded-lg hover:bg-[#8F101B] transition font-medium"
              >
                <Package className="w-5 h-5" />
                Yeni Ürün Ekle
              </Link>
              <Link
                href="/admin/categories/new"
                className="flex items-center justify-center gap-2 w-full bg-[#1C2840] text-white py-3 rounded-lg hover:bg-[#2A3A5A] transition font-medium"
              >
                Yeni Kategori Ekle
              </Link>
              <Link
                href="/admin/banners/new"
                className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Yeni Banner Ekle
              </Link>
              <Link
                href="/admin/blog/new"
                className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Yeni Blog Yazısı
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bugünün Özeti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Sipariş Sayısı</span>
                <span className="font-bold text-lg">{todayOrdersCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Toplam Ciro</span>
                <span className="font-bold text-lg text-[#BB1624]">{todayRevenue.toLocaleString('tr-TR')} ₺</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Bekleyen Sipariş</span>
                <span className={`font-bold text-lg ${pendingCount > 0 ? 'text-yellow-600' : 'text-green-600'}`}>{pendingCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
