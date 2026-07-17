# 🌐 Aplikasi Web Pembelajaran Mikrotik - SMK Kelas XI

Platform pembelajaran Mikrotik berbasis web untuk siswa SMK Kelas XI jurusan TKJ, dibangun dengan Next.js 15, Prisma ORM, MySQL (Laragon), dan NextAuth.

---

## 📋 Fitur

| Role  | Fitur |
|-------|-------|
| **Admin** | CRUD User, Kelas, Mata Pelajaran, Materi, Kuis, Soal, Laporan Nilai |
| **Guru** | CRUD Materi sendiri, Kuis, Soal, Lihat Nilai Murid |
| **Murid** | Baca Materi, Kerjakan Kuis (dengan timer), Lihat Riwayat Nilai |

---

## 🛠️ Teknologi

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS v4**
- **MySQL** (via Laragon/phpMyAdmin)
- **Prisma ORM**
- **NextAuth.js** (JWT)
- **bcryptjs** (hash password)
- **TypeScript**

---

## ⚙️ Cara Install & Menjalankan

### 1. Buat Database di phpMyAdmin Laragon

1. Buka Laragon → klik **phpMyAdmin**
2. Login (username: `root`, password: kosong)
3. Klik **New** di sidebar kiri
4. Nama database: `mikrotik_learning`
5. Klik **Create**

### 2. Clone / Salin Project

Pastikan project sudah ada di folder lokal Anda.

### 3. Konfigurasi Environment

```bash
# Salin file .env.example menjadi .env (sudah ada)
# Pastikan isi .env sesuai konfigurasi Laragon:
```

Buka file `.env` dan pastikan isinya:

```env
DATABASE_URL="mysql://root:@localhost:3306/mikrotik_learning"
NEXTAUTH_SECRET="mikrotik-learning-secret-key-smk-2024-laragon"
NEXTAUTH_URL="http://localhost:3000"
```

> ⚠️ Jika Laragon MySQL berjalan di port berbeda, sesuaikan port di `DATABASE_URL`.

### 4. Install Dependencies

