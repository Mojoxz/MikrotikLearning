import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import bcrypt from 'bcryptjs'

// GET - Detail user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return errorResponse('Unauthorized', 401)

  const { id } = await params
  const userId = parseInt(id)

  // User bisa lihat profil sendiri, admin bisa lihat semua
  if (session.user.role !== 'admin' && parseInt(session.user.id) !== userId) {
    return errorResponse('Forbidden', 403)
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nama: true,
      email: true,
      role: true,
      kelasId: true,
      createdAt: true,
      kelas: true,
    },
  })

  if (!user) return errorResponse('User tidak ditemukan', 404)
  return successResponse(user)
}

// PUT - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return errorResponse('Unauthorized', 401)

  const { id } = await params
  const userId = parseInt(id)

  if (session.user.role !== 'admin' && parseInt(session.user.id) !== userId) {
    return errorResponse('Forbidden', 403)
  }

  const body = await request.json()
  const { nama, email, password, role, kelasId } = body

  const updateData: any = {}
  if (nama) updateData.nama = nama
  if (email) {
    const existing = await prisma.user.findFirst({
      where: { email, NOT: { id: userId } },
    })
    if (existing) return errorResponse('Email sudah digunakan')
    updateData.email = email
  }
  if (password) updateData.password = await bcrypt.hash(password, 10)
  if (role && session.user.role === 'admin') updateData.role = role
  if (kelasId !== undefined) updateData.kelasId = kelasId ? Number(kelasId) : null

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      nama: true,
      email: true,
      role: true,
      kelasId: true,
      createdAt: true,
    },
  })

  return successResponse(user, 'User berhasil diupdate')
}

// DELETE - Hapus user (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
    return errorResponse('Unauthorized', 401)
  }

  const { id } = await params
  const userId = parseInt(id)

  if (parseInt(session.user.id) === userId) {
    return errorResponse('Tidak bisa menghapus akun sendiri')
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return errorResponse('User tidak ditemukan', 404)

  await prisma.user.delete({ where: { id: userId } })
  return successResponse(null, 'User berhasil dihapus')
}
