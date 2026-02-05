import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomersTable } from './CustomersTable'

export default async function AdminCustomersPage() {
  const supabaseAdmin = await getSupabaseAdmin()

  // Auth.users tablosundan kullanıcıları çek (admin harici)
  const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()

  // Admin hesabını filtrele ve müşteri formatına dönüştür
  const customers = authUsers?.users
    ?.filter(user => !user.email?.includes('admin@'))
    ?.map(user => {
      // user_metadata'dan isim bilgilerini al
      const metadata = user.user_metadata || {}
      return {
        id: user.id,
        first_name: metadata.first_name || metadata.name?.split(' ')[0] || user.email?.split('@')[0] || 'Müşteri',
        last_name: metadata.last_name || metadata.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: metadata.phone || user.phone || null,
        created_at: user.created_at,
        orders: { count: 0 } // Sipariş sayısı ayrıca çekilebilir
      }
    }) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Müşteriler</h1>
          <p className="text-gray-600">Müşteri listesini görüntüleyin</p>
        </div>
      </div>

      {/* Customers List */}
      <Card>
        <CardHeader>
          <CardTitle>Tüm Müşteriler ({customers?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <CustomersTable customers={(customers || []) as any} />
        </CardContent>
      </Card>
    </div>
  )
}
