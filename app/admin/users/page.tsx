'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'

interface User {
  id: number
  nama: string
  email: string
  role: string
  kelasId: number | null
  createdAt: string
  kelas?: { namaKelas: string; tingkat: string } | null
}

interface Kelas {
  id: number
  namaKelas: string
  tingkat: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [kelas, setKelas] = useState<Kelas[]>([])
  const [loading, setLoading] = useState(true)
  const [filterRole, setFilterRole] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [form, setForm] = useState({ nama: '', email: '', password: '', role: 'murid', kelasId: '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const loadUsers = async () => {
    setLoading(true)
    const url = filterRole ? `/api/users?role=${filterRole}` : '/api/users'
    const res = await fetch(url)
    const data = await res.json()
    if (data.success) setUsers(data.data)
    setLoading(false)
  }

  const loadKelas = async () => {
    const res = await fetch('/api/kelas')
    const data = await res.json()
    if (data.success) setKelas(data.data)
  }

  useEffect(() => { loadUsers(); loadKelas() }, [filterRole])

  const openCreate = () => {
    setEditUser(null)
    setForm({ nama: '', email: '', password: '', role: 'murid', kelasId: '' })
    setIsModalOpen(true)
  }

  const openEdit = (user: User) => {
    setEditUser(user)
    setForm({ nama: user.nama, email: user.email, password: '', role: user.role, kelasId: user.kelasId?.toString() || '' })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    const body: any = { ...form, kelasId: form.kelasId || null }
    if (!body.password && !editUser) { setMessage({ type: 'error', text: 'Password wajib diisi' }); setSaving(false); return }
    if (!body.password) delete body.password

    const url = editUser ? `/api/users/${editUser.id}` : '/api/users'
    const method = editUser ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()

    if (data.success) {
      setMessage({ type: 'success', text: editUser ? 'User berhasil diupdate' : 'User berhasil dibuat' })
      setIsModalOpen(false)
      loadUsers()
    } else {
      setMessage({ type: 'error', text: data.error || 'Terjadi kesalahan' })
    }
    setSaving(false)
  }

  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Hapus user "${nama}"?`)) return
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) { setMessage({ type: 'success', text: 'User berhasil dihapus' }); loadUsers() }
    else setMessage({ type: 'error', text: data.error || 'Gagal menghapus' })
  }

  const roleLabel = (role: string) => ({ admin: 'Admin', guru: 'Guru', murid: 'Murid' }[role] || role)
  const roleBadge = (role: string) => ({
    admin: 'bg-blue-100 text-blue-700',
    guru: 'bg-green-100 text-green-700',
    murid: 'bg-purple-100 text-purple-700',
  }[role] || 'bg-gray-100 text-gray-700')

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola User</h1>
          <p className="text-gray-500 text-sm">CRUD Admin, Guru, dan Murid</p>
        </div>
        <button
          id="btn-tambah-user"
          onClick={openCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          + Tambah User
        </button>
      </div>

      {message.text && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-lg shadow mb-4 p-4 flex gap-2">
        {['', 'admin', 'guru', 'murid'].map(r => (
          <button
            key={r}
            onClick={() => setFilterRole(r)}
            className={`px-3 py-1 rounded text-sm border transition-colors ${filterRole === r ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            {r === '' ? 'Semua' : roleLabel(r)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">#</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Nama</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Email</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Role</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Kelas</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Memuat...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Tidak ada data</td></tr>
            ) : users.map((u, i) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{u.nama}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleBadge(u.role)}`}>
                    {roleLabel(u.role)}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{u.kelas?.namaKelas || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(u)} className="text-blue-600 hover:text-blue-800 text-xs border border-blue-300 px-2 py-1 rounded hover:bg-blue-50">Edit</button>
                    <button onClick={() => handleDelete(u.id, u.nama)} className="text-red-600 hover:text-red-800 text-xs border border-red-300 px-2 py-1 rounded hover:bg-red-50">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editUser ? 'Edit User' : 'Tambah User'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {message.text && isModalOpen && (
            <div className={`px-3 py-2 rounded text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {message.text}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input required value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {editUser && <span className="text-gray-400 font-normal">(kosongkan jika tidak diubah)</span>}
            </label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="murid">Murid</option>
              <option value="guru">Guru</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {form.role === 'murid' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
              <select value={form.kelasId} onChange={e => setForm(f => ({ ...f, kelasId: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Pilih Kelas --</option>
                {kelas.map(k => <option key={k.id} value={k.id}>{k.tingkat} - {k.namaKelas}</option>)}
              </select>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Batal</button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
