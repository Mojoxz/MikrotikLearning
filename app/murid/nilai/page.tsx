'use client'

import { useEffect, useState } from 'react'

interface HasilKuis {
  id: number
  nilai: number
  totalBenar: number
  totalSoal: number
  waktuMulai: string
  waktuSelesai: string
  createdAt: string
  kuis?: {
    judul: string
    durasi: number
    materi?: { judul: string }
  }
}

export default function MuridNilaiPage() {
  const [hasil, setHasil] = useState<HasilKuis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/nilai')
      .then(r => r.json())
      .then(data => {
        if (data.success) setHasil(data.data)
        setLoading(false)
      })
  }, [])

  const nilaiColor = (n: number) =>
    n >= 80 ? 'text-green-600' : n >= 60 ? 'text-yellow-600' : 'text-red-600'

  const nilaiBg = (n: number) =>
    n >= 80 ? 'bg-green-50 border-green-200' : n >= 60 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'

  const rataRata =
    hasil.length > 0
      ? (hasil.reduce((a, h) => a + h.nilai, 0) / hasil.length).toFixed(1)
      : '-'

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Nilai</h1>
        <p className="text-gray-500 text-sm">Rekap hasil pengerjaan kuis Anda</p>
      </div>

      {/* Summary */}
      {!loading && hasil.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center border-l-4 border-purple-500">
            <div className="text-2xl font-bold text-purple-600">{hasil.length}</div>
            <div className="text-xs text-gray-500 mt-1">Kuis Dikerjakan</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-blue-600">{rataRata}</div>
            <div className="text-xs text-gray-500 mt-1">Rata-rata Nilai</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-600">
              {hasil.filter(h => h.nilai >= 80).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Nilai A (≥80)</div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : hasil.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-4">📊</div>
          <p>Anda belum mengerjakan kuis apapun</p>
          <a href="/murid/kuis" className="mt-4 inline-block text-purple-600 hover:underline text-sm">
            Kerjakan Kuis Sekarang →
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {hasil.map((h, i) => (
            <div key={h.id} className={`bg-white rounded-lg shadow border p-4 ${nilaiBg(h.nilai)}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{h.kuis?.judul}</h3>
                  <p className="text-sm text-gray-500">{h.kuis?.materi?.judul}</p>
                  <div className="flex gap-4 mt-1 text-xs text-gray-400">
                    <span>✅ {h.totalBenar}/{h.totalSoal} benar</span>
                    <span>📅 {new Date(h.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className={`text-3xl font-bold ${nilaiColor(h.nilai)}`}>
                    {h.nilai.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {h.nilai >= 80 ? 'Sangat Baik' : h.nilai >= 60 ? 'Cukup' : 'Perlu Belajar'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
