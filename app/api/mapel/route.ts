import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, validateRequired } from '@/lib/api-response'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return errorResponse('Unauthorized', 401)

  const mapel = await prisma.mataPelajaran.findMany({
    orderBy: { nama: 'asc' },
  })

  return successResponse(mapel)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') return errorResponse('Unauthorized', 401)

  const body = await request.json()
  const { nama, kode, deskripsi } = body

  const err = validateRequired({ nama, kode })
  if (err) return errorResponse(err)

  const existing = await prisma.mataPelajaran.findUnique({ where: { kode } })
  if (existing) return errorResponse('Kode mata pelajaran sudah ada')

  const mapel = await prisma.mataPelajaran.create({
    data: { nama, kode, deskripsi },
  })

  return successResponse(mapel, 'Mata pelajaran berhasil dibuat', 201)
}
