import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, validateRequired } from '@/lib/api-response'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return errorResponse('Unauthorized', 401)

  const kelas = await prisma.kelas.findMany({
    include: { _count: { select: { users: true } } },
    orderBy: { namaKelas: 'asc' },
  })

  return successResponse(kelas)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') return errorResponse('Unauthorized', 401)

  const body = await request.json()
  const { namaKelas, tingkat, jurusan } = body

  const err = validateRequired({ namaKelas, tingkat, jurusan })
  if (err) return errorResponse(err)

  const kelas = await prisma.kelas.create({
    data: { namaKelas, tingkat, jurusan },
  })

  return successResponse(kelas, 'Kelas berhasil dibuat', 201)
}
