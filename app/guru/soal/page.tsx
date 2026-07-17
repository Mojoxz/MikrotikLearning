'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'

interface Soal {
  id: number; kuisId: number; pertanyaan: string; pilihanA: string; pilihanB: string
  pilihanC: string; pilihanD: string; jawabanBenar: string; bobotNilai: number
}
interface Kuis { id: number; judul: string }

export default function GuruSoalPage() {
  const [soal, setSoal] = useState<Soal[]>([])
  const [kuis, setKuis] = useState<Kuis[]>([])
  const [filterKuis, setFilterKuis] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [edit, setEdit] = useState<Soal | null>(null)
  const [form, setForm] = useState({ kuisId: '', pertanyaan: '', pilihanA: '', pilihanB: '', pilihanC: '', pilihanD: '', jawabanBenar: 'A', bobotNilai: '10' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  const loadKuis = async () => {
    const res = await fetch('/api/kuis')
    const data = await res.json()
    if (data.success) setKuis(data.data)
  }

  const loadSoal = async () => {
    if (!filterKuis) { setSoal([]); return }
    setLoading(true)
    const res = await fetch(`/api/soal?kuisId=${filterKuis}`)
    const data = await res.json()
    if (data.success) setSoal(data.data)
    setLoading(false)
  }

  useEffect(() => { loadKuis() }, [])
  useEffect(() => { loadSoal() }, [filterKuis])

  const openCreate = () => {
    setEdit(null); setForm({ kuisId: filterKuis, pertanyaan: '', pilihanA: '', pilihanB: '', pilihanC: '', pilihanD: '', jawabanBenar: 'A', bobotNilai: '10' }); setIsOpen(true)
  }
  const openEdit = (s: Soal) => {
    setEdit(s); setForm({ kuisId: s.kuisId.toString(), pertanyaan: s.pertanyaan, pilihanA: s.pilihanA, pilihanB: s.pilihanB, pilihanC: s.pilihanC, pilihanD: s.pilihanD, jawabanBenar: s.jawabanBenar, bobotNilai: s.bobotNilai.toString() }); setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg({ type: '', text: '' })
    const url = edit ? `/api/soal/${edit.id}` : '/api/soal'
    const method = edit ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.success) { setMsg({ type: 'success', text: 'Berhasil' }); setIsOpen(false); loadSoal() }
    else setMsg({ type: 'error', text: data.error || 'Gagal' })
    setSaving(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus soal ini?')) return
    const res = await fetch(`/api/soal/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) { setMsg({ type: 'success', text: 'Dihapus' }); loadSoal() }
    else setMsg({ type: 'error', text: data.error || 'Gagal' })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Soal Kuis</h1>
          <p className="text-gray-500 text-sm">Kelola soal pilihan ganda</p>
        </div>
        <button onClick={openCreate} disabled={!filterKuis} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">+ Tambah Soal</button>
      </div>

      {msg.text && !isOpen && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg.text}</div>
      )}

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kuis</label>
        <select value={filterKuis} onChange={e => setFilterKuis(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="">-- Pilih Kuis --</option>
          {kuis.map(k => <option key={k.id} value={k.id}>{k.judul}</option>)}
        </select>
      </div>

      {filterKuis && (
        <div className="space-y-4">
          {loading ? <div className="text-center py-8 text-gray-400">Memuat...</div>
            : soal.length === 0 ? <div className="bg-white rounded-lg shadow px-4 py-8 text-center text-gray-400">Belum ada soal</div>
            : soal.map((s, i) => (
              <div key={s.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 mb-2"><span className="text-gray-400 mr-2">{i + 1}.</span>{s.pertanyaan}</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {(['A', 'B', 'C', 'D'] as const).map(opt => (
                        <div key={opt} className={`p-2 rounded border text-sm ${s.jawabanBenar === opt ? 'bg-green-50 border-green-300 text-green-700 font-medium' : 'border-gray-200'}`}>
                          <span className="font-medium">{opt}.</span> {s[`pilihan${opt}` as keyof Soal] as string}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">Bobot: {s.bobotNilai} poin</div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => openEdit(s)} className="text-blue-600 text-xs border border-blue-300 px-2 py-1 rounded hover:bg-blue-50">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-600 text-xs border border-red-300 px-2 py-1 rounded hover:bg-red-50">Hapus</button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={edit ? 'Edit Soal' : 'Tambah Soal'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {msg.text && isOpen && <div className={`px-3 py-2 rounded text-sm ${msg.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{msg.text}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kuis *</label>
            <select required value={form.kuisId} onChange={e => setForm(f => ({ ...f, kuisId: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">-- Pilih Kuis --</option>
              {kuis.map(k => <option key={k.id} value={k.id}>{k.judul}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan *</label>
            <textarea required value={form.pertanyaan} onChange={e => setForm(f => ({ ...f, pertanyaan: e.target.value }))}
              rows={3} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(['A', 'B', 'C', 'D'] as const).map(opt => (
              <div key={opt}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilihan {opt} *</label>
                <input required value={form[`pilihan${opt}` as keyof typeof form] as string}
                  onChange={e => setForm(f => ({ ...f, [`pilihan${opt}`]: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jawaban Benar *</label>
              <select value={form.jawabanBenar} onChange={e => setForm(f => ({ ...f, jawabanBenar: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>A</option><option>B</option><option>C</option><option>D</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bobot Nilai</label>
              <input type="number" min="1" max="100" value={form.bobotNilai}
                onChange={e => setForm(f => ({ ...f, bobotNilai: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
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
