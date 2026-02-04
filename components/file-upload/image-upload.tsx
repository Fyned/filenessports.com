'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Upload, X, Loader2, Image as ImageIcon, Info } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (url: string | null) => void
  bucket: string
  folder?: string
  disabled?: boolean
  recommendedWidth?: number
  recommendedHeight?: number
  autoResize?: boolean
}

// Resmi canvas kullanarak hedef boyuta ölçeklendiren fonksiyon (kırpma yok, tam görsel)
async function resizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }

      // Hedef boyutları ayarla
      canvas.width = targetWidth
      canvas.height = targetHeight

      // Arka planı beyaz yap (şeffaf alanlar için)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, targetWidth, targetHeight)

      // Kaynak resmin oranını hesapla
      const sourceRatio = img.width / img.height
      const targetRatio = targetWidth / targetHeight

      let destWidth: number
      let destHeight: number
      let destX: number
      let destY: number

      // Contain modu: Resmi hedef boyuta sığdır, kırpma yok
      // Tüm görsel görünür, gerekirse boşluk kalır
      if (sourceRatio > targetRatio) {
        // Resim hedeften daha geniş, genişliğe göre ölçekle
        destWidth = targetWidth
        destHeight = targetWidth / sourceRatio
        destX = 0
        destY = (targetHeight - destHeight) / 2
      } else {
        // Resim hedeften daha uzun, yüksekliğe göre ölçekle
        destHeight = targetHeight
        destWidth = targetHeight * sourceRatio
        destX = (targetWidth - destWidth) / 2
        destY = 0
      }

      // Resmi canvas'a çiz (ölçeklendir, kırpma yok)
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        destX,
        destY,
        destWidth,
        destHeight
      )

      // Canvas'ı blob'a çevir
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Canvas to blob conversion failed'))
          }
        },
        'image/jpeg',
        0.92 // Kalite
      )
    }

    img.onerror = () => reject(new Error('Image load failed'))
    img.src = URL.createObjectURL(file)
  })
}

export function ImageUpload({
  value,
  onChange,
  bucket,
  folder = '',
  disabled = false,
  recommendedWidth,
  recommendedHeight,
  autoResize = true,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const hasRecommendedSize = recommendedWidth && recommendedHeight

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      // Validate file size (max 10MB for original, will be compressed)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Dosya boyutu 10MB\'dan küçük olmalı')
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Sadece resim dosyaları yüklenebilir')
        return
      }

      setUploading(true)

      try {
        let uploadFile: File | Blob = file
        let fileExt = file.name.split('.').pop()

        // Eğer önerilen boyut varsa ve autoResize açıksa, resmi boyutlandır
        if (hasRecommendedSize && autoResize && recommendedWidth && recommendedHeight) {
          toast.info(`Görsel ${recommendedWidth}x${recommendedHeight}px boyutuna ayarlanıyor...`)
          uploadFile = await resizeImage(file, recommendedWidth, recommendedHeight)
          fileExt = 'jpg' // Resize sonrası JPEG olarak kaydet
        }

        // Generate unique filename
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = folder ? `${folder}/${fileName}` : fileName

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, uploadFile)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath)

        onChange(publicUrl)
        toast.success('Resim başarıyla yüklendi')
      } catch (error) {
        console.error('Upload error:', error)
        toast.error('Resim yüklenirken hata oluştu')
      } finally {
        setUploading(false)
      }
    },
    [supabase, bucket, folder, onChange, hasRecommendedSize, autoResize, recommendedWidth, recommendedHeight]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: disabled || uploading,
  })

  const handleRemove = async () => {
    if (!value) return

    try {
      // Extract file path from URL
      const url = new URL(value)
      const pathParts = url.pathname.split('/')
      const bucketIndex = pathParts.indexOf(bucket)
      if (bucketIndex !== -1) {
        const filePath = pathParts.slice(bucketIndex + 1).join('/')

        // Delete from storage
        await supabase.storage.from(bucket).remove([filePath])
      }
    } catch (error) {
      console.error('Error removing file:', error)
    }

    onChange(null)
  }

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative inline-block">
          <div
            className="relative rounded-lg overflow-hidden border"
            style={{
              width: hasRecommendedSize ? Math.min(160, recommendedWidth / 4) : 160,
              height: hasRecommendedSize ? Math.min(160, recommendedHeight / 4) : 160,
              aspectRatio: hasRecommendedSize ? `${recommendedWidth}/${recommendedHeight}` : '1/1'
            }}
          >
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 w-6 h-6"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </Button>
          {hasRecommendedSize && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3" />
              {recommendedWidth} x {recommendedHeight}px olarak kaydedildi
            </p>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            transition-colors
            ${isDragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-gray-400'}
            ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              <p className="text-sm text-gray-600">
                {hasRecommendedSize ? 'Boyutlandırılıyor ve yükleniyor...' : 'Yükleniyor...'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {isDragActive ? (
                <>
                  <ImageIcon className="w-8 h-8 text-emerald-600" />
                  <p className="text-sm text-emerald-600">Resmi buraya bırakın</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Resmi sürükleyip bırakın veya tıklayın
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF, WebP (max 10MB)</p>
                  {hasRecommendedSize && (
                    <div className="mt-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-xs text-blue-700 font-medium flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Önerilen boyut: {recommendedWidth} x {recommendedHeight}px
                      </p>
                      <p className="text-xs text-blue-600 mt-0.5">
                        Görsel otomatik olarak bu boyuta ölçeklendirilecek
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
