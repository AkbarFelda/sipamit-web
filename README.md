SIPAMIT-APP 

SIPAMIT (Sistem Informasi Pelaporan Air Minum Terintegrasi) adalah aplikasi berbasis web mobile yang dirancang untuk memudahkan petugas lapangan PDAM dalam melakukan pencatatan meteran air, pengelolaan Surat Perintah Kerja (SPK), dan pelaporan data pelanggan secara *real-time*.

Fitur Utama
* **Autentikasi Keamanan**: Login petugas dengan fitur *hide/show* password.
* **Dashboard Dinamis**: Ucapan salam otomatis berdasarkan waktu lokal (Pagi/Siang/Sore/Malam).
* **Manajemen SPK**: Daftar Surat Perintah Kerja yang dikelompokkan berdasarkan kategori (Pasang Baru, Pengaduan, dll).
* **Detail Pelanggan**: Informasi teknis lengkap pelanggan beserta instruksi kerja lapangan.
* **Integrasi Kamera & Galeri**: Pengambilan foto meteran air langsung melalui kamera perangkat atau unggah dari galeri HP.
* **Input Data Lapangan**: Form input angka meteran yang muncul otomatis setelah pengambilan foto.
* **Mobile-First Design**: Antarmuka yang dioptimalkan untuk perangkat seluler menggunakan *container* khusus berukuran layar HP.

Teknologi yang Digunakan

* **Framework**: [Next.js 15](https://nextjs.org/) (App Router).
* **Bahasa**: [TypeScript](https://www.typescriptlang.org/).
* **Styling**: [Tailwind CSS](https://tailwindcss.com/).
* **Icons**: [Lucide React](https://lucide.dev/).
* **Kamera**: [React Webcam](https://www.npmjs.com/package/react-webcam).

Struktur Proyek

Aplikasi ini mengikuti prinsip **Clean Architecture** sederhana untuk memisahkan logika bisnis dan tampilan:

```text
├── app/                   # Routing dan halaman utama (Next.js App Router)
│   ├── homepage/          # Halaman Dashboard utama
│   ├── spk/               # Halaman list dan detail SPK (Dynamic Routes)
│   └── layout.tsx         # Layout global aplikasi
├── core/                  # Logika bisnis dan helper murni
│   └── utils/             # Fungsi pembantu (seperti dateHelper)
├── presentation/          # Layer tampilan (UI)
│   ├── components/        # Komponen reusable (Atom & Molecule)
│   └── hooks/             # Custom React Hooks (seperti useGreeting)
└── public/                # Aset statis (Logo, Icon, Gambar)

```
⚡ Cara Menjalankan Lokal

1. **Clone repositori**:
```bash
git clone https://github.com/AkbarFelda/sipamit-web.git
cd sipamit-web

```


2. **Instal dependensi**:
```bash
npm install

```


3. **Jalankan server pengembangan**:
```bash
npm run dev

```


4. **Buka di browser**:
Akses `http://localhost:3000`. Gunakan mode *Inspect Element* (F12) dan aktifkan *Responsive View* (Mode HP) untuk pengalaman terbaik.

📝 Catatan Pengembangan

* Aplikasi ini menggunakan penyimpanan lokal (*LocalStorage*) untuk menyimpan sesi nama pengguna sementara setelah login.
* Pastikan memberikan izin akses kamera pada browser saat menggunakan fitur Scan Meteran.

---

*© 2025 PDAM Sleman. All rights reserved.*
