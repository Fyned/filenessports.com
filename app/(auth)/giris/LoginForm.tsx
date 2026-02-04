'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Kullanıcı adı veya email ile giriş yap
      // Eğer @ içeriyorsa email olarak kabul et, yoksa @fileenessports.com ekle
      let email = username
      if (!username.includes('@')) {
        // Username olarak girildiyse, email formatına çevir
        email = `${username}@fileenessports.com`
      }

      // Email ile giriş yap
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message === 'Invalid login credentials') {
          throw new Error('Geçersiz kullanıcı adı veya şifre')
        }
        throw error
      }

      toast.success('Giriş başarılı')

      // Sayfayı yeniden yükle ve yönlendir
      window.location.href = redirect
    } catch (error: unknown) {
      console.error('Login error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Giriş yaparken hata oluştu'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <Link href="/" className="inline-block mb-4">
          <Image src="/images/logo.svg" alt="Filenes Sports" width={180} height={60} className="h-12 w-auto mx-auto" />
        </Link>
        <CardTitle className="text-2xl text-[#1C2840]">Giriş Yap</CardTitle>
        <CardDescription>Hesabınıza giriş yapın</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="username">Kullanıcı Adı veya Email</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adı veya e-posta"
              className="focus:border-[#1C2840] focus:ring-[#1C2840]"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus:border-[#1C2840] focus:ring-[#1C2840]"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#BB1624] hover:bg-[#8F101B] text-white font-semibold py-3"
            disabled={loading}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/sifremi-unuttum" className="text-[#1C2840] hover:text-[#BB1624] hover:underline">
            Şifremi unuttum
          </Link>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          Hesabınız yok mu?{' '}
          <Link href="/kayit" className="text-[#BB1624] hover:underline font-medium">
            Kayıt olun
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
