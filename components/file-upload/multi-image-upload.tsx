'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Upload, X, Loader2, Image as ImageIcon, GripVertical, Star } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface ImageItem {
  id: string
  url: string
  isPrimary: boolean
}

interface MultiImageUploadProps {
  value: ImageItem[]
  onChange: (images: ImageItem[]) => void
  bucket: string
  folder?: string
  maxImages?: number
  disabled?: boolean
}

export function MultiImageUpload({
  value = [],
  onChange,
  bucket,
  folder = '',
  maxImages = 10,
  disabled = false,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (value.length + acceptedFiles.length > maxImages) {
        toast.error(`En fazla ${maxImages} resim yükleyebilirsiniz`)
        return
      }

      setUploading(true)

      const newImages: ImageItem[] = []

      for (const file of acceptedFiles) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name}: Dosya boyutu 5MB'dan küçük olmalı`)
          continue
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name}: Sadece resim dosyaları yüklenebilir`)
          continue
        }

        try {
          // Generate unique filename
          const fileExt = file.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
          const filePath = folder ? `${folder}/${fileName}` : fileName

          // Upload file to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file)

          if (uploadError) throw uploadError

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath)

          newImages.push({
            id: fileName,
            url: publicUrl,
            isPrimary: value.length === 0 && newImages.length === 0,
          })
        } catch (error) {
          console.error('Upload error:', error)
          toast.error(`${file.name}: Yüklenirken hata oluştu`)
        }
      }

      if (newImages.length > 0) {
        onChange([...value, ...newImages])
        toast.success(`${newImages.length} resim başarıyla yüklendi`)
      }

      setUploading(false)
    },
    [supabase, bucket, folder, value, onChange, maxImages]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    disabled: disabled || uploading || value.length >= maxImages,
  })

  const handleRemove = async (imageId: string) => {
    const imageToRemove = value.find((img) => img.id === imageId)
    if (!imageToRemove) return

    try {
      // Extract file path from URL
      const url = new URL(imageToRemove.url)
      const pathParts = url.pathname.split('/')
      const bucketIndex = pathParts.indexOf(bucket)
      if (bucketIndex !== -1) {
        const filePath = pathParts.slice(bucketIndex + 1).join('/')
        await supabase.storage.from(bucket).remove([filePath])
      }
    } catch (error) {
      console.error('Error removing file:', error)
    }

    const newImages = value.filter((img) => img.id !== imageId)

    // If removed image was primary, make the first one primary
    if (imageToRemove.isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true
    }

    onChange(newImages)
  }

  const handleSetPrimary = (imageId: string) => {
    const newImages = value.map((img) => ({
      ...img,
      isPrimary: img.id === imageId,
    }))
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {value.map((image) => (
            <div
              key={image.id}
              className={`relative group rounded-lg overflow-hidden border-2 ${
                image.isPrimary ? 'border-emerald-500' : 'border-transparent'
              }`}
            >
              <div className="aspect-square relative">
                <Image
                  src={image.url}
                  alt="Product image"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 bg-white/20 hover:bg-white/40 text-white"
                  onClick={() => handleSetPrimary(image.id)}
                  title="Ana resim yap"
                >
                  <Star className={`w-4 h-4 ${image.isPrimary ? 'fill-yellow-400' : ''}`} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 bg-white/20 hover:bg-red-500/80 text-white"
                  onClick={() => handleRemove(image.id)}
                  title="Sil"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Primary Badge */}
              {image.isPrimary && (
                <div className="absolute top-1 left-1 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded">
                  Ana
                </div>
              )}

              {/* Drag Handle */}
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100">
                <GripVertical className="w-4 h-4 text-white" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {value.length < maxImages && (
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
              <p className="text-sm text-gray-600">Yükleniyor...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {isDragActive ? (
                <>
                  <ImageIcon className="w-8 h-8 text-emerald-600" />
                  <p className="text-sm text-emerald-600">Resimleri buraya bırakın</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Resimleri sürükleyip bırakın veya tıklayın
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, GIF (max 5MB) - {maxImages - value.length} resim daha eklenebilir
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
