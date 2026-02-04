'use client'

import { useRouter, useSearchParams, useParams } from 'next/navigation'

interface SortSelectProps {
  defaultValue?: string
}

export function CategorySortSelect({ defaultValue = '' }: SortSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const slug = params.slug as string

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams.toString())

    if (e.target.value) {
      newParams.set('siralama', e.target.value)
    } else {
      newParams.delete('siralama')
    }

    // Reset to page 1 when sorting changes
    newParams.delete('sayfa')

    router.push(`/kategori/${slug}?${newParams.toString()}`)
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
