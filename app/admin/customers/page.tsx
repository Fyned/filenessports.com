import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomersTable } from './CustomersTable'

export default async function AdminCustomersPage() {
  const supabase = await createClient()

  const { data: customers } = await supabase
    .from('customers')
    .select(`
      id,
      first_name,
      last_name,
      email,
      phone,
      created_at,
      orders:orders(count)
    `)
    .order('created_at', { ascending: false })

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
