import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Mulai seeding database...')

  // Hapus data lama
  await prisma.hasilKuis.deleteMany()
  await prisma.jawabanSiswa.deleteMany()
  await prisma.soal.deleteMany()
  await prisma.kuis.deleteMany()
  await prisma.materi.deleteMany()
  await prisma.mataPelajaran.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()
  await prisma.kelas.deleteMany()

  // Buat Kelas
  const kelas = await prisma.kelas.create({
    data: {
      namaKelas: 'XI TKJ 1',
      tingkat: 'XI',
      jurusan: 'Teknik Komputer dan Jaringan',
    },
  })
  console.log('✅ Kelas dibuat')

  // Buat Mata Pelajaran
  const mapel = await prisma.mataPelajaran.create({
    data: {
      nama: 'Administrasi Infrastruktur Jaringan',
      kode: 'AIJ',
      deskripsi: 'Mata pelajaran yang membahas administrasi jaringan komputer termasuk Mikrotik',
    },
  })
  console.log('✅ Mata Pelajaran dibuat')

  // Hash passwords
  const hashAdmin = await bcrypt.hash('admin123', 10)
  const hashGuru = await bcrypt.hash('guru123', 10)
  const hashMurid = await bcrypt.hash('murid123', 10)

  // Buat Admin
  const admin = await prisma.user.create({
    data: {
      nama: 'Administrator',
      email: 'admin@mikrotik.com',
      password: hashAdmin,
      role: 'admin',
    },
  })

  // Buat Guru
  const guru = await prisma.user.create({
    data: {
      nama: 'Bapak Guru TKJ',
      email: 'guru@mikrotik.com',
      password: hashGuru,
      role: 'guru',
    },
  })

  // Buat Murid
  const murid = await prisma.user.create({
    data: {
      nama: 'Siswa Contoh',
      email: 'murid@mikrotik.com',
      password: hashMurid,
      role: 'murid',
      kelasId: kelas.id,
    },
  })
  console.log('✅ Users dibuat (admin, guru, murid)')

  // Buat Materi
  const materi1 = await prisma.materi.create({
    data: {
      judul: 'Pengenalan Mikrotik RouterOS',
      deskripsi: 'Materi dasar pengenalan Mikrotik RouterOS untuk pemula',
      kategori: 'Dasar',
      videoYoutube: 'https://www.youtube.com/watch?v=example',
      isiMateri: `<h2>Apa itu Mikrotik?</h2>
<p>MikroTik adalah perusahaan Latvia yang mengembangkan router dan sistem ISP wireless. RouterOS adalah sistem operasi berbasis Linux yang digunakan pada hardware MikroTik RouterBOARD.</p>
<h2>Fitur Utama Mikrotik</h2>
<ul>
<li>Routing - Static, Dynamic (OSPF, BGP, RIP)</li>
<li>Firewall & NAT</li>
<li>VPN - OpenVPN, PPTP, L2TP</li>
<li>QoS - Traffic Shaping</li>
<li>Hotspot Gateway</li>
<li>DHCP Server/Client</li>
</ul>
<h2>Winbox</h2>
<p>Winbox adalah aplikasi GUI untuk mengkonfigurasi Mikrotik RouterOS.</p>`,
      guruId: guru.id,
      mapelId: mapel.id,
    },
  })

  const materi2 = await prisma.materi.create({
    data: {
      judul: 'Konfigurasi DHCP Server Mikrotik',
      deskripsi: 'Cara mengkonfigurasi DHCP Server pada Mikrotik RouterOS',
      kategori: 'Jaringan',
      isiMateri: `<h2>DHCP Server pada Mikrotik</h2>
<p>DHCP (Dynamic Host Configuration Protocol) Server memungkinkan Mikrotik untuk memberikan IP address secara otomatis kepada client.</p>
<h2>Langkah Konfigurasi</h2>
<ol>
<li>Buka Winbox dan login ke Mikrotik</li>
<li>Pergi ke menu IP > DHCP Server</li>
<li>Klik tombol DHCP Setup</li>
<li>Pilih interface yang akan digunakan</li>
<li>Tentukan network address</li>
<li>Tentukan gateway</li>
<li>Tentukan range IP yang akan didistribusikan</li>
<li>Tentukan DNS server</li>
<li>Tentukan lease time</li>
</ol>`,
      guruId: guru.id,
      mapelId: mapel.id,
    },
  })
  console.log('✅ Materi dibuat')

  // Buat Kuis
  const kuis = await prisma.kuis.create({
    data: {
      judul: 'Kuis Pengenalan Mikrotik',
      materiId: materi1.id,
      guruId: guru.id,
      durasi: 30,
      isAktif: true,
    },
  })
  console.log('✅ Kuis dibuat')

  // Buat Soal
  await prisma.soal.createMany({
    data: [
      {
        kuisId: kuis.id,
        pertanyaan: 'Apa kepanjangan dari RouterOS?',
        pilihanA: 'Router Operating System',
        pilihanB: 'Routing Open System',
        pilihanC: 'Router Online Service',
        pilihanD: 'Routing Operating Software',
        jawabanBenar: 'A',
        bobotNilai: 20,
      },
      {
        kuisId: kuis.id,
        pertanyaan: 'Aplikasi GUI untuk konfigurasi Mikrotik adalah...',
        pilihanA: 'RouterOS',
        pilihanB: 'Winbox',
        pilihanC: 'WebFig',
        pilihanD: 'SSH Client',
        jawabanBenar: 'B',
        bobotNilai: 20,
      },
      {
        kuisId: kuis.id,
        pertanyaan: 'Mikrotik berasal dari negara...',
        pilihanA: 'Rusia',
        pilihanB: 'Amerika Serikat',
        pilihanC: 'Latvia',
        pilihanD: 'Jerman',
        jawabanBenar: 'C',
        bobotNilai: 20,
      },
      {
        kuisId: kuis.id,
        pertanyaan: 'Protokol routing dinamis yang didukung Mikrotik adalah...',
        pilihanA: 'HTTP dan FTP',
        pilihanB: 'OSPF dan BGP',
        pilihanC: 'SMTP dan POP3',
        pilihanD: 'DNS dan DHCP',
        jawabanBenar: 'B',
        bobotNilai: 20,
      },
      {
        kuisId: kuis.id,
        pertanyaan: 'DHCP singkatan dari...',
        pilihanA: 'Dynamic Host Configuration Protocol',
        pilihanB: 'Dynamic Host Control Program',
        pilihanC: 'Direct Host Configuration Protocol',
        pilihanD: 'Dynamic Host Computer Protocol',
        jawabanBenar: 'A',
        bobotNilai: 20,
      },
    ],
  })
  console.log('✅ Soal dibuat')

  console.log('\n🎉 Seeding selesai!')
  console.log('📋 Akun Default:')
  console.log('   Admin  : admin@mikrotik.com / admin123')
  console.log('   Guru   : guru@mikrotik.com / guru123')
  console.log('   Murid  : murid@mikrotik.com / murid123')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
