import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return errorResponse('Unauthorized', 401)

  const { id } = await params
  const kelas = await prisma.kelas.findUnique({
    where: { id: parseInt(id) },
    include: { users: { select: { id: true, nama: true, email: true, role: true } } },
  })

  if (!kelas) return errorResponse('Kelas tidak ditemukan', 404)
  return successResponse(kelas)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') return errorResponse('Unauthorized', 401)

  const { id } = await params
  const body = await request.json()
  const { namaKelas, tingkat, jurusan } = body

  const kelas = await prisma.kelas.update({
    where: { id: parseInt(id) },
    data: { namaKelas, tingkat, jurusan },
  })

  return successResponse(kelas, 'Kelas berhasil diupdate')
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') return errorResponse('Unauthorized', 401)

  const { id } = await params
  await prisma.kelas.delete({ where: { id: parseInt(id) } })
  return successResponse(null, 'Kelas berhasil dihapus')
}
