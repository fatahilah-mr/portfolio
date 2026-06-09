(function() {
  // ==================================================
  // KONFIGURASI GOOGLE SHEETS (sesuaikan dengan milikmu)
  // ==================================================
  const SPREADSHEET_ID = '1GtKyr8LGv5AfSChzfP7t6_4D0rBUoC8VeRdC_Rw6eqY';
  const SHEET_NAME = 'Sheet1';
  const DATA_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

  const container = document.getElementById('cert-grid-dynamic');

  // ==================================================
  // UTILITY: ESCAPE HTML
  // ==================================================
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }

  // ==================================================
  // BUKA MODAL (menggunakan modal yang sudah ada di script.js)
  // ==================================================
  function attachModalListener(btn, imgSrc) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const modal = document.getElementById('certModal');
      const modalImg = document.getElementById('modalImg');
      if (modal && modalImg) {
        modalImg.src = imgSrc;
        modal.classList.add('show');
      }
    });
  }

  // ==================================================
  // RENDER SERTIFIKAT KE DALAM GRID
  // ==================================================
  function renderCertificates(certificates) {
    if (!certificates.length) {
      container.innerHTML = `<div class="loading-status" style="grid-column:1/-1; text-align:center;">📭 Belum ada sertifikat. Silakan tambahkan data di Google Sheets.</div>`;
      return;
    }

    container.innerHTML = '';
    certificates.forEach(cert => {
      // Tentukan kelas tambahan untuk tipe vertical
      const additionalClass = cert.tipe === 'vertical' ? 'pkl-vertical' : '';
      const card = document.createElement('div');
      card.className = `cert-card ${additionalClass}`;

      // Siapkan gambar dengan fallback
      const imgHtml = `<img src="${cert.imgDepan}" alt="${escapeHtml(cert.nama)}" loading="lazy" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">`;
      const fallbackDiv = `<div class="cert-img-fallback" style="display:none; align-items:center; justify-content:center; width:100%; height:100%; background:#e2e8f0; color:#475569; font-size:0.8rem;">📄 ${escapeHtml(cert.nama)}</div>`;

      // Tombol transkrip jika ada
      let buttonHtml = '';
      if (cert.tombolAda && cert.imgBelakang) {
        buttonHtml = `<button class="btn-transkrip" data-fullimg="${cert.imgBelakang}">📄 Lihat Transkrip</button>`;
      }

      // Gabungan penerbit & tahun
      let metaText = '';
      if (cert.penerbit && cert.tahun) {
        metaText = `${escapeHtml(cert.penerbit)} • ${escapeHtml(cert.tahun)}`;
      } else if (cert.penerbit) {
        metaText = escapeHtml(cert.penerbit);
      } else if (cert.tahun) {
        metaText = escapeHtml(cert.tahun);
      }

      card.innerHTML = `
        <div class="cert-img-wrap" style="position:relative;">
          ${imgHtml}
          ${fallbackDiv}
        </div>
        <div class="cert-info">
          <div class="cert-name">${escapeHtml(cert.nama)}</div>
          ${metaText ? `<div class="cert-meta">${metaText}</div>` : ''}
          ${buttonHtml}
        </div>
      `;

      // Pasang event listener untuk tombol transkrip
      const btn = card.querySelector('.btn-transkrip');
      if (btn && cert.imgBelakang) {
        attachModalListener(btn, cert.imgBelakang);
      }

      container.appendChild(card);
    });
  }

  // ==================================================
  // FETCH DATA DARI GOOGLE SHEETS
  // ==================================================
  async function fetchCertificates() {
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error('Gagal mengakses spreadsheet');
      const rawText = await response.text();
      const jsonString = rawText.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/)[1];
      const data = JSON.parse(jsonString);
      const rows = data.table.rows;

      // Mapping kolom sesuai urutan di sheet:
      // A(0) id, B(1) timestamp, C(2) nama, D(3) penerbit, E(4) tahun,
      // F(5) tipe (horizontal/vertical), G(6) tombol_transkrip (ada/tidak),
      // H(7) url_gambar_depan, I(8) url_gambar_belakang
      const certificatesData = rows.map(row => {
        return {
          id: row.c[0] ? String(row.c[0].v) : '',
          timestamp: row.c[1] ? String(row.c[1].v) : '',
          nama: row.c[2] ? String(row.c[2].v) : 'Sertifikat',
          penerbit: row.c[3] ? String(row.c[3].v) : '',
          tahun: row.c[4] ? String(row.c[4].v) : '',
          tipe: row.c[5] ? String(row.c[5].v).toLowerCase() : 'horizontal',
          tombolAda: (row.c[6] ? String(row.c[6].v) : '') === 'ada',
          imgDepan: row.c[7] ? String(row.c[7].v) : '',
          imgBelakang: row.c[8] ? String(row.c[8].v) : ''
        };
      }).filter(cert => cert.imgDepan !== ''); // Hanya yang punya gambar depan

      renderCertificates(certificatesData);
    } catch (err) {
      console.error(err);
      container.innerHTML = `<div class="loading-status" style="grid-column:1/-1; text-align:center; color:#B22222;">❌ Gagal memuat data. Pastikan sheet sudah dipublikasikan ke web (File → Share → Publish to web).</div>`;
    }
  }

  // Jalankan saat DOM siap
  document.addEventListener('DOMContentLoaded', fetchCertificates);
})();