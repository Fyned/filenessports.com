'use client'

import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable, DataTableColumnHeader } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import Link from 'next/link'

interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
}

interface OrderFromDB {
  id: string
  order_number: string
  total: number
  status: string
  payment_status: string
  created_at: string
  customer: Customer[] | Customer | null
}

interface Order {
  id: string
  order_number: string
  total: number
  status: string
  payment_status: string
  created_at: string
  customer: Customer | null
}

interface OrdersTableProps {
  orders: OrderFromDB[]
}

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

const paymentStatusLabels: Record<string, string> = {
  pending: 'Bekleniyor',
  paid: 'Ödendi',
  failed: 'Başarısız',
  refunded: 'İade Edildi',
}

export function OrdersTable({ orders: rawOrders }: OrdersTableProps) {
  // Normalize orders - handle both array and single object customer
  const orders: Order[] = useMemo(() => {
    return rawOrders.map((order) => ({
      ...order,
      customer: Array.isArray(order.customer) ? order.customer[0] || null : order.customer,
    }))
  }, [rawOrders])

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'order_number',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sipariş No" />
      ),
      cell: ({ row }) => (
        <Link
          href={`/admin/orders/${row.original.id}`}
          className="text-emerald-600 hover:underline font-medium"
        >
          {row.original.order_number}
        </Link>
      ),
    },
    {
      accessorKey: 'customer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Müşteri" />
      ),
      cell: ({ row }) => {
        const customer = row.original.customer
        return customer ? (
          <div>
            <p className="font-medium">
              {customer.first_name} {customer.last_name}
            </p>
            <p className="text-sm text-gray-500">{customer.email}</p>
          </div>
        ) : (
          <span className="text-gray-400">Misafir</span>
        )
      },
      filterFn: (row, id, value) => {
        const customer = row.original.customer
        if (!customer) return false
        const searchValue = value.toLowerCase()
        const fullName = `${customer.first_name} ${customer.last_name}`.toLowerCase()
        return fullName.includes(searchValue) || customer.email.toLowerCase().includes(searchValue)
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tarih" />
      ),
      cell: ({ row }) => (
        <span className="text-gray-600">
          {new Date(row.original.created_at).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      accessorKey: 'total',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tutar" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.total.toLocaleString('tr-TR')} TL
        </span>
      ),
    },
    {
      accessorKey: 'payment_status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ödeme" />
      ),
      cell: ({ row }) => {
        const paymentStatus = row.original.payment_status
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              paymentStatus === 'paid'
                ? 'bg-green-100 text-green-800'
                : paymentStatus === 'failed'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {paymentStatusLabels[paymentStatus] || paymentStatus}
          </span>
        )
      },
      filterFn: (row, id, value) => {
        if (!value || value.length === 0) return true
        return value.includes(row.original.payment_status)
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Durum" />
      ),
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[status] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {statusLabels[status] || status}
          </span>
        )
      },
      filterFn: (row, id, value) => {
        if (!value || value.length === 0) return true
        return value.includes(row.original.status)
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <Link href={`/admin/orders/${row.original.id}`}>
            <Button variant="ghost" size="icon" title="Detay">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      ),
    },
  ]

  const filterOptions = [
    {
      column: 'status',
      title: 'Sipariş Durumu',
      options: [
        { label: 'Beklemede', value: 'pending' },
        { label: 'Onaylandı', value: 'confirmed' },
        { label: 'Hazırlanıyor', value: 'processing' },
        { label: 'Kargoda', value: 'shipped' },
        { label: 'Teslim Edildi', value: 'delivered' },
        { label: 'İptal', value: 'cancelled' },
        { label: 'İade', value: 'refunded' },
      ],
    },
    {
      column: 'payment_status',
      title: 'Ödeme Durumu',
      options: [
        { label: 'Bekleniyor', value: 'pending' },
        { label: 'Ödendi', value: 'paid' },
        { label: 'Başarısız', value: 'failed' },
        { label: 'İade Edildi', value: 'refunded' },
      ],
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={orders}
      searchKey="order_number"
      searchPlaceholder="Sipariş no veya müşteri ara..."
      filterOptions={filterOptions}
    />
  )
}
