'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-[#BB1624]" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Bir Hata Oluştu
        </h1>
        <p className="text-gray-600 mb-8">
          Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya
          daha sonra tekrar deneyin.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 bg-[#BB1624] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#8F101B] transition-colors"
          >
            <RefreshCcw className="w-5 h-5" />
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#1C2840] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2A3A5A] transition-colors"
          >
            <Home className="w-5 h-5" />
            Ana Sayfa
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-gray-400">
            Hata Kodu: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
