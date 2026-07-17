import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, validateRequired } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return errorResponse('Unauthorized', 401)

  const { searchParams } = new URL(request.url)
  const materiId = searchParams.get('materiId')

  const where: any = {}
  if (session.user.role === 'guru') {
    where.guruId = parseInt(session.user.id)
  }
  if (materiId) where.materiId = parseInt(materiId)
  // Murid hanya lihat kuis aktif
  if (session.user.role === 'murid') {
    where.isAktif = true
  }

  const kuis = await prisma.kuis.findMany({
    where,
    include: {
      materi: { select: { id: true, judul: true, kategori: true } },
      guru: { select: { id: true, nama: true } },
      _count: { select: { soal: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return successResponse(kuis)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !['admin', 'guru'].includes(session.user.role)) {
    return errorResponse('Unauthorized', 401)
  }

  const body = await request.json()
  const { judul, materiId, durasi, isAktif } = body

  const err = validateRequired({ judul, materiId, durasi })
  if (err) return errorResponse(err)

  const guruId = session.user.role === 'admin'
    ? (body.guruId ? parseInt(body.guruId) : parseInt(session.user.id))
    : parseInt(session.user.id)

  // Validasi materi
  const materi = await prisma.materi.findUnique({ where: { id: parseInt(materiId) } })
  if (!materi) return errorResponse('Materi tidak ditemukan')

  if (session.user.role === 'guru' && materi.guruId !== guruId) {
    return errorResponse('Tidak bisa membuat kuis untuk materi guru lain')
  }

  const kuis = await prisma.kuis.create({
    data: {
      judul,
      materiId: parseInt(materiId),
      guruId,
      durasi: parseInt(durasi),
      isAktif: isAktif !== undefined ? isAktif : true,
    },
    include: {
      materi: { select: { id: true, judul: true } },
      guru: { select: { id: true, nama: true } },
    },
  })

  return successResponse(kuis, 'Kuis berhasil dibuat', 201)
}
