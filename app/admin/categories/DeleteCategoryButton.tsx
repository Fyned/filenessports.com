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

interface DeleteCategoryButtonProps {
  categoryId: string
  categoryName: string
  hasChildren: boolean
  imageUrl?: string | null
}

export function DeleteCategoryButton({
  categoryId,
  categoryName,
  hasChildren,
  imageUrl,
}: DeleteCategoryButtonProps) {
  const router = useRouter()
  const supabase = createClient()
  const [deleting, setDeleting] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    if (hasChildren) {
      toast.error('Alt kategorileri olan kategori silinemez. Önce alt kategorileri silin.')
      setOpen(false)
      return
    }

    setDeleting(true)

    try {
      // Check if category has products
      const { count } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', categoryId)

      if (count && count > 0) {
        toast.error(`Bu kategoride ${count} ürün bulunuyor. Önce ürünleri başka kategoriye taşıyın.`)
        setDeleting(false)
        setOpen(false)
        return
      }

      // Delete from storage if image exists
      if (imageUrl) {
        const path = imageUrl.split('/categories/')[1]
        if (path) {
          await supabase.storage.from('categories').remove([path])
        }
      }

      const { error } = await supabase.from('categories').delete().eq('id', categoryId)

      if (error) throw error

      toast.success('Kategori başarıyla silindi')
      router.refresh()
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Kategori silinirken hata oluştu')
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
          <AlertDialogTitle>Kategoriyi Sil</AlertDialogTitle>
          <AlertDialogDescription>
            {hasChildren ? (
              <span className="text-red-600">
                &quot;{categoryName}&quot; kategorisinin alt kategorileri bulunuyor.
                Önce alt kategorileri silmeniz gerekiyor.
              </span>
            ) : (
              <>
                &quot;{categoryName}&quot; kategorisini silmek istediğinize emin misiniz?
                Bu işlem geri alınamaz.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          {!hasChildren && (
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
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
