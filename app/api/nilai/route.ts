import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return errorResponse('Unauthorized', 401)

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const kuisId = searchParams.get('kuisId')

  const where: any = {}

  if (session.user.role === 'murid') {
    where.userId = parseInt(session.user.id)
  } else if (userId) {
    where.userId = parseInt(userId)
  }

  if (kuisId) where.kuisId = parseInt(kuisId)

  const hasil = await prisma.hasilKuis.findMany({
    where,
    include: {
      kuis: {
        select: {
          id: true,
          judul: true,
          durasi: true,
          materi: { select: { id: true, judul: true } },
        },
      },
      user: { select: { id: true, nama: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return successResponse(hasil)
}
