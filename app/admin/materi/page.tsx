'use client'

import { useState, useEffect, useRef } from 'react'
import Modal from '@/components/Modal'

interface Materi {
  id: number; judul: string; deskripsi: string | null; kategori: string
  filePdf: string | null; videoYoutube: string | null; isiMateri: string | null
  guruId: number; mapelId: number | null; createdAt: string
  guru?: { nama: string }; mapel?: { nama: string } | null
  _count?: { kuis: number }
}

interface Mapel { id: number; nama: string; kode: string }
interface Guru { id: number; nama: string }

export default function AdminMateriPage() {
  const [materi, setMateri] = useState<Materi[]>([])
  const [mapelList, setMapelList] = useState<Mapel[]>([])
  const [guruList, setGuruList] = useState<Guru[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [edit, setEdit] = useState<Materi | null>(null)
  const [form, setForm] = useState({ judul: '', deskripsi: '', kategori: 'Dasar', videoYoutube: '', isiMateri: '', mapelId: '', guruId: '', filePdf: '' })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })
  const fileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    const [mr, ml, gl] = await Promise.all([
      fetch('/api/materi').then(r => r.json()),
      fetch('/api/mapel').then(r => r.json()),
      fetch('/api/users?role=guru').then(r => r.json()),
    ])
    if (mr.success) setMateri(mr.data)
    if (ml.success) setMapelList(ml.data)
    if (gl.success) setGuruList(gl.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEdit(null)
    setForm({ judul: '', deskripsi: '', kategori: 'Dasar', videoYoutube: '', isiMateri: '', mapelId: '', guruId: '', filePdf: '' })
    setIsOpen(true)
  }

  const openEdit = (m: Materi) => {
    setEdit(m)
    setForm({
      judul: m.judul, deskripsi: m.deskripsi || '', kategori: m.kategori,
      videoYoutube: m.videoYoutube || '', isiMateri: m.isiMateri || '',
      mapelId: m.mapelId?.toString() || '', guruId: m.guruId.toString(), filePdf: m.filePdf || ''
    })
    setIsOpen(true)
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.success) setForm(f => ({ ...f, filePdf: data.data.filePath }))
    else setMsg({ type: 'error', text: data.error || 'Upload gagal' })
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg({ type: '', text: '' })
    const body = { ...form, mapelId: form.mapelId || null, guruId: form.guruId || null }
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
          <h1 className="text-2xl font-bold text-gray-800">Materi</h1>
          <p className="text-gray-500 text-sm">Kelola materi pembelajaran</p>
        </div>
        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">+ Tambah Materi</button>
      </div>

      {msg.text && !isOpen && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {msg.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">#</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Judul</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Kategori</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Guru</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Kuis</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Memuat...</td></tr>
              : materi.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Tidak ada data</td></tr>
              : materi.map((m, i) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{m.judul}</div>
                    <div className="text-xs text-gray-400">{m.mapel?.nama || '-'}</div>
                  </td>
                  <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{m.kategori}</span></td>
                  <td className="px-4 py-3 text-gray-600">{m.guru?.nama || '-'}</td>
                  <td className="px-4 py-3">{m._count?.kuis ?? 0} kuis</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(m)} className="text-blue-600 text-xs border border-blue-300 px-2 py-1 rounded hover:bg-blue-50">Edit</button>
                      <button onClick={() => handleDelete(m.id, m.judul)} className="text-red-600 text-xs border border-red-300 px-2 py-1 rounded hover:bg-red-50">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={edit ? 'Edit Materi' : 'Tambah Materi'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {msg.text && isOpen && (
            <div className={`px-3 py-2 rounded text-sm ${msg.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{msg.text}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Materi *</label>
              <input required value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
              <select value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {kategoriList.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guru Pembuat *</label>
              <select required value={form.guruId} onChange={e => setForm(f => ({ ...f, guruId: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Pilih Guru --</option>
                {guruList.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
              <select value={form.mapelId} onChange={e => setForm(f => ({ ...f, mapelId: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Pilih Mapel --</option>
                {mapelList.map(m => <option key={m.id} value={m.id}>{m.nama} ({m.kode})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video YouTube (URL)</label>
              <input value={form.videoYoutube} onChange={e => setForm(f => ({ ...f, videoYoutube: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..." className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload PDF</label>
              <input ref={fileRef} type="file" accept=".pdf" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} className="hidden" />
              <div className="flex gap-2 items-center">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50">
                  {uploading ? 'Mengupload...' : 'Pilih PDF'}
                </button>
                {form.filePdf && <span className="text-sm text-green-600">✓ {form.filePdf.split('/').pop()}</span>}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea value={form.deskripsi} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))}
                rows={2} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Isi Materi (HTML/Teks)</label>
              <textarea value={form.isiMateri} onChange={e => setForm(f => ({ ...f, isiMateri: e.target.value }))}
                rows={6} placeholder="Masukkan isi materi..." className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Batal</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
