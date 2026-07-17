'use client'

import { useEffect, useState } from 'react'
import StatCard from '@/components/StatCard'

interface Stats {
  totalGuru: number
  totalMurid: number
  totalMateri: number
  totalKuis: number
  totalKelas: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(data => {
        if (data.success) setStats(data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
        <p className="text-gray-500 text-sm mt-1">Selamat datang di panel administrasi</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard title="Total Guru" value={stats?.totalGuru ?? 0} icon="👨‍🏫" color="border-blue-500" />
          <StatCard title="Total Murid" value={stats?.totalMurid ?? 0} icon="👨‍🎓" color="border-green-500" />
          <StatCard title="Total Materi" value={stats?.totalMateri ?? 0} icon="📚" color="border-purple-500" />
          <StatCard title="Total Kuis" value={stats?.totalKuis ?? 0} icon="📝" color="border-orange-500" />
          <StatCard title="Total Kelas" value={stats?.totalKelas ?? 0} icon="🏫" color="border-red-500" />
        </div>
      )}

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-gray-700 mb-4">Menu Cepat</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Tambah Guru', href: '/admin/users?role=guru', icon: '➕' },
              { label: 'Tambah Murid', href: '/admin/users?role=murid', icon: '➕' },
              { label: 'Tambah Materi', href: '/admin/materi', icon: '📄' },
              { label: 'Tambah Kuis', href: '/admin/kuis', icon: '📝' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 text-sm transition-colors"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-gray-700 mb-4">Informasi Sistem</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between py-2 border-b">
              <span>Database</span>
              <span className="text-green-600 font-medium">MySQL (Laragon) ✓</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Framework</span>
              <span>Next.js 15</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>ORM</span>
              <span>Prisma</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Auth</span>
              <span>NextAuth.js</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
