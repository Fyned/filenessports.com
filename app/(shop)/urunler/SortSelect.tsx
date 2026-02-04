'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface SortSelectProps {
  defaultValue?: string
}

export function SortSelect({ defaultValue = '' }: SortSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())

    if (e.target.value) {
      params.set('siralama', e.target.value)
    } else {
      params.delete('siralama')
    }

    // Reset to page 1 when sorting changes
    params.delete('sayfa')

    router.push(`/urunler?${params.toString()}`)
  }

  return (
    <select
      className="border rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#BB1624] focus:border-transparent"
      defaultValue={defaultValue}
      onChange={handleChange}
    >
      <option value="">Varsayılan Sıralama</option>
      <option value="fiyat-artan">Fiyat: Düşükten Yükseğe</option>
      <option value="fiyat-azalan">Fiyat: Yüksekten Düşüğe</option>
      <option value="yeni">En Yeniler</option>
    </select>
  )
}
