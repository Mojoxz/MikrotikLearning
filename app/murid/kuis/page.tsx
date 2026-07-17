'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Kuis {
  id: number
  judul: string
  durasi: number
  isAktif: boolean
  createdAt: string
  materi?: { id: number; judul: string; kategori: string }
  guru?: { nama: string }
  _count?: { soal: number }
}

interface StatusKuis {
  [kuisId: number]: { sudahDikerjakan: boolean; nilai?: number }
}

export default function MuridKuisPage() {
  const [kuis, setKuis] = useState<Kuis[]>([])
  const [statusMap, setStatusMap] = useState<StatusKuis>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/kuis')
      .then(r => r.json())
      .then(async data => {
        if (data.success) {
          setKuis(data.data)
          // Cek status pengerjaan untuk setiap kuis
          const statuses: StatusKuis = {}
          await Promise.all(
            data.data.map(async (k: Kuis) => {
              const res = await fetch(`/api/kuis/${k.id}/kerjakan`)
              const sd = await res.json()
              if (sd.success) {
                statuses[k.id] = {
                  sudahDikerjakan: sd.data.sudahDikerjakan,
                  nilai: sd.data.hasil?.nilai,
                }
              }
            })
          )
          setStatusMap(statuses)
        }
        setLoading(false)
      })
  }, [])

  const nilaiColor = (n: number) =>
    n >= 80 ? 'text-green-600' : n >= 60 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Kuis</h1>
        <p className="text-gray-500 text-sm">Kerjakan kuis untuk menguji pemahaman Anda</p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : kuis.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-4">📝</div>
          <p>Belum ada kuis yang tersedia</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {kuis.map(k => {
            const status = statusMap[k.id]
            const sudahDikerjakan = status?.sudahDikerjakan ?? false

            return (
              <div key={k.id} className="bg-white rounded-lg shadow p-5 border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                    {k.materi?.kategori}
                  </span>
                  {sudahDikerjakan ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                      ✓ Selesai
                    </span>
                  ) : (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      Belum dikerjakan
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-gray-800 mb-1">{k.judul}</h3>
                <p className="text-sm text-gray-500 mb-3">{k.materi?.judul}</p>

                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span>⏱️ {k.durasi} menit</span>
                  <span>❓ {k._count?.soal ?? 0} soal</span>
                  <span>👨‍🏫 {k.guru?.nama}</span>
                </div>

                {sudahDikerjakan && status?.nilai !== undefined ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Nilai Anda:</span>
                    <span className={`text-2xl font-bold ${nilaiColor(status.nilai)}`}>
                      {status.nilai.toFixed(1)}
                    </span>
                  </div>
                ) : (
                  <Link
                    href={`/murid/kuis/${k.id}`}
                    className="block w-full text-center bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors font-medium"
                  >
                    Mulai Kerjakan →
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
