'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'

interface Kuis { id: number; judul: string; durasi: number; isAktif: boolean; materi?: { judul: string }; _count?: { soal: number } }
interface Materi { id: number; judul: string }

export default function GuruKuisPage() {
  const [kuis, setKuis] = useState<Kuis[]>([])
  const [materi, setMateri] = useState<Materi[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [edit, setEdit] = useState<Kuis | null>(null)
  const [form, setForm] = useState({ judul: '', materiId: '', durasi: '30', isAktif: true })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  const load = async () => {
    setLoading(true)
    const [kr, mr] = await Promise.all([
      fetch('/api/kuis').then(r => r.json()),
      fetch('/api/materi').then(r => r.json()),
    ])
    if (kr.success) setKuis(kr.data)
    if (mr.success) setMateri(mr.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEdit(null); setForm({ judul: '', materiId: '', durasi: '30', isAktif: true }); setIsOpen(true) }
  const openEdit = (k: Kuis) => { setEdit(k); setForm({ judul: k.judul, materiId: '', durasi: k.durasi.toString(), isAktif: k.isAktif }); setIsOpen(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg({ type: '', text: '' })
    const url = edit ? `/api/kuis/${edit.id}` : '/api/kuis'
    const method = edit ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.success) { setMsg({ type: 'success', text: 'Berhasil' }); setIsOpen(false); load() }
    else setMsg({ type: 'error', text: data.error || 'Gagal' })
    setSaving(false)
  }

  const handleDelete = async (id: number, judul: string) => {
    if (!confirm(`Hapus kuis "${judul}"?`)) return
    const res = await fetch(`/api/kuis/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) { setMsg({ type: 'success', text: 'Dihapus' }); load() }
    else setMsg({ type: 'error', text: data.error || 'Gagal' })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kuis Saya</h1>
          <p className="text-gray-500 text-sm">Kelola kuis dan soal</p>
        </div>
        <div className="flex gap-2">
          <a href="/guru/soal" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 border">Kelola Soal</a>
          <button onClick={openCreate} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">+ Tambah Kuis</button>
        </div>
      </div>

      {msg.text && !isOpen && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg.text}</div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">#</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Judul</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Materi</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Durasi</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Soal</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Memuat...</td></tr>
              : kuis.length === 0 ? <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Belum ada kuis</td></tr>
              : kuis.map((k, i) => (
                <tr key={k.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{k.judul}</td>
                  <td className="px-4 py-3 text-gray-600">{k.materi?.judul || '-'}</td>
                  <td className="px-4 py-3">{k.durasi} menit</td>
                  <td className="px-4 py-3">{k._count?.soal ?? 0} soal</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${k.isAktif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {k.isAktif ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(k)} className="text-blue-600 text-xs border border-blue-300 px-2 py-1 rounded hover:bg-blue-50">Edit</button>
                      <button onClick={() => handleDelete(k.id, k.judul)} className="text-red-600 text-xs border border-red-300 px-2 py-1 rounded hover:bg-red-50">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={edit ? 'Edit Kuis' : 'Tambah Kuis'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {msg.text && isOpen && <div className={`px-3 py-2 rounded text-sm ${msg.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{msg.text}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Kuis *</label>
            <input required value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Materi *</label>
            <select required={!edit} value={form.materiId} onChange={e => setForm(f => ({ ...f, materiId: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">-- Pilih Materi --</option>
              {materi.map(m => <option key={m.id} value={m.id}>{m.judul}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (menit) *</label>
            <input required type="number" min="1" max="180" value={form.durasi}
              onChange={e => setForm(f => ({ ...f, durasi: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isAktifG" checked={form.isAktif} onChange={e => setForm(f => ({ ...f, isAktif: e.target.checked }))} className="w-4 h-4" />
            <label htmlFor="isAktifG" className="text-sm text-gray-700">Kuis Aktif</label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Batal</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-60">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
