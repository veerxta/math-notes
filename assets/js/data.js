/*
 * data.js: satu-satunya sumber navigasi Math Notes.
 * Urutan di sini = urutan di beranda, sidebar, daftar topik, dan sebelumnya/berikutnya.
 *
 * Menambah topik:
 *   1. Salin _templates/topik.html ke matkul/<slug>/NN-judul-topik.html.
 *   2. Tambahkan { file: "NN-judul-topik.html", judul: "Judul Topik" } ke `topik`.
 * Daftar topik di matkul/<slug>/index.html dibuat otomatis oleh main.js.
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
        { file: "01-ruang-vektor.html", judul: "Ruang Vektor" },
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
