import { NextResponse } from 'next/server'
import type { ApiResponse } from '@/types'

export function successResponse<T>(data: T, message?: string, status = 200) {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  }
  return NextResponse.json(response, { status })
}

export function errorResponse(error: string, status = 400) {
  const response: ApiResponse = {
    success: false,
    error,
  }
  return NextResponse.json(response, { status })
}

export function validateRequired(fields: Record<string, unknown>): string | null {
  for (const [key, value] of Object.entries(fields)) {
    if (!value && value !== 0) {
      return `Field '${key}' wajib diisi`
    }
  }
  return null
}
