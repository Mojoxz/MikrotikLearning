import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { unlink } from 'fs/promises'
import path from 'path'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return errorResponse('Unauthorized', 401)

  const { id } = await params
  const materi = await prisma.materi.findUnique({
    where: { id: parseInt(id) },
    include: {
      guru: { select: { id: true, nama: true, email: true } },
      mapel: true,
      kuis: {
        where: { isAktif: true },
        select: { id: true, judul: true, durasi: true },
      },
    },
  })

  if (!materi) return errorResponse('Materi tidak ditemukan', 404)
  return successResponse(materi)
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
  const materiId = parseInt(id)

  const materi = await prisma.materi.findUnique({ where: { id: materiId } })
  if (!materi) return errorResponse('Materi tidak ditemukan', 404)

  if (session.user.role === 'guru' && materi.guruId !== parseInt(session.user.id)) {
    return errorResponse('Forbidden - bukan materi Anda', 403)
  }

  const body = await request.json()
  const { judul, deskripsi, kategori, filePdf, videoYoutube, isiMateri, mapelId } = body

  const updated = await prisma.materi.update({
    where: { id: materiId },
    data: {
      judul,
      deskripsi,
      kategori,
      filePdf,
      videoYoutube,
      isiMateri,
      mapelId: mapelId ? parseInt(mapelId) : null,
    },
    include: {
      guru: { select: { id: true, nama: true } },
      mapel: { select: { id: true, nama: true } },
    },
  })

  return successResponse(updated, 'Materi berhasil diupdate')
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
  const materiId = parseInt(id)

  const materi = await prisma.materi.findUnique({ where: { id: materiId } })
  if (!materi) return errorResponse('Materi tidak ditemukan', 404)

  if (session.user.role === 'guru' && materi.guruId !== parseInt(session.user.id)) {
    return errorResponse('Forbidden - bukan materi Anda', 403)
  }

  // Hapus file PDF jika ada
  if (materi.filePdf) {
    try {
      const filePath = path.join(process.cwd(), 'public', materi.filePdf)
      await unlink(filePath)
    } catch {}
  }

  await prisma.materi.delete({ where: { id: materiId } })
  return successResponse(null, 'Materi berhasil dihapus')
}
