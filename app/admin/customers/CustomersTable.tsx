'use client'

import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable, DataTableColumnHeader } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Eye, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

interface CustomerFromDB {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  created_at: string
  orders: { count: number }[] | { count: number } | null
}

interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  created_at: string
  order_count: number
}

interface CustomersTableProps {
  customers: CustomerFromDB[]
}

export function CustomersTable({ customers: rawCustomers }: CustomersTableProps) {
  // Normalize customers
  const customers: Customer[] = useMemo(() => {
    return rawCustomers.map((customer) => ({
      ...customer,
      order_count: Array.isArray(customer.orders)
        ? customer.orders[0]?.count || 0
        : (customer.orders as { count: number })?.count || 0,
    }))
  }, [rawCustomers])

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Müşteri" />
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-medium">
            {row.original.first_name} {row.original.last_name}
          </p>
        </div>
      ),
      filterFn: (row, id, value) => {
        const fullName = `${row.original.first_name} ${row.original.last_name}`.toLowerCase()
        return fullName.includes(value.toLowerCase())
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="E-posta" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Telefon" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.phone ? (
            <>
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{row.original.phone}</span>
            </>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'order_count',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sipariş Sayısı" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.order_count}</span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kayıt Tarihi" />
      ),
      cell: ({ row }) => (
        <span className="text-gray-600">
          {new Date(row.original.created_at).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <Link href={`/admin/customers/${row.original.id}`}>
            <Button variant="ghost" size="icon" title="Detay">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={customers}
      searchKey="name"
      searchPlaceholder="Müşteri ara..."
    />
  )
}
