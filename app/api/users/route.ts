import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, validateRequired } from '@/lib/api-response'
import bcrypt from 'bcryptjs'

// GET - Daftar semua users (admin only)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
    return errorResponse('Unauthorized', 401)
  }

  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role')

  const where = role ? { role: role as any } : {}

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      nama: true,
      email: true,
      role: true,
      kelasId: true,
      createdAt: true,
      kelas: { select: { id: true, namaKelas: true, tingkat: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return successResponse(users)
}

// POST - Buat user baru (admin only)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
    return errorResponse('Unauthorized', 401)
  }

  const body = await request.json()
  const { nama, email, password, role, kelasId } = body

  const validationError = validateRequired({ nama, email, password, role })
  if (validationError) return errorResponse(validationError)

  if (!['admin', 'guru', 'murid'].includes(role)) {
    return errorResponse('Role tidak valid')
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) return errorResponse('Email sudah terdaftar')

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      nama,
      email,
      password: hashedPassword,
      role,
      kelasId: kelasId ? Number(kelasId) : null,
    },
    select: {
      id: true,
      nama: true,
      email: true,
      role: true,
      kelasId: true,
      createdAt: true,
    },
  })

  return successResponse(user, 'User berhasil dibuat', 201)
}
