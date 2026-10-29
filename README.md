# Math Notes

Catatan belajar pribadi untuk mata kuliah S1 Matematika. Dibuat dengan HTML, CSS, dan JavaScript murni, tanpa framework dan tanpa build step. Rumus dirender dengan KaTeX.

Situs: https://veerxta.github.io/math-notes/

## Struktur

- `index.html`: beranda, berisi kartu matkul dan progres.
- `matkul/<slug>/index.html`: daftar topik satu matkul, dibuat otomatis dari `data.js`.
- `matkul/<slug>/NN-judul-topik.html`: satu halaman per topik.
- `komponen.html`: contoh semua komponen beserta kodenya.
- `_templates/topik.html`: kerangka halaman topik.
- `assets/css/style.css`: satu-satunya file CSS.
- `assets/js/data.js`: daftar matkul dan topik, satu-satunya sumber navigasi.
- `assets/js/main.js`: sidebar, breadcrumb, daftar isi, tema, progres, sebelumnya/berikutnya.
- `assets/js/katex-config.js`: delimiter dan makro KaTeX.

## Menambah topik

1. Salin `_templates/topik.html` ke `matkul/<slug>/NN-judul-topik.html`.
2. Isi kontennya. Semua komponen ada di `komponen.html`.
3. Tambahkan `{ file: "NN-judul-topik.html", judul: "Judul Topik" }` ke daftar `topik` matkul itu di `assets/js/data.js`.

## Menjalankan lokal

Buka `index.html` langsung di browser, atau jalankan server statis dari folder ini:

```bash
python3 -m http.server 8000
```

lalu buka http://localhost:8000/.

## Pihak ketiga

- [KaTeX](https://katex.org) 0.19.1, lisensi MIT: `assets/vendor/katex/` (hanya font woff2).
- [Source Serif 4](https://github.com/adobe-fonts/source-serif) dan [Inter](https://rsms.me/inter/), lisensi SIL Open Font License 1.1, via Fontsource: `assets/fonts/`.
