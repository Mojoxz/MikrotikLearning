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
  const mapel = await prisma.mataPelajaran.findUnique({
    where: { id: parseInt(id) },
  })

  if (!mapel) return errorResponse('Mata pelajaran tidak ditemukan', 404)
  return successResponse(mapel)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') return errorResponse('Unauthorized', 401)

  const { id } = await params
  const body = await request.json()
  const { nama, kode, deskripsi } = body

  if (kode) {
    const existing = await prisma.mataPelajaran.findFirst({
      where: { kode, NOT: { id: parseInt(id) } },
    })
    if (existing) return errorResponse('Kode sudah digunakan')
  }

  const mapel = await prisma.mataPelajaran.update({
    where: { id: parseInt(id) },
    data: { nama, kode, deskripsi },
  })

  return successResponse(mapel, 'Mata pelajaran berhasil diupdate')
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') return errorResponse('Unauthorized', 401)

  const { id } = await params
  await prisma.mataPelajaran.delete({ where: { id: parseInt(id) } })
  return successResponse(null, 'Mata pelajaran berhasil dihapus')
}
