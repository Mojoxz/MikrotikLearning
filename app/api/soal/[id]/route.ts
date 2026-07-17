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
  const soal = await prisma.soal.findUnique({
    where: { id: parseInt(id) },
    include: { kuis: { select: { id: true, judul: true } } },
  })

  if (!soal) return errorResponse('Soal tidak ditemukan', 404)
  return successResponse(soal)
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
  const soalId = parseInt(id)

  const soal = await prisma.soal.findUnique({
    where: { id: soalId },
    include: { kuis: true },
  })
  if (!soal) return errorResponse('Soal tidak ditemukan', 404)

  if (session.user.role === 'guru' && soal.kuis.guruId !== parseInt(session.user.id)) {
    return errorResponse('Forbidden', 403)
  }

  const body = await request.json()
  const { pertanyaan, pilihanA, pilihanB, pilihanC, pilihanD, jawabanBenar, bobotNilai } = body

  if (jawabanBenar && !['A', 'B', 'C', 'D'].includes(jawabanBenar)) {
    return errorResponse('Jawaban benar harus A, B, C, atau D')
  }

  const updated = await prisma.soal.update({
    where: { id: soalId },
    data: { pertanyaan, pilihanA, pilihanB, pilihanC, pilihanD, jawabanBenar, bobotNilai },
  })

  return successResponse(updated, 'Soal berhasil diupdate')
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
  const soalId = parseInt(id)

  const soal = await prisma.soal.findUnique({
    where: { id: soalId },
    include: { kuis: true },
  })
  if (!soal) return errorResponse('Soal tidak ditemukan', 404)

  if (session.user.role === 'guru' && soal.kuis.guruId !== parseInt(session.user.id)) {
    return errorResponse('Forbidden', 403)
  }

  await prisma.soal.delete({ where: { id: soalId } })
  return successResponse(null, 'Soal berhasil dihapus')
}
