test
# 🌐 Halo, Saya Fatahilah Miftahul Rahman!

Ini adalah repositori kode sumber (*source code*) untuk website portofolio pribadi saya. Website ini saya bangun sebagai tempat untuk memajang hasil belajar, proyek lab, dokumentasi sertifikat, serta keahlian teknis yang saya kuasai di bidang **IT Network & System Administration**.

Sebagai lulusan TKJ yang juga sedang mendalami **AI Prompt Engineering**, saya memanfaatkan teknologi LLM (Large Language Model) untuk membantu otomatisasi skrip jaringan dan pemecahan masalah (*troubleshooting*) sistem server agar implementasi di industri menjadi lebih efisien dan aman.

Website ini sudah live dan bisa diakses di: [fatahmr.my.id](https://fatahmr.my.id)

---

## ✨ Apa Saja yang Menarik di Website Ini?

* **Optimasi Kecepatan & Performa (Web Vitals):** 
  * Menggunakan teknik *Asynchronous Font Loading* untuk mencegah font memblokir proses render halaman.
  * Penerapan *Fetch Priority High* pada aset LCP (Largest Contentful Paint) dan *Lazy Loading* pada gambar sekunder agar website terasa instan saat dibuka dari HP.
  * *On-Demand Image Loading* pada modal transkrip sertifikat untuk menghemat bandwidth pengguna.
* **Manajemen Cache Tingkat Lanjut:** Konfigurasi khusus melalui `vercel.json` untuk menerapkan cache jangka panjang (`immutable`) pada aset statis guna mempercepat kunjungan berulang (subsequent visits).
* **Siap SEO & Aksesibilitas:** Dilengkapi dengan struktur HTML5 Semantik yang ramah *screen reader*, file `sitemap.xml`, `robots.txt`, dan optimasi *Meta Tags* untuk mesin pencari.

* **Desain Simpel & Nyaman di Mata:** Menggunakan kombinasi warna krem, hitam tinta, dan biru aksen yang minimalis. Tujuannya agar HRD atau klien bisa betah membaca profil saya tanpa terganggu visual yang ramai.
* **Responsif (Bagus di HP & Laptop):** Kalau dibuka lewat HP, menunya otomatis berubah jadi gaya tirai ramping yang hemat tempat. Kalau dibuka di laptop, tampilannya melebar dengan rapi memanfaatkan sistem grid desktop.
* **Halaman Khusus Semua Sertifikat:** Selain menampilkan sertifikat utama di halaman depan, website ini dilengkapi halaman khusus (`certificates.html`) untuk mengarsipkan seluruh koleksi sertifikat secara rapi tanpa membebani halaman utama.
* **Kategori Skill yang Jelas:** Keahlian teknis saya bagi menjadi 4 kotak visual yang interaktif (Hardware, Cisco, MikroTik, dan Server) lengkap dengan warna tema pembeda di setiap kotaknya.
* **Navbar Pintar:** Navigasi atasnya sengaja dibuat peka terhadap gerakan scroll. Menu akan otomatis sembunyi secara halus saat layar digulir ke bawah (biar space membaca luas), dan muncul lagi saat layar digulir ke atas.
* **CMS Sertifikat dengan Google Sheets + GitHub:** Semua data sertifikat (nama, penerbit, tahun, tipe, URL gambar depan/belakang) dikelola melalui Google Sheets. Gambar sertifikat disimpan di repositori GitHub dan diakses via CDN jsDelivr untuk loading cepat di seluruh dunia. Cukup edit spreadsheet, galeri sertifikat di halaman `certificates.html` akan otomatis berubah tanpa perlu menyentuh kode.

---

## 🛠️ Struktur Kode & Manajemen Aset

Biar kodenya rapi dan sesuai dengan standar coding yang baik, proyek ini dibagi secara modular dan terstruktur:
1. `index.html` — Berisi kerangka teks utama, profil, ringkasan skill, dan seksi kontak.
2. `certificates.html` — Halaman khusus galeri arsip digital untuk semua sertifikat yang saya miliki.
3. `style.css` — Lembar gaya CSS utama yang mengontrol estetika dan responsivitas kedua halaman HTML.
4. `script.js` — Logika JavaScript (Vanilla JS) untuk menu hamburger, efek scroll navbar, dan modal pop-up.
5. `cms-certificates.js` — Pengambilan data sertifikat dari Google Sheets (API gviz) dan render dinamis ke dalam grid. Mendukung lazy loading gambar, fallback placeholder, serta modal transkrip on-demand. Gambar diambil dari repositori GitHub dan dioptimasi dengan jsDelivr.
6. `vercel.json` — Konfigurasi server Vercel untuk optimasi header `Cache-Control` pada aset statis.
7. `sitemap.xml` & `robots.txt` — File konfigurasi SEO untuk membantu indexing mesin pencari seperti Google.
8. `assets/` — Folder khusus tempat penyimpanan seluruh file gambar profil, topologi, dan sertifikat agar manajemen aset tetap rapi.

---

## 💻 Cara Menjalankan Proyek Secara Lokal

Kalau Anda tertarik untuk melihat atau menguji kode website ini di komputer Anda sendiri:

1. Kloning repositori ini terlebih dahulu:
   git clone https://github.com/fatahilah-mr/portofolio.git

2. Masuk ke dalam folder proyeknya:
   cd portofolio

3. Langsung klik dua kali pada file index.html untuk membukanya di browser, atau gunakan ekstensi Live Server di VS Code / Acode Anda.

---

## ✒️ Hak Cipta
© 2026 Fatahilah Miftahul Rahman. All rights reserved.
