import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !['admin', 'guru'].includes(session.user.role)) {
    return errorResponse('Unauthorized', 401)
  }

  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) return errorResponse('File tidak ditemukan')

  if (file.type !== 'application/pdf') {
    return errorResponse('Hanya file PDF yang diperbolehkan')
  }

  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return errorResponse('Ukuran file maksimal 10MB')
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadDir, { recursive: true })

  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
  const filePath = path.join(uploadDir, fileName)
  await writeFile(filePath, buffer)

  return successResponse(
    { filePath: `/uploads/${fileName}` },
    'File berhasil diupload',
    201
  )
}
