'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard, Users, BookOpen, ClipboardList,
  School, BookMarked, FileText, BarChart3, LogOut, UserCircle
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const adminNav: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/admin/users', label: 'Kelola User', icon: <Users size={18} /> },
  { href: '/admin/kelas', label: 'Kelas', icon: <School size={18} /> },
  { href: '/admin/mapel', label: 'Mata Pelajaran', icon: <BookMarked size={18} /> },
  { href: '/admin/materi', label: 'Materi', icon: <BookOpen size={18} /> },
  { href: '/admin/kuis', label: 'Kuis', icon: <ClipboardList size={18} /> },
  { href: '/admin/soal', label: 'Soal', icon: <FileText size={18} /> },
  { href: '/admin/nilai', label: 'Laporan Nilai', icon: <BarChart3 size={18} /> },
  { href: '/admin/profil', label: 'Profil', icon: <UserCircle size={18} /> },
]

const guruNav: NavItem[] = [
  { href: '/guru/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/guru/materi', label: 'Materi Saya', icon: <BookOpen size={18} /> },
  { href: '/guru/kuis', label: 'Kuis', icon: <ClipboardList size={18} /> },
  { href: '/guru/soal', label: 'Soal', icon: <FileText size={18} /> },
  { href: '/guru/nilai', label: 'Nilai Murid', icon: <BarChart3 size={18} /> },
  { href: '/guru/profil', label: 'Profil', icon: <UserCircle size={18} /> },
]

const muridNav: NavItem[] = [
  { href: '/murid/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/murid/materi', label: 'Daftar Materi', icon: <BookOpen size={18} /> },
  { href: '/murid/kuis', label: 'Kuis', icon: <ClipboardList size={18} /> },
  { href: '/murid/nilai', label: 'Riwayat Nilai', icon: <BarChart3 size={18} /> },
  { href: '/murid/profil', label: 'Profil', icon: <UserCircle size={18} /> },
]

export default function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const role = session?.user?.role

  const navItems = role === 'admin' ? adminNav : role === 'guru' ? guruNav : muridNav
  const bgColor = role === 'admin' ? 'bg-blue-800' : role === 'guru' ? 'bg-green-800' : 'bg-purple-800'
  const hoverColor = role === 'admin' ? 'hover:bg-blue-700' : role === 'guru' ? 'hover:bg-green-700' : 'hover:bg-purple-700'
  const activeColor = role === 'admin' ? 'bg-blue-600' : role === 'guru' ? 'bg-green-600' : 'bg-purple-600'

  return (
    <div className={`${bgColor} text-white w-64 min-h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <h1 className="font-bold text-lg">🌐 Mikrotik SMK</h1>
        <p className="text-xs text-white/70 mt-1 capitalize">{role}</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
            {session?.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium truncate max-w-[140px]">{session?.user?.name}</p>
            <p className="text-xs text-white/60 truncate max-w-[140px]">{session?.user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-sm transition-colors ${
                isActive ? activeColor : hoverColor
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-white/20">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-sm ${hoverColor} transition-colors`}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  )
}
