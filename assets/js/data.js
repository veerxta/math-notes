/*
 * data.js: satu-satunya sumber navigasi Math Notes.
 * Urutan di sini = urutan di beranda, sidebar, daftar topik, dan sebelumnya/berikutnya.
 *
 * Menambah topik:
 *   1. Salin _templates/topik.html ke matkul/<slug>/NN-judul-topik.html.
 *   2. Tambahkan { file: "NN-judul-topik.html", judul: "Judul Topik" } ke `topik`.
 * Daftar topik di matkul/<slug>/index.html dibuat otomatis oleh main.js.
 * bab (opsional): tulis pada topik pertama tiap bab, mis. bab: "Bab 2 · Transformasi Linier";
 *   main.js menampilkannya sebagai label di atas topik itu.
 *
 * aksen: satu warna lembut per matkul (versi mode gelap dicerahkan otomatis di CSS).
 * ringkasan: ubah ke true setelah matkul/<slug>/ringkasan.html dibuat.
 */
window.MATH_NOTES = {
  matkul: [
    {
      slug: "aljabar-linier",
      nama: "Aljabar Linier",
      aksen: "#4C6BB5",
      ringkasan: false,
      topik: [
        { file: "01-ruang-vektor.html", judul: "Ruang Vektor", bab: "Bab 1 · Ruang Vektor" },
        { file: "02-kombinasi-linier-dan-kebebasan-linier.html", judul: "Kombinasi Linier, Rentang, dan Kebebasan Linier" },
        { file: "03-basis-dan-dimensi.html", judul: "Basis dan Dimensi" },
        { file: "04-perubahan-basis.html", judul: "Perubahan Basis" },
        { file: "05-transformasi-linier.html", judul: "Transformasi Linier, Kernel, dan Image", bab: "Bab 2 · Transformasi Linier" },
        { file: "06-representasi-matriks.html", judul: "Representasi Matriks" },
        { file: "07-koset-dan-ruang-hasil-bagi.html", judul: "Koset dan Ruang Hasil Bagi" },
        { file: "08-himpunan-dan-pemetaan-afin.html", judul: "Himpunan dan Pemetaan Afin" },
        { file: "09-isomorfisma-dan-teorema-rank.html", judul: "Isomorfisma dan Teorema Rank" },
        { file: "10-ekuivalensi-dan-similaritas.html", judul: "Ekuivalensi dan Similaritas" },
        { file: "11-jumlah-langsung-dan-proyeksi.html", judul: "Jumlah Langsung, Produk, dan Proyeksi" },
        { file: "12-aplikasi-transformasi-linier.html", judul: "Aplikasi Transformasi Linier" },
      ],
    },
    {
      slug: "kalkulus-peubah-banyak",
      nama: "Kalkulus Peubah Banyak",
      aksen: "#2A877E",
      ringkasan: false,
      topik: [],
    },
    {
      slug: "matematika-sistem",
      nama: "Matematika Sistem",
      aksen: "#8A5A9E",
      ringkasan: false,
      topik: [],
    },
    {
      slug: "metode-numerik",
      nama: "Metode Numerik",
      aksen: "#B5812A",
      ringkasan: false,
      topik: [],
    },
    {
      slug: "riset-operasi-1",
      nama: "Riset Operasi 1",
      aksen: "#BF5E3E",
      ringkasan: false,
      topik: [],
    },
    {
      slug: "teknik-simulasi",
      nama: "Teknik Simulasi",
      aksen: "#64873A",
      ringkasan: false,
      topik: [],
    },
  ],

  // Halaman lain di akar situs yang ikut tampil di kaki sidebar.
  lainnya: [
    { file: "komponen.html", judul: "Komponen" },
  ],
};
