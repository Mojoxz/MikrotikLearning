import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, validateRequired } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return errorResponse('Unauthorized', 401)

  const { searchParams } = new URL(request.url)
  const guruId = searchParams.get('guruId')
  const mapelId = searchParams.get('mapelId')

  const where: any = {}
  // Guru hanya melihat materi miliknya
  if (session.user.role === 'guru') {
    where.guruId = parseInt(session.user.id)
  } else if (guruId) {
    where.guruId = parseInt(guruId)
  }
  if (mapelId) where.mapelId = parseInt(mapelId)

  const materi = await prisma.materi.findMany({
    where,
    include: {
      guru: { select: { id: true, nama: true } },
      mapel: { select: { id: true, nama: true, kode: true } },
      _count: { select: { kuis: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return successResponse(materi)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !['admin', 'guru'].includes(session.user.role)) {
    return errorResponse('Unauthorized', 401)
  }

  const body = await request.json()
  const { judul, deskripsi, kategori, filePdf, videoYoutube, isiMateri, mapelId } = body

  const err = validateRequired({ judul, kategori })
  if (err) return errorResponse(err)

  const guruId = session.user.role === 'admin' 
    ? (body.guruId ? parseInt(body.guruId) : parseInt(session.user.id))
    : parseInt(session.user.id)

  const materi = await prisma.materi.create({
    data: {
      judul,
      deskripsi,
      kategori,
      filePdf,
      videoYoutube,
      isiMateri,
      guruId,
      mapelId: mapelId ? parseInt(mapelId) : null,
    },
    include: {
      guru: { select: { id: true, nama: true } },
      mapel: { select: { id: true, nama: true } },
    },
  })

  return successResponse(materi, 'Materi berhasil dibuat', 201)
}
