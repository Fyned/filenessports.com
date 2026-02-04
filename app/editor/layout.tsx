import { Toaster } from 'sonner'

export const metadata = {
  title: 'Sayfa Düzenleyici - Filenes Sports',
}

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors />
    </>
  )
}
