'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'

interface Mapel { id: number; nama: string; kode: string; deskripsi: string | null }

export default function AdminMapelPage() {
  const [mapel, setMapel] = useState<Mapel[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [edit, setEdit] = useState<Mapel | null>(null)
  const [form, setForm] = useState({ nama: '', kode: '', deskripsi: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/mapel')
    const data = await res.json()
    if (data.success) setMapel(data.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEdit(null); setForm({ nama: '', kode: '', deskripsi: '' }); setIsOpen(true) }
  const openEdit = (m: Mapel) => { setEdit(m); setForm({ nama: m.nama, kode: m.kode, deskripsi: m.deskripsi || '' }); setIsOpen(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg({ type: '', text: '' })
    const url = edit ? `/api/mapel/${edit.id}` : '/api/mapel'
    const method = edit ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.success) { setMsg({ type: 'success', text: 'Berhasil disimpan' }); setIsOpen(false); load() }
    else setMsg({ type: 'error', text: data.error || 'Gagal' })
    setSaving(false)
  }

  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Hapus "${nama}"?`)) return
    const res = await fetch(`/api/mapel/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) { setMsg({ type: 'success', text: 'Dihapus' }); load() }
    else setMsg({ type: 'error', text: data.error || 'Gagal' })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mata Pelajaran</h1>
          <p className="text-gray-500 text-sm">Manajemen mata pelajaran</p>
        </div>
        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">+ Tambah Mapel</button>
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
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Nama</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Kode</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Deskripsi</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Memuat...</td></tr>
              : mapel.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Tidak ada data</td></tr>
              : mapel.map((m, i) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{m.nama}</td>
                  <td className="px-4 py-3"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{m.kode}</span></td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{m.deskripsi || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(m)} className="text-blue-600 text-xs border border-blue-300 px-2 py-1 rounded hover:bg-blue-50">Edit</button>
                      <button onClick={() => handleDelete(m.id, m.nama)} className="text-red-600 text-xs border border-red-300 px-2 py-1 rounded hover:bg-red-50">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={edit ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Mata Pelajaran</label>
            <input required value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kode</label>
            <input required value={form.kode} onChange={e => setForm(f => ({ ...f, kode: e.target.value.toUpperCase() }))}
              placeholder="cth: AIJ" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea value={form.deskripsi} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))}
              rows={3} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
