'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import Link from 'next/link'

interface Materi {
  id: number; judul: string; deskripsi: string | null; kategori: string
  filePdf: string | null; videoYoutube: string | null; isiMateri: string | null
  createdAt: string; guru?: { nama: string; email: string }
  mapel?: { nama: string; kode: string } | null
  kuis?: { id: number; judul: string; durasi: number }[]
}

function getYoutubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

export default function MateriDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [materi, setMateri] = useState<Materi | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/materi/${id}`).then(r => r.json()).then(data => {
      if (data.success) setMateri(data.data)
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="p-6 text-center text-gray-400">Memuat...</div>
  if (!materi) return <div className="p-6 text-center text-gray-400">Materi tidak ditemukan</div>

  const youtubeId = materi.videoYoutube ? getYoutubeId(materi.videoYoutube) : null

  return (
    <div className="p-6 max-w-4xl">
      <Link href="/murid/materi" className="text-purple-600 text-sm mb-4 inline-block hover:text-purple-700">
        ← Kembali ke Daftar Materi
      </Link>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">{materi.kategori}</span>
          {materi.mapel && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{materi.mapel.nama}</span>}
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{materi.judul}</h1>
        <p className="text-gray-500 text-sm">Oleh: {materi.guru?.nama} • {new Date(materi.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        {materi.deskripsi && <p className="mt-3 text-gray-600">{materi.deskripsi}</p>}
      </div>

      {/* Video YouTube */}
      {youtubeId && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="font-bold text-gray-700 mb-3">Video Pembelajaran</h2>
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              className="w-full h-full rounded-lg"
              allowFullScreen
              title="Video Materi"
            />
          </div>
        </div>
      )}

      {/* File PDF */}
      {materi.filePdf && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="font-bold text-gray-700 mb-3">Modul PDF</h2>
          <a href={materi.filePdf} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm">
            📄 Buka / Download PDF
          </a>
        </div>
      )}

      {/* Isi Materi */}
      {materi.isiMateri && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="font-bold text-gray-700 mb-4">Isi Materi</h2>
          <div
            className="prose max-w-none text-gray-700 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: materi.isiMateri }}
          />
        </div>
      )}

      {/* Kuis Terkait */}
      {materi.kuis && materi.kuis.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-gray-700 mb-4">Kuis Terkait</h2>
          <div className="space-y-3">
            {materi.kuis.map(k => (
              <div key={k.id} className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <p className="font-medium text-gray-800">{k.judul}</p>
                  <p className="text-xs text-gray-400">Durasi: {k.durasi} menit</p>
                </div>
                <Link href={`/murid/kuis/${k.id}`}
                  className="bg-purple-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Kerjakan
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
