'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import StatCard from '@/components/StatCard'

export default function GuruDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({ materi: 0, kuis: 0, murid: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/materi').then(r => r.json()),
      fetch('/api/kuis').then(r => r.json()),
      fetch('/api/nilai').then(r => r.json()),
    ]).then(([mr, kr, nr]) => {
      setStats({
        materi: mr.success ? mr.data.length : 0,
        kuis: kr.success ? kr.data.length : 0,
        murid: nr.success ? new Set(nr.data.map((h: any) => h.userId)).size : 0,
      })
      setLoading(false)
    })
  }, [])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Guru</h1>
        <p className="text-gray-500 text-sm">Selamat datang, {session?.user?.name}!</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard title="Materi Saya" value={stats.materi} icon="📚" color="border-green-500" />
          <StatCard title="Total Kuis" value={stats.kuis} icon="📝" color="border-blue-500" />
          <StatCard title="Murid Aktif" value={stats.murid} icon="👨‍🎓" color="border-purple-500" />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-gray-700 mb-4">Akses Cepat</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Tambah Materi', href: '/guru/materi', icon: '📄' },
              { label: 'Buat Kuis', href: '/guru/kuis', icon: '📝' },
              { label: 'Kelola Soal', href: '/guru/soal', icon: '❓' },
              { label: 'Lihat Nilai', href: '/guru/nilai', icon: '📊' },
            ].map(item => (
              <a key={item.label} href={item.href}
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 text-sm transition-colors">
                <span>{item.icon}</span><span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-gray-700 mb-4">Info Akun</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Nama</span>
              <span className="font-medium">{session?.user?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Email</span>
              <span>{session?.user?.email}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Role</span>
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">Guru</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
