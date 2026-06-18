
# 🌐 Lab Archive — Fatahilah Miftahul Rahman

Ini adalah kode sumber untuk **Lab Archive**, sebuah laboratorium teknis digital yang mendokumentasikan proyek lab, eksperimen, dan hasil belajar saya di bidang **IT Networking**, **System Administration**, dan **Kecerdasan Buatan (AI)**.

> **Catatan:** Proyek ini sekarang menjadi subdirektori dari repository portofolio utama saya.  
> Kode lengkap (portofolio + lab archive) dapat ditemukan di:  
> [github.com/fatahilah-mr/portofolio](https://github.com/fatahilah-mr/portofolio)

Website live dapat diakses di:  
[https://fatahilahmr.my.id/lab-archive/](https://fatahilahmr.my.id/lab-archive/)


---

## ✨ Fitur Utama

* **Data real-time dari Google Sheets** – Proyek diambil langsung dari tab `Database_App` menggunakan Fetch API. Tidak perlu mengedit kode untuk menambah/mengubah proyek.
* **Filter kategori instan** – Pengunjung dapat menyaring proyek berdasarkan teknologi (AI, Cisco, Linux, MikroTik, Windows Server, Website) tanpa reload halaman.
* **Badge warna dinamis** – Setiap kategori memiliki warna badge khas untuk memudahkan identifikasi.
* **Navbar pintar** – Sembunyi saat scroll ke bawah, muncul saat scroll ke atas (optimal untuk mobile).
* **Responsif & ramah HP** – Menu berubah menjadi hamburger dengan overlay sliding dari kanan.

---

## 🛠️ Struktur Kode (di dalam folder `lab-archive/`)

- `index.html` – Kerangka halaman, tombol filter, container grid.
- `style.css` – Gaya visual, variabel warna, layout flex/grid, animasi.
- `app.js` – Logika fetch data dari Google Sheets, filter kategori, render kartu, dan navbar auto-hide.

---

## ⚙️ Konfigurasi Google Sheets

Spreadsheet ID yang digunakan (bisa disesuaikan):
```

SPREADSHEET_ID = '1YMxR6-SlP-TT0B3y6NScT4L0YH0GXZEId_PY0Jgp8fQ'
SHEET_NAME = 'Database_App'

```

Kolom yang diharapkan di sheet:
| A (id) | B (timestamp) | C (judul) | D (kategori) | E (link_dokumentasi) | F (deskripsi) | G (link_gambar) |

Jika `link_gambar` kosong, akan ditampilkan placeholder Unsplash cadangan.

---

## 💻 Cara Menjalankan Secara Lokal

Karena lab archive sekarang bagian dari repository portofolio:

1. Clone repository portofolio utama:
   ```bash
   git clone https://github.com/fatahilah-mr/portofolio.git
   cd portofolio

2. Masuk ke folder lab-archive:
   ```bash
   cd lab-archive
   ```
3. Buka index.html dengan browser atau gunakan Live Server.

Pastikan koneksi internet aktif agar fetch API ke Google Sheets berjalan.

---

✒️ Hak Cipta

© 2026 Fatahilah Miftahul Rahman. All rights reserved.