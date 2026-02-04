'use client'

import { useEffect, useState, use } from 'react'
import { Puck, Data } from '@puckeditor/core'
import '@puckeditor/core/puck.css'
import { puckConfig } from '@/lib/puck/config'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface PageEditorProps {
  params: Promise<{ id: string }>
}

const initialData: Data = {
  content: [],
  root: { props: { title: '' } },
}

export default function PageEditorPage({ params }: PageEditorProps) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [pageData, setPageData] = useState<Data>(initialData)
  const [pageInfo, setPageInfo] = useState<{ title: string; slug: string } | null>(null)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    async function checkAuthAndLoadPage() {
      // Check if user is admin
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/giris')
        return
      }

      // Check admin role
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push('/')
        return
      }

      setAuthorized(true)

      // Fetch page info
      const { data: page } = await supabase
        .from('pages')
        .select('title, slug')
        .eq('id', id)
        .single()

      if (page) {
        setPageInfo(page)
      }

      // Fetch page blocks via API
      try {
        const response = await fetch(`/api/admin/pages/${id}/blocks`)
        if (response.ok) {
          const data = await response.json()
          if (data?.puck_data) {
            setPageData(data.puck_data as Data)
          }
        }
      } catch (error) {
        console.error('Error fetching page blocks:', error)
      }

      setLoading(false)
    }

    checkAuthAndLoadPage()
  }, [id, supabase, router])

  const handlePublish = async (data: Data) => {
    try {
      const response = await fetch(`/api/admin/pages/${id}/blocks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          puck_data: data,
          is_draft: false,
          is_published: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Sayfa kaydedilemedi')
      }

      toast.success('Sayfa yayinlandi')
      router.push('/admin/pages')
    } catch (error) {
      console.error('Error publishing page:', error)
      toast.error(error instanceof Error ? error.message : 'Sayfa yayinlanirken hata olustu')
    }
  }

  if (loading || !authorized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C2840]"></div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Puck
        config={puckConfig}
        data={pageData}
        onPublish={handlePublish}
        headerTitle={pageInfo?.title || 'Sayfa Duzenle'}
        headerPath="/admin/pages"
      />
    </div>
  )
}
