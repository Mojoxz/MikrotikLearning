'use client'

import { useState, useEffect, useRef } from 'react'
import Modal from '@/components/Modal'

interface Materi {
  id: number; judul: string; deskripsi: string | null; kategori: string
  filePdf: string | null; videoYoutube: string | null; isiMateri: string | null
  guruId: number; mapelId: number | null; createdAt: string
  mapel?: { nama: string } | null; _count?: { kuis: number }
}
interface Mapel { id: number; nama: string; kode: string }

export default function GuruMateriPage() {
  const [materi, setMateri] = useState<Materi[]>([])
  const [mapelList, setMapelList] = useState<Mapel[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [edit, setEdit] = useState<Materi | null>(null)
  const [form, setForm] = useState({ judul: '', deskripsi: '', kategori: 'Dasar', videoYoutube: '', isiMateri: '', mapelId: '', filePdf: '' })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })
  const fileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    const [mr, ml] = await Promise.all([
      fetch('/api/materi').then(r => r.json()),
      fetch('/api/mapel').then(r => r.json()),
    ])
    if (mr.success) setMateri(mr.data)
    if (ml.success) setMapelList(ml.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEdit(null); setForm({ judul: '', deskripsi: '', kategori: 'Dasar', videoYoutube: '', isiMateri: '', mapelId: '', filePdf: '' }); setIsOpen(true)
  }
  const openEdit = (m: Materi) => {
    setEdit(m); setForm({ judul: m.judul, deskripsi: m.deskripsi || '', kategori: m.kategori, videoYoutube: m.videoYoutube || '', isiMateri: m.isiMateri || '', mapelId: m.mapelId?.toString() || '', filePdf: m.filePdf || '' }); setIsOpen(true)
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.success) setForm(f => ({ ...f, filePdf: data.data.filePath }))
    else setMsg({ type: 'error', text: data.error || 'Upload gagal' })
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg({ type: '', text: '' })
    const body = { ...form, mapelId: form.mapelId || null }
    const url = edit ? `/api/materi/${edit.id}` : '/api/materi'
    const method = edit ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    if (data.success) { setMsg({ type: 'success', text: 'Berhasil disimpan' }); setIsOpen(false); load() }
    else setMsg({ type: 'error', text: data.error || 'Gagal' })
    setSaving(false)
  }

  const handleDelete = async (id: number, judul: string) => {
    if (!confirm(`Hapus materi "${judul}"?`)) return
    const res = await fetch(`/api/materi/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) { setMsg({ type: 'success', text: 'Dihapus' }); load() }
    else setMsg({ type: 'error', text: data.error || 'Gagal' })
  }

  const kategoriList = ['Dasar', 'Jaringan', 'Keamanan', 'Routing', 'Firewall', 'VPN', 'Hotspot', 'Lainnya']

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Materi Saya</h1>
          <p className="text-gray-500 text-sm">Kelola materi yang Anda buat</p>
        </div>
        <button onClick={openCreate} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">+ Tambah Materi</button>
      </div>

      {msg.text && !isOpen && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg.text}</div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-lg" />)
          : materi.length === 0 ? <div className="col-span-3 text-center py-12 text-gray-400">Belum ada materi</div>
          : materi.map(m => (
            <div key={m.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">{m.kategori}</span>
                <span className="text-xs text-gray-400">{m._count?.kuis ?? 0} kuis</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{m.judul}</h3>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{m.deskripsi || 'Tidak ada deskripsi'}</p>
              <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                {m.filePdf && <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded">PDF</span>}
                {m.videoYoutube && <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded">Video</span>}
                {m.mapel && <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{m.mapel.nama}</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(m)} className="flex-1 text-center text-blue-600 text-xs border border-blue-300 px-2 py-1 rounded hover:bg-blue-50">Edit</button>
                <button onClick={() => handleDelete(m.id, m.judul)} className="flex-1 text-center text-red-600 text-xs border border-red-300 px-2 py-1 rounded hover:bg-red-50">Hapus</button>
              </div>
            </div>
          ))}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={edit ? 'Edit Materi' : 'Tambah Materi'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {msg.text && isOpen && <div className={`px-3 py-2 rounded text-sm ${msg.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{msg.text}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
            <input required value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {kategoriList.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
              <select value={form.mapelId} onChange={e => setForm(f => ({ ...f, mapelId: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">-- Pilih --</option>
                {mapelList.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video YouTube (URL)</label>
            <input value={form.videoYoutube} onChange={e => setForm(f => ({ ...f, videoYoutube: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=..." className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload PDF</label>
            <input ref={fileRef} type="file" accept=".pdf" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} className="hidden" />
            <div className="flex gap-2 items-center">
              <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50">
                {uploading ? 'Mengupload...' : 'Pilih PDF'}
              </button>
              {form.filePdf && <span className="text-sm text-green-600">✓ {form.filePdf.split('/').pop()}</span>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea value={form.deskripsi} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))}
              rows={2} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Isi Materi (HTML/Teks)</label>
            <textarea value={form.isiMateri} onChange={e => setForm(f => ({ ...f, isiMateri: e.target.value }))}
              rows={6} className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500" />
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
