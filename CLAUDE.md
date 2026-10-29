# Math Notes — aturan proyek

## Tentang proyek
- Website catatan belajar pribadi "Math Notes": materi beberapa mata kuliah S1 Matematika dalam satu tempat.
- Hanya dipakai saya sendiri, di MacBook Air M4 (Safari/Chrome) dan Google Pixel 5 (Chrome Android, lebar layar ±393 px).
- Bahasa konten: Bahasa Indonesia. Istilah asing ditulis dalam kurung saat pertama muncul, mis. "barisan Cauchy (Cauchy sequence)".
- Prioritas: isi akurat, nyaman dibaca lama, cepat dimuat, mudah dinavigasi di HP.

## Teknologi
- HTML + CSS + JavaScript murni. Tanpa framework dan tanpa build step.
- Matematika: KaTeX + ekstensi auto-render, disimpan lokal di `assets/vendor/katex/` (bukan CDN).
- Delimiter: `$...$` untuk inline, `$$...$$` untuk display. Makro bersama di `assets/js/katex-config.js`.
- Font disimpan lokal di `assets/fonts/` (woff2), dengan font sistem sebagai cadangan.
- Hosting: GitHub Pages dari branch `main`, folder root. Ada file `.nojekyll`.

## Struktur
- `index.html` — beranda: kartu matkul + progres.
- `matkul/<slug>/index.html` — daftar topik satu matkul.
- `matkul/<slug>/NN-judul-topik.html` — satu halaman per topik; NN = urutan dua digit.
- `matkul/<slug>/ringkasan.html` — ringkasan/cheat sheet matkul.
- `assets/css/style.css` — satu-satunya file CSS.
- `assets/js/data.js` — daftar matkul dan topik; satu-satunya sumber navigasi.
- `assets/js/main.js` — sidebar, breadcrumb, daftar isi, tema, progres, sebelumnya/berikutnya.
- `_templates/topik.html` — kerangka halaman topik; halaman baru selalu disalin dari sini.
- `komponen.html` — contoh semua komponen; perbarui bila komponen berubah.

## Navigasi dan tautan
- Daftar matkul/topik HANYA di `data.js`, sebagai variabel global (bukan JSON + fetch), supaya tetap jalan saat file dibuka langsung tanpa server.
- Setiap menambah, menghapus, atau mengganti nama halaman: perbarui `data.js` saja. Daftar topik di `matkul/<slug>/index.html` dibuat otomatis oleh `main.js`.
- Semua tautan dan path aset relatif (tanpa awalan `/`), karena situs berada di subfolder `/math-notes/`.
- Progres "Sudah dipelajari" dan pilihan tema disimpan di localStorage.

## Halaman topik
Urutan bagian (lewati yang tidak relevan):
1. Breadcrumb, judul, nama matkul.
2. Daftar isi otomatis dari subjudul.
3. Intisari: 3–5 poin yang harus dikuasai.
4. Materi: definisi → teorema/sifat → bukti → contoh.
5. Kesalahan umum.
6. Latihan soal dengan pembahasan tersembunyi.
7. Ringkasan rumus.
8. Sumber: nama file, bab, halaman.
9. Navigasi: sebelumnya · centang "Sudah dipelajari" · berikutnya.

## Komponen
- Kotak: `<div class="box definisi">`; varian lain: `teorema`, `lemma`, `proposisi`, `akibat`, `contoh`, `catatan`, `peringatan`. Judul kotak di `<div class="box-title">`.
- Warna kotak (garis kiri + latar sangat tipis): definisi biru; teorema, lemma, proposisi, akibat ungu; contoh hijau; catatan kuning; peringatan merah. Sorotan `cek` oranye. Semua warna disesuaikan untuk mode gelap.
- Penomoran otomatis per halaman dengan CSS counter (Definisi 1, Teorema 1, …). Nomor dari sumber boleh ditulis di judul, mis. "(Modul, Teorema 3.2)".
- Bukti: `<details class="bukti"><summary>Bukti</summary>…</details>`, diakhiri ∎ otomatis.
- Latihan: `<div class="latihan">` berisi soal, lalu `<details class="pembahasan"><summary>Lihat pembahasan</summary>…</details>`.
- Bagian yang perlu dicek: `<span class="cek">[CEK: alasan]</span>`.
- Jangan membuat kelas baru tanpa menambahkannya ke `style.css` dan `komponen.html`.

## Aturan konten
- Akurasi matematika nomor satu. Jangan mengarang definisi, teorema, rumus, atau kunci jawaban.
- Jika sumber tidak terbaca, terpotong, atau meragukan: tulis [CEK: …] dan laporkan. Jangan menebak.
- Tulis ulang dengan kata-kata sendiri; jangan menyalin paragraf buku/modul utuh. Definisi dan teorema boleh dirumuskan setia secara matematis.
- Pembahasan latihan: langkah demi langkah, dengan alasan tiap langkah, bukan hanya jawaban akhir.
- Soal yang kuncinya tidak ada di sumber: buat pembahasan dan beri label "Pembahasan oleh Claude — perlu dicek".
- Notasi konsisten dalam satu matkul dan mengikuti sumber utama.
- Di dalam rumus, tulis `<` sebagai `\lt` dan `>` sebagai `\gt`, agar tidak terbaca sebagai tag HTML.

## Desain
- Nuansa kertas yang tenang. Terang: latar krem lembut, teks hampir hitam. Gelap: abu sangat gelap, teks abu terang. Hindari putih murni dan hitam pekat.
- Mode gelap mengikuti pengaturan sistem dan bisa diganti manual.
- Teks: serif yang nyaman (mis. Source Serif 4), 17–18 px, line-height 1.7. Judul dan UI: sans (mis. Inter).
- Lebar teks maksimal ±70 karakter. Di HP: lebar penuh dengan margin 16 px.
- Rumus display yang panjang di-scroll horizontal di dalam kotaknya; halaman tidak boleh bergeser horizontal.
- Sidebar di layar lebar, tombol menu di HP. Area sentuh minimal 44 px.
- Tiap matkul punya satu warna aksen lembut (diatur di `data.js`), dipakai secukupnya.
- Tanpa animasi berlebihan. Ada print CSS yang rapi.
- Situs pribadi: setiap halaman memakai `<meta name="robots" content="noindex">`.

## Folder sumber/
- Berisi PDF, foto, dan catatan asli. Hanya dibaca: jangan diubah, dipindah, atau dihapus.
- `sumber/` ada di `.gitignore`. JANGAN PERNAH meng-commit isinya, termasuk potongan gambar darinya.
- Diagram yang dibutuhkan: buat ulang sebagai SVG atau HTML/CSS. Gambar lain di `assets/img/` hanya setelah saya setujui.

## Git
- Setelah satu tugas selesai dan dicek: `git add`, commit dengan pesan Bahasa Inggris yang jelas, lalu `git push` ke `origin main`.
- Contoh pesan: "Add Calculus 2: Topic 03 Partial Integrals".
- Sebelum commit: pastikan tidak ada file dari `sumber/` dan tidak ada file lebih dari 5 MB.
- Jangan force push dan jangan menulis ulang riwayat.

## Sebelum melapor selesai
- Semua halaman baru terdaftar di `data.js`, dan tidak ada tautan rusak.
- Tidak ada error KaTeX (teks merah) di halaman yang diubah.
- Tampilan dicek di lebar desktop dan ±393 px.
- Laporan singkat: apa yang dibuat, daftar [CEK], dan keputusan yang perlu saya ambil.
