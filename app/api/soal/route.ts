import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, validateRequired } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return errorResponse('Unauthorized', 401)

  const { searchParams } = new URL(request.url)
  const kuisId = searchParams.get('kuisId')

  if (!kuisId) return errorResponse('kuisId wajib diisi')

  const kuis = await prisma.kuis.findUnique({ where: { id: parseInt(kuisId) } })
  if (!kuis) return errorResponse('Kuis tidak ditemukan', 404)

  if (session.user.role === 'guru' && kuis.guruId !== parseInt(session.user.id)) {
    return errorResponse('Forbidden', 403)
  }

  const soal = await prisma.soal.findMany({
    where: { kuisId: parseInt(kuisId) },
    orderBy: { id: 'asc' },
  })

  return successResponse(soal)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !['admin', 'guru'].includes(session.user.role)) {
    return errorResponse('Unauthorized', 401)
  }

  const body = await request.json()
  const { kuisId, pertanyaan, pilihanA, pilihanB, pilihanC, pilihanD, jawabanBenar, bobotNilai } = body

  const err = validateRequired({ kuisId, pertanyaan, pilihanA, pilihanB, pilihanC, pilihanD, jawabanBenar })
  if (err) return errorResponse(err)

  if (!['A', 'B', 'C', 'D'].includes(jawabanBenar)) {
    return errorResponse('Jawaban benar harus A, B, C, atau D')
  }

  const kuis = await prisma.kuis.findUnique({ where: { id: parseInt(kuisId) } })
  if (!kuis) return errorResponse('Kuis tidak ditemukan')

  if (session.user.role === 'guru' && kuis.guruId !== parseInt(session.user.id)) {
    return errorResponse('Forbidden', 403)
  }

  const soal = await prisma.soal.create({
    data: {
      kuisId: parseInt(kuisId),
      pertanyaan,
      pilihanA,
      pilihanB,
      pilihanC,
      pilihanD,
      jawabanBenar,
      bobotNilai: bobotNilai ? parseInt(bobotNilai) : 10,
    },
  })

  return successResponse(soal, 'Soal berhasil dibuat', 201)
}
