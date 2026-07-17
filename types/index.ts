export type Role = 'admin' | 'guru' | 'murid'

export interface UserSession {
  id: number
  nama: string
  email: string
  role: Role
  kelasId?: number | null
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface UserData {
  id: number
  nama: string
  email: string
  role: Role
  kelasId?: number | null
  createdAt: Date
  kelas?: KelasData | null
}

export interface KelasData {
  id: number
  namaKelas: string
  tingkat: string
  jurusan: string
  createdAt: Date
}

export interface MataPelajaranData {
  id: number
  nama: string
  kode: string
  deskripsi?: string | null
  createdAt: Date
}

export interface MateriData {
  id: number
  judul: string
  deskripsi?: string | null
  kategori: string
  filePdf?: string | null
  videoYoutube?: string | null
  isiMateri?: string | null
  guruId: number
  mapelId?: number | null
  createdAt: Date
  guru?: Partial<UserData>
  mapel?: MataPelajaranData | null
  _count?: { kuis: number }
}

export interface KuisData {
  id: number
  judul: string
  materiId: number
  guruId: number
  durasi: number
  isAktif: boolean
  createdAt: Date
  materi?: Partial<MateriData>
  guru?: Partial<UserData>
  _count?: { soal: number }
}

export interface SoalData {
  id: number
  kuisId: number
  pertanyaan: string
  pilihanA: string
  pilihanB: string
  pilihanC: string
  pilihanD: string
  jawabanBenar: string
  bobotNilai: number
  createdAt: Date
}

export interface HasilKuisData {
  id: number
  kuisId: number
  userId: number
  nilai: number
  totalBenar: number
  totalSoal: number
  waktuMulai: Date
  waktuSelesai: Date
  createdAt: Date
  kuis?: Partial<KuisData>
  user?: Partial<UserData>
}