```bash
npm install
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Buat Tabel Database (Push Schema ke MySQL)

```bash
npx prisma db push
```

Perintah ini akan membuat semua tabel secara otomatis di database `mikrotik_learning`.

### 7. Isi Data Awal (Seed)

```bash
npx prisma db seed
```

Atau jalankan langsung:

```bash
npm run prisma:seed
```

### 8. Jalankan Project

```bash
npm run dev
```

Buka browser: **http://localhost:3000**

---

## 🔑 Akun Default

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@mikrotik.com | admin123 |
| Guru  | guru@mikrotik.com  | guru123  |
| Murid | murid@mikrotik.com | murid123 |

---

## 📁 Struktur Folder

```
mikrotik-learning-app/
├── app/
│   ├── api/                    # Route Handler API
│   │   ├── auth/[...nextauth]/ # NextAuth endpoint
│   │   ├── users/              # CRUD Users
│   │   ├── kelas/              # CRUD Kelas
│   │   ├── mapel/              # CRUD Mata Pelajaran
│   │   ├── materi/             # CRUD Materi
│   │   ├── kuis/               # CRUD Kuis + pengerjaan
│   │   ├── soal/               # CRUD Soal
│   │   ├── nilai/              # Hasil kuis
│   │   ├── upload/             # Upload PDF
│   │   └── dashboard/stats/    # Statistik admin
│   ├── admin/                  # Halaman Admin
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── kelas/
│   │   ├── mapel/
│   │   ├── materi/
│   │   ├── kuis/
│   │   ├── soal/
│   │   ├── nilai/
│   │   └── profil/
│   ├── guru/                   # Halaman Guru
│   │   ├── dashboard/
│   │   ├── materi/
│   │   ├── kuis/
│   │   ├── soal/
│   │   ├── nilai/
│   │   └── profil/
│   ├── murid/                  # Halaman Murid
│   │   ├── dashboard/
│   │   ├── materi/
│   │   │   └── [id]/           # Detail materi
│   │   ├── kuis/
│   │   │   └── [id]/           # Kerjakan kuis (timer)
│   │   ├── nilai/
│   │   └── profil/
│   ├── login/                  # Halaman Login
│   ├── layout.tsx
│   ├── page.tsx                # Landing Page
│   └── globals.css
├── components/
│   ├── Sidebar.tsx             # Sidebar navigasi
│   ├── DashboardLayout.tsx     # Layout dashboard
│   ├── StatCard.tsx            # Kartu statistik
│   └── Modal.tsx               # Komponen modal
├── lib/
│   ├── auth.ts                 # Konfigurasi NextAuth
│   ├── prisma.ts               # Prisma client singleton
│   └── api-response.ts         # Helper response API
├── prisma/
│   ├── schema.prisma           # Schema database
│   └── seed.ts                 # Data awal
├── types/
│   ├── index.ts                # TypeScript types
│   └── next-auth.d.ts          # NextAuth type extension
├── public/
│   └── uploads/                # Penyimpanan file PDF
├── middleware.ts               # Proteksi route (RBAC)
├── .env                        # Environment variables
├── .env.example                # Contoh konfigurasi
└── next.config.ts
```

---

## 🗄️ Struktur Database

| Tabel | Keterangan |
|-------|-----------|
| `users` | Data pengguna (admin, guru, murid) + role |
| `sessions` | Session NextAuth |
| `kelas` | Data kelas (XI TKJ 1, dll) |
| `mata_pelajaran` | Data mata pelajaran |
| `materi` | Konten materi pembelajaran |
| `kuis` | Data kuis + durasi |
| `soal` | Soal pilihan ganda |
| `jawaban_siswa` | Jawaban murid per soal |
| `hasil_kuis` | Rekap nilai per kuis per murid |

---

## 🔒 Role Based Access Control

| Route | Admin | Guru | Murid |
|-------|-------|------|-------|
| `/admin/*` | ✅ | ❌ | ❌ |
| `/guru/*` | ❌ | ✅ | ❌ |
| `/murid/*` | ❌ | ❌ | ✅ |
| `/login` | ✅ | ✅ | ✅ |
| `/` (landing) | ✅ | ✅ | ✅ |

---

## ❓ Troubleshooting

### Error: "Can't reach database server"
- Pastikan Laragon sudah running dan MySQL aktif
- Cek port MySQL (default 3306)
- Pastikan database `mikrotik_learning` sudah dibuat

### Error saat prisma db push / migrate
- Pastikan MySQL Laragon running
- Cek DATABASE_URL di `.env`

### Error: Module not found
```bash
npm install
npx prisma generate
```

### Upload PDF tidak berfungsi
- Pastikan folder `public/uploads/` ada dan bisa ditulis
- Ukuran file maksimal 10MB

---

## 📝 API Endpoints

| Method | URL | Keterangan | Role |
|--------|-----|-----------|------|
| GET | `/api/users` | Daftar users | Admin |
| POST | `/api/users` | Buat user | Admin |
| PUT | `/api/users/[id]` | Update user | Admin/Self |
| DELETE | `/api/users/[id]` | Hapus user | Admin |
| GET | `/api/kelas` | Daftar kelas | All |
| GET | `/api/mapel` | Daftar mapel | All |
| GET | `/api/materi` | Daftar materi | All |
| POST | `/api/materi` | Buat materi | Admin/Guru |
| GET | `/api/kuis` | Daftar kuis | All |
| POST | `/api/kuis` | Buat kuis | Admin/Guru |
| GET | `/api/soal?kuisId=` | Daftar soal | All |
| POST | `/api/soal` | Buat soal | Admin/Guru |
| POST | `/api/kuis/[id]/kerjakan` | Submit kuis | Murid |
| GET | `/api/nilai` | Riwayat nilai | All (filtered) |
| POST | `/api/upload` | Upload PDF | Admin/Guru |
| GET | `/api/dashboard/stats` | Statistik | Admin |
