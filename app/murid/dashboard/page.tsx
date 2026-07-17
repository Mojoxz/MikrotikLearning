'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import StatCard from '@/components/StatCard'

export default function MuridDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({ materi: 0, kuisAktif: 0, sudahDikerjakan: 0, rataRata: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/materi').then(r => r.json()),
      fetch('/api/kuis').then(r => r.json()),
      fetch('/api/nilai').then(r => r.json()),
    ]).then(([mr, kr, nr]) => {
      const hasilList = nr.success ? nr.data : []
      const rataRata = hasilList.length > 0 ? hasilList.reduce((a: number, h: any) => a + h.nilai, 0) / hasilList.length : 0
      setStats({
        materi: mr.success ? mr.data.length : 0,
        kuisAktif: kr.success ? kr.data.length : 0,
        sudahDikerjakan: hasilList.length,
        rataRata: Math.round(rataRata),
      })
      setLoading(false)
    })
  }, [])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Murid</h1>
        <p className="text-gray-500 text-sm">Selamat datang, {session?.user?.name}! 👋</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Materi" value={stats.materi} icon="📚" color="border-purple-500" />
          <StatCard title="Kuis Aktif" value={stats.kuisAktif} icon="📝" color="border-blue-500" />
          <StatCard title="Kuis Dikerjakan" value={stats.sudahDikerjakan} icon="✅" color="border-green-500" />
          <StatCard title="Rata-rata Nilai" value={stats.rataRata} icon="📊" color="border-orange-500" />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-gray-700 mb-4">Akses Cepat</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Daftar Materi', href: '/murid/materi', icon: '📚' },
              { label: 'Kerjakan Kuis', href: '/murid/kuis', icon: '📝' },
              { label: 'Riwayat Nilai', href: '/murid/nilai', icon: '📊' },
              { label: 'Profil Saya', href: '/murid/profil', icon: '👤' },
            ].map(item => (
              <a key={item.label} href={item.href}
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 text-sm transition-colors">
                <span>{item.icon}</span><span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-gray-700 mb-4">Informasi Akun</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Nama</span><span className="font-medium">{session?.user?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Email</span><span>{session?.user?.email}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Role</span>
              <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">Murid</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
