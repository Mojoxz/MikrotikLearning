'use client'

import { useEffect, useState, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'

interface Soal {
  id: number
  pertanyaan: string
  pilihanA: string
  pilihanB: string
  pilihanC: string
  pilihanD: string
  bobotNilai: number
}

interface KuisDetail {
  id: number
  judul: string
  durasi: number
  materi?: { judul: string }
  soal: Soal[]
}

interface HasilSubmit {
  nilai: number
  totalBenar: number
  totalSoal: number
  jawabanBenar: { soalId: number; jawabanBenar: string }[]
}

type Jawaban = { [soalId: number]: string }

export default function KerjakanKuisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [kuis, setKuis] = useState<KuisDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [sudahDikerjakan, setSudahDikerjakan] = useState(false)
  const [hasilLama, setHasilLama] = useState<any>(null)

  const [jawaban, setJawaban] = useState<Jawaban>({})
  const [waktuMulai] = useState(new Date().toISOString())
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [hasil, setHasil] = useState<HasilSubmit | null>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    // Cek apakah sudah pernah dikerjakan
    Promise.all([
      fetch(`/api/kuis/${id}`).then(r => r.json()),
      fetch(`/api/kuis/${id}/kerjakan`).then(r => r.json()),
    ]).then(([kuisData, statusData]) => {
      if (kuisData.success) {
        setKuis(kuisData.data)
        setTimeLeft(kuisData.data.durasi * 60)
      }
      if (statusData.success && statusData.data.sudahDikerjakan) {
        setSudahDikerjakan(true)
        setHasilLama(statusData.data.hasil)
      }
      setLoading(false)
    })
  }, [id])

  const handleSubmit = useCallback(async (isAuto = false) => {
    if (submitting || hasil) return
    setSubmitting(true)

    const jawabanArr = Object.entries(jawaban).map(([soalId, jwb]) => ({
      soalId: parseInt(soalId),
      jawaban: jwb,
    }))

    const res = await fetch(`/api/kuis/${id}/kerjakan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jawaban: jawabanArr, waktuMulai }),
    })
    const data = await res.json()

    if (data.success) {
      setHasil(data.data)
    } else {
      alert(data.error || 'Gagal mengumpulkan kuis')
    }
    setSubmitting(false)
  }, [submitting, hasil, jawaban, id, waktuMulai])

  // Timer countdown
  useEffect(() => {
    if (!started || hasil || !kuis) return

    if (timeLeft <= 0) {
      handleSubmit(true)
      return
    }

    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval)
          handleSubmit(true)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [started, hasil, timeLeft, kuis, handleSubmit])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const nilaiColor = (n: number) =>
    n >= 80 ? 'text-green-600 bg-green-50' : n >= 60 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'

  const nilaiText = (n: number) =>
    n >= 80 ? 'Sangat Baik 🎉' : n >= 60 ? 'Cukup Baik 👍' : 'Perlu Belajar Lagi 📚'

  if (loading) return <div className="p-6 text-center text-gray-400">Memuat kuis...</div>

  if (!kuis) return <div className="p-6 text-center text-gray-400">Kuis tidak ditemukan</div>

  // Sudah pernah dikerjakan
  if (sudahDikerjakan && hasilLama) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Kuis Sudah Dikerjakan</h2>
          <p className="text-gray-500 mb-6">Anda sudah mengerjakan kuis ini sebelumnya</p>
          <div className={`inline-block px-8 py-4 rounded-xl mb-4 ${nilaiColor(hasilLama.nilai)}`}>
            <div className="text-5xl font-bold">{hasilLama.nilai.toFixed(1)}</div>
            <div className="text-sm mt-1">{nilaiText(hasilLama.nilai)}</div>
          </div>
          <div className="text-gray-500 text-sm mb-6">
            {hasilLama.totalBenar} / {hasilLama.totalSoal} soal benar
          </div>
          <button
            onClick={() => router.push('/murid/kuis')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Kembali ke Daftar Kuis
          </button>
        </div>
      </div>
    )
  }

  // Hasil setelah submit
  if (hasil) {
    const jawabanBenarMap: { [id: number]: string } = {}
    hasil.jawabanBenar?.forEach((j: any) => { jawabanBenarMap[j.soalId] = j.jawabanBenar })

    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow p-8 mb-6 text-center">
          <div className="text-5xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Kuis Selesai!</h2>
          <div className={`inline-block px-10 py-5 rounded-xl mb-4 ${nilaiColor(hasil.nilai)}`}>
            <div className="text-6xl font-bold">{hasil.nilai.toFixed(1)}</div>
            <div className="text-sm mt-1 font-medium">{nilaiText(hasil.nilai)}</div>
          </div>
          <p className="text-gray-500 mb-6">
            Jawaban Benar: <strong>{hasil.totalBenar}</strong> dari <strong>{hasil.totalSoal}</strong> soal
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/murid/kuis')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Kembali ke Daftar Kuis
            </button>
            <button
              onClick={() => router.push('/murid/nilai')}
              className="border border-purple-600 text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50"
            >
              Lihat Riwayat Nilai
            </button>
          </div>
        </div>

        {/* Review Jawaban */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-gray-800 mb-4">Review Jawaban</h3>
          <div className="space-y-4">
            {kuis.soal.map((s, i) => {
              const jawabanMurid = jawaban[s.id]
              const benar = jawabanBenarMap[s.id]
              const isBenar = jawabanMurid === benar

              return (
                <div key={s.id} className={`p-4 rounded-lg border-2 ${isBenar ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                  <p className="font-medium text-gray-800 mb-2">
                    <span className="text-gray-400 mr-2">{i + 1}.</span>
                    {s.pertanyaan}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {(['A', 'B', 'C', 'D'] as const).map(opt => {
                      const isJawabanMurid = jawabanMurid === opt
                      const isJawabanBenar = benar === opt
                      return (
                        <div
                          key={opt}
                          className={`p-2 rounded border text-sm ${
                            isJawabanBenar ? 'bg-green-200 border-green-400 font-semibold' :
                            isJawabanMurid && !isJawabanBenar ? 'bg-red-200 border-red-400' :
                            'bg-white border-gray-200'
                          }`}
                        >
                          <span className="font-medium">{opt}.</span>{' '}
                          {s[`pilihan${opt}` as keyof Soal] as string}
                          {isJawabanMurid && !isJawabanBenar && ' ✗'}
                          {isJawabanBenar && ' ✓'}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Halaman mulai kuis
  if (!started) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="text-5xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{kuis.judul}</h1>
          <p className="text-gray-500 mb-2">{kuis.materi?.judul}</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Jumlah Soal</span>
              <strong>{kuis.soal.length} soal</strong>
            </div>
            <div className="flex justify-between">
              <span>Durasi</span>
              <strong>{kuis.durasi} menit</strong>
            </div>
            <div className="flex justify-between">
              <span>Tipe Soal</span>
              <strong>Pilihan Ganda</strong>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 text-xs text-yellow-700 text-left">
            ⚠️ <strong>Perhatian:</strong> Kuis ini hanya bisa dikerjakan sekali. Timer akan berjalan otomatis. Kuis akan dikumpulkan otomatis jika waktu habis.
          </div>
          <button
            onClick={() => setStarted(true)}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors text-lg"
          >
            Mulai Kuis →
          </button>
          <button
            onClick={() => router.push('/murid/kuis')}
            className="mt-3 w-full text-gray-500 text-sm hover:text-gray-700"
          >
            Kembali
          </button>
        </div>
      </div>
    )
  }

  // Halaman pengerjaan kuis
  const dijawab = Object.keys(jawaban).length
  const timerDanger = timeLeft <= 60

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Sticky header timer */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 sticky top-0 z-10 flex items-center justify-between border border-gray-200">
        <div>
          <h2 className="font-bold text-gray-800">{kuis.judul}</h2>
          <p className="text-xs text-gray-500">{dijawab}/{kuis.soal.length} soal dijawab</p>
        </div>
        <div className={`text-2xl font-bold font-mono px-4 py-2 rounded-lg ${timerDanger ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-700'}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-purple-600 h-2 rounded-full transition-all"
          style={{ width: `${(dijawab / kuis.soal.length) * 100}%` }}
        />
      </div>

      {/* Soal-soal */}
      <div className="space-y-6">
        {kuis.soal.map((s, i) => (
          <div key={s.id} className="bg-white rounded-xl shadow p-5">
            <p className="font-semibold text-gray-800 mb-4">
              <span className="inline-flex items-center justify-center w-7 h-7 bg-purple-100 text-purple-700 rounded-full text-sm font-bold mr-2">
                {i + 1}
              </span>
              {s.pertanyaan}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(['A', 'B', 'C', 'D'] as const).map(opt => {
                const isSelected = jawaban[s.id] === opt
                return (
                  <button
                    key={opt}
                    onClick={() => setJawaban(j => ({ ...j, [s.id]: opt }))}
                    className={`text-left p-3 rounded-lg border-2 text-sm transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 text-purple-800 font-medium'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <span className={`font-bold mr-2 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`}>{opt}.</span>
                    {s[`pilihan${opt}` as keyof Soal] as string}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Submit button */}
      <div className="mt-8 sticky bottom-4">
        <button
          onClick={() => {
            const belumDijawab = kuis.soal.length - dijawab
            if (belumDijawab > 0) {
              if (!confirm(`Masih ada ${belumDijawab} soal yang belum dijawab. Yakin ingin mengumpulkan?`)) return
            }
            handleSubmit(false)
          }}
          disabled={submitting}
          className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 shadow-lg disabled:opacity-60 transition-colors"
        >
          {submitting ? 'Mengumpulkan...' : `Kumpulkan Jawaban (${dijawab}/${kuis.soal.length})`}
        </button>
      </div>
    </div>
  )
}
