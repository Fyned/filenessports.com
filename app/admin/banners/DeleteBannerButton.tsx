'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
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
  imageUrl,
  mobileImageUrl,
}: DeleteBannerButtonProps) {
  const router = useRouter()
  const supabase = createClient()
  const [deleting, setDeleting] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)

    try {
      // Delete images from storage
      const pathsToDelete: string[] = []

      if (imageUrl) {
        const path = imageUrl.split('/banners/')[1]
        if (path) pathsToDelete.push(path)
      }

      if (mobileImageUrl) {
        const path = mobileImageUrl.split('/banners/')[1]
        if (path) pathsToDelete.push(path)
      }

      if (pathsToDelete.length > 0) {
        await supabase.storage.from('banners').remove(pathsToDelete)
      }

      const { error } = await supabase.from('banners').delete().eq('id', bannerId)

      if (error) throw error

      toast.success('Banner başarıyla silindi')
      router.refresh()
    } catch (error) {
      console.error('Error deleting banner:', error)
      toast.error('Banner silinirken hata oluştu')
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
