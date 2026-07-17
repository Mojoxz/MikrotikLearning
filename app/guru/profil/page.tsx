'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function GuruProfilPage() {
  const { data: session } = useSession()
  const [form, setForm] = useState({ nama: '', email: '', password: '', confirmPassword: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  useEffect(() => {
    if (session?.user) setForm(f => ({ ...f, nama: session.user.name || '', email: session.user.email || '' }))
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg({ type: '', text: '' })
    if (form.password && form.password !== form.confirmPassword) {
      setMsg({ type: 'error', text: 'Password tidak cocok' }); setSaving(false); return
    }
    const body: any = { nama: form.nama, email: form.email }
    if (form.password) body.password = form.password
    const res = await fetch(`/api/users/${session?.user?.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    })
    const data = await res.json()
    if (data.success) setMsg({ type: 'success', text: 'Profil berhasil diupdate' })
    else setMsg({ type: 'error', text: data.error || 'Gagal' })
    setSaving(false)
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Profil</h1>
        <p className="text-gray-500 text-sm">Update informasi akun Anda</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
          <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
            {session?.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-800">{session?.user?.name}</p>
            <p className="text-gray-500 text-sm">{session?.user?.email}</p>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Guru</span>
          </div>
        </div>
        {msg.text && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg.text}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input required value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
            <input type="password" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="pt-2">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-60">
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
