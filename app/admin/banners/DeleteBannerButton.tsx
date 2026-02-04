'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
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
import { toast } from 'sonner'
import { Trash2, Loader2 } from 'lucide-react'

interface DeleteBannerButtonProps {
  bannerId: string
  bannerTitle: string
  imageUrl?: string | null
  mobileImageUrl?: string | null
}

export function DeleteBannerButton({
  bannerId,
  bannerTitle,
}: DeleteBannerButtonProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)

    try {
      const response = await fetch(`/api/admin/banners/${bannerId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Banner silinemedi')
      }

      toast.success('Banner başarıyla silindi')
      router.refresh()
    } catch (error) {
      console.error('Error deleting banner:', error)
      toast.error(error instanceof Error ? error.message : 'Banner silinirken hata oluştu')
    } finally {
      setDeleting(false)
      setOpen(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-600 hover:text-red-700"
          title="Sil"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Banner&apos;ı Sil</AlertDialogTitle>
          <AlertDialogDescription>
            &quot;{bannerTitle || 'Başlıksız Banner'}&quot; banner&apos;ını silmek istediğinize emin misiniz?
            Bu işlem geri alınamaz ve görseller de silinecektir.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Siliniyor...
              </>
            ) : (
              'Sil'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
