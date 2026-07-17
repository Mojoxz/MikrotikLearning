'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Materi {
  id: number; judul: string; deskripsi: string | null; kategori: string
  filePdf: string | null; videoYoutube: string | null; createdAt: string
  guru?: { nama: string }; mapel?: { nama: string } | null; _count?: { kuis: number }
}

export default function MuridMateriPage() {
  const [materi, setMateri] = useState<Materi[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterKategori, setFilterKategori] = useState('')

  useEffect(() => {
    fetch('/api/materi').then(r => r.json()).then(data => {
      if (data.success) setMateri(data.data)
      setLoading(false)
    })
  }, [])

  const kategoriList = [...new Set(materi.map(m => m.kategori))]
  const filtered = materi.filter(m =>
    (search === '' || m.judul.toLowerCase().includes(search.toLowerCase())) &&
    (filterKategori === '' || m.kategori === filterKategori)
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Materi</h1>
        <p className="text-gray-500 text-sm">Pelajari materi pembelajaran Mikrotik</p>
      </div>

      <div className="flex gap-3 mb-6">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari materi..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
        <select value={filterKategori} onChange={e => setFilterKategori(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
          <option value="">Semua Kategori</option>
          {kategoriList.map(k => <option key={k}>{k}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Tidak ada materi</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(m => (
            <Link key={m.id} href={`/murid/materi/${m.id}`}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 block">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">{m.kategori}</span>
                <span className="text-xs text-gray-400">{m._count?.kuis ?? 0} kuis</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{m.judul}</h3>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{m.deskripsi || 'Tidak ada deskripsi'}</p>
              <div className="flex gap-1 flex-wrap mb-3">
                {m.filePdf && <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded">📄 PDF</span>}
                {m.videoYoutube && <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded">▶️ Video</span>}
                {m.mapel && <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{m.mapel.nama}</span>}
              </div>
              <div className="text-xs text-gray-400">Oleh: {m.guru?.nama}</div>
              <div className="mt-3 text-xs text-purple-600 font-medium">Baca Materi →</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
