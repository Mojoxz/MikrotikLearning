import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

// POST - Submit jawaban kuis (murid)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'murid') {
    return errorResponse('Unauthorized', 401)
  }

  const { id } = await params
  const kuisId = parseInt(id)
  const userId = parseInt(session.user.id)

  const body = await request.json()
  const { jawaban, waktuMulai } = body
  // jawaban = [{ soalId: number, jawaban: 'A'|'B'|'C'|'D' }]

  // Cek apakah sudah pernah mengerjakan
  const sudahPernah = await prisma.hasilKuis.findUnique({
    where: { kuisId_userId: { kuisId, userId } },
  })
  if (sudahPernah) return errorResponse('Anda sudah mengerjakan kuis ini')

  // Ambil kuis beserta soal
  const kuis = await prisma.kuis.findUnique({
    where: { id: kuisId },
    include: { soal: true },
  })

  if (!kuis) return errorResponse('Kuis tidak ditemukan', 404)
  if (!kuis.isAktif) return errorResponse('Kuis tidak aktif')

  // Hitung nilai
  let totalBenar = 0
  let totalBobot = 0
  const jawabanData = []

  for (const soal of kuis.soal) {
    totalBobot += soal.bobotNilai
    const jawabanMurid = jawaban.find((j: any) => j.soalId === soal.id)
    const isBenar = jawabanMurid?.jawaban === soal.jawabanBenar

    if (isBenar) totalBenar++

    jawabanData.push({
      kuisId,
      soalId: soal.id,
      userId,
      jawaban: jawabanMurid?.jawaban || '',
      isBenar,
    })
  }

  const nilai = kuis.soal.length > 0
    ? (totalBenar / kuis.soal.length) * 100
    : 0

  const waktuSelesai = new Date()
  const waktuMulaiDate = waktuMulai ? new Date(waktuMulai) : waktuSelesai

  // Simpan jawaban dan hasil dalam transaksi
  await prisma.$transaction([
    prisma.jawabanSiswa.createMany({ data: jawabanData, skipDuplicates: true }),
    prisma.hasilKuis.create({
      data: {
        kuisId,
        userId,
        nilai,
        totalBenar,
        totalSoal: kuis.soal.length,
        waktuMulai: waktuMulaiDate,
        waktuSelesai,
      },
    }),
  ])

  const hasil = await prisma.hasilKuis.findUnique({
    where: { kuisId_userId: { kuisId, userId } },
    include: {
      kuis: { select: { judul: true, durasi: true } },
    },
  })

  return successResponse(
    { ...hasil, jawabanBenar: kuis.soal.map(s => ({ soalId: s.id, jawabanBenar: s.jawabanBenar })) },
    'Kuis berhasil dikumpulkan',
    201
  )
}

// GET - Cek status pengerjaan kuis
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'murid') {
    return errorResponse('Unauthorized', 401)
  }

  const { id } = await params
  const kuisId = parseInt(id)
  const userId = parseInt(session.user.id)

  const hasil = await prisma.hasilKuis.findUnique({
    where: { kuisId_userId: { kuisId, userId } },
    include: {
      kuis: { select: { judul: true, durasi: true } },
    },
  })

  return successResponse({ sudahDikerjakan: !!hasil, hasil })
}
