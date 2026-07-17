'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'

interface Kelas { id: number; namaKelas: string; tingkat: string; jurusan: string; _count?: { users: number } }

export default function AdminKelasPage() {
  const [kelas, setKelas] = useState<Kelas[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [edit, setEdit] = useState<Kelas | null>(null)
  const [form, setForm] = useState({ namaKelas: '', tingkat: 'XI', jurusan: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/kelas')
    const data = await res.json()
    if (data.success) setKelas(data.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEdit(null); setForm({ namaKelas: '', tingkat: 'XI', jurusan: '' }); setIsOpen(true) }
  const openEdit = (k: Kelas) => { setEdit(k); setForm({ namaKelas: k.namaKelas, tingkat: k.tingkat, jurusan: k.jurusan }); setIsOpen(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg({ type: '', text: '' })
    const url = edit ? `/api/kelas/${edit.id}` : '/api/kelas'
    const method = edit ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.success) { setMsg({ type: 'success', text: 'Berhasil disimpan' }); setIsOpen(false); load() }
    else setMsg({ type: 'error', text: data.error || 'Gagal' })
    setSaving(false)
  }

  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Hapus kelas "${nama}"?`)) return
    const res = await fetch(`/api/kelas/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) { setMsg({ type: 'success', text: 'Kelas dihapus' }); load() }
    else setMsg({ type: 'error', text: data.error || 'Gagal' })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Kelas</h1>
          <p className="text-gray-500 text-sm">Manajemen data kelas</p>
        </div>
        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">+ Tambah Kelas</button>
      </div>

      {msg.text && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {msg.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">#</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Nama Kelas</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Tingkat</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Jurusan</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Murid</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Memuat...</td></tr>
              : kelas.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Tidak ada data</td></tr>
              : kelas.map((k, i) => (
                <tr key={k.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{k.namaKelas}</td>
                  <td className="px-4 py-3">{k.tingkat}</td>
                  <td className="px-4 py-3">{k.jurusan}</td>
                  <td className="px-4 py-3">{k._count?.users ?? 0} murid</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(k)} className="text-blue-600 text-xs border border-blue-300 px-2 py-1 rounded hover:bg-blue-50">Edit</button>
                      <button onClick={() => handleDelete(k.id, k.namaKelas)} className="text-red-600 text-xs border border-red-300 px-2 py-1 rounded hover:bg-red-50">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={edit ? 'Edit Kelas' : 'Tambah Kelas'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kelas</label>
            <input required value={form.namaKelas} onChange={e => setForm(f => ({ ...f, namaKelas: e.target.value }))}
              placeholder="cth: XI TKJ 1" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat</label>
            <select value={form.tingkat} onChange={e => setForm(f => ({ ...f, tingkat: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>X</option><option>XI</option><option>XII</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jurusan</label>
            <input required value={form.jurusan} onChange={e => setForm(f => ({ ...f, jurusan: e.target.value }))}
              placeholder="cth: Teknik Komputer dan Jaringan" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
