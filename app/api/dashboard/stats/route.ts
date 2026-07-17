import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
    return errorResponse('Unauthorized', 401)
  }

  const [totalGuru, totalMurid, totalMateri, totalKuis, totalKelas] = await Promise.all([
    prisma.user.count({ where: { role: 'guru' } }),
    prisma.user.count({ where: { role: 'murid' } }),
    prisma.materi.count(),
    prisma.kuis.count(),
    prisma.kelas.count(),
  ])

  return successResponse({
    totalGuru,
    totalMurid,
    totalMateri,
    totalKuis,
    totalKelas,
  })
}
