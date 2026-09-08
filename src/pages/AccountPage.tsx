import { useState } from 'react'
import type { FormEvent } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function AccountPage() {
  const { user, profile } = useAuth()
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (pw.length < 6) {
      toast.error('Kata sandi minimal 6 karakter')
      return
    }
    if (pw !== pw2) {
      toast.error('Kata sandi tidak sama')
      return
    }
    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password: pw })
    setBusy(false)
    if (error) {
      toast.error(`Gagal: ${error.message}`)
      return
    }
    setPw('')
    setPw2('')
    toast.success('Kata sandi berhasil diperbarui')
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Akun</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {profile?.full_name} · {user?.email}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ganti kata sandi</CardTitle>
          <CardDescription>Buat kata sandi yang hanya kamu tahu.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="np">Kata sandi baru</Label>
              <Input
                id="np"
                type="password"
                autoComplete="new-password"
                required
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="np2">Konfirmasi kata sandi baru</Label>
              <Input
                id="np2"
                type="password"
                autoComplete="new-password"
                required
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={busy}>
              {busy ? 'Menyimpan…' : 'Simpan kata sandi'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
