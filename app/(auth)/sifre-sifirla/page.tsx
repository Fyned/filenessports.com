'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)

  useEffect(() => {
    // Supabase otomatik olarak URL'deki token'ı işler
    // Session kontrolü yapalım
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        setIsValidSession(true)
      } else {
        // URL'de hash varsa Supabase bunu işleyecek
        const hash = window.location.hash
        if (hash && hash.includes('access_token')) {
          // Token var, Supabase işleyecek
          setIsValidSession(true)
        } else {
          setIsValidSession(false)
          setError('Geçersiz veya süresi dolmuş şifre sıfırlama linki')
        }
      }
    }

    // Auth state değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true)
      }
    })

    checkSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 6) {
      return 'Şifre en az 6 karakter olmalıdır'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validasyon
    const passwordError = validatePassword(password)
    if (passwordError) {
      toast.error(passwordError)
      return
    }

    if (password !== confirmPassword) {
      toast.error('Şifreler eşleşmiyor')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        throw error
      }

      setSuccess(true)
      toast.success('Şifreniz başarıyla güncellendi')

      // 3 saniye sonra login sayfasına yönlendir
      setTimeout(() => {
        router.push('/giris')
      }, 3000)
    } catch (error: unknown) {
      console.error('Password update error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Şifre güncellenirken hata oluştu'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (isValidSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="py-12">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BB1624]"></div>
              <p className="mt-4 text-gray-600">Doğrulanıyor...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state - Invalid link
  if (isValidSession === false || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <Link href="/" className="inline-block mb-4">
              <Image src="/images/logo.svg" alt="Filenes Sports" width={180} height={60} className="h-12 w-auto mx-auto" />
            </Link>
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-[#1C2840]">Geçersiz Link</CardTitle>
            <CardDescription>
              Bu şifre sıfırlama linki geçersiz veya süresi dolmuş.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
              <p>Şifre sıfırlama linki sadece 24 saat geçerlidir. Lütfen yeni bir şifre sıfırlama linki talep edin.</p>
            </div>

            <Link href="/sifremi-unuttum">
              <Button className="w-full bg-[#BB1624] hover:bg-[#8F101B] text-white font-semibold py-3">
                Yeni Link Talep Et
              </Button>
            </Link>

            <div className="text-center">
              <Link href="/giris" className="text-[#1C2840] hover:text-[#BB1624] hover:underline text-sm">
                Giriş sayfasına dön
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <Link href="/" className="inline-block mb-4">
              <Image src="/images/logo.svg" alt="Filenes Sports" width={180} height={60} className="h-12 w-auto mx-auto" />
            </Link>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-[#1C2840]">Şifreniz Güncellendi!</CardTitle>
            <CardDescription>
              Şifreniz başarıyla değiştirildi. Yeni şifrenizle giriş yapabilirsiniz.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-gray-600">
              Giriş sayfasına yönlendiriliyorsunuz...
            </p>
            <Link href="/giris">
              <Button className="w-full bg-[#BB1624] hover:bg-[#8F101B] text-white font-semibold py-3">
                Giriş Yap
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Password reset form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-4">
            <Image src="/images/logo.svg" alt="Filenes Sports" width={180} height={60} className="h-12 w-auto mx-auto" />
          </Link>
          <div className="mx-auto w-16 h-16 bg-[#1C2840]/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-[#1C2840]" />
          </div>
          <CardTitle className="text-2xl text-[#1C2840]">Yeni Şifre Belirleyin</CardTitle>
          <CardDescription>
            Hesabınız için yeni bir şifre oluşturun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Yeni Şifre</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="focus:border-[#1C2840] focus:ring-[#1C2840] pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Şifrenizi tekrar girin"
                  className="focus:border-[#1C2840] focus:ring-[#1C2840] pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-red-500 text-sm mt-1">Şifreler eşleşmiyor</p>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
              <p className="font-medium mb-1">Şifre gereksinimleri:</p>
              <ul className="list-disc list-inside space-y-1">
                <li className={password.length >= 6 ? 'text-green-600' : ''}>
                  En az 6 karakter
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#BB1624] hover:bg-[#8F101B] text-white font-semibold py-3"
              disabled={loading || password !== confirmPassword || password.length < 6}
            >
              {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
