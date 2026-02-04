'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/sifre-sifirla`,
      })

      if (error) {
        throw error
      }

      setEmailSent(true)
      toast.success('Şifre sıfırlama linki e-posta adresinize gönderildi')
    } catch (error: unknown) {
      console.error('Password reset error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Bir hata oluştu'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
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
            <CardTitle className="text-2xl text-[#1C2840]">E-posta Gönderildi!</CardTitle>
            <CardDescription className="mt-2">
              <strong>{email}</strong> adresine şifre sıfırlama linki gönderdik.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-medium mb-1">Lütfen dikkat:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>E-posta birkaç dakika içinde gelecektir</li>
                <li>Spam/gereksiz klasörünü kontrol edin</li>
                <li>Link 24 saat geçerlidir</li>
              </ul>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setEmailSent(false)
                setEmail('')
              }}
            >
              Farklı e-posta dene
            </Button>

            <div className="text-center">
              <Link href="/giris" className="text-[#BB1624] hover:underline text-sm font-medium inline-flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Giriş sayfasına dön
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-4">
            <Image src="/images/logo.svg" alt="Filenes Sports" width={180} height={60} className="h-12 w-auto mx-auto" />
          </Link>
          <div className="mx-auto w-16 h-16 bg-[#1C2840]/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-[#1C2840]" />
          </div>
          <CardTitle className="text-2xl text-[#1C2840]">Şifremi Unuttum</CardTitle>
          <CardDescription>
            E-posta adresinizi girin, size şifre sıfırlama linki gönderelim
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">E-posta Adresi</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                className="focus:border-[#1C2840] focus:ring-[#1C2840]"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#BB1624] hover:bg-[#8F101B] text-white font-semibold py-3"
              disabled={loading}
            >
              {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Linki Gönder'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/giris" className="text-[#1C2840] hover:text-[#BB1624] hover:underline text-sm inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Giriş sayfasına dön
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
