import Link from 'next/link'
import { 
  Users, 
  BookOpen, 
  FileText, 
  Clock, 
  ChevronRight, 
  GraduationCap, 
  LayoutDashboard, 
  PlayCircle, 
  Network
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-500 selection:text-white">
      {/* Background Decorative Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-sky-300/20 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm transition-all">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/30">
              <Network size={24} />
            </div>
            <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
              Mikrotik Learning
            </span>
          </div>
          <Link
            href="/login"
            className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-blue-600 font-pj rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-md shadow-blue-500/20"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6 lg:pt-48 lg:pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-medium text-sm mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
            Platform E-Learning TKJ
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
            Kuasai <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Mikrotik</span> <br />
            Lebih Interaktif.
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Pelajari administrasi jaringan, routing, firewall, dan konfigurasi RouterOS
            dengan materi terstruktur dan simulasi kuis langsung.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-2xl hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1"
            >
              Mulai Belajar Sekarang
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
            <a href="#fitur" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-700 transition-all duration-300 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:shadow-md">
              Lihat Fitur
            </a>
          </div>
        </div>
      </section>

      {/* Tentang Platform (Bento Grid Style) */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Mengapa Mikrotik Learning?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">Platform yang dirancang khusus untuk siswa SMK kelas XI jurusan Teknik Komputer dan Jaringan.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                <GraduationCap size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Materi Terstruktur</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Materi disusun mengikuti kurikulum SMK terkini, memungkinkan siswa memahami
                konsep jaringan komputer mulai dari dasar hingga konfigurasi lanjut di Mikrotik RouterOS secara bertahap.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-md hover:shadow-lg hover:shadow-indigo-500/20 transition-all flex flex-col justify-between">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                <Users size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">3 Peran User</h3>
                <p className="text-indigo-100">
                  Sistem terintegrasi untuk Admin, Guru, dan Siswa dalam satu platform cerdas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Unggulan */}
      <section id="fitur" className="relative z-10 py-20 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Fitur Lengkap</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">Semua yang Anda butuhkan untuk proses belajar mengajar yang efektif.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <LayoutDashboard size={28} />,
                title: 'Dashboard Admin',
                desc: 'Kelola seluruh data: user, kelas, materi, kuis, dan laporan nilai dari satu tempat terpusat.',
                color: 'text-blue-600',
                bg: 'bg-blue-50'
              },
              {
                icon: <BookOpen size={28} />,
                title: 'Portal Guru',
                desc: 'Buat dan kelola materi pembelajaran, kuis, dan soal. Pantau nilai siswa secara real-time.',
                color: 'text-emerald-600',
                bg: 'bg-emerald-50'
              },
              {
                icon: <GraduationCap size={28} />,
                title: 'Portal Murid',
                desc: 'Akses materi terstruktur, kerjakan kuis dengan timer otomatis, dan pantau grafik nilai.',
                color: 'text-indigo-600',
                bg: 'bg-indigo-50'
              },
              {
                icon: <FileText size={28} />,
                title: 'Modul PDF Lengkap',
                desc: 'Mendukung unggahan modul PDF sebagai referensi bacaan bahan ajar pendukung.',
                color: 'text-amber-600',
                bg: 'bg-amber-50'
              },
              {
                icon: <PlayCircle size={28} />,
                title: 'Integrasi Video',
                desc: 'Sematkan video pembelajaran dari YouTube langsung ke dalam halaman materi untuk visualisasi.',
                color: 'text-rose-600',
                bg: 'bg-rose-50'
              },
              {
                icon: <Clock size={28} />,
                title: 'Kuis Otomatis (Timer)',
                desc: 'Kuis dilengkapi dengan timer cerdas. Sistem akan otomatis mensubmit saat waktu telah habis.',
                color: 'text-purple-600',
                bg: 'bg-purple-50'
              },
            ].map((f, i) => (
              <div key={i} className="group bg-white p-8 rounded-3xl border border-slate-100 hover:border-transparent hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${f.bg} ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cara Belajar */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
            {/* Dekorasi Background di card hitam */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">Langkah Mudah Memulai</h2>
              <div className="grid md:grid-cols-4 gap-8 md:gap-4 text-center">
                {[
                  { step: '01', title: 'Login', desc: 'Gunakan akun dari guru' },
                  { step: '02', title: 'Pilih Materi', desc: 'Pelajari secara berurutan' },
                  { step: '03', title: 'Ikuti Kuis', desc: 'Uji pemahaman harian' },
                  { step: '04', title: 'Cek Nilai', desc: 'Pantau perkembangan' },
                ].map((s, i) => (
                  <div key={s.step} className="relative group">
                    {/* Garis konektor antar step untuk desktop */}
                    {i < 3 && <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-slate-700 -z-10"></div>}
                    
                    <div className="w-16 h-16 bg-slate-800 border-2 border-slate-700 text-blue-400 rounded-2xl flex items-center justify-center font-bold text-xl mx-auto mb-6 group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:text-white transition-all duration-300 transform group-hover:scale-110 shadow-lg">
                      {s.step}
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2">{s.title}</h3>
                    <p className="text-slate-400 text-sm">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white border-t border-slate-200 pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left mb-12">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-xl">
                <Network size={20} />
              </div>
              <span className="font-bold text-xl text-slate-900">
                Mikrotik Learning
              </span>
            </div>
            <p className="text-slate-500 max-w-md">
              Platform e-learning modern untuk mempermudah pembelajaran praktikum jaringan komputer dan Mikrotik.
            </p>
          </div>
          
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Mikrotik Learning SMK. Hak Cipta Dilindungi.</p>
            <div className="flex gap-6">
              <span className="hover:text-blue-600 transition-colors cursor-pointer">Syarat & Ketentuan</span>
              <span className="hover:text-blue-600 transition-colors cursor-pointer">Kebijakan Privasi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
