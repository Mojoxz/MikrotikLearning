'use client'

import { useEffect, useState } from 'react'

interface HasilKuis {
  id: number; nilai: number; totalBenar: number; totalSoal: number; createdAt: string
  user?: { nama: string; email: string }; kuis?: { judul: string; materi?: { judul: string } }
}

export default function GuruNilaiPage() {
  const [hasil, setHasil] = useState<HasilKuis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/nilai').then(r => r.json()).then(data => {
      if (data.success) setHasil(data.data)
      setLoading(false)
    })
  }, [])

  const nilaiColor = (n: number) => n >= 80 ? 'text-green-600' : n >= 60 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Nilai Murid</h1>
        <p className="text-gray-500 text-sm">Rekap nilai dari kuis yang Anda buat</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">#</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Murid</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Kuis</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Nilai</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Benar/Total</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Memuat...</td></tr>
              : hasil.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Belum ada data</td></tr>
              : hasil.map((h, i) => (
                <tr key={h.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3"><div className="font-medium">{h.user?.nama}</div><div className="text-xs text-gray-400">{h.user?.email}</div></td>
                  <td className="px-4 py-3"><div>{h.kuis?.judul}</div><div className="text-xs text-gray-400">{h.kuis?.materi?.judul}</div></td>
                  <td className="px-4 py-3"><span className={`font-bold text-lg ${nilaiColor(h.nilai)}`}>{h.nilai.toFixed(1)}</span></td>
                  <td className="px-4 py-3">{h.totalBenar}/{h.totalSoal}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(h.createdAt).toLocaleDateString('id-ID')}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
