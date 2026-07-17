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
  const kuis = await prisma.kuis.findUnique({
    where: { id: parseInt(id) },
    include: {
      materi: { select: { id: true, judul: true, kategori: true } },
      guru: { select: { id: true, nama: true } },
      soal: {
        select: {
          id: true,
          pertanyaan: true,
          pilihanA: true,
          pilihanB: true,
          pilihanC: true,
          pilihanD: true,
          // Jawaban benar tidak dikirim ke murid
          ...(session.user.role !== 'murid' && { jawabanBenar: true, bobotNilai: true }),
          bobotNilai: true,
        },
      },
      _count: { select: { soal: true } },
    },
  })

  if (!kuis) return errorResponse('Kuis tidak ditemukan', 404)
  return successResponse(kuis)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || !['admin', 'guru'].includes(session.user.role)) {
    return errorResponse('Unauthorized', 401)
  }

  const { id } = await params
  const kuisId = parseInt(id)
  const kuis = await prisma.kuis.findUnique({ where: { id: kuisId } })
  if (!kuis) return errorResponse('Kuis tidak ditemukan', 404)

  if (session.user.role === 'guru' && kuis.guruId !== parseInt(session.user.id)) {
    return errorResponse('Forbidden', 403)
  }

  const body = await request.json()
  const { judul, materiId, durasi, isAktif } = body

  const updated = await prisma.kuis.update({
    where: { id: kuisId },
    data: {
      judul,
      materiId: materiId ? parseInt(materiId) : undefined,
      durasi: durasi ? parseInt(durasi) : undefined,
      isAktif,
    },
  })

  return successResponse(updated, 'Kuis berhasil diupdate')
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || !['admin', 'guru'].includes(session.user.role)) {
    return errorResponse('Unauthorized', 401)
  }

  const { id } = await params
  const kuisId = parseInt(id)
  const kuis = await prisma.kuis.findUnique({ where: { id: kuisId } })
  if (!kuis) return errorResponse('Kuis tidak ditemukan', 404)

  if (session.user.role === 'guru' && kuis.guruId !== parseInt(session.user.id)) {
    return errorResponse('Forbidden', 403)
  }

  await prisma.kuis.delete({ where: { id: kuisId } })
  return successResponse(null, 'Kuis berhasil dihapus')
}
